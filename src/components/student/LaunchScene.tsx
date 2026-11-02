import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { ArrowDown, Calculator, CalendarDays, Camera, Cloud, FileText, Folder, Heart, Image as ImageIcon, Lightbulb, Mail, Map as MapIcon, MessageCircle, Music, Phone, Settings, Wallet, BookOpen, Compass, Clock } from 'lucide-react';
import { EASE } from '../ui/primitives';
import { SCREEN_H, SCREEN_W } from './phoneMetrics';
import markImg from '../../assets/images/logo-mark-new.png';

/**
 * Opening the app, as the first thing the phone does.
 *
 * A home screen of icons settles in; a finger reaches for the ClassMap icon and
 * taps it; the icon opens up to fill the whole screen, the way an app opens on
 * a real phone; and a ClassMap launch screen glows, then hands over to the
 * first screen of the app. The other icons are plain stand-ins, not real apps.
 *
 * It plays once each time it appears. It waits until the phone is on screen,
 * and a tap on the icon (or the launch screen) skips ahead.
 */

type Phase = 'home' | 'reach' | 'tap' | 'open' | 'ready';

/** Milliseconds after the sequence starts. */
const AT = { reach: 900, tap: 1650, open: 2050, ready: 4300 };

const ICON = 54;
const PAD_X = 22;
const PITCH_X = (SCREEN_W - PAD_X * 2) / 4;
const GRID_TOP = 84;
const PITCH_Y = 88;

const GRID: ({ label: string; Icon: React.ElementType } | 'app')[] = [
  { label: 'Photos', Icon: ImageIcon },
  { label: 'Calendar', Icon: CalendarDays },
  { label: 'Clock', Icon: Clock },
  { label: 'Maps', Icon: MapIcon },
  { label: 'Music', Icon: Music },
  'app',
  { label: 'Books', Icon: BookOpen },
  { label: 'Weather', Icon: Cloud },
  { label: 'Mail', Icon: Mail },
  { label: 'Wallet', Icon: Wallet },
  { label: 'Calculator', Icon: Calculator },
  { label: 'Tips', Icon: Lightbulb },
  { label: 'Health', Icon: Heart },
  { label: 'Settings', Icon: Settings },
  { label: 'Notes', Icon: FileText },
  { label: 'Files', Icon: Folder }
];
const DOCK = [Phone, MessageCircle, Camera, Compass];

const slot = (i: number) => ({
  left: PAD_X + (i % 4) * PITCH_X + (PITCH_X - ICON) / 2,
  top: GRID_TOP + Math.floor(i / 4) * PITCH_Y
});
const APP_AT = slot(GRID.indexOf('app'));
const APP_CX = APP_AT.left + ICON / 2;
const APP_CY = APP_AT.top + ICON / 2;

interface LaunchSceneProps {
  /** Seconds to wait, once the phone is in view, before starting. */
  lead?: number;
  /** A line shown at the foot of the launch screen once it is ready. */
  hint?: string;
  /** The visitor tapped the app: move on to its first screen. */
  onOpen: () => void;
}

export const LaunchScene: React.FC<LaunchSceneProps> = ({ lead = 0.4, hint, onOpen }) => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { amount: 0.4 });
  const [go, setGo] = useState(false);
  const [phase, setPhase] = useState<Phase>(reduce ? 'ready' : 'home');
  const timers = useRef<number[]>([]);

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  const at = (ms: number, p: Phase) => {
    timers.current.push(window.setTimeout(() => setPhase(p), ms));
  };

  // Start once the phone is actually on screen, and only once per appearance.
  useEffect(() => {
    if (seen && !go) setGo(true);
  }, [seen, go]);

  useEffect(() => {
    if (!go || reduce) return;
    const start = window.setTimeout(() => {
      at(AT.reach, 'reach');
      at(AT.tap, 'tap');
      at(AT.open, 'open');
      at(AT.ready, 'ready');
    }, lead * 1000);
    timers.current.push(start);
    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [go, reduce, lead]);

  /** The visitor taps the icon themselves: skip the wait, keep the opening. */
  const tapIcon = () => {
    if (phase === 'tap' || phase === 'open' || phase === 'ready') return;
    clear();
    setPhase('tap');
    at(450, 'open');
    at(2650, 'ready');
  };

  const opened = phase === 'open' || phase === 'ready';
  const finger = phase === 'reach' || phase === 'tap';

  return (
    <motion.div
      ref={ref}
      key="launch"
      initial={false}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.08, filter: 'blur(10px)' }}
      transition={{ duration: 0.5, ease: EASE }}
      className="absolute inset-0 z-10 overflow-hidden bg-[#0A0B10]"
    >
      {/* Wallpaper */}
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_120%_55%_at_50%_0%,rgba(255,99,33,0.3),transparent),radial-gradient(ellipse_90%_45%_at_50%_100%,rgba(255,99,33,0.16),transparent),linear-gradient(180deg,#171110,#0A0B10)]" />

      {/* Home screen. When the app opens, the screen rushes towards you. */}
      <motion.div
        aria-hidden={opened}
        initial={false}
        animate={opened ? { scale: 1.24, opacity: 0, filter: 'blur(8px)' } : { scale: 1, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, ease: EASE }}
        className="absolute inset-0"
        style={{ transformOrigin: `${APP_CX}px ${APP_CY}px` }}
      >
        {GRID.map((g, i) => {
          const p = slot(i);
          const pop = {
            initial: false as const,
            animate: go || reduce ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.6, y: 12 },
            transition: { delay: reduce ? 0 : lead * 0 + 0.035 * i, type: 'spring' as const, stiffness: 320, damping: 22 }
          };
          if (g === 'app') {
            return (
              <motion.button
                key="app"
                {...pop}
                onClick={tapIcon}
                aria-label="Open ClassMap"
                className="absolute flex cursor-pointer flex-col items-center"
                style={{ left: p.left, top: p.top, width: ICON }}
              >
                {/* A soft pulse that says: this one */}
                {!opened && !reduce && <span aria-hidden="true" className="absolute left-0 top-0 h-[54px] w-[54px] animate-pulse-ring rounded-[15px] bg-[#FF6321]/45" />}
                <motion.span
                  animate={phase === 'tap' ? { scale: 0.88 } : { scale: 1 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  className="relative block h-[54px] w-[54px] overflow-hidden rounded-[15px] shadow-[0_0_0_1px_rgba(255,255,255,0.18),0_10px_24px_-6px_rgba(255,99,33,0.65)]"
                >
                  <img src="/favicon.svg" alt="" width={ICON} height={ICON} className="h-full w-full" />
                </motion.span>
                <span className="mt-1.5 text-[9.5px] font-medium text-white">ClassMap</span>
              </motion.button>
            );
          }
          return (
            <motion.div
              key={g.label}
              {...pop}
              aria-hidden="true"
              className="absolute flex flex-col items-center"
              style={{ left: p.left, top: p.top, width: ICON }}
            >
              <span className="flex h-[54px] w-[54px] items-center justify-center rounded-[15px] bg-white/[0.07] text-stone-400 shadow-[0_0_0_1px_rgba(255,255,255,0.08),inset_0_1px_0_rgba(255,255,255,0.06)]">
                <g.Icon className="h-[22px] w-[22px]" strokeWidth={1.7} />
              </span>
              <span className="mt-1.5 text-[9.5px] font-medium text-stone-400">{g.label}</span>
            </motion.div>
          );
        })}

        {/* Page dots and the dock */}
        <motion.div aria-hidden="true" initial={false} animate={{ opacity: go || reduce ? 1 : 0 }} transition={{ delay: 0.5, duration: 0.5 }} className="absolute inset-x-0 flex justify-center gap-1.5" style={{ top: 452 }}>
          <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
        </motion.div>
        <motion.div
          aria-hidden="true"
          initial={false}
          animate={go || reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ delay: 0.3, duration: 0.6, ease: EASE }}
          className="absolute inset-x-3.5 bottom-6 flex h-[78px] items-center justify-around rounded-[28px] bg-white/[0.08] shadow-[0_0_0_1px_rgba(255,255,255,0.08)] backdrop-blur-md"
        >
          {DOCK.map((D, i) => (
            <span key={i} className="flex h-[54px] w-[54px] items-center justify-center rounded-[15px] bg-white/[0.07] text-stone-300">
              <D className="h-[22px] w-[22px]" strokeWidth={1.7} />
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* A finger reaches for the icon and taps it */}
      {!reduce && (
        <motion.span
          aria-hidden="true"
          initial={false}
          animate={
            phase === 'home'
              ? { opacity: 0, x: 70, y: 150, scale: 1 }
              : phase === 'reach'
              ? { opacity: 1, x: 0, y: 0, scale: 1 }
              : phase === 'tap'
              ? { opacity: 1, x: 0, y: 0, scale: 0.8 }
              : { opacity: 0, x: 0, y: 0, scale: 1 }
          }
          transition={{ duration: phase === 'reach' ? 0.7 : 0.25, ease: EASE }}
          className="pointer-events-none absolute z-[25] -ml-5 -mt-5 h-10 w-10 rounded-full bg-white/25 shadow-[0_0_0_1.5px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.5)] backdrop-blur-sm"
          style={{ left: APP_CX, top: APP_CY }}
        />
      )}
      {phase === 'tap' && !reduce && (
        <motion.span
          aria-hidden="true"
          initial={{ scale: 0.3, opacity: 0.7 }}
          animate={{ scale: 2.4, opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="pointer-events-none absolute z-[24] -ml-8 -mt-8 h-16 w-16 rounded-full border border-white/70"
          style={{ left: APP_CX, top: APP_CY }}
        />
      )}

      {/* The icon opens up to fill the screen */}
      {opened && (
        <motion.div
          aria-hidden="true"
          initial={reduce ? false : { left: APP_AT.left, top: APP_AT.top, width: ICON, height: ICON, borderRadius: 15, backgroundColor: '#FFFFFF' }}
          animate={{ left: 0, top: 0, width: SCREEN_W, height: SCREEN_H, borderRadius: 46, backgroundColor: '#0A0B10' }}
          transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1], backgroundColor: { duration: 0.26, delay: 0.03 } }}
          className="absolute z-20 overflow-hidden"
        >
          <motion.img
            src="/favicon.svg"
            alt=""
            initial={reduce ? false : { opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute left-1/2 top-1/2 h-[54px] w-[54px] -translate-x-1/2 -translate-y-1/2"
          />
        </motion.div>
      )}

      {/* The launch screen */}
      {opened && (
        <button onClick={onOpen} aria-label="Start" className="absolute inset-0 z-30 flex cursor-pointer flex-col items-center justify-center">
          <motion.span
            aria-hidden="true"
            initial={reduce ? false : { opacity: 0, scale: 0.55 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, delay: 0.35, ease: EASE }}
            className="pointer-events-none absolute left-1/2 top-[44%] h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,99,33,0.34),rgba(255,99,33,0.06)_60%,transparent)] blur-2xl"
          />
          {/* One ring of light spreading out from the mark */}
          {!reduce && (
            <motion.span
              aria-hidden="true"
              initial={{ opacity: 0.5, scale: 0.4 }}
              animate={{ opacity: 0, scale: 2.2 }}
              transition={{ duration: 1.7, delay: 0.55, ease: EASE }}
              className="pointer-events-none absolute left-1/2 top-[44%] h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#FF8A4C]/50"
            />
          )}

          <motion.img
            src={markImg}
            alt=""
            initial={reduce ? false : { opacity: 0, scale: 0.7, y: 8, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ type: 'spring', stiffness: 140, damping: 18, delay: 0.4 }}
            className="relative -mt-8 h-[78px] w-auto drop-shadow-[0_10px_30px_rgba(255,99,33,0.55)]"
          />
          <motion.span
            initial={reduce ? false : { opacity: 0, y: 10, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
            className="relative mt-4 text-[27px] font-extrabold leading-none tracking-[-0.03em] text-[#FF6321]"
          >
            ClassMap
          </motion.span>
          <motion.span
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="relative mt-2.5 text-[11.5px] tracking-[-0.01em] text-stone-400"
          >
            Learning, made personal.
          </motion.span>

          {/* It is getting ready */}
          <motion.span
            aria-hidden="true"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: phase === 'ready' ? 0 : 1 }}
            transition={{ duration: 0.4, delay: phase === 'ready' ? 0 : 0.9 }}
            className="absolute left-1/2 top-[63%] h-[2px] w-14 -translate-x-1/2 overflow-hidden rounded-full bg-white/10"
          >
            <motion.span
              initial={reduce ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 0.9, ease: [0.4, 0, 0.2, 1] }}
              className="block h-full origin-left rounded-full bg-gradient-to-r from-[#FF6321] to-[#FFB27A]"
            />
          </motion.span>

          {hint && (
            <motion.span
              initial={false}
              animate={{ opacity: phase === 'ready' ? 1 : 0, y: phase === 'ready' ? 0 : 8 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="absolute bottom-[52px] flex items-center gap-2 rounded-full bg-white/[0.07] px-3.5 py-2 text-[11px] font-semibold text-stone-200 shadow-[0_0_0_1px_rgba(255,255,255,0.1)] backdrop-blur"
            >
              {hint}
              <motion.span animate={reduce ? undefined : { y: [0, 3, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}>
                <ArrowDown className="h-3.5 w-3.5 text-[#FF8A4C]" />
              </motion.span>
            </motion.span>
          )}
        </button>
      )}
    </motion.div>
  );
};
