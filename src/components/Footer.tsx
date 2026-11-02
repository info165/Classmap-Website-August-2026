import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Logo } from './Logo';
import { Phone, Mail, MapPin, ShieldCheck, Lock, BadgeCheck, ArrowUpRight, ArrowUp } from 'lucide-react';
import { EASE, Reveal } from './ui/primitives';

interface FooterProps {
  onOpenLogin: (role?: 'teacher' | 'student' | 'admin') => void;
  onOpenAudit: () => void;
  onOpenWebsiteBilling?: () => void;
  onScrollToSection: (sectionId: string) => void;
  onOpenPrivacy?: () => void;
  onOpenBlog?: () => void;
  onOpenStudents?: () => void;
  onOpenSchools?: () => void;
}

/* One roster, read as a single slow ribbon rather than two clouds of chips. */
const ECOSYSTEM = [
  'Siddhartha Public School',
  'DPS Howrah',
  'BDMI',
  'The Newtown School',
  'St. Thomas School',
  'Khaitan Public School',
  'Delhi Board (DBSE)',
  'IIT Madras',
  'Ministry of Education',
  'Bodhan AI'
];

const COMPLIANCE = [
  { icon: ShieldCheck, label: 'DPDP Act 2023 Compliant', tone: 'text-emerald-300' },
  { icon: BadgeCheck, label: 'ISO 27001 Certified', tone: 'text-[#FF8A4C]' },
  { icon: Lock, label: 'AES-256 Encrypted', tone: 'text-sky-300' }
];

/** A link that underlines itself from the left on hover. */
const FooterLink: React.FC<{
  onClick?: () => void;
  href?: string;
  external?: boolean;
  children: React.ReactNode;
  accent?: boolean;
}> = ({ onClick, href, external, children, accent }) => {
  const cls = `group relative inline-flex cursor-pointer items-center gap-1.5 text-left text-[14px] transition-colors duration-300 ${
    accent ? 'text-[#FF8A4C] hover:text-[#FFB27A]' : 'text-stone-400 hover:text-white'
  }`;
  const inner = (
    <>
      <span className="relative">
        {children}
        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 ease-out group-hover:scale-x-100" />
      </span>
      {external && (
        <ArrowUpRight className="h-3 w-3 opacity-50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
      )}
    </>
  );
  return href ? (
    <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className={cls}>
      {inner}
    </a>
  ) : (
    <button onClick={onClick} className={cls}>
      {inner}
    </button>
  );
};

const ColumnHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mb-6 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-stone-500">{children}</div>
);

export const Footer: React.FC<FooterProps> = ({
  onOpenAudit,
  onScrollToSection,
  onOpenPrivacy,
  onOpenBlog,
  onOpenStudents,
  onOpenSchools
}) => {
  const year = new Date().getFullYear();
  const markRef = useRef<HTMLDivElement>(null);

  /* The wordmark has a second, brighter copy that is only visible under the
     cursor, so moving across the footer lights the letters as it passes. */
  const trackMark = (e: React.MouseEvent) => {
    const el = markRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--wx', `${e.clientX - r.left}px`);
    el.style.setProperty('--wy', `${e.clientY - r.top}px`);
  };
  const leaveMark = () => {
    markRef.current?.style.setProperty('--wx', '-999px');
  };

  return (
    <footer
      onMouseMove={trackMark}
      onMouseLeave={leaveMark}
      className="noise relative isolate overflow-hidden bg-[#07080C] pt-20 text-white"
    >
      {/* Light across the top edge, and a pool of it behind the wordmark below */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF6321]/70 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 -z-10 h-80 w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,99,33,0.13),transparent)] blur-2xl" />
      <div aria-hidden="true" className="bg-grid-dark pointer-events-none absolute inset-0 -z-10 opacity-40" />

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* ----------------------------------------------------- main grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-12">
          {/* Brand */}
          <Reveal className="col-span-2 lg:col-span-5">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group inline-block cursor-pointer"
              aria-label="Back to top"
            >
              <Logo size="xl" />
            </button>

            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-stone-400">
              The Learning Gap Intelligence Platform. We help schools and coaching institutes see why students struggle, and what to do next.
            </p>

            <div className="mt-8 space-y-3 text-sm">
              <a href="tel:+918981716969" className="group flex w-fit items-center gap-3 text-stone-200 transition-colors hover:text-white">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] text-[#FF6321] shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-all duration-300 group-hover:bg-[#FF6321] group-hover:text-white">
                  <Phone className="h-4 w-4" />
                </span>
                <span className="font-mono text-[13px]">+91-8981716969</span>
              </a>
              <a href="mailto:info@classmap.in" className="group flex w-fit items-center gap-3 text-stone-200 transition-colors hover:text-white">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] text-[#FF6321] shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-all duration-300 group-hover:bg-[#FF6321] group-hover:text-white">
                  <Mail className="h-4 w-4" />
                </span>
                info@classmap.in
              </a>
              <div className="flex w-fit items-center gap-3 text-stone-500">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] text-[#FF6321] shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
                  <MapPin className="h-4 w-4" />
                </span>
                Bengaluru &bull; Hyderabad &bull; New Delhi
              </div>
            </div>
          </Reveal>

          {/* Platform */}
          <Reveal delay={0.08} className="lg:col-span-2 lg:col-start-7">
            <ColumnHeading>Platform</ColumnHeading>
            <ul className="space-y-4">
              {onOpenStudents && <li><FooterLink onClick={onOpenStudents}>For Students</FooterLink></li>}
              {onOpenSchools && <li><FooterLink onClick={onOpenSchools}>For Schools</FooterLink></li>}
              <li><FooterLink onClick={() => onScrollToSection('partners')}>Partners</FooterLink></li>
              <li><FooterLink onClick={() => onScrollToSection('trust')}>Trust &amp; Security</FooterLink></li>
            </ul>
          </Reveal>

          {/* Company */}
          <Reveal delay={0.14} className="lg:col-span-2">
            <ColumnHeading>Resources</ColumnHeading>
            <ul className="space-y-4">
              {onOpenBlog && <li><FooterLink onClick={onOpenBlog}>Blog</FooterLink></li>}
              {onOpenPrivacy && <li><FooterLink onClick={onOpenPrivacy}>Privacy Policy</FooterLink></li>}
              <li><FooterLink onClick={onOpenAudit} accent>Book a Free Demo</FooterLink></li>
            </ul>
          </Reveal>

          {/* Portals */}
          <Reveal delay={0.2} className="lg:col-span-2">
            <ColumnHeading>Portals</ColumnHeading>
            <ul className="space-y-4">
              <li><FooterLink href="https://classmap.in/teachers" external>Teachers</FooterLink></li>
              <li><FooterLink href="https://classmap.in/students" external>Students</FooterLink></li>
              <li><FooterLink href="https://classmap.in/admin" external>Admin</FooterLink></li>
            </ul>
          </Reveal>
        </div>

        {/* ------------------------------------------------ ecosystem ribbon */}
        <Reveal className="mt-20">
          <div className="flex items-center gap-4">
            <span className="shrink-0 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-stone-500">
              Schools &amp; institutions
            </span>
            <span className="h-px flex-1 bg-white/[0.07]" />
          </div>
          <div className="group/ribbon relative mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]">
            <div className="flex w-max animate-marquee group-hover/ribbon:[animation-play-state:paused]">
              {[0, 1].map((copy) => (
                <div key={copy} aria-hidden={copy === 1 || undefined} className="flex shrink-0 items-center">
                  {ECOSYSTEM.map((name) => (
                    <span key={`${copy}-${name}`} className="flex items-center text-[15px] font-medium tracking-tight text-stone-400">
                      {name}
                      <span className="mx-7 h-1 w-1 rounded-full bg-[#FF6321]/70" />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* --------------------------------------------------- compliance bar */}
        <Reveal className="mt-14 flex flex-wrap items-center justify-between gap-x-8 gap-y-5 border-t border-white/[0.07] pt-8">
          <div className="flex flex-wrap items-center gap-2.5">
            {COMPLIANCE.map(({ icon: Icon, label, tone }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-3.5 py-2 text-[12px] font-medium text-stone-300 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
              >
                <Icon className={`h-3.5 w-3.5 ${tone}`} />
                {label}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-5 text-xs text-stone-500">
            <span>&copy; {year} ClassMap Learning Technologies India Pvt. Ltd.</span>
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to top"
              whileHover={{ y: -3 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/[0.05] text-stone-300 shadow-[0_0_0_1px_rgba(255,255,255,0.09)] transition-colors hover:bg-[#FF6321] hover:text-white"
            >
              <ArrowUp className="h-4 w-4" />
            </motion.button>
          </div>
        </Reveal>
      </div>

      {/* ---------------------------------------------------------- wordmark */}
      {/* Sized to sit inside the page column, whole, descender included. The
          earlier version was set larger than the viewport, which cropped the
          "p" at the edge and sliced its tail at the bottom. The letters fade by
          their own gradient instead of being masked. Decoration only, so it is
          hidden from assistive tech. */}
      <div aria-hidden="true" className="pointer-events-none relative mx-auto mt-6 max-w-[1280px] select-none px-4 pb-8 sm:mt-10 sm:px-6 sm:pb-12 lg:px-8">
        <div aria-hidden="true" className="absolute inset-x-[10%] bottom-0 h-1/2 rounded-full bg-[#FF6321]/[0.12] blur-3xl" />
        <div
          ref={markRef}
          className="relative text-center font-sans font-semibold leading-[1] tracking-[-0.055em]"
          style={{ fontSize: 'clamp(3.25rem, 16.2vw, 16.5rem)' }}
        >
          <span className="bg-gradient-to-b from-white/[0.2] via-white/[0.08] to-white/[0.02] bg-clip-text text-transparent">ClassMap</span>
          <span
            className="absolute inset-0 bg-gradient-to-b from-[#FF8A4C] via-[#FF6321]/60 to-[#FF6321]/10 bg-clip-text text-transparent [-webkit-mask-image:radial-gradient(320px_circle_at_var(--wx,-999px)_var(--wy,-999px),#000,transparent)] [mask-image:radial-gradient(320px_circle_at_var(--wx,-999px)_var(--wy,-999px),#000,transparent)]"
          >
            ClassMap
          </span>
        </div>
      </div>
    </footer>
  );
};
