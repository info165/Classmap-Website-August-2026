import React from 'react';
import { Logo } from './Logo';
import { Phone, Mail, MapPin, ShieldCheck, Building2 } from 'lucide-react';

interface FooterProps {
  onOpenLogin: (role?: 'teacher' | 'student' | 'admin') => void;
  onOpenAudit: () => void;
  onOpenWebsiteBilling?: () => void;
  onScrollToSection: (sectionId: string) => void;
  onOpenPrivacy?: () => void;
  onOpenBlog?: () => void;
}

const PARTNER_SCHOOLS = [
  'Siddhartha Public School',
  'DPS Howrah',
  'BDMI',
  'The Newtown School',
  'St. Thomas School',
  'Khaitan Public School'
];

const INSTITUTIONAL_BODIES = [
  'Delhi Board (DBSE)',
  'IIT Madras',
  'Ministry of Education',
  'Bodhan AI'
];

/**
 * One chip style for the whole ecosystem bar. The previous version gave each
 * institutional body its own saturated colour — green, blue, orange, purple —
 * which read as four unrelated tags rather than one roster. A single restrained
 * surface with a brand accent dot ties the whole roster together instead.
 */
const EcosystemChip: React.FC<{ label: string }> = ({ label }) => (
  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.045] border border-white/[0.09] text-[11px] font-medium text-stone-300 transition-colors duration-200 hover:bg-white/[0.08] hover:border-white/[0.16] hover:text-white">
    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF6321]" />
    {label}
  </span>
);

export const Footer: React.FC<FooterProps> = ({
  onOpenLogin,
  onOpenAudit,
  onOpenWebsiteBilling,
  onScrollToSection,
  onOpenPrivacy,
  onOpenBlog
}) => {
  return (
    <footer className="bg-[#1A1A1A] text-white pt-16 pb-12 border-t border-[#333]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Partner Schools, Coaching Institutes & Government Ecosystem */}
        <div className="pb-10 mb-10 border-b border-[#282828]">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-9 lg:gap-16">
            <div className="space-y-3.5">
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#6F6A5E] font-semibold">
                Partner Schools &amp; Coaching Institutes
              </div>
              <div className="flex flex-wrap gap-2">
                {PARTNER_SCHOOLS.map((name) => (
                  <EcosystemChip key={name} label={name} />
                ))}
              </div>
            </div>

            <div className="space-y-3.5">
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#6F6A5E] font-semibold">
                Institutional Alignment
              </div>
              <div className="flex flex-wrap gap-2">
                {INSTITUTIONAL_BODIES.map((name) => (
                  <EcosystemChip key={name} label={name} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#333]">
          {/* Col 1: Logo & Brand Purpose */}
          <div className="md:col-span-5 space-y-5">
            <div
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="cursor-pointer inline-block"
            >
              <Logo size="xl" />
            </div>

            <p className="text-sm text-[#AAA] max-w-md leading-relaxed font-normal">
              ClassMap is the Learning Gap Intelligence Platform. We empower schools and coaching institutes to understand why students struggle through handwritten answer paper scanning, diagnostic concept graphs, and automated practice.
            </p>

            <div className="pt-2 text-xs text-[#BBB] space-y-2">
              <a href="tel:+918981716969" className="flex items-center gap-2 hover:text-[#FF6321] transition-colors font-bold text-white">
                <Phone className="w-3.5 h-3.5 text-[#FF6321]" />
                <span className="font-mono">+91-8981716969</span>
              </a>

              <a href="mailto:info@classmap.in" className="flex items-center gap-2 hover:text-[#FF6321] transition-colors">
                <Mail className="w-3.5 h-3.5 text-[#FF6321]" />
                <span>info@classmap.in</span>
              </a>

              <div className="flex items-center gap-2 text-[#888]">
                <MapPin className="w-3.5 h-3.5 text-[#FF6321]" />
                <span>Bengaluru • Hyderabad • New Delhi, India</span>
              </div>
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#FF6321]">
              Platform Intelligence
            </div>
            <ul className="space-y-2.5 text-xs text-[#BBB]">
              <li>
                <button
                  onClick={() => onScrollToSection('learning-gap-intelligence')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Learning Gap Intelligence
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('trust')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Enterprise Trust Architecture (DPDP)
                </button>
              </li>
              {onOpenBlog && (
                <li>
                  <button
                    onClick={onOpenBlog}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Blog
                  </button>
                </li>
              )}
              {onOpenPrivacy && (
                <li>
                  <button
                    onClick={onOpenPrivacy}
                    className="hover:text-white text-[#FF6321] font-semibold transition-colors cursor-pointer text-left flex items-center gap-1"
                  >
                    <span>Privacy Policy & Data Governance</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 3: Portal Links to classmap.in/teachers, classmap.in/students, classmap.in/admin */}
          <div className="md:col-span-4 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#FF6321]">
              Portal Login Access
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <a
                href="https://classmap.in/teachers"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-[#252525] border border-[#333] text-xs font-bold text-stone-200 hover:border-[#FF6321] hover:text-white transition-colors text-center"
              >
                Teachers
              </a>
              <a
                href="https://classmap.in/students"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-[#252525] border border-[#333] text-xs font-bold text-stone-200 hover:border-[#FF6321] hover:text-white transition-colors text-center"
              >
                Students
              </a>
              <a
                href="https://classmap.in/admin"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-[#252525] border border-[#333] text-xs font-bold text-stone-200 hover:border-[#FF6321] hover:text-white transition-colors text-center"
              >
                Admin
              </a>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenAudit}
                className="block w-full py-3 bg-[#FF6321] hover:bg-[#E05215] text-white rounded-full text-xs font-bold text-center transition-colors shadow-md shadow-[#FF6321]/20 cursor-pointer"
              >
                Book Free Demo
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Compliance Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#777] gap-4">
          <div>
            © {new Date().getFullYear()} ClassMap Learning Technologies India Pvt. Ltd.
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-[#AAA]">
            {onOpenPrivacy ? (
              <button
                onClick={onOpenPrivacy}
                className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>DPDP Act 2023 Compliant</span>
              </button>
            ) : (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                DPDP Act 2023 Compliant
              </span>
            )}
            {onOpenPrivacy && (
              <button
                onClick={onOpenPrivacy}
                className="hover:text-white transition-colors cursor-pointer underline text-[#FF6321]"
              >
                Privacy Policy
              </button>
            )}
            <span>ISO 27001 Certified</span>
            <span>AES-256 Encrypted</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
