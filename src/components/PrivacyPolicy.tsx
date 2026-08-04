import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Database,
  EyeOff,
  FileCheck,
  Building2,
  Key,
  Server,
  UserCheck,
  Clock,
  ArrowLeft,
  Search,
  CheckCircle2,
  AlertCircle,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight,
  FileText,
  Sparkles
} from 'lucide-react';

interface PrivacyPolicyProps {
  onBackToHome: () => void;
  onOpenAudit?: () => void;
}

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

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-[#12151C] font-sans pb-24 animate-in fade-in duration-300">
      
      {/* Top Header Banner */}
      <div className="bg-[#12141D] text-white border-b border-[#2A2E3D] pt-12 pb-16 relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF6321]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          
          {/* Breadcrumb / Back Button */}
          <div className="flex items-center justify-between">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#222736] border border-[#333A50] text-stone-200 hover:text-white hover:border-[#FF6321] transition-all text-xs font-bold cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#FF6321]" />
              <span>Back to ClassMap Overview</span>
            </button>

            <span className="text-[11px] font-mono text-stone-400">
              Doc Ref: CMP-PRIV-2026-V2.4
            </span>
          </div>

          {/* Title & Metadata */}
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>DPDP Act 2023 Compliant • ISO 27001 Certified</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-white tracking-tight leading-tight">
              Privacy Policy & Data Governance
            </h1>

            <p className="text-sm sm:text-base text-stone-300 font-normal leading-relaxed">
              At ClassMap Learning Technologies, we hold educational data privacy as a sacred trust. This policy governs how student diagnostic records, handwritten answer sheet evaluations, and institutional concept intelligence are processed, secured, and protected.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-stone-400 font-medium">
              <div>Effective Date: <span className="text-white font-semibold">August 1, 2026</span></div>
              <div>•</div>
              <div>Data Residency: <span className="text-white font-semibold">Mumbai & Hyderabad, India</span></div>
              <div>•</div>
              <div>Version: <span className="text-white font-semibold">2.4</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout with Sticky Sidebar Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Core Privacy Guarantees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          
          <div className="bg-white p-5 rounded-2xl border border-[#EAE7DE] shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#12151C]">Zero Data Selling</h3>
            <p className="text-xs text-[#666] leading-relaxed">
              We never sell, rent, or monetize student, teacher, or school data. Period.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EAE7DE] shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-[#FFF0E6] border border-[#FF6321]/30 text-[#FF6321] flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#12151C]">100% Institution Owned</h3>
            <p className="text-xs text-[#666] leading-relaxed">
              Schools retain complete legal ownership over all diagnostic reports and answer paper scans.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EAE7DE] shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center font-bold">
              <EyeOff className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#12151C]">No Public AI Training</h3>
            <p className="text-xs text-[#666] leading-relaxed">
              Student answer scripts and teacher notes are NEVER used to train public LLM models.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EAE7DE] shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#12151C]">AES-256 Encrypted</h3>
            <p className="text-xs text-[#666] leading-relaxed">
              All data is encrypted in-transit (TLS 1.3) and at-rest (AES-256) within MeitY cloud centers in India.
            </p>
          </div>

        </div>

        {/* Layout Grid: Sidebar Navigation + Policy Text */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sticky Table of Contents Sidebar */}
          <div className="lg:col-span-4 sticky top-20 bg-white p-5 rounded-2xl border border-[#EAE7DE] shadow-xs space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEA]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#FF6321]" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#12151C]">
                  Policy Table of Contents
                </span>
              </div>
            </div>

            {/* Quick Filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#999]" />
              <input
                type="text"
                placeholder="Search policy terms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF9F6] border border-[#E0DDD3] rounded-xl focus:outline-none focus:border-[#FF6321]"
              />
            </div>

            {/* Navigation Buttons */}
            <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
              {sections
                .filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                      activeSection === sec.id
                        ? 'bg-[#FF6321] text-white shadow-xs'
                        : 'text-[#444] hover:bg-[#F5F3ED] hover:text-[#12151C]'
                    }`}
                  >
                    <span>{sec.title}</span>
                    <ChevronRight className={`w-3.5 h-3.5 ${activeSection === sec.id ? 'text-white' : 'text-[#BBB]'}`} />
                  </button>
                ))}
            </nav>

            {/* Assistance CTA */}
            <div className="pt-3 border-t border-[#F0EFEA] space-y-2">
              <div className="text-[11px] font-bold text-[#12151C]">Questions about data privacy?</div>
              <p className="text-[11px] text-[#666] leading-relaxed">
                Contact our designated Data Protection Officer at{' '}
                <a href="mailto:privacy@classmap.in" className="text-[#FF6321] font-bold underline">
                  privacy@classmap.in
                </a>
              </p>
              {onOpenAudit && (
                <button
                  onClick={onOpenAudit}
                  className="w-full py-2 bg-[#12141D] text-white rounded-xl text-xs font-bold text-center hover:bg-[#252836] transition-colors mt-2 cursor-pointer"
                >
                  Request Security Audit Document
                </button>
              )}
            </div>
          </div>

          {/* Main Policy Content Column */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-2xl border border-[#EAE7DE] shadow-xs space-y-12 leading-relaxed text-sm text-[#333]">
            
            {/* 1. OVERVIEW & SCOPE */}
            <section id="overview" className="space-y-4 pt-2 border-b border-[#F0EFEA] pb-10">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6321]">
                <FileCheck className="w-4 h-4" />
                <span>Section 01</span>
              </div>
              <h2 className="text-2xl font-bold text-[#12151C] tracking-tight">
                1. Overview & Operational Scope
              </h2>
              <p>
                ClassMap Learning Technologies India Private Limited (&ldquo;ClassMap&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) operates an enterprise Learning Gap Intelligence platform designed for educational institutions, K-12 partner schools, coaching institutes, and educational boards across India.
              </p>
              <p>
                Under the Indian <strong className="text-[#12151C]">Digital Personal Data Protection (DPDP) Act, 2023</strong>, educational institutions act as <strong className="text-[#12151C]">Data Fiduciaries</strong> who determine the purpose and means of student record processing. ClassMap acts strictly as a <strong className="text-[#12151C]">Data Processor</strong> handling data solely on the instruction and authority of the respective school or coaching institute.
              </p>
              <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#EAE7DE] space-y-2 text-xs">
                <div className="font-bold text-[#12151C] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Institutional Service Level Guarantee</span>
                </div>
                <p className="text-[#555]">
                  This policy applies to all portals (Teacher Portal, Student Portal, Admin Portal) accessible via ClassMap mobile applications, web portals, and API integrations.
                </p>
              </div>
            </section>

            {/* 2. INFORMATION WE COLLECT */}
            <section id="collection" className="space-y-4 border-b border-[#F0EFEA] pb-10">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6321]">
                <Database className="w-4 h-4" />
                <span>Section 02</span>
              </div>
              <h2 className="text-2xl font-bold text-[#12151C] tracking-tight">
                2. Information We Collect
              </h2>
              <p>
                To provide precise concept gap diagnostics and automated remedial learning sheets, ClassMap collects only the minimum necessary data points authorized by the partner institution:
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-4 bg-[#FAF9F6] rounded-xl border border-[#EAE7DE] space-y-1.5">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#12151C]">
                    A. Institutional & User Account Data
                  </h4>
                  <ul className="list-disc pl-5 text-xs text-[#555] space-y-1">
                    <li>School/Institute Name, Board Affiliation (CBSE, ICSE, State Boards, DBSE), and Address</li>
                    <li>Teacher and Administrator names, institutional email addresses, and phone numbers</li>
                    <li>Student roll numbers, assigned grade/section, and unique anonymized system IDs</li>
                  </ul>
                </div>

                <div className="p-4 bg-[#FAF9F6] rounded-xl border border-[#EAE7DE] space-y-1.5">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#12151C]">
                    B. Student Evaluation & Diagnostic Data
                  </h4>
                  <ul className="list-disc pl-5 text-xs text-[#555] space-y-1">
                    <li>Digitized image scans of student handwritten answer sheets and assessment booklets</li>
                    <li>Teacher evaluation notes, rubric scores, question-wise marks, and concept tag mappings</li>
                    <li>Concept mastery logs, historical test series performance, and generated remedial exercise attempts</li>
                  </ul>
                </div>

                <div className="p-4 bg-[#FAF9F6] rounded-xl border border-[#EAE7DE] space-y-1.5">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#12151C]">
                    C. Technical & Usage Telemetry
                  </h4>
                  <ul className="list-disc pl-5 text-xs text-[#555] space-y-1">
                    <li>Device IP address, browser type, operating system version, and portal session timestamps</li>
                    <li>Encrypted OAuth access tokens and session authentication cookies</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 3. HOW WE USE INFORMATION */}
            <section id="usage" className="space-y-4 border-b border-[#F0EFEA] pb-10">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6321]">
                <Server className="w-4 h-4" />
                <span>Section 03</span>
              </div>
              <h2 className="text-2xl font-bold text-[#12151C] tracking-tight">
                3. How We Use Your Information
              </h2>
              <p>
                All data processed by ClassMap is strictly dedicated to fulfilling educational and academic objectives:
              </p>
              <ul className="list-disc pl-5 text-xs text-[#444] space-y-2 leading-relaxed">
                <li><strong>Optical Evaluation & Analysis:</strong> Processing scanned handwritten answer scripts to extract question-wise marks and identify specific conceptual misconceptions.</li>
                <li><strong>Diagnostic Intelligence Graphs:</strong> Aggregating class-wide and student-specific concept mastery trees for principals, HODs, and teachers.</li>
                <li><strong>Personalized Remediation:</strong> Automatically constructing customized practice sheets targeting individual student learning gaps.</li>
                <li><strong>System Reliability & Security:</strong> Monitoring platform performance, detecting unauthorized access, and maintaining audit trails.</li>
              </ul>
              <div className="p-4 bg-[#FFF0E6] rounded-xl border border-[#FF6321]/30 text-xs text-[#12151C] font-medium flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#FF6321] shrink-0 mt-0.5" />
                <div>
                  <strong>Strict Prohibition on Commercial Exploitation:</strong> ClassMap does not build behavioral advertising profiles, analyze student data for third-party marketing, or serve external banner ads within any portal.
                </div>
              </div>
            </section>

            {/* 4. AI & MODEL SAFEGUARDS */}
            <section id="ai-governance" className="space-y-4 border-b border-[#F0EFEA] pb-10">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6321]">
                <EyeOff className="w-4 h-4" />
                <span>Section 04</span>
              </div>
              <h2 className="text-2xl font-bold text-[#12151C] tracking-tight">
                4. AI & Model Safeguards (CuePilot Standard)
              </h2>
              <p>
                ClassMap employs sophisticated artificial intelligence and vision transformer models to evaluate subjective handwritten papers and generate concept maps. We operate under strict AI safety controls:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#EAE7DE] space-y-1">
                  <div className="font-bold text-[#12151C]">Zero-Retention Endpoints</div>
                  <p className="text-[#666]">All AI evaluation inference occurs on dedicated enterprise endpoints with zero data retention policies on AI model servers.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#EAE7DE] space-y-1">
                  <div className="font-bold text-[#12151C]">No Public Training</div>
                  <p className="text-[#666]">Student handwriting scans, teacher comments, and test papers are never ingested into open-web foundation models.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#EAE7DE] space-y-1">
                  <div className="font-bold text-[#12151C]">Isolated Tenant Enclaves</div>
                  <p className="text-[#666]">Each partner school&apos;s data is logically segregated within isolated cloud database instances.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#EAE7DE] space-y-1">
                  <div className="font-bold text-[#12151C]">Human-in-the-Loop</div>
                  <p className="text-[#666]">AI evaluation recommendations remain subject to teacher override, review, and final academic sign-off.</p>
                </div>
              </div>
            </section>

            {/* 5. SECURITY & DATA RESIDENCY */}
            <section id="security" className="space-y-4 border-b border-[#F0EFEA] pb-10">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6321]">
                <Lock className="w-4 h-4" />
                <span>Section 05</span>
              </div>
              <h2 className="text-2xl font-bold text-[#12151C] tracking-tight">
                5. Security Architecture & Data Residency
              </h2>
              <p>
                We maintain an enterprise-grade security posture compliant with ISO/IEC 27001 standards:
              </p>
              <ul className="list-disc pl-5 text-xs text-[#444] space-y-2">
                <li><strong>Indian Data Sovereign Residency:</strong> All database clusters, object storage buckets for scanned papers, and backups reside exclusively in MeitY-empanelled data centers in Mumbai and Hyderabad, India.</li>
                <li><strong>In-Transit Encryption:</strong> All browser and mobile communication is encrypted using TLS 1.3 with SHA-256 signatures.</li>
                <li><strong>At-Rest Encryption:</strong> Stored files and relational databases are encrypted using AES-256 standard keys managed via Cloud KMS.</li>
                <li><strong>Role-Based Access Control (RBAC):</strong> Strict administrative scoping ensures teachers only access their assigned sections, and students view only their personal diagnostic journey.</li>
              </ul>
            </section>

            {/* 6. DATA SHARING & SUB-PROCESSORS */}
            <section id="sharing" className="space-y-4 border-b border-[#F0EFEA] pb-10">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6321]">
                <Building2 className="w-4 h-4" />
                <span>Section 06</span>
              </div>
              <h2 className="text-2xl font-bold text-[#12151C] tracking-tight">
                6. Data Sharing & Infrastructure Sub-Processors
              </h2>
              <p>
                ClassMap does not transfer student or school data to unauthorized third parties. Data is shared exclusively with vetted infrastructure providers essential to service delivery:
              </p>
              <div className="overflow-x-auto border border-[#EAE7DE] rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9F6] border-b border-[#EAE7DE] text-[#12151C] font-bold">
                    <tr>
                      <th className="p-3">Sub-processor</th>
                      <th className="p-3">Purpose</th>
                      <th className="p-3">Location</th>
                      <th className="p-3">Compliance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE7DE] text-[#555]">
                    <tr>
                      <td className="p-3 font-semibold text-[#12151C]">Google Cloud Platform (GCP)</td>
                      <td className="p-3">Cloud Compute, Firestore & Storage</td>
                      <td className="p-3">Asia-South1 (Mumbai)</td>
                      <td className="p-3">ISO 27001, SOC 2 Type II</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#12151C]">AWS India</td>
                      <td className="p-3">Encrypted Image Backups & Optical OCR</td>
                      <td className="p-3">Asia-South2 (Hyderabad)</td>
                      <td className="p-3">ISO 27017, MeitY Empanelled</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#12151C]">Fast2SMS / Gupshup</td>
                      <td className="p-3">Transactional OTP & Portal Alerts</td>
                      <td className="p-3">India</td>
                      <td className="p-3">TRAI Compliant DLT</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 7. DPDP ACT & PRINCIPAL RIGHTS */}
            <section id="dpdp-rights" className="space-y-4 border-b border-[#F0EFEA] pb-10">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6321]">
                <UserCheck className="w-4 h-4" />
                <span>Section 07</span>
              </div>
              <h2 className="text-2xl font-bold text-[#12151C] tracking-tight">
                7. Rights of Data Principals under DPDP Act 2023
              </h2>
              <p>
                In accordance with Chapter III of the Digital Personal Data Protection Act, 2023, parents, legal guardians, and adult students exercise explicit rights regarding their personal data:
              </p>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EAE7DE] flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Right to Access Information:</strong> Request a comprehensive summary of personal diagnostic data and processing activities.
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EAE7DE] flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Right to Correction & Erasure:</strong> Request rectifying inaccurate marks or permanent deletion of student records upon institutional approval.
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EAE7DE] flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Right of Grievance Redressal:</strong> Direct access to ClassMap&apos;s designated Grievance Officer with guaranteed 48-hour acknowledgment.
                  </div>
                </div>
              </div>
            </section>

            {/* 8. MINORS & STUDENT SAFEGUARDS */}
            <section id="children-data" className="space-y-4 border-b border-[#F0EFEA] pb-10">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6321]">
                <ShieldCheck className="w-4 h-4" />
                <span>Section 08</span>
              </div>
              <h2 className="text-2xl font-bold text-[#12151C] tracking-tight">
                8. Minors & Children&apos;s Data Protection
              </h2>
              <p>
                Recognizing that K-12 students are minors under 18 years of age, ClassMap enforces mandatory protective safeguards:
              </p>
              <ul className="list-disc pl-5 text-xs text-[#444] space-y-2">
                <li>Institutional Verifiable Parental Consent obtained directly through partner school enrollment agreements.</li>
                <li>Zero tracking or profiling for non-educational, commercial, or behavioral purposes.</li>
                <li>Strict prohibition on direct messaging or unmonitored external chat communication between students and third parties.</li>
              </ul>
            </section>

            {/* 9. RETENTION & CRYPTOGRAPHIC WIPE */}
            <section id="retention" className="space-y-4 border-b border-[#F0EFEA] pb-10">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6321]">
                <Clock className="w-4 h-4" />
                <span>Section 09</span>
              </div>
              <h2 className="text-2xl font-bold text-[#12151C] tracking-tight">
                9. Data Retention & Cryptographic Wipe Policy
              </h2>
              <p>
                ClassMap retains data only for the active duration of the partner institution&apos;s subscription contract. Upon contract expiration or termination:
              </p>
              <ul className="list-disc pl-5 text-xs text-[#444] space-y-1.5">
                <li>Schools are provided a 30-day window to export all raw PDF diagnostic reports, student answer scripts, and marks spreadsheets.</li>
                <li>Following the 30-day export window, all tenant databases, backup snapshots, and image object stores undergo NIST 800-88 compliant cryptographic wiping.</li>
              </ul>
            </section>

            {/* 10. GRIEVANCE OFFICER & CONTACT */}
            <section id="contact" className="space-y-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6321]">
                <Mail className="w-4 h-4" />
                <span>Section 10</span>
              </div>
              <h2 className="text-2xl font-bold text-[#12151C] tracking-tight">
                10. Grievance Redressal & Contact Details
              </h2>
              <p>
                If you have questions, concerns, or wish to exercise data principal rights under the DPDP Act 2023, please reach out to our designated Data Protection & Grievance Officer:
              </p>

              <div className="p-6 bg-[#12141D] text-white rounded-2xl border border-[#2A2E3D] space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FF6321] text-white flex items-center justify-center font-bold">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Office of the Data Protection Officer</h3>
                    <p className="text-xs text-stone-300">ClassMap Learning Technologies India Pvt. Ltd.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs text-stone-300">
                  <div className="space-y-1">
                    <span className="text-[#888] uppercase tracking-wider text-[10px] font-bold block">Grievance Email</span>
                    <a href="mailto:privacy@classmap.in" className="text-[#FF6321] font-bold hover:underline block text-sm">
                      privacy@classmap.in
                    </a>
                    <a href="mailto:info@classmap.in" className="text-stone-300 hover:underline block">
                      info@classmap.in
                    </a>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[#888] uppercase tracking-wider text-[10px] font-bold block">Helpline Phone</span>
                    <a href="tel:+919589587054" className="text-white font-mono font-bold block">
                      +91-9589587054
                    </a>
                  </div>

                  <div className="sm:col-span-2 space-y-1 pt-2 border-t border-[#2A2E3D]">
                    <span className="text-[#888] uppercase tracking-wider text-[10px] font-bold block">Registered Headquarters</span>
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
                  className="px-5 py-2.5 rounded-full bg-[#12141D] text-white hover:bg-[#FF6321] transition-colors text-xs font-bold cursor-pointer"
                >
                  Return to ClassMap Home
                </button>

                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-xs text-[#666] hover:text-[#FF6321] font-bold underline cursor-pointer"
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
