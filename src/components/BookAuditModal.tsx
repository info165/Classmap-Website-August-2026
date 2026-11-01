import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Sparkles, Phone, MessageCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ModalShell, fieldClass, labelClass } from './ui/ModalShell';
import { EASE } from './ui/primitives';

interface BookAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookAuditModal: React.FC<BookAuditModalProps> = ({ isOpen, onClose }) => {
  const [institutionName, setInstitutionName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('School');
  const [board, setBoard] = useState('CBSE');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);

  const mailSubject = `Free Demo Request - ${institutionName}`;
  const mailBody = `Hello ClassMap Team,\n\nI would like to book a free demo.\n\nInstitution Name: ${institutionName}\nType: ${type}\nContact Person: ${contactName}\nPhone Number: ${phone}\nEmail: ${email}\nBoard / Syllabus: ${board}\n\nThank you!`;
  const mailtoUrl = `mailto:info@classmap.in?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSendError(null);

    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#FF6321', '#FF8A4C', '#FFB27A', '#FFFFFF']
    });

    try {
      const response = await fetch('/api/book-demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          institutionName,
          type,
          contactName,
          phone,
          email,
          board,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setEmailSent(true);
      } else {
        console.warn('API error sending email:', data);
        setSendError(data.error || 'Server email dispatch failed');
      }
    } catch (err: any) {
      console.error('Network error sending demo request:', err);
      setSendError('Network request failed');
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`To: info@classmap.in\nSubject: ${mailSubject}\n\n${mailBody}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} widthClass="max-w-xl" labelledBy="audit-title">
      {!submitted ? (
        <div className="space-y-7">
          <div className="pr-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF6321]/10 px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#FF8A4C] ring-1 ring-inset ring-[#FF6321]/25">
              <Sparkles className="h-3 w-3" />
              For Schools &amp; Coaching Institutes
            </span>
            <h3 id="audit-title" className="mt-4 text-[1.9rem] font-semibold leading-[1.05] tracking-[-0.035em] text-gradient-light">
              Book a Free ClassMap Demo
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-stone-400">
              Discover how ClassMap identifies student learning gaps for your institution at zero software cost.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Institution Type *</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className={`${fieldClass} cursor-pointer [&>option]:bg-[#12141B]`}>
                  <option value="School">K-12 School</option>
                  <option value="Coaching Institute">Coaching Institute / Test Prep</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Institution Name *</label>
                <input
                  type="text"
                  required
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  placeholder="e.g. Siddhartha Public School"
                  className={fieldClass}
                />
              </div>

              <div>
                <label className={labelClass}>Contact Person *</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Principal / Director"
                  className={fieldClass}
                />
              </div>

              <div>
                <label className={labelClass}>Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 89817 16969"
                  className={fieldClass}
                />
              </div>

              <div>
                <label className={labelClass}>Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="info@institution.edu.in"
                  className={fieldClass}
                />
              </div>

              <div>
                <label className={labelClass}>Affiliation / Curriculum</label>
                <select value={board} onChange={(e) => setBoard(e.target.value)} className={`${fieldClass} cursor-pointer [&>option]:bg-[#12141B]`}>
                  <option value="CBSE">CBSE Board</option>
                  <option value="ICSE">ICSE / ISC Board</option>
                  <option value="State Board">State Board</option>
                  <option value="IB">IB / Cambridge</option>
                  <option value="Competitive Exam Prep">Competitive (JEE / NEET / Foundation)</option>
                </select>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.985 }}
              className="group/btn relative mt-2 flex w-full cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-full border border-[#FF8A4C]/40 bg-gradient-to-b from-[#FF7A3D] to-[#F0530F] py-4 text-sm font-semibold tracking-tight text-white shadow-[0_1px_0_rgba(255,255,255,0.4)_inset,0_14px_36px_-10px_rgba(255,99,33,0.7)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent opacity-0 transition-all duration-700 ease-out group-hover/btn:left-[130%] group-hover/btn:opacity-100"
              />
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span className="relative">Sending Request...</span>
                </>
              ) : (
                <span className="relative inline-flex items-center gap-2">
                  Submit
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </span>
              )}
            </motion.button>
          </form>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Free for Schools &amp; Coaching Centres • DPDP Act 2023 Compliant</span>
          </div>
        </div>
      ) : (
        <div className="space-y-6 py-2 text-center">
          {/* Tick that draws itself */}
          <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-emerald-400/30" />
            <motion.span
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 16 }}
              className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300 shadow-[0_0_0_1px_rgba(52,211,153,0.4),0_0_50px_-8px_rgba(52,211,153,0.6)]"
            >
              <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.25, duration: 0.5, ease: EASE }} />
              </svg>
            </motion.span>
          </div>

          <div className="space-y-2.5">
            <h3 className="text-[1.9rem] font-semibold leading-[1.05] tracking-[-0.035em] text-gradient-light">
              Thank You for Contacting Us!
            </h3>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-stone-400">
              Someone from our team will reach out to you shortly to schedule your personalized demo.
            </p>
          </div>

          <div className="space-y-3 rounded-2xl bg-white/[0.04] p-5 text-left shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Phone className="h-4 w-4 text-[#FF6321]" />
              Need Immediate Assistance?
            </div>
            <p className="text-[13px] leading-relaxed text-stone-400">
              You can reach our lead education specialist directly at <strong className="font-semibold text-white">8981716969</strong> or connect with us on WhatsApp for instant queries.
            </p>
            <div className="flex flex-col gap-2.5 pt-1 sm:flex-row">
              <a
                href={`https://wa.me/918981716969?text=${encodeURIComponent(`Hi Classmap Team, I just submitted a free demo request for ${institutionName || 'our institution'}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 text-[13px] font-semibold text-white shadow-[0_12px_30px_-10px_rgba(37,211,102,0.7)] transition-all hover:-translate-y-0.5 hover:bg-[#20bd5a]"
              >
                <MessageCircle className="h-4 w-4" />
                Connect on WhatsApp
              </a>
              <a
                href="tel:8981716969"
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-white/[0.07] py-3 text-[13px] font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.1)] transition-all hover:-translate-y-0.5 hover:bg-white/[0.12]"
              >
                <Phone className="h-3.5 w-3.5" />
                Call 8981716969
              </a>
            </div>
          </div>

          <button
            onClick={() => {
              setSubmitted(false);
              onClose();
            }}
            className="w-full cursor-pointer rounded-full bg-white py-3.5 text-sm font-semibold text-[#0A0B10] transition-colors hover:bg-[#FFE9DC]"
          >
            Done
          </button>
        </div>
      )}
    </ModalShell>
  );
};
