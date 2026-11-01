import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Lock,
  Database,
  EyeOff,
  FileCheck,
  Building2,
  Server,
  UserCheck,
  Clock,
  ArrowLeft,
  Search,
  CheckCircle2,
  AlertCircle,
  Mail,
  MapPin,
  FileText
} from 'lucide-react';
import { EASE, Eyebrow, GlowCard, Reveal, WordReveal } from './ui/primitives';

interface PrivacyPolicyProps {
  onBackToHome: () => void;
  onOpenAudit?: () => void;
}

const GUARANTEES = [
  { icon: ShieldCheck, title: 'Zero Data Selling', body: 'We never sell, rent, or monetize student, teacher, or school data. Period.', tone: 'text-emerald-300 bg-emerald-400/10 ring-emerald-400/30' },
  { icon: Database, title: '100% Institution Owned', body: 'Schools retain complete legal ownership over all diagnostic reports and answer paper scans.', tone: 'text-[#FF8A4C] bg-[#FF6321]/15 ring-[#FF6321]/30' },
  { icon: EyeOff, title: 'No Public AI Training', body: 'Student answer scripts and teacher notes are NEVER used to train public LLM models.', tone: 'text-violet-300 bg-violet-400/10 ring-violet-400/30' },
  { icon: Lock, title: 'AES-256 Encrypted', body: 'All data is encrypted in-transit (TLS 1.3) and at-rest (AES-256) within MeitY cloud centers in India.', tone: 'text-sky-300 bg-sky-400/10 ring-sky-400/30' }
];

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({
  onBackToHome,
  onOpenAudit
}) => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const sections = [
    { id: 'overview', title: '1. Overview & Scope' },
    { id: 'collection', title: '2. Information We Collect' },
    { id: 'usage', title: '3. How We Use Information' },
    { id: 'ai-governance', title: '4. AI & Model Safeguards' },
    { id: 'security', title: '5. Security & Data Residency' },
    { id: 'sharing', title: '6. Data Sharing & Sub-Processors' },
    { id: 'dpdp-rights', title: '7. DPDP Act & Principal Rights' },
    { id: 'children-data', title: '8. Minors & Student Safeguards' },
    { id: 'retention', title: '9. Retention & Cryptographic Wipe' },
    { id: 'contact', title: '10. Grievance Officer & Contact' }
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  /* Scrollspy: the contents list follows the section the reader is actually
     in, rather than only the one they last clicked. */
  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: '-18% 0px -68% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#07080C] pb-24 font-sans text-stone-200">

      {/* Top Header Banner */}
      <div className="noise relative isolate overflow-hidden bg-[#07080C] pb-36 pt-32 text-white sm:pt-40">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-20%] h-[640px] w-[980px] -translate-x-1/2 animate-aurora rounded-full bg-[radial-gradient(closest-side,rgba(255,99,33,0.26),rgba(255,99,33,0.05)_60%,transparent)] blur-2xl" />
          <div className="absolute -right-24 bottom-0 h-[420px] w-[520px] animate-aurora rounded-full bg-[radial-gradient(closest-side,rgba(52,211,153,0.14),transparent)] blur-3xl [animation-delay:-8s]" />
          <div className="bg-grid-dark absolute inset-0" />
        </div>

        <div className="mx-auto max-w-[1280px] space-y-9 px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb / Back Button */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={onBackToHome}
              className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-white/[0.06] px-4 py-2 text-xs font-semibold text-stone-200 shadow-[0_0_0_1px_rgba(255,255,255,0.09)] backdrop-blur transition-all duration-300 hover:bg-white/[0.11] hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-[#FF6321] transition-transform duration-300 group-hover:-translate-x-0.5" />
              <span>Back to ClassMap Overview</span>
            </button>

            <span className="hidden font-mono text-[11px] tracking-tight text-stone-500 sm:inline">
              Doc Ref: CMP-PRIV-2026-V2.4
            </span>
          </div>

          {/* Title & Metadata */}
          <div className="max-w-4xl space-y-6">
            <Reveal>
              <Eyebrow tone="dark" icon={<ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />} className="!text-emerald-300">
                DPDP Act 2023 Compliant • ISO 27001 Certified
              </Eyebrow>
            </Reveal>

            <h1 className="text-balance text-[2.5rem] font-semibold leading-[1] tracking-[-0.045em] sm:text-6xl lg:text-[4.6rem]">
              <WordReveal text="Privacy Policy &" wordClassName="text-gradient-light" />
              <br />
              <WordReveal text="Data Governance" wordClassName="text-gradient-brand" delay={0.2} />
            </h1>

            <Reveal delay={0.25}>
              <p className="max-w-2xl text-pretty text-base leading-relaxed text-stone-400 sm:text-lg">
                At ClassMap Learning Technologies, we hold educational data privacy as a sacred trust. This policy governs how student diagnostic records, handwritten answer sheet evaluations, and institutional concept intelligence are processed, secured, and protected.
              </p>
            </Reveal>

            <Reveal delay={0.32}>
              <div className="flex flex-wrap gap-2.5 pt-1 text-xs">
                {[
                  ['Effective Date', 'August 1, 2026'],
                  ['Data Residency', 'Mumbai & Hyderabad, India'],
                  ['Version', '2.4']
                ].map(([k, v]) => (
                  <div key={k} className="rounded-full bg-white/[0.05] px-3.5 py-2 text-stone-400 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
                    {k}: <span className="font-semibold text-white">{v}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Main Content Layout with Sticky Sidebar Navigation */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">

        {/* Core Privacy Guarantees Grid: overlaps the banner so the two read as one surface. */}
        <div className="relative z-10 -mt-20 mb-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {GUARANTEES.map(({ icon: Icon, title, body, tone }, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <GlowCard tilt={3}
                glow="rgba(255, 99, 33, 0.14)"
                className="h-full rounded-[24px] bg-[#0E1016] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_30px_50px_-30px_rgba(0,0,0,0.9)]"
              >
                <div className="relative z-10 space-y-3">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 ring-inset ${tone}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-[15px] font-semibold tracking-tight text-white">{title}</h3>
                  <p className="text-[13px] leading-relaxed text-stone-400">{body}</p>
                </div>
              </GlowCard>
            </Reveal>
          ))}
        </div>

        {/* Layout Grid: Sidebar Navigation + Policy Text */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">

          {/* Sticky Table of Contents Sidebar */}
          <div className="space-y-4 rounded-[24px] bg-[#0E1016] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] lg:sticky lg:top-24 lg:col-span-3">

            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
              <FileText className="h-4 w-4 text-[#FF6321]" />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                Contents
              </span>
            </div>

            {/* Quick Filter */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-500" />
              <input
                type="text"
                placeholder="Search policy terms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl bg-white/[0.05] py-2 pl-8 pr-3 text-xs text-white shadow-[0_0_0_1px_rgba(255,255,255,0.1)] transition-shadow placeholder:text-stone-500 focus:outline-none focus:shadow-[0_0_0_1px_rgba(255,99,33,0.8),0_0_0_4px_rgba(255,99,33,0.12)]"
              />
            </div>

            {/* Navigation Buttons */}
            <nav className="max-h-[52vh] space-y-0.5 overflow-y-auto pr-1">
              {sections
                .filter((s) => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((sec) => {
                  const active = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={`relative flex w-full cursor-pointer items-center rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition-colors duration-200 ${
                        active ? 'text-white' : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="toc-active"
                          transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                          className="absolute inset-0 rounded-xl bg-[#FF6321]/15 ring-1 ring-inset ring-[#FF6321]/30"
                        />
                      )}
                      {active && <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-[#FF6321]" />}
                      <span className="relative">{sec.title}</span>
                    </button>
                  );
                })}
            </nav>

            {/* Assistance CTA */}
            <div className="space-y-2 border-t border-white/[0.08] pt-4">
              <div className="text-xs font-semibold text-white">Questions about data privacy?</div>
              <p className="text-xs leading-relaxed text-stone-400">
                Contact our designated Data Protection Officer at{' '}
                <a href="mailto:info@classmap.in" className="font-semibold text-[#FF8A4C] underline underline-offset-2">
                  info@classmap.in
                </a>
              </p>
              {onOpenAudit && (
                <button
                  onClick={onOpenAudit}
                  className="mt-2 w-full cursor-pointer rounded-full bg-[#FF6321] py-2.5 text-center text-xs font-semibold text-white shadow-[0_10px_26px_-8px_rgba(255,99,33,0.7)] transition-colors hover:bg-[#FF7A3D]"
                >
                  Request Security Audit Document
                </button>
              )}
            </div>
          </div>

          {/* Main Policy Content Column */}
          <div className="lg:col-span-9 bg-[#0B0D13] p-6 sm:p-12 rounded-[28px] shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_40px_80px_-50px_rgba(255,99,33,0.25)] space-y-14 leading-[1.75] text-[15px] text-stone-400">
            
            {/* 1. OVERVIEW & SCOPE */}
            <section id="overview" className="scroll-mt-28 space-y-4 pt-2 border-b border-white/[0.08] pb-12">
              <div className="flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#FF8A4C]">
                <FileCheck className="w-4 h-4" />
                <span>Section 01</span>
              </div>
              <h2 className="text-2xl sm:text-[1.9rem] font-semibold text-white tracking-[-0.03em] leading-tight">
                1. Overview & Operational Scope
              </h2>
              <p>
                ClassMap Learning Technologies India Private Limited (&ldquo;ClassMap&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) operates an enterprise Learning Gap Intelligence platform designed for educational institutions, K-12 partner schools, coaching institutes, and educational boards across India.
              </p>
              <p>
                Under the Indian <strong className="text-white">Digital Personal Data Protection (DPDP) Act, 2023</strong>, educational institutions act as <strong className="text-white">Data Fiduciaries</strong> who determine the purpose and means of student record processing. ClassMap acts strictly as a <strong className="text-white">Data Processor</strong> handling data solely on the instruction and authority of the respective school or coaching institute.
              </p>
              <div className="bg-white/[0.04] p-4 rounded-2xl ring-1 ring-inset ring-white/[0.08] space-y-2 text-xs">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Institutional Service Level Guarantee</span>
                </div>
                <p className="text-stone-400">
                  This policy applies to all portals (Teacher Portal, Student Portal, Admin Portal) accessible via ClassMap mobile applications, web portals, and API integrations.
                </p>
              </div>
            </section>

            {/* 2. INFORMATION WE COLLECT */}
            <section id="collection" className="scroll-mt-28 space-y-4 border-b border-white/[0.08] pb-12">
              <div className="flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#FF8A4C]">
                <Database className="w-4 h-4" />
                <span>Section 02</span>
              </div>
              <h2 className="text-2xl sm:text-[1.9rem] font-semibold text-white tracking-[-0.03em] leading-tight">
                2. Information We Collect
              </h2>
              <p>
                To provide precise concept gap diagnostics and automated remedial learning sheets, ClassMap collects only the minimum necessary data points authorized by the partner institution:
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-4 bg-white/[0.04] rounded-2xl ring-1 ring-inset ring-white/[0.08] space-y-1.5">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-white">
                    A. Institutional & User Account Data
                  </h4>
                  <ul className="list-disc pl-5 text-[13.5px] text-stone-400 space-y-1">
                    <li>School/Institute Name, Board Affiliation (CBSE, ICSE, State Boards, DBSE), and Address</li>
                    <li>Teacher and Administrator names, institutional email addresses, and phone numbers</li>
                    <li>Student roll numbers, assigned grade/section, and unique anonymized system IDs</li>
                  </ul>
                </div>

                <div className="p-4 bg-white/[0.04] rounded-2xl ring-1 ring-inset ring-white/[0.08] space-y-1.5">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-white">
                    B. Student Evaluation & Diagnostic Data
                  </h4>
                  <ul className="list-disc pl-5 text-[13.5px] text-stone-400 space-y-1">
                    <li>Digitized image scans of student handwritten answer sheets and assessment booklets</li>
                    <li>Teacher evaluation notes, rubric scores, question-wise marks, and concept tag mappings</li>
                    <li>Concept mastery logs, historical test series performance, and generated remedial exercise attempts</li>
                  </ul>
                </div>

                <div className="p-4 bg-white/[0.04] rounded-2xl ring-1 ring-inset ring-white/[0.08] space-y-1.5">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-white">
                    C. Technical & Usage Telemetry
                  </h4>
                  <ul className="list-disc pl-5 text-[13.5px] text-stone-400 space-y-1">
                    <li>Device IP address, browser type, operating system version, and portal session timestamps</li>
                    <li>Encrypted OAuth access tokens and session authentication cookies</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 3. HOW WE USE INFORMATION */}
            <section id="usage" className="scroll-mt-28 space-y-4 border-b border-white/[0.08] pb-12">
              <div className="flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#FF8A4C]">
                <Server className="w-4 h-4" />
                <span>Section 03</span>
              </div>
              <h2 className="text-2xl sm:text-[1.9rem] font-semibold text-white tracking-[-0.03em] leading-tight">
                3. How We Use Your Information
              </h2>
              <p>
                All data processed by ClassMap is strictly dedicated to fulfilling educational and academic objectives:
              </p>
              <ul className="list-disc pl-5 text-[14px] text-stone-400 space-y-2 leading-relaxed">
                <li><strong>Optical Evaluation & Analysis:</strong> Processing scanned handwritten answer scripts to extract question-wise marks and identify specific conceptual misconceptions.</li>
                <li><strong>Diagnostic Intelligence Graphs:</strong> Aggregating class-wide and student-specific concept mastery trees for principals, HODs, and teachers.</li>
                <li><strong>Personalized Remediation:</strong> Automatically constructing customized practice sheets targeting individual student learning gaps.</li>
                <li><strong>System Reliability & Security:</strong> Monitoring platform performance, detecting unauthorized access, and maintaining audit trails.</li>
              </ul>
              <div className="p-4 bg-[#FF6321]/10 rounded-2xl ring-1 ring-inset ring-[#FF6321]/25 text-xs text-white font-medium flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#FF6321] shrink-0 mt-0.5" />
                <div>
                  <strong>Strict Prohibition on Commercial Exploitation:</strong> ClassMap does not build behavioral advertising profiles, analyze student data for third-party marketing, or serve external banner ads within any portal.
                </div>
              </div>
            </section>

            {/* 4. AI & MODEL SAFEGUARDS */}
            <section id="ai-governance" className="scroll-mt-28 space-y-4 border-b border-white/[0.08] pb-12">
              <div className="flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#FF8A4C]">
                <EyeOff className="w-4 h-4" />
                <span>Section 04</span>
              </div>
              <h2 className="text-2xl sm:text-[1.9rem] font-semibold text-white tracking-[-0.03em] leading-tight">
                4. AI & Model Safeguards (CuePilot Standard)
              </h2>
              <p>
                ClassMap employs sophisticated artificial intelligence and vision transformer models to evaluate subjective handwritten papers and generate concept maps. We operate under strict AI safety controls:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-white/[0.04] ring-1 ring-inset ring-white/[0.08] space-y-1">
                  <div className="font-bold text-white">Zero-Retention Endpoints</div>
                  <p className="text-stone-400">All AI evaluation inference occurs on dedicated enterprise endpoints with zero data retention policies on AI model servers.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.04] ring-1 ring-inset ring-white/[0.08] space-y-1">
                  <div className="font-bold text-white">No Public Training</div>
                  <p className="text-stone-400">Student handwriting scans, teacher comments, and test papers are never ingested into open-web foundation models.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.04] ring-1 ring-inset ring-white/[0.08] space-y-1">
                  <div className="font-bold text-white">Isolated Tenant Enclaves</div>
                  <p className="text-stone-400">Each partner school&apos;s data is logically segregated within isolated cloud database instances.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.04] ring-1 ring-inset ring-white/[0.08] space-y-1">
                  <div className="font-bold text-white">Human-in-the-Loop</div>
                  <p className="text-stone-400">AI evaluation recommendations remain subject to teacher override, review, and final academic sign-off.</p>
                </div>
              </div>
            </section>

            {/* 5. SECURITY & DATA RESIDENCY */}
            <section id="security" className="scroll-mt-28 space-y-4 border-b border-white/[0.08] pb-12">
              <div className="flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#FF8A4C]">
                <Lock className="w-4 h-4" />
                <span>Section 05</span>
              </div>
              <h2 className="text-2xl sm:text-[1.9rem] font-semibold text-white tracking-[-0.03em] leading-tight">
                5. Security Architecture & Data Residency
              </h2>
              <p>
                We maintain an enterprise-grade security posture compliant with ISO/IEC 27001 standards:
              </p>
              <ul className="list-disc pl-5 text-[14px] text-stone-400 space-y-2">
                <li><strong>Indian Data Sovereign Residency:</strong> All database clusters, object storage buckets for scanned papers, and backups reside exclusively in MeitY-empanelled data centers in Mumbai and Hyderabad, India.</li>
                <li><strong>In-Transit Encryption:</strong> All browser and mobile communication is encrypted using TLS 1.3 with SHA-256 signatures.</li>
                <li><strong>At-Rest Encryption:</strong> Stored files and relational databases are encrypted using AES-256 standard keys managed via Cloud KMS.</li>
                <li><strong>Role-Based Access Control (RBAC):</strong> Strict administrative scoping ensures teachers only access their assigned sections, and students view only their personal diagnostic journey.</li>
              </ul>
            </section>

            {/* 6. DATA SHARING & SUB-PROCESSORS */}
            <section id="sharing" className="scroll-mt-28 space-y-4 border-b border-white/[0.08] pb-12">
              <div className="flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#FF8A4C]">
                <Building2 className="w-4 h-4" />
                <span>Section 06</span>
              </div>
              <h2 className="text-2xl sm:text-[1.9rem] font-semibold text-white tracking-[-0.03em] leading-tight">
                6. Data Sharing & Infrastructure Sub-Processors
              </h2>
              <p>
                ClassMap does not transfer student or school data to unauthorized third parties. Data is shared exclusively with vetted infrastructure providers essential to service delivery:
              </p>
              <div className="overflow-x-auto ring-1 ring-inset ring-white/[0.08] rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/[0.04] border-b border-white/[0.08] text-white font-bold">
                    <tr>
                      <th className="p-3">Sub-processor</th>
                      <th className="p-3">Purpose</th>
                      <th className="p-3">Location</th>
                      <th className="p-3">Compliance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.08] text-stone-400">
                    <tr>
                      <td className="p-3 font-semibold text-white">Google Cloud Platform (GCP)</td>
                      <td className="p-3">Cloud Compute, Firestore & Storage</td>
                      <td className="p-3">Asia-South1 (Mumbai)</td>
                      <td className="p-3">ISO 27001, SOC 2 Type II</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white">AWS India</td>
                      <td className="p-3">Encrypted Image Backups & Optical OCR</td>
                      <td className="p-3">Asia-South2 (Hyderabad)</td>
                      <td className="p-3">ISO 27017, MeitY Empanelled</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white">Fast2SMS / Gupshup</td>
                      <td className="p-3">Transactional OTP & Portal Alerts</td>
                      <td className="p-3">India</td>
                      <td className="p-3">TRAI Compliant DLT</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 7. DPDP ACT & PRINCIPAL RIGHTS */}
            <section id="dpdp-rights" className="scroll-mt-28 space-y-4 border-b border-white/[0.08] pb-12">
              <div className="flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#FF8A4C]">
                <UserCheck className="w-4 h-4" />
                <span>Section 07</span>
              </div>
              <h2 className="text-2xl sm:text-[1.9rem] font-semibold text-white tracking-[-0.03em] leading-tight">
                7. Rights of Data Principals under DPDP Act 2023
              </h2>
              <p>
                In accordance with Chapter III of the Digital Personal Data Protection Act, 2023, parents, legal guardians, and adult students exercise explicit rights regarding their personal data:
              </p>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-2xl bg-white/[0.04] ring-1 ring-inset ring-white/[0.08] flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Right to Access Information:</strong> Request a comprehensive summary of personal diagnostic data and processing activities.
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.04] ring-1 ring-inset ring-white/[0.08] flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Right to Correction & Erasure:</strong> Request rectifying inaccurate marks or permanent deletion of student records upon institutional approval.
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.04] ring-1 ring-inset ring-white/[0.08] flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Right of Grievance Redressal:</strong> Direct access to ClassMap&apos;s designated Grievance Officer with guaranteed 48-hour acknowledgment.
                  </div>
                </div>
              </div>
            </section>

            {/* 8. MINORS & STUDENT SAFEGUARDS */}
            <section id="children-data" className="scroll-mt-28 space-y-4 border-b border-white/[0.08] pb-12">
              <div className="flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#FF8A4C]">
                <ShieldCheck className="w-4 h-4" />
                <span>Section 08</span>
              </div>
              <h2 className="text-2xl sm:text-[1.9rem] font-semibold text-white tracking-[-0.03em] leading-tight">
                8. Minors & Children&apos;s Data Protection
              </h2>
              <p>
                Recognizing that K-12 students are minors under 18 years of age, ClassMap enforces mandatory protective safeguards:
              </p>
              <ul className="list-disc pl-5 text-[14px] text-stone-400 space-y-2">
                <li>Institutional Verifiable Parental Consent obtained directly through partner school enrollment agreements.</li>
                <li>Zero tracking or profiling for non-educational, commercial, or behavioral purposes.</li>
                <li>Strict prohibition on direct messaging or unmonitored external chat communication between students and third parties.</li>
              </ul>
            </section>

            {/* 9. RETENTION & CRYPTOGRAPHIC WIPE */}
            <section id="retention" className="scroll-mt-28 space-y-4 border-b border-white/[0.08] pb-12">
              <div className="flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#FF8A4C]">
                <Clock className="w-4 h-4" />
                <span>Section 09</span>
              </div>
              <h2 className="text-2xl sm:text-[1.9rem] font-semibold text-white tracking-[-0.03em] leading-tight">
                9. Data Retention & Cryptographic Wipe Policy
              </h2>
              <p>
                ClassMap retains data only for the active duration of the partner institution&apos;s subscription contract. Upon contract expiration or termination:
              </p>
              <ul className="list-disc pl-5 text-[14px] text-stone-400 space-y-1.5">
                <li>Schools are provided a 30-day window to export all raw PDF diagnostic reports, student answer scripts, and marks spreadsheets.</li>
                <li>Following the 30-day export window, all tenant databases, backup snapshots, and image object stores undergo NIST 800-88 compliant cryptographic wiping.</li>
              </ul>
            </section>

            {/* 10. GRIEVANCE OFFICER & CONTACT */}
            <section id="contact" className="scroll-mt-28 space-y-4 pt-2">
              <div className="flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#FF8A4C]">
                <Mail className="w-4 h-4" />
                <span>Section 10</span>
              </div>
              <h2 className="text-2xl sm:text-[1.9rem] font-semibold text-white tracking-[-0.03em] leading-tight">
                10. Grievance Redressal & Contact Details
              </h2>
              <p>
                If you have questions, concerns, or wish to exercise data principal rights under the DPDP Act 2023, please reach out to our designated Data Protection & Grievance Officer:
              </p>

              <div className="noise relative isolate overflow-hidden p-7 bg-[#07080C] text-white rounded-[24px] shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_40px_70px_-30px_rgba(255,99,33,0.3)] space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FF6321] text-white flex items-center justify-center font-bold">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Office of the Data Protection Officer</h3>
                    <p className="text-xs text-stone-300">ClassMap Learning Technologies India Pvt. Ltd.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs text-stone-300">
                  <div className="space-y-1">
                    <span className="text-stone-500 uppercase tracking-wider text-[10px] font-bold block">Grievance Email</span>
                    <a href="mailto:info@classmap.in" className="text-[#FF6321] font-bold hover:underline block text-sm">
                      info@classmap.in
                    </a>
                  </div>

                  <div className="space-y-1">
                    <span className="text-stone-500 uppercase tracking-wider text-[10px] font-bold block">Helpline Phone</span>
                    <a href="tel:+918981716969" className="text-white font-mono font-bold block">
                      +91-8981716969
                    </a>
                  </div>

                  <div className="sm:col-span-2 space-y-1 pt-2 border-t border-[#2A2E3D]">
                    <span className="text-stone-500 uppercase tracking-wider text-[10px] font-bold block">Registered Headquarters</span>
                    <div className="flex items-center gap-2 text-stone-300">
                      <MapPin className="w-4 h-4 text-[#FF6321] shrink-0" />
                      <span>ClassMap HQ, Outer Ring Road, Bellandur, Bengaluru, Karnataka - 560103, India</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Final Back to Top Bar */}
              <div className="pt-6 flex items-center justify-between">
                <button
                  onClick={onBackToHome}
                  className="px-5 py-2.5 rounded-full bg-[#FF6321] text-white shadow-[0_10px_26px_-8px_rgba(255,99,33,0.7)] hover:bg-[#FF7A3D] transition-colors text-xs font-bold cursor-pointer"
                >
                  Return to ClassMap Home
                </button>

                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-xs text-stone-400 hover:text-[#FF6321] font-bold underline cursor-pointer"
                >
                  Back to Top ↑
                </button>
              </div>

            </section>

          </div>

        </div>

      </div>

    </div>
  );
};
