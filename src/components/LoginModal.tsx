import React, { useState, useEffect } from 'react';
import { X, User, ShieldCheck, CheckCircle2, GraduationCap, ExternalLink } from 'lucide-react';
import { Logo } from './Logo';

interface LoginModalProps {
  isOpen: boolean;
  initialRole?: 'teacher' | 'student' | 'admin';
  onClose: () => void;
  onSelectPortal?: (portal: 'teachers' | 'students' | 'admin') => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, initialRole = 'teacher', onClose, onSelectPortal }) => {
  const [role, setRole] = useState<'teacher' | 'student' | 'admin'>(initialRole);

  useEffect(() => {
    if (initialRole) {
      setRole(initialRole);
    }
  }, [initialRole, isOpen]);

  if (!isOpen) return null;

  const handlePortalClick = (e: React.MouseEvent, targetPortal: 'teachers' | 'students' | 'admin') => {
    if (onSelectPortal) {
      e.preventDefault();
      onSelectPortal(targetPortal);
      onClose();
    }
  };

  const roleUrls = {
    teacher: 'https://classmap.in/teachers',
    student: 'https://classmap.in/students',
    admin: 'https://classmap.in/admin'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-[#E0DDD3] max-w-md w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#706E66] hover:text-[#12151C] hover:bg-[#F3F1EC] rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <Logo size="sm" className="items-center justify-center mb-2" taglineClassName="text-center text-[#706E66]" />
            <h3 className="text-xl font-bold text-[#12151C]">
              ClassMap Portal Access
            </h3>
            <p className="text-xs text-[#706E66]">
              Select your role to access your dedicated portal domain
            </p>
          </div>

          {/* 3 Direct Portal Cards */}
          <div className="space-y-3">
            {/* Teacher Portal */}
            <a
              href="/teachers"
              onClick={(e) => handlePortalClick(e, 'teachers')}
              className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E5E2D8] hover:border-[#FF6321] hover:bg-[#FFF0E6]/50 transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFF0E6] text-[#FF6321] flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1A1A1A] group-hover:text-[#FF6321] transition-colors">
                    Teacher Portal
                  </div>
                  <div className="text-[11px] text-[#666]">
                    Classroom diagnostics & AI gap reports
                  </div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-[#999] group-hover:text-[#FF6321] transition-colors" />
            </a>

            {/* Student Portal */}
            <a
              href="/students"
              onClick={(e) => handlePortalClick(e, 'students')}
              className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E5E2D8] hover:border-[#FF6321] hover:bg-[#FFF0E6]/50 transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFF0E6] text-[#FF6321] flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1A1A1A] group-hover:text-[#FF6321] transition-colors">
                    Student Portal
                  </div>
                  <div className="text-[11px] text-[#666]">
                    Personalized practice & concept maps
                  </div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-[#999] group-hover:text-[#FF6321] transition-colors" />
            </a>

            {/* Admin Portal */}
            <a
              href="/admin"
              onClick={(e) => handlePortalClick(e, 'admin')}
              className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E5E2D8] hover:border-[#FF6321] hover:bg-[#FFF0E6]/50 transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFF0E6] text-[#FF6321] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1A1A1A] group-hover:text-[#FF6321] transition-colors">
                    Admin Portal
                  </div>
                  <div className="text-[11px] text-[#666]">
                    Institutional analytics & mastery trends
                  </div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-[#999] group-hover:text-[#FF6321] transition-colors" />
            </a>
          </div>

          <div className="text-[11px] text-[#706E66] text-center flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>DPDP Act 2023 Compliant Secure Authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
};
