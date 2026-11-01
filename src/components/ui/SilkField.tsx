import React, { useEffect, useRef } from 'react';

/**
 * Ribbons of light: bands of fine lines that fold and turn as they flow across
 * the dark, catching the light hardest where they twist edge-on.
 *
 * Three depths, as through a camera lens: a faint ribbon far back, a sharp one
 * in the middle, and a large soft one close to the lens. On first view they
 * unfurl from the left, led by a point of light.
 *
 * Drawn by one fragment shader on the graphics card (plain WebGL, no library).
 * It stops when it is off screen or the tab is hidden, draws one still frame
 * for visitors who ask for reduced motion, and falls back to a soft CSS glow
 * where WebGL is not available.
 */

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uReveal;

#define PI 3.14159265

const vec3 EMBER = vec3(0.32, 0.05, 0.0);
const vec3 ORANGE = vec3(1.0, 0.33, 0.07);
const vec3 HOT = vec3(1.0, 0.62, 0.30);
const vec3 WHITE = vec3(1.0, 0.96, 0.90);

// One ribbon of fine threads. soft = 0 is in focus; soft = 1 is far out of
// focus, as if very close to the lens.
vec3 ribbon(vec2 p, float t, float yBase, float amp, float freq, float speed,
            float thick, float lines, float phase, float alpha, float soft) {
  float x = p.x;
  float center = yBase
    + amp * sin(x * freq + t * speed + phase)
    + amp * 0.42 * sin(x * freq * 2.07 - t * speed * 0.73 + phase * 1.7);
  // Signed width: when it passes through zero the band turns over.
  float w = thick * sin(x * freq * 0.62 + t * speed * 0.55 + phase * 0.5 + 1.2);
  float aw = abs(w) + 0.0016;
  float s = (p.y - center) / aw;
  float inside = 1.0 - smoothstep(0.44 - soft * 0.38, 0.5 + soft * 0.3, abs(s));

  // Fine threads; an even sheen where they would be too close to draw, and
  // none at all when out of focus.
  float spacingPx = aw * uRes.y / lines;
  float threads = pow(0.5 + 0.5 * cos(2.0 * PI * lines * s), 7.0);
  float pattern = mix(0.16, threads, smoothstep(1.4, 3.6, spacingPx));
  pattern = mix(pattern, 0.3, soft);

  // Light gathers where the band turns edge-on, and along its two edges.
  float twist = 1.0 / (1.0 + aw * 16.0);
  float edge = smoothstep(0.32, 0.5, abs(s)) * (1.0 - soft);
  float front = step(0.0, w);

  // Deep orange on the face, hot amber where it turns, white only at the very heart.
  vec3 col = mix(EMBER, ORANGE, 0.3 + 0.7 * front);
  col = mix(col, HOT, clamp(twist * twist * 1.5, 0.0, 1.0));
  col = mix(col, WHITE, clamp(pow(twist, 3.0) * 1.6, 0.0, 1.0));
  float body = inside * (pattern * (0.5 + 1.7 * twist) + edge * 0.32);

  // Bloom: light spilling into the dark, strongest at the twists.
  float d = max(abs(p.y - center) - aw * 0.5, 0.0);
  float bloom = exp(-d * (13.0 - soft * 8.0)) * (0.04 + 0.42 * twist * twist);
  vec3 bloomCol = mix(ORANGE, HOT, twist);

  return (col * body + bloomCol * bloom) * alpha;
}

float hash(vec2 q) { return fract(sin(dot(q, vec2(12.9898, 78.233))) * 43758.5453); }

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);

  // The ribbons rise gently from left to right.
  float a = 0.24;
  mat2 rot = mat2(cos(a), -sin(a), sin(a), cos(a));
  float t = uTime;

  // Three depths, each moving against the cursor by its distance.
  vec2 qFar = rot * (p + uMouse * vec2(0.02, 0.014));
  vec2 qMid = rot * (p + uMouse * vec2(0.05, 0.035));
  vec2 qNear = rot * (p + uMouse * vec2(0.11, 0.08));

  vec3 far = ribbon(qFar, t * 0.8, 0.12, 0.05, 1.7, 0.14, 0.06, 36.0, 4.1, 0.30, 0.0);
  vec3 mid = ribbon(qMid, t, -0.08, 0.085, 1.45, 0.20, 0.20, 72.0, 0.0, 1.0, 0.0);
  // Near the lens: larger, lower, and soft.
  vec3 near = ribbon(qNear * 0.55 + vec2(-0.06, 0.17), t * 1.1, -0.24, 0.08, 1.25, 0.22, 0.26, 26.0, 2.3, 0.85, 1.0);

  // ---- The opening: the ribbons unfurl from the left, led by a point of light.
  float ease = 1.0 - pow(1.0 - clamp(uReveal, 0.0, 1.0), 3.0);
  float span = aspect * 0.62 + 0.4;
  float frontX = mix(-span, span, ease);
  float shown = smoothstep(frontX + 0.015, frontX - 0.26, qMid.x);
  float tip = exp(-abs(qMid.x - frontX) * 11.0) * (1.0 - ease);

  vec3 col = (far + mid + near) * shown;
  col += (mid + far) * tip * 3.0;

  // Fall away to black at the edges of the frame.
  float vig = smoothstep(1.35, 0.25, length(p * vec2(0.62, 1.05)));
  col *= vig;

  // Tone curve: the brightest twists bloom rather than clip, and black stays black.
  col = 1.0 - exp(-col * 1.7);
  col += (hash(gl_FragCoord.xy + fract(t) * 97.0) - 0.5) * 0.016;

  gl_FragColor = vec4(max(col, 0.0), 1.0);
}
`;

const compile = (gl: WebGLRenderingContext, type: number, src: string) => {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn('SilkField shader:', gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
};

export const SilkField: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: 'high-performance' });
    const vs = gl && compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = gl && compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!gl || !vs || !fs) {
      if (fallbackRef.current) fallbackRef.current.style.opacity = '1';
      return;
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      if (fallbackRef.current) fallbackRef.current.style.opacity = '1';
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uMouse = gl.getUniformLocation(prog, 'uMouse');
    const uReveal = gl.getUniformLocation(prog, 'uReveal');

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Start part-way through the motion, so the first frame already has a twist in view.
    let time = 9;
    let last = 0;
    /** 0 to 1 over the opening unfurl; already 1 for reduced motion. */
    let reveal = reduce ? 1 : 0;
    const REVEAL_S = 1.6;
    let raf = 0;
    let running = false;
    let visible = false;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    const size = () => {
      const r = host.getBoundingClientRect();
      // The ribbon is soft; it does not need every device pixel.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
      canvas.style.width = `${r.width}px`;
      canvas.style.height = `${r.height}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    const draw = () => {
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      gl.uniform1f(uTime, time);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uReveal, reveal);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const frame = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      time += dt;
      if (reveal < 1) reveal = Math.min(1, reveal + dt / REVEAL_S);
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
      mouse.tx = e.clientX / window.innerWidth - 0.5;
      mouse.ty = -(e.clientY / window.innerHeight - 0.5);
    };

    size();
    draw();
    canvas.style.opacity = '1';

    const ro = new ResizeObserver(() => {
      size();
      draw();
    });
    ro.observe(host);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(host);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('pointermove', onPointer, { passive: true });

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pointermove', onPointer);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <div aria-hidden="true" className={`pointer-events-none ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 block opacity-0 transition-opacity duration-[1600ms] ease-out" />
      {/* Shown only if WebGL is unavailable */}
      <div
        ref={fallbackRef}
        className="absolute inset-0 opacity-0 bg-[radial-gradient(ellipse_70%_35%_at_60%_62%,rgba(255,99,33,0.35),transparent_70%)]"
      />
    </div>
  );
};
