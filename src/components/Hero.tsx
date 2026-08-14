import React from 'react';
import { ArrowRight, ShieldCheck, Building2 } from 'lucide-react';
import heroArtwork from '../assets/images/hero-answer-evaluation.webp';

interface HeroProps {
  onExploreEvaluator: () => void;
  onOpenAudit: () => void;
}

/* The two objections the hero actually has to answer: is our data safe, and
   does this fit our board. Each carries its own mark rather than sharing one. */
const CREDENTIALS = [
  { label: 'DPDP Act 2023 Compliant', icon: ShieldCheck, tone: 'text-[#15A06B]' },
  { label: 'CBSE, ICSE & State Board Aligned', icon: Building2, tone: 'text-[#FF6321]' }
];

export const Hero: React.FC<HeroProps> = ({ onExploreEvaluator, onOpenAudit }) => {
  return (
    <section className="relative pt-4 sm:pt-8 md:pt-10 pb-16 md:pb-20 bg-[#FDFCFB] text-[#1A1A1A]">
      {/* Ambient warmth. Two very low-opacity washes: one behind the artwork so
          it sits in light rather than on a flat field, one anchoring the
          bottom-left. No negative z-index — that would push them behind the
          section's own background and render them invisible. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 right-0 h-[640px] w-[860px] rounded-full bg-[radial-gradient(closest-side,rgba(255,99,33,0.10),transparent)]" />
        <div className="absolute -bottom-40 -left-32 h-[480px] w-[600px] rounded-full bg-[radial-gradient(closest-side,rgba(255,99,33,0.055),transparent)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 5/7 rather than 6/6, with a tighter gap. The artwork needs the width
            far more than the copy does — the headline's longest line still
            clears the narrower column, so nothing rewraps. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">

          {/* LEFT COLUMN: HERO HEADLINE & CTA */}
          <div className="lg:col-span-5 lg:pt-3 flex flex-col justify-center space-y-6">
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold leading-[1.08] font-sans text-[#1A1A1A] tracking-tight">
              Every Student Deserves a{' '}
              {/* inline-block is load-bearing, not cosmetic: it keeps the
                  orange phrase starting on its own line instead of running on
                  after "Deserves a". */}
              <span className="inline-block text-[#FF6321] font-extrabold">
                Personal Learning Journey.
              </span>
            </h1>

            {/* Paragraph */}
            <p className="text-base sm:text-lg text-[#555] leading-relaxed font-normal max-w-xl">
              ClassMap helps students understand strengths, identify learning gaps, and automatically create personalized practice so every student can improve with confidence.
            </p>

            {/* CTA Buttons. The primary carries the same raised-control
                treatment as the header's Diagnostic Engine button so the two
                read as one system: solid gradient, lit top edge, lift on
                hover, genuine press on click. */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={onOpenAudit}
                className="group/cta select-none rounded-full border border-[#DB4C0E] bg-gradient-to-b from-[#FF8244] to-[#F0530F] px-8 py-4 text-sm font-bold text-white shadow-[0_1px_0_rgba(255,255,255,0.45)_inset,0_2px_4px_rgba(140,48,8,0.28),0_14px_30px_-12px_rgba(255,99,33,0.65)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:from-[#FF8C50] hover:to-[#F65B16] hover:shadow-[0_1px_0_rgba(255,255,255,0.45)_inset,0_4px_8px_rgba(140,48,8,0.26),0_20px_38px_-14px_rgba(255,99,33,0.7)] active:translate-y-px active:shadow-[inset_0_2px_4px_rgba(140,48,8,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6321]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFCFB] cursor-pointer flex items-center justify-center gap-2 text-center"
              >
                <span>Book a Free Demo</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/cta:translate-x-0.5" />
              </button>
            </div>

            {/* Credential strip. This is what closes the gap under the CTA —
                the left column used to end here and leave a void beside a much
                taller artwork. */}
            <div className="pt-6 mt-1 border-t border-[#EAE7DE]">
              {/* Sentence case, not small caps: these read as plain statements
                  of fact, and each icon already separates its own item, so no
                  divider dots are needed. */}
              <div className="flex flex-wrap items-center gap-x-7 gap-y-2.5 text-[13px] font-medium text-[#4A4740]">
                {CREDENTIALS.map(({ label, icon: Icon, tone }) => (
                  <span key={label} className="inline-flex items-center gap-2">
                    <Icon className={`h-[18px] w-[18px] shrink-0 ${tone}`} />
                    <span>{label}</span>
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: PRODUCT ARTWORK.

              Fully contained — it must not bleed past the container. The
              artwork carries its own framed card, so running it off the
              viewport slices that frame mid-border and reads as a layout bug
              rather than a full-bleed panel. Width comes from the 7-column
              span instead.

              No ring, shadow or rounding on the image either: the artwork
              already supplies all three, and a second frame around it showed
              as a visible double border. */}
          <div className="lg:col-span-7">
            <img
              src={heroArtwork}
              alt="ClassMap evaluating a real handwritten student answer sheet: each reasoning step is checked, the incorrect substitution is flagged, and the identified learning gap is shown alongside the student's concept progress."
              width={1600}
              height={1178}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full h-auto mx-auto max-w-[640px] lg:max-w-none lg:w-[calc(100%+min(2rem,max(0px,(100vw-80rem)/2)))] lg:translate-x-[min(3.5rem,calc(1rem+max(0px,(100vw-80rem)/2)))]"
            />
          </div>

        </div>
      </div>
    </section>
  );
};
