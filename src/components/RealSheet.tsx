import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform
} from 'motion/react';
import { FileCheck2, Scale, MessageSquareText, ScanLine, RotateCcw } from 'lucide-react';
import { EASE, Eyebrow, Reveal } from './ui/primitives';

/**
 * A real answer sheet, marked by ClassMap.
 *
 * The picture is a screenshot of actual output, so every figure and sentence
 * here is read off it. The student's name has been painted out of the header
 * bar in the file itself (public/real-sheet.webp), not merely hidden by CSS.
 *
 * Coordinates below are in the picture's own pixels (1280 x 1122) and are
 * drawn as an SVG overlay in that same space, so they stay locked to the
 * artwork at any display size.
 *
 * Composition: copy and the three questions on the left, the sheet on the
 * right, sized by the height of the screen as well as its width, so the whole
 * scene is in view at once and nothing has to be scrolled to be seen.
 *
 * The scan is timed, not scroll-driven. It runs when the sheet arrives, again
 * after each full tour of the questions, and on request.
 */
const W = 1280;
const H = 1122;

type Box = { x: number; y: number; w: number; h: number };

const QUESTIONS: {
  q: string;
  score: string;
  label: string;
  caption: React.ReactNode;
  sheet: Box;
  card: Box;
}[] = [
  {
    q: '17',
    score: '2.0 / 2',
    label: 'Full marks',
    caption: 'One check, passed: the difference marked by the copulatory pad is identified correctly.',
    sheet: { x: 38, y: 198, w: 712, h: 116 },
    card: { x: 772, y: 46, w: 482, h: 90 }
  },
  {
    q: '18',
    score: '2.5 / 3',
    label: 'Partial marks, explained',
    caption: (
      <>
        Three checks passed. The fourth flags the zygote&rsquo;s ploidy (&lsquo;n&rsquo; instead of &lsquo;2n&rsquo;) and the order of
        karyogamy and meiosis, and says why that matters.
      </>
    ),
    sheet: { x: 38, y: 352, w: 712, h: 358 },
    card: { x: 772, y: 146, w: 482, h: 240 }
  },
  {
    q: '19',
    score: '3.0 / 3',
    label: 'Full marks',
    caption: 'Four checks passed, across amoeboid, flagellated, ciliated and sporozoan protozoa.',
    sheet: { x: 34, y: 716, w: 716, h: 328 },
    card: { x: 772, y: 396, w: 482, h: 190 }
  }
];

const POINTS = [
  {
    icon: FileCheck2,
    title: 'Marked step by step',
    body: 'Each answer is broken into checks, F1 to F4, and every one is ticked or flagged against what the student wrote.'
  },
  {
    icon: Scale,
    title: 'Partial marks, with reasons',
    body: 'Question 18 earns 2.5 out of 3, and the half-mark lost is accounted for rather than left as a bare number.'
  },
  {
    icon: MessageSquareText,
    title: 'Mistakes in plain language',
    body: 'The error is described the way a teacher would say it, so the next step is obvious.'
  }
];

const INTERVAL = 3000;
const SCAN_SECONDS = 4.6;

export const RealSheet: React.FC = () => {
  const reduce = useReducedMotion();
  const sheetRef = useRef<HTMLDivElement>(null);
  // Watches the whole frame, not the scrolling page inside it, so it also fires on a
  // phone where only part of the page is visible. Waits until most of it is on screen.
  const seen = useInView(sheetRef, { once: true, amount: 0.5 });

  const [active, setActive] = useState(1);
  const [paused, setPaused] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [pct, setPct] = useState(reduce ? 100 : 0);

  // 0 -> 1 as the beam travels down the page.
  const progress = useMotionValue(reduce ? 1 : 0);
  const beamTop = useTransform(progress, (v) => `${v * 100}%`);
  const doneClip = useTransform(progress, (v) => `inset(0% 0% ${(1 - v) * 100}% 0%)`);
  const unreadClip = useTransform(progress, (v) => `inset(${v * 100}% 0% 0% 0%)`);

  const runScan = useCallback(() => {
    if (reduce) return;
    setScanning(true);
    setPct(0);
    progress.set(0);
    const controls = animate(progress, 1, {
      duration: SCAN_SECONDS,
      ease: [0.45, 0.05, 0.35, 1],
      onUpdate: (v) => setPct(Math.round(v * 100)),
      onComplete: () => {
        setScanning(false);
        setPct(100);
      }
    });
    return () => controls.stop();
  }, [reduce, progress]);

  useEffect(() => {
    if (!seen) return;
    return runScan();
  }, [seen, runScan]);

  // Tours the three questions on its own, then scans the page again.
  useEffect(() => {
    if (paused || reduce || scanning || !seen) return;
    const t = setTimeout(() => {
      if (active === QUESTIONS.length - 1) {
        setActive(0);
        runScan();
      } else {
        setActive(active + 1);
      }
    }, INTERVAL);
    return () => clearTimeout(t);
  }, [active, paused, reduce, scanning, seen, runScan]);

  const choose = (i: number) => {
    if (scanning) return;
    setActive(i);
    setPaused(true);
  };

  // Before the first scan the page is still unread: no highlights, no labels.
  const idle = !seen && !reduce;
  const q = QUESTIONS[active];
  const areas = [q.sheet, q.card];

  return (
    <section id="real-sheet" className="noise relative isolate overflow-hidden bg-[#07080C] pb-24 pt-14 text-white sm:pb-32 sm:pt-20">
      {/* One restrained pool of light, rather than colour everywhere */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-[-10%] top-[6%] h-[760px] w-[980px] rounded-full bg-[radial-gradient(closest-side,rgba(255,120,60,0.15),rgba(255,99,33,0.03)_65%,transparent)] blur-2xl" />
        <div className="bg-grid-dark absolute inset-0 opacity-40" />
      </div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,350px)_1fr] lg:content-center lg:items-center lg:gap-y-10">
          {/* ------------------------------------------------------------- intro */}
          <div className="lg:col-start-1 lg:row-start-1">
            <Reveal>
              <Eyebrow tone="dark" icon={<ScanLine className="h-3.5 w-3.5" />}>
                Real output
              </Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="text-gradient-light mt-6 text-balance text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl lg:text-[3.3rem]">
                A real answer sheet, marked by ClassMap.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-5 text-pretty text-base leading-relaxed text-stone-400 sm:text-lg">
                Not a mock-up. A handwritten page from a real student, evaluated step by step, with marks and reasons for every question.
              </p>
            </Reveal>
          </div>

          {/* ------------------------------------------------------------- sheet */}
          <Reveal y={36} className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
            <div className="lg:ml-auto lg:w-[min(100%,calc((100svh_-_8rem)_*_1.12))]">
              <div ref={sheetRef} className="relative rounded-[30px] bg-gradient-to-b from-white/[0.12] to-white/[0.03] p-[7px] shadow-[0_0_0_1px_rgba(255,255,255,0.09),0_70px_120px_-40px_rgba(0,0,0,0.95),0_30px_60px_-30px_rgba(255,120,60,0.22)] sm:p-2">
                {/* Status capsule, floating over the top of the sheet */}
                <div className="pointer-events-none absolute left-1/2 top-5 z-30 -translate-x-1/2 sm:top-6">
                  <div className="flex items-center gap-2.5 rounded-full bg-black/75 px-4 py-2 text-[12px] font-medium tracking-tight text-white shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_12px_30px_-8px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                    <span className="relative flex h-2 w-2">
                      {scanning && <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-[#FF6321]/70" />}
                      <span className={`relative inline-flex h-2 w-2 rounded-full ${idle ? 'bg-stone-500' : scanning ? 'bg-[#FF6321]' : 'bg-emerald-400'}`} />
                    </span>
                    {idle ? (
                      <span className="text-stone-300">Ready to scan</span>
                    ) : scanning ? (
                      <span>
                        Scanning <span className="ml-1 inline-block w-9 text-left tabular-nums text-[#FF9A66]">{pct}%</span>
                      </span>
                    ) : (
                      <span>Scan complete</span>
                    )}
                  </div>
                </div>

                {/* The sheet. On a phone the page would shrink past reading, so
                    it keeps a readable width and the visitor swipes across it. */}
                <div className="scrollbar-none relative overflow-x-auto rounded-[23px] bg-white sm:overflow-hidden">
                  <div className="relative min-w-[780px] sm:min-w-0">
                    {/* Unread page: dim, grey and out of focus */}
                    <img
                      src="/real-sheet.webp"
                      alt="A handwritten Biology answer sheet marked by ClassMap. On the left, the student's handwritten answers to questions 17, 18 and 19. On the right, ClassMap's feedback for each: question 17 scores 2.0 out of 2, question 18 scores 2.5 out of 3 with an error in the zygote's ploidy explained, and question 19 scores 3.0 out of 3."
                      width={W}
                      height={H}
                      decoding="async"
                      className="block h-auto w-full"
                      style={{ filter: reduce ? undefined : 'grayscale(1) contrast(0.85) brightness(0.4) blur(2px)' }}
                    />

                    {/* Scanned page: sharp and in colour, revealed down to the beam */}
                    <motion.img
                      src="/real-sheet.webp"
                      alt=""
                      aria-hidden="true"
                      width={W}
                      height={H}
                      decoding="async"
                      className="absolute inset-0 block h-full w-full"
                      style={{ clipPath: reduce ? undefined : doneClip }}
                    />

                    {/* Fine lines over the part not yet read */}
                    {!reduce && (
                      <motion.div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.05)_0,rgba(255,255,255,0.05)_1px,transparent_1px,transparent_5px)]"
                        style={{ clipPath: unreadClip }}
                      />
                    )}

                    {/* The beam: one precise line, and light left behind it */}
                    {!reduce && (
                      <motion.div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 z-20"
                        style={{ top: beamTop, opacity: scanning ? 1 : 0, transition: 'opacity 0.6s' }}
                      >
                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#FF9A66]/30 via-[#FF8A4C]/8 to-transparent" />
                        <div className="relative h-px bg-white shadow-[0_0_12px_2px_rgba(255,255,255,0.8),0_0_48px_10px_rgba(255,120,60,0.6)]" />
                      </motion.div>
                    )}

                    {/* Everything but the chosen question is softly dimmed. One
                        SVG in the picture's own coordinates, so the cut-outs
                        never drift from the artwork. */}
                    <motion.svg
                      aria-hidden="true"
                      viewBox={`0 0 ${W} ${H}`}
                      preserveAspectRatio="none"
                      className="pointer-events-none absolute inset-0 h-full w-full"
                      initial={false}
                      animate={{ opacity: scanning || idle ? 0 : 1 }}
                      transition={{ duration: 0.45 }}
                    >
                      <defs>
                        <mask id="rs-spot">
                          <rect width={W} height={H} fill="white" />
                          {areas.map((a, i) => (
                            <motion.rect
                              key={i}
                              rx={16}
                              fill="black"
                              initial={false}
                              animate={{ x: a.x, y: a.y, width: a.w, height: a.h }}
                              transition={{ duration: 0.5, ease: EASE }}
                            />
                          ))}
                        </mask>
                      </defs>
                      <rect width={W} height={H} fill="rgba(7,8,12,0.26)" mask="url(#rs-spot)" />
                      {areas.map((a, i) => (
                        <motion.rect
                          key={i}
                          rx={16}
                          fill="none"
                          stroke="#FF6321"
                          strokeWidth={2.5}
                          initial={false}
                          animate={{ x: a.x, y: a.y, width: a.w, height: a.h }}
                          transition={{ duration: 0.5, ease: EASE }}
                          style={{ filter: 'drop-shadow(0 0 10px rgba(255,99,33,0.55))' }}
                        />
                      ))}
                    </motion.svg>

                    {/* Invisible hit areas, so hovering the page itself picks a question */}
                    {!scanning &&
                      !idle &&
                      QUESTIONS.map((item, i) =>
                        [item.sheet, item.card].map((b, k) => (
                          <button
                            key={`${item.q}-${k}`}
                            type="button"
                            aria-label={`Show question ${item.q}, ${item.score}`}
                            onMouseEnter={() => choose(i)}
                            onMouseLeave={() => setPaused(false)}
                            onFocus={() => choose(i)}
                            onClick={() => choose(i)}
                            className="absolute cursor-pointer rounded-xl focus-visible:outline-none"
                            style={{
                              left: `${(b.x / W) * 100}%`,
                              top: `${(b.y / H) * 100}%`,
                              width: `${(b.w / W) * 100}%`,
                              height: `${(b.h / H) * 100}%`
                            }}
                          />
                        ))
                      )}
                  </div>
                </div>
              </div>
              <p className="pt-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-stone-600 sm:hidden">
                Swipe to read the full page
              </p>
            </div>
          </Reveal>

          {/* --------------------------------------------------------- questions */}
          <div className="lg:col-start-1 lg:row-start-2">
            <ol className="border-b border-white/[0.09]">
              {QUESTIONS.map((item, i) => {
                const on = i === active && !scanning && !idle;
                return (
                  <li key={item.q} className="border-t border-white/[0.09]">
                    <button
                      onClick={() => choose(i)}
                      aria-current={on ? 'true' : undefined}
                      className="group relative block w-full cursor-pointer py-4 text-left"
                    >
                      <div className="flex items-baseline gap-4">
                        <span
                          className={`w-9 text-[1.7rem] font-semibold leading-none tracking-[-0.04em] tabular-nums transition-colors duration-500 ${
                            on ? 'text-[#FF8A4C]' : 'text-stone-600 group-hover:text-stone-400'
                          }`}
                        >
                          {item.q}
                        </span>
                        <span className={`flex-1 text-[15px] font-medium tracking-tight transition-colors duration-500 ${on ? 'text-white' : 'text-stone-400'}`}>
                          {item.label}
                        </span>
                        <span className={`font-mono text-[13px] tabular-nums transition-colors duration-500 ${on ? 'text-white' : 'text-stone-500'}`}>
                          {item.score}
                        </span>
                      </div>

                      {/* Time left before the next question is shown */}
                      {on && (
                        <span className="absolute inset-x-0 bottom-0 h-px bg-white/[0.08]">
                          <motion.span
                            key={`${active}-${paused}`}
                            className="block h-full origin-left bg-[#FF6321]"
                            initial={{ scaleX: paused || reduce ? 1 : 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: paused || reduce ? 0 : INTERVAL / 1000, ease: 'linear' }}
                          />
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ol>

            {/* The explanation lives in a panel of fixed height. Every caption
                is stacked in the same grid cell, so the panel is always as tall
                as the longest one and the page never shifts when it changes. */}
            <div className="mt-5 grid" aria-live="polite">
              {[...QUESTIONS.map((item, i) => ({ key: item.q, show: i === active && !scanning && !idle, node: item.caption })), { key: 'reading', show: scanning || idle, node: 'ClassMap is reading the page, line by line…' }].map(
                (c) => (
                  <motion.p
                    key={c.key}
                    aria-hidden={!c.show}
                    initial={false}
                    animate={{ opacity: c.show ? 1 : 0, y: c.show ? 0 : 8 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className={`col-start-1 row-start-1 border-l border-[#FF6321]/60 pl-4 text-[14px] leading-relaxed ${
                      c.key === 'reading' ? 'text-stone-500' : 'text-stone-300'
                    } ${c.show ? '' : 'pointer-events-none'}`}
                  >
                    {c.node}
                  </motion.p>
                )
              )}
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
              <button
                onClick={() => {
                  setPaused(false);
                  runScan();
                }}
                disabled={scanning || idle}
                className="inline-flex cursor-pointer items-center gap-2 text-[13px] font-medium text-stone-300 transition-colors hover:text-white disabled:cursor-default disabled:opacity-40"
              >
                <RotateCcw className="h-3.5 w-3.5 text-[#FF6321]" />
                Replay the scan
              </button>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------- proof points */}
        <div className="mt-20 grid grid-cols-1 border-t border-white/[0.09] md:grid-cols-3 lg:mt-28">
          {POINTS.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 0.1}>
              <div className={`h-full px-0 py-8 md:px-8 md:py-10 ${i > 0 ? 'border-t border-white/[0.09] md:border-l md:border-t-0' : 'md:pl-0'} ${i === POINTS.length - 1 ? 'md:pr-0' : ''}`}>
                <Icon className="h-6 w-6 text-[#FF6321]" strokeWidth={1.6} />
                <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-white">{title}</h3>
                <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-stone-400">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
