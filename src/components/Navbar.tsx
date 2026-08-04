import React, { useState, useEffect } from 'react';
import { ChevronDown, Menu, X, User, ShieldCheck, GraduationCap, Sparkles, Building2, Users, Phone, Mail } from 'lucide-react';
import { Logo } from './Logo';

interface NavbarProps {
  onOpenLogin: (role?: 'teacher' | 'student' | 'admin') => void;
  onOpenAudit: () => void;
  onScrollToSection: (sectionId: string) => void;
  currentTab?: 'home' | 'learning-gap' | 'privacy';
  onSelectTab?: (tab: 'home' | 'learning-gap' | 'privacy') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenLogin,
  onOpenAudit,
  onScrollToSection,
  currentTab = 'home',
  onSelectTab
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [loginMenuOpen, setLoginMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTabClick = (tab: 'home' | 'learning-gap' | 'privacy') => {
    if (onSelectTab) {
      onSelectTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const handleNavScroll = (sectionId: string) => {
    if (currentTab !== 'home' && onSelectTab) {
      onSelectTab('home');
      setTimeout(() => {
        onScrollToSection(sectionId);
      }, 100);
    } else {
      onScrollToSection(sectionId);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FDFCFB]/95 backdrop-blur-md border-b border-[#F0EFEA] py-2.5 sm:py-3 shadow-xs'
          : 'bg-[#FDFCFB] py-3 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand Logo (Responsive height, single line on mobile) */}
          <button
            onClick={() => handleTabClick('home')}
            className="group flex items-center focus:outline-none cursor-pointer shrink-0"
            aria-label="ClassMap Home"
          >
            <Logo size="xl" showTaglineOnMobile={false} />
          </button>

          {/* Desktop Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold text-[#333]">
            <button
              onClick={() => handleTabClick('learning-gap')}
              className={`px-3 py-2 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'learning-gap'
                  ? 'bg-[#FF6321] text-white shadow-xs'
                  : 'bg-[#FFF0E6] text-[#FF6321] hover:bg-[#FF6321] hover:text-white border border-[#FF6321]/20'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Diagnostic Engine</span>
            </button>

            <button
              onClick={() => handleNavScroll('partners')}
              className="px-3 py-2 rounded-full hover:bg-[#F3F0E6] text-[#444] hover:text-[#1A1A1A] transition-all cursor-pointer"
            >
              Partner Institutions
            </button>

            <button
              onClick={() => handleNavScroll('solutions')}
              className="px-3 py-2 rounded-full hover:bg-[#F3F0E6] text-[#444] hover:text-[#1A1A1A] transition-all cursor-pointer"
            >
              Who It's For
            </button>

            <button
              onClick={() => handleNavScroll('trust')}
              className="px-3 py-2 rounded-full hover:bg-[#F3F0E6] text-[#444] hover:text-[#1A1A1A] transition-all cursor-pointer"
            >
              DPDP Trust & Security
            </button>

            <button
              onClick={() => handleTabClick('privacy')}
              className={`px-3 py-2 rounded-full transition-all cursor-pointer ${
                currentTab === 'privacy'
                  ? 'bg-[#1A1A1A] text-white'
                  : 'hover:bg-[#F3F0E6] text-[#444] hover:text-[#1A1A1A]'
              }`}
            >
              Privacy Policy
            </button>
          </nav>

          {/* Desktop Right Action Area */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {/* Login Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLoginMenuOpen(!loginMenuOpen)}
                onBlur={() => setTimeout(() => setLoginMenuOpen(false), 250)}
                className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#333] text-white rounded-full flex items-center gap-1.5 transition-colors cursor-pointer text-xs font-bold"
              >
                <User className="w-3.5 h-3.5 text-[#FF6321]" />
                <span>Login</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${loginMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {loginMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#EEE] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-1.5 text-[10px] font-extrabold text-[#999] uppercase tracking-widest border-b border-[#F0F0F0]">
                    Select Portal
                  </div>

                  <a
                    href="https://classmap.in/teachers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-[#1A1A1A] hover:bg-[#FFF0E6] hover:text-[#FF6321] flex items-center gap-2 transition-colors"
                  >
                    <User className="w-4 h-4 text-[#FF6321]" />
                    <span>Teacher Login</span>
                  </a>

                  <a
                    href="https://classmap.in/students"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-[#1A1A1A] hover:bg-[#FFF0E6] hover:text-[#FF6321] flex items-center gap-2 transition-colors"
                  >
                    <GraduationCap className="w-4 h-4 text-[#FF6321]" />
                    <span>Student Login</span>
                  </a>

                  <a
                    href="https://classmap.in/admin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-[#1A1A1A] hover:bg-[#FFF0E6] hover:text-[#FF6321] flex items-center gap-2 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#FF6321]" />
                    <span>Admin Login</span>
                  </a>
                </div>
              )}
            </div>

            {/* Book Free Demo Button */}
            <button
              onClick={onOpenAudit}
              className="px-5 py-2 bg-[#FF6321] hover:bg-[#E05215] text-white rounded-full font-bold text-xs shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              Book Free Demo
            </button>
          </div>

          {/* Mobile Actions Header (Compact & Flawless) */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <button
              onClick={onOpenAudit}
              className="px-3 py-1.5 rounded-full text-xs font-bold text-white bg-[#FF6321] hover:bg-[#E05215] transition-colors cursor-pointer"
            >
              Book Demo
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#1A1A1A] hover:bg-[#EFECE6] transition-colors cursor-pointer"
              aria-label="Toggle Mobile Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Sheet Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-[#E5E2D8] bg-[#FAF9F6] rounded-2xl p-4 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto">
            
            {/* Quick Diagnostic Engine Toggle */}
            <div>
              <button
                onClick={() => handleTabClick('learning-gap')}
                className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-all ${
                  currentTab === 'learning-gap'
                    ? 'bg-[#FF6321] text-white shadow-xs'
                    : 'bg-[#FFF0E6] border border-[#FF6321]/30 text-[#FF6321]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Diagnostic Engine</span>
              </button>
            </div>

            {/* Quick Scroll Links */}
            <div className="space-y-1.5 pt-2 border-t border-[#EAE7DE]">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#888] px-1">
                Explore Platform
              </div>
              
              <button
                onClick={() => handleNavScroll('partners')}
                className="w-full text-left py-2 px-3 rounded-xl text-xs font-semibold text-[#1A1A1A] hover:bg-white flex items-center gap-2.5"
              >
                <Building2 className="w-4 h-4 text-[#FF6321]" />
                <span>Partner Institutions & Boards</span>
              </button>

              <button
                onClick={() => handleNavScroll('solutions')}
                className="w-full text-left py-2 px-3 rounded-xl text-xs font-semibold text-[#1A1A1A] hover:bg-white flex items-center gap-2.5"
              >
                <Users className="w-4 h-4 text-[#FF6321]" />
                <span>Solutions for Schools & Teachers</span>
              </button>

              <button
                onClick={() => handleNavScroll('trust')}
                className="w-full text-left py-2 px-3 rounded-xl text-xs font-semibold text-[#1A1A1A] hover:bg-white flex items-center gap-2.5"
              >
                <ShieldCheck className="w-4 h-4 text-[#FF6321]" />
                <span>DPDP Act Data Protection</span>
              </button>

              <button
                onClick={() => handleTabClick('privacy')}
                className="w-full text-left py-2 px-3 rounded-xl text-xs font-semibold text-[#FF6321] hover:bg-white flex items-center gap-2.5"
              >
                <ShieldCheck className="w-4 h-4 text-[#FF6321]" />
                <span>Privacy Policy & Governance</span>
              </button>
            </div>

            {/* Role Login Buttons */}
            <div className="pt-3 border-t border-[#EAE7DE] space-y-2">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#888] px-1">
                Portal Login
              </div>
              <div className="grid grid-cols-3 gap-2">
                <a
                  href="https://classmap.in/teachers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-1 text-[11px] font-bold bg-white border border-[#E0DDD3] rounded-xl text-center text-[#1A1A1A] hover:border-[#FF6321] hover:text-[#FF6321] transition-colors"
                >
                  Teachers
                </a>
                <a
                  href="https://classmap.in/students"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-1 text-[11px] font-bold bg-white border border-[#E0DDD3] rounded-xl text-center text-[#1A1A1A] hover:border-[#FF6321] hover:text-[#FF6321] transition-colors"
                >
                  Students
                </a>
                <a
                  href="https://classmap.in/admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-1 text-[11px] font-bold bg-white border border-[#E0DDD3] rounded-xl text-center text-[#1A1A1A] hover:border-[#FF6321] hover:text-[#FF6321] transition-colors"
                >
                  Admin
                </a>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAudit();
              }}
              className="w-full bg-[#FF6321] text-white py-3 rounded-xl text-xs font-bold text-center shadow-sm hover:bg-[#E05215] transition-colors cursor-pointer"
            >
              Book Free Institutional Demo
            </button>

            {/* Contact Information Footer */}
            <div className="pt-2 border-t border-[#EAE7DE] flex items-center justify-between text-xs text-[#666] px-1">
              <a href="tel:+919589587054" className="flex items-center gap-1.5 hover:text-[#FF6321] font-medium">
                <Phone className="w-3.5 h-3.5 text-[#FF6321]" />
                <span>+91-9589587054</span>
              </a>
              <a href="mailto:info@classmap.in" className="flex items-center gap-1.5 hover:text-[#FF6321] font-medium">
                <Mail className="w-3.5 h-3.5 text-[#FF6321]" />
                <span>info@classmap.in</span>
              </a>
            </div>

          </div>
        )}
      </div>
    </header>
  );
};
