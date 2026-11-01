import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  FileText,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Brain,
  Layers,
  RotateCcw,
  TrendingDown,
  ScanLine
} from 'lucide-react';
import { ANSWER_SHEET_SAMPLES, AnswerSheetSample } from '../data/mockData';
import { CountUp, EASE, Reveal, ScrollTilt, SectionHeading, WipeIn } from './ui/primitives';

interface HandwrittenEvaluatorProps {
  onOpenAudit: () => void;
}

/* One tone per annotation / layer type, defined whole so Tailwind can see the
   class names at build time. */
const ANNOTATION_TONE = {
  concept: { ink: 'decoration-rose-500', chip: 'bg-rose-500/12 text-rose-700', note: 'bg-rose-50 text-rose-900 ring-rose-200' },
  reasoning: { ink: 'decoration-amber-500', chip: 'bg-amber-500/15 text-amber-700', note: 'bg-amber-50 text-amber-900 ring-amber-200' },
  presentation: { ink: 'decoration-sky-500', chip: 'bg-sky-500/12 text-sky-700', note: 'bg-sky-50 text-sky-900 ring-sky-200' },
  positive: { ink: 'decoration-emerald-500', chip: 'bg-emerald-500/12 text-emerald-700', note: 'bg-emerald-50 text-emerald-900 ring-emerald-200' }
} as const;

const NODE_TONE = {
  mastered: { bar: 'from-emerald-500 to-emerald-300', chip: 'bg-emerald-400/15 text-emerald-300', ring: 'ring-emerald-400/20' },
  misconception: { bar: 'from-amber-500 to-amber-300', chip: 'bg-amber-400/15 text-amber-300', ring: 'ring-amber-400/20' },
  gap: { bar: 'from-rose-500 to-rose-300', chip: 'bg-rose-400/15 text-rose-300', ring: 'ring-rose-400/20' }
} as const;

/** A dark layer card used for layers 1-4. */
const Layer: React.FC<{
  n: number;
  title: string;
  icon: React.ReactNode;
  items: string[];
  tone: 'rose' | 'amber' | 'sky' | 'violet';
  delay?: number;
}> = ({ n, title, icon, items, tone, delay = 0 }) => {
  const t = {
    rose: 'bg-rose-400/[0.08] ring-rose-400/20 text-rose-300',
    amber: 'bg-amber-400/[0.08] ring-amber-400/20 text-amber-300',
    sky: 'bg-sky-400/[0.08] ring-sky-400/20 text-sky-300',
    violet: 'bg-violet-400/[0.08] ring-violet-400/20 text-violet-300'
  }[tone];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.55, delay, ease: EASE }}
      className={`rounded-2xl p-4 ring-1 ring-inset ${t}`}
    >
      <div className="flex items-center gap-2 text-xs font-semibold">
        {icon}
        <span>
          {n}. {title}
        </span>
      </div>
      <ul className="mt-2.5 space-y-2 text-[13px] leading-relaxed text-stone-300">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-current opacity-70" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export const HandwrittenEvaluator: React.FC<HandwrittenEvaluatorProps> = ({ onOpenAudit }) => {
  const [selectedSample, setSelectedSample] = useState<AnswerSheetSample>(ANSWER_SHEET_SAMPLES[0]);
  const [activeTab, setActiveTab] = useState<'intelligence' | 'conceptMap'>('intelligence');
  const b = selectedSample.intelligenceBreakdown;

  return (
    <section id="evaluator-demo" className="relative overflow-hidden bg-[#07080C] pb-16 pt-24 text-white sm:pb-20 sm:pt-32">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[-6%] h-[620px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,99,33,0.16),transparent)] blur-2xl" />
      <div aria-hidden="true" className="bg-grid-dark pointer-events-none absolute inset-x-0 top-0 h-[900px] opacity-40" />

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="AI diagnostic intelligence"
          eyebrowIcon={<FileText className="h-3.5 w-3.5" />}
          tone="dark"
          title="Handwritten subjective answer evaluation."
          lede="Students write on traditional paper with pen. ClassMap parses handwritten reasoning step-by-step, uncovers hidden misconceptions, and maps conceptual gaps for schools and coaching institutes."
        />

        {/* Sample selector */}
        <Reveal className="mt-12 flex flex-col items-center gap-3">
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-stone-500">
            Select a sample paper
          </span>
          <div className="scrollbar-none flex max-w-full gap-1 overflow-x-auto rounded-full bg-white/[0.05] p-1.5 ring-1 ring-inset ring-white/[0.08]">
            {ANSWER_SHEET_SAMPLES.map((sample) => {
              const selected = selectedSample.id === sample.id;
              return (
                <button
                  key={sample.id}
                  onClick={() => setSelectedSample(sample)}
                  className={`relative flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-semibold tracking-tight transition-colors duration-300 sm:px-5 ${
                    selected ? 'text-white' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="sample-pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                      className="absolute inset-0 rounded-full bg-[#FF6321]/90 shadow-[0_8px_24px_-8px_rgba(255,99,33,0.8)]"
                    />
                  )}
                  <span className={`relative h-1.5 w-1.5 rounded-full ${selected ? 'bg-white' : 'bg-[#FF6321]'}`} />
                  <span className="relative">{sample.subject}</span>
                  <span className="relative font-mono text-[10px] opacity-70">{sample.grade}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Inspector window */}
        <ScrollTilt className="mt-8">
          <div className="overflow-hidden rounded-[30px] bg-[#0B0D13] shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_60px_120px_-40px_rgba(255,99,33,0.3),0_40px_80px_-30px_rgba(0,0,0,0.9)]">
            {/* Title bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] bg-white/[0.025] px-5 py-4 sm:px-7">
              <div className="flex items-center gap-4">
                <div className="hidden items-center gap-1.5 sm:flex">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]/80" />
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedSample.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="text-sm font-semibold tracking-tight text-white">
                      {selectedSample.subject} <span className="text-stone-600">/</span> {selectedSample.topic}
                    </div>
                    <div className="text-xs text-stone-500">
                      Student: <span className="font-medium text-stone-300">{selectedSample.studentName}</span> ({selectedSample.grade})
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="rounded-full bg-white/[0.05] px-3 py-1.5 font-mono text-stone-400 ring-1 ring-inset ring-white/[0.07]">
                  Traditional score{' '}
                  <span className="ml-1 font-semibold text-stone-500 line-through">{selectedSample.traditionalMarks}</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-[#FF6321]/12 px-3 py-1.5 font-semibold text-[#FF8A4C] ring-1 ring-inset ring-[#FF6321]/30">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-[#FF6321]/70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF6321]" />
                  </span>
                  <ScanLine className="h-3.5 w-3.5" />
                  ClassMap: Misconception Mapped
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* ---------------------------------------------------- script */}
              <div className="border-b border-white/[0.07] p-5 sm:p-7 lg:col-span-6 lg:border-b-0 lg:border-r">
                <div className="mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-stone-500">
                    <FileText className="h-3.5 w-3.5 text-[#FF6321]" />
                    Original student script · {selectedSample.questionNumber}
                  </span>
                  <span className="hidden rounded-full bg-white/[0.05] px-2.5 py-1 font-mono text-[10px] text-stone-400 sm:inline-block">
                    Pen on lined paper
                  </span>
                </div>

                <p className="mb-4 rounded-2xl bg-white/[0.04] p-4 text-[13px] leading-relaxed text-stone-300 ring-1 ring-inset ring-white/[0.07]">
                  <span className="font-semibold text-[#FF8A4C]">Question </span>
                  {selectedSample.questionText}
                </p>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedSample.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="relative overflow-hidden rounded-2xl bg-[#F6F1E4] p-5 pl-12 shadow-[inset_0_0_40px_rgba(120,90,40,0.12)]"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(to bottom, transparent 0, transparent 31px, rgba(80,110,170,0.2) 31px, rgba(80,110,170,0.2) 32px)'
                    }}
                  >
                    <div className="absolute inset-y-0 left-9 w-px bg-rose-400/50" />
                    {/* One scan on arrival */}
                    <motion.div
                      aria-hidden="true"
                      initial={{ top: '0%', opacity: 1 }}
                      animate={{ top: '100%', opacity: [1, 1, 0] }}
                      transition={{ duration: 1.5, ease: EASE, delay: 0.2 }}
                      className="pointer-events-none absolute inset-x-0 z-10"
                    >
                      <div className="h-px bg-[#FF6321] shadow-[0_0_16px_4px_rgba(255,99,33,0.8)]" />
                      <div className="-mt-12 h-12 bg-gradient-to-t from-[#FF6321]/25 to-transparent" />
                    </motion.div>

                    <div className="relative space-y-5">
                      {selectedSample.teacherAnnotations.map((anno, idx) => {
                        const t = ANNOTATION_TONE[anno.type];
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 + idx * 0.2, ease: EASE }}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <WipeIn
                                delay={0.45 + idx * 0.2}
                                duration={0.85}
                                className={`font-hand text-[23px] font-semibold leading-tight text-[#1F2A44] underline decoration-[3px] decoration-wavy underline-offset-[6px] sm:text-[26px] ${t.ink}`}
                              >
                                {anno.line}
                              </WipeIn>
                              <span className={`mt-1.5 shrink-0 rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider ${t.chip}`}>
                                {anno.type}
                              </span>
                            </div>
                            <div className={`mt-2.5 rounded-xl px-3 py-2 text-[12px] leading-relaxed ring-1 ring-inset ${t.note}`}>
                              {anno.text}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-[#FF6321]/[0.08] px-4 py-3 text-xs ring-1 ring-inset ring-[#FF6321]/20">
                  <span className="font-medium text-stone-200">
                    Evaluation configured for CBSE, ICSE, IB &amp; State Board Rubrics
                  </span>
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#FF8A4C]">
                    Automated step analysis
                  </span>
                </div>
              </div>

              {/* --------------------------------------------- intelligence */}
              <div className="flex flex-col justify-between p-5 sm:p-7 lg:col-span-6">
                <div>
                  <div className="mb-5 inline-flex rounded-full bg-white/[0.05] p-1 ring-1 ring-inset ring-white/[0.07]">
                    {(
                      [
                        ['intelligence', '7-Layer Gap Intelligence'],
                        ['conceptMap', 'Concept Graph Node Map']
                      ] as const
                    ).map(([id, label]) => (
                      <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`relative cursor-pointer rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                          activeTab === id ? 'text-white' : 'text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        {activeTab === id && (
                          <motion.span
                            layoutId="eval-tab"
                            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                            className="absolute inset-0 rounded-full bg-[#FF6321] shadow-[0_8px_20px_-6px_rgba(255,99,33,0.8)]"
                          />
                        )}
                        <span className="relative">{label}</span>
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {activeTab === 'intelligence' ? (
                      <motion.div
                        key={`i-${selectedSample.id}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.35, ease: EASE }}
                        className="space-y-3"
                      >
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <Layer delay={0.05} n={1} title="Concept Gaps" tone="rose" icon={<AlertTriangle className="h-3.5 w-3.5" />} items={b.conceptGaps} />
                          <Layer delay={0.13} n={2} title="Reasoning & Logic Flow" tone="amber" icon={<Brain className="h-3.5 w-3.5" />} items={b.reasoningFlaws} />
                          <Layer delay={0.21} n={3} title="Presentation & Steps" tone="sky" icon={<Layers className="h-3.5 w-3.5" />} items={b.presentationFlaws} />
                          <Layer delay={0.29} n={4} title="Misconception Pattern" tone="violet" icon={<RotateCcw className="h-3.5 w-3.5" />} items={b.misconceptionPatterns} />
                        </div>

                        <div className="rounded-2xl bg-white/[0.04] p-4 ring-1 ring-inset ring-white/[0.07]">
                          <div className="flex items-center gap-2 text-xs font-semibold text-white">
                            <TrendingDown className="h-3.5 w-3.5 text-[#FF6321]" />
                            5. Longitudinal Recurring Mistakes
                          </div>
                          <p className="mt-2 text-[13px] leading-relaxed text-stone-300">{b.recurringMistakes[0]}</p>
                          <p className="mt-2 text-xs italic text-stone-500">Behavior: {b.learningBehavior}</p>
                        </div>

                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FF6321]/25 to-[#FF6321]/[0.06] p-4 ring-1 ring-inset ring-[#FF6321]/40">
                          <div className="flex items-center gap-2 text-xs font-semibold text-[#FFB27A]">
                            <Sparkles className="h-3.5 w-3.5" />
                            7. Actionable Teacher &amp; Student Remedy
                          </div>
                          <p className="mt-2 text-[13px] font-medium leading-relaxed text-white">{b.remedialAction}</p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key={`c-${selectedSample.id}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.35, ease: EASE }}
                        className="space-y-3"
                      >
                        <div className="rounded-2xl bg-white/[0.04] p-3.5 text-xs text-stone-400 ring-1 ring-inset ring-white/[0.07]">
                          Connected concept graph for <span className="font-semibold text-white">{selectedSample.topic}</span>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {selectedSample.conceptMapNodes.map((node, i) => {
                            const t = NODE_TONE[node.status];
                            return (
                              <div key={node.concept} className={`flex flex-col justify-between rounded-2xl bg-white/[0.04] p-4 ring-1 ring-inset ${t.ring}`}>
                                <div className="flex items-start justify-between gap-2">
                                  <span className="text-[13px] font-semibold leading-snug text-white">{node.concept}</span>
                                  <span className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider ${t.chip}`}>
                                    {node.status}
                                  </span>
                                </div>
                                <div className="mt-5">
                                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${node.impactScore}%` }}
                                      transition={{ duration: 1.1, delay: 0.15 + i * 0.1, ease: EASE }}
                                      className={`h-full rounded-full bg-gradient-to-r ${t.bar}`}
                                    />
                                  </div>
                                  <div className="mt-2 text-right font-mono text-[10px] text-stone-500">
                                    Mastery score: <CountUp to={node.impactScore} suffix="%" duration={1100} className="text-stone-300" />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-5">
                  <div className="text-xs text-stone-500">Supports Schools &amp; Coaching Centres across India</div>
                  <button
                    onClick={onOpenAudit}
                    className="group inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-[#FF8A4C] transition-colors hover:text-[#FFB27A]"
                  >
                    Book demo for your institution
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ScrollTilt>
      </div>
    </section>
  );
};
