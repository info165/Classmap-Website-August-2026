import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BarChart3, TriangleAlert, Users } from 'lucide-react';
import { CountUp, EASE, Reveal } from '../ui/primitives';
import { BAND, REPORT, conceptBand } from './data';

/**
 * What a test turns into: the class report.
 *
 * Every figure here is the demo class as it appears in the teacher app (Class
 * 8-A, A Square and A Cube): the class average, the concepts with their
 * scores, the students who need help, and what to teach next. It is rebuilt
 * here so it can be read at a glance and animate in.
 */
/** One concept: its name, its score, and a bar coloured by band. */
const ConceptRow: React.FC<{ name: string; v: number; i: number }> = ({ name, v, i }) => {
  const b = BAND[conceptBand(v)];
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-[14px]">
        <span className="truncate text-stone-200">{name}</span>
        <span className={`font-mono font-semibold tabular-nums ${b.text}`}>{v}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${b.solid}AA, ${b.solid})`, boxShadow: `0 0 12px ${b.glow}` }}
          initial={{ width: 0 }}
          whileInView={{ width: `${v}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.15 + i * 0.08, ease: EASE }}
        />
      </div>
    </div>
  );
};

const Ring: React.FC<{ part: number; whole: number }> = ({ part, whole }) => {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 128 128" className="h-32 w-32 -rotate-90" aria-hidden="true">
      <circle cx="64" cy="64" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="11" />
      <motion.circle
        cx="64"
        cy="64"
        r={r}
        fill="none"
        stroke={BAND.red.solid}
        strokeWidth="11"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        whileInView={{ strokeDashoffset: c * (1 - part / whole) }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, delay: 0.2, ease: EASE }}
        style={{ filter: `drop-shadow(0 0 8px ${BAND.red.glow})` }}
      />
    </svg>
  );
};

export const ClassReport: React.FC = () => (
  <section id="report" className="relative overflow-hidden bg-[#050507] py-24 text-white sm:py-36">
    <div aria-hidden="true" className="pointer-events-none absolute right-[-8%] top-[20%] h-[700px] w-[900px] rounded-full bg-[radial-gradient(closest-side,rgba(244,63,94,0.1),transparent)] blur-3xl" />
    <div aria-hidden="true" className="pointer-events-none absolute left-[-8%] bottom-[0%] h-[600px] w-[800px] rounded-full bg-[radial-gradient(closest-side,rgba(255,99,33,0.12),transparent)] blur-3xl" />

    <div className="relative mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className="text-balance text-[2.5rem] font-semibold leading-[1] tracking-[-0.05em] sm:text-6xl lg:text-[4.4rem]">
            <span className="text-gradient-light">Every test becomes</span> <span className="text-gradient-brand">a plan.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-[17px] leading-relaxed text-stone-400">
            The moment a test ends, you see the weak topics, the strong ones, what needs attention, and exactly which students need what.
          </p>
        </Reveal>
      </div>

      <Reveal y={40} className="mt-16">
        <div className="overflow-hidden rounded-[32px] bg-[#0A0B10] shadow-[0_0_0_1px_rgba(255,255,255,0.09),0_80px_140px_-50px_rgba(255,99,33,0.35)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] bg-white/[0.025] px-6 py-4">
            <div className="flex items-center gap-2.5 text-[14px] font-semibold text-white">
              <BarChart3 className="h-4 w-4 text-[#FF6321]" />
              {REPORT.className} · {REPORT.subject} · {REPORT.chapter}
            </div>
            <div className="flex items-center gap-3 text-[11px] text-stone-400">
              {(['red', 'yellow', 'green'] as const).map((b) => (
                <span key={b} className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: BAND[b].solid }} />
                  {BAND[b].label}
                </span>
              ))}
            </div>
          </div>

          {/* Numbers */}
          <div className="grid grid-cols-2 border-b border-white/[0.07] lg:grid-cols-4">
            {[
              { k: 'Class average', v: <CountUp to={REPORT.average} suffix="%" />, tone: 'text-amber-300' },
              { k: 'Submissions', v: <CountUp to={REPORT.submissions} />, tone: 'text-white' },
              { k: 'Need help', v: <CountUp to={REPORT.needHelp} />, tone: 'text-rose-300' },
              { k: 'Concepts that need work', v: <><CountUp to={REPORT.conceptsWeak} /><span className="text-stone-500"> / {REPORT.concepts}</span></>, tone: 'text-white' }
            ].map((x, i) => (
              <div key={x.k} className={`px-6 py-6 ${i % 2 === 1 ? 'border-l border-white/[0.07]' : ''} ${i > 1 ? 'border-t border-white/[0.07] lg:border-t-0' : ''} ${i > 0 ? 'lg:border-l lg:border-white/[0.07]' : ''}`}>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500">{x.k}</div>
                <div className={`mt-2 text-4xl font-semibold tracking-[-0.05em] tabular-nums ${x.tone}`}>{x.v}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr]">
            {/* Concepts, weakest first */}
            <div className="p-6 sm:p-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500">Weakest concepts</div>
              <div className="mt-5 space-y-4">
                {REPORT.rows.slice(0, 5).map((row, i) => (
                  <ConceptRow key={row.name} name={row.name} v={row.v} i={i} />
                ))}
              </div>

              <div className="mt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300/80">Strongest concepts</div>
              <div className="mt-5 space-y-4">
                {REPORT.strong.map((row, i) => (
                  <ConceptRow key={row.name} name={row.name} v={row.v} i={5 + i} />
                ))}
              </div>
            </div>

            {/* Who needs what */}
            <div className="border-t border-white/[0.07] p-6 sm:p-8 lg:border-l lg:border-t-0">
              <div className="flex items-center gap-5">
                <div className="relative shrink-0">
                  <Ring part={REPORT.conceptsWeak} whole={REPORT.concepts} />
                  <span className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-semibold tabular-nums tracking-[-0.04em] text-white">
                      {REPORT.conceptsWeak}/{REPORT.concepts}
                    </span>
                    <span className="text-[10px] text-stone-500">need work</span>
                  </span>
                </div>
                <p className="text-[14px] leading-relaxed text-stone-400">
                  Of the {REPORT.concepts} concepts in this chapter, {REPORT.conceptsWeak} still need work. The map shows exactly which.
                </p>
              </div>

              <div className="mt-7 rounded-2xl bg-white/[0.04] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#FF8A4C]">
                  <TriangleAlert className="h-3.5 w-3.5" />
                  Teach next
                </div>
                <div className="mt-2 text-[16px] font-semibold tracking-[-0.02em] text-white">{REPORT.teachNext}</div>

                <div className="mt-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500">
                  <Users className="h-3.5 w-3.5" />
                  Students below 60%
                </div>
                <ul className="mt-2.5 space-y-2">
                  {REPORT.students.map((s, i) => (
                    <motion.li
                      key={s}
                      initial={{ opacity: 0, x: 12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.5, ease: EASE }}
                      className="flex items-center gap-3 rounded-xl bg-rose-400/[0.07] px-3 py-2 ring-1 ring-inset ring-rose-400/20"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#FF8A4C] to-[#F0530F] text-[10px] font-semibold text-white">
                        {s.split(' ').map((w) => w[0]).join('')}
                      </span>
                      <span className="text-[14px] text-white">{s}</span>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#FF6321] px-4 py-2 text-[12.5px] font-semibold text-white shadow-[0_8px_22px_-6px_rgba(255,99,33,0.8)]">
                  Reteach to {REPORT.needHelp} students
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-5 text-center font-mono text-[11px] tracking-tight text-stone-600">Figures from the demo class in the ClassMap teacher app; the two strongest concepts are illustrative.</p>
      </Reveal>
    </div>
  </section>
);
