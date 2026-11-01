import React from 'react';
import { ShieldCheck, Lock, Key, Database, EyeOff, Clock, Check } from 'lucide-react';
import { GlowCard, Reveal, SectionHeading } from './ui/primitives';

const TRUST_PILLARS = [
  {
    id: 'privacy',
    icon: ShieldCheck,
    badge: 'Privacy Standard',
    title: 'DPDP Act 2023 Compliant',
    subtitle: 'Data Protection Governance',
    description: 'Fully compliant with India’s DPDP Act 2023. Student data is encrypted, anonymized, and processed with verified consent.',
    highlights: ['Anonymized student ID tokens', 'Strict parental consent protocols'],
    feature: true
  },
  {
    id: 'security',
    icon: Lock,
    badge: 'Encryption Standard',
    title: 'Bank-Grade AES-256 Security',
    subtitle: 'End-to-End Encrypted',
    description: 'All transit data is secured via TLS 1.3, and stored student scripts are encrypted with AES-256 standards.',
    highlights: ['TLS 1.3 in-transit & AES-256 at-rest', 'ISO 27001 data center infrastructure'],
    feature: true
  },
  {
    id: 'sovereignty',
    icon: Database,
    badge: 'Data Ownership',
    title: 'Complete Data Sovereignty',
    subtitle: '100% Institution-Owned Intelligence',
    description: 'Institutions retain total ownership of handwritten answer sheets, diagnostic reports, and student concept graphs.',
    highlights: ['Zero vendor lock-in with instant export', 'Institutional property guarantee']
  },
  {
    id: 'zero-training',
    icon: EyeOff,
    badge: 'AI Safety Policy',
    title: 'Zero Public Model Training',
    subtitle: 'No Public LLM Exposure',
    description: 'Student answer scripts and grades are never used to train public AI models. All analysis stays in isolated vaults.',
    highlights: ['Zero-retention model endpoints', 'Protected handwriting image vaults']
  },
  {
    id: 'rbac',
    icon: Key,
    badge: 'Access Governance',
    title: 'Granular Access Control (RBAC)',
    subtitle: 'Strict Role Permissions',
    description: 'Role-scoped access ensures principals, teachers, and students only view data they are explicitly authorized to see.',
    highlights: ['Role-scoped dashboard views', 'Single Sign-On (SSO) integration']
  },
  {
    id: 'audit',
    icon: Clock,
    badge: 'Audit & Transparency',
    title: 'Immutable Evaluation Audit Trails',
    subtitle: 'Transparent Logs',
    description: 'Every grade adjustment, teacher note, and score modification is logged with immutable timestamps for accountability.',
    highlights: ['Transparent grade adjustments', 'Complete administrative audit logs']
  }
];

export const TrustAndSecurity: React.FC = () => {
  return (
    <section id="trust" className="noise relative isolate overflow-hidden bg-[#07080C] py-24 text-white sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[15%] top-0 h-[520px] w-[640px] rounded-full bg-[radial-gradient(closest-side,rgba(52,211,153,0.13),transparent)] blur-2xl" />
        <div className="absolute bottom-0 right-[10%] h-[520px] w-[640px] rounded-full bg-[radial-gradient(closest-side,rgba(255,99,33,0.14),transparent)] blur-2xl" />
        <div className="bg-grid-dark absolute inset-0 opacity-50" />
      </div>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tone="dark"
          eyebrow="Trust & data protection"
          eyebrowIcon={<ShieldCheck className="h-3.5 w-3.5" />}
          title="Enterprise trust architecture."
          lede="ClassMap provides a secure, DPDP-compliant learning intelligence foundation built to rigorous data privacy standards."
        />

        {/* Bento: two wide tiles, then four standard ones. */}
        <div className="mt-16 grid grid-cols-1 gap-4 sm:mt-20 md:grid-cols-2 lg:grid-cols-12">
          {TRUST_PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal key={p.id} delay={(i % 3) * 0.08} className={p.feature ? 'md:col-span-2 lg:col-span-6' : 'lg:col-span-3'}>
                <GlowCard tilt={3}
                  glow="rgba(255, 99, 33, 0.13)"
                  className="group flex h-full flex-col justify-between rounded-[26px] bg-[#0E1016] p-7 shadow-[0_0_0_1px_rgba(255,255,255,0.07),inset_0_1px_0_rgba(255,255,255,0.05)] transition-colors duration-500 hover:bg-[#12141C]"
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.05] text-[#FF6321] shadow-[0_0_0_1px_rgba(255,255,255,0.09)] transition-all duration-500 group-hover:bg-[#FF6321] group-hover:text-white group-hover:shadow-[0_10px_30px_-6px_rgba(255,99,33,0.8)]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="rounded-full bg-white/[0.05] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-stone-400 ring-1 ring-inset ring-white/[0.07]">
                        {p.badge}
                      </span>
                    </div>

                    <h3 className="mt-7 text-xl font-semibold leading-snug tracking-[-0.02em] text-white">{p.title}</h3>
                    <p className="mt-1 text-[13px] font-medium text-[#FF8A4C]">{p.subtitle}</p>
                    <p className="mt-4 text-sm leading-relaxed text-stone-400">{p.description}</p>
                  </div>

                  <ul className="relative z-10 mt-7 space-y-2.5 border-t border-white/[0.07] pt-5">
                    {p.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2.5 text-[13px] font-medium text-stone-300">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                          <Check className="h-2.5 w-2.5" strokeWidth={4} />
                        </span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </GlowCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
