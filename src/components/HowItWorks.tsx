import React from 'react';
import { motion } from 'motion/react';
import { Camera, Brain, Sparkles, Workflow, Check } from 'lucide-react';
import { GlowCard, Reveal, SectionHeading } from './ui/primitives';

/* Three small illustrations, drawn rather than pictured, so they stay sharp and
   take the card's colours. Each hints at what the step produces. */

const CaptureVisual: React.FC = () => (
  <div className="relative mx-auto h-40 w-28 rounded-[22px] bg-[#0B0D13] p-1.5 shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_24px_40px_-16px_rgba(0,0,0,0.9)]">
    <div className="relative h-full w-full overflow-hidden rounded-[17px] bg-[#F6F1E4]">
      {[18, 32, 46, 60, 74, 88, 102, 116].map((t) => (
        <div key={t} className="absolute left-3 right-3 h-px bg-[#506EAA]/30" style={{ top: t }} />
      ))}
      {[22, 36, 50, 64].map((t, i) => (
        <div
          key={t}
          className="absolute left-4 h-[3px] rounded-full bg-[#1F2A44]/70"
          style={{ top: t, width: `${[70, 52, 64, 40][i]}%` }}
        />
      ))}
      {/* Viewfinder corners */}
      {['left-1.5 top-1.5 border-l-2 border-t-2', 'right-1.5 top-1.5 border-r-2 border-t-2', 'left-1.5 bottom-1.5 border-b-2 border-l-2', 'right-1.5 bottom-1.5 border-b-2 border-r-2'].map((c) => (
        <span key={c} className={`absolute h-3.5 w-3.5 rounded-[3px] border-[#FF6321] ${c}`} />
      ))}
      <div className="absolute inset-x-0 h-px animate-scan bg-[#FF6321] shadow-[0_0_12px_3px_rgba(255,99,33,0.8)]" />
    </div>
    <div className="absolute left-1/2 top-1.5 h-1 w-8 -translate-x-1/2 rounded-full bg-black/70" />
  </div>
);

const DiagnoseVisual: React.FC = () => (
  <div className="mx-auto w-full max-w-[220px] space-y-2">
    {[
      { w: '78%', c: 'bg-emerald-400', ok: true },
      { w: '62%', c: 'bg-emerald-400', ok: true },
      { w: '84%', c: 'bg-amber-400', ok: false },
      { w: '48%', c: 'bg-rose-400', ok: false }
    ].map((r, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: -14 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.25 + i * 0.12, duration: 0.6 }}
        className="flex items-center gap-2.5 rounded-xl bg-white/[0.045] px-3 py-2.5 ring-1 ring-inset ring-white/[0.07]"
      >
        <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[#07080C] ${r.c}`}>
          {r.ok ? <Check className="h-2.5 w-2.5" strokeWidth={4} /> : <span className="text-[9px] font-black leading-none">!</span>}
        </span>
        <span className="h-1.5 rounded-full bg-white/20" style={{ width: r.w }} />
      </motion.div>
    ))}
  </div>
);

const ActVisual: React.FC = () => (
  <div className="mx-auto w-full max-w-[220px] rounded-2xl bg-white/[0.05] p-4 ring-1 ring-inset ring-white/[0.09]">
    <div className="flex items-center justify-between">
      <span className="rounded-full bg-[#FF6321]/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-[#FF8A4C]">
        Micro-lesson
      </span>
      <span className="font-mono text-[10px] text-emerald-300">10 min</span>
    </div>
    <div className="mt-3 space-y-1.5">
      <div className="h-2 w-[88%] rounded-full bg-white/25" />
      <div className="h-2 w-[64%] rounded-full bg-white/15" />
      <div className="h-2 w-[76%] rounded-full bg-white/15" />
    </div>
    <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#FF6321] px-3 py-2 text-[11px] font-semibold text-white shadow-[0_10px_24px_-8px_rgba(255,99,33,0.8)]">
      <Sparkles className="h-3.5 w-3.5" />
      Ready for the class
    </div>
  </div>
);

const STEPS = [
  {
    n: '01',
    icon: Camera,
    title: 'Capture',
    copy: 'Upload handwritten test scripts with a smartphone camera or a feeder scanner. Students keep writing on paper.',
    visual: <CaptureVisual />
  },
  {
    n: '02',
    icon: Brain,
    title: 'Diagnose',
    copy: 'Every step of every answer is read for reasoning, not just the final number, so the real misconception surfaces.',
    visual: <DiagnoseVisual />
  },
  {
    n: '03',
    icon: Sparkles,
    title: 'Act',
    copy: 'Auto-generated 10-minute micro-lessons and targeted practice for the errors that recur across a class.',
    visual: <ActVisual />
  }
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="noise relative isolate overflow-hidden bg-[#07080C] py-24 text-white sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,99,33,0.14),transparent)] blur-2xl" />
        <div className="bg-grid-dark absolute inset-0 opacity-60" />
      </div>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tone="dark"
          eyebrow="How it works"
          eyebrowIcon={<Workflow className="h-3.5 w-3.5" />}
          title={
            <>
              From a paper script to a plan
              <br className="hidden sm:block" /> in the teacher&rsquo;s hands.
            </>
          }
          lede="No new hardware, no tablets, no change to how students write. ClassMap sits between the answer sheet and the next lesson."
        />

        <div className="relative mt-16 sm:mt-20">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.12}>
                <GlowCard tilt={3} className="group relative h-full rounded-[28px] bg-white/[0.03] p-7 shadow-[0_0_0_1px_rgba(255,255,255,0.07)] transition-colors duration-500 hover:bg-white/[0.05] sm:p-8">
                  <div className="relative z-10 flex items-center gap-3">
                    <span className="flex h-[46px] w-[46px] items-center justify-center rounded-2xl bg-[#07080C] text-[#FF6321] shadow-[0_0_0_1px_rgba(255,99,33,0.45),0_0_30px_-4px_rgba(255,99,33,0.5)]">
                      <s.icon className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-xs tracking-widest text-stone-500">STEP {s.n}</span>
                  </div>

                  <h3 className="mt-7 text-3xl font-semibold tracking-[-0.03em] text-white">{s.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-stone-400">{s.copy}</p>

                  <div className="mt-8 flex min-h-[176px] items-center justify-center rounded-2xl bg-black/30 p-5 ring-1 ring-inset ring-white/[0.05]">
                    {s.visual}
                  </div>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
