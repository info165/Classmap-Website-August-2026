import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { ArrowRight, Building2, CalendarCheck, CalendarDays, Check, UsersRound } from 'lucide-react';
import { EASE, PrimaryButton, Reveal, WordReveal } from '../ui/primitives';

/**
 * The admin account: plan who teaches what.
 *
 * A teacher is picked from the staff tray, the free slot lights up, and the
 * teacher appears in it, with a note confirming what that teacher will now see. Four
 * assignments play in turn, then the board clears and starts again.
 *
 * The staff and the timetable are an illustration.
 */
const TEACHERS = [
  { id: 'rao', name: 'Ms. Rao', subject: 'Science', short: 'Sci', tone: '#34D399' },
  { id: 'iyer', name: 'Mr. Iyer', subject: 'Maths', short: 'Math', tone: '#FF8A4C' },
  { id: 'das', name: 'Ms. Das', subject: 'English', short: 'Eng', tone: '#818CF8' },
  { id: 'khan', name: 'Mr. Saha', subject: 'Social Sci.', short: 'SSt', tone: '#FBBF24' }
];
const T = Object.fromEntries(TEACHERS.map((t) => [t.id, t]));

const CLASSES = ['6-A', '7-B', '8-A', '9-A'];

/** The opening's three steps. */
const FLOW = [
  { icon: Building2, lead: 'An admin account', rest: 'for your school' },
  { icon: UsersRound, lead: 'Assign every teacher', rest: 'their classes, sections and subjects' },
  { icon: CalendarCheck, lead: 'Each one sees', rest: 'exactly their own day' }
];
const PERIODS = ['P1', 'P2', 'P3', 'P4', 'P5'];

/** Slots already filled when the board starts. */
const FIXED: Record<string, string> = {
  '0-0': 'iyer',
  '0-2': 'das',
  '1-0': 'khan',
  '1-4': 'iyer',
  '2-1': 'rao',
  '2-3': 'das',
  '3-1': 'iyer',
  '3-2': 'khan'
};

const STEPS = [
  { teacher: 'rao', r: 1, c: 2 },
  { teacher: 'iyer', r: 2, c: 0 },
  { teacher: 'das', r: 3, c: 4 },
  { teacher: 'khan', r: 0, c: 3 }
];

type Phase = 'idle' | 'pick' | 'placed';
const TIMES: Record<Phase, number> = { idle: 500, pick: 750, placed: 1500 };

const Chip: React.FC<{ id: string; compact?: boolean }> = ({ id, compact }) => {
  const t = T[id];
  return (
    <span className={`flex w-full items-center gap-1 overflow-hidden rounded-lg bg-white/[0.07] sm:gap-1.5 ${compact ? 'px-1 py-1 sm:px-1.5' : 'px-2.5 py-2'} shadow-[0_0_0_1px_rgba(255,255,255,0.09)]`}>
      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: t.tone, boxShadow: `0 0 8px ${t.tone}` }} />
      <span className="min-w-0 truncate text-left leading-tight">
        {compact ? (
          <>
            <span className="block truncate text-[10px] font-semibold text-white sm:hidden">{t.short}</span>
            <span className="hidden truncate text-[10px] font-semibold text-white sm:block">{t.subject}</span>
            <span className="hidden truncate text-[9px] text-stone-400 sm:block">{t.name}</span>
          </>
        ) : (
          <>
            <span className="block truncate text-[12.5px] font-semibold text-white">{t.subject}</span>
            <span className="block truncate text-[11px] text-stone-400">{t.name}</span>
          </>
        )}
      </span>
    </span>
  );
};

const Board: React.FC<{ bare?: boolean }> = ({ bare = false }) => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const [done, setDone] = useState<number[]>([]);
  const [round, setRound] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    // After the last assignment, hold the full board, then clear it and go again.
    if (step >= STEPS.length) {
      const t = setTimeout(() => {
        setDone([]);
        setStep(0);
        setPhase('idle');
        setRound((x) => x + 1);
      }, 2000);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      if (phase === 'idle') setPhase('pick');
      else if (phase === 'pick') setPhase('placed');
      else {
        setDone((d) => [...d, step]);
        setStep((s) => s + 1);
        setPhase('idle');
      }
    }, TIMES[phase]);
    return () => clearTimeout(t);
  }, [phase, step, inView, reduce]);

  const cur = step < STEPS.length ? STEPS[step] : null;
  const slotOf = (r: number, c: number) => {
    const fixed = FIXED[`${r}-${c}`];
    if (fixed) return { id: fixed, k: -1 };
    const i = STEPS.findIndex((s) => s.r === r && s.c === c);
    if (i >= 0 && (done.includes(i) || (i === step && phase === 'placed'))) return { id: STEPS[i].teacher, k: i };
    return null;
  };
  const lastPlaced = cur && phase === 'placed' ? cur : done.length ? STEPS[done[done.length - 1]] : null;

  return (
    <div
      ref={ref}
      className={
        bare
          ? 'overflow-hidden bg-[#0A0B10]'
          : 'overflow-hidden rounded-[26px] bg-[#0A0B10] shadow-[0_0_0_1px_rgba(255,255,255,0.09),0_60px_100px_-50px_rgba(0,0,0,0.95)]'
      }
    >
      <div className="flex items-center justify-between border-b border-white/[0.07] bg-white/[0.025] px-5 py-3.5">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-white">
          <CalendarDays className="h-4 w-4 text-[#FF6321]" />
          Setting up the routine · Monday
        </div>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-stone-500 sm:inline">School admin</span>
      </div>

        <div className="p-3.5 sm:p-6">
          {/* Staff tray */}
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500">Teachers</div>
          <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {TEACHERS.map((t) => {
              const picking = cur?.teacher === t.id && phase === 'pick';
              return (
                <div key={t.id} className="relative">
                  <motion.div animate={{ scale: picking ? 1.05 : 1 }} transition={{ type: 'spring', stiffness: 400, damping: 22 }}>
                    <span className={`block rounded-lg transition-shadow duration-300 ${picking ? 'shadow-[0_0_0_1.5px_#FF6321,0_10px_30px_-8px_rgba(255,99,33,0.7)]' : ''}`}>
                      <Chip id={t.id} />
                    </span>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Timetable */}
          <div className="mt-6 grid gap-1 sm:gap-1.5" style={{ gridTemplateColumns: `clamp(1.9rem, 6vw, 2.6rem) repeat(${PERIODS.length}, minmax(0, 1fr))` }}>
            <span />
            {PERIODS.map((p) => (
              <span key={p} className="pb-1 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-stone-500">
                {p}
              </span>
            ))}
            {CLASSES.map((cl, r) => (
              <React.Fragment key={cl}>
                <span className="flex items-center font-mono text-[11px] font-semibold text-stone-400">{cl}</span>
                {PERIODS.map((_, c) => {
                  const slot = slotOf(r, c);
                  const target = cur && cur.r === r && cur.c === c;
                  return (
                    <div
                      key={c}
                      className={`relative flex h-12 min-w-0 items-stretch overflow-hidden rounded-lg transition-colors duration-300 sm:h-14 ${
                        slot ? '' : target && phase !== 'idle' ? 'bg-[#FF6321]/[0.08] shadow-[inset_0_0_0_1.5px_rgba(255,99,33,0.6)]' : 'bg-white/[0.025] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]'
                      }`}
                    >
                      {slot &&
                        (slot.k >= 0 ? (
                          <motion.div
                            key={`${round}-${slot.k}`}
                            className="flex w-full"
                            initial={reduce ? false : { opacity: 0, scale: 0.7, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            transition={{ type: 'spring', stiffness: 380, damping: 24 }}
                          >
                            <span className="flex w-full rounded-lg shadow-[0_0_24px_-6px_rgba(255,99,33,0.7)]">
                              <Chip id={slot.id} compact />
                            </span>
                          </motion.div>
                        ) : (
                          <div className="flex w-full opacity-70">
                            <Chip id={slot.id} compact />
                          </div>
                        ))}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>

          {/* Confirmation */}
          <div className="mt-5 h-16 sm:h-11">
            <AnimatePresence mode="wait">
              {lastPlaced && (
                <motion.div
                  key={`${round}-${lastPlaced.teacher}-${lastPlaced.r}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="flex h-full items-center gap-2.5 rounded-xl bg-emerald-400/[0.08] px-3.5 text-[12px] sm:text-[12.5px] text-stone-200 ring-1 ring-inset ring-emerald-400/25"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-[#07080C]">
                    <Check className="h-3 w-3" strokeWidth={4} />
                  </span>
                  <span className="line-clamp-3 sm:truncate">
                    <span className="font-semibold text-white">{T[lastPlaced.teacher].name}</span> now teaches {T[lastPlaced.teacher].subject} to Class{' '}
                    {CLASSES[lastPlaced.r]}, {PERIODS[lastPlaced.c]}. It is already on their dashboard.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
    </div>
  );
};

const POINTS = [
  { title: 'Classes and sections', body: 'Set up every class and section once, for the whole year.' },
  { title: 'Teachers and subjects', body: 'Assign each teacher the classes, sections and subjects they teach.' },
  { title: 'The routine', body: 'Plan the timetable; every teacher sees their own day.' },
  { title: 'Every class, every subject', body: 'See how each class is doing in each subject, and where to step in.' }
];

const SCHOOLS = [
  { src: '/logos/dps-howrah.png', name: 'DPS Howrah' },
  { src: '/logos/bdmi.png', name: 'B.D. Memorial International' },
  { src: '/logos/newtown.png', name: 'The Newtown School' },
  { src: '/logos/siddhartha.png', name: 'Siddhartha Public School' },
  { src: '/logos/st-thomas.png', name: 'St. Thomas School' },
  { src: '/logos/khaitan.png', name: 'Khaitan Public School' }
];

/**
 * A laptop for the routine board to live on. The lid opens on its hinge in
 * step with the scroll (0 shut, 1 open), the screen lights as it nears
 * upright, and scrolling back closes it again.
 */
const Laptop: React.FC<{ children: React.ReactNode; open: MotionValue<number> }> = ({ children, open }) => {
  const reduce = useReducedMotion();
  const angle = useTransform(open, [0, 0.85], [reduce ? 0 : -30, 0]);
  const lid = useTransform(open, [0, 0.3], [reduce ? 1 : 0.95, 1]);
  const screen = useTransform(open, [0, 0.9], [reduce ? 1 : 0.8, 1]);
  const glare = useTransform(open, [0, 0.95], [reduce ? 1 : 1.35, 1]);
  const screenFilter = useTransform(glare, (v) => `brightness(${v})`);
  return (
    <div className="relative [perspective:2400px]">
      {/* The lid */}
      <motion.div
        style={{ rotateX: angle, opacity: lid, transformOrigin: '50% 100%' }}
        className="relative mx-auto w-[97%] rounded-t-[22px] sm:w-[94%] bg-gradient-to-b from-[#2a2c33] to-[#121318] p-[3px] shadow-[0_0_0_1px_rgba(255,255,255,0.14)] sm:rounded-t-[28px]"
      >
        <div className="relative rounded-t-[19px] bg-black p-[6px] pb-[8px] sm:rounded-t-[25px] sm:p-[12px] sm:pb-[14px]">
          {/* Camera */}
          <span className="absolute left-1/2 top-[3px] h-[4px] w-[4px] -translate-x-1/2 rounded-full bg-[#1e2028] ring-1 ring-white/10 sm:top-[5px]" />
          <div className="relative overflow-hidden rounded-[8px] bg-[#0A0B10] sm:rounded-[10px]">
            <motion.div style={{ opacity: screen, filter: screenFilter }}>
              {/* The ClassMap admin app's window bar */}
              <div className="flex items-center gap-3 border-b border-white/[0.07] bg-[#101117] px-3 py-2 sm:px-4 sm:py-2.5">
                {/* ClassMap, on the left */}
                <div className="flex shrink-0 items-center gap-2 sm:w-[150px]">
                  <img src="/favicon.svg" alt="" className="h-6 w-6 shrink-0 rounded-md sm:h-7 sm:w-7" />
                  <span className="hidden text-[12.5px] font-bold tracking-[-0.01em] text-white sm:block">ClassMap</span>
                </div>
                <div className="mx-auto flex min-w-0 items-center gap-2 rounded-full bg-white/[0.05] px-3 py-1 ring-1 ring-inset ring-white/[0.08] sm:px-4">
                  <span className="truncate text-[11px] text-stone-400 sm:text-[12.5px]">
                    <span className="font-semibold text-white">School Admin</span>
                    <span className="hidden sm:inline"> · Routine setup</span>
                  </span>
                </div>
                <div className="flex w-6 shrink-0 justify-end sm:w-[150px]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-b from-[#FF7A3D] to-[#F0530F] text-[9px] font-bold text-white sm:h-6 sm:w-6 sm:text-[10px]">A</span>
                </div>
              </div>
              {children}
            </motion.div>
            {/* Light on the glass */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(118deg,rgba(255,255,255,0.07),transparent_34%,transparent_70%,rgba(255,255,255,0.02))]" />
          </div>
        </div>
      </motion.div>
      {/* The base, a touch wider than the lid, with the notch for opening it */}
      <div className="relative mx-auto h-3 w-full rounded-b-[14px] rounded-t-[3px] bg-gradient-to-b from-[#9a9ea8] via-[#5f636d] to-[#2c2e34] shadow-[0_30px_60px_-14px_rgba(0,0,0,0.9)] sm:h-4">
        <span className="absolute left-1/2 top-0 h-[5px] w-[14%] -translate-x-1/2 rounded-b-[8px] bg-[#3a3d45] sm:h-[6px]" />
      </div>
      <div aria-hidden="true" className="absolute -bottom-8 left-1/2 -z-10 h-10 w-[86%] -translate-x-1/2 rounded-[50%] bg-black blur-2xl" />
    </div>
  );
};

/**
 * `first` makes this the opening of the page: its heading becomes the page
 * title, it clears the header, it carries the page's first call to action and
 * the schools that already use ClassMap, and the board is shown on a laptop
 * that rises and opens as the page scrolls, while the opening words step back.
 */
export const AdminRoutine: React.FC<{ first?: boolean; onQuote?: () => void }> = ({ first = false, onQuote }) => {
  const reduce = useReducedMotion();
  const Heading = first ? 'h1' : 'h2';
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start end', 'center center'] });
  const lift = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : first ? 0.9 : 0.94, 1]);
  const rise = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 30, 0]);

  // As the page scrolls, the opening words step back and fade while the laptop
  // rises to the middle and opens.
  const { scrollY } = useScroll();
  const introOpacity = useTransform(scrollY, [0, 480], [1, reduce ? 1 : 0]);
  const introScale = useTransform(scrollY, [0, 480], [1, reduce ? 1 : 0.9]);
  const introY = useTransform(scrollY, [0, 480], [0, reduce ? 0 : 90]);

  return (
    <section
      id="admin"
      className={`noise relative isolate overflow-hidden bg-[#050507] pb-24 text-white sm:pb-32 ${first ? 'pt-28 sm:pt-[118px]' : 'pt-20 sm:pt-28'}`}
    >
      {/* One warm light from above, and a faint still grid that fades out round it */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-22%] h-[820px] w-[1300px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,99,33,0.2),rgba(255,99,33,0.05)_55%,transparent)] blur-2xl" />
        <div className="bg-grid-dark absolute inset-x-0 top-0 h-[900px] opacity-50" />
        {/* A pool of light the laptop sits in */}
        <div className="absolute left-1/2 top-[720px] h-[700px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,99,33,0.15),transparent)] blur-3xl" />
      </div>

      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <motion.div
          style={first ? { opacity: introOpacity, scale: introScale, y: introY, transformOrigin: '50% 0%' } : undefined}
          className="mx-auto max-w-[1180px] text-center"
        >
          {first ? (
            <Heading className="text-balance text-[2.9rem] font-semibold leading-[0.98] tracking-[-0.058em] sm:text-7xl lg:text-[5.2rem] xl:text-[5.6rem]">
              <WordReveal text="Make your school" wordClassName="text-gradient-light" delay={0.15} />
              <br />
              {/* Light flows through the orange of "smarter." all the time */}
              <WordReveal text="smarter." wordClassName="text-flow-brand" delay={0.4} />
            </Heading>
          ) : (
            <Reveal>
              <Heading className="text-balance text-[2.5rem] font-semibold leading-[1] tracking-[-0.05em] sm:text-6xl lg:text-[4.4rem]">
                <span className="text-gradient-light">Plan the whole routine.</span> <span className="text-gradient-brand">In minutes.</span>
              </Heading>
            </Reveal>
          )}

          {/* The idea in three short steps, in one quiet line */}
          <motion.ul
            initial={reduce ? false : 'hidden'}
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: first ? 0.75 : 0.2 } } }}
            className="mx-auto mt-7 flex flex-col items-center justify-center gap-x-3.5 gap-y-2.5 text-[15.5px] text-stone-400 sm:text-[16px] xl:flex-row"
          >
            {FLOW.map(({ icon: Icon, lead, rest }, i) => (
              <motion.li
                key={lead}
                variants={{ hidden: { opacity: 0, y: 10, filter: 'blur(6px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: EASE } } }}
                className="flex items-center gap-3.5"
              >
                {i > 0 && <span aria-hidden="true" className="hidden h-1 w-1 rounded-full bg-stone-600 xl:block" />}
                <span className="text-balance">
                  <Icon className="-mt-0.5 mr-2 inline-block h-[18px] w-[18px] align-middle text-[#FF8A4C]" />
                  <span className="font-semibold text-white">{lead}</span> {rest}
                </span>
              </motion.li>
            ))}
          </motion.ul>

          {first && onQuote && (
            <Reveal delay={1}>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-7">
                <PrimaryButton onClick={onQuote}>
                  <span>Request a quote</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </PrimaryButton>
                <button
                  onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-stone-300 transition-colors hover:text-white"
                >
                  See it all work
                  <ArrowRight className="h-4 w-4 rotate-90 text-[#FF8A4C] transition-transform duration-300 group-hover:translate-y-0.5" />
                </button>
              </div>
            </Reveal>
          )}

          {/* The schools already on ClassMap */}
          {first && (
            <Reveal delay={1.15}>
              <div className="mt-7">
                <div className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-stone-500">Trusted by schools across India</div>
                {/* The logos glide in an endless line that fades out at both ends, and pause under the pointer */}
                <div className="mx-auto mt-3 max-w-[820px] overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,#000_14%,#000_86%,transparent)]">
                  <div className="flex w-max animate-[marquee_34s_linear_infinite] hover:[animation-play-state:paused]">
                    {[0, 1].map((copy) => (
                <ul key={copy} aria-hidden={copy > 0 || undefined} className="flex shrink-0 items-center gap-2.5 pr-2.5 sm:gap-3 sm:pr-3">
                  {SCHOOLS.map((sch) => (
                    <li key={sch.src}>
                      <span className="group flex h-12 w-[96px] items-center justify-center rounded-xl bg-white px-3 shadow-[0_0_0_1px_rgba(255,255,255,0.4),0_14px_30px_-16px_rgba(0,0,0,0.9)] transition-all duration-500 hover:-translate-y-0.5 sm:h-14 sm:w-[118px]">
                        <img
                          src={sch.src}
                          alt={copy > 0 ? '' : sch.name}
                          title={sch.name}
                          loading="lazy"
                          decoding="async"
                          className="max-h-9 w-auto max-w-full object-contain sm:max-h-10"
                        />
                      </span>
                    </li>
                  ))}
                </ul>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          )}
        </motion.div>

        {/* The board, on a laptop that opens as the page scrolls */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: first ? 0.55 : 0, ease: EASE }}
          className="relative mx-auto mt-6 max-w-[1040px] sm:mt-8"
        >
          <motion.div ref={stageRef} style={{ scale: lift, y: rise, transformOrigin: '50% 0%' }}>
            {first ? (
              <Laptop open={scrollYProgress}>
                <Board bare />
              </Laptop>
            ) : (
              <Board />
            )}
          </motion.div>
          <p className="mt-10 text-center font-mono text-[11px] tracking-tight text-stone-600">An illustration of the admin routine.</p>
        </motion.div>

        {/* What the admin does, in a row */}
        <div className="mx-auto mt-16 grid max-w-[1100px] grid-cols-1 border-t border-white/[0.08] sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ delay: 0.08 + i * 0.08, duration: 0.55, ease: EASE }}
              className={`py-7 sm:px-6 ${i > 0 ? 'border-t border-white/[0.08] sm:border-t-0' : ''} ${i % 2 === 1 ? 'sm:border-l sm:border-white/[0.08]' : ''} ${i > 1 ? 'sm:border-t sm:border-white/[0.08] lg:border-t-0' : ''} ${i > 0 ? 'lg:border-l lg:border-white/[0.08]' : ''} ${i === 0 ? 'sm:pl-0' : ''}`}
            >
              <div className="font-mono text-[11px] text-[#FF8A4C]">0{i + 1}</div>
              <div className="mt-3 text-[17px] font-semibold tracking-[-0.02em] text-white">{p.title}</div>
              <p className="mt-1.5 text-[14px] leading-snug text-stone-400">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
