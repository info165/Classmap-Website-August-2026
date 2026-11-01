import React from 'react';
import { ArrowRight, Phone, Mail } from 'lucide-react';
import { PrimaryButton, GhostButton, Reveal, WordReveal } from './ui/primitives';

interface FinalCTAProps {
  onOpenAudit: () => void;
  onExplore: () => void;
  exploreLabel?: string;
}

/** The last thing a visitor sees before the footer, so it asks for one thing. */
export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenAudit, onExplore, exploreLabel = 'Explore the Diagnostic Engine' }) => (
  <section className="bg-[#07080C] px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
    <Reveal>
      <div className="noise relative isolate mx-auto max-w-[1280px] overflow-hidden rounded-[40px] bg-[#07080C] px-6 py-20 text-center text-white shadow-[0_60px_120px_-50px_rgba(255,99,33,0.55),0_0_0_1px_rgba(255,255,255,0.06)] sm:px-12 sm:py-28">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-40%] h-[620px] w-[1000px] -translate-x-1/2 animate-aurora rounded-full bg-[radial-gradient(closest-side,rgba(255,99,33,0.5),rgba(255,99,33,0.1)_60%,transparent)] blur-2xl" />
          <div className="bg-grid-dark absolute inset-0 opacity-70" />
        </div>

        <h2 className="mx-auto max-w-4xl text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
          <WordReveal text="See what your" wordClassName="text-gradient-light" />
          <br />
          <WordReveal text="students are really thinking." wordClassName="text-gradient-brand" delay={0.2} />
        </h2>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-7 max-w-xl text-pretty text-base leading-relaxed text-stone-400 sm:text-lg">
            Book a free demo and watch ClassMap read a real handwritten answer sheet from your own school.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <PrimaryButton onClick={onOpenAudit}>
              <span>Book a Free Demo</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </PrimaryButton>
            <GhostButton onClick={onExplore}>{exploreLabel}</GhostButton>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] text-stone-500">
            <a href="tel:+918981716969" className="inline-flex items-center gap-2 transition-colors hover:text-white">
              <Phone className="h-3.5 w-3.5 text-[#FF6321]" />
              +91-8981716969
            </a>
            <a href="mailto:info@classmap.in" className="inline-flex items-center gap-2 transition-colors hover:text-white">
              <Mail className="h-3.5 w-3.5 text-[#FF6321]" />
              info@classmap.in
            </a>
          </div>
        </Reveal>
      </div>
    </Reveal>
  </section>
);
