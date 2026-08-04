import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Brain,
  Layers,
  RotateCcw,
  TrendingDown,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { ANSWER_SHEET_SAMPLES, AnswerSheetSample } from '../data/mockData';

interface HandwrittenEvaluatorProps {
  onOpenAudit: () => void;
}

export const HandwrittenEvaluator: React.FC<HandwrittenEvaluatorProps> = ({ onOpenAudit }) => {
  const [selectedSample, setSelectedSample] = useState<AnswerSheetSample>(ANSWER_SHEET_SAMPLES[0]);
  const [activeTab, setActiveTab] = useState<'intelligence' | 'conceptMap'>('intelligence');

  return (
    <section id="evaluator-demo" className="py-24 bg-[#FDFCFB] border-t border-[#EAE7DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF0E6] text-[#FF6321] text-xs font-bold uppercase tracking-widest">
            <FileText className="w-3.5 h-3.5" />
            <span>AI Diagnostic Intelligence</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-[#1A1A1A] tracking-tight">
            Handwritten Subjective Answer Evaluation
          </h2>

          <p className="text-base sm:text-lg text-[#555] font-normal leading-relaxed">
            Students write on traditional paper with pen. ClassMap parses handwritten reasoning step-by-step, uncover hidden misconceptions, and maps conceptual gaps for schools and coaching institutes.
          </p>
        </div>

        {/* Sample Selection Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <span className="text-xs font-bold text-[#8A877D] uppercase tracking-wider mr-2">
            Select Sample Paper:
          </span>
          {ANSWER_SHEET_SAMPLES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => setSelectedSample(sample)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                selectedSample.id === sample.id
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md scale-102'
                  : 'bg-white text-[#555] border-[#E0DDD3] hover:bg-[#F5F3ED] hover:text-[#1A1A1A]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#FF6321]" />
              <span>{sample.subject}</span>
              <span className="text-[10px] font-mono opacity-80">({sample.grade})</span>
            </button>
          ))}
        </div>

        {/* Interactive Evaluator Container */}
        <div className="bg-white rounded-3xl border border-[#EEE] shadow-xl overflow-hidden">
          {/* Top Inspector Bar */}
          <div className="bg-[#1A1A1A] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-[#333]">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#FF6321]" />
              <div>
                <div className="text-sm font-bold tracking-wide">
                  {selectedSample.subject} • {selectedSample.topic}
                </div>
                <div className="text-xs text-stone-400">
                  Student: <span className="text-white font-medium">{selectedSample.studentName}</span> ({selectedSample.grade})
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <div className="px-3 py-1 rounded-md bg-[#2B2B2B] text-stone-300 font-mono">
                Traditional Score: <span className="text-stone-400 line-through font-bold ml-1">{selectedSample.traditionalMarks}</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-[#FFF0E6] text-[#FF6321] font-bold">
                ClassMap Verdict: Misconception Mapped
              </div>
            </div>
          </div>

          {/* Main 2-Column Inspector Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
            {/* Left Column: Simulated Handwritten Document */}
            <div className="lg:col-span-6 p-6 bg-[#FCFCFB] border-r border-[#F0F0F0] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E2D8] mb-4">
                  <span className="text-xs font-bold text-[#8A877D] uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#FF6321]" />
                    Original Student Script ({selectedSample.questionNumber})
                  </span>
                  <span className="text-xs font-semibold text-[#52504A] bg-[#EFECE6] px-2.5 py-1 rounded-md">
                    Pen on Lined Paper
                  </span>
                </div>

                <p className="text-xs font-semibold text-[#1A1A1A] mb-3 bg-white p-3 rounded-xl border border-[#E5E2D8]">
                  <span className="text-[#FF6321] font-bold">Question:</span> {selectedSample.questionText}
                </p>

                {/* Handwritten Answer Paper Box */}
                <div className="relative rounded-2xl overflow-hidden border border-[#DCD8CD] shadow-xs bg-[#FFFDF9] p-4 font-serif">
                  <div className="absolute top-0 bottom-0 left-8 w-[1px] bg-red-300/60" />

                  <div className="space-y-3.5 pl-6 text-sm text-[#1e293b]">
                    <div className="font-sans text-xs text-[#64748b] italic border-b border-blue-100 pb-1">
                      Student Handwritten Response Steps:
                    </div>

                    {selectedSample.teacherAnnotations.map((anno, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-lg border text-xs font-mono transition-all ${
                          anno.type === 'concept'
                            ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                            : anno.type === 'reasoning'
                            ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                            : anno.type === 'presentation'
                            ? 'bg-blue-50/80 border-blue-200 text-blue-900'
                            : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                        }`}
                      >
                        <div className="font-bold flex items-center justify-between">
                          <span>{anno.line}</span>
                          <span className="text-[10px] uppercase tracking-wider font-sans px-1.5 py-0.5 rounded bg-white/80">
                            {anno.type}
                          </span>
                        </div>
                        <div className="text-[11px] font-sans mt-1 opacity-90">
                          ↳ <span className="font-medium">{anno.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Information Banner */}
              <div className="p-3.5 rounded-2xl bg-[#FFF0E6] border border-[#FF6321]/20 flex items-center justify-between text-xs">
                <span className="font-medium text-[#1A1A1A]">
                  Evaluation configured for CBSE, ICSE, IB & State Board Rubrics
                </span>
                <span className="text-[10px] font-bold text-[#FF6321] uppercase tracking-wider">
                  Automated Step Analysis
                </span>
              </div>
            </div>

            {/* Right Column: Intelligence Breakdown */}
            <div className="lg:col-span-6 p-6 bg-white flex flex-col justify-between">
              <div>
                {/* View Tabs */}
                <div className="flex items-center gap-2 pb-3 border-b border-[#F0ECE1] mb-5">
                  <button
                    onClick={() => setActiveTab('intelligence')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                      activeTab === 'intelligence'
                        ? 'bg-[#FFF0E6] text-[#FF6321] border border-[#FF6321]/30'
                        : 'text-[#6E6B63] hover:text-[#1A1A1A]'
                    }`}
                  >
                    7-Layer Gap Intelligence
                  </button>
                  <button
                    onClick={() => setActiveTab('conceptMap')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                      activeTab === 'conceptMap'
                        ? 'bg-[#FFF0E6] text-[#FF6321] border border-[#FF6321]/30'
                        : 'text-[#6E6B63] hover:text-[#1A1A1A]'
                    }`}
                  >
                    Concept Graph Node Map
                  </button>
                </div>

                {activeTab === 'intelligence' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    {/* Layer 1 & 2: Concept & Reasoning Gaps */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/80">
                        <div className="text-xs font-bold text-rose-900 flex items-center gap-1.5 mb-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          <span>1. Concept Gaps</span>
                        </div>
                        <ul className="space-y-1 text-xs text-rose-950">
                          {selectedSample.intelligenceBreakdown.conceptGaps.map((gap, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-rose-500 font-bold">•</span>
                              <span>{gap}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80">
                        <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-1.5">
                          <Brain className="w-3.5 h-3.5 text-amber-600" />
                          <span>2. Reasoning & Logic Flow</span>
                        </div>
                        <ul className="space-y-1 text-xs text-amber-950">
                          {selectedSample.intelligenceBreakdown.reasoningFlaws.map((flaw, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-amber-500 font-bold">•</span>
                              <span>{flaw}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Layer 3 & 4: Presentation & Misconception Pattern */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/80">
                        <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5 mb-1.5">
                          <Layers className="w-3.5 h-3.5 text-blue-600" />
                          <span>3. Presentation & Steps</span>
                        </div>
                        <ul className="space-y-1 text-xs text-blue-950">
                          {selectedSample.intelligenceBreakdown.presentationFlaws.map((pf, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-blue-500 font-bold">•</span>
                              <span>{pf}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200/80">
                        <div className="text-xs font-bold text-purple-900 flex items-center gap-1.5 mb-1.5">
                          <RotateCcw className="w-3.5 h-3.5 text-purple-600" />
                          <span>4. Misconception Pattern</span>
                        </div>
                        <ul className="space-y-1 text-xs text-purple-950">
                          {selectedSample.intelligenceBreakdown.misconceptionPatterns.map((mp, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-purple-500 font-bold">•</span>
                              <span>{mp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Layer 5 & 6: Recurring Mistakes & Behavior */}
                    <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E2DFD4] space-y-2">
                      <div className="text-xs font-bold text-[#12151C] flex items-center gap-1.5">
                        <TrendingDown className="w-3.5 h-3.5 text-[#F95721]" />
                        <span>5. Longitudinal Recurring Mistakes</span>
                      </div>
                      <p className="text-xs text-[#52504A]">
                        {selectedSample.intelligenceBreakdown.recurringMistakes[0]}
                      </p>
                      <div className="text-[11px] text-[#706D63] italic">
                        Behavior: {selectedSample.intelligenceBreakdown.learningBehavior}
                      </div>
                    </div>

                    {/* Layer 7: Remedial Action */}
                    <div className="p-4 rounded-xl bg-[#FFF2EE] border-l-4 border-[#F95721] space-y-1">
                      <div className="text-xs font-bold text-[#D43D0C] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#F95721]" />
                        <span>7. Actionable Teacher & Student Remedy</span>
                      </div>
                      <p className="text-xs font-semibold text-[#12151C]">
                        {selectedSample.intelligenceBreakdown.remedialAction}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'conceptMap' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="p-3 bg-[#FAF8F3] rounded-xl border border-[#E2DFD4] text-xs text-[#52504A]">
                      Connected Concept Graph for <span className="font-bold text-[#12151C]">{selectedSample.topic}</span>:
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedSample.conceptMapNodes.map((node, i) => (
                        <div
                          key={i}
                          className={`p-4 rounded-xl border flex flex-col justify-between ${
                            node.status === 'mastered'
                              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                              : node.status === 'misconception'
                              ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                              : 'bg-rose-50/60 border-rose-200 text-rose-950'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold">{node.concept}</span>
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                node.status === 'mastered'
                                  ? 'bg-emerald-200 text-emerald-900'
                                  : node.status === 'misconception'
                                  ? 'bg-amber-200 text-amber-900'
                                  : 'bg-rose-200 text-rose-900'
                              }`}>
                                {node.status}
                              </span>
                            </div>
                            <div className="w-full bg-white/80 h-2 rounded-full overflow-hidden mt-3">
                              <div
                                className={`h-full ${
                                  node.status === 'mastered'
                                    ? 'bg-emerald-500'
                                    : node.status === 'misconception'
                                    ? 'bg-amber-500'
                                    : 'bg-rose-500'
                                }`}
                                style={{ width: `${node.impactScore}%` }}
                              />
                            </div>
                          </div>

                          <div className="text-[10px] text-stone-600 font-mono mt-2 text-right">
                            Mastery Score: {node.impactScore}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom CTA Inside Evaluator Box */}
              <div className="pt-6 mt-6 border-t border-[#F0ECE1] flex items-center justify-between">
                <div className="text-xs text-[#706E66]">
                  Supports Schools & Coaching Centres across India
                </div>

                <button
                  onClick={onOpenAudit}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#FF6321] hover:text-[#E05215] cursor-pointer"
                >
                  <span>Book Demo For Your Institution</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
