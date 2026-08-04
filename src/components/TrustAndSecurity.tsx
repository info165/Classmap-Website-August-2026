import React from 'react';
import {
  ShieldCheck,
  Lock,
  Server,
  FileCheck,
  Key,
  UserCheck,
  Building2,
  Database,
  EyeOff,
  Clock,
  CheckCircle2,
  ShieldAlert,
  Award
} from 'lucide-react';

export const TrustAndSecurity: React.FC = () => {
  const trustPillars = [
    {
      id: 'privacy',
      icon: ShieldCheck,
      badge: 'Privacy Standard',
      title: 'DPDP Act 2023 Compliant',
      subtitle: 'Data Protection Governance',
      description: 'Fully compliant with India’s DPDP Act 2023. Student data is encrypted, anonymized, and processed with verified consent.',
      highlights: [
        'Anonymized student ID tokens',
        'Strict parental consent protocols'
      ]
    },
    {
      id: 'sovereignty',
      icon: Database,
      badge: 'Data Ownership',
      title: 'Complete Data Sovereignty',
      subtitle: '100% Institution-Owned Intelligence',
      description: 'Institutions retain total ownership of handwritten answer sheets, diagnostic reports, and student concept graphs.',
      highlights: [
        'Zero vendor lock-in with instant export',
        'Institutional property guarantee'
      ]
    },
    {
      id: 'zero-training',
      icon: EyeOff,
      badge: 'AI Safety Policy',
      title: 'Zero Public Model Training',
      subtitle: 'No Public LLM Exposure',
      description: 'Student answer scripts and grades are never used to train public AI models. All analysis stays in isolated vaults.',
      highlights: [
        'Zero-retention model endpoints',
        'Protected handwriting image vaults'
      ]
    },
    {
      id: 'security',
      icon: Lock,
      badge: 'Encryption Standard',
      title: 'Bank-Grade AES-256 Security',
      subtitle: 'End-to-End Encrypted',
      description: 'All transit data is secured via TLS 1.3, and stored student scripts are encrypted with AES-256 standards.',
      highlights: [
        'TLS 1.3 in-transit & AES-256 at-rest',
        'ISO 27001 data center infrastructure'
      ]
    },
    {
      id: 'rbac',
      icon: Key,
      badge: 'Access Governance',
      title: 'Granular Access Control (RBAC)',
      subtitle: 'Strict Role Permissions',
      description: 'Role-scoped access ensures principals, teachers, and students only view data they are explicitly authorized to see.',
      highlights: [
        'Role-scoped dashboard views',
        'Single Sign-On (SSO) integration'
      ]
    },
    {
      id: 'audit',
      icon: Clock,
      badge: 'Audit & Transparency',
      title: 'Immutable Evaluation Audit Trails',
      subtitle: 'Transparent Logs',
      description: 'Every grade adjustment, teacher note, and score modification is logged with immutable timestamps for accountability.',
      highlights: [
        'Transparent grade adjustments',
        'Complete administrative audit logs'
      ]
    }
  ];

  return (
    <section id="trust" className="py-12 sm:py-16 bg-[#12141D] text-white border-t border-[#2A2E3D] relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF6321]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#222736] text-emerald-400 border border-emerald-500/30 text-[11px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Trust & Data Protection</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-light text-white tracking-tight">
            Enterprise Trust Architecture
          </h2>

          <p className="text-xs sm:text-sm text-stone-300 font-normal leading-relaxed">
            ClassMap provides a secure, DPDP-compliant learning intelligence foundation built to rigorous data privacy standards.
          </p>
        </div>

        {/* Compact Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {trustPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="bg-[#1A1D28] p-4.5 sm:p-5 rounded-xl border border-[#2D3245] hover:border-[#FF6321]/50 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden shadow-md space-y-3"
              >
                <div className="space-y-2">
                  {/* Icon & Badge Header */}
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-[#262B3D] text-[#FF6321] border border-[#373E56] flex items-center justify-center group-hover:scale-105 group-hover:bg-[#FF6321] group-hover:text-white transition-all">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#222736] text-stone-300 border border-[#333A50]">
                      {pillar.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#FF6321] transition-colors leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="text-[11px] font-semibold text-[#FF6321] mt-0.5">
                      {pillar.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-stone-300 leading-relaxed font-normal">
                    {pillar.description}
                  </p>
                </div>

                {/* Key Bullet Highlights */}
                <div className="pt-2.5 border-t border-[#2A2E3D] space-y-1">
                  {pillar.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-stone-300 font-medium">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
