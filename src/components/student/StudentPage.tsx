import React from 'react';
import { ArrowRight } from 'lucide-react';
import { GhostButton, PrimaryButton, Reveal, WordReveal } from '../ui/primitives';
import { LoopStory } from './LoopStory';
import { ColorReport } from './ColorReport';
import { HandwrittenFlow } from './HandwrittenFlow';
import { Faq, Pricing } from './PricingAndFaq';
import { PRICE, STUDENT_PORTAL_URL } from './data';

/**
 * The For Students page. Black and orange throughout.
 *
 * It opens on the six-step loop, told on a phone that stays pinned while the
 * steps scroll past. Then the real app, the real video lesson, AI grading of
 * handwritten answers, and finally price and questions.
 */
export const StudentPage: React.FC = () => {
  // The portal is its own app; open it in a new tab, as the header's login links do.
  const start = () => window.open(STUDENT_PORTAL_URL, '_blank', 'noopener,noreferrer');

  return (
    <div className="bg-[#050507]">
      <LoopStory onStart={start} />
      <ColorReport />
      <HandwrittenFlow />
      <Pricing onStart={start} />
      <Faq />

      {/* Closing call to action */}
      <section className="bg-[#050507] px-4 pb-24 pt-8 sm:px-6 sm:pb-32 lg:px-8">
        <Reveal>
          <div className="noise relative isolate mx-auto max-w-[1280px] overflow-hidden rounded-[40px] bg-[#07080C] px-6 py-20 text-center text-white shadow-[0_60px_120px_-50px_rgba(255,99,33,0.55),0_0_0_1px_rgba(255,255,255,0.06)] sm:px-12 sm:py-28">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute left-1/2 top-[-40%] h-[620px] w-[1000px] -translate-x-1/2 animate-aurora rounded-full bg-[radial-gradient(closest-side,rgba(255,99,33,0.5),rgba(255,99,33,0.1)_60%,transparent)] blur-2xl" />
              <div className="bg-grid-dark absolute inset-0 opacity-70" />
            </div>

            <h2 className="mx-auto max-w-4xl text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              <WordReveal text="Understand every topic." wordClassName="text-gradient-light" />
              <br />
              <WordReveal text="Score higher." wordClassName="text-gradient-brand" delay={0.25} />
            </h2>

            <Reveal delay={0.2}>
              <p className="mx-auto mt-7 max-w-xl text-pretty text-base leading-relaxed text-stone-400 sm:text-lg">
                Adaptive tests, clear reports, video lessons and AI-graded answers. Now at the offer price of{' '}
                <span className="whitespace-nowrap font-semibold text-white">₹{PRICE} a month</span>.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <PrimaryButton onClick={start}>
                  <span>Start learning</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </PrimaryButton>
                <GhostButton onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  See the loop again
                </GhostButton>
              </div>
            </Reveal>
          </div>
        </Reveal>
      </section>
    </div>
  );
};
