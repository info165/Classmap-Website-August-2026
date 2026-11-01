import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { Bell, Check, Radio, Send } from 'lucide-react';
import { EASE, Reveal } from '../ui/primitives';
import { SHOTS } from './data';

/**
 * Two ways to test: push it to every student's account, or run it live in the
 * classroom on clickers. Both are shown happening, side by side, and both end
 * in the same class report.
 *
 * The questions, levels and answer counts are an illustration; the clicker
 * screen below them is the real teacher app.
 */

/* ------------------------------------------------------------ push a test */

const STUDENTS = ['Kiara', 'Ishaan', 'Myra'];

const PushDemo: React.FC<{ live: boolean }> = ({ live }) => {
  const reduce = useReducedMotion();
  // 0 ready, 1 pressed, 2 sent (phones lit), then hold and loop
  const [stage, setStage] = useState(reduce ? 2 : 0);
  const [round, setRound] = useState(0);

  useEffect(() => {
    if (!live || reduce) return;
    const t = setTimeout(
      () => {
        if (stage < 2) setStage(stage + 1);
        else {
          setStage(0);
          setRound((r) => r + 1);
        }
      },
      stage === 0 ? 1200 : stage === 1 ? 500 : 3600
    );
    return () => clearTimeout(t);
  }, [stage, live, reduce]);

  return (
    <div className="flex h-full flex-col">
      {/* The teacher's side */}
      <div className="rounded-2xl bg-white/[0.04] p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500">Class 7-A · Mathematics</div>
        <div className="mt-1.5 flex items-center justify-between gap-3">
          <div>
            <div className="text-[15px] font-semibold tracking-[-0.02em] text-white">Area</div>
            <div className="text-[12px] text-stone-400">3 topics selected</div>
          </div>
          <motion.span
            animate={{ scale: stage === 1 ? 0.92 : 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 18 }}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12.5px] font-semibold text-white transition-colors duration-300 ${stage >= 2 ? 'bg-emerald-500' : 'bg-[#FF6321] shadow-[0_8px_22px_-6px_rgba(255,99,33,0.8)]'}`}
          >
            <Send className="h-3.5 w-3.5" />
            {stage >= 2 ? 'Sent to 32 students' : 'Push test'}
          </motion.span>
        </div>
      </div>

      {/* The path the test travels */}
      <div className="relative mx-auto my-3 h-10 w-px bg-white/10">
        {stage >= 1 && !reduce && (
          <motion.span
            key={round}
            className="absolute left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#FF6321] shadow-[0_0_14px_3px_rgba(255,99,33,0.9)]"
            initial={{ top: '-10%', opacity: 1 }}
            animate={{ top: '100%', opacity: [1, 1, 0] }}
            transition={{ duration: 0.55, ease: 'easeIn' }}
          />
        )}
      </div>

      {/* The students' phones */}
      <div className="grid flex-1 grid-cols-3 gap-2.5">
        {STUDENTS.map((name, i) => (
          <div key={name} className="relative flex flex-col items-center">
            <div className="relative aspect-[9/17] w-full max-w-[110px] rounded-[18px] bg-[#16181F] p-[3px] shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_20px_40px_-20px_rgba(0,0,0,0.9)]">
              <div className="relative h-full w-full overflow-hidden rounded-[15px] bg-[#0B0D13]">
                <span className="absolute left-1/2 top-1.5 h-1.5 w-8 -translate-x-1/2 rounded-full bg-black" />
                <AnimatePresence>
                  {stage >= 2 && (
                    <motion.div
                      key={`${round}-${name}`}
                      initial={{ y: -40, opacity: 0, scale: 0.9 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.12, type: 'spring', stiffness: 320, damping: 22 }}
                      className="absolute inset-x-1.5 top-5 rounded-xl bg-white/[0.1] p-2 backdrop-blur"
                    >
                      <div className="flex items-center gap-1 text-[8px] font-semibold text-white">
                        <Bell className="h-2.5 w-2.5 text-[#FF8A4C]" />
                        New test
                      </div>
                      <div className="mt-0.5 text-[9px] leading-tight text-stone-300">Area</div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {stage >= 2 && (
                    <motion.div
                      key={`pushed-${round}-${name}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: 0.5 + i * 0.12, duration: 0.4, ease: EASE }}
                      className="absolute inset-x-1.5 bottom-3 flex items-center justify-center gap-1 rounded-lg bg-emerald-400/15 py-2 text-[10px] font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-400/30"
                    >
                      <Check className="h-3 w-3" strokeWidth={3.5} />
                      Pushed
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <span className="mt-2 text-[11.5px] font-medium text-stone-400">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ------------------------------------------------------- test it in class */

const OPTIONS = [
  { k: 'A', t: '13 cm²' },
  { k: 'B', t: '20 cm²' },
  { k: 'C', t: '40 cm²' },
  { k: 'D', t: '26 cm²' }
];
const CORRECT = 1;
/** The answers the class gives, in the order they come in. */
const ANSWERS = [1, 1, 2, 1, 0, 1, 1, 2, 1, 3, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 3];
const CLICKERS = 12;

const ClickerDemo: React.FC<{ live: boolean }> = ({ live }) => {
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? ANSWERS.length : 0);
  const [round, setRound] = useState(0);
  const done = n >= ANSWERS.length;

  useEffect(() => {
    if (!live || reduce) return;
    const t = setTimeout(
      () => {
        if (!done) setN(n + 1);
        else {
          setN(0);
          setRound((r) => r + 1);
        }
      },
      done ? 3400 : n === 0 ? 900 : 130
    );
    return () => clearTimeout(t);
  }, [n, done, live, reduce]);

  const counts = OPTIONS.map((_, i) => ANSWERS.slice(0, n).filter((a) => a === i).length);
  const max = Math.max(1, ...counts);
  const right = Math.round((counts[CORRECT] / ANSWERS.length) * 100);

  return (
    <div className="flex h-full flex-col">
      {/* The classroom screen */}
      <div className="rounded-2xl bg-gradient-to-b from-[#1A1C24] to-[#111319] p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.1)]">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500">
          <span>Question 4 of 10</span>
          <span className="tabular-nums text-stone-300">
            {Math.min(n, ANSWERS.length)}/{ANSWERS.length} answered
          </span>
        </div>
        <div className="mt-2 text-[14.5px] font-semibold leading-snug tracking-[-0.01em] text-white">A triangle has base 8 cm and height 5 cm. What is its area?</div>
        <div className="mt-3 space-y-1.5">
          {OPTIONS.map((o, i) => {
            const good = done && i === CORRECT;
            return (
              <div key={o.k} className="relative flex h-8 items-center overflow-hidden rounded-lg bg-white/[0.04]">
                <motion.span
                  className="absolute inset-y-0 left-0 rounded-lg"
                  style={{ background: good ? 'rgba(16,185,129,0.35)' : 'rgba(255,99,33,0.22)' }}
                  initial={false}
                  animate={{ width: `${(counts[i] / max) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 220, damping: 26 }}
                />
                <span className="relative flex w-full items-center justify-between px-3 text-[12.5px]">
                  <span className={`font-semibold ${good ? 'text-emerald-300' : 'text-white'}`}>
                    <span className="mr-2 font-mono text-stone-400">{o.k}</span>
                    {o.t}
                  </span>
                  <span className="font-mono tabular-nums text-stone-300">{counts[i]}</span>
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-2.5 h-4 text-[12px] font-medium">
          <AnimatePresence>
            {done && (
              <motion.span key={round} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-emerald-300">
                {right}% of the class got it right.
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* The clickers in students' hands */}
      <div className="mt-4 grid flex-1 grid-cols-6 content-end gap-2">
        {Array.from({ length: CLICKERS }).map((_, i) => {
          // Each clicker stands for two students in the count.
          const answered = n > i * 2;
          const key = answered ? OPTIONS[ANSWERS[i * 2]].k : '';
          return (
            <div key={i} className="flex flex-col items-center">
              <div className={`relative w-full max-w-[44px] rounded-[10px] p-1.5 transition-colors duration-200 ${answered ? 'bg-[#22252E]' : 'bg-[#16181F]'} shadow-[0_0_0_1px_rgba(255,255,255,0.1)]`}>
                <span className={`mx-auto block h-1.5 w-1.5 rounded-full transition-all duration-200 ${answered ? 'bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.8)]' : 'bg-white/15'}`} />
                <div className="mt-1.5 grid grid-cols-2 gap-[3px]">
                  {OPTIONS.map((o) => (
                    <span
                      key={o.k}
                      className={`flex h-2.5 items-center justify-center rounded-[3px] text-[6px] font-bold transition-colors duration-200 ${key === o.k ? 'bg-[#FF6321] text-white' : 'bg-white/[0.08] text-white/40'}`}
                    >
                      {o.k}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------- section */

export const TestModes: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const live = useInView(ref, { amount: 0.3 });

  return (
    <section id="tests" className="relative overflow-hidden bg-[#050507] py-24 text-white sm:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[15%] h-[700px] w-[1200px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,99,33,0.13),transparent)] blur-2xl" />
      <div className="relative mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <h2 className="text-balance text-[2.5rem] font-semibold leading-[1] tracking-[-0.05em] sm:text-6xl lg:text-[4.4rem]">
              <span className="text-gradient-light">Two ways to test.</span> <span className="text-gradient-brand">One clear report.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-[17px] leading-relaxed text-stone-400">
              Push a test straight to your students, with questions at different levels, or run it live in class with a clicker in every hand.
            </p>
          </Reveal>
        </div>

        <div ref={ref} className="mt-16 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[
            { k: 'push', icon: Send, title: 'Push to students', body: 'The test lands in every student’s account, at the level each one is ready for.', demo: <PushDemo live={live} /> },
            { k: 'class', icon: Radio, title: 'Take it in class', body: 'Questions go up on the classroom screen. Students answer on their clickers, and you see the class respond live.', demo: <ClickerDemo live={live} /> }
          ].map((m, i) => (
            <Reveal key={m.k} delay={i * 0.1}>
              <div className="flex h-full flex-col rounded-[30px] bg-[#0B0C11] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.08),inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF6321]/12 text-[#FF8A4C] shadow-[0_0_0_1px_rgba(255,99,33,0.3)]">
                    <m.icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-2xl font-semibold tracking-[-0.03em] text-white">{m.title}</h3>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-stone-400">{m.body}</p>
                <div className="mt-7 min-h-[360px] flex-1">{m.demo}</div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* The real clicker screen */}
        <Reveal y={30} className="mx-auto mt-14 max-w-[980px]">
          <div className="grid grid-cols-1 items-center gap-6 rounded-[28px] bg-white/[0.03] p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] sm:p-6 md:grid-cols-[1fr_1.6fr]">
            <div className="px-2">
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#FF8A4C]">In the teacher app</div>
              <h3 className="mt-3 text-[1.6rem] font-semibold leading-tight tracking-[-0.03em] text-white">Every student, paired with a clicker.</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-stone-400">Each student’s clicker is linked to their name, so every answer counts toward their own report.</p>
            </div>
            <div className="overflow-hidden rounded-2xl bg-white shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)]">
              <img
                src={SHOTS.clickers.src}
                alt="The teacher app listing students by roll number, each with their subjects and the ID of the clicker paired to them."
                width={SHOTS.clickers.w}
                height={SHOTS.clickers.h}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full"
              />
            </div>
          </div>
          <p className="mt-5 text-center font-mono text-[11px] tracking-tight text-stone-600">The demos above are illustrations; the clicker list is the real teacher app.</p>
        </Reveal>
      </div>
    </section>
  );
};
