import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { EASE, Reveal } from '../ui/primitives';
import { SHOTS } from './data';

/**
 * The real app, one screen at a time.
 *
 * Four screens from the live student app, each shown large enough to read, with
 * one sentence on what it does for the student. A row of tabs picks the screen;
 * it also moves on by itself, and the tab's underline shows how long is left.
 */
type Shot = { src: string; w: number; h: number };

const SCREENS: { id: string; tab: string; title: string; body: string; shot: Shot; alt: string; maxW: string }[] = [
  {
    id: 'level',
    tab: 'Your level',
    title: 'Always know your level, and why.',
    body: 'After every test the app tells you your level and the reason for it. Here, 83% unlocks harder Level 4 questions.',
    shot: SHOTS.level,
    alt: 'A Parallelograms topic at 83%, Level 4. It explains: your last test was 83%, so the next test is Level 4, with harder questions.',
    maxW: '100%'
  },
  {
    id: 'next',
    tab: 'Next step',
    title: 'One clear next step.',
    body: 'A "Study this next" card names the topic to work on now, and every chapter is coloured by how well you know it.',
    shot: SHOTS.chapters,
    alt: 'A Study this next card for Angle Sum of a Quadrilateral, counts of tests taken and topics by colour, and chapter cards with coloured progress.',
    maxW: '100%'
  },
  {
    id: 'progress',
    tab: 'Progress',
    title: 'A whole subject, at a glance.',
    body: 'Chapters started, your average score, which chapters are strong and which need work, and every test you have taken.',
    shot: SHOTS.progress,
    alt: 'Your Mathematics progress: 4 of 14 chapters started, 90% average score, strong chapters, tests taken, and each chapter with its score and level.',
    maxW: '100%'
  },
  {
    id: 'plan',
    tab: 'Study plan',
    title: 'A plan built around your exam.',
    body: 'Tell ClassMap when your exam is and how long you can study each day, and it plans your practice.',
    shot: SHOTS.plan,
    alt: 'A study plan form: choose your exam date and the time you can give each day, then Make my plan.',
    maxW: '62%'
  }
];

const HOLD = 4200;

export const WhyClassMap: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!inView || paused || reduce) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % SCREENS.length), HOLD);
    return () => clearTimeout(t);
  }, [active, inView, paused, reduce]);

  const sc = SCREENS[active];

  return (
    <section id="why" className="relative overflow-hidden bg-[#050507] py-24 text-white sm:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[30%] h-[700px] w-[1200px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,99,33,0.14),transparent)] blur-2xl" />

      <div className="relative mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <h2 className="text-balance text-[2.6rem] font-semibold leading-[0.98] tracking-[-0.05em] sm:text-6xl lg:text-[5rem]">
              <span className="text-gradient-light">The real app.</span> <span className="text-gradient-brand">Made for you.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-stone-400 sm:text-lg">
              Screens from the ClassMap student app, exactly as you will use them.
            </p>
          </Reveal>
        </div>

        <div ref={ref} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          {/* Tabs */}
          <Reveal delay={0.12} className="mt-12 flex justify-center">
            <div role="tablist" aria-label="App screens" className="scrollbar-none flex max-w-full gap-1 overflow-x-auto rounded-full bg-white/[0.05] p-1.5 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
              {SCREENS.map((s, i) => {
                const on = i === active;
                return (
                  <button
                    key={s.id}
                    role="tab"
                    aria-selected={on}
                    onClick={() => {
                      setActive(i);
                      setPaused(true);
                    }}
                    className={`relative shrink-0 cursor-pointer overflow-hidden rounded-full px-4 py-2.5 text-[13px] font-semibold tracking-tight transition-colors duration-300 sm:px-6 ${
                      on ? 'text-[#0A0B10]' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    {on && (
                      <motion.span layoutId="app-tab" transition={{ type: 'spring', stiffness: 420, damping: 36 }} className="absolute inset-0 rounded-full bg-white" />
                    )}
                    <span className="relative">{s.tab}</span>
                    {/* Time left on this screen */}
                    {on && !paused && !reduce && (
                      <motion.span
                        key={`${active}-${inView}`}
                        className="absolute inset-x-4 bottom-1 h-[2px] origin-left rounded-full bg-[#FF6321]"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: inView ? 1 : 0 }}
                        transition={{ duration: HOLD / 1000, ease: 'linear' }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* The screen */}
          <Reveal y={40} className="mt-10">
            <div className="relative rounded-[34px] bg-gradient-to-b from-white/[0.14] to-white/[0.03] p-2 shadow-[0_0_0_1px_rgba(255,255,255,0.09),0_80px_140px_-50px_rgba(255,99,33,0.4),0_50px_90px_-30px_rgba(0,0,0,0.95)] sm:p-2.5">
              <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden rounded-[27px] bg-[radial-gradient(ellipse_at_30%_0%,#FFF1E8,transparent_60%),radial-gradient(ellipse_at_90%_100%,#ECEBFF,transparent_55%)] bg-[#F7F5F2] p-3 sm:aspect-[2.35/1] sm:p-10">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.img
                    key={sc.id}
                    src={sc.shot.src}
                    alt={sc.alt}
                    width={sc.shot.w}
                    height={sc.shot.h}
                    loading="lazy"
                    decoding="async"
                    initial={reduce ? false : { opacity: 0, y: 26, scale: 0.97, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -18, scale: 0.98, filter: 'blur(6px)' }}
                    transition={{ duration: 0.55, ease: EASE }}
                    className="relative block h-auto max-h-full w-full rounded-2xl object-contain shadow-[0_0_0_1px_rgba(30,24,60,0.07),0_40px_80px_-40px_rgba(30,24,70,0.45)]"
                    style={{ maxWidth: sc.maxW }}
                  />
                </AnimatePresence>
              </div>
            </div>
          </Reveal>

          {/* What it does: fixed height, so nothing below moves */}
          <div className="mx-auto mt-10 grid max-w-2xl text-center" aria-live="polite">
            {SCREENS.map((s, i) => (
              <motion.div
                key={s.id}
                aria-hidden={i !== active}
                initial={false}
                animate={{ opacity: i === active ? 1 : 0, y: i === active ? 0 : 8 }}
                transition={{ duration: 0.35, ease: EASE }}
                className={`col-start-1 row-start-1 ${i === active ? '' : 'pointer-events-none'}`}
              >
                <h3 className="text-2xl font-semibold tracking-[-0.03em] text-white sm:text-[1.9rem]">{s.title}</h3>
                <p className="mt-3 text-pretty text-[16px] leading-relaxed text-stone-400">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
