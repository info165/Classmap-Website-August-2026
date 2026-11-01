import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useMotionTemplate, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { Camera, Crosshair, PenLine, Sparkles } from 'lucide-react';
import { EASE, Reveal } from '../ui/primitives';

/**
 * Handwritten answers: see the page the way ClassMap AI sees it.
 *
 * A real graded answer sheet lies on the table as a plain grey page, the way it
 * looks when it is handed in. A lens moves over it, and wherever the lens is,
 * the page shows ClassMap's marking in full colour and close up: the ticks, the
 * crosses, the part-marks and the report beside them. The lens tours the page
 * on its own; the cursor (or a tap) takes it over.
 *
 * Over the report column the lens changes shape: a round loupe there would
 * mostly land on the white space between cards, so it becomes a wide window
 * the size of a report card and reads the card whole. The glass always stays
 * inside the page; near an edge it is the magnified point that moves.
 *
 * The sheet is real ClassMap output (public/student/graded-sheet.webp).
 */
const IMG = { src: '/student/graded-sheet.webp', w: 940, h: 772 };

/** Places the lens visits, as fractions of the page, and what it finds there. */
const SPOTS = [
  { x: 0.17, y: 0.168, label: 'Question 1', note: 'Correct · 1.0 / 1', tone: '#34D399' },
  { x: 0.454, y: 0.197, label: 'Question 2', note: 'Marked incorrect', tone: '#FB7185' },
  { x: 0.78, y: 0.104, label: 'The report', note: 'Q2 · 0.0 / 1', tone: '#FB7185' },
  { x: 0.29, y: 0.69, label: 'Question 14', note: 'Read line by line', tone: '#FF8A4C' },
  { x: 0.453, y: 0.935, label: 'Question 14', note: 'Partly right', tone: '#FBBF24' },
  { x: 0.78, y: 0.955, label: 'The report', note: 'Q14 · 1.5 / 2', tone: '#FBBF24' }
];

const STEPS = [
  { icon: PenLine, title: 'Write on paper', body: 'Answer by hand, the way you will in your exam.' },
  { icon: Camera, title: 'Upload your pages', body: 'Photograph your sheets into the ClassMap portal.' },
  { icon: Sparkles, title: 'Get a detailed report', body: 'ClassMap AI grades every answer and explains each mark.' }
];

const MAGNIFY = 1.7;
const DWELL = 1700;
/** The report column starts here, as a share of the page width. */
const REPORT_X = 0.6;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const SPRING = { stiffness: 220, damping: 28, mass: 0.6 };

export const HandwrittenFlow: React.FC = () => {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { amount: 0.4 });
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [spot, setSpot] = useState(0);
  const [manual, setManual] = useState(false);
  const [flip, setFlip] = useState(false);
  /** Half the lens width right now, for placing its caption beside it. */
  const [half, setHalf] = useState(118);
  const resume = useRef<ReturnType<typeof setTimeout>>();
  const sizeRef = useRef({ w: 0, h: 0 });

  // Where the glass sits, its shape, and the point on the page it magnifies.
  const wx = useSpring(0, SPRING);
  const wy = useSpring(0, SPRING);
  const ox = useSpring(0, SPRING);
  const oy = useSpring(0, SPRING);
  const hw = useSpring(118, SPRING);
  const hh = useSpring(118, SPRING);
  const rad = useSpring(118, SPRING);
  const mag = useSpring(MAGNIFY, SPRING);

  const left = useTransform(() => wx.get() - hw.get());
  const top = useTransform(() => wy.get() - hh.get());
  const width = useTransform(() => hw.get() * 2);
  const height = useTransform(() => hh.get() * 2);
  const innerLeft = useTransform(() => hw.get() - wx.get());
  const innerTop = useTransform(() => hh.get() - wy.get());
  const origin = useMotionTemplate`${ox}px ${oy}px`;

  const narrow = !!size.w && size.w < 640;

  /** Point the lens at a place on the page, in page pixels. */
  const aim = (x: number, y: number, jump = false) => {
    const { w, h } = sizeRef.current;
    if (!w) return;
    const r = w < 640 ? 74 : 118;
    const report = x > w * REPORT_X;
    const halfW = report ? w * 0.25 : r;
    // Keeps the glass a little off the page edge, so it never looks cut.
    const pad = report ? 10 : 0;
    const halfH = report ? Math.max(h * 0.075, 40) : r;
    const targets: [typeof wx, number][] = [
      [wx, clamp(report ? w * 0.78 : x, halfW + pad, w - halfW - pad)],
      [wy, clamp(y, halfH + pad, h - halfH - pad)],
      [ox, report ? w * 0.78 : clamp(x, 0, w)],
      [oy, clamp(y, 0, h)],
      [hw, halfW],
      [hh, halfH],
      [rad, report ? 18 : r],
      [mag, report ? (w < 640 ? 1.45 : 1.25) : MAGNIFY]
    ];
    for (const [mv, v] of targets) {
      if (jump) mv.jump(v);
      else mv.set(v);
    }
    setHalf(halfW);
    setFlip(report || x > w * 0.5);
  };

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const fit = () => {
      sizeRef.current = { w: el.clientWidth, h: el.clientHeight };
      setSize(sizeRef.current);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Put the lens on the current spot. The first time it appears there, rather than flying in.
  const placed = useRef(false);
  useEffect(() => {
    if (manual || !size.w) return;
    const p = SPOTS[spot];
    aim(p.x * size.w, p.y * size.h, !placed.current);
    placed.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spot, manual, size]);

  // And walk it round the page while nobody is steering.
  useEffect(() => {
    if (manual || !inView || reduce) return;
    const t = setTimeout(() => setSpot((i) => (i + 1) % SPOTS.length), DWELL);
    return () => clearTimeout(t);
  }, [spot, manual, inView, reduce]);

  useEffect(() => () => clearTimeout(resume.current), []);

  const steer = (e: React.PointerEvent) => {
    const r = stageRef.current?.getBoundingClientRect();
    if (!r) return;
    aim(e.clientX - r.left, e.clientY - r.top);
    if (!manual) setManual(true);
    clearTimeout(resume.current);
    // A touch has no "leave", so give the tour back after a pause.
    if (e.pointerType !== 'mouse') resume.current = setTimeout(() => setManual(false), 3500);
  };

  const s = SPOTS[spot];

  return (
    <section id="handwritten" className="noise relative isolate overflow-hidden bg-[#050507] py-24 text-white sm:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[30%] h-[900px] w-[1300px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,99,33,0.16),rgba(255,99,33,0.03)_60%,transparent)] blur-2xl" />
      </div>

      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <h2 className="text-balance text-[2.6rem] font-semibold leading-[0.98] tracking-[-0.05em] sm:text-6xl lg:text-[5rem]">
              <span className="text-gradient-light">Write on paper.</span>
              <br />
              <span className="text-gradient-brand">Get graded by AI.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-stone-400 sm:text-lg">
              For subjective questions there is nothing to type. Upload your handwritten answer sheets and ClassMap AI does the grading.
            </p>
          </Reveal>
        </div>

        {/* Three steps on one rail, with light running along it */}
        <Reveal delay={0.12} className="mx-auto mt-14 max-w-4xl">
          <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
            <div aria-hidden="true" className="absolute left-[16.6%] right-[16.6%] top-[22px] hidden h-px overflow-hidden bg-white/10 sm:block">
              {!reduce && (
                <motion.span
                  className="absolute top-1/2 h-[3px] w-24 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-[#FF8A4C] to-transparent"
                  animate={{ left: ['-15%', '100%'] }}
                  transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.25 }}
                />
              )}
            </div>
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <div key={title} className="relative flex flex-col items-center text-center">
                <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#0D0E13] text-[#FF8A4C] shadow-[0_0_0_1px_rgba(255,99,33,0.45),0_0_30px_-6px_rgba(255,99,33,0.7)]">
                  <Icon className="h-5 w-5" />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF6321] font-mono text-[9px] font-semibold text-white">{i + 1}</span>
                </span>
                <div className="mt-4 text-[17px] font-semibold tracking-[-0.02em] text-white">{title}</div>
                <p className="mt-1.5 max-w-[15rem] text-[14px] leading-snug text-stone-400">{body}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* The page, on the table */}
        {/* Sized by the height of the screen too, so the whole page is in view at once */}
        <div className="mx-auto mt-16 w-full max-w-[min(1040px,calc((100svh-8rem)*1.2))] [perspective:1800px] sm:mt-20">
          <motion.div
            initial={reduce ? false : { rotateX: 26, y: 70, scale: 0.93, opacity: 0 }}
            whileInView={{ rotateX: 0, y: 0, scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: '0px 0px -15% 0px' }}
            transition={{ duration: 0.95, ease: EASE }}
            style={{ transformOrigin: '50% 100%' }}
            className="relative"
          >
            <div aria-hidden="true" className="absolute -bottom-10 left-1/2 h-16 w-[90%] -translate-x-1/2 rounded-[50%] bg-black blur-2xl" />
            <div className="relative rounded-[30px] bg-gradient-to-b from-white/[0.16] to-white/[0.03] p-2 shadow-[0_0_0_1px_rgba(255,255,255,0.09),0_80px_140px_-50px_rgba(255,99,33,0.45),0_50px_90px_-30px_rgba(0,0,0,0.95)] sm:p-2.5">
              <div
                ref={stageRef}
                onPointerMove={steer}
                onPointerDown={steer}
                onPointerLeave={(e) => e.pointerType === 'mouse' && setManual(false)}
                className="relative cursor-none touch-pan-y overflow-hidden rounded-[22px] bg-white"
                style={{ aspectRatio: `${IMG.w} / ${IMG.h}` }}
              >
                {/* The page as it was handed in: plain and grey */}
                <img
                  src={IMG.src}
                  alt="A real handwritten answer sheet graded by ClassMap AI. The student's answers are on the left, each with a marker; on the right is a report for every question, with question 2 and question 13 marked incorrect and question 14 scored 1.5 out of 2."
                  width={IMG.w}
                  height={IMG.h}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="absolute inset-0 h-full w-full select-none"
                  style={{ filter: 'grayscale(1) contrast(0.92) brightness(0.6)' }}
                />

                {/* The lens: a window onto the page, in colour and closer */}
                {size.w > 0 && (
                  <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-0 top-0 z-10 overflow-hidden bg-white shadow-[0_0_0_1.5px_rgba(255,160,110,0.95),0_0_0_7px_rgba(255,99,33,0.14),0_0_60px_10px_rgba(255,99,33,0.35),0_24px_50px_-10px_rgba(0,0,0,0.6)]"
                    style={{ x: left, y: top, width, height, borderRadius: rad }}
                  >
                    <motion.img
                      src={IMG.src}
                      alt=""
                      width={IMG.w}
                      height={IMG.h}
                      draggable={false}
                      className="absolute max-w-none select-none"
                      style={{ left: innerLeft, top: innerTop, width: size.w, height: size.h, scale: mag, transformOrigin: origin }}
                    />
                    {/* Ticks at the four points of the ring, and light on the glass */}
                    <span className="absolute left-1/2 top-0 h-2.5 w-px -translate-x-1/2 bg-[#FFB27A]" />
                    <span className="absolute bottom-0 left-1/2 h-2.5 w-px -translate-x-1/2 bg-[#FFB27A]" />
                    <span className="absolute left-0 top-1/2 h-px w-2.5 -translate-y-1/2 bg-[#FFB27A]" />
                    <span className="absolute right-0 top-1/2 h-px w-2.5 -translate-y-1/2 bg-[#FFB27A]" />
                    <span className="absolute left-[14%] top-[10%] h-[22%] w-[30%] rotate-[-30deg] rounded-full bg-white/25 blur-md" />
                    <span className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_30px_rgba(255,255,255,0.35)]" />
                  </motion.div>
                )}

                {/* What the lens has found. On a narrow page it would run off
                    the edge, so there it is shown under the page instead. */}
                {size.w > 0 && !narrow && (
                <motion.div aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-20" style={{ x: wx, y: wy }}>
                  <div className={`absolute top-0 ${flip ? 'right-0' : 'left-0'}`} style={flip ? { marginRight: half + 14 } : { marginLeft: half + 14 }}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={manual ? 'free' : spot}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18, ease: EASE }}
                        className="-translate-y-1/2 whitespace-nowrap rounded-2xl bg-[#0B0C10]/90 px-3.5 py-2.5 shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_20px_40px_-12px_rgba(0,0,0,0.8)] backdrop-blur-xl"
                      >
                        {manual ? (
                          <>
                            <div className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-[#FF8A4C]">AI vision</div>
                            <div className="mt-0.5 text-[12.5px] font-semibold text-white">What ClassMap sees</div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-stone-400">
                              <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.tone, boxShadow: `0 0 8px ${s.tone}` }} />
                              {s.label}
                            </div>
                            <div className="mt-0.5 text-[12.5px] font-semibold text-white">{s.note}</div>
                          </>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>
                )}

                {/* One pass of light as the page comes up off the table */}
                {!reduce && (
                  <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 z-20"
                    initial={{ top: '0%', opacity: 0 }}
                    whileInView={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
                    viewport={{ once: true, margin: '0px 0px -20% 0px' }}
                    transition={{ duration: 1.6, delay: 0.5, ease: [0.45, 0.05, 0.35, 1] }}
                  >
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FF9A66]/30 to-transparent" />
                    <div className="relative h-px bg-white shadow-[0_0_12px_2px_rgba(255,255,255,0.8),0_0_48px_10px_rgba(255,120,60,0.6)]" />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {narrow && (
            <div className="mt-6 flex h-12 items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={manual ? 'free' : spot}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18, ease: EASE }}
                  className="flex items-center gap-2.5 rounded-full bg-white/[0.05] px-4 py-2 text-[13px] shadow-[0_0_0_1px_rgba(255,255,255,0.1)]"
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: manual ? '#FF8A4C' : s.tone, boxShadow: `0 0 8px ${manual ? '#FF8A4C' : s.tone}` }} />
                  <span className="text-stone-400">{manual ? 'AI vision' : s.label}</span>
                  <span className="font-semibold text-white">{manual ? 'What ClassMap sees' : s.note}</span>
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          <div className={`${narrow ? 'mt-6' : 'mt-12'} flex flex-col items-center gap-5`}>
            <p className="flex items-center gap-2 text-[13px] text-stone-400">
              <Crosshair className="h-4 w-4 text-[#FF8A4C]" />
              <span className="hidden sm:inline">Move your cursor over the page: the lens shows what ClassMap AI sees.</span>
              <span className="sm:hidden">Tap the page to look closer.</span>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2" aria-label="Places on the page">
              {SPOTS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setManual(false);
                    setSpot(i);
                  }}
                  aria-label={`${p.label}: ${p.note}`}
                  className="group flex h-6 cursor-pointer items-center"
                >
                  <span className={`block h-1.5 rounded-full transition-all duration-500 ${!manual && i === spot ? 'w-7 bg-[#FF6321]' : 'w-1.5 bg-white/25 group-hover:bg-white/50'}`} />
                </button>
              ))}
            </div>
            <p className="font-mono text-[11px] tracking-tight text-stone-600">A real answer sheet graded by ClassMap AI.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
