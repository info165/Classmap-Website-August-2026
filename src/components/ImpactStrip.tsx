import React from 'react';
import { CountUp, Reveal } from './ui/primitives';

/**
 * Three numbers, set large. Every figure here is one the site already states
 * elsewhere (partner page, teacher copy, the 7-layer report) — nothing is new.
 */
const STATS = [
  { to: 8000, suffix: '+', label: 'Students evaluated', sub: 'across K-12 schools and coaching centres' },
  { to: 12, suffix: '+', label: 'Hours saved a week', sub: 'per teacher on paper correction' },
  { to: 7, suffix: '', label: 'Layers of gap intelligence', sub: 'from concept to behaviour to remedy' }
];

export const ImpactStrip: React.FC = () => (
  <section id="impact" className="relative bg-[#07080C] pb-8 pt-4 text-white sm:pb-10">
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 overflow-hidden rounded-[28px] bg-white/[0.02] shadow-[0_0_0_1px_rgba(255,255,255,0.07)] sm:grid-cols-3">
        {STATS.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 0.08}
            className={`group relative px-6 py-9 transition-colors duration-500 hover:bg-white/[0.035] sm:px-8 sm:py-12 ${
              i > 0 ? 'border-t border-white/[0.07] sm:border-l sm:border-t-0' : ''
            }`}
          >
            <div className="text-gradient-light text-5xl font-semibold leading-none tracking-[-0.05em] transition-transform duration-500 ease-out group-hover:-translate-y-1 sm:text-6xl">
              <CountUp to={s.to} suffix={s.suffix} />
            </div>
            <div className="mt-4 text-sm font-semibold tracking-tight text-white">{s.label}</div>
            <div className="mt-1 text-[13px] leading-snug text-stone-500">{s.sub}</div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
