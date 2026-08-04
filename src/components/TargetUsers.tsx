import React, { useState } from 'react';
import { Building2, UserCheck, Users, GraduationCap, Heart, CheckCircle2, ArrowRight } from 'lucide-react';

interface TargetUsersProps {
  onOpenAudit: () => void;
}

export const TargetUsers: React.FC<TargetUsersProps> = ({ onOpenAudit }) => {
  const [activeUserRole, setActiveUserRole] = useState<'school' | 'teacher' | 'coordinator' | 'parent'>('school');

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
      label: 'Subject Teachers',
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
      id: 'coordinator',
      label: 'Academic Coordinators',
      icon: GraduationCap,
      tagline: 'Data-Driven Curriculum Alignment',
      headline: 'Standardize teaching quality across sections and departments.',
      points: [
        'Compare section performance on specific syllabus learning outcomes.',
        'Identify whether a drop in scores is due to curriculum pacing or concept difficulty.',
        'Empower department heads with clear evidence during subject review meetings.',
        'Track term-on-term learning retention over multi-year cohorts.'
      ]
    },
    {
      id: 'parent',
      label: 'Parents & Guardians',
      icon: Heart,
      tagline: 'Constructive Parent-Teacher Discussions',
      headline: 'Understand your child’s true learning journey beyond anxiety-inducing marks.',
      points: [
        'See exact concept strengths and misconceptions in plain language.',
        'Know precisely what 10-minute activity at home will resolve a learning roadblock.',
        'Eliminate guesswork and tuition fatigue with targeted remedial clarity.',
        'Watch your child build genuine academic self-confidence.'
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

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-[#1A1A1A] tracking-tight">
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

        {/* Active Role Content Card */}
        <div className="bg-white rounded-3xl border border-[#EEE] p-8 lg:p-12 shadow-xl animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF6321] bg-[#FFF0E6] px-3 py-1 rounded-full">
                {currentRole.tagline}
              </span>

              <h3 className="text-2xl sm:text-3xl font-serif font-light text-[#1A1A1A] leading-tight">
                {currentRole.headline}
              </h3>

              <ul className="space-y-3.5 text-sm text-[#403E38]">
                {currentRole.points.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#FF6321] shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4">
                <button
                  onClick={onOpenAudit}
                  className="inline-flex items-center gap-2 bg-[#FF6321] hover:bg-[#E05215] text-white px-8 py-4 rounded-full text-xs font-bold tracking-wide transition-all shadow-md shadow-[#FF6321]/20 cursor-pointer"
                >
                  <span>Experience ClassMap for Your School</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Side Visual Accent Card */}
            <div className="lg:col-span-5 bg-[#FCFCFB] p-6 rounded-3xl border border-[#E2DFD4] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FFF0E6] border border-[#FF6321]/20 flex items-center justify-center text-[#FF6321]">
                  <currentRole.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1A1A1A]">{currentRole.label}</div>
                  <div className="text-xs text-[#706E66]">Role Perspective</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E0DDD3] text-xs text-[#555] italic font-serif leading-relaxed">
                "ClassMap brought our faculty together. We no longer debate whether students are studying; we focus on closing the specific concept gap together."
              </div>

              <div className="text-[11px] font-bold text-[#FF6321] text-right font-mono">
                CBSE / ICSE / IB Board Ready
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
