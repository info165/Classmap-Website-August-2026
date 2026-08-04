import React from 'react';
import { ShieldCheck, CheckCircle2, ArrowRight, Building2, Sparkles, Check } from 'lucide-react';

interface FreeForSchoolsProps {
  onOpenAudit: () => void;
}

export const FreeForSchools: React.FC<FreeForSchoolsProps> = ({ onOpenAudit }) => {
  return (
    <section id="free-for-schools" className="py-24 bg-[#FDFCFB] border-t border-[#EAE7DE]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="bg-[#1A1A1A] rounded-3xl text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl border border-[#333]">
          {/* Glowing accent background */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#FF6321]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left Column: Core Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2A2A2A] border border-[#333] text-[#FF6321] text-xs font-bold uppercase tracking-widest">
                <Building2 className="w-3.5 h-3.5" />
                <span>Zero Software Cost for Partner Institutions</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light tracking-tight text-white leading-tight">
                ClassMap Diagnostic Platform is{' '}
                <span className="text-[#FF6321] italic font-normal">
                  100% Free for Partner Schools & Coaching Institutes.
                </span>
              </h2>

              <p className="text-base sm:text-lg text-stone-300 font-normal leading-relaxed">
                ClassMap provides partner schools and coaching centres with student learning assessments, concept heatmaps, student gap profiles, and teacher remediation toolkits at zero software cost.
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={onOpenAudit}
                  className="inline-flex items-center gap-2.5 bg-[#FF6321] hover:bg-[#E05215] text-white px-8 py-4 rounded-full text-sm font-semibold tracking-wide shadow-lg shadow-[#FF6321]/20 transition-all cursor-pointer active:scale-98"
                >
                  <span>Register Institution For Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-xs text-stone-400 font-mono flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>No credit card or contractual lock-in required</span>
                </div>
              </div>
            </div>

            {/* Right Column: Free Included Features */}
            <div className="lg:col-span-5 bg-[#242424] p-6 sm:p-8 rounded-3xl border border-[#333] space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#FF6321] flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>100% Free for Partner Institutions</span>
              </h3>

              <ul className="space-y-4 text-xs text-stone-200">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-white">Student Diagnostic Quizzes & Assessments</span>
                    <span className="text-stone-400">Automated evaluation, gap discovery, and topic mastery tracking.</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-white">Class & Section Concept Heatmaps</span>
                    <span className="text-stone-400">Clear section-by-section breakdown of syllabus misconceptions for teachers.</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-white">Individual Student Graph Profiles</span>
                    <span className="text-stone-400">Longitudinal cognitive trajectory and targeted practice recommendations.</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-white">Teacher Remediation Action Hub</span>
                    <span className="text-stone-400">Targeted micro-remediation worksheets based on identified concept flaws.</span>
                  </div>
                </li>
              </ul>

              <div className="pt-3 border-t border-[#333] text-[11px] text-stone-400 italic font-serif">
                "Our school onboarded 1,400 students across regular classes and coaching modules at zero software cost. It transformed conceptual tracking."
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
