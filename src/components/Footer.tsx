import React from 'react';
import { Logo } from './Logo';
import { Phone, Mail, MapPin, ShieldCheck, Building2 } from 'lucide-react';

interface FooterProps {
  onOpenLogin: (role?: 'teacher' | 'student' | 'admin') => void;
  onOpenAudit: () => void;
  onOpenWebsiteBilling?: () => void;
  onScrollToSection: (sectionId: string) => void;
  onOpenPrivacy?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenLogin,
  onOpenAudit,
  onOpenWebsiteBilling,
  onScrollToSection,
  onOpenPrivacy
}) => {
  return (
    <footer className="bg-[#1A1A1A] text-white pt-16 pb-12 border-t border-[#333]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Partner Schools, Coaching Institutes & Government Ecosystem Badge Bar */}
        <div className="pb-8 mb-8 border-b border-[#282828] space-y-3">
          <div className="text-[10px] uppercase tracking-widest text-[#888] font-bold">
            Trusted Partner Schools, Coaching Institutes & Government Ecosystem
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#AAA]">
            <span className="px-2.5 py-1 rounded-md bg-[#252525] border border-[#333] text-white font-medium">Siddhartha Public School</span>
            <span className="px-2.5 py-1 rounded-md bg-[#252525] border border-[#333] text-white font-medium">DPS Howrah</span>
            <span className="px-2.5 py-1 rounded-md bg-[#252525] border border-[#333] text-white font-medium">BDMI</span>
            <span className="px-2.5 py-1 rounded-md bg-[#252525] border border-[#333] text-white font-medium">The Newtown School</span>
            <span className="px-2.5 py-1 rounded-md bg-[#252525] border border-[#333] text-white font-medium">St. Thomas School</span>
            <span className="px-2.5 py-1 rounded-md bg-[#252525] border border-[#333] text-white font-medium">Khaitan Public School</span>
            <span className="px-2.5 py-1 rounded-md bg-[#1E3A2B] border border-emerald-800 text-emerald-300 font-bold">Delhi Board (DBSE)</span>
            <span className="px-2.5 py-1 rounded-md bg-[#1E293B] border border-blue-800 text-blue-300 font-bold">IIT Madras</span>
            <span className="px-2.5 py-1 rounded-md bg-[#3B1904] border border-orange-800 text-orange-300 font-bold">Ministry of Education</span>
            <span className="px-2.5 py-1 rounded-md bg-[#2E1065] border border-purple-800 text-purple-300 font-bold">Bodhan AI</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#333]">
          {/* Col 1: Logo & Brand Purpose */}
          <div className="md:col-span-5 space-y-5">
            <div
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="cursor-pointer inline-block"
            >
              <Logo size="xl" variant="dark" showTaglineOnMobile={true} />
            </div>

            <p className="text-sm text-[#AAA] max-w-md leading-relaxed font-normal">
              ClassMap is the Learning Gap Intelligence Platform. We empower schools and coaching institutes to understand why students struggle through handwritten answer paper scanning, diagnostic concept graphs, and automated practice.
            </p>

            <div className="pt-2 text-xs text-[#BBB] space-y-2">
              <a href="tel:+919589587054" className="flex items-center gap-2 hover:text-[#FF6321] transition-colors font-bold text-white">
                <Phone className="w-3.5 h-3.5 text-[#FF6321]" />
                <span className="font-mono">+91-9589587054</span>
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
