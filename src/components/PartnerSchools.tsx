import React from 'react';
import { Building2, ShieldCheck, Landmark } from 'lucide-react';
import { VideoTestimonial } from './VideoTestimonial';
import { GlowCard, Reveal, SectionHeading } from './ui/primitives';

// Institutional Partners.
// Logos are served from public/logos/. They are trimmed to their artwork and
// exported at 240px tall, so every crest lands at the same optical size on the
// white plate below. Masters live in ss/, which is not committed.
const INSTITUTIONAL_PARTNERS = [
  {
    id: 'dbse',
    fullName: 'Delhi Board of School Education',
    subTitle: 'Govt. of NCT Delhi',
    tag: 'State Board Partner',
    logo: '/logos/dbse.png'
  },
  {
    id: 'iit-m',
    fullName: 'IIT Madras',
    subTitle: 'Academic & Research Partner',
    tag: 'Institute of Eminence',
    logo: '/logos/iit-madras.png'
  },
  {
    id: 'moe',
    fullName: 'Ministry of Education',
    subTitle: 'Government of India',
    tag: 'National Alignment',
    logo: '/logos/ministry-of-education.png'
  },
  {
    id: 'bodhan',
    fullName: 'Bodhan AI',
    subTitle: 'Cognitive AI Research',
    tag: 'Learning Gap Intelligence',
    logo: '/logos/bodhan-ai.png'
  }
];

// Real Partner Schools & Coaching Institutes. Same logo treatment as above.
const PARTNER_INSTITUTIONS = [
  { name: 'Siddhartha Public School', subtitle: 'Hyderabad, Telangana', badge: 'CBSE Affiliated', logo: '/logos/siddhartha.png' },
  { name: 'DPS Howrah', subtitle: 'Delhi Public School, Howrah', badge: 'CBSE', logo: '/logos/dps-howrah.png' },
  { name: 'B.D. Memorial International', subtitle: 'Kolkata, West Bengal', badge: 'CBSE / International', logo: '/logos/bdmi.png' },
  { name: 'The Newtown School', subtitle: 'Kolkata, West Bengal', badge: 'IGCSE & CBSE', logo: '/logos/newtown.png' },
  { name: 'St. Thomas School', subtitle: 'New Delhi / Eastern Region', badge: 'ICSE / CBSE', logo: '/logos/st-thomas.png' },
  { name: 'Khaitan Public School', subtitle: 'NCR / Ghaziabad', badge: 'CBSE', logo: '/logos/khaitan.png' }
];

const SchoolCard: React.FC<{ inst: (typeof PARTNER_INSTITUTIONS)[number]; hidden?: boolean }> = ({ inst, hidden }) => (
  <div
    aria-hidden={hidden || undefined}
    className="group mr-5 w-[290px] shrink-0 rounded-[24px] bg-[#0E1016] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgba(255,99,33,0.45),0_30px_50px_-24px_rgba(255,99,33,0.4)] sm:w-[320px]"
  >
    <div className="flex h-24 items-center justify-center rounded-2xl bg-white ring-1 ring-inset ring-white/20">
      <img
        src={inst.logo}
        alt={hidden ? '' : `${inst.name} logo`}
        loading="lazy"
        decoding="async"
        className="max-h-[68px] w-auto max-w-[72%] object-contain grayscale-[0.55] transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
      />
    </div>
    <div className="mt-4 px-1">
      <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-white">{inst.name}</h3>
      <p className="mt-0.5 text-[13px] text-stone-400">{inst.subtitle}</p>
      <div className="mt-3.5 inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] font-medium text-stone-300 ring-1 ring-inset ring-white/[0.08]">
        <ShieldCheck className="h-3 w-3 text-[#FF6321]" />
        {inst.badge}
      </div>
    </div>
  </div>
);

export const PartnerSchools: React.FC = () => {
  return (
    <section id="partners" className="relative overflow-hidden bg-[#07080C] py-24 text-white sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,99,33,0.16),transparent)] blur-2xl" />
      <div aria-hidden="true" className="bg-grid-dark pointer-events-none absolute inset-x-0 top-0 h-[800px] opacity-40" />

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Partners & alignment"
          eyebrowIcon={<Landmark className="h-3.5 w-3.5" />}
          tone="dark"
          title="Trusted by schools, boards and institutions."
          lede={
            <>
              Over <span className="font-semibold text-white">8,000+ students</span> across forward-thinking K-12 schools and test prep coaching centres are evaluated using ClassMap learning gap intelligence.
            </>
          }
        />

        {/* 1. Government & academic bodies */}
        <div className="mt-16 sm:mt-20">
          <Reveal>
            <div className="mb-5 flex items-center justify-between gap-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                Institutional Alignment &amp; Partnerships
              </h3>
              <span className="hidden rounded-full bg-white/[0.05] px-3 py-1 text-[11px] font-medium text-stone-400 ring-1 ring-inset ring-white/[0.08] sm:inline-block">
                Official academic &amp; government bodies
              </span>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {INSTITUTIONAL_PARTNERS.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.08}>
                <GlowCard
                  tilt={3}
                  glow="rgba(255, 99, 33, 0.14)"
                  className="group h-full rounded-[28px] bg-[#0E1016] p-6 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgba(255,99,33,0.4),0_36px_60px_-30px_rgba(255,99,33,0.35)]"
                >
                  <div className="flex h-28 items-center justify-center rounded-2xl bg-white ring-1 ring-inset ring-white/20">
                    <img
                      src={item.logo}
                      alt={`${item.fullName} logo`}
                      loading="lazy"
                      decoding="async"
                      className="h-20 w-auto max-w-[85%] object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <span className="mt-5 inline-block rounded-full bg-[#FF6321]/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#FF8A4C] ring-1 ring-inset ring-[#FF6321]/25">
                    {item.tag}
                  </span>
                  <h4 className="mt-3 text-[17px] font-semibold leading-snug tracking-tight text-white">
                    {item.fullName}
                  </h4>
                  <p className="mt-1 text-[13px] text-stone-400">{item.subTitle}</p>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>

        {/* 2. Schools & coaching institutes */}
        <div className="mt-20 sm:mt-24">
          <Reveal>
            <div className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
              <Building2 className="h-3.5 w-3.5 text-[#FF6321]" />
              Leading schools &amp; coaching institutes
            </div>
          </Reveal>
        </div>
      </div>

      {/* Full-bleed marquee. Two identical halves, translated by exactly one
          half, so the loop is seamless. Pauses under the cursor. */}
      <div
        className="group/marquee relative -mx-px overflow-hidden py-3 [mask-image:linear-gradient(to_right,transparent,#000_3%,#000_97%,transparent)]"
        aria-label="Partner schools"
      >
        <div className="flex w-max animate-marquee group-hover/marquee:[animation-play-state:paused]">
          {[0, 1, 2, 3].map((copy) =>
            PARTNER_INSTITUTIONS.map((inst) => (
              <SchoolCard key={`${copy}-${inst.name}`} inst={inst} hidden={copy > 0} />
            ))
          )}
        </div>
      </div>

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <VideoTestimonial />
      </div>
    </section>
  );
};
