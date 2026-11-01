import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Building2, UserCheck, Users, GraduationCap, Heart, ArrowRight, Check } from 'lucide-react';
import { EASE, Reveal, SectionHeading } from './ui/primitives';

interface TargetUsersProps {
  onOpenAudit: () => void;
}

type RoleId = 'school' | 'teacher' | 'student' | 'parent';

const ROLES = [
  {
    id: 'school',
    label: 'School Directors & Management',
    icon: Building2,
    tagline: 'Academic Excellence & Institutional Reputation',
    headline: 'Transform your school from a grading centre into a center of deep learning intelligence.',
    points: [
      'Elevate school board results by identifying concept gaps 6 months before board exams.',
      'Attract & retain parents with transparent, scientific learning graphs.',
      'Zero IT burden: No hardware purchases, OMR sheets, or tablet requirements.',
      'DPDP compliant & ISO 27001 enterprise data security.'
    ]
  },
  {
    id: 'teacher',
    label: 'Teachers',
    icon: UserCheck,
    tagline: 'Save 12+ Hours Every Week on Paper Correction',
    headline: 'Reclaim your evening hours while giving better feedback than ever before.',
    points: [
      'Upload handwritten test scripts via smartphone camera or feeder scanner.',
      'Receive instant step-by-step reasoning analysis for every student.',
      'Get auto-generated 10-minute micro-lesson plans for recurring class errors.',
      'Focus on teaching and mentoring rather than manual mark entry.'
    ]
  },
  {
    id: 'parent',
    label: 'Parents',
    icon: Heart,
    tagline: 'Constructive Parent-Teacher Discussions',
    headline: 'Understand your child’s true learning journey beyond anxiety-inducing marks.',
    points: [
      'See exact concept strengths and misconceptions in plain language.',
      'Know precisely what 10-minute activity at home will resolve a learning roadblock.',
      'Eliminate guesswork and tuition fatigue with targeted remedial clarity.',
      'Watch your child build genuine academic self-confidence.'
    ]
  },
  {
    id: 'student',
    label: 'Students',
    icon: GraduationCap,
    tagline: 'Practice That Targets Your Actual Gaps',
    headline: 'See exactly where your understanding breaks, and what to do about it.',
    points: [
      'Understand why an answer lost marks, not just how many were lost.',
      'Get practice built around your own misconceptions instead of generic question sets.',
      'Track concept mastery improving unit by unit across the year.',
      'Walk into exams knowing which topics are genuinely secure.'
    ]
  }
] as const;

export const TargetUsers: React.FC<TargetUsersProps> = ({ onOpenAudit }) => {
  const [activeUserRole, setActiveUserRole] = useState<RoleId>('school');
  const currentRole = ROLES.find((r) => r.id === activeUserRole) ?? ROLES[0];

  return (
    <section id="solutions" className="relative overflow-hidden bg-[#07080C] py-24 text-white sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,99,33,0.16),transparent)] blur-2xl" />

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Built for the complete ecosystem"
          eyebrowIcon={<Users className="h-3.5 w-3.5" />}
          tone="dark"
          title="How ClassMap serves every stakeholder."
          lede="When learning becomes visible, everyone in the school community wins."
        />

        {/* Role selector. The active pill is one shared element that glides
            between tabs rather than each tab restyling itself. */}
        <Reveal className="mt-12 flex justify-center">
          <div
            role="tablist"
            aria-label="Choose a role"
            className="scrollbar-none flex max-w-full gap-1 overflow-x-auto rounded-full bg-white/[0.05] p-1.5 ring-1 ring-inset ring-white/[0.08]"
          >
            {ROLES.map((role) => {
              const Icon = role.icon;
              const selected = activeUserRole === role.id;
              return (
                <button
                  key={role.id}
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveUserRole(role.id)}
                  className={`relative flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-semibold tracking-tight transition-colors duration-300 sm:px-6 ${
                    selected ? 'text-white' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="role-pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                      className="absolute inset-0 rounded-full bg-[#FF6321]/90 shadow-[0_8px_24px_-8px_rgba(255,99,33,0.8)]"
                    />
                  )}
                  <Icon className={`relative h-4 w-4 ${selected ? 'text-white' : 'text-[#FF8A4C]'}`} />
                  <span className="relative">{role.label}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal className="mt-8">
          <div className="noise relative isolate overflow-hidden rounded-[36px] bg-[#0A0B10] p-7 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_60px_100px_-50px_rgba(255,99,33,0.35)] sm:p-12 lg:p-16">
            <div aria-hidden="true" className="pointer-events-none absolute -left-20 -top-32 -z-10 h-[460px] w-[560px] rounded-full bg-[radial-gradient(closest-side,rgba(255,99,33,0.22),transparent)] blur-2xl" />
            <div aria-hidden="true" className="bg-grid-dark pointer-events-none absolute inset-0 -z-10 opacity-40" />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentRole.id}
                role="tabpanel"
                initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                transition={{ duration: 0.45, ease: EASE }}
                className="grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16"
              >
                <div className="flex flex-col justify-between">
                  <div>
                    <span className="inline-block rounded-full bg-[#FF6321]/10 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#FF8A4C] ring-1 ring-inset ring-[#FF6321]/25">
                      {currentRole.tagline}
                    </span>
                    <h3 className="mt-6 text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-4xl lg:text-[2.7rem]">
                      {currentRole.headline}
                    </h3>
                  </div>

                  <button
                    onClick={onOpenAudit}
                    className="group mt-10 inline-flex w-fit cursor-pointer items-center gap-3 rounded-full bg-white py-2 pl-6 pr-2 text-sm font-semibold tracking-tight text-[#0A0B10] transition-colors hover:bg-[#FFE9DC]"
                  >
                    Experience ClassMap for your school
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FF6321] text-white transition-transform duration-300 group-hover:translate-x-0.5">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </button>
                </div>

                <motion.ul
                  initial="hidden"
                  animate="show"
                  variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
                  className="space-y-3"
                >
                  {currentRole.points.map((point) => (
                    <motion.li
                      key={point}
                      variants={{ hidden: { opacity: 0, x: 24 }, show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } } }}
                      className="flex items-start gap-4 rounded-2xl bg-white/[0.045] p-5 text-[15px] leading-relaxed text-stone-200 shadow-[0_0_0_1px_rgba(255,255,255,0.07),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FF6321] text-white shadow-[0_6px_16px_-4px_rgba(255,99,33,0.8)]">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                      <span>{point}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
