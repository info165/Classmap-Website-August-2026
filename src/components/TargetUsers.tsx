import React, { useState } from 'react';
import { Building2, UserCheck, Users, GraduationCap, Heart, CheckCircle2, ArrowRight } from 'lucide-react';

interface TargetUsersProps {
  onOpenAudit: () => void;
}

export const TargetUsers: React.FC<TargetUsersProps> = ({ onOpenAudit }) => {
  const [activeUserRole, setActiveUserRole] = useState<'school' | 'teacher' | 'student' | 'parent'>('school');

  const roles = [
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
  ];

  const currentRole = roles.find((r) => r.id === activeUserRole) || roles[0];

  return (
    <section id="solutions" className="py-24 bg-[#FDFCFB] border-t border-[#EAE7DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF0E6] text-[#FF6321] text-xs font-bold uppercase tracking-widest">
            <Users className="w-3.5 h-3.5" />
            <span>Built for the Complete Ecosystem</span>
          </div>

          {/* text-balance stops the heading dropping a single word onto its own
              line, which is what made it read as unbalanced. */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-[#1A1A1A] tracking-tight text-balance">
            How ClassMap Serves Every Stakeholder
          </h2>

          <p className="text-base sm:text-lg text-[#555] font-normal leading-relaxed">
            When learning becomes visible, everyone in the school community wins.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = activeUserRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setActiveUserRole(role.id as any)}
                className={`px-6 py-3 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2.5 border ${
                  isSelected
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md scale-102'
                    : 'bg-white text-[#555] border-[#E0DDD3] hover:bg-[#F5F3ED] hover:text-[#1A1A1A]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-[#FF6321]' : 'text-[#888]'}`} />
                <span>{role.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Role Content Card. Flat with a hairline rim rather than the
            old shadow-xl — a heavy resting shadow is the quickest way to make a
            card look like a template. */}
        <div className="bg-white rounded-3xl border border-[#E8E4DA] p-8 lg:p-12 shadow-[0_1px_3px_rgba(26,26,26,0.04)] animate-in fade-in duration-300">
          <div className="grid grid-cols-1">
            <div>
              <span className="inline-block px-3 py-1.5 rounded-full bg-[#FFF0E6] text-[10px] font-bold uppercase tracking-[0.16em] text-[#C9541C]">
                {currentRole.tagline}
              </span>

              <h3 className="mt-5 text-2xl sm:text-[32px] font-serif font-light text-[#1A1A1A] leading-[1.25] tracking-tight text-balance">
                {currentRole.headline}
              </h3>

              <ul className="mt-8 space-y-4">
                {currentRole.points.map((point, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3.5 text-[15px] leading-relaxed text-[#403E38]"
                  >
                    <CheckCircle2 className="mt-[3px] h-[18px] w-[18px] shrink-0 text-[#FF6321]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={onOpenAudit}
                className="group mt-9 inline-flex items-center gap-2.5 rounded-full bg-[#FF6321] px-7 py-3.5 text-xs font-bold tracking-wide text-white shadow-[0_1px_2px_rgba(219,76,14,0.4),0_8px_20px_-8px_rgba(255,99,33,0.55),inset_0_1px_0_rgba(255,255,255,0.22)] transition-all duration-300 ease-out hover:-translate-y-px hover:bg-[#F0530F] cursor-pointer"
              >
                <span>Experience ClassMap for Your School</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
