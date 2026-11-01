import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  BarChart3,
  UserCheck,
  LayoutDashboard,
  Building2,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Zap,
  ArrowRight
} from 'lucide-react';
import { DASHBOARD_TABS, CLASS_HEATMAP_DATA } from '../data/mockData';
import { CountUp, EASE, Reveal, ScrollTilt, SectionHeading } from './ui/primitives';

interface ProductShowcaseProps {
  onOpenAudit: () => void;
}

/** Mastery value -> the tone the whole product uses for it. */
const heat = (v: number) =>
  v >= 80
    ? { cell: 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/30', bar: 'bg-emerald-400' }
    : v >= 60
    ? { cell: 'bg-amber-400/10 text-amber-300 ring-amber-400/30', bar: 'bg-amber-400' }
    : { cell: 'bg-rose-400/10 text-rose-300 ring-rose-400/30', bar: 'bg-rose-400' };

const statusTone = (s: string) =>
  s === 'Mastered'
    ? 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/30'
    : s === 'Review Needed'
    ? 'bg-amber-400/10 text-amber-300 ring-amber-400/30'
    : 'bg-rose-400/10 text-rose-300 ring-rose-400/30';

const HeatCell: React.FC<{ value: number; index: number }> = ({ value, index }) => {
  const h = heat(value);
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 + index * 0.025, duration: 0.5, ease: EASE }}
      className={`relative inline-flex min-w-[68px] flex-col items-center rounded-xl px-3 pb-2 pt-1.5 font-mono text-[13px] font-semibold ring-1 ring-inset ${h.cell} ${value < 50 ? 'animate-soft-pulse' : ''}`}
    >
      {value}%
      <span className="mt-1 h-[3px] w-full overflow-hidden rounded-full bg-white/[0.1]">
        <motion.span
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ delay: 0.25 + index * 0.025, duration: 0.9, ease: EASE }}
          className={`block h-full rounded-full ${h.bar}`}
        />
      </span>
    </motion.span>
  );
};

/** A small rising line that draws itself. Illustrative of the trend, not a plot. */
const Sparkline: React.FC = () => (
  <svg viewBox="0 0 60 20" className="h-5 w-14" fill="none" aria-hidden="true">
    <motion.path
      d="M1 17 C9 16 11 12 19 13 S31 8 39 8 S51 4 59 2"
      stroke="#34D399"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.4, delay: 0.3, ease: EASE }}
    />
    <motion.circle
      cx="59"
      cy="2"
      r="2.4"
      fill="#34D399"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.6, type: 'spring', stiffness: 300 }}
    />
  </svg>
);

/** A ring that fills to the share of a 10-minute lesson the task takes. */
const TimeRing: React.FC<{ mins: number }> = ({ mins }) => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 -rotate-90" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="rgba(52,211,153,0.2)" strokeWidth="3" />
    <motion.circle
      cx="12"
      cy="12"
      r="9"
      stroke="#34D399"
      strokeWidth="3"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: mins / 10 }}
      transition={{ duration: 1.1, delay: 0.4, ease: EASE }}
    />
  </svg>
);

const Kpi: React.FC<{
  label: string;
  children: React.ReactNode;
  note: string;
  noteTone?: 'good' | 'muted';
  delay: number;
}> = ({ label, children, note, noteTone = 'good', delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: EASE }}
    whileHover={{ y: -5 }}
    className="rounded-2xl bg-white/[0.04] p-6 ring-1 ring-inset ring-white/[0.08] transition-shadow duration-500 hover:shadow-[0_30px_50px_-28px_rgba(255,99,33,0.35)]"
  >
    <span className="block font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-stone-400">{label}</span>
    <span className="mt-3 block text-3xl font-semibold tracking-[-0.04em]">{children}</span>
    <span className={`mt-2 block text-xs font-medium ${noteTone === 'good' ? 'text-emerald-300' : 'text-stone-400'}`}>{note}</span>
  </motion.div>
);

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({ onOpenAudit }) => {
  const [activeTab, setActiveTab] = useState<string>('heatmap');

  return (
    <section id="dashboards" className="relative overflow-hidden bg-[#07080C] pb-24 pt-10 text-white sm:pb-32 sm:pt-12">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,99,33,0.14),transparent)] blur-2xl" />

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Usable intelligence dashboards"
          eyebrowIcon={<LayoutDashboard className="h-3.5 w-3.5" />}
          tone="dark"
          title="Designed for action, not unread analytics."
          lede={
            <>
              Every dashboard in ClassMap answers one question for its user:{' '}
              <span className="font-semibold text-white">&ldquo;What should I do next to help this student learn?&rdquo;</span>
            </>
          }
        />

        {/* View selector */}
        <Reveal className="mt-12">
          <div className="scrollbar-none mx-auto flex w-fit max-w-full gap-1 overflow-x-auto rounded-[22px] bg-white/[0.05] p-1.5 ring-1 ring-inset ring-white/[0.08]">
            {DASHBOARD_TABS.map((tab) => {
              const selected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative shrink-0 cursor-pointer rounded-2xl px-5 py-3 text-left transition-colors duration-300 ${
                    selected ? 'text-white' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="dash-pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                      className="absolute inset-0 rounded-2xl bg-[#FF6321]/90 shadow-[0_8px_24px_-8px_rgba(255,99,33,0.8)]"
                    />
                  )}
                  <span className="relative block text-[13px] font-semibold tracking-tight">{tab.label}</span>
                  <span className={`relative block font-mono text-[10px] ${selected ? 'text-white/80' : 'text-stone-500'}`}>
                    {tab.role}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Dashboard window */}
        <ScrollTilt className="mt-8">
          <div className="overflow-hidden rounded-[30px] bg-[#0B0D13] shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_60px_120px_-40px_rgba(255,99,33,0.3),0_40px_80px_-30px_rgba(0,0,0,0.9)]">
            <div className="flex items-center gap-1.5 border-b border-white/[0.07] bg-white/[0.025] px-5 py-3.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]/80" />
              <span className="ml-3 font-mono text-[11px] text-stone-500">
                classmap / {DASHBOARD_TABS.find((t) => t.id === activeTab)?.label.toLowerCase().replace(/\s+/g, '-')}
              </span>
            </div>

            <div className="p-5 sm:p-8 lg:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="space-y-7"
                >
                  {/* ------------------------------------------- heatmap */}
                  {activeTab === 'heatmap' && (
                    <>
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h3 className="flex items-center gap-2.5 text-xl font-semibold tracking-[-0.02em] text-white sm:text-2xl">
                            <BarChart3 className="h-5 w-5 text-[#FF6321]" />
                            Class 10 Physics &amp; Chemistry — Concept Mastery Heatmap
                          </h3>
                          <p className="mt-1.5 text-sm text-stone-400">
                            Aggregated subjective test results across 3 sections (120 students)
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                          {[
                            ['Mastered (>80%)', 'bg-emerald-400', 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/30'],
                            ['Review Needed', 'bg-amber-400', 'bg-amber-400/10 text-amber-300 ring-amber-400/30'],
                            ['Critical Gap', 'bg-rose-400', 'bg-rose-400/10 text-rose-300 ring-rose-400/30']
                          ].map(([l, dot, c]) => (
                            <span key={l} className={`flex items-center gap-1.5 rounded-full px-3 py-1 ring-1 ring-inset ${c}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                              {l}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="-mx-1 overflow-x-auto px-1">
                        <table className="w-full min-w-[640px] text-left text-sm">
                          <thead>
                            <tr className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-stone-500">
                              <th className="pb-3 pr-4 font-medium">Syllabus concept / learning outcome</th>
                              <th className="px-2 pb-3 text-center font-medium">10-A</th>
                              <th className="px-2 pb-3 text-center font-medium">10-B</th>
                              <th className="px-2 pb-3 text-center font-medium">10-C</th>
                              <th className="pb-3 pl-4 text-right font-medium">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {CLASS_HEATMAP_DATA.map((row, idx) => (
                              <motion.tr
                                key={row.concept}
                                initial={{ backgroundColor: 'rgba(255,99,33,0.12)' }}
                                animate={{ backgroundColor: 'rgba(255,99,33,0)' }}
                                transition={{ delay: 0.2 + idx * 0.14, duration: 1.1 }}
                                className="group border-t border-white/[0.06] transition-colors hover:bg-white/[0.03]"
                              >
                                <td className="py-3.5 pr-4 font-medium text-stone-100">{row.concept}</td>
                                <td className="px-2 py-3.5 text-center"><HeatCell value={row.sectionA} index={idx * 3} /></td>
                                <td className="px-2 py-3.5 text-center"><HeatCell value={row.sectionB} index={idx * 3 + 1} /></td>
                                <td className="px-2 py-3.5 text-center"><HeatCell value={row.sectionC} index={idx * 3 + 2} /></td>
                                <td className="py-3.5 pl-4 text-right">
                                  <span className={`inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset ${statusTone(row.overall)}`}>
                                    {row.overall === 'Critical Gap' && (
                                      <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-soft-pulse rounded-full bg-rose-400" />
                                    )}
                                    {row.overall}
                                  </span>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-5 rounded-2xl bg-gradient-to-br from-[#FF6321]/[0.16] to-[#FF6321]/[0.04] p-5 ring-1 ring-inset ring-[#FF6321]/30 sm:p-6">
                        <div className="max-w-2xl space-y-1.5">
                          <span className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#FF8A4C]">
                            <Zap className="h-3.5 w-3.5 fill-current" />
                            Recommended classroom intervention
                          </span>
                          <p className="text-[15px] leading-relaxed text-stone-200">
                            Sections 10-A, 10-B, and 10-C show &lt;45% mastery in <span className="font-semibold text-white">&ldquo;Vector Direction of Friction&rdquo;</span>. A 10-minute micro-lesson before starting Chapter 4 is recommended.
                          </p>
                        </div>
                        <button
                          onClick={onOpenAudit}
                          className="group inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-[#FF6321] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_26px_-8px_rgba(255,99,33,0.7)] transition-colors hover:bg-[#FF7A3D]"
                        >
                          Generate 10-Min Remedial Sheet
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                      </div>
                    </>
                  )}

                  {/* ---------------------------------- student profile */}
                  {activeTab === 'student-profile' && (
                    <>
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF8A4C] to-[#F0530F] text-base font-semibold text-white shadow-[0_10px_24px_-8px_rgba(255,99,33,0.7)]">
                            AG
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-xl font-semibold tracking-[-0.02em] text-white sm:text-2xl">
                                Aarav Gupta — Student Learning Graph
                              </h3>
                              <span className="rounded-full bg-[#FF6321]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#FF8A4C]">Level 4</span>
                            </div>
                            <p className="mt-1 text-sm text-stone-400">
                              Class 6 • CBSE Mathematics &amp; Science • Roll No. 08 • Tracked since Class 5
                            </p>
                          </div>
                        </div>
                        <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-400/30">
                          <Sparkline />
                          <span>
                            Grade Growth: +<CountUp to={18.4} decimals={1} suffix="%" /> this Term
                          </span>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="space-y-3 rounded-2xl bg-emerald-400/[0.06] p-5 ring-1 ring-inset ring-emerald-400/20">
                          <h4 className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-300">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            Mastered concepts (90%+)
                          </h4>
                          <ul className="space-y-2 text-[13px] font-medium text-emerald-100">
                            {['Proper & Improper Fractions', 'Decimal Place Value Conversions', 'Least Common Multiple (LCM)'].map((c, i) => (
                              <motion.li
                                key={c}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.15 + i * 0.1, duration: 0.5, ease: EASE }}
                                className="flex items-center gap-2 rounded-xl bg-white/[0.04] p-3 ring-1 ring-inset ring-emerald-400/15"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                                {c}
                              </motion.li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-3 rounded-2xl bg-amber-400/[0.06] p-5 ring-1 ring-inset ring-amber-400/20">
                          <h4 className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-300">
                            <AlertTriangle className="h-4 w-4 text-amber-400" />
                            Active learning gap
                          </h4>
                          <div className="space-y-2 rounded-xl bg-white/[0.04] p-4 ring-1 ring-inset ring-amber-400/25">
                            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#FF8A4C]">Identified gap</span>
                            <p className="text-[14px] font-semibold leading-snug text-white">
                              Struggles with <span className="text-[#FF8A4C]">Negative Denominators</span> in fraction division.
                            </p>
                            <p className="text-xs leading-relaxed text-stone-400">
                              Needs 5 diagnostic practice reps to stabilize numerator sign rules.
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3 rounded-2xl bg-gradient-to-br from-[#FF6321]/[0.16] to-[#FF6321]/[0.04] p-5 ring-1 ring-inset ring-[#FF6321]/30">
                          <h4 className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#FF8A4C]">
                            <Sparkles className="h-4 w-4" />
                            Parent insight card
                          </h4>
                          <p className="text-[13px] leading-relaxed text-stone-200">
                            Aarav has high numeric speed. Do not assign extra long repetitive homework—assign 5 targeted diagnostic fraction reps instead.
                          </p>
                          <button
                            onClick={onOpenAudit}
                            className="w-full cursor-pointer rounded-full bg-[#FF6321] py-2.5 text-xs font-semibold text-white shadow-[0_10px_26px_-8px_rgba(255,99,33,0.7)] transition-colors hover:bg-[#FF7A3D]"
                          >
                            Send Automated Parent Report
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* ------------------------------------ teacher hub */}
                  {activeTab === 'teacher-hub' && (
                    <>
                      <div>
                        <h3 className="flex items-center gap-2.5 text-xl font-semibold tracking-[-0.02em] text-white sm:text-2xl">
                          <UserCheck className="h-5 w-5 text-[#FF6321]" />
                          Teacher Action Hub — 10-Minute Remedial Lessons
                        </h3>
                        <p className="mt-1.5 text-sm text-stone-400">
                          Saves teachers 12 hours every week by generating targeted micro-lessons directly from test evaluation data.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {[
                          {
                            subject: 'Mathematics Class 6',
                            affected: '14 Students Affected',
                            title: 'Micro-Lesson: Fraction Division with Negative Denominators',
                            body: 'Use a 5-minute visual number line exercise showing why dividing by a negative number flips the direction vector on the graph.',
                            time: 'Estimated Time: 8 Mins',
                            mins: 8,
                            cta: 'Print Practice Worksheet'
                          },
                          {
                            subject: 'Physics Class 10',
                            affected: '18 Students Affected',
                            title: 'Micro-Lesson: Thermal Energy Loss in Friction & Braking',
                            body: 'Demonstrate energy conservation in vehicle braking to address the misconception that friction forces eliminate energy completely.',
                            time: 'Estimated Time: 10 Mins',
                            mins: 10,
                            cta: 'View Micro-Lesson Slide'
                          }
                        ].map((c, i) => (
                          <motion.div
                            key={c.title}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.1, duration: 0.6, ease: EASE }}
                            className="flex flex-col rounded-2xl bg-white/[0.04] p-6 ring-1 ring-inset ring-white/[0.08] transition-shadow duration-300 hover:shadow-[0_24px_40px_-24px_rgba(255,99,33,0.35)]"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="rounded-full bg-[#FF6321]/15 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#FF8A4C]">
                                {c.subject}
                              </span>
                              <span className="font-mono text-xs text-stone-400">{c.affected}</span>
                            </div>
                            <h4 className="mt-5 text-lg font-semibold leading-snug tracking-[-0.02em] text-white">{c.title}</h4>
                            <p className="mt-2.5 flex-1 text-sm leading-relaxed text-stone-400">{c.body}</p>
                            <div className="mt-6 flex items-center justify-between gap-3">
                              <span className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                                <TimeRing mins={c.mins} />
                                {c.time}
                              </span>
                              <button
                                onClick={onOpenAudit}
                                className="cursor-pointer rounded-full bg-[#FF6321] px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_26px_-8px_rgba(255,99,33,0.7)] transition-colors hover:bg-[#FF7A3D]"
                              >
                                {c.cta}
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* ---------------------------------- school leader */}
                  {activeTab === 'school-leader' && (
                    <>
                      <div>
                        <h3 className="flex items-center gap-2.5 text-xl font-semibold tracking-[-0.02em] text-white sm:text-2xl">
                          <Building2 className="h-5 w-5 text-[#FF6321]" />
                          School Leadership &amp; Academic Director Overview
                        </h3>
                        <p className="mt-1.5 text-sm text-stone-400">
                          Macro institutional health analytics across all grades (Class 6 to Class 12)
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Kpi label="Total students mapped" note="100% Subjective Coverage" delay={0.05}>
                          <CountUp to={1850} className="text-white" />
                        </Kpi>
                        <Kpi label="Average concept mastery" note="+18.4% vs Last Unit Test" delay={0.15}>
                          <CountUp to={78.4} decimals={1} suffix="%" className="text-emerald-300" />
                        </Kpi>
                        <Kpi label="Teacher time saved" note="Per teacher average" noteTone="muted" delay={0.25}>
                          <CountUp to={12.5} decimals={1} suffix=" hrs/wk" className="text-[#FF8A4C]" />
                        </Kpi>
                        <Kpi label="Board alignment" note="Fully Compliant" delay={0.35}>
                          <span className="text-white">CBSE / ICSE</span>
                        </Kpi>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </ScrollTilt>
      </div>
    </section>
  );
};
