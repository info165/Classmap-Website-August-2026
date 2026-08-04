import React from 'react';
import { HelpCircle, Sparkles, Brain, CheckCircle2, ArrowRight } from 'lucide-react';

export const PhilosophySection: React.FC = () => {
  return (
    <section id="learning-graph" className="py-24 bg-[#1A1A1A] text-white relative overflow-hidden">
      {/* Background radial warmth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FF6321]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Editorial Narrative Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-20">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2A2A2A] border border-[#333] text-[#FF6321] text-xs font-bold uppercase tracking-widest">
            <Brain className="w-3.5 h-3.5" />
            <span>Learning Gap Intelligence</span>
          </span>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif leading-[1.05] font-light text-white tracking-tight">
            Marks tell you <span className="line-through text-stone-500">what happened</span>.<br />
            ClassMap explains <span className="text-[#FF6321] italic font-normal">why</span>.
          </h2>

          <p className="text-base sm:text-lg text-stone-400 font-normal leading-relaxed">
            For decades, education treated test scores like final judgments. A student scoring 62/100 was simply labeled "average". But 62/100 is not a learning outcome—it is an unsolved mystery.
          </p>
        </div>

        {/* Narrative Step-by-Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Traditional Marks */}
          <div className="p-8 rounded-3xl bg-[#222] border border-[#333] space-y-4 relative group hover:border-[#444] transition-all">
            <div className="w-10 h-10 rounded-full bg-[#333] text-stone-400 flex items-center justify-center font-bold text-sm">
              01
            </div>

            <h3 className="text-xl font-serif font-light text-white">
              The Flaw of Traditional Report Cards
            </h3>

            <p className="text-sm text-stone-400 leading-relaxed">
              Traditional tests condense weeks of student effort into a single number. They tell teachers and parents <span className="text-stone-200 font-semibold">that</span> a child made a mistake, but conceal <span className="text-stone-200 font-semibold">why</span> the mistake occurred.
            </p>

            <div className="pt-4 border-t border-[#333] text-xs font-mono text-stone-500">
              Outcome: Re-testing without addressing the root misconception.
            </div>
          </div>

          {/* Card 2: Uncovering Hidden Signals */}
          <div className="p-8 rounded-3xl bg-[#222] border border-[#333] space-y-4 relative group hover:border-[#FF6321]/50 transition-all">
            <div className="w-10 h-10 rounded-full bg-[#FFF0E6]/20 text-[#FF6321] flex items-center justify-center font-bold text-sm">
              02
            </div>

            <h3 className="text-xl font-serif font-light text-white">
              Every Answer Sheet Contains Hidden Signals
            </h3>

            <p className="text-sm text-stone-300 leading-relaxed">
              A wrong answer in Physics is rarely lack of intelligence. It is often a subtle misconception formed months earlier—like confusing directional vectors or rushing fractional cancellation.
            </p>

            <div className="pt-4 border-t border-[#333] text-xs font-mono text-[#FF6321]">
              ClassMap reads pen strokes, step logic, and reasoning patterns.
            </div>
          </div>

          {/* Card 3: Understanding & Improvement */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#2A1D18] to-[#1F1816] border border-[#FF6321]/30 space-y-4 relative group hover:border-[#FF6321] transition-all">
            <div className="w-10 h-10 rounded-full bg-[#FF6321] text-white flex items-center justify-center font-bold text-sm">
              03
            </div>

            <h3 className="text-xl font-serif font-light text-white">
              Once a Child is Understood, Progress Follows
            </h3>

            <p className="text-sm text-stone-300 leading-relaxed">
              When teachers know the exact 10-minute intervention required, remediation becomes effortless. Anxiety vanishes. Students improve with genuine confidence.
            </p>

            <div className="pt-4 border-t border-[#FF6321]/30 text-xs font-mono text-emerald-400 font-semibold">
              Result: Objective understanding replaces guesswork.
            </div>
          </div>
        </div>

        {/* Narrative Quote Highlight */}
        <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-[#222] border border-[#333] text-center max-w-4xl mx-auto space-y-4">
          <blockquote className="text-xl sm:text-2xl font-serif text-stone-200 italic leading-relaxed">
            "When we stop grading children and start understanding their thinking, education transforms from evaluation to genuine empowerment."
          </blockquote>
          <div className="text-xs font-bold text-[#FF6321] uppercase tracking-widest">
            ClassMap Core Philosophy
          </div>
        </div>
      </div>
    </section>
  );
};
