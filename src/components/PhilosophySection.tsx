import React from 'react';
import { motion } from 'motion/react';
import { Brain } from 'lucide-react';
import { EASE, Eyebrow, GlowCard, Reveal, ScrollWords, Typewriter } from './ui/primitives';

const CARDS = [
  {
    n: '01',
    title: 'The Flaw of Traditional Report Cards',
    body: (
      <>
        Traditional tests condense weeks of student effort into a single number. They tell teachers and parents{' '}
        <span className="font-semibold text-stone-100">that</span> a child made a mistake, but conceal{' '}
        <span className="font-semibold text-stone-100">why</span> the mistake occurred.
      </>
    ),
    foot: 'Outcome: Re-testing without addressing the root misconception.',
    tone: 'muted'
  },
  {
    n: '02',
    title: 'Every Answer Sheet Contains Hidden Signals',
    body: 'A wrong answer in Physics is rarely lack of intelligence. It is often a subtle misconception formed months earlier—like confusing directional vectors or rushing fractional cancellation.',
    foot: 'ClassMap reads pen strokes, step logic, and reasoning patterns.',
    tone: 'brand'
  },
  {
    n: '03',
    title: 'Once a Child is Understood, Progress Follows',
    body: 'When teachers know the exact 10-minute intervention required, remediation becomes effortless. Anxiety vanishes. Students improve with genuine confidence.',
    foot: 'Result: Objective understanding replaces guesswork.',
    tone: 'result'
  }
] as const;

export const PhilosophySection: React.FC = () => {
  return (
    <section id="learning-graph" className="noise relative isolate overflow-hidden bg-[#07080C] pb-24 pt-28 text-white sm:pb-32 sm:pt-32">
      {/* A still, warm light behind the headline */}
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[-10%] -z-10 h-[700px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,99,33,0.22),rgba(255,99,33,0.05)_60%,transparent)] blur-2xl" />

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Narrative header */}
        <div className="mx-auto max-w-4xl space-y-7 text-center">
          <Reveal>
            <Eyebrow tone="dark" icon={<Brain className="h-3.5 w-3.5" />}>
              Learning Gap Intelligence
            </Eyebrow>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="text-balance text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-[5.2rem]">
              <span className="text-gradient-light">Marks tell you </span>
              {/* The strike draws itself across the phrase as it enters. */}
              <span className="relative inline-block text-stone-600">
                what happened
                <motion.span
                  aria-hidden="true"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
                  className="absolute left-0 right-0 top-[54%] h-[0.07em] origin-left rounded-full bg-[#FF6321]"
                />
              </span>
              <span className="text-gradient-light">.</span>
              <br />
              <span className="text-gradient-light">ClassMap explains </span>
              <span className="font-serif font-light italic text-gradient-brand">why</span>
              <span className="text-gradient-light">.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mx-auto max-w-2xl text-pretty text-base leading-relaxed text-stone-400 sm:text-lg lg:text-xl">
              For decades, education treated test scores like final judgments. A student scoring 62/100 was simply labeled &ldquo;average&rdquo;. But 62/100 is not a learning outcome—it is an unsolved mystery.
            </p>
          </Reveal>
        </div>

        {/* Three-step narrative */}
        <div className="relative mt-20 grid grid-cols-1 gap-5 sm:mt-28 md:grid-cols-3">
          {CARDS.map((c, i) => (
            <Reveal key={c.n} delay={i * 0.12}>
              <GlowCard tilt={3}
                glow={c.tone === 'muted' ? 'rgba(255,255,255,0.07)' : 'rgba(255, 99, 33, 0.16)'}
                glowEdge={c.tone === 'muted' ? 'rgba(255,255,255,0.35)' : 'rgba(255, 99, 33, 0.75)'}
                className={`group flex h-full flex-col rounded-[28px] p-7 sm:p-8 ${
                  c.tone === 'result'
                    ? 'bg-gradient-to-b from-[#2A1810] to-[#120D0B] shadow-[0_0_0_1px_rgba(255,99,33,0.35),0_40px_80px_-40px_rgba(255,99,33,0.45)]'
                    : 'bg-[#0E1016] shadow-[0_0_0_1px_rgba(255,255,255,0.07)]'
                }`}
              >
                <div className="relative z-10 flex flex-1 flex-col">
                  <span
                    className={`relative flex h-11 w-11 items-center justify-center rounded-full font-mono text-sm font-semibold ${
                      c.tone === 'muted'
                        ? 'bg-white/[0.06] text-stone-400'
                        : c.tone === 'brand'
                        ? 'bg-[#FF6321]/15 text-[#FF8A4C] ring-1 ring-inset ring-[#FF6321]/40'
                        : 'bg-[#FF6321] text-white shadow-[0_10px_28px_-6px_rgba(255,99,33,0.9)]'
                    }`}
                  >
                    {c.tone === 'result' && (
                      <span aria-hidden="true" className="absolute inset-0 animate-pulse-ring rounded-full bg-[#FF6321]/50" />
                    )}
                    <span className="relative">{c.n}</span>
                  </span>

                  <h3 className="mt-7 text-[1.55rem] font-semibold leading-[1.15] tracking-[-0.03em] text-white">{c.title}</h3>
                  <p className="mt-4 flex-1 text-[15px] leading-relaxed text-stone-400">{c.body}</p>

                  <div
                    className={`mt-8 border-t pt-5 font-mono text-[11px] leading-relaxed ${
                      c.tone === 'muted'
                        ? 'border-white/[0.07] text-stone-600'
                        : c.tone === 'brand'
                        ? 'border-white/[0.07] text-[#FF8A4C]'
                        : 'border-[#FF6321]/25 text-emerald-300'
                    }`}
                  >
                    <Typewriter text={c.foot} delay={0.5 + i * 0.3} />
                  </div>
                </div>
              </GlowCard>
            </Reveal>
          ))}
        </div>

        {/* Pull quote */}
        <Reveal className="mx-auto mt-24 max-w-4xl text-center sm:mt-32">
          <div className="font-serif text-6xl leading-none text-[#FF6321]/60" aria-hidden="true">
            &ldquo;
          </div>
          <blockquote className="-mt-4 text-balance font-serif text-2xl font-light italic leading-[1.3] tracking-tight text-stone-100 sm:text-4xl">
            <ScrollWords text="When we stop grading children and start understanding their thinking, education transforms from evaluation to genuine empowerment." />
          </blockquote>
          <div className="mt-8 font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-[#FF8A4C]">
            ClassMap Core Philosophy
          </div>
        </Reveal>
      </div>
    </section>
  );
};
