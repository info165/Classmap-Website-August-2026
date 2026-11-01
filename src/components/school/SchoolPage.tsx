import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check, GraduationCap, Mail, Phone, Plus, School, UsersRound } from 'lucide-react';
import { EASE, GlowCard, PrimaryButton, Reveal, WordReveal } from '../ui/primitives';
import { SchoolOverview } from './SchoolHero';
import { AdminRoutine } from './AdminRoutine';
import { TeacherDesk } from './TeacherDesk';
import { TestModes } from './TestModes';
import { ClassReport } from './ClassReport';
import { SubjectivePapers } from './SubjectivePapers';
import { FAQ } from './data';

/**
 * The For Schools page. Black and orange throughout.
 *
 * It opens on the admin planning the routine, then follows the product the way
 * a school uses it: every class and subject on one screen, each teacher gets a
 * dashboard,
 * tests run two ways (pushed to students, or on clickers in class), every test
 * becomes a class report, and handwritten papers are graded by AI. Then price
 * (quoted on request) and questions.
 */

const INCLUDED = [
  'An admin account for the school',
  'A personal dashboard for every teacher',
  'The ClassMap app for every student',
  'In-class tests on clicker devices',
  'AI grading of handwritten answer sheets',
  'Detailed reports for every student and class'
];

const FACTORS = [
  { icon: School, label: 'Classes' },
  { icon: UsersRound, label: 'Students' },
  { icon: GraduationCap, label: 'Teachers' }
];

const Pricing: React.FC<{ onQuote: () => void }> = ({ onQuote }) => (
  <section id="pricing" className="relative overflow-hidden bg-[#050507] py-24 text-white sm:py-36">
    <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[20%] h-[700px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,99,33,0.2),transparent)] blur-3xl" />
    <div className="relative mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className="text-balance text-[2.5rem] font-semibold leading-[1] tracking-[-0.05em] sm:text-6xl lg:text-[4.4rem]">
            <span className="text-gradient-light">Priced for</span> <span className="text-gradient-brand">your school.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-[17px] leading-relaxed text-stone-400">
            Every school is different, so we quote after understanding how ClassMap will be used.
          </p>
        </Reveal>
      </div>

      <Reveal y={40} className="mt-14">
        <GlowCard
          tilt={2}
          glow="rgba(255, 99, 33, 0.14)"
          className="beam rounded-[36px] bg-[#0B0C11] shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_80px_140px_-50px_rgba(255,99,33,0.45),inset_0_1px_0_rgba(255,255,255,0.07)]"
        >
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_1.1fr]">
            <div className="flex flex-col p-8 sm:p-11">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#FF8A4C]">For schools</div>
              <div className="mt-5 text-[3.2rem] font-semibold leading-[0.95] tracking-[-0.055em] sm:text-[4.2rem]">
                <span className="text-gradient-light">Quote</span>
                <br />
                <span className="text-gradient-brand">on request.</span>
              </div>
              <p className="mt-6 text-[15px] leading-relaxed text-stone-400">Your quote is built around three things:</p>
              <div className="mt-4 grid grid-cols-3 gap-2.5">
                {FACTORS.map(({ icon: Icon, label }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.5, ease: EASE }}
                    className="flex flex-col items-center gap-2 rounded-2xl bg-white/[0.04] py-4 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
                  >
                    <Icon className="h-5 w-5 text-[#FF8A4C]" />
                    <span className="text-[13px] font-semibold text-white">{label}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-auto pt-9">
                <PrimaryButton onClick={onQuote} className="!py-4">
                  <span>Request a quote</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </PrimaryButton>
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-stone-400">
                  <a href="tel:+918981716969" className="inline-flex items-center gap-2 transition-colors hover:text-white">
                    <Phone className="h-3.5 w-3.5 text-[#FF6321]" />
                    +91-8981716969
                  </a>
                  <a href="mailto:info@classmap.in" className="inline-flex items-center gap-2 transition-colors hover:text-white">
                    <Mail className="h-3.5 w-3.5 text-[#FF6321]" />
                    info@classmap.in
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-white/[0.07] p-8 sm:p-11 md:border-l md:border-t-0">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone-500">Everything included</div>
              <ul className="mt-6 space-y-4">
                {INCLUDED.map((t, i) => (
                  <motion.li
                    key={t}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + i * 0.07, duration: 0.5, ease: EASE }}
                    className="flex items-start gap-3 text-[15px] leading-snug text-stone-200"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FF6321] text-white shadow-[0_6px_14px_-4px_rgba(255,99,33,0.8)]">
                      <Check className="h-3 w-3" strokeWidth={3.5} />
                    </span>
                    {t}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </GlowCard>
      </Reveal>
    </div>
  </section>
);

const Faq: React.FC = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-[#050507] pb-24 pt-4 text-white sm:pb-32">
      <div className="mx-auto max-w-[860px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-gradient-light text-center text-[2rem] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-4xl">Questions schools ask.</h2>
        </Reveal>
        <div className="mt-10 border-b border-white/[0.09]">
          {FAQ.map((f, i) => {
            const on = open === i;
            return (
              <div key={f.q} className="border-t border-white/[0.09]">
                <button onClick={() => setOpen(on ? null : i)} aria-expanded={on} className="group flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left">
                  <span className={`text-[17px] font-medium tracking-[-0.015em] transition-colors duration-300 ${on ? 'text-white' : 'text-stone-300 group-hover:text-white'}`}>{f.q}</span>
                  <motion.span
                    animate={{ rotate: on ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1 ring-inset transition-colors duration-300 ${on ? 'bg-[#FF6321] text-white ring-[#FF6321]' : 'bg-white/[0.04] text-stone-400 ring-white/10'}`}
                  >
                    <Plus className="h-4 w-4" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div key="a" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} className="overflow-hidden">
                      <p className="max-w-[680px] pb-6 text-[15px] leading-relaxed text-stone-400">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

interface SchoolPageProps {
  onOpenAudit: () => void;
}

export const SchoolPage: React.FC<SchoolPageProps> = ({ onOpenAudit }) => (
  <div className="bg-[#050507]">
    <AdminRoutine first onQuote={onOpenAudit} />
    <SchoolOverview />
    <TeacherDesk />
    <TestModes />
    <ClassReport />
    <SubjectivePapers />
    <Pricing onQuote={onOpenAudit} />
    <Faq />

    {/* Closing */}
    <section className="bg-[#050507] px-4 pb-24 sm:px-6 sm:pb-32 lg:px-8">
      <Reveal>
        <div className="noise relative isolate mx-auto max-w-[1240px] overflow-hidden rounded-[40px] bg-[#07080C] px-6 py-20 text-center text-white shadow-[0_60px_120px_-50px_rgba(255,99,33,0.55),0_0_0_1px_rgba(255,255,255,0.07)] sm:px-12 sm:py-28">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-[-40%] h-[620px] w-[1000px] -translate-x-1/2 animate-aurora rounded-full bg-[radial-gradient(closest-side,rgba(255,99,33,0.5),rgba(255,99,33,0.1)_60%,transparent)] blur-2xl" />
            <div className="bg-grid-dark absolute inset-0 opacity-60" />
          </div>
          <h2 className="mx-auto max-w-4xl text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            <WordReveal text="Bring ClassMap" wordClassName="text-gradient-light" />
            <br />
            <WordReveal text="to your school." wordClassName="text-gradient-brand" delay={0.2} />
          </h2>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-7 max-w-xl text-pretty text-base leading-relaxed text-stone-400 sm:text-lg">
              Tell us about your classes, students and teachers, and we will send a quote and show you ClassMap working with your own syllabus.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-10 flex justify-center">
              <PrimaryButton onClick={onOpenAudit}>
                <span>Request a quote</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </PrimaryButton>
            </div>
          </Reveal>
        </div>
      </Reveal>
    </section>
  </div>
);
