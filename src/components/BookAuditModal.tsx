import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Sparkles, Mail, Phone, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

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

  if (!isOpen) return null;

  const mailSubject = `Free Demo Request - ${institutionName}`;
  const mailBody = `Hello ClassMap Team,\n\nI would like to book a free demo.\n\nInstitution Name: ${institutionName}\nType: ${type}\nContact Person: ${contactName}\nPhone Number: ${phone}\nEmail: ${email}\nBoard / Syllabus: ${board}\n\nThank you!`;
  const mailtoUrl = `mailto:info@classmap.in?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSendError(null);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-[#E0DDD3] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#706E66] hover:text-[#12151C] hover:bg-[#F3F1EC] rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div className="space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF0E6] text-[#FF6321] text-[11px] font-bold uppercase tracking-widest mb-2">
                <Sparkles className="w-3 h-3" />
                <span>For Schools & Coaching Institutes</span>
              </span>
              <h3 className="text-2xl font-serif font-light text-[#1A1A1A]">
                Book a Free ClassMap Demo
              </h3>
              <p className="text-xs text-[#555] mt-1">
                Discover how ClassMap identifies student learning gaps for your institution at zero software cost.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1A1A1A] mb-1">
                    Institution Type *
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full border border-[#D5D1C4] focus:outline-none focus:border-[#FF6321] bg-white font-medium"
                  >
                    <option value="School">K-12 School</option>
                    <option value="Coaching Institute">Coaching Institute / Test Prep</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#1A1A1A] mb-1">
                    Institution Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    placeholder="e.g. Siddhartha Public School"
                    className="w-full px-4 py-2.5 rounded-full border border-[#D5D1C4] focus:outline-none focus:border-[#FF6321]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1A1A1A] mb-1">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Principal / Director"
                    className="w-full px-4 py-2.5 rounded-full border border-[#D5D1C4] focus:outline-none focus:border-[#FF6321]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1A1A1A] mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 89817 16969"
                    className="w-full px-4 py-2.5 rounded-full border border-[#D5D1C4] focus:outline-none focus:border-[#FF6321]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#12151C] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="info@institution.edu.in"
                    className="w-full px-4 py-2.5 rounded-full border border-[#D5D1C4] focus:outline-none focus:border-[#FF6321]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1A1A1A] mb-1">
                    Affiliation / Curriculum
                  </label>
                  <select
                    value={board}
                    onChange={(e) => setBoard(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full border border-[#D5D1C4] focus:outline-none focus:border-[#FF6321] bg-white"
                  >
                    <option value="CBSE">CBSE Board</option>
                    <option value="ICSE">ICSE / ISC Board</option>
                    <option value="State Board">State Board</option>
                    <option value="IB">IB / Cambridge</option>
                    <option value="Competitive Exam Prep">Competitive (JEE / NEET / Foundation)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#FF6321] hover:bg-[#E05215] text-white rounded-full text-xs font-bold tracking-wide transition-colors cursor-pointer shadow-md shadow-[#FF6321]/20 mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending Request...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>Submit Demo Request to info@classmap.in</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-[11px] text-[#706E66] text-center flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Free for Schools & Coaching Centres • DPDP Act 2023 Compliant</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-serif font-bold text-[#12151C]">
                Thank You for Contacting Us!
              </h3>
              <p className="text-sm text-[#4A4843] max-w-md mx-auto leading-relaxed">
                Someone from our team will reach out to you shortly to schedule your personalized demo.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E2DFD4] text-xs text-left text-[#52504A] space-y-3">
              <div className="flex items-center gap-2 text-[#12151C] font-bold text-xs">
                <Phone className="w-4 h-4 text-[#FF6321]" />
                <span>Need Immediate Assistance?</span>
              </div>
              <p className="text-xs text-[#66635B] leading-normal">
                You can reach our lead education specialist directly at <strong className="text-[#12151C]">8981716969</strong> or connect with us on WhatsApp for instant queries.
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <a
                  href={`https://wa.me/918981716969?text=${encodeURIComponent(`Hi Classmap Team, I just submitted a free demo request for ${institutionName || 'our institution'}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Connect on WhatsApp</span>
                </a>

                <a
                  href="tel:8981716969"
                  className="flex-1 py-3 bg-[#12151C] hover:bg-[#2A2E3D] text-white rounded-full text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call 8981716969</span>
                </a>
              </div>
            </div>

            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="w-full py-3.5 bg-[#F3F1EC] hover:bg-[#E5E2D8] text-[#12151C] rounded-full text-xs font-bold cursor-pointer transition-colors mt-2"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
