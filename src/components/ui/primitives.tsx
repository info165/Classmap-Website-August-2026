import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type HTMLMotionProps,
  type MotionValue
} from 'motion/react';

/** Shared easing: a long, soft deceleration. The one curve the whole site uses. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------- Reveal */

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  /** Re-run when scrolled back into view. Off by default: it is calmer. */
  repeat?: boolean;
  as?: 'div' | 'li' | 'section' | 'span';
}

/**
 * Fades, lifts and de-blurs its children as they enter the viewport. The blur
 * is what separates this from a plain fade — content seems to come into focus.
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  y = 28,
  className,
  repeat = false,
  as = 'div'
}) => {
  const reduce = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: !repeat, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
};

/** Splits a headline into words that rise in one after another. */
export const WordReveal: React.FC<{
  text: string;
  className?: string;
  /** Applied to each word, for effects (like a gradient) that must not span
   *  the clipping wrapper around it. */
  wordClassName?: string;
  delay?: number;
}> = ({ text, className, wordClassName = '', delay = 0 }) => {
  const reduce = useReducedMotion();
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
          <motion.span
            className={`inline-block ${wordClassName}`}
            initial={reduce ? false : { y: '110%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.9, delay: delay + i * 0.06, ease: EASE }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

/* ----------------------------------------------------------------- GlowCard */

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** CSS colour for the soft fill and the border light. */
  glow?: string;
  glowEdge?: string;
  /** Max tilt in degrees toward the pointer. Off when omitted. */
  tilt?: number;
}

/** True only where hover is a real thing: not on touch, not for reduced motion. */
const canHover = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * A surface lit by the cursor. The pointer position is written to CSS custom
 * properties, so there is no React re-render per mouse move. With `tilt` it
 * also leans toward the pointer, a few degrees at most.
 */
export const GlowCard: React.FC<GlowCardProps> = ({
  glow,
  glowEdge,
  tilt,
  className = '',
  style,
  children,
  onMouseMove,
  onMouseLeave,
  ...rest
}) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      {...rest}
      onMouseMove={(e) => {
        const el = ref.current;
        if (el) {
          const r = el.getBoundingClientRect();
          el.style.setProperty('--mx', `${e.clientX - r.left}px`);
          el.style.setProperty('--my', `${e.clientY - r.top}px`);
          if (tilt && canHover()) {
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            el.style.transition = 'transform 0.25s ease-out';
            el.style.transform = `perspective(1000px) rotateX(${-py * tilt}deg) rotateY(${px * tilt}deg)`;
          }
        }
        onMouseMove?.(e);
      }}
      onMouseLeave={(e) => {
        const el = ref.current;
        if (el && tilt) {
          el.style.transition = 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)';
          el.style.transform = '';
        }
        onMouseLeave?.(e);
      }}
      className={`glow-card ${className}`}
      style={
        {
          ...(glow ? { '--glow': glow } : null),
          ...(glowEdge ? { '--glow-edge': glowEdge } : null),
          ...style
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
};

/* ----------------------------------------------------------------- CountUp */

interface CountUpProps {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

/** Counts from zero when first scrolled into view, easing out like a gauge. */
export const CountUp: React.FC<CountUpProps> = ({
  to,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1800,
  className
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!inView || reduce) {
      if (reduce) setValue(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutExpo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setValue(to * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration, reduce]);

  const text = value.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
  return (
    <span ref={ref} className={`tabular-nums ${className ?? ''}`}>
      {prefix}
      {text}
      {suffix}
    </span>
  );
};

/* ------------------------------------------------------------------ Eyebrow */

export const Eyebrow: React.FC<{
  icon?: React.ReactNode;
  children: React.ReactNode;
  tone?: 'dark' | 'light';
  className?: string;
}> = ({ icon, children, tone = 'light', className = '' }) => (
  <span
    className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] ${
      tone === 'dark'
        ? 'relative overflow-hidden bg-white/[0.05] text-[#FF8A4C] rim-dark backdrop-blur'
        : 'bg-[#FFF3EC] text-[#D9500F] ring-1 ring-inset ring-[#FF6321]/15'
    } ${className}`}
  >
    {tone === 'dark' && (
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,transparent_38%,rgba(255,255,255,0.14)_50%,transparent_62%)] bg-[length:250%_100%]"
      />
    )}
    <span className="relative inline-flex items-center gap-2">
      {icon}
      {children}
    </span>
  </span>
);

/* ------------------------------------------------------------ SectionHeading */

export const SectionHeading: React.FC<{
  eyebrow: React.ReactNode;
  eyebrowIcon?: React.ReactNode;
  title: React.ReactNode;
  lede?: React.ReactNode;
  tone?: 'dark' | 'light';
  align?: 'center' | 'left';
}> = ({ eyebrow, eyebrowIcon, title, lede, tone = 'light', align = 'center' }) => (
  <div className={`max-w-3xl space-y-5 ${align === 'center' ? 'mx-auto text-center' : ''}`}>
    <Reveal>
      <Eyebrow icon={eyebrowIcon} tone={tone}>
        {eyebrow}
      </Eyebrow>
    </Reveal>
    <Reveal delay={0.06}>
      <h2
        className={`text-balance text-[2.1rem] sm:text-5xl lg:text-[3.4rem] font-semibold leading-[1.04] tracking-[-0.035em] ${
          tone === 'dark' ? 'text-gradient-light' : 'text-gradient-dark'
        }`}
      >
        {title}
      </h2>
    </Reveal>
    {lede && (
      <Reveal delay={0.12}>
        <p
          className={`text-pretty text-base sm:text-lg leading-relaxed ${
            tone === 'dark' ? 'text-stone-400' : 'text-[#5C5A54]'
          }`}
        >
          {lede}
        </p>
      </Reveal>
    )}
  </div>
);

/* ------------------------------------------------------------------ Buttons */

type BtnProps = HTMLMotionProps<'button'> & {
  tone?: 'dark' | 'light';
};

/**
 * Primary call to action. A lit gradient body, a sweep of light across it, and
 * a real press state. Wrapped in motion so it springs rather than snaps.
 */
const PrimaryButtonBase: React.FC<BtnProps> = ({ children, className = '', ...rest }) => (
  <motion.button
    whileHover={{ y: -2 }}
    whileTap={{ y: 1, scale: 0.985 }}
    transition={{ type: 'spring', stiffness: 400, damping: 26 }}
    className={`group/btn relative inline-flex w-full cursor-pointer select-none items-center justify-center gap-2.5 overflow-hidden rounded-full border border-[#FF8A4C]/40 bg-gradient-to-b from-[#FF7A3D] to-[#F0530F] px-7 py-3.5 text-sm font-semibold tracking-tight text-white shadow-[0_1px_0_rgba(255,255,255,0.4)_inset,0_10px_30px_-8px_rgba(255,99,33,0.6),0_0_0_1px_rgba(240,83,15,0.6)] transition-shadow duration-300 hover:shadow-[0_1px_0_rgba(255,255,255,0.5)_inset,0_16px_44px_-8px_rgba(255,99,33,0.85),0_0_0_1px_rgba(240,83,15,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6321]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07080C] ${className}`}
    {...rest}
  >
    {/* Sweep of light */}
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent opacity-0 transition-all duration-700 ease-out group-hover/btn:left-[130%] group-hover/btn:opacity-100"
    />
    <span className="relative inline-flex items-center gap-2.5">{children as React.ReactNode}</span>
  </motion.button>
);

const GhostButtonBase: React.FC<BtnProps> = ({ children, className = '', tone = 'dark', ...rest }) => (
  <motion.button
    whileHover={{ y: -2 }}
    whileTap={{ y: 1, scale: 0.985 }}
    transition={{ type: 'spring', stiffness: 400, damping: 26 }}
    className={`inline-flex w-full cursor-pointer select-none items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold tracking-tight backdrop-blur transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6321]/60 ${
      tone === 'dark'
        ? 'bg-white/[0.06] text-white rim-dark hover:bg-white/[0.11]'
        : 'bg-white text-[#1A1A1A] ring-1 ring-inset ring-black/10 hover:ring-black/20'
    } ${className}`}
    {...rest}
  >
    {children as React.ReactNode}
  </motion.button>
);

export const PrimaryButton: React.FC<BtnProps> = (props) => (
  <Magnetic>
    <PrimaryButtonBase {...props} />
  </Magnetic>
);

export const GhostButton: React.FC<BtnProps> = (props) => (
  <Magnetic>
    <GhostButtonBase {...props} />
  </Magnetic>
);

/* ------------------------------------------------------------------ Magnetic */

/**
 * Pulls its child a few pixels toward the cursor as it approaches, then lets it
 * spring home. Only on devices with a real pointer.
 */
export const Magnetic: React.FC<{ children: React.ReactNode; className?: string; strength?: number }> = ({
  children,
  className = '',
  strength = 0.28
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });
  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      className={`flex ${className}`}
      onMouseMove={(e) => {
        if (!canHover() || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
};

/* ---------------------------------------------------------------- CursorGlow */

/**
 * A soft pool of orange light that trails the cursor. It is `screen`-blended, so
 * it lifts dark surfaces and is invisible on paper.
 */
export const CursorGlow: React.FC = () => {
  const [on, setOn] = useState(false);
  const x = useMotionValue(-600);
  const y = useMotionValue(-600);
  const sx = useSpring(x, { stiffness: 90, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 90, damping: 22, mass: 0.6 });

  useEffect(() => {
    if (!canHover()) return;
    setOn(true);
    const move = (e: PointerEvent) => {
      x.set(e.clientX - 320);
      y.set(e.clientY - 320);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [x, y]);

  if (!on) return null;
  return (
    <motion.div
      aria-hidden="true"
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[4] h-[640px] w-[640px] rounded-full bg-[radial-gradient(closest-side,rgba(255,99,33,0.11),transparent)] mix-blend-screen"
    />
  );
};

/* --------------------------------------------------------------- ImageReveal */

/** Opens a picture out of an inset frame as it enters, easing its scale down. */
export const ImageReveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({
  children,
  className = '',
  delay = 0
}) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { clipPath: 'inset(10% 10% 10% 10% round 40px)', scale: 1.12 }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 0px)', scale: 1 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.3, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
};

/* ---------------------------------------------------------------- ScrollTilt */

/**
 * A panel that starts tipped back and shrunk, and lays itself flat as it rises
 * into view, tied to the scroll position rather than a timer. The product
 * reveal: the window is handed to you rather than appearing.
 */
export const ScrollTilt: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 96%', 'start 38%'] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 13, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0.94, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.35], [reduce ? 1 : 0.25, 1]);
  return (
    <div ref={ref} className={className} style={{ perspective: 1600 }}>
      <motion.div style={{ rotateX, scale, opacity, transformOrigin: '50% 0%' }}>{children}</motion.div>
    </div>
  );
};

/* --------------------------------------------------------------- ScrollWords */

const ScrollWord: React.FC<{ word: string; progress: MotionValue<number>; range: [number, number] }> = ({
  word,
  progress,
  range
}) => {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {word}
      {'\u00A0'}
    </motion.span>
  );
};

/** Words brighten one by one as the reader scrolls through the sentence. */
export const ScrollWords: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 82%', 'end 48%'] });
  const words = text.split(' ');
  if (reduce) return <span className={className}>{text}</span>;
  return (
    <span ref={ref} className={className}>
      {words.map((w, i) => (
        <ScrollWord key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
      ))}
    </span>
  );
};

/* ---------------------------------------------------------------- Typewriter */

/** Types its text out once, on first view, with a blinking caret while it works. */
export const Typewriter: React.FC<{ text: string; className?: string; delay?: number; speed?: number }> = ({
  text,
  className,
  delay = 0,
  speed = 22
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? text.length : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    let i = 0;
    let timer: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      timer = setInterval(() => {
        i += 1;
        setN(i);
        if (i >= text.length) clearInterval(timer);
      }, speed);
    }, delay * 1000);
    return () => {
      clearTimeout(start);
      clearInterval(timer);
    };
  }, [inView, text, delay, speed, reduce]);

  const typing = n > 0 && n < text.length;
  return (
    <span ref={ref} className={`relative block ${className ?? ''}`}>
      {/* The full line holds the space, so nothing reflows while it types. */}
      <span className="invisible">{text}</span>
      <span className="absolute inset-0">
        {text.slice(0, n)}
        {typing && <span className="ml-px inline-block h-[1em] w-[2px] translate-y-[2px] animate-blink bg-current align-baseline" />}
      </span>
    </span>
  );
};

/* -------------------------------------------------------------------- WipeIn */

/** Reveals left to right, as though being written. */
export const WipeIn: React.FC<{ children: React.ReactNode; className?: string; delay?: number; duration?: number }> = ({
  children,
  className,
  delay = 0,
  duration = 0.9
}) => {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className={className}
      initial={reduce ? false : { clipPath: 'inset(0 100% 0 0)' }}
      animate={{ clipPath: 'inset(0 -2% 0 0)' }}
      transition={{ duration, delay, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.span>
  );
};

/* ------------------------------------------------------------ ScrollProgress */

/** A hairline across the top of the viewport that fills as the page scrolls. */
export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.3 });
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-[#FF6321] via-[#FFB27A] to-[#FF6321]"
    />
  );
};

/* ------------------------------------------------------------------ Tilt3D */

/**
 * Tilts its child toward the pointer. Used once, on the hero console, where
 * the depth is the point; anywhere else it would be a gimmick.
 */
export const Tilt3D: React.FC<{ children: React.ReactNode; className?: string; max?: number }> = ({
  children,
  className = '',
  max = 6
}) => {
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 18 });
  const sry = useSpring(ry, { stiffness: 120, damping: 18 });
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={className}
      style={{ perspective: 1400 }}
      onMouseMove={(e) => {
        if (reduce || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        ry.set(px * max * 2);
        rx.set(-py * max * 2);
      }}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      <motion.div style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d' }}>
        {children}
      </motion.div>
    </div>
  );
};
