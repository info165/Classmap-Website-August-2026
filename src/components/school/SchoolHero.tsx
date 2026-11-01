import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { LayoutGrid } from 'lucide-react';
import { EASE, Reveal, Tilt3D } from '../ui/primitives';
import { ATTENTION, BAND, OVERVIEW, OVERVIEW_CLASSES, OVERVIEW_SUBJECTS, bandOf } from './data';

/**
 * The opening of the For Schools page: the whole school on one screen.
 *
 * Every class down the side, every subject across the top, each cell coloured
 * by how well that class knows that subject. The cells arrive in a diagonal
 * wave; a ring then walks the cells that need attention, and the list beside
 * the grid follows it. The panel comes up off the table as the page scrolls.
 */

const Overview: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const [focus, setFocus] = useState(0);
  const [hover, setHover] = useState<{ r: number; c: number } | null>(null);
  // The diagonal wave plays once; after that, cells respond without delay.
  const [waved, setWaved] = useState(false);
  useEffect(() => {
    if (!inView || waved) return;
    const t = setTimeout(() => setWaved(true), 1100);
    return () => clearTimeout(t);
  }, [inView, waved]);

  useEffect(() => {
    if (!inView || reduce || hover) return;
    const t = setTimeout(() => setFocus((f) => (f + 1) % ATTENTION.length), 2400);
    return () => clearTimeout(t);
  }, [focus, inView, reduce, hover]);

  const f = ATTENTION[focus];
  const shown = hover ?? { r: f.r, c: f.c };
  const shownV = OVERVIEW[shown.r][shown.c];

  return (
    <div ref={ref} className="relative overflow-hidden rounded-[22px] bg-[#0A0B10] shadow-[0_0_0_1px_rgba(255,255,255,0.09)]">
      {/* Window bar */}
      <div className="flex items-center justify-between border-b border-white/[0.07] bg-white/[0.025] px-4 py-3 sm:px-5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]/80" />
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-tight text-stone-500">
          <LayoutGrid className="h-3.5 w-3.5 text-[#FF6321]" />
          classmap / admin / school-overview
        </div>
        <div className="hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-stone-500 sm:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-emerald-400/70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Live
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px]">
        {/* ----------------------------------------------------------- grid */}
        <div className="p-4 sm:p-6">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500">Your school, this week</div>
              <div className="mt-1 text-lg font-semibold tracking-[-0.02em] text-white">Every class. Every subject.</div>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-stone-400">
              {(['green', 'yellow', 'red'] as const).map((b) => (
                <span key={b} className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: BAND[b].solid }} />
                  {BAND[b].label}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-1.5 sm:gap-2" style={{ gridTemplateColumns: `3.2rem repeat(${OVERVIEW_SUBJECTS.length}, minmax(0, 1fr))` }}>
            <span />
            {OVERVIEW_SUBJECTS.map((s) => (
              <span key={s} className="truncate pb-1 text-center font-mono text-[9.5px] uppercase tracking-[0.1em] text-stone-500 sm:text-[10px]">
                {s}
              </span>
            ))}
            {OVERVIEW.map((row, r) => (
              <React.Fragment key={OVERVIEW_CLASSES[r]}>
                <span className="flex items-center font-mono text-[11px] font-semibold text-stone-400">{OVERVIEW_CLASSES[r]}</span>
                {row.map((v, c) => {
                  const b = BAND[bandOf(v)];
                  const on = shown.r === r && shown.c === c;
                  return (
                    <motion.button
                      key={c}
                      type="button"
                      aria-label={`Class ${OVERVIEW_CLASSES[r]}, ${OVERVIEW_SUBJECTS[c]}: ${v}%`}
                      onMouseEnter={() => setHover({ r, c })}
                      onMouseLeave={() => setHover(null)}
                      onFocus={() => setHover({ r, c })}
                      onBlur={() => setHover(null)}
                      initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                      animate={inView || reduce ? { opacity: 1, scale: on ? 1.06 : 1 } : { opacity: 0, scale: 0.6 }}
                      transition={{ delay: waved ? 0 : (r + c) * 0.04, type: 'spring', stiffness: 380, damping: 26 }}
                      className="relative flex h-9 cursor-default items-center justify-center rounded-lg font-mono text-[11px] font-semibold tabular-nums text-white sm:h-11 sm:text-[12px]"
                      style={{
                        background: `linear-gradient(160deg, ${b.solid}${on ? 'FF' : 'CC'}, ${b.solid}66)`,
                        boxShadow: on ? `0 0 0 2px #0A0B10, 0 0 0 3.5px ${b.solid}, 0 0 28px ${b.glow}` : 'inset 0 1px 0 rgba(255,255,255,0.18)'
                      }}
                    >
                      {v}
                    </motion.button>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ---------------------------------------------------------- panel */}
        <div className="border-t border-white/[0.07] p-4 sm:p-6 lg:border-l lg:border-t-0">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500">Selected</div>
          {/* Keyed, so each new selection rises in fresh. */}
          <motion.div
            key={`${shown.r}-${shown.c}`}
            initial={reduce ? false : { y: 8, filter: 'blur(4px)' }}
            animate={{ y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.3, ease: EASE }}
            className="mt-2"
          >
              <div className="text-xl font-semibold tracking-[-0.02em] text-white">
                Class {OVERVIEW_CLASSES[shown.r]} · {OVERVIEW_SUBJECTS[shown.c]}
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl font-semibold tracking-[-0.05em] tabular-nums" style={{ color: BAND[bandOf(shownV)].solid }}>
                  {shownV}%
                </span>
                <span className="text-[13px] text-stone-400">class mastery</span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: BAND[bandOf(shownV)].solid }}
                  initial={{ width: 0 }}
                  animate={{ width: `${shownV}%` }}
                  transition={{ duration: 0.7, ease: EASE }}
                />
              </div>
          </motion.div>

          <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500">Needs attention</div>
          <ul className="mt-2 space-y-1.5">
            {ATTENTION.map((a, i) => {
              const on = !hover && i === focus;
              return (
                <li
                  key={`${a.r}-${a.c}`}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 text-[13px] transition-colors duration-300 ${on ? 'bg-rose-400/10 text-white ring-1 ring-inset ring-rose-400/30' : 'text-stone-400'}`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                    Class {OVERVIEW_CLASSES[a.r]} · {OVERVIEW_SUBJECTS[a.c]}
                  </span>
                  <span className="font-mono tabular-nums">{a.v}%</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

/**
 * The admin's overview of the school, set as its own section after the
 * routine: the same account that plans who teaches what also shows how each
 * class is doing in each subject.
 */
export const SchoolOverview: React.FC = () => {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start end', 'center center'] });
  const tilt = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 22, 0]);
  const lift = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0.93, 1]);
  const glow = useTransform(scrollYProgress, [0, 1], [0.2, 1]);

  return (
    <section id="overview" className="relative overflow-hidden bg-[#050507] pb-24 pt-8 text-white sm:pb-36 sm:pt-12">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <h2 className="text-balance text-[2.5rem] font-semibold leading-[1] tracking-[-0.05em] sm:text-6xl lg:text-[4.4rem]">
              <span className="text-gradient-light">Every class. Every subject.</span> <span className="text-gradient-brand">One screen.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-[17px] leading-relaxed text-stone-400">
              From the same admin account, see how each class is doing in each subject, and which ones need attention first.
            </p>
          </Reveal>
        </div>

        <div className="relative mx-auto mt-14 max-w-[1080px] [perspective:1600px] sm:mt-16">
          <motion.div aria-hidden="true" style={{ opacity: glow }} className="absolute -inset-x-10 -bottom-16 -z-10 h-48 rounded-full bg-[#FF6321]/25 blur-[90px]" />
          <motion.div ref={stageRef} style={{ rotateX: tilt, scale: lift, transformOrigin: '50% 100%' }}>
            <Tilt3D max={3}>
              <div className="relative">
                <Overview />
                <div aria-hidden="true" className="beam pointer-events-none absolute inset-0 z-10 rounded-[22px]" />
              </div>
            </Tilt3D>
          </motion.div>
          <p className="mt-6 text-center font-mono text-[11px] tracking-tight text-stone-600">
            An illustration of the admin overview. Hover a class to see it.
          </p>
        </div>
      </div>
    </section>
  );
};
