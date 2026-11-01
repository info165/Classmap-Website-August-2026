import React, { useLayoutEffect, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { BatteryFull, FileBarChart2, Signal, Wifi } from 'lucide-react';
import { EASE } from '../ui/primitives';
import { SCENES } from './PhoneScenes';

/**
 * The phone itself: titanium edge, island, status bar, story bar, and the
 * screen for the current step. It holds no step state of its own; the section
 * around it decides which step is showing and how it moves on.
 *
 * The whole device is drawn at one fixed design size and scaled as a single
 * piece to whatever width it is given. That is what keeps the screens whole:
 * a small phone is the same phone, smaller, so nothing inside it can be pushed
 * off the glass or cut at the edges.
 */
export const LOOP_LABELS = ['Topic', 'Test', 'Weak topics', 'Videos', 'Adaptive test', 'Report'];

/** Design size, in CSS pixels before scaling. */
const DW = 340;
const RIM = 2; // titanium
const GROOVE = 1.5; // the dark line between metal and glass
const BEZEL = 9;
const EDGE = RIM + GROOVE + BEZEL;
const SCREEN_W = DW - EDGE * 2;
const SCREEN_H = Math.round(SCREEN_W * (16.6 / 9));
const DH = SCREEN_H + EDGE * 2;

interface PhoneDeviceProps {
  active: number;
  /** 1 moving forward, -1 going back: the side a screen enters from. */
  dir: number;
  /** Increments on every full round, so the first screen replays fresh. */
  loops: number;
  /** When set, the active story segment fills over this many ms (autoplay). */
  holdMs?: number;
  paused?: boolean;
  onUse: () => void;
  onNext: () => void;
  onSwipe: (by: 1 | -1) => void;
  /** Sets the rendered width; the height follows. */
  className?: string;
}

export const PhoneDevice: React.FC<PhoneDeviceProps> = ({ active, dir, loops, holdMs, paused, onUse, onNext, onSwipe, className = '' }) => {
  const reduce = useReducedMotion();
  const [island, setIsland] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [k, setK] = useState(1);
  const outerRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const rippleId = useRef(0);
  const n = LOOP_LABELS.length;
  const timed = !!holdMs && !paused && !reduce;

  // Scale the design to the width the layout gives us.
  useLayoutEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const fit = () => setK(el.clientWidth / DW || 1);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // The island opens with the step's name each time the screen changes.
  useEffect(() => {
    setIsland(true);
    const t = setTimeout(() => setIsland(false), 1700);
    return () => clearTimeout(t);
  }, [active, loops]);

  /** Pointer position on the glass, in design pixels. */
  const local = (e: React.PointerEvent) => {
    const r = screenRef.current?.getBoundingClientRect();
    if (!r) return null;
    return { x: (e.clientX - r.left) / k, y: (e.clientY - r.top) / k };
  };

  const onScreenDown = (e: React.PointerEvent) => {
    const p = local(e);
    if (!p) return;
    const id = ++rippleId.current;
    setRipples((v) => [...v, { id, ...p }]);
    setTimeout(() => setRipples((v) => v.filter((q) => q.id !== id)), 700);
  };

  const onScreenMove = (e: React.PointerEvent) => {
    const p = local(e);
    if (!p || !screenRef.current) return;
    screenRef.current.style.setProperty('--gx', `${p.x}px`);
    screenRef.current.style.setProperty('--gy', `${p.y}px`);
  };

  const Scene = SCENES[active];

  return (
    <div ref={outerRef} className={`relative ${className}`} style={{ aspectRatio: `${DW} / ${DH}` }}>
      <div className="absolute left-0 top-0 origin-top-left" style={{ width: DW, height: DH, transform: `scale(${k})` }}>
        {/* Side buttons, in the metal */}
        <span aria-hidden="true" className="absolute -left-[2.5px] top-[106px] h-[26px] w-[3px] rounded-l-[2px] bg-gradient-to-b from-[#9aa0ab] to-[#4b4f58]" />
        <span aria-hidden="true" className="absolute -left-[2.5px] top-[152px] h-[46px] w-[3px] rounded-l-[2px] bg-gradient-to-b from-[#9aa0ab] to-[#4b4f58]" />
        <span aria-hidden="true" className="absolute -left-[2.5px] top-[208px] h-[46px] w-[3px] rounded-l-[2px] bg-gradient-to-b from-[#9aa0ab] to-[#4b4f58]" />
        <span aria-hidden="true" className="absolute -right-[2.5px] top-[170px] h-[74px] w-[3px] rounded-r-[2px] bg-gradient-to-b from-[#9aa0ab] to-[#4b4f58]" />

        {/* Titanium: a brushed gradient, lit along its top edge */}
        <div
          className="relative h-full w-full rounded-[58px] shadow-[0_0_0_0.5px_rgba(255,255,255,0.25),0_80px_120px_-40px_rgba(0,0,0,0.95),0_40px_80px_-40px_rgba(255,99,33,0.35)]"
          style={{
            padding: RIM,
            background: 'linear-gradient(145deg,#c9ced6 0%,#6d727c 18%,#2c2f36 42%,#3a3e46 60%,#8d929c 82%,#d5d9e0 100%)'
          }}
        >
          <div className="h-full w-full rounded-[56px] bg-[#101114]" style={{ padding: GROOVE }}>
            <div className="h-full w-full rounded-[54.5px] bg-black" style={{ padding: BEZEL }}>
              <div
                ref={screenRef}
                onPointerDown={onScreenDown}
                onPointerMove={onScreenMove}
                className="relative touch-pan-y overflow-hidden rounded-[46px] bg-[#0A0B10]"
                style={{ width: SCREEN_W, height: SCREEN_H }}
              >
                {/* Wallpaper light */}
                <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_100%_45%_at_50%_0%,rgba(255,99,33,0.2),transparent),radial-gradient(ellipse_90%_35%_at_50%_100%,rgba(255,99,33,0.09),transparent)]" />

                {/* Dynamic island */}
                <motion.div
                  aria-hidden="true"
                  initial={false}
                  animate={{ width: island ? 196 : 92 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                  className="absolute left-1/2 top-[11px] z-30 flex h-[28px] -translate-x-1/2 items-center justify-center overflow-hidden rounded-full bg-black shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
                >
                  <AnimatePresence>
                    {island && (
                      <motion.span
                        key="isl"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2, delay: 0.08 }}
                        className="flex items-center gap-2 whitespace-nowrap text-[10.5px] font-semibold text-white"
                      >
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-[#FF6321]/80" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#FF6321]" />
                        </span>
                        Step {active + 1} · {LOOP_LABELS[active]}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Status bar */}
                <div aria-hidden="true" className="absolute inset-x-7 top-[15px] z-20 flex items-center justify-between text-[11.5px] font-semibold text-white">
                  <span className="tabular-nums">9:41</span>
                  <span className="flex items-center gap-1">
                    <Signal className="h-3 w-3" />
                    <Wifi className="h-3 w-3" />
                    <BatteryFull className="h-3.5 w-3.5" />
                  </span>
                </div>

                {/* Story bar: the six steps of the loop */}
                <div className="absolute inset-x-5 top-[54px] z-20 flex gap-1">
                  {LOOP_LABELS.map((label, i) => (
                    <span key={label} className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/15">
                      <motion.span
                        key={`${i}-${i === active ? `${active}-${paused}-${loops}` : 'x'}`}
                        className="absolute inset-0 origin-left rounded-full bg-white"
                        initial={{ scaleX: i < active ? 1 : i === active && timed ? 0 : i === active ? 1 : 0 }}
                        animate={{ scaleX: i <= active ? 1 : 0 }}
                        transition={{ duration: i === active && timed ? holdMs! / 1000 : 0.3, ease: i === active && timed ? 'linear' : EASE }}
                      />
                    </span>
                  ))}
                </div>

                {/* App bar */}
                <div className="absolute inset-x-5 top-[68px] z-20 flex items-center justify-between">
                  <span className="text-[13.5px] font-semibold tracking-[-0.02em] text-[#FF6321]">ClassMap</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-stone-400">
                    Step {active + 1} of {n}
                  </span>
                </div>

                {/* Screens push in from the side you are moving towards. The
                    padding inside the clip leaves room for focus rings and
                    shadows, so nothing is cut at the edges. */}
                <motion.div
                  className="absolute inset-x-2.5 bottom-6 top-[94px] overflow-hidden"
                  onPanEnd={(_, info) => {
                    if (Math.abs(info.offset.x) > 46 && Math.abs(info.offset.x) > Math.abs(info.offset.y)) onSwipe(info.offset.x < 0 ? 1 : -1);
                  }}
                >
                  <AnimatePresence initial={false} custom={dir}>
                    <motion.div
                      key={`${active}-${loops}`}
                      custom={dir}
                      variants={{
                        enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 1 }),
                        center: { x: 0, opacity: 1 },
                        exit: (d: number) => ({ x: d > 0 ? '-30%' : '30%', opacity: 0 })
                      }}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 340, damping: 36, mass: 0.9 }}
                      className="absolute inset-0 flex items-center justify-center px-2 py-2"
                    >
                      <Scene onUse={onUse} onNext={onNext} />
                    </motion.div>
                  </AnimatePresence>
                </motion.div>

                {/* Where a finger lands */}
                {ripples.map((r) => (
                  <motion.span
                    key={r.id}
                    aria-hidden="true"
                    initial={{ scale: 0.2, opacity: 0.55 }}
                    animate={{ scale: 1.6, opacity: 0 }}
                    transition={{ duration: 0.65, ease: EASE }}
                    className="pointer-events-none absolute z-[45] -ml-8 -mt-8 h-16 w-16 rounded-full border border-white/70 bg-white/20"
                    style={{ left: r.x, top: r.y }}
                  />
                ))}

                {/* The report is ready */}
                <AnimatePresence>
                  {active === n - 1 && (
                    <motion.div
                      key="notif"
                      initial={{ y: -90, opacity: 0, scale: 0.94 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      exit={{ y: -90, opacity: 0 }}
                      transition={{ delay: 0.4, type: 'spring', stiffness: 300, damping: 24 }}
                      className="pointer-events-none absolute inset-x-3 top-[48px] z-40 flex items-center gap-3 rounded-2xl bg-[#1A1D26]/95 px-3.5 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_20px_40px_-10px_rgba(0,0,0,0.8)] backdrop-blur-xl"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FF6321] text-white">
                        <FileBarChart2 className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 leading-tight">
                        <span className="block text-[11px] font-semibold text-white">ClassMap</span>
                        <span className="block truncate text-[11px] text-stone-300">Your analysis report is ready</span>
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Home indicator */}
                <span aria-hidden="true" className="absolute bottom-2 left-1/2 z-30 h-[5px] w-[118px] -translate-x-1/2 rounded-full bg-white/50" />

                {/* Glass: light under the cursor, a fixed reflection, and a slow
                    sheen that crosses now and then */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-50 bg-[radial-gradient(240px_circle_at_var(--gx,30%)_var(--gy,12%),rgba(255,255,255,0.12),transparent_62%),linear-gradient(118deg,rgba(255,255,255,0.08),transparent_30%,transparent_72%,rgba(255,255,255,0.03))]" />
                {!reduce && (
                  <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-50 w-1/2 animate-sheen bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
