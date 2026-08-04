import React, { useState } from 'react';
import {
  BarChart3,
  Users,
  UserCheck,
  LayoutDashboard,
  Building2,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Sliders,
  Download,
  BookOpen,
  ArrowUpRight,
  Flame,
  Star,
  Award,
  Filter,
  FileSpreadsheet,
  Zap,
  Target
} from 'lucide-react';
import { DASHBOARD_TABS, CLASS_HEATMAP_DATA } from '../data/mockData';

interface ProductShowcaseProps {
  onOpenAudit: () => void;
}

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({ onOpenAudit }) => {
  const [activeTab, setActiveTab] = useState<string>('heatmap');
  const [selectedSection, setSelectedSection] = useState<string>('all');

  return (
    <section id="dashboards" className="py-24 bg-[#FDFCFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF0E6] text-[#FF6321] text-xs font-bold uppercase tracking-widest">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Usable Intelligence Dashboards</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-[#1A1A1A] tracking-tight">
            Designed for Action, Not Unread Analytics
          </h2>

          <p className="text-base sm:text-lg text-[#555] font-normal leading-relaxed">
            Every dashboard in ClassMap answers one question for its user: <span className="font-semibold text-[#1A1A1A]">"What should I do next to help this student learn?"</span>
          </p>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center justify-center gap-2.5 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {DASHBOARD_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                activeTab === tab.id
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md scale-102'
                  : 'bg-white text-[#555] border-[#E0DDD3] hover:bg-[#FAF8F3] hover:text-[#1A1A1A]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{tab.label}</span>
              </div>
              <span className="block text-[10px] font-normal opacity-70 font-mono mt-0.5">
                {tab.role}
              </span>
            </button>
          ))}
        </div>

        {/* Interactive Dashboard Container */}
        <div className="bg-white rounded-3xl border border-[#EEE] shadow-xl overflow-hidden p-6 lg:p-8 relative">
          
          {/* TAB 1: Class Learning Heatmap */}
          {activeTab === 'heatmap' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#F0ECE1]">
                <div>
                  <h3 className="text-xl font-serif font-semibold text-[#1A1A1A] flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#FF6321]" />
                    <span>Class 10 Physics & Chemistry — Concept Mastery Heatmap</span>
                  </h3>
                  <p className="text-xs text-[#777] mt-0.5">
                    Aggregated subjective test results across 3 sections (120 students)
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full font-bold text-[11px] border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Mastered (&gt;80%)</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-full font-bold text-[11px] border border-amber-200">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Review Needed</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-800 rounded-full font-bold text-[11px] border border-rose-200">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>Critical Gap</span>
                  </div>
                </div>
              </div>

              {/* Heatmap Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#FAF8F3] border-b border-[#E0DDD3] text-[#706E66] font-bold uppercase tracking-wider">
                      <th className="p-3.5 rounded-l-xl">Syllabus Concept / Learning Outcome</th>
                      <th className="p-3.5 text-center">Class 10-A</th>
                      <th className="p-3.5 text-center">Class 10-B</th>
                      <th className="p-3.5 text-center">Class 10-C</th>
                      <th className="p-3.5 text-right rounded-r-xl">Status & Intervention</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0ECE1]">
                    {CLASS_HEATMAP_DATA.map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#FFFDF9] transition-colors">
                        <td className="p-3.5 font-bold text-[#1A1A1A]">{row.concept}</td>
                        <td className="p-3.5 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full font-bold font-mono ${
                            row.sectionA >= 80 ? 'bg-emerald-100 text-emerald-800' : row.sectionA >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {row.sectionA}%
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full font-bold font-mono ${
                            row.sectionB >= 80 ? 'bg-emerald-100 text-emerald-800' : row.sectionB >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {row.sectionB}%
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full font-bold font-mono ${
                            row.sectionC >= 80 ? 'bg-emerald-100 text-emerald-800' : row.sectionC >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {row.sectionC}%
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <span className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                            row.overall === 'Mastered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : row.overall === 'Review Needed' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {row.overall}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Class Action Banner */}
              <div className="p-5 rounded-2xl bg-[#FFF0E6] border border-[#FF6321]/30 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-[#FF6321] text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Recommended Classroom Intervention</span>
                  </span>
                  <p className="text-[#1A1A1A] font-medium leading-relaxed">
                    Sections 10-A, 10-B, and 10-C show &lt;45% mastery in <span className="font-bold">"Vector Direction of Friction"</span>. A 10-minute micro-lesson before starting Chapter 4 is recommended.
                  </p>
                </div>
                <button
                  onClick={onOpenAudit}
                  className="px-5 py-3 rounded-full bg-[#FF6321] hover:bg-[#E05215] text-white font-bold text-xs shadow-md transition-colors cursor-pointer shrink-0"
                >
                  Generate 10-Min Remedial Sheet
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Student Learning Profile */}
          {activeTab === 'student-profile' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#F0ECE1]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#FFF0E6] border-2 border-[#FF6321]/30 flex items-center justify-center font-bold text-base text-[#FF6321] shrink-0">
                    AG
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-[#1A1A1A]">
                        Aarav Gupta — Student Learning Graph
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FFF0E6] text-[#FF6321] text-[11px] font-bold">
                        Level 4
                      </span>
                    </div>
                    <p className="text-xs text-[#777]">
                      Class 6 • CBSE Mathematics & Science • Roll No. 08 • Tracked since Class 5
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Grade Growth: +18.4% this Term</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Concept Strengths */}
                <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Mastered Concepts (90%+)</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-emerald-950 font-medium">
                    <li className="p-2.5 bg-white rounded-xl border border-emerald-100 shadow-2xs">
                      ✔ Proper & Improper Fractions
                    </li>
                    <li className="p-2.5 bg-white rounded-xl border border-emerald-100 shadow-2xs">
                      ✔ Decimal Place Value Conversions
                    </li>
                    <li className="p-2.5 bg-white rounded-xl border border-emerald-100 shadow-2xs">
                      ✔ Least Common Multiple (LCM)
                    </li>
                  </ul>
                </div>

                {/* Persistent Misconceptions */}
                <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Active Learning Gap</span>
                  </h4>
                  <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-1.5">
                    <span className="text-[10px] font-bold text-[#FF6321] uppercase">Identified Gap</span>
                    <p className="text-xs text-[#1A1A1A] font-semibold leading-snug">
                      Struggles with <span className="text-[#FF6321]">Negative Denominators</span> in fraction division.
                    </p>
                    <p className="text-[11px] text-[#666]">
                      Needs 5 diagnostic practice reps to stabilize numerator sign rules.
                    </p>
                  </div>
                </div>

                {/* Parent & Teacher Action Plan */}
                <div className="p-5 rounded-2xl bg-[#FFF0E6] border border-[#FF6321]/30 space-y-3">
                  <h4 className="text-xs font-bold text-[#FF6321] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#FF6321]" />
                    <span>Parent Insight Card</span>
                  </h4>
                  <p className="text-xs text-[#1A1A1A] leading-relaxed">
                    Aarav has high numeric speed. Do not assign extra long repetitive homework—assign 5 targeted diagnostic fraction reps instead.
                  </p>
                  <button
                    onClick={onOpenAudit}
                    className="w-full py-2.5 bg-[#FF6321] hover:bg-[#E05215] text-white rounded-full text-xs font-bold transition-colors cursor-pointer shadow-sm"
                  >
                    Send Automated Parent Report
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Teacher Action Hub */}
          {activeTab === 'teacher-hub' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="pb-4 border-b border-[#F0ECE1]">
                <h3 className="text-xl font-bold text-[#1A1A1A] flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-[#FF6321]" />
                  <span>Teacher Action Hub — 10-Minute Remedial Lessons</span>
                </h3>
                <p className="text-xs text-[#777] mt-0.5">
                  Saves teachers 12 hours every week by generating targeted micro-lessons directly from test evaluation data.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-[#FAF8F3] border border-[#E2DFD4] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#FF6321] uppercase tracking-wider bg-[#FFF0E6] px-3 py-1 rounded-full">
                      Mathematics Class 6
                    </span>
                    <span className="text-xs text-[#777] font-mono">14 Students Affected</span>
                  </div>

                  <h4 className="text-base font-bold text-[#1A1A1A]">
                    Micro-Lesson: Fraction Division with Negative Denominators
                  </h4>

                  <p className="text-xs text-[#555] leading-relaxed">
                    Use a 5-minute visual number line exercise showing why dividing by a negative number flips the direction vector on the graph.
                  </p>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-600">Estimated Time: 8 Mins</span>
                    <button
                      onClick={onOpenAudit}
                      className="px-4 py-2 rounded-full bg-[#1A1A1A] hover:bg-[#FF6321] text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Print Practice Worksheet
                    </button>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-[#FAF8F3] border border-[#E2DFD4] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#FF6321] uppercase tracking-wider bg-[#FFF0E6] px-3 py-1 rounded-full">
                      Physics Class 10
                    </span>
                    <span className="text-xs text-[#777] font-mono">18 Students Affected</span>
                  </div>

                  <h4 className="text-base font-bold text-[#1A1A1A]">
                    Micro-Lesson: Thermal Energy Loss in Friction & Braking
                  </h4>

                  <p className="text-xs text-[#555] leading-relaxed">
                    Demonstrate energy conservation in vehicle braking to address the misconception that friction forces eliminate energy completely.
                  </p>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-600">Estimated Time: 10 Mins</span>
                    <button
                      onClick={onOpenAudit}
                      className="px-4 py-2 rounded-full bg-[#1A1A1A] hover:bg-[#FF6321] text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      View Micro-Lesson Slide
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: School Director View */}
          {activeTab === 'school-leader' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="pb-4 border-b border-[#F0ECE1]">
                <h3 className="text-xl font-bold text-[#1A1A1A] flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#FF6321]" />
                  <span>School Leadership & Academic Director Overview</span>
                </h3>
                <p className="text-xs text-[#777] mt-0.5">
                  Macro institutional health analytics across all grades (Class 6 to Class 12)
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#FAF8F3] border border-[#E2DFD4]">
                  <span className="text-[10px] font-bold text-[#777] uppercase tracking-wider block">Total Students Mapped</span>
                  <span className="text-2xl font-black text-[#1A1A1A] font-mono">1,850</span>
                  <span className="text-[10px] text-emerald-600 block mt-1 font-semibold">100% Subjective Coverage</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#FAF8F3] border border-[#E2DFD4]">
                  <span className="text-[10px] font-bold text-[#777] uppercase tracking-wider block">Average Concept Mastery</span>
                  <span className="text-2xl font-black text-emerald-600 font-mono">78.4%</span>
                  <span className="text-[10px] text-emerald-600 block mt-1 font-semibold">+18.4% vs Last Unit Test</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#FAF8F3] border border-[#E2DFD4]">
                  <span className="text-[10px] font-bold text-[#777] uppercase tracking-wider block">Teacher Time Saved</span>
                  <span className="text-2xl font-black text-[#FF6321] font-mono">12.5 hrs/wk</span>
                  <span className="text-[10px] text-[#777] block mt-1">Per teacher average</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#FAF8F3] border border-[#E2DFD4]">
                  <span className="text-[10px] font-bold text-[#777] uppercase tracking-wider block">Board Alignment</span>
                  <span className="text-2xl font-black text-[#1A1A1A] font-mono">CBSE / ICSE</span>
                  <span className="text-[10px] text-emerald-600 block mt-1 font-semibold">Fully Compliant</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Evaluator Engine Tab fallback */}
          {activeTab === 'evaluator' && (
            <div className="p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FFF0E6] text-[#FF6321] mx-auto flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A]">
                Explore Real Handwritten Answer Sheet Evaluation Above
              </h3>
              <p className="text-xs text-[#555] max-w-md mx-auto">
                Scroll up or click below to test our live interactive handwritten answer evaluator with real physics, mathematics, and chemistry student papers.
              </p>
              <button
                onClick={() => {
                  const elem = document.getElementById('evaluator-demo');
                  elem?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-full bg-[#FF6321] text-white text-xs font-bold hover:bg-[#E05215] transition-colors cursor-pointer shadow-md"
              >
                Go To Handwritten Evaluator
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

