import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check, Plus } from 'lucide-react';
import { CountUp, EASE, Eyebrow, GlowCard, PrimaryButton, Reveal } from '../ui/primitives';
import { FAQ, PRICE } from './data';

const INCLUDED = [
  'Adaptive tests that move up or down with your score',
  'Self-tests whenever you want them',
  'Detailed reports in red, yellow and green',
  'Video lessons for the topics you are weak in',
  'AI grading of your handwritten answer sheets',
  'A study plan built around your exam date'
];

interface PricingProps {
  onStart: () => void;
}

export const Pricing: React.FC<PricingProps> = ({ onStart }) => (
  <section id="pricing" className="noise relative isolate overflow-hidden bg-[#050507] py-24 text-white sm:py-32">
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute left-1/2 top-[10%] h-[640px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,99,33,0.2),transparent)] blur-3xl" />
      <div className="bg-grid-dark absolute inset-0 opacity-35" />
    </div>

    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <Eyebrow tone="dark">Pricing</Eyebrow>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="text-gradient-light mt-6 text-balance text-[2.3rem] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl lg:text-[3.4rem]">
            One plan. Everything included.
          </h2>
        </Reveal>
      </div>

      <Reveal y={40} className="mx-auto mt-14 max-w-[560px]">
        <GlowCard
          tilt={2}
          glow="rgba(255, 99, 33, 0.16)"
          className="beam rounded-[34px] bg-[#0C0E14] p-8 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_80px_140px_-50px_rgba(255,99,33,0.45),inset_0_1px_0_rgba(255,255,255,0.07)] sm:p-11"
        >
          <div className="relative z-10">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#FF8A4C]">For students, for now</div>
            <div className="mt-6 flex items-start justify-center gap-1">
              <span className="mt-3 text-3xl font-semibold text-stone-400">₹</span>
              <span className="text-gradient-light text-[6.5rem] font-semibold leading-none tracking-[-0.07em]">
                <CountUp to={PRICE} duration={1600} />
              </span>
            </div>
            <div className="mt-1 text-base text-stone-400">a month</div>

            <ul className="mx-auto mt-9 max-w-sm space-y-3.5 text-left">
              {INCLUDED.map((t, i) => (
                <motion.li
                  key={t}
                  initial={{ opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.55, ease: EASE }}
                  className="flex items-start gap-3 text-[15px] leading-snug text-stone-200"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FF6321] text-white shadow-[0_6px_14px_-4px_rgba(255,99,33,0.8)]">
                    <Check className="h-3 w-3" strokeWidth={3.5} />
                  </span>
                  {t}
                </motion.li>
              ))}
            </ul>

            <div className="mt-10">
              <PrimaryButton onClick={onStart} className="!py-4">
                <span>Start learning</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </PrimaryButton>
            </div>
          </div>
        </GlowCard>
      </Reveal>
    </div>
  </section>
);

export const Faq: React.FC = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="noise relative isolate overflow-hidden bg-[#050507] pb-24 pt-8 text-white sm:pb-32">
      <div className="mx-auto max-w-[860px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-gradient-light text-center text-[2rem] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-4xl">
            Questions, answered.
          </h2>
        </Reveal>

        <div className="mt-10 border-b border-white/[0.09]">
          {FAQ.map((f, i) => {
            const on = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.05} y={14}>
                <div className="border-t border-white/[0.09]">
                  <button
                    onClick={() => setOpen(on ? null : i)}
                    aria-expanded={on}
                    className="group flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left"
                  >
                    <span className={`text-[17px] font-medium tracking-[-0.015em] transition-colors duration-300 ${on ? 'text-white' : 'text-stone-300 group-hover:text-white'}`}>
                      {f.q}
                    </span>
                    <motion.span
                      animate={{ rotate: on ? 45 : 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1 ring-inset transition-colors duration-300 ${
                        on ? 'bg-[#FF6321] text-white ring-[#FF6321]' : 'bg-white/[0.04] text-stone-400 ring-white/10'
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div
                        key="a"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-[680px] pb-6 text-[15px] leading-relaxed text-stone-400">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
