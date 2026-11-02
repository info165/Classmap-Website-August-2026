import React, { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Play, Palette, SkipForward } from 'lucide-react';
import { EASE, Eyebrow, Reveal } from '../ui/primitives';
import { BANDS, LESSON, PHOTOSYNTHESIS_PARTS, fmtTime } from './data';

/**
 * Red, yellow, green, and what to do about it.
 *
 * A report is a coloured step for every part of a topic. Here the topic is
 * Photosynthesis, and the lesson is a real ClassMap video. Choose a part you are
 * weak in and a button offers to open the lesson at the moment that explains it; choose one that
 * is green and you are told you are good to go.
 *
 * The parts and their colours are an example. The video is the real lesson.
 */
const counts = {
  green: PHOTOSYNTHESIS_PARTS.filter((c) => c.band === 'green').length,
  yellow: PHOTOSYNTHESIS_PARTS.filter((c) => c.band === 'yellow').length,
  red: PHOTOSYNTHESIS_PARTS.filter((c) => c.band === 'red').length
};

export const ColorReport: React.FC = () => {
  // Start on a red part: it is the one with something to show.
  const [sel, setSel] = useState(PHOTOSYNTHESIS_PARTS.findIndex((c) => c.band === 'red'));
  const [started, setStarted] = useState(false);
  const [now, setNow] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const part = PHOTOSYNTHESIS_PARTS[sel];
  const b = BANDS[part.band];

  /** Cue the lesson to a time, and optionally play. Works before metadata has loaded. */
  const cue = useCallback((t: number, play: boolean) => {
    const v = videoRef.current;
    if (!v) return;
    setStarted(true);
    const go = () => {
      v.currentTime = t;
      if (play) void v.play();
    };
    if (v.readyState >= 1) go();
    else {
      v.addEventListener('loadedmetadata', go, { once: true });
      v.load();
    }
  }, []);

  // Choosing a part only selects it. The lesson jumps ahead only when the
  // visitor asks for it, with the "Watch from" button or a dot on the timeline.
  const choose = (i: number) => setSel(i);

  // Which part is playing right now, for the live marker.
  const live = PHOTOSYNTHESIS_PARTS.reduce((acc, p, i) => (now >= p.at ? i : acc), -1);

  return (
    <section id="report" className="noise relative isolate overflow-hidden bg-[#050507] py-24 text-white sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-6%] top-[8%] h-[560px] w-[700px] rounded-full bg-[radial-gradient(closest-side,rgba(244,63,94,0.12),transparent)] blur-3xl" />
        <div className="absolute right-[-6%] bottom-[4%] h-[560px] w-[700px] rounded-full bg-[radial-gradient(closest-side,rgba(16,185,129,0.12),transparent)] blur-3xl" />
      </div>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <Eyebrow tone="dark" icon={<Palette className="h-3.5 w-3.5" />}>
              Your report
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="text-gradient-light mt-6 text-balance text-[2.3rem] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl lg:text-[3.4rem]">
              Know exactly what to fix.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-stone-400 sm:text-lg">
              Every topic in your detailed report is coloured, and for the parts you are weak in, a video lesson is ready, with a button that jumps to the exact moment that explains it.
            </p>
          </Reveal>
        </div>

        {/* The three colours */}
        <Reveal className="mx-auto mt-12 grid max-w-[1000px] grid-cols-1 gap-3 sm:grid-cols-3">
          {(['red', 'yellow', 'green'] as const).map((k, i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.7, ease: EASE }}
              className={`rounded-2xl p-5 ring-1 ring-inset ${BANDS[k].bg} ${BANDS[k].ring}`}
            >
              <div className="flex items-center gap-2.5">
                <span className="h-3 w-3 rounded-full" style={{ background: BANDS[k].solid, boxShadow: `0 0 16px 3px ${BANDS[k].glow}` }} />
                <span className={`text-lg font-semibold tracking-[-0.02em] ${BANDS[k].text}`}>
                  {k === 'red' ? 'Red' : k === 'yellow' ? 'Yellow' : 'Green'}
                </span>
              </div>
              <p className="mt-2 text-[14px] leading-relaxed text-stone-300">
                {k === 'red' ? 'Not good in this topic yet.' : k === 'yellow' ? 'Improving. Getting there.' : 'Good. Good to go.'}
              </p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-stone-500">{BANDS[k].range}</p>
            </motion.div>
          ))}
        </Reveal>

        {/* The report and the lesson */}
        <Reveal y={40} className="mx-auto mt-10 max-w-[1120px]">
          <div className="rounded-[32px] bg-white/[0.035] p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.09),0_70px_120px_-50px_rgba(0,0,0,0.9)] sm:p-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[0.92fr_1.28fr]">
              {/* ---------------------------------------------------- the parts */}
              <div className="rounded-[24px] bg-[#0B0D13] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-7">
                <div className="flex items-baseline justify-between gap-3">
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500">{LESSON.subject}</div>
                    <div className="mt-1 text-xl font-semibold tracking-[-0.02em]">{LESSON.title}</div>
                  </div>
                  <div className="text-right text-[12px] leading-relaxed text-stone-400">
                    <span className="text-emerald-300">{counts.green} good</span> · <span className="text-amber-300">{counts.yellow} getting there</span> ·{' '}
                    <span className="text-rose-300">{counts.red} needs help</span>
                  </div>
                </div>

                {/* The coloured steps, as in the real app */}
                <div className="mt-5 flex gap-1.5">
                  {PHOTOSYNTHESIS_PARTS.map((k, i) => (
                    <motion.button
                      key={k.name}
                      onClick={() => choose(i)}
                      aria-label={`${k.name}: ${BANDS[k.band].label}`}
                      initial={{ scaleY: 0.2, opacity: 0 }}
                      whileInView={{ scaleY: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.15 + i * 0.07, duration: 0.5, ease: EASE }}
                      whileHover={{ y: -2 }}
                      className="relative h-3 flex-1 origin-bottom cursor-pointer rounded-full"
                      style={{
                        background: BANDS[k.band].solid,
                        boxShadow: i === sel ? `0 0 0 2px #0B0D13, 0 0 0 4px ${BANDS[k.band].solid}, 0 0 20px ${BANDS[k.band].glow}` : 'none',
                        opacity: i === sel ? 1 : 0.8
                      }}
                    />
                  ))}
                </div>

                <div className="mt-6 space-y-1.5">
                  {PHOTOSYNTHESIS_PARTS.map((k, i) => {
                    const on = i === sel;
                    const kb = BANDS[k.band];
                    return (
                      <button
                        key={k.name}
                        onClick={() => choose(i)}
                        aria-pressed={on}
                        className={`relative flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-4 py-3 text-left transition-colors duration-300 ${
                          on ? 'bg-white/[0.07]' : 'hover:bg-white/[0.04]'
                        }`}
                      >
                        {on && (
                          <motion.span
                            layoutId="part-ring"
                            transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                            className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20"
                          />
                        )}
                        <span className="relative flex min-w-0 items-center gap-3">
                          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: kb.solid, boxShadow: on ? `0 0 12px 2px ${kb.glow}` : 'none' }} />
                          <span className={`truncate text-[14px] font-medium ${on ? 'text-white' : 'text-stone-300'}`}>{k.name}</span>
                        </span>
                        <span className="relative flex shrink-0 items-center gap-2">
                          {started && live === i && (
                            <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#FF8A4C]">
                              <span className="relative flex h-1.5 w-1.5">
                                <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-[#FF6321]/70" />
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#FF6321]" />
                              </span>
                              Playing
                            </span>
                          )}
                          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${kb.bg} ${kb.text} ${kb.ring}`}>{kb.label}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ---------------------------------------------------- the lesson */}
              <div className="flex flex-col rounded-[24px] bg-[#0B0D13] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-5">
                {/* What the chosen part means */}
                <div className="min-h-[3.75rem] px-2 pb-3 pt-1 sm:px-1">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={sel}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25, ease: EASE }}
                      className="flex items-start justify-between gap-4"
                    >
                      {part.band === 'green' ? (
                        <p className="flex items-start gap-2.5 text-[14px] leading-snug text-stone-300">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                          <span>
                            <span className="font-semibold text-white">{part.name}: you are good to go.</span> Your next test on this will be harder. You can still rewatch it below.
                          </span>
                        </p>
                      ) : (
                        <>
                          <p className="text-[14px] leading-snug text-stone-300">
                            <span className={`font-semibold ${b.text}`}>{part.name}</span> is {part.band === 'red' ? 'not good yet' : 'getting there'}. Watch this part of the lesson, then take the test again.
                          </p>
                          <button
                            onClick={() => cue(part.at, true)}
                            className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-[#FF6321] px-3.5 py-2 text-[12px] font-semibold text-white shadow-[0_8px_22px_-6px_rgba(255,99,33,0.8)] transition-transform hover:-translate-y-0.5"
                          >
                            <SkipForward className="h-3.5 w-3.5" />
                            Watch from {fmtTime(part.at)}
                          </button>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* The player */}
                <div className="relative overflow-hidden rounded-2xl bg-black shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_40px_80px_-30px_rgba(0,0,0,0.9)]">
                  <video
                    ref={videoRef}
                    src={LESSON.src}
                    poster={LESSON.poster}
                    preload="none"
                    playsInline
                    controls={started}
                    onTimeUpdate={(e) => setNow(e.currentTarget.currentTime)}
                    onPause={() => undefined}
                    className="block aspect-video h-auto w-full object-cover"
                  />

                  {!started && (
                    <button
                      onClick={() => cue(0, true)}
                      aria-label={`Play the video lesson: ${LESSON.title}`}
                      className="group absolute inset-0 cursor-pointer bg-gradient-to-t from-black/55 via-black/5 to-black/10"
                    >
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <span className="absolute inset-0 animate-pulse-ring rounded-full bg-white/40" />
                        <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white/95 sm:h-16 sm:w-16 shadow-[0_14px_40px_-8px_rgba(0,0,0,0.7)] backdrop-blur-sm transition-transform duration-500 group-hover:scale-110">
                          <Play className="h-[18px] w-[18px] translate-x-0.5 fill-[#FF6321] text-[#FF6321] sm:h-6 sm:w-6" />
                        </span>
                      </span>
                      <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-left">
                        {/* The thumbnail already carries the lesson's title */}
                        <span className="rounded-full bg-black/55 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#FFD2B0] backdrop-blur">Video lesson · {LESSON.subject}</span>
                        <span className="shrink-0 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[11px] text-white backdrop-blur">{fmtTime(LESSON.duration)}</span>
                      </span>
                    </button>
                  )}
                </div>

                {/* Chapters, as a row of markers along the lesson */}
                <div className="mt-4 px-1">
                  <div className="relative h-2 rounded-full bg-white/[0.07]">
                    {started && (
                      <span className="absolute inset-y-0 left-0 rounded-full bg-white/25" style={{ width: `${Math.min(100, (now / LESSON.duration) * 100)}%` }} />
                    )}
                    {PHOTOSYNTHESIS_PARTS.map((k, i) => (
                      <button
                        key={k.name}
                        onClick={() => {
                          setSel(i);
                          cue(k.at, true);
                        }}
                        aria-label={`Jump to ${k.name} at ${fmtTime(k.at)}`}
                        className="group absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full"
                        style={{ left: `${(k.at / LESSON.duration) * 100}%` }}
                      >
                        <span
                          className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-300 group-hover:scale-150"
                          style={{
                            background: BANDS[k.band].solid,
                            boxShadow: i === sel ? `0 0 0 3px #0B0D13, 0 0 0 4.5px ${BANDS[k.band].solid}` : 'none'
                          }}
                        />
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 flex justify-between font-mono text-[10px] text-stone-600">
                    <span>0:00</span>
                    <span>Tap a dot to jump to that part</span>
                    <span>{fmtTime(LESSON.duration)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-6 text-center font-mono text-[11px] tracking-tight text-stone-600">
            An example report for one topic. Your own report is built from your real tests.
          </p>
        </Reveal>
      </div>
    </section>
  );
};
