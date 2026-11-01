import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { ArrowRight, ShieldCheck, Building2, Camera, ChevronDown } from 'lucide-react';
import { EvaluationConsole } from './EvaluationConsole';
import { SilkField } from './ui/SilkField';
import { EASE, Eyebrow, GhostButton, PrimaryButton, Tilt3D, WordReveal } from './ui/primitives';

interface HeroProps {
  onExploreEvaluator: () => void;
  onOpenAudit: () => void;
}

/* The objections the hero has to answer: is our data safe, does this fit our
   board, and what does it cost us to adopt. Each carries its own mark. */
const CREDENTIALS = [
  { label: 'DPDP Act 2023 Compliant', icon: ShieldCheck },
  { label: 'CBSE, ICSE & State Board Aligned', icon: Building2 },
  { label: 'No hardware or OMR sheets', icon: Camera }
];

export const Hero: React.FC<HeroProps> = ({ onExploreEvaluator, onOpenAudit }) => {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  // The background drifts slower than the page, which is what gives it depth.
  const bgY = useTransform(scrollY, [0, 800], [0, reduce ? 0 : 160]);
  // Only the headline block recedes; the console below must stay fully lit.
  const fade = useTransform(scrollY, [120, 620], [1, reduce ? 1 : 0.25]);

  // The console arrives tipped back, like a screen on a desk, and lays itself
  // flat toward the reader as it rises into view: tied to the scroll, so it
  // moves exactly as fast as the visitor does.
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: rise } = useScroll({ target: stageRef, offset: ['start end', 'center center'] });
  const tiltX = useTransform(rise, [0, 1], [reduce ? 0 : 28, 0]);
  const lift = useTransform(rise, [0, 1], [reduce ? 1 : 0.9, 1]);
  const glow = useTransform(rise, [0, 1], [0.15, 1]);


  return (
    <section
      className="noise relative isolate overflow-hidden bg-[#07080C] pb-24 pt-32 text-white sm:pt-40 lg:pb-32"
    >
      {/* ------------------------------------------------------------ backdrop */}
      {/* A ribbon of light flows behind the opening screen. The words sit in a
          pool of darkness so they always read; the ribbon shows at either side
          of them and beneath. */}
      <motion.div aria-hidden="true" style={{ y: bgY }} className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[100svh] min-h-[640px]">
        <SilkField className="absolute inset-0 [mask-image:linear-gradient(to_bottom,#000_70%,transparent)]" />
        <div className="absolute left-1/2 top-[44%] h-[70%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(7,8,12,0.88),rgba(7,8,12,0.55)_55%,transparent)]" />
      </motion.div>
      {/* Seam into the next section */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-[#07080C]" />

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* --------------------------------------------------------- headline */}
        <motion.div style={{ opacity: fade }} className="mx-auto max-w-[1180px] text-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: EASE }}
          >
            <Eyebrow tone="dark" icon={<span className="h-1.5 w-1.5 rounded-full bg-[#FF6321] shadow-[0_0_10px_2px_rgba(255,99,33,0.9)]" />}>
              Learning Gap Intelligence Platform
            </Eyebrow>
          </motion.div>

          <h1 className="mt-7 text-balance text-[2.7rem] font-semibold leading-[1] tracking-[-0.045em] sm:text-6xl lg:text-[4.6rem] xl:text-[5.4rem]">
            <WordReveal text="Every Student Deserves a" wordClassName="text-gradient-light" delay={0.6} />
            <br />
            <WordReveal text="Personal Learning Journey." wordClassName="text-gradient-brand" delay={0.85} />
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 18, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 1.1, ease: EASE }}
            className="mx-auto mt-7 max-w-2xl text-pretty text-base leading-relaxed text-stone-400 sm:text-lg lg:text-xl"
          >
            ClassMap helps students understand strengths, identify learning gaps, and automatically create personalized practice so every student can improve with confidence.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.25, ease: EASE }}
            className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center"
          >
            <PrimaryButton onClick={onOpenAudit}>
              <span>Book a Free Demo</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </PrimaryButton>
            <GhostButton onClick={onExploreEvaluator}>
              <span>Explore the Diagnostic Engine</span>
            </GhostButton>
          </motion.div>

          <motion.ul
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] font-medium text-stone-400"
          >
            {CREDENTIALS.map(({ label, icon: Icon }) => (
              <li key={label} className="inline-flex items-center gap-2">
                <Icon className="h-4 w-4 text-[#FF6321]" />
                {label}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* ----------------------------------------------------------- console */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 70, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.4, delay: 1.4, ease: EASE }}
          className="relative mx-auto mt-16 max-w-[1020px] [perspective:1600px] sm:mt-20"
        >
          {/* Light pooled beneath the window, brightening as it settles */}
          <motion.div aria-hidden="true" style={{ opacity: glow }} className="absolute -inset-x-10 -bottom-16 -z-10 h-48 rounded-full bg-[#FF6321]/25 blur-[90px]" />
          <motion.div ref={stageRef} style={{ rotateX: tiltX, scale: lift, transformOrigin: '50% 100%' }}>
            <Tilt3D>
              {/* A thin light that travels round the console's edge */}
              <div className="relative">
                <EvaluationConsole />
                <div aria-hidden="true" className="beam pointer-events-none absolute inset-0 z-10 rounded-[22px]" />
              </div>
            </Tilt3D>
          </motion.div>
          {/* Clear of the floating card that hangs below the console on wide screens */}
          <p className="mt-5 text-center font-mono text-[11px] tracking-tight text-stone-500 xl:mt-16">
            A real Class 9 Social Science answer sheet, graded by ClassMap.
          </p>
        </motion.div>

        {/* Scroll cue */}
        <motion.button
          onClick={() => document.getElementById('impact')?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="Scroll to content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6 }}
          className="mx-auto mt-14 hidden cursor-pointer flex-col items-center gap-2 text-stone-600 transition-colors hover:text-stone-300 sm:flex"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </motion.button>
      </div>
    </section>
  );
};
