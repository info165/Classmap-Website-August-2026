import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowDown, ArrowRight, Check, Play, RotateCcw, X } from 'lucide-react';
import { EASE } from '../ui/primitives';
import { BANDS, LESSON, PHOTOSYNTHESIS_PARTS, fmtTime, type Band } from './data';

/**
 * The six screens that play inside the phone, one for each step of the loop.
 *
 * Every screen is a small working piece of the app: it plays a short sequence
 * when it appears, and every control on it can be tapped. The topic throughout
 * is Photosynthesis, the same lesson as the video further down the page. The
 * questions, scores and colours are an illustration of how a round goes.
 */

export interface SceneProps {
  /** The visitor touched something: stop the autoplay and let them drive. */
  onUse: () => void;
  /** Move on to the next step. */
  onNext: () => void;
}

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`rounded-2xl bg-white/[0.05] shadow-[0_0_0_1px_rgba(255,255,255,0.09),inset_0_1px_0_rgba(255,255,255,0.06)] ${className}`}>{children}</div>
);

const Label: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500 ${className}`}>{children}</div>
);

const rise = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.05 + i * 0.06, duration: 0.4, ease: EASE }
});

const Cta: React.FC<{ onClick: () => void; children: React.ReactNode; tone?: 'light' | 'brand' }> = ({ onClick, children, tone = 'light' }) => (
  <motion.button
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-full py-3 text-[13px] font-semibold ${
      tone === 'brand'
        ? 'bg-gradient-to-b from-[#FF7A3D] to-[#F0530F] text-white shadow-[0_10px_26px_-8px_rgba(255,99,33,0.8)]'
        : 'bg-white text-[#0A0B10] shadow-[0_10px_30px_-10px_rgba(255,255,255,0.35)]'
    }`}
  >
    {children}
  </motion.button>
);

/* ------------------------------------------------------------ 1. pick a topic */

const TOPICS = ['Photosynthesis', 'Respiration in cells', 'Nutrition in animals', 'Transport in plants'];

export const TopicScene: React.FC<SceneProps> = ({ onUse, onNext }) => {
  const [sel, setSel] = useState<number | null>(null);
  const touched = useRef(false);
  useEffect(() => {
    const t = setTimeout(() => {
      if (!touched.current) setSel(0);
    }, 800);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="w-full space-y-3">
      <motion.div {...rise(0)}>
        <Label>What are you studying?</Label>
        <div className="mt-2 flex gap-2">
          {['Mathematics', 'Science'].map((s) => (
            <span
              key={s}
              className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold ${s === 'Science' ? 'bg-white text-[#0A0B10]' : 'bg-white/[0.06] text-stone-400 ring-1 ring-inset ring-white/10'}`}
            >
              {s}
            </span>
          ))}
        </div>
      </motion.div>
      <div className="space-y-2">
        {TOPICS.map((t, i) => {
          const on = sel === i;
          return (
            <motion.button
              key={t}
              {...rise(i + 1)}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                touched.current = true;
                setSel(i);
                onUse();
              }}
              aria-pressed={on}
              className={`relative flex w-full cursor-pointer items-center justify-between rounded-2xl px-4 py-3.5 text-left transition-colors duration-300 ${
                on ? 'bg-[#FF6321]/15 shadow-[0_0_0_1.5px_#FF6321]' : 'bg-white/[0.05] shadow-[0_0_0_1px_rgba(255,255,255,0.09)]'
              }`}
            >
              <span className={`text-[14px] font-semibold tracking-[-0.01em] ${on ? 'text-white' : 'text-stone-300'}`}>{t}</span>
              <span className={`flex h-5 w-5 items-center justify-center rounded-full transition-all duration-300 ${on ? 'scale-100 bg-[#FF6321] text-white' : 'scale-75 bg-white/[0.06] text-transparent'}`}>
                <Check className="h-3 w-3" strokeWidth={4} />
              </span>
            </motion.button>
          );
        })}
      </div>
      <motion.div {...rise(5)}>
        <Cta onClick={() => { onUse(); onNext(); }}>
          Continue <ArrowRight className="h-4 w-4" />
        </Cta>
      </motion.div>
    </div>
  );
};

/* ------------------------------------------------- 2. choose a level and test */

const LEVEL_NAMES: Record<number, string> = { 1: 'Easiest', 3: 'Medium', 5: 'Hardest' };
const OPTIONS = ['CO₂', 'N₂', 'O₂', 'H₂'];
const CORRECT = 2;

export const TestScene: React.FC<SceneProps> = ({ onUse }) => {
  const [phase, setPhase] = useState<'level' | 'question'>('level');
  const [lvl, setLvl] = useState(1);
  const [pick, setPick] = useState<number | null>(null);
  const touched = useRef(false);

  useEffect(() => {
    const a = setTimeout(() => !touched.current && setLvl(3), 650);
    const b = setTimeout(() => !touched.current && setPhase('question'), 1700);
    const c = setTimeout(() => !touched.current && setPick(CORRECT), 2700);
    return () => [a, b, c].forEach(clearTimeout);
  }, []);

  const wrong = pick !== null && pick !== CORRECT;

  return (
    <div className="w-full">
      <AnimatePresence mode="wait" initial={false}>
        {phase === 'level' ? (
          <motion.div key="level" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.25, ease: EASE }} className="space-y-3">
            <Card className="p-4">
              <Label>Science</Label>
              <div className="mt-1 text-xl font-semibold tracking-[-0.03em] text-white">Photosynthesis</div>
            </Card>
            <Card className="p-4">
              <Label>Start at level</Label>
              <div className="mt-3 grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((l) => (
                  <motion.button
                    key={l}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      touched.current = true;
                      setLvl(l);
                      onUse();
                    }}
                    aria-pressed={l === lvl}
                    aria-label={`Level ${l}`}
                    className="relative cursor-pointer rounded-xl py-3 text-center text-sm font-semibold tabular-nums"
                  >
                    {l === lvl ? (
                      <motion.span layoutId="test-level" transition={{ type: 'spring', stiffness: 520, damping: 38 }} className="absolute inset-0 rounded-xl bg-[#FF6321] shadow-[0_10px_26px_-8px_rgba(255,99,33,0.8)]" />
                    ) : (
                      <span className="absolute inset-0 rounded-xl bg-white/[0.04]" />
                    )}
                    <span className={`relative ${l === lvl ? 'text-white' : 'text-stone-500'}`}>L{l}</span>
                  </motion.button>
                ))}
              </div>
              <div className="mt-2 h-4 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-[#FF8A4C]">{LEVEL_NAMES[lvl] ?? `Level ${lvl}`}</div>
            </Card>
            <Cta onClick={() => { touched.current = true; onUse(); setPhase('question'); }}>
              Start the test <ArrowRight className="h-4 w-4" />
            </Cta>
          </motion.div>
        ) : (
          <motion.div key="q" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.25, ease: EASE }} className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Level 3 · Question 1 of 10</Label>
              <div className="h-1 w-16 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[10%] rounded-full bg-[#FF6321]" />
              </div>
            </div>
            <Card className="p-4">
              <div className="text-[16px] font-semibold leading-snug tracking-[-0.02em] text-white">Which gas is released during photosynthesis?</div>
            </Card>
            <div className="grid grid-cols-2 gap-2.5">
              {OPTIONS.map((o, i) => {
                const isPick = pick === i;
                const good = isPick && i === CORRECT;
                const bad = isPick && i !== CORRECT;
                const reveal = wrong && i === CORRECT;
                return (
                  <motion.button
                    key={o}
                    whileTap={{ scale: 0.95 }}
                    animate={bad ? { x: [0, -7, 7, -4, 4, 0] } : { x: 0 }}
                    onClick={() => {
                      touched.current = true;
                      setPick(i);
                      onUse();
                    }}
                    className={`flex cursor-pointer items-center justify-between rounded-2xl px-3.5 py-3 text-left text-[15px] font-semibold transition-colors duration-300 ${
                      good ? 'bg-emerald-400/15 text-white shadow-[0_0_0_1.5px_#10B981]' : bad ? 'bg-rose-400/15 text-white shadow-[0_0_0_1.5px_#F43F5E]' : reveal ? 'bg-emerald-400/10 text-white shadow-[0_0_0_1.5px_rgba(16,185,129,0.55)]' : 'bg-white/[0.05] text-stone-300 shadow-[0_0_0_1px_rgba(255,255,255,0.09)]'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="font-mono text-[11px] text-stone-500">{'ABCD'[i]}</span>
                      {o}
                    </span>
                    {(good || bad || reveal) && (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }} className={`flex h-5 w-5 items-center justify-center rounded-full text-[#07080C] ${bad ? 'bg-rose-400' : 'bg-emerald-400'}`}>
                        {bad ? <X className="h-3 w-3" strokeWidth={4} /> : <Check className="h-3 w-3" strokeWidth={4} />}
                      </motion.span>
                    )}
                  </motion.button>
                );
              })}
            </div>
            <div className="h-5 text-center text-[12px] font-medium">
              {pick !== null && <span className={wrong ? 'text-rose-300' : 'text-emerald-300'}>{wrong ? 'Not quite. Plants release oxygen (O₂).' : 'Correct. Plants release oxygen.'}</span>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* --------------------------------------------------- 3. see your weak topics */

const Ring: React.FC<{ value: number; band: Band }> = ({ value, band }) => {
  const r = 30;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 80 80" className="h-[72px] w-[72px] -rotate-90" aria-hidden="true">
      <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="7" />
      <motion.circle
        cx="40"
        cy="40"
        r={r}
        fill="none"
        stroke={BANDS[band].solid}
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c * (1 - value / 100) }}
        transition={{ delay: 0.2, duration: 1, ease: EASE }}
        style={{ filter: `drop-shadow(0 0 6px ${BANDS[band].glow})` }}
      />
    </svg>
  );
};

export const WeakScene: React.FC<SceneProps> = ({ onUse }) => {
  const [sel, setSel] = useState<number | null>(null);
  const red = PHOTOSYNTHESIS_PARTS.filter((p) => p.band === 'red').length;
  const yellow = PHOTOSYNTHESIS_PARTS.filter((p) => p.band === 'yellow').length;
  return (
    <div className="w-full space-y-3">
      <motion.div {...rise(0)}>
        <Card className="flex items-center gap-4 p-4">
          <div className="relative shrink-0">
            <Ring value={58} band="red" />
            <span className="absolute inset-0 flex items-center justify-center text-[17px] font-semibold tabular-nums text-white">58%</span>
          </div>
          <div className="min-w-0">
            <div className="text-[15px] font-semibold tracking-[-0.02em] text-white">Your result</div>
            <div className="mt-0.5 text-[12px] leading-snug text-stone-400">
              <span className="text-rose-300">{red} need help</span> · <span className="text-amber-300">{yellow} getting there</span>
            </div>
          </div>
        </Card>
      </motion.div>
      <div className="space-y-1.5">
        {PHOTOSYNTHESIS_PARTS.map((p, i) => {
          const b = BANDS[p.band];
          const on = sel === i;
          return (
            <motion.button
              key={p.name}
              {...rise(i + 1)}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSel(i);
                onUse();
              }}
              className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl px-3 py-2 text-left transition-colors duration-300 ${on ? 'bg-white/[0.09]' : 'bg-white/[0.04]'}`}
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  {p.band === 'red' && <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-rose-500/70" />}
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ background: b.solid, boxShadow: `0 0 10px ${b.glow}` }} />
                </span>
                <span className={`truncate text-[12.5px] font-medium ${on ? 'text-white' : 'text-stone-300'}`}>{p.name}</span>
              </span>
              <span className={`shrink-0 text-[10.5px] font-semibold ${b.text}`}>{b.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

/* ------------------------------------------------------ 4. watch the videos */

const WEAK_PARTS = PHOTOSYNTHESIS_PARTS.filter((p) => p.band === 'red');

export const VideoScene: React.FC<SceneProps> = ({ onUse }) => {
  const [part, setPart] = useState(0);
  const [run, setRun] = useState(0);
  const p = WEAK_PARTS[part];
  return (
    <div className="w-full space-y-3">
      <motion.div {...rise(0)}>
        <Label>Fix your weak topics</Label>
        <div className="mt-2 flex gap-2">
          {WEAK_PARTS.map((w, i) => (
            <button
              key={w.name}
              onClick={() => {
                setPart(i);
                setRun((r) => r + 1);
                onUse();
              }}
              aria-pressed={i === part}
              className={`flex-1 cursor-pointer rounded-xl px-2.5 py-2 text-left text-[11px] font-semibold leading-tight transition-colors duration-300 ${i === part ? 'bg-rose-400/15 text-white ring-1 ring-inset ring-rose-400/40' : 'bg-white/[0.05] text-stone-400 ring-1 ring-inset ring-white/[0.08]'}`}
            >
              {w.name}
            </button>
          ))}
        </div>
      </motion.div>
      <motion.div {...rise(1)}>
        <div className="overflow-hidden rounded-2xl bg-[#0B0D13] shadow-[0_0_0_1px_rgba(255,255,255,0.1)]">
          <div className="relative aspect-video overflow-hidden">
            <img src={LESSON.poster} alt="" aria-hidden="true" width={1280} height={720} className="h-full w-full object-cover" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => {
                setRun((r) => r + 1);
                onUse();
              }}
              aria-label="Play the lesson"
              className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/95 text-[#FF6321] shadow-[0_14px_40px_-8px_rgba(0,0,0,0.7)]"
            >
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-white/40" />
              <Play className="relative h-5 w-5 translate-x-0.5 fill-current" />
            </motion.button>
            <span className="absolute bottom-2 right-2 rounded-full bg-black/65 px-2 py-0.5 font-mono text-[10px] text-white backdrop-blur">from {fmtTime(p.at)}</span>
          </div>
          <div className="px-3.5 pb-3.5 pt-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#FF8A4C]">Video lesson · {LESSON.subject}</div>
            <div className="mt-1 text-[14px] font-semibold text-white">{p.name}</div>
            <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-white/10">
              <motion.div key={`${part}-${run}`} className="h-full rounded-full bg-[#FF6321]" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ delay: 0.3, duration: 3, ease: 'linear' }} />
            </div>
          </div>
        </div>
      </motion.div>
      <motion.p {...rise(2)} className="text-center text-[12px] leading-snug text-stone-400">
        Watch it, clear your doubts, then try again.
      </motion.p>
    </div>
  );
};

/* ------------------------------------------------ 5. the adaptive test */

const ADAPT_OPTIONS = ['Glucose and oxygen', 'Starch and nitrogen', 'Protein and hydrogen'];

export const AdaptiveScene: React.FC<SceneProps> = ({ onUse }) => {
  const [pick, setPick] = useState<number | null>(null);
  const touched = useRef(false);
  useEffect(() => {
    const t = setTimeout(() => !touched.current && setPick(0), 2000);
    return () => clearTimeout(t);
  }, []);
  const wrong = pick !== null && pick !== 0;
  return (
    <div className="w-full space-y-3">
      <motion.div {...rise(0)}>
        <div className="rounded-2xl bg-gradient-to-br from-[#FF6321]/20 to-[#FF6321]/[0.05] p-3.5 ring-1 ring-inset ring-[#FF6321]/35">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#FFB27A]">
            Adaptive test
            <span className="flex items-center gap-1 rounded-full bg-black/30 px-2 py-0.5 text-white">
              Level 3
              <motion.span initial={{ y: -4, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, type: 'spring', stiffness: 400, damping: 20 }}>
                <ArrowDown className="h-3 w-3 text-[#FFB27A]" />
              </motion.span>
              <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
                Level 2
              </motion.span>
            </span>
          </div>
          <p className="mt-2 text-[12px] leading-snug text-stone-200">You scored 58%, so this test is easier and covers only your weak topics.</p>
        </div>
      </motion.div>
      <motion.div {...rise(1)}>
        <Card className="p-4">
          <Label>How light makes glucose</Label>
          <div className="mt-1.5 text-[15px] font-semibold leading-snug tracking-[-0.02em] text-white">Which two things does a plant make from CO₂ and water, in light?</div>
        </Card>
      </motion.div>
      <div className="space-y-2">
        {ADAPT_OPTIONS.map((o, i) => {
          const isPick = pick === i;
          const good = isPick && i === 0;
          const bad = isPick && i !== 0;
          const reveal = wrong && i === 0;
          return (
            <motion.button
              key={o}
              {...rise(i + 2)}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                touched.current = true;
                setPick(i);
                onUse();
              }}
              className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-[13px] font-semibold transition-colors duration-300 ${
                good ? 'bg-emerald-400/15 text-white shadow-[0_0_0_1.5px_#10B981]' : bad ? 'bg-rose-400/15 text-white shadow-[0_0_0_1.5px_#F43F5E]' : reveal ? 'bg-emerald-400/10 text-white shadow-[0_0_0_1.5px_rgba(16,185,129,0.55)]' : 'bg-white/[0.05] text-stone-300 shadow-[0_0_0_1px_rgba(255,255,255,0.09)]'
              }`}
            >
              {o}
              {(good || bad || reveal) && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }} className={`flex h-5 w-5 items-center justify-center rounded-full text-[#07080C] ${bad ? 'bg-rose-400' : 'bg-emerald-400'}`}>
                  {bad ? <X className="h-3 w-3" strokeWidth={4} /> : <Check className="h-3 w-3" strokeWidth={4} />}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

/* ------------------------------------------------- 6. the analysis report */

const AFTER: Band[] = ['green', 'green', 'green', 'yellow', 'yellow', 'green'];

export const ReportScene: React.FC<SceneProps> = ({ onUse, onNext }) => {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 900);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="w-full space-y-3">
      <motion.div {...rise(0)}>
        <Card className="p-4">
          <Label>Your analysis report</Label>
          <div className="mt-2 flex items-end justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-[15px] font-semibold tabular-nums text-stone-500 line-through decoration-stone-600">58%</span>
              <ArrowRight className="h-3.5 w-3.5 text-stone-500" />
              <motion.span key={String(done)} initial={{ opacity: 0.3, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-[34px] font-semibold leading-none tracking-[-0.05em] tabular-nums" style={{ color: done ? BANDS.yellow.solid : BANDS.red.solid }}>
                {done ? '76%' : '58%'}
              </motion.span>
            </div>
            <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-400/25">+18 points</span>
          </div>
        </Card>
      </motion.div>
      <div className="space-y-1">
        {PHOTOSYNTHESIS_PARTS.map((p, i) => {
          const to = BANDS[AFTER[i]];
          const from = BANDS[p.band];
          return (
            <motion.div key={p.name} {...rise(i + 1)} className="flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-1.5">
              <span className="flex min-w-0 items-center gap-2.5">
                <motion.span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  initial={false}
                  animate={{ backgroundColor: done ? to.solid : from.solid, boxShadow: `0 0 10px ${done ? to.glow : from.glow}` }}
                  transition={{ delay: done ? i * 0.07 : 0, duration: 0.5 }}
                />
                <span className="truncate text-[12px] font-medium text-stone-300">{p.name}</span>
              </span>
              <span className={`shrink-0 text-[10.5px] font-semibold ${done ? to.text : from.text}`}>{done ? to.label : from.label}</span>
            </motion.div>
          );
        })}
      </div>
      <motion.div {...rise(7)}>
        <Cta
          tone="brand"
          onClick={() => {
            onUse();
            onNext();
          }}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Start the next round
        </Cta>
      </motion.div>
    </div>
  );
};

export const SCENES: React.FC<SceneProps>[] = [TopicScene, TestScene, WeakScene, VideoScene, AdaptiveScene, ReportScene];
