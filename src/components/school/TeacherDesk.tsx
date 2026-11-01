import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { Presentation } from 'lucide-react';
import { EASE, Reveal } from '../ui/primitives';
import { SHOTS } from './data';

/**
 * The teacher's dashboard, explained on the real screens.
 *
 * Three screens from the teacher app. Numbered points sit on each screen, and
 * the same numbers run down the list beside it: hovering either one lights the
 * other, so the screen is read the way it would be in a guided demo. The tour
 * also walks the points by itself.
 */
type Spot = { x: number; y: number; title: string; body: string };
type Screen = { id: string; tab: string; shot: { src: string; w: number; h: number }; alt: string; spots: Spot[] };

const SCREENS: Screen[] = [
  {
    id: 'today',
    tab: 'Today',
    shot: SHOTS.dashboard,
    alt: 'The teacher dashboard: classes 6-A, 7-A and 8-A in Mathematics; what each class is currently being taught; and, for tomorrow, each class average, who needs help and what to teach next.',
    spots: [
      { x: 118, y: 40, title: 'Your classes', body: 'Every class and subject your admin has assigned to you.' },
      { x: 118, y: 300, title: 'What each class is on', body: 'The topic each class is learning now, and when it started.' },
      { x: 962, y: 560, title: 'Class average and who needs help', body: 'Class 8-A is at 60% across 59 submissions, with 3 students who need help.' },
      { x: 1520, y: 770, title: 'Reteach in one tap', body: 'Reteach a weak topic to just the students who need it.' }
    ]
  },
  {
    id: 'syllabus',
    tab: 'Syllabus',
    shot: SHOTS.topic,
    alt: 'The chapter Area, currently being taught. Its subtopics are listed with Mark done and Set current, and one subtopic is already struck through as done.',
    spots: [
      { x: 26, y: 26, title: 'The chapter in progress', body: 'Area, started on 30 October, with its results one tap away.' },
      { x: 440, y: 300, title: 'What has been taught', body: 'Finished subtopics are marked done, so you always see what is left.' },
      { x: 1225, y: 158, title: 'What is current', body: 'Set the subtopic the class is on today.' },
      { x: 54, y: 245, title: 'Test straight from the syllabus', body: 'Pick one or more topics, then push a test or take it in class.' }
    ]
  },
  {
    id: 'analysis',
    tab: 'Class analysis',
    shot: SHOTS.concepts,
    alt: 'The concept map for A Square and A Cube: 29 concepts, 17 needing work, each concept listed with the class score, from 43% upward.',
    spots: [
      { x: 640, y: 24, title: 'Every kind of test', body: 'Objective and written tests.' },
      { x: 760, y: 212, title: 'The whole chapter in one line', body: 'A Square and A Cube: 29 concepts, 17 of them need work.' },
      { x: 60, y: 258, title: 'Weakest concepts first', body: 'Each concept with the class score, so you know where to begin.' }
    ]
  }
];

const HOLD = 2600;

export const TeacherDesk: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [screen, setScreen] = useState(0);
  const [spot, setSpot] = useState(0);
  const [paused, setPaused] = useState(false);
  const sc = SCREENS[screen];

  // Walk the points on this screen, then move to the next screen.
  useEffect(() => {
    if (!inView || paused || reduce) return;
    const t = setTimeout(() => {
      if (spot < sc.spots.length - 1) setSpot(spot + 1);
      else {
        setScreen((s) => (s + 1) % SCREENS.length);
        setSpot(0);
      }
    }, HOLD);
    return () => clearTimeout(t);
  }, [spot, screen, inView, paused, reduce, sc.spots.length]);

  return (
    <section id="teachers" className="relative overflow-hidden bg-[#050507] py-24 text-white sm:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[25%] h-[800px] w-[1300px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,99,33,0.12),transparent)] blur-2xl" />

      <div className="relative mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <div className="flex items-center justify-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-[#FF8A4C]">
              <Presentation className="h-3.5 w-3.5" />
              For every teacher
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-5 text-balance text-[2.5rem] font-semibold leading-[1] tracking-[-0.05em] sm:text-6xl lg:text-[4.4rem]">
              <span className="text-gradient-light">A dashboard that knows</span> <span className="text-gradient-brand">your classroom.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-[17px] leading-relaxed text-stone-400">
              Which topic each class is on, which subtopics are done and which are left, and how every class is really doing. These are the real screens.
            </p>
          </Reveal>
        </div>

        <div ref={ref} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          {/* Tabs */}
          <Reveal delay={0.14} className="mt-12 flex justify-center">
            <div role="tablist" aria-label="Teacher app screens" className="scrollbar-none flex max-w-full gap-1 overflow-x-auto rounded-full bg-white/[0.05] p-1.5 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
              {SCREENS.map((s, i) => {
                const on = i === screen;
                return (
                  <button
                    key={s.id}
                    role="tab"
                    aria-selected={on}
                    onClick={() => {
                      setScreen(i);
                      setSpot(0);
                    }}
                    className={`relative shrink-0 cursor-pointer rounded-full px-5 py-2.5 text-[13px] font-semibold tracking-tight transition-colors duration-300 sm:px-7 ${on ? 'text-[#0A0B10]' : 'text-stone-400 hover:text-white'}`}
                  >
                    {on && <motion.span layoutId="teacher-tab" transition={{ type: 'spring', stiffness: 420, damping: 36 }} className="absolute inset-0 rounded-full bg-white" />}
                    <span className="relative">{s.tab}</span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,340px)_1fr] lg:items-center lg:gap-12">
            {/* Points */}
            <ol className="order-2 space-y-2 lg:order-1">
              {sc.spots.map((p, i) => {
                const on = i === spot;
                return (
                  <li key={`${sc.id}-${i}`}>
                    <button
                      onMouseEnter={() => setSpot(i)}
                      onClick={() => setSpot(i)}
                      className={`relative flex w-full cursor-pointer gap-4 overflow-hidden rounded-2xl p-4 text-left transition-colors duration-300 ${on ? 'bg-white/[0.06] shadow-[0_0_0_1px_rgba(255,99,33,0.4)]' : 'hover:bg-white/[0.03]'}`}
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[12px] font-semibold transition-all duration-300 ${on ? 'bg-[#FF6321] text-white shadow-[0_0_0_4px_rgba(255,99,33,0.18)]' : 'bg-white/[0.07] text-stone-400'}`}
                      >
                        {i + 1}
                      </span>
                      <span>
                        <span className={`block text-[15px] font-semibold tracking-[-0.02em] transition-colors duration-300 ${on ? 'text-white' : 'text-stone-300'}`}>{p.title}</span>
                        <span className="mt-1 block text-[13.5px] leading-snug text-stone-400">{p.body}</span>
                      </span>
                      {on && !paused && !reduce && (
                        <motion.span
                          key={`${screen}-${spot}`}
                          className="absolute inset-x-4 bottom-0 h-[2px] origin-left rounded-full bg-[#FF6321]"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: HOLD / 1000, ease: 'linear' }}
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ol>

            {/* The screen */}
            <div className="order-1 lg:order-2">
              <div className="relative rounded-[28px] bg-gradient-to-b from-white/[0.14] to-white/[0.03] p-2 shadow-[0_0_0_1px_rgba(255,255,255,0.09),0_80px_140px_-50px_rgba(255,99,33,0.4),0_50px_90px_-30px_rgba(0,0,0,0.95)] sm:p-2.5">
                {/* A fixed frame: screens of different shapes sit centred in it,
                    so switching tabs never moves the page. */}
                <div className="relative flex aspect-[1.95/1] items-center justify-center overflow-hidden rounded-[21px] bg-[radial-gradient(ellipse_at_20%_0%,#FFF1E8,transparent_60%)] bg-[#F7F6F3] p-2 sm:p-4">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={sc.id}
                      initial={reduce ? false : { opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, scale: 1.01, filter: 'blur(6px)' }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="relative w-full rounded-xl shadow-[0_0_0_1px_rgba(20,22,40,0.06),0_30px_60px_-30px_rgba(20,22,40,0.4)]"
                      style={{ maxWidth: `${Math.min(100, ((sc.shot.w / sc.shot.h) / 1.95) * 100) * 0.97}%` }}
                    >
                      <img src={sc.shot.src} alt={sc.alt} width={sc.shot.w} height={sc.shot.h} loading="lazy" decoding="async" className="block h-auto w-full rounded-xl" />
                      {sc.spots.map((p, i) => {
                        const on = i === spot;
                        return (
                          <button
                            key={i}
                            onMouseEnter={() => setSpot(i)}
                            onClick={() => setSpot(i)}
                            aria-label={`${i + 1}: ${p.title}`}
                            className="absolute -ml-4 -mt-4 flex h-8 w-8 cursor-pointer items-center justify-center"
                            style={{ left: `${(p.x / sc.shot.w) * 100}%`, top: `${(p.y / sc.shot.h) * 100}%` }}
                          >
                            {on && <span className="absolute inset-0 animate-pulse-ring rounded-full bg-[#FF6321]/60" />}
                            <motion.span
                              animate={{ scale: on ? 1.15 : 0.85 }}
                              transition={{ type: 'spring', stiffness: 420, damping: 20 }}
                              className={`relative flex h-6 w-6 items-center justify-center rounded-full font-mono text-[11px] font-bold shadow-[0_6px_16px_-4px_rgba(0,0,0,0.5)] ${on ? 'bg-[#FF6321] text-white' : 'bg-[#14161C] text-white/80'}`}
                            >
                              {i + 1}
                            </motion.span>
                          </button>
                        );
                      })}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
