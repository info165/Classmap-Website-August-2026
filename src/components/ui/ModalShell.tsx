import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { EASE } from './primitives';

interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  /** Tailwind max-width class for the panel. */
  widthClass?: string;
  labelledBy?: string;
  children: React.ReactNode;
}

/**
 * The one dialog frame every modal on the site shares: a blurred scrim, a dark
 * glass panel lit from above, a spring entrance, and the behaviours a dialog
 * owes its user — Escape closes it, the page behind stops scrolling, and a
 * click on the scrim dismisses it.
 */
export const ModalShell: React.FC<ModalShellProps> = ({
  isOpen,
  onClose,
  widthClass = 'max-w-lg',
  labelledBy,
  children
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="scrim"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          className="fixed inset-0 z-[70] flex items-end justify-center overflow-y-auto bg-[#03040A]/70 p-3 backdrop-blur-md sm:items-center sm:p-6"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            initial={{ opacity: 0, y: 36, scale: 0.96, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 24, scale: 0.97, filter: 'blur(6px)' }}
            transition={{ duration: 0.5, ease: EASE }}
            className={`noise relative isolate my-auto w-full ${widthClass} overflow-hidden rounded-[28px] bg-[#0B0D13] p-6 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.09),0_60px_120px_-30px_rgba(255,99,33,0.35),0_40px_80px_-20px_rgba(0,0,0,0.9)] sm:p-9`}
          >
            {/* Light falling from the top edge */}
            <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[-120px] -z-10 h-[260px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,99,33,0.3),transparent)] blur-2xl" />
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF8A4C]/70 to-transparent" />

            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/[0.06] text-stone-400 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-all duration-300 hover:rotate-90 hover:bg-white/[0.12] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/** Shared dark-glass field styling, so every input in every modal matches. */
export const fieldClass =
  'w-full rounded-xl bg-white/[0.05] px-4 py-3 text-sm text-white placeholder:text-stone-600 shadow-[0_0_0_1px_rgba(255,255,255,0.09)] transition-all duration-200 focus:bg-white/[0.07] focus:outline-none focus:shadow-[0_0_0_1px_rgba(255,99,33,0.8),0_0_0_4px_rgba(255,99,33,0.15)]';

export const labelClass = 'mb-1.5 block font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-stone-400';
