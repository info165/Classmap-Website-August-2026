import React, { useEffect, useRef } from 'react';

/**
 * The learning map: a quiet network of points that drifts behind the page and
 * notices the cursor.
 *
 * Everything is drawn on one canvas, with no 3D library. Points sit at
 * different depths, so near ones are larger, brighter and faster, and the whole
 * field shifts a little against the pointer. Lines join points that are close.
 * Every so often a pulse of light is released from a point and travels along
 * the lines, hopping from one point to the next, the way a thought moves.
 *
 * It costs nothing when it cannot be seen: the loop stops when the canvas
 * leaves the screen or the tab is hidden, and visitors who ask for reduced
 * motion get a single still frame.
 */

interface MapNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Depth, 0.35 (far) to 1 (near). Drives size, brightness and speed. */
  z: number;
  r: number;
  hub: boolean;
  /** Pointer proximity, smoothed. */
  e: number;
  /** A brief flare, set when a pulse arrives. */
  flare: number;
  rx: number;
  ry: number;
}

interface Pulse {
  a: number;
  b: number;
  t: number;
  hops: number;
}

interface LearningMapProps {
  className?: string;
  /** Overall strength, 0 to 1. Lower it where text sits over the map. */
  dim?: number;
  /** Multiplies the number of points. */
  density?: number;
}

/** A soft glow, drawn once and stamped for every point. */
const makeSprite = (rgb: string) => {
  const s = 96;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grad.addColorStop(0, `rgba(${rgb},1)`);
  grad.addColorStop(0.18, `rgba(${rgb},0.6)`);
  grad.addColorStop(0.5, `rgba(${rgb},0.14)`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, s, s);
  return c;
};

export const LearningMap: React.FC<LearningMapProps> = ({ className = '', dim = 1, density = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !host || !ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const orange = makeSprite('255,130,66');
    const warm = makeSprite('255,228,208');

    let w = 0;
    let h = 0;
    let linkDist = 150;
    let nodes: MapNode[] = [];
    let pulses: Pulse[] = [];
    let raf = 0;
    let running = false;
    let visible = false;
    let last = 0;
    let time = 0;
    let spawnIn = 0.6;

    // Pointer, in canvas space, eased so it never jumps.
    const ptr = { x: -9999, y: -9999, sx: -9999, sy: -9999, on: false };

    const build = () => {
      const rect = host.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      if (w < 2 || h < 2) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      linkDist = Math.max(120, Math.min(210, Math.min(w, h) * 0.26));

      // A jittered grid: even coverage, no clumps, no obvious pattern.
      const target = Math.max(30, Math.min(130, Math.round(((w * h) / 12500) * density)));
      const cols = Math.max(3, Math.round(Math.sqrt((target * w) / h)));
      const rows = Math.max(3, Math.ceil(target / cols));
      const cw = w / cols;
      const ch = h / rows;
      nodes = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const z = 0.35 + 0.65 * Math.pow(Math.random(), 1.4);
          const hub = Math.random() < 0.12;
          const ang = Math.random() * Math.PI * 2;
          const sp = (3 + Math.random() * 7) * z;
          nodes.push({
            x: (c + 0.12 + Math.random() * 0.76) * cw,
            y: (r + 0.12 + Math.random() * 0.76) * ch,
            vx: Math.cos(ang) * sp,
            vy: Math.sin(ang) * sp,
            z,
            r: (1.2 + 1.7 * z) * (hub ? 1.6 : 1),
            hub,
            e: 0,
            flare: 0,
            rx: 0,
            ry: 0
          });
        }
      }
      pulses = [];
    };

    const neighbours = (i: number) => {
      const out: number[] = [];
      const a = nodes[i];
      for (let j = 0; j < nodes.length; j++) {
        if (j === i) continue;
        const dx = nodes[j].rx - a.rx;
        const dy = nodes[j].ry - a.ry;
        if (dx * dx + dy * dy < linkDist * linkDist) out.push(j);
      }
      return out;
    };

    const spawn = () => {
      // Prefer hubs as the source: they read as the origin of an idea.
      const hubs = nodes.map((n, i) => (n.hub ? i : -1)).filter((i) => i >= 0);
      const from = hubs.length && Math.random() < 0.7 ? hubs[(Math.random() * hubs.length) | 0] : (Math.random() * nodes.length) | 0;
      const nb = neighbours(from);
      if (!nb.length) return;
      pulses.push({ a: from, b: nb[(Math.random() * nb.length) | 0], t: 0, hops: 2 + ((Math.random() * 3) | 0) });
      nodes[from].flare = Math.max(nodes[from].flare, 0.8);
    };

    const step = (dt: number) => {
      time += dt;
      const R = Math.max(200, Math.min(320, w * 0.22));

      // Ease the pointer toward where it is.
      const k = Math.min(1, dt * 9);
      ptr.sx += (ptr.x - ptr.sx) * k;
      ptr.sy += (ptr.y - ptr.sy) * k;
      const px = ptr.on ? ptr.sx / w - 0.5 : 0;
      const py = ptr.on ? ptr.sy / h - 0.5 : 0;

      for (const n of nodes) {
        n.x += n.vx * dt;
        n.y += n.vy * dt;
        if (n.x < -30 || n.x > w + 30) n.vx *= -1;
        if (n.y < -30 || n.y > h + 30) n.vy *= -1;

        // Depth parallax against the pointer.
        n.rx = n.x - px * 26 * n.z;
        n.ry = n.y - py * 18 * n.z;

        let target = 0;
        if (ptr.on) {
          const dx = n.rx - ptr.sx;
          const dy = n.ry - ptr.sy;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < R) target = Math.pow(1 - d / R, 1.6);
        }
        n.e += (target - n.e) * Math.min(1, dt * 7);
        n.flare = Math.max(0, n.flare - dt * 1.5);
      }

      // Release a new pulse now and then.
      spawnIn -= dt;
      if (spawnIn <= 0 && pulses.length < 6) {
        spawn();
        spawnIn = 0.8 + Math.random() * 1.4;
      }

      // Carry pulses along their lines; at the end, hand on to a neighbour.
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        const a = nodes[p.a];
        const b = nodes[p.b];
        const len = Math.hypot(b.rx - a.rx, b.ry - a.ry) || 1;
        p.t += (dt * 190) / len;
        if (p.t >= 1) {
          b.flare = 1;
          if (p.hops > 0) {
            const nb = neighbours(p.b).filter((j) => j !== p.a);
            if (nb.length) {
              pulses.push({ a: p.b, b: nb[(Math.random() * nb.length) | 0], t: 0, hops: p.hops - 1 });
            }
          }
          pulses.splice(i, 1);
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';

      // Lines: faint at rest, brighter wherever the pointer is near.
      const L2 = linkDist * linkDist;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = b.rx - a.rx;
          const dy = b.ry - a.ry;
          const d2 = dx * dx + dy * dy;
          if (d2 > L2) continue;
          const f = 1 - Math.sqrt(d2) / linkDist;
          const e = (a.e + b.e) / 2;
          const alpha = (Math.pow(f, 1.3) * 0.34 + e * 0.7 * f + (a.flare + b.flare) * 0.16 * f) * dim;
          if (alpha < 0.012) continue;
          ctx.strokeStyle = `rgba(255,${150 + ((e * 60) | 0)},${96 + ((e * 70) | 0)},${Math.min(0.9, alpha)})`;
          ctx.lineWidth = 0.7 + e * 1.1;
          ctx.beginPath();
          ctx.moveTo(a.rx, a.ry);
          ctx.lineTo(b.rx, b.ry);
          ctx.stroke();
        }
      }

      // Pulses: a short bright trail with a glowing head.
      for (const p of pulses) {
        const a = nodes[p.a];
        const b = nodes[p.b];
        const hx = a.rx + (b.rx - a.rx) * p.t;
        const hy = a.ry + (b.ry - a.ry) * p.t;
        const t0 = Math.max(0, p.t - 0.22);
        const tx = a.rx + (b.rx - a.rx) * t0;
        const ty = a.ry + (b.ry - a.ry) * t0;
        const g = ctx.createLinearGradient(tx, ty, hx, hy);
        g.addColorStop(0, 'rgba(255,170,120,0)');
        g.addColorStop(1, `rgba(255,214,184,${0.95 * dim})`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(hx, hy);
        ctx.stroke();
        ctx.globalAlpha = Math.min(1, 0.9 * dim);
        ctx.drawImage(warm, hx - 11, hy - 11, 22, 22);
        ctx.globalAlpha = 1;
      }

      // Points.
      for (const n of nodes) {
        const lift = 1 + n.e * 1.1 + n.flare * 1.6;
        const glow = n.r * 9.5 * (0.55 + 0.45 * n.z) * lift;
        const a = Math.min(1, (0.3 + 0.5 * n.z + n.e * 0.5 + n.flare * 0.6) * dim);
        ctx.globalAlpha = a;
        ctx.drawImage(orange, n.rx - glow, n.ry - glow, glow * 2, glow * 2);
        ctx.globalAlpha = Math.min(1, (0.55 + 0.45 * n.z + n.e * 0.4 + n.flare * 0.5) * dim);
        ctx.fillStyle = 'rgb(255,238,226)';
        ctx.beginPath();
        ctx.arc(n.rx, n.ry, n.r * (0.85 + n.e * 0.6 + n.flare * 0.7), 0, Math.PI * 2);
        ctx.fill();
        if (n.hub) {
          ctx.globalAlpha = Math.min(1, (0.2 + n.e * 0.5 + n.flare * 0.6) * dim);
          ctx.strokeStyle = 'rgba(255,170,120,1)';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(n.rx, n.ry, n.r * 3.1 * (1 + n.flare * 0.5), 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    };

    const frame = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      step(dt);
      draw();
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || reduce || !visible || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const r = host.getBoundingClientRect();
      ptr.x = e.clientX - r.left;
      ptr.y = e.clientY - r.top;
      if (!ptr.on) {
        ptr.sx = ptr.x;
        ptr.sy = ptr.y;
      }
      ptr.on = ptr.y > -120 && ptr.y < r.height + 120;
    };
    const onLeave = () => {
      ptr.on = false;
    };

    build();
    // Warm the field up so the first frame already has pulses in flight.
    for (let i = 0; i < 40; i++) step(0.05);
    draw();
    canvas.style.opacity = '1';

    const ro = new ResizeObserver(() => {
      build();
      if (reduce) {
        step(0);
        draw();
      }
    });
    ro.observe(host);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0 }
    );
    io.observe(host);

    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [dim, density]);

  return (
    <div aria-hidden="true" className={`pointer-events-none ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 block opacity-0 transition-opacity duration-[1800ms] ease-out" />
    </div>
  );
};
