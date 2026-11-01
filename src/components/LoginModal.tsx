import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, ShieldCheck, GraduationCap, ArrowUpRight } from 'lucide-react';
import { Logo } from './Logo';
import { ModalShell } from './ui/ModalShell';
import { EASE } from './ui/primitives';

interface LoginModalProps {
  isOpen: boolean;
  initialRole?: 'teacher' | 'student' | 'admin';
  onClose: () => void;
  onSelectPortal?: (portal: 'teachers' | 'students' | 'admin') => void;
}

const PORTALS = [
  { id: 'teachers', href: '/teachers', title: 'Teacher Portal', blurb: 'Classroom diagnostics & AI gap reports', icon: User },
  { id: 'students', href: '/students', title: 'Student Portal', blurb: 'Personalized practice & concept maps', icon: GraduationCap },
  { id: 'admin', href: '/admin', title: 'Admin Portal', blurb: 'Institutional analytics & mastery trends', icon: ShieldCheck }
] as const;

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, initialRole = 'teacher', onClose, onSelectPortal }) => {
  const [role, setRole] = useState<'teacher' | 'student' | 'admin'>(initialRole);

  useEffect(() => {
    if (initialRole) {
      setRole(initialRole);
    }
  }, [initialRole, isOpen]);

  const handlePortalClick = (e: React.MouseEvent, targetPortal: 'teachers' | 'students' | 'admin') => {
    if (onSelectPortal) {
      e.preventDefault();
      onSelectPortal(targetPortal);
      onClose();
    }
  };

  /* The role the visitor arrived with is the one that starts highlighted. */
  const preferred = role === 'teacher' ? 'teachers' : role === 'student' ? 'students' : 'admin';

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} widthClass="max-w-md" labelledBy="login-title">
      <div className="space-y-7">
        <div className="space-y-3 text-center">
          <Logo size="sm" className="mb-1 items-center justify-center" />
          <h3 id="login-title" className="text-2xl font-semibold tracking-[-0.03em] text-gradient-light">
            ClassMap Portal Access
          </h3>
          <p className="text-sm text-stone-400">Select your role to access your dedicated portal domain</p>
        </div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
          className="space-y-3"
        >
          {PORTALS.map(({ id, href, title, blurb, icon: Icon }) => (
            <motion.a
              key={id}
              href={href}
              onClick={(e) => handlePortalClick(e, id)}
              variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }}
              whileHover={{ y: -2 }}
              className={`group flex cursor-pointer items-center justify-between rounded-2xl p-4 transition-colors duration-300 ${
                preferred === id
                  ? 'bg-[#FF6321]/[0.09] shadow-[0_0_0_1px_rgba(255,99,33,0.45)]'
                  : 'bg-white/[0.04] shadow-[0_0_0_1px_rgba(255,255,255,0.08)] hover:bg-white/[0.07] hover:shadow-[0_0_0_1px_rgba(255,99,33,0.4)]'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF6321]/12 text-[#FF8A4C] shadow-[0_0_0_1px_rgba(255,99,33,0.25)] transition-all duration-300 group-hover:bg-[#FF6321] group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-sm font-semibold tracking-tight text-white">{title}</div>
                  <div className="mt-0.5 text-xs text-stone-400">{blurb}</div>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-stone-500 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#FF8A4C]" />
            </motion.a>
          ))}
        </motion.div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>DPDP Act 2023 Compliant Secure Authentication</span>
        </div>
      </div>
    </ModalShell>
  );
};
