import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { ArrowRight, Check, FileStack, Sparkles } from 'lucide-react';
import { EASE, Reveal } from '../ui/primitives';
import { SHOTS, SUBJECTIVE } from './data';

/**
 * Handwritten answers, a whole class at a time.
 *
 * A stack of answer sheets is fed through: a beam reads the top sheet, it slips
 * away, and the next comes up, while the counter runs. When the last sheet is
 * read, the class report comes up beside it: the real subjective-results screen
 * from the teacher app, with its four headline numbers.
 */
const SHEETS = SUBJECTIVE.checked;
/** Five real handwritten answer sheets, in the order they are graded. */
const SHEET_IMGS = [1, 2, 3, 4, 5].map((i) => `/school/sheets/sheet-${i}.webp`);

/** Four quite different hands, each in its own ink, written in and then ticked as read. */
const HANDS = [
  { word: 'neat', font: "'Patrick Hand', cursive", size: 'text-[27px] sm:text-[29px]', ink: '#1E3A8A', tilt: 0 },
  { word: 'cursive', font: "'Dancing Script', cursive", size: 'text-[27px] sm:text-[29px] font-semibold', ink: '#111827', tilt: -4 },
  { word: 'rushed', font: "'Reenie Beanie', cursive", size: 'text-[31px] sm:text-[34px]', ink: '#1D4ED8', tilt: 4 },
  { word: 'untidy', font: "'Rock Salt', cursive", size: 'text-[18px] sm:text-[21px]', ink: '#3F3F46', tilt: -2 }
];
const STEP_MS = 900;
const HOLD_MS = 4200;

export const SubjectivePapers: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const live = useInView(ref, { amount: 0.35 });
  const [n, setN] = useState(reduce ? SHEETS : 0);
  const [round, setRound] = useState(0);
  const done = n >= SHEETS;

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
      done ? HOLD_MS : n === 0 ? 600 : STEP_MS
    );
    return () => clearTimeout(t);
  }, [n, done, live, reduce]);

  const left = SHEETS - n;

  return (
    <section id="papers" className="relative overflow-hidden bg-[#050507] py-24 text-white sm:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[30%] h-[800px] w-[1300px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,99,33,0.13),transparent)] blur-2xl" />

      <div className="relative mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <div className="flex items-center justify-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-[#FF8A4C]">
              <FileStack className="h-3.5 w-3.5" />
              Handwritten answers
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-5 text-balance text-[2.5rem] font-semibold leading-[1] tracking-[-0.05em] sm:text-6xl lg:text-[4.4rem]">
              <span className="text-gradient-light">A stack of papers in.</span> <span className="text-gradient-brand">A full report out.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-[17px] leading-relaxed text-stone-400">
              Upload your students’ handwritten answer sheets. ClassMap AI grades every one and builds a detailed report for each student and for the whole class, subject by subject.
            </p>
          </Reveal>

          {/* Any hand: each sample is written in, then ticked as read */}
          <div className="mt-9">
            <Reveal delay={0.16}>
              <div className="text-[15px] font-semibold tracking-[-0.01em] text-white">Reads any handwriting.</div>
            </Reveal>
            <ul className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {HANDS.map((h, i) => (
                <motion.li
                  key={h.word}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                  transition={{ delay: 0.25 + i * 0.35, duration: 0.4, ease: EASE }}
                  style={{ rotate: h.tilt }}
                  className="relative rounded-lg bg-[#F4F1EA] px-4 pb-1 pt-0.5 shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_16px_30px_-16px_rgba(0,0,0,0.9)] [background-image:repeating-linear-gradient(transparent_0_27px,rgba(80,110,200,0.18)_27px_28px)]"
                >
                  <motion.span
                    initial={reduce ? false : { clipPath: 'inset(0 100% 0 0)' }}
                    whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
                    viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                    transition={{ delay: 0.35 + i * 0.35, duration: 0.75, ease: [0.45, 0.05, 0.35, 1] }}
                    style={{ fontFamily: h.font, color: h.ink }}
                    className={`inline-block py-1 pr-1.5 leading-[1.15] ${h.size}`}
                  >
                    {h.word}
                  </motion.span>
                  <motion.span
                    initial={reduce ? false : { scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                    transition={{ delay: 1.1 + i * 0.35, type: 'spring', stiffness: 500, damping: 18 }}
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 text-[#07080C] shadow-[0_0_14px_rgba(52,211,153,0.6)]"
                  >
                    <Check className="h-3 w-3" strokeWidth={4} />
                  </motion.span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        <div ref={ref} className="mt-16 grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,340px)_auto_1fr] lg:gap-8">
          {/* --------------------------------------------------------- the stack */}
          <Reveal y={30}>
            <div className="relative mx-auto aspect-[780/1036] w-full max-w-[340px]">
              {Array.from({ length: SHEETS }).map((_, i) => {
                // depth 0 is the top of the pile
                const depth = i - n;
                const gone = depth < 0;
                return (
                  <motion.div
                    key={`${round}-${i}`}
                    className="absolute inset-0 overflow-hidden rounded-xl bg-[#F4F1EA] shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_30px_50px_-25px_rgba(0,0,0,0.9)]"
                    style={{ zIndex: SHEETS - i }}
                    initial={false}
                    animate={
                      gone
                        ? { x: 140, y: -30, rotate: 9, opacity: 0, scale: 0.92 }
                        : { x: depth * 7, y: depth * -9, rotate: depth * 1.6, opacity: depth > 3 ? 0 : 1 - depth * 0.12, scale: 1 - depth * 0.02 }
                    }
                    transition={{ type: 'spring', stiffness: 220, damping: 26 }}
                  >
                    <img
                      src={SHEET_IMGS[i % SHEET_IMGS.length]}
                      alt={depth === 0 ? `Handwritten answer sheet ${i + 1} of ${SHEETS}` : ''}
                      width={780}
                      height={1036}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                      style={{ filter: depth === 0 ? 'none' : 'grayscale(1) brightness(0.8)' }}
                    />
                    {/* The beam reads the top sheet */}
                    {depth === 0 && !done && !reduce && (
                      <motion.div
                        key={`beam-${round}-${n}`}
                        className="absolute inset-x-0 z-10"
                        initial={{ top: '0%', opacity: 0 }}
                        animate={{ top: '100%', opacity: [0, 1, 1, 0] }}
                        transition={{ duration: STEP_MS / 1000 - 0.1, ease: [0.45, 0.05, 0.35, 1] }}
                      >
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FF9A66]/35 to-transparent" />
                        <div className="relative h-px bg-white shadow-[0_0_12px_2px_rgba(255,255,255,0.8),0_0_40px_10px_rgba(255,120,60,0.6)]" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}

              {/* All graded */}
              <AnimatePresence>
                {done && (
                  <motion.div
                    key={`done-${round}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-white/[0.03] text-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300 shadow-[0_0_30px_-4px_rgba(52,211,153,0.6)]">
                      <Sparkles className="h-5 w-5" />
                    </span>
                    <span className="mt-3 text-[15px] font-semibold text-white">All {SHEETS} sheets graded</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="mx-auto mt-6 max-w-[340px]">
              <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.16em]">
                <span className={done ? 'text-emerald-300' : 'text-stone-400'}>{done ? 'Report ready' : `Grading sheet ${Math.min(n + 1, SHEETS)} of ${SHEETS}`}</span>
                <span className="tabular-nums text-stone-500">{left > 0 ? `${left} left` : 'done'}</span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.08]">
                <motion.div
                  className={`h-full rounded-full ${done ? 'bg-emerald-400' : 'bg-gradient-to-r from-[#FF6321] to-[#FFB27A]'}`}
                  initial={false}
                  animate={{ width: `${(n / SHEETS) * 100}%` }}
                  transition={{ duration: 0.5, ease: EASE }}
                />
              </div>
            </div>
          </Reveal>

          {/* Arrow between */}
          <div className="hidden justify-center lg:flex" aria-hidden="true">
            <motion.span
              animate={{ x: [0, 6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF6321]/12 text-[#FF8A4C] shadow-[0_0_0_1px_rgba(255,99,33,0.35)]"
            >
              <ArrowRight className="h-5 w-5" />
            </motion.span>
          </div>

          {/* --------------------------------------------------------- the report */}
          <Reveal y={30} delay={0.1}>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {[
                { k: 'Students checked', v: SUBJECTIVE.checked, s: '', tone: 'text-sky-300' },
                { k: 'Class average', v: SUBJECTIVE.average, s: '%', tone: 'text-amber-300' },
                { k: 'Need help', v: SUBJECTIVE.needHelp, s: '', tone: 'text-rose-300' },
                { k: 'To review', v: SUBJECTIVE.review, s: '', tone: 'text-amber-200' }
              ].map((x, i) => (
                <motion.div
                  key={x.k}
                  animate={{ opacity: done ? 1 : 0.35, y: done ? 0 : 6 }}
                  transition={{ delay: done ? i * 0.08 : 0, duration: 0.45, ease: EASE }}
                  className="rounded-2xl bg-white/[0.04] px-4 py-3.5 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
                >
                  <div className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-stone-500">{x.k}</div>
                  <div className={`mt-1 text-2xl font-semibold tabular-nums tracking-[-0.04em] ${x.tone}`}>
                    {done ? x.v : 0}
                    {x.s}
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div
              animate={{ opacity: done ? 1 : 0.3, filter: done ? 'blur(0px)' : 'blur(3px)', y: done ? 0 : 10 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="mt-3 overflow-hidden rounded-2xl bg-white shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_50px_90px_-40px_rgba(0,0,0,0.95)]"
            >
              <img
                src={SHOTS.subjective.src}
                alt="The subjective results screen for Mathematics, Class 8-A: 5 students checked, a 58% class average, 1 student below 50%, 5 sheets to review, topics listed weakest first and concepts split into weakest and strongest."
                width={SHOTS.subjective.w}
                height={SHOTS.subjective.h}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full"
              />
            </motion.div>
          </Reveal>
        </div>
        <p className="mt-8 text-center font-mono text-[11px] tracking-tight text-stone-600">The report is the real subjective-results screen in the ClassMap teacher app.</p>
      </div>
    </section>
  );
};
