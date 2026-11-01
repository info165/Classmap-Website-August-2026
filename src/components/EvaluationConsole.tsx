import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Brain, ScanLine, Sparkles, ShieldCheck, Clock } from 'lucide-react';
import { EASE } from './ui/primitives';

/**
 * The product, running, on a real answer sheet: the top of a Class 9 Social
 * Science paper, with the markers ClassMap
 * pinned to each answer. A beam reads down the answers while the report on the
 * right fills in with what ClassMap reported for this paper: 20 of 25 marks,
 * a grade A, and still a ranked study plan of four topics to fix.
 *
 * Neither the student's name nor the school is on the part of the sheet shown.
 */

type Tone = 'ok' | 'warn' | 'bad';

/** What ClassMap marked on answers 1 to 6, read in four passes. */
const LINES: { tone: Tone; note: string }[] = [
  { tone: 'ok', note: 'Q1 · Erosion, correct' },
  { tone: 'bad', note: 'Q2 · Wrong option' },
  { tone: 'ok', note: 'Q3–Q4 · Correct' },
  { tone: 'ok', note: 'Q5–Q6 · Correct' }
];
/** How far down the sheet the beam has read after each pass, and the answers checked. */
const BEAM = ['2%', '16%', '32%', '66%', '97%'];
const ANSWERS = [0, 1, 2, 4, 6];

const TONE = {
  ok: { dot: 'bg-emerald-400', text: 'text-emerald-300', ring: 'ring-emerald-400/30', bg: 'bg-emerald-400/10', mark: '#34D399' },
  warn: { dot: 'bg-amber-400', text: 'text-amber-300', ring: 'ring-amber-400/30', bg: 'bg-amber-400/10', mark: '#FBBF24' },
  bad: { dot: 'bg-rose-400', text: 'text-rose-300', ring: 'ring-rose-400/30', bg: 'bg-rose-400/10', mark: '#FB7185' }
} as const;

/** The study plan ClassMap made for this student, ranked by marks impact. */
const PLAN = [
  { rank: 'Fix first', topic: 'Human Evolution Stages', tone: 'text-rose-300', num: 'bg-rose-500' },
  { rank: 'Fix next', topic: 'Weathering and Erosion', tone: 'text-rose-300', num: 'bg-rose-500' },
  { rank: 'Then this', topic: "Earth's Interior Study Methods", tone: 'text-[#FF8A4C]', num: 'bg-[#FF6321]' },
  { rank: 'Then this', topic: 'Significance of Rivers in Ancient Civilizations', tone: 'text-stone-300', num: 'bg-stone-600' }
];

/** Steps: 0 idle, 1-4 each pass read, 5 report complete, then hold and loop. */
const STEP_MS = [700, 1100, 1100, 1100, 1100, 3600];

export const EvaluationConsole: React.FC = () => {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(reduce ? 5 : 0);

  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setStep((s) => (s + 1) % STEP_MS.length), STEP_MS[step]);
    return () => clearTimeout(t);
  }, [step, reduce]);

  const read = Math.min(step, 4); // passes read so far
  const done = step === 5;
  const beamTop = BEAM[read];

  return (
    <div className="relative">
      {/* Window */}
      <div className="relative overflow-hidden rounded-[22px] bg-[#0B0D13] shadow-[0_0_0_1px_rgba(255,255,255,0.09),0_60px_120px_-30px_rgba(255,99,33,0.28),0_40px_80px_-30px_rgba(0,0,0,0.9)]">
        {/* Chrome */}
        <div className="flex items-center justify-between border-b border-white/[0.07] bg-white/[0.025] px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]/80" />
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] tracking-tight text-stone-500">
            <ScanLine className="h-3.5 w-3.5 text-[#FF6321]" />
            classmap / diagnostic-engine
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-stone-500">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-emerald-400/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Live
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1.05fr_1fr]">
          {/* ------------------------------------------------------ script */}
          <div className="relative border-b border-white/[0.07] p-4 sm:p-6 md:border-b-0 md:border-r">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-stone-500">
                Answer sheet · Q1–Q6
              </span>
              <span className="rounded-full bg-white/[0.05] px-2.5 py-1 font-mono text-[10px] text-stone-400">
                Real student paper
              </span>
            </div>

            {/* The real sheet, with ClassMap's markers on it */}
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-[0_0_0_1px_rgba(255,255,255,0.1),inset_0_0_40px_rgba(120,90,40,0.08)]">
              <img
                src="/real-sheet-pointers.webp"
                alt="The top of a handwritten Class 9 Social Science answer sheet. ClassMap has pinned a marker to each answer: green on answers 1 and 3 to 6, red on answer 2, each joined by a dotted line to its question number in the margin."
                width={530}
                height={216}
                className="block h-auto w-full"
              />
              {/* Scan beam */}
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 z-10"
                animate={{ top: beamTop, opacity: step === 0 || done ? 0 : 1 }}
                transition={{ duration: 0.9, ease: EASE }}
                style={{ top: BEAM[0] }}
              >
                <div className="h-px w-full bg-[#FF6321] shadow-[0_0_14px_3px_rgba(255,99,33,0.85)]" />
                <div className="-mt-10 h-10 w-full bg-gradient-to-t from-[#FF6321]/25 to-transparent" />
              </motion.div>
            </div>

            {/* Line verdicts */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {LINES.map((l, i) => {
                const t = TONE[l.tone];
                const seen = read > i;
                return (
                  <motion.div
                    key={l.note}
                    animate={{ opacity: seen ? 1 : 0.28, y: seen ? 0 : 4 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2 text-[11px] font-medium ring-1 ring-inset ${t.bg} ${t.ring} ${t.text}`}
                  >
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${t.dot}`} />
                    <span className="truncate">{l.note}</span>
                  </motion.div>
                );
              })}
            </div>

            {/* Progress of the read */}
            <div className="mt-4 rounded-xl bg-white/[0.035] px-3.5 py-3 ring-1 ring-inset ring-white/[0.06]">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest">
                <span className={done ? 'text-emerald-300' : 'text-stone-500'}>
                  {done ? 'Paper graded' : step === 0 ? 'Ready' : 'Checking answers'}
                </span>
                <span className="tabular-nums text-stone-500">{ANSWERS[read]}/6</span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.07]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#FF6321] to-[#FFB27A]"
                  initial={false}
                  animate={{ width: `${(read / 4) * 100}%` }}
                  transition={{ duration: 0.9, ease: EASE }}
                />
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------ report */}
          <div className="relative p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-stone-500">
                Learning gap report
              </span>
              <span className="font-mono text-[10px] text-stone-500">Social Science · Class 9</span>
            </div>

            {/* Score vs verdict */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-2xl bg-white/[0.035] p-3.5 ring-1 ring-inset ring-white/[0.06]">
                <div className="font-mono text-[10px] uppercase tracking-widest text-stone-500">Marks say</div>
                <div className="mt-1.5 text-2xl font-semibold tabular-nums tracking-tight text-stone-500 line-through decoration-stone-600">
                  20 / 25
                </div>
                <div className="mt-0.5 text-[11px] text-stone-500">&ldquo;Grade A&rdquo;</div>
              </div>
              <div className="relative overflow-hidden rounded-2xl bg-[#FF6321]/[0.1] p-3.5 ring-1 ring-inset ring-[#FF6321]/30">
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#FF8A4C]">ClassMap says</div>
                <div className="mt-1.5 text-[15px] font-semibold leading-tight tracking-tight text-white">
                  Gaps still found
                </div>
                <motion.div
                  className="mt-1.5 text-[11px] text-[#FFB27A]"
                  animate={{ opacity: read >= 2 ? 1 : 0.3 }}
                >
                  4 topics to fix
                </motion.div>
              </div>
            </div>

            {/* The study plan, ranked by marks impact */}
            <div className="mt-4 rounded-2xl bg-white/[0.035] p-4 ring-1 ring-inset ring-white/[0.06]">
              <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-stone-500">
                <Brain className="h-3 w-3 text-[#FF6321]" />
                Study plan · by marks impact
              </div>
              <ol className="mt-3 space-y-2.5">
                {PLAN.map((p, i) => (
                  <motion.li
                    key={p.topic}
                    animate={{ opacity: read > i ? 1 : 0.25, x: read > i ? 0 : -4 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="flex items-start gap-2.5"
                  >
                    <span className={`mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white ${p.num}`}>{i + 1}</span>
                    <span className="min-w-0 leading-tight">
                      <span className={`block font-mono text-[9px] uppercase tracking-widest ${p.tone}`}>{p.rank}</span>
                      <span className="block truncate text-[12px] text-stone-200">{p.topic}</span>
                    </span>
                  </motion.li>
                ))}
              </ol>
            </div>

            {/* Remedy */}
            <motion.div
              animate={{ opacity: done ? 1 : 0.25, y: done ? 0 : 6 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="mt-3 flex items-start gap-3 rounded-2xl bg-gradient-to-br from-[#FF6321]/20 to-[#FF6321]/[0.05] p-4 ring-1 ring-inset ring-[#FF6321]/30"
            >
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FF6321] text-white shadow-[0_8px_20px_-6px_rgba(255,99,33,0.8)]">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[12px] font-semibold text-white">Start with #1</div>
                <div className="mt-0.5 text-[11px] leading-relaxed text-stone-300">
                  Write the definition 5 times. Use flashcards for daily recall.
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating proof points */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.9, ease: EASE }}
        className="absolute -top-9 right-12 hidden xl:block"
      >
        <div className="animate-float flex items-center gap-2.5 rounded-2xl bg-[#12141B]/90 px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_24px_50px_-14px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[12px] font-semibold text-white">DPDP Act 2023</div>
            <div className="text-[10px] text-stone-400">Compliant by design</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7, duration: 0.9, ease: EASE }}
        className="absolute -bottom-9 left-12 hidden xl:block"
      >
        <div className="animate-float flex items-center gap-2.5 rounded-2xl bg-[#12141B]/90 px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_24px_50px_-14px_rgba(0,0,0,0.8)] backdrop-blur-xl [animation-delay:-3s]">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FF6321]/15 text-[#FF8A4C]">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[12px] font-semibold text-white">12+ hrs saved / week</div>
            <div className="text-[10px] text-stone-400">per teacher</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
