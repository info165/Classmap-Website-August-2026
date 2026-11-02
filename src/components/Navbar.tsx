import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, Menu, X, User, ShieldCheck, GraduationCap, Phone, Mail, ArrowUpRight } from 'lucide-react';
import { Logo } from './Logo';
import { EASE, Magnetic } from './ui/primitives';

type Tab = 'home' | 'privacy' | 'blog' | 'students' | 'schools';

interface NavbarProps {
  onOpenLogin: (role?: 'teacher' | 'student' | 'admin') => void;
  onOpenAudit: () => void;
  onScrollToSection: (sectionId: string) => void;
  // 'blog' is reachable from the footer only for now, but the header still
  // receives the current tab so it can clear its active states.
  currentTab?: Tab;
  onSelectTab?: (tab: Tab) => void;
  /** True on pages that open on paper rather than a dark hero (an article). */
  lightHero?: boolean;
}

const PORTALS = [
  { href: 'https://classmap.in/teachers', label: 'Teacher Login', icon: User },
  { href: 'https://classmap.in/students', label: 'Student Login', icon: GraduationCap },
  { href: 'https://classmap.in/admin', label: 'Admin Login', icon: ShieldCheck }
];

/**
 * The two pages that carry the marketing: For Students and For Schools. They
 * are set apart from every other control in the bar, and they hold perfectly
 * still: a larger capsule with a gradient rim, deep glass inside, a warm light
 * rising from its foot and a thin highlight along its crown. "For" is quiet and
 * the audience is bold. Hover only brightens the light; the page you are on
 * burns orange.
 */
const FlagshipLink: React.FC<{ lead: string; audience: string; active: boolean; onClick: () => void }> = ({ lead, audience, active, onClick }) => (
  <button
    onClick={onClick}
    aria-current={active ? 'page' : undefined}
    className={`group relative isolate cursor-pointer rounded-full p-px transition-[background,box-shadow] duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6321]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07080C] ${
      active
        ? 'bg-gradient-to-b from-[#FFB27A] via-[#FF6321] to-[#E8520D] shadow-[0_12px_40px_-10px_rgba(255,99,33,0.75),0_0_0_4px_rgba(255,99,33,0.08)]'
        : 'bg-gradient-to-b from-white/45 via-white/12 to-[#FF6321]/55 shadow-[0_10px_30px_-14px_rgba(255,99,33,0.4)] hover:from-[#FFD2B0] hover:via-[#FF8A4C]/60 hover:to-[#FF6321] hover:shadow-[0_14px_40px_-12px_rgba(255,99,33,0.65)]'
    }`}
  >
    <span className="relative flex items-center gap-3 overflow-hidden rounded-full bg-[#0D0E14] px-[26px] py-[13px] text-[15.5px] tracking-tight">
      {/* Warm light rising from the foot of the capsule */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 transition-opacity duration-500 ${
          active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
        } bg-[radial-gradient(120%_150%_at_50%_135%,rgba(255,99,33,0.62),transparent_66%)]`}
      />
      {/* A thin highlight along the crown */}
      <span aria-hidden="true" className="absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-white/55 to-transparent" />
      <span
        aria-hidden="true"
        className={`relative h-2 w-2 rounded-full transition-colors duration-500 ${
          active ? 'bg-[#FF6321] shadow-[0_0_12px_3px_rgba(255,99,33,0.95)]' : 'bg-white/30 group-hover:bg-[#FF8A4C] group-hover:shadow-[0_0_10px_2px_rgba(255,138,76,0.7)]'
        }`}
      />
      <span className="relative flex items-baseline gap-1.5">
        <span className={`font-normal transition-colors duration-300 ${active ? 'text-[#FFD2B0]' : 'text-stone-400 group-hover:text-stone-100'}`}>{lead}</span>
        <span className="font-semibold text-white">{audience}</span>
      </span>
    </span>
  </button>
);

/** The same two links, as cards in the phone menu. */
const FlagshipCard: React.FC<{ title: string; line: string; active: boolean; onClick: () => void }> = ({ title, line, active, onClick }) => (
  <button
    onClick={onClick}
    aria-current={active ? 'page' : undefined}
    className={`group relative flex w-full cursor-pointer items-center justify-between gap-4 overflow-hidden rounded-2xl px-5 py-4 text-left transition-all duration-300 ${
      active
        ? 'bg-gradient-to-br from-[#FF6321]/[0.28] to-[#FF6321]/[0.06] shadow-[0_0_0_1px_rgba(255,99,33,0.6),0_14px_34px_-12px_rgba(255,99,33,0.6)]'
        : 'bg-white/[0.06] shadow-[0_0_0_1px_rgba(255,255,255,0.12)] active:bg-white/[0.1]'
    }`}
  >
    <span className="min-w-0">
      <span className="block text-[17px] font-semibold tracking-[-0.02em] text-white">{title}</span>
      <span className="mt-0.5 block text-[12.5px] leading-snug text-stone-400">{line}</span>
    </span>
    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${active ? 'bg-[#FF6321] text-white shadow-[0_8px_20px_-6px_rgba(255,99,33,0.8)]' : 'bg-white/[0.08] text-[#FF8A4C]'}`}>
      <ArrowUpRight className="h-4 w-4" />
    </span>
  </button>
);

export const Navbar: React.FC<NavbarProps> = ({
  onOpenLogin,
  onOpenAudit,
  onScrollToSection,
  currentTab = 'home',
  onSelectTab,
  lightHero = false
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [loginMenuOpen, setLoginMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  /* The bar steps out of the way on the way down the page and returns the moment
     the reader scrolls back up. */
  const [tucked, setTucked] = useState(false);

  /* Every page opens on a dark hero, so the bar starts transparent with light
     text. The one exception is an open article, which opens on paper. */
  const onDarkPage = !lightHero;
  const dark = onDarkPage || scrolled;

  useEffect(() => {
    let last = window.scrollY;
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (y < 320) setTucked(false);
      else if (y > last + 8) setTucked(true);
      else if (y < last - 8) setTucked(false);
      last = y;
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock the page behind the open sheet.
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleTabClick = (tab: 'home' | 'privacy' | 'students' | 'schools') => {
    onSelectTab?.(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const linkBase =
    'relative rounded-full px-3 py-2 text-[13px] font-medium tracking-tight transition-colors duration-200 cursor-pointer';
  const linkTone = dark
    ? 'text-stone-300 hover:text-white hover:bg-white/[0.07]'
    : 'text-[#44423C] hover:text-[#1A1A1A] hover:bg-black/[0.045]';

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-5 sm:pt-4 ${
        tucked && !mobileMenuOpen && !loginMenuOpen ? '-translate-y-[140%]' : ''
      }`}
    >
      <div
        className={`mx-auto flex max-w-[1280px] items-center justify-between gap-3 rounded-[22px] px-3.5 py-2.5 xl:grid xl:grid-cols-[1fr_auto_1fr] transition-all duration-500 ease-out sm:px-5 ${
          scrolled
            ? dark
              ? 'bg-[#0A0B10]/90 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_20px_50px_-20px_rgba(0,0,0,0.7)]'
              : 'bg-white/75 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_0_0_1px_rgba(26,26,26,0.07),0_20px_50px_-24px_rgba(26,26,26,0.3)]'
            : 'bg-transparent shadow-[0_0_0_1px_rgba(255,255,255,0)]'
        }`}
      >
        {/* Brand */}
        <button
          onClick={() => handleTabClick('home')}
          className="group flex shrink-0 cursor-pointer items-center justify-self-start focus:outline-none"
          aria-label="ClassMap Home"
        >
          <Logo size="md" />
        </button>

        {/* Desktop links */}
        <nav className="hidden items-center gap-3 xl:flex">
          <FlagshipLink lead="For" audience="Students" active={currentTab === 'students'} onClick={() => handleTabClick('students')} />
          <FlagshipLink lead="For" audience="Schools" active={currentTab === 'schools'} onClick={() => handleTabClick('schools')} />
        </nav>

        {/* Desktop actions */}
        <div className="hidden shrink-0 items-center gap-2 justify-self-end xl:flex">
          <div className="relative">
            <button
              onClick={() => setLoginMenuOpen(!loginMenuOpen)}
              onBlur={() => setTimeout(() => setLoginMenuOpen(false), 200)}
              aria-expanded={loginMenuOpen}
              className={`${linkBase} flex items-center gap-1.5 ${linkTone}`}
            >
              <User className="h-3.5 w-3.5" />
              <span>Login</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${loginMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {loginMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: EASE }}
                  className="absolute right-0 mt-3 w-56 origin-top-right overflow-hidden rounded-2xl bg-[#0F1117]/95 p-1.5 shadow-[0_0_0_1px_rgba(255,255,255,0.09),0_30px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
                >
                  <div className="px-3 pb-1.5 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                    Select portal
                  </div>
                  {PORTALS.map(({ href, label, icon: Icon }) => (
                    <a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-stone-200 transition-colors hover:bg-white/[0.07] hover:text-white"
                    >
                      <Icon className="h-4 w-4 text-[#FF6321]" />
                      <span className="flex-1">{label}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-stone-500 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#FF8A4C]" />
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Magnetic strength={0.2}>
            <motion.button
              onClick={onOpenAudit}
              whileTap={{ scale: 0.97 }}
              className="cursor-pointer rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold tracking-tight text-[#0A0B10] shadow-[0_0_0_1px_rgba(255,255,255,0.4),0_8px_24px_-8px_rgba(255,99,33,0.55)] transition-colors hover:bg-[#FFE9DC]"
            >
              Book a Demo
            </motion.button>
          </Magnetic>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors xl:hidden ${
            dark ? 'text-white hover:bg-white/10' : 'text-[#1A1A1A] hover:bg-black/5'
          }`}
          aria-label="Toggle Mobile Navigation Menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile sheet */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="mx-auto mt-2 max-h-[calc(100dvh-6rem)] max-w-[1280px] overflow-y-auto rounded-[26px] bg-[#0A0B10]/95 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.09),0_40px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl xl:hidden"
          >
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } } }}
              className="space-y-5"
            >
              {[
                <div key="main" className="space-y-3">
                  <FlagshipCard title="For Students" line="Adaptive tests, clear reports and video lessons" active={currentTab === 'students'} onClick={() => handleTabClick('students')} />
                  <FlagshipCard title="For Schools" line="Routine, teacher dashboards and AI grading" active={currentTab === 'schools'} onClick={() => handleTabClick('schools')} />
                </div>,

                <div key="login" className="space-y-2">
                  <div className="px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                    Portal login
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {['teachers', 'students', 'admin'].map((p) => (
                      <a
                        key={p}
                        href={`https://classmap.in/${p}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl bg-white/[0.05] py-3 text-center text-[13px] font-medium capitalize text-stone-200 shadow-[0_0_0_1px_rgba(255,255,255,0.07)] transition-colors hover:bg-white/10 hover:text-white"
                      >
                        {p}
                      </a>
                    ))}
                  </div>
                </div>,

                <button
                  key="demo"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAudit();
                  }}
                  className="w-full rounded-2xl bg-white py-4 text-center text-[15px] font-semibold text-[#0A0B10]"
                >
                  Book Free Institutional Demo
                </button>,

                <div key="contact" className="flex items-center justify-between border-t border-white/[0.07] px-1 pt-4 text-xs text-stone-400">
                  <a href="tel:+918981716969" className="flex items-center gap-1.5 hover:text-white">
                    <Phone className="h-3.5 w-3.5 text-[#FF6321]" />
                    +91-8981716969
                  </a>
                  <a href="mailto:info@classmap.in" className="flex items-center gap-1.5 hover:text-white">
                    <Mail className="h-3.5 w-3.5 text-[#FF6321]" />
                    info@classmap.in
                  </a>
                </div>
              ].map((el) => (
                <motion.div
                  key={el.key}
                  variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } } }}
                >
                  {el}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
