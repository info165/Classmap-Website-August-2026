import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { ArrowRight, Hand, Play, Repeat2, Smartphone } from 'lucide-react';
import { EASE, PrimaryButton, Reveal, Tilt3D, WordReveal } from '../ui/primitives';
import { LOOP_LABELS, PhoneDevice } from './PhoneDevice';

/**
 * The loop, told the way a product page tells a story.
 *
 * On a wide screen the phone stays pinned in the middle of the view while the
 * six steps scroll past beside it; whichever step is in the centre of the
 * screen is the one the phone shows, and each screen then plays its own short
 * sequence. On a phone-sized screen there is no room to pin, so the phone plays
 * the steps by itself, with the list beneath it.
 *
 * Either way, every screen can be tapped and swiped.
 */
const STEPS = [
  {
    title: 'Pick a topic.',
    body: 'Choose a subject and the topic you are studying. Your diagnostic engine starts learning about you from the very first test.',
    detail: 'Example: Science, Photosynthesis'
  },
  {
    title: 'Choose a level. Take the test.',
    body: 'Medium is already selected for you, so you can start straight away. You can also take a self-test whenever you like.',
    detail: 'Five levels, from easiest to hardest'
  },
  {
    title: 'See your weak topics.',
    body: 'The engine marks every part of the topic red, yellow or green, so you know exactly what needs work, and what does not.',
    detail: 'Red · Yellow · Green'
  },
  {
    title: 'Watch the video lessons.',
    body: 'Short lessons inside the app explain exactly the parts you got wrong, so your doubts are cleared before you try again.',
    detail: 'Lessons cued to your weak topic'
  },
  {
    title: 'Take the adaptive test.',
    body: 'Your next test covers only your weak topics, at a level set by your last score: easier if you struggled, harder if you did well.',
    detail: 'Adapts after every single test'
  },
  {
    title: 'Get your analysis report.',
    body: 'See what improved, what is still weak, and what to study next. Then the loop begins again, sharper every round.',
    detail: 'Then back to step 1'
  }
];

/** The light behind the phone takes the mood of each step. */
const HALO = ['255,99,33', '255,99,33', '244,63,94', '255,120,50', '245,158,11', '16,185,129'];

const HOLD = 4600;
/** How long the app launch plays on a small screen before the first step. */
const LAUNCH_HOLD = 5800;

/* ------------------------------------------------------------------- intro */

const Intro: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const reduce = useReducedMotion();
  const seeRound = () =>
    document.getElementById(window.innerWidth >= 1024 ? 'step-1' : 'loop-phone')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  return (
    <div className="relative isolate max-w-[37rem]">
      {/* Warm light gathered behind the words */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 -top-32 -z-10 h-[460px] w-[680px] rounded-full bg-[radial-gradient(closest-side,rgba(255,99,33,0.16),transparent)] blur-2xl" />

      {/* A quiet line of type, so the headline has something to stand on */}
      <motion.div
        initial={reduce ? false : { opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-stone-500"
      >
        <motion.span
          initial={reduce ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          className="h-px w-10 origin-left bg-gradient-to-r from-[#FF6321] to-[#FF6321]/0"
        />
        Adaptive learning
      </motion.div>

      <h1 className="mt-6 text-[3.1rem] font-semibold leading-[0.95] tracking-[-0.055em] sm:text-7xl lg:text-[4rem] xl:text-[4.6rem]">
        <WordReveal text="Learning, made" wordClassName="text-gradient-light" delay={0.05} />
        <br />
        <span className="relative inline-block">
          {/* The word glows */}
          <span aria-hidden="true" className="pointer-events-none absolute inset-x-[-8%] top-[22%] -z-10 h-[70%] rounded-full bg-[#FF6321]/25 blur-2xl" />
          <WordReveal text="personal." wordClassName="text-gradient-brand" delay={0.25} />
        </span>
      </h1>

      <motion.p
        initial={reduce ? false : { opacity: 0, y: 14, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
        className="mt-9 max-w-[33rem] text-pretty text-[1.2rem] font-medium leading-[1.45] tracking-[-0.02em] text-stone-400 sm:mt-10 sm:text-[1.4rem]"
      >
        Your own <span className="text-white">personal diagnostic engine</span> learns how you think, finds your <span className="text-white">weak topics</span>, and builds{' '}
        <span className="text-white">every next test</span> around you.
      </motion.p>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
        className="mt-9 flex flex-row flex-wrap items-center gap-3 sm:mt-10"
      >
        <PrimaryButton onClick={onStart}>
          <span>Start learning</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
        </PrimaryButton>
        <motion.button
          onClick={seeRound}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="group inline-flex cursor-pointer items-center gap-3 rounded-full bg-white/[0.06] py-1.5 pl-1.5 pr-5 text-sm font-semibold tracking-tight text-white shadow-[0_0_0_1px_rgba(255,255,255,0.11),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur transition-colors duration-300 hover:bg-white/[0.1]"
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0A0B10]">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-white/30" />
            <Play className="relative h-3.5 w-3.5 translate-x-[1px] fill-current" />
          </span>
          See one round
        </motion.button>
      </motion.div>

      {/* Points at the phone beside it, which is live */}
      <motion.p
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.3 }}
        className="mt-10 hidden items-center gap-2.5 text-[13px] text-stone-500 lg:flex"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-emerald-400/70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        The phone is live. Tap it, or scroll to play a round.
      </motion.p>
    </div>
  );
};

/* ------------------------------------------------------------- pinned, wide */

const PinnedLoop: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  // -1 is the opening: the phone is on its home screen and opens the app.
  const [active, setActive] = useState(-1);
  const [dir, setDir] = useState(1);
  const [loops, setLoops] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const introRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(-1);

  // The step crossing the middle of the screen is the one on the phone.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = Number((e.target as HTMLElement).dataset.step);
          const prev = activeRef.current;
          if (i === prev) continue;
          // Opening the app, or going back to its home screen, is a crossfade.
          setDir(i < 0 || prev < 0 ? 0 : i > prev ? 1 : -1);
          activeRef.current = i;
          setActive(i);
        }
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );
    if (introRef.current) io.observe(introRef.current);
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const goTo = (i: number) => {
    const el = i < 0 ? introRef.current : refs.current[i];
    if (!el) return;
    const r = el.getBoundingClientRect();
    window.scrollTo({ top: window.scrollY + r.top + r.height / 2 - window.innerHeight / 2, behavior: 'smooth' });
  };

  const next = () => {
    if (active === STEPS.length - 1) {
      setLoops((l) => l + 1);
      goTo(0);
    } else goTo(active + 1);
  };

  return (
    <div className="mx-auto hidden max-w-[1240px] grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-12 px-8 lg:grid">
      {/* The opening words, then the steps */}
      <div className="pb-[18vh]">
        <div ref={introRef} data-step={-1} className="flex min-h-[100svh] items-center pb-10 pt-28">
          <Intro onStart={onStart} />
        </div>
        {STEPS.map((s, i) => {
          const on = i === active;
          return (
            <div
              key={s.title}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-step={i}
              id={i === 0 ? 'step-1' : undefined}
              className="flex min-h-[72vh] items-center"
            >
              <motion.div
                animate={{ opacity: on ? 1 : 0.22, x: on ? 0 : -6, filter: on ? 'blur(0px)' : 'blur(1.5px)' }}
                transition={{ duration: 0.5, ease: EASE }}
                className="max-w-[30rem] cursor-pointer"
                onClick={() => goTo(i)}
              >
                <div className="flex items-center gap-4">
                  <span className={`font-mono text-sm tabular-nums ${on ? 'text-[#FF8A4C]' : 'text-stone-500'}`}>0{i + 1}</span>
                  <span className="h-px w-12 bg-gradient-to-r from-[#FF6321] to-transparent" />
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500">{LOOP_LABELS[i]}</span>
                </div>
                <h3 className="mt-5 text-balance text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.045em] text-white xl:text-[3.2rem]">{s.title}</h3>
                <p className="mt-5 text-pretty text-lg leading-relaxed text-stone-400">{s.body}</p>
                <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/[0.05] px-3.5 py-1.5 text-[12px] font-medium text-stone-300 shadow-[0_0_0_1px_rgba(255,255,255,0.09)]">
                  {i === STEPS.length - 1 && <Repeat2 className="h-3.5 w-3.5 text-[#FF8A4C]" />}
                  {i === 2 ? (
                    <>
                      <span className="h-2 w-2 rounded-full bg-rose-400" /> Red
                      <span className="ml-2 h-2 w-2 rounded-full bg-amber-400" /> Yellow
                      <span className="ml-2 h-2 w-2 rounded-full bg-emerald-400" /> Green
                    </>
                  ) : (
                    s.detail
                  )}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* The phone, pinned, on its own lit stage */}
      <div className="relative">
        <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center pt-16">
          {/* Light behind the device takes the mood of each step */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[48%] h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            animate={{ background: `radial-gradient(closest-side, rgba(${HALO[Math.max(active, 0)]},0.34), rgba(${HALO[Math.max(active, 0)]},0.07) 55%, transparent)` }}
            transition={{ duration: 0.9, ease: EASE }}
          />
          {/* A thin ring of light, turning slowly behind it */}
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[48%] h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 animate-[spin_22s_linear_infinite] rounded-full opacity-50 [background:conic-gradient(from_0deg,transparent_0deg,rgba(255,138,76,0.55)_40deg,transparent_110deg,transparent_200deg,rgba(255,99,33,0.35)_250deg,transparent_320deg)] [mask-image:radial-gradient(closest-side,transparent_93%,#000_94%,#000_99%,transparent)]" />
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[48%] h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.04)]" />

          <motion.div
            initial={{ opacity: 0, y: 70, rotate: -3 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 1.2, delay: 0.35, ease: EASE }}
            className="relative"
          >
            {/* The floor it stands on: a pool of shadow and a line of reflected light */}
            <div aria-hidden="true" className="absolute -bottom-7 left-1/2 h-12 w-[92%] -translate-x-1/2 rounded-[50%] bg-black/80 blur-xl" />
            <div aria-hidden="true" className="absolute -bottom-4 left-1/2 h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#FF8A4C]/60 to-transparent" />
            <Tilt3D max={5}>
              <PhoneDevice
                active={active}
                dir={dir}
                loops={loops}
                onUse={() => undefined}
                onNext={next}
                onSwipe={(by) => goTo(Math.min(STEPS.length - 1, Math.max(-1, active + by)))}
                launchLead={1.3}
                launchHint="Scroll to begin"
                className="w-[min(360px,calc((100svh-15rem)*0.56))]"
              />
            </Tilt3D>
          </motion.div>

          {/* What the phone is showing, in words */}
          <div className="relative mt-10 flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 rounded-full bg-white/[0.045] py-1.5 pl-1.5 pr-5 shadow-[0_0_0_1px_rgba(255,255,255,0.09),0_20px_40px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF6321] font-mono text-[11px] font-semibold text-white shadow-[0_6px_16px_-4px_rgba(255,99,33,0.8)]">
                {active < 0 ? <Smartphone className="h-3.5 w-3.5" /> : `0${active + 1}`}
              </span>
              <span className="relative h-5 w-[15.5rem] overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={active}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="absolute inset-0 truncate text-[14px] font-semibold leading-5 tracking-[-0.01em] text-white"
                  >
                    {active < 0 ? 'Open the app' : STEPS[active].title.replace(/\.$/, '')}
                  </motion.span>
                </AnimatePresence>
              </span>
            </div>
            <div className="flex items-center gap-2">
              {STEPS.map((s, i) => (
                <button key={s.title} onClick={() => goTo(i)} aria-label={`Step ${i + 1}: ${LOOP_LABELS[i]}`} className="group flex h-5 cursor-pointer items-center">
                  <span className={`block h-1.5 rounded-full transition-all duration-500 ${i === active ? 'w-7 bg-[#FF6321]' : 'w-1.5 bg-white/25 group-hover:bg-white/50'}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------ compact, phones */

const CompactLoop: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  // -1 is the opening: the phone opens the app, then the steps play.
  const [active, setActive] = useState(-1);
  const [dir, setDir] = useState(1);
  const [loops, setLoops] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!inView || paused || reduce) return;
    const t = setTimeout(() => {
      setDir(active < 0 ? 0 : 1);
      setActive((a) => {
        if (a === STEPS.length - 1) setLoops((l) => l + 1);
        return a === STEPS.length - 1 ? 0 : a + 1;
      });
    }, active < 0 ? LAUNCH_HOLD : HOLD);
    return () => clearTimeout(t);
  }, [active, inView, paused, reduce]);

  const step = (by: number) => {
    setDir(active < 0 || (by < 0 && active === 0) ? 0 : by);
    setActive((a) => {
      if (by > 0 && a === STEPS.length - 1) {
        setLoops((l) => l + 1);
        return 0;
      }
      return a + by < -1 ? STEPS.length - 1 : a + by;
    });
    setPaused(true);
  };

  return (
    <div ref={ref} className="px-4 sm:px-6 lg:hidden">
      <div id="loop-phone" className="relative flex justify-center">
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,99,33,0.3),transparent)] blur-2xl" />
        <PhoneDevice
          active={active}
          dir={dir}
          loops={loops}
          holdMs={HOLD}
          paused={paused}
          onUse={() => setPaused(true)}
          onNext={() => step(1)}
          onSwipe={step}
          launchLead={0.4}
          className="w-[min(330px,86vw)]"
        />
      </div>
      <p className="mt-6 flex items-center justify-center gap-2 text-[12px] text-stone-400">
        <Hand className="h-3.5 w-3.5 text-[#FF8A4C]" /> Tap the screen. Swipe to change steps.
      </p>

      <div className="mx-auto mt-10 max-w-md">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#FF8A4C]">{active < 0 ? 'Opening the app' : `Step ${active + 1} of ${STEPS.length}`}</div>
        <div className="mt-3 grid">
          {[{ title: 'Open the app.', body: 'Tap the ClassMap icon, and your first round begins.' }, ...STEPS].map((s, j) => (
            <motion.div
              key={s.title}
              aria-hidden={j - 1 !== active}
              initial={false}
              animate={{ opacity: j - 1 === active ? 1 : 0, y: j - 1 === active ? 0 : 10 }}
              transition={{ duration: 0.3, ease: EASE }}
              className={`col-start-1 row-start-1 ${j - 1 === active ? '' : 'pointer-events-none'}`}
            >
              <h3 className="text-[2rem] font-semibold leading-[1.05] tracking-[-0.04em] text-white">{s.title}</h3>
              <p className="mt-3 text-[16px] leading-relaxed text-stone-400">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ section */

export const LoopStory: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <section id="loop" className="relative overflow-x-clip bg-[#050507] pb-24 text-white lg:pb-0">
    {/* The page opens here, so the light comes from above */}
    <div aria-hidden="true" className="pointer-events-none absolute left-[-10%] top-[-14%] h-[820px] w-[1100px] rounded-full bg-[radial-gradient(closest-side,rgba(255,99,33,0.2),rgba(255,99,33,0.04)_55%,transparent)] blur-2xl" />

    {/* Phones and tablets: the words, then the phone */}
    <div className="relative px-4 pb-10 pt-28 sm:px-6 sm:pt-40 lg:hidden">
      <Intro onStart={onStart} />
    </div>

    <PinnedLoop onStart={onStart} />
    <CompactLoop />
  </section>
);
