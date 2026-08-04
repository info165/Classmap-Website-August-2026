import React from 'react';
import { ArrowRight, Sparkles, TrendingUp, Award, CheckCircle2, Star, Flame, Calendar, FileText, Check, AlertTriangle, ShieldCheck, Building2 } from 'lucide-react';
import handwrittenPaperImg from '../assets/images/handwritten_answer_sheet_1785252659162.jpg';

interface HeroProps {
  onExploreEvaluator: () => void;
  onOpenAudit: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreEvaluator, onOpenAudit }) => {
  const handleBookDemoEmail = () => {
    const subject = encodeURIComponent("Book a Free ClassMap Demo");
    const body = encodeURIComponent("Hello ClassMap Team,\n\nI would like to book a free demo for our school / coaching institute.\n\nInstitution Name:\nType (School / Coaching Institute):\nContact Person:\nPhone Number:\nCity:\n\nThank you!");
    window.location.href = `mailto:info@classmap.in?subject=${subject}&body=${body}`;
  };

  return (
    <section className="relative pt-4 sm:pt-8 md:pt-10 pb-16 md:pb-20 bg-[#FDFCFB] text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: HERO HEADLINE & CTA */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold leading-[1.08] font-sans text-[#1A1A1A] tracking-tight">
              Every Student Deserves a{' '}
              <span className="relative inline-block text-[#FF6321] font-extrabold">
                Personal Learning Journey.
                <span className="absolute left-0 bottom-1 w-full h-2.5 bg-[#FF6321]/15 -z-10 rounded-full" />
              </span>
            </h1>

            {/* Paragraph */}
            <p className="text-base sm:text-lg text-[#555] leading-relaxed font-normal max-w-xl">
              ClassMap helps students understand strengths, identify learning gaps, and automatically create personalized practice so every student can improve with confidence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onOpenAudit}
                className="px-8 py-4 bg-[#FF6321] hover:bg-[#E05215] text-white font-bold text-sm rounded-full shadow-lg shadow-[#FF6321]/25 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 text-center"
              >
                <span>Book a Free Demo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Trust points */}
            <div className="pt-6 border-t border-[#EAE7DE] flex flex-wrap items-center gap-6 text-xs text-[#666] font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>DPDP Act 2023 Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#FF6321]" />
                <span>CBSE, ICSE & State Board Aligned</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: HERO VISUAL SHOWCASE */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Main Container: Handwritten Paper Scan with AI Ink Evaluation Layer */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#E2DFD4] bg-[#FFFDF9] group p-4 sm:p-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E2D8] mb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1A1A1A]">
                    <FileText className="w-4 h-4 text-[#FF6321]" />
                    <span>Real Student Answer Sheet Evaluation</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FFF0E6] text-[#FF6321] text-[10px] font-bold">
                    Pen-on-Paper AI Scan
                  </span>
                </div>

                {/* Answer sheet image representation */}
                <div className="relative h-[280px] sm:h-[320px] rounded-2xl overflow-hidden border border-[#DDD] shadow-inner bg-[#FBF9F2]">
                  <img
                    src={handwrittenPaperImg}
                    alt="Handwritten Answer Sheet Evaluation"
                    className="w-full h-full object-cover object-top opacity-90 group-hover:scale-102 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  {/* Live AI Overlay Annotations */}
                  <div className="absolute top-4 left-4 right-4 space-y-2">
                    <div className="p-2.5 bg-white/95 backdrop-blur-md rounded-xl border border-emerald-300 shadow-md flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                        <span>Step 1: Formula Substitution</span>
                      </span>
                      <span className="text-[10px] font-mono bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md font-bold">
                        100% Correct
                      </span>
                    </div>

                    <div className="p-2.5 bg-white/95 backdrop-blur-md rounded-xl border border-amber-300 shadow-md flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-900 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>Step 2: Vector Direction Misconception</span>
                      </span>
                      <span className="text-[10px] font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-bold">
                        Concept Gap
                      </span>
                    </div>
                  </div>

                  {/* Floating "LIVE" badge */}
                  <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-[11px] font-bold rounded-full flex items-center gap-1.5 uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Real-Time Diagnostic Layer</span>
                  </div>
                </div>
              </div>

              {/* Floating Metric Card (Top-Right) */}
              <div className="absolute -top-4 right-2 sm:right-0 md:-right-4 bg-white p-3.5 sm:p-5 rounded-2xl shadow-xl border border-[#EEE] max-w-[190px] sm:max-w-[210px] z-20 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider mb-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Class Mastery</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#1A1A1A] tracking-tight">
                  +18.4%
                </div>
                <p className="text-[10px] text-[#777] font-medium leading-tight mt-1">
                  Average grade increase over previous unit test.
                </p>
              </div>

              {/* Overlaid Main Student Card */}
              <div className="absolute -bottom-6 left-2 right-2 sm:right-auto sm:left-0 md:-left-4 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-[#E2DFD4] max-w-full sm:max-w-md w-full z-20 space-y-3 sm:space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Student Info Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#F0F0F0]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FFF0E6] text-[#FF6321] border border-[#FF6321]/30 flex items-center justify-center font-bold text-sm shrink-0">
                      AG
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#1A1A1A]">Aarav Gupta</div>
                      <div className="text-[11px] text-[#777]">Grade 6 • CBSE Math</div>
                    </div>
                  </div>

                  <div className="px-2.5 py-1 rounded-full bg-[#FFF0E6] text-[#FF6321] text-[11px] font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    <span>Level 4</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#1A1A1A]">Current Goal: <span className="font-bold">Fraction Division</span></span>
                    <span className="font-extrabold text-[#FF6321]">85% Complete</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#F5F3ED] rounded-full overflow-hidden">
                    <div className="h-full bg-[#FF6321] rounded-full w-[85%] transition-all duration-1000" />
                  </div>
                </div>

                {/* Identified Gap Box */}
                <div className="p-3.5 rounded-2xl bg-[#FFF0E6]/80 border border-[#FF6321]/30 text-xs space-y-1">
                  <div className="text-[10px] font-extrabold text-[#FF6321] uppercase tracking-wider">
                    IDENTIFIED LEARNING GAP
                  </div>
                  <p className="text-[#1A1A1A] font-medium leading-snug">
                    Struggles with <span className="font-bold text-[#FF6321]">Negative Denominators</span>. Needs 5 diagnostic practice reps.
                  </p>
                </div>

                {/* Achievements row */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[#888] font-medium text-[11px]">Achievements</span>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#FFF0E6] text-[#FF6321] flex items-center justify-center text-[10px]">
                      <Award className="w-3.5 h-3.5" />
                    </div>
                    <div className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold flex items-center gap-1 border border-amber-200">
                      <Flame className="w-3 h-3 text-amber-500 fill-current" />
                      <span>7 Streak</span>
                    </div>
                    <div className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold flex items-center gap-1 border border-blue-200">
                      <CheckCircle2 className="w-3 h-3 text-blue-500" />
                      <span>Verified</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating CTA Pill bottom right */}
              <button
                onClick={onOpenAudit}
                className="absolute -bottom-14 right-4 bg-[#FF6321] hover:bg-[#E05215] text-white px-5 py-3 rounded-full text-xs font-bold shadow-xl flex items-center gap-2 z-30 cursor-pointer transition-all hover:scale-105 hidden sm:flex"
              >
                <Calendar className="w-4 h-4" />
                <span>Book a Free Demo</span>
              </button>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
