import React, { useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Clock,
  BookOpen,
} from 'lucide-react';
import { BLOG_POSTS, BlogPost, BlogBlock } from '../data/blogPosts';
import { EASE, Eyebrow, GlowCard, ImageReveal, Reveal, WordReveal } from './ui/primitives';
import { FinalCTA } from './FinalCTA';

interface BlogProps {
  /** Slug from the URL, or null for the listing. Owned by App so that a
   *  refresh, a shared link and the back button all behave. */
  activeSlug: string | null;
  onSelectPost: (slug: string | null) => void;
  onBackToHome: () => void;
  onOpenAudit?: () => void;
}

/** 2026-08-04 -> 4 August 2026 */
const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

/**
 * Cover artwork. Posts without an image get a plain tinted panel, so a missing
 * file reads as deliberate rather than as a hole.
 */
const Cover: React.FC<{ post: BlogPost }> = ({ post }) => {
  if (post.coverImage) {
    return (
      <img
        src={post.coverImage}
        alt={post.coverAlt ?? post.title}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover"
      />
    );
  }

  return <div className="h-full w-full bg-gradient-to-br from-[#FF6321]/25 to-[#0E1016]" />;
};

const CategoryChip: React.FC<{ category: string }> = ({ category }) => (
  <span className="inline-flex items-center rounded-full bg-[#FF6321]/15 px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[#FF8A4C] ring-1 ring-inset ring-[#FF6321]/30">
    {category}
  </span>
);

/**
 * Long-form body copy is set in the serif, not the UI sans. At this length a
 * humanist serif is markedly easier to read and matches the editorial voice of
 * the headings; the sans made four long paragraphs read as one grey slab.
 */
const BlockRenderer: React.FC<{ block: BlogBlock; isLede?: boolean }> = ({
  block,
  isLede,
}) => {
  switch (block.type) {
    case 'heading':
      return (
        <h2 className="pt-10 first:pt-0 font-serif text-[1.7rem] sm:text-[2.1rem] font-medium leading-[1.2] tracking-[-0.02em] text-white">
          {block.text}
        </h2>
      );
    case 'list':
      return (
        <ul className="space-y-4 pl-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-4 font-serif text-[19px] leading-[1.7] text-stone-300">
              <span className="mt-[0.72em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF6321] shadow-[0_0_10px_2px_rgba(255,99,33,0.45)]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case 'quote':
      return (
        <blockquote className="relative my-12 border-l-2 border-[#FF6321] pl-8 font-serif text-[1.65rem] sm:text-[2rem] font-light italic leading-[1.3] tracking-tight text-white">
          <span aria-hidden="true" className="absolute -left-1 -top-8 font-serif text-7xl leading-none text-[#FF6321]/25">
            &ldquo;
          </span>
          {block.text}
        </blockquote>
      );
    case 'stat':
      return (
        <div className="noise relative isolate my-12 flex flex-col gap-5 overflow-hidden rounded-[26px] bg-[#07080C] px-8 py-9 shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_40px_70px_-40px_rgba(255,99,33,0.45)] sm:flex-row sm:items-center sm:gap-8">
          <div aria-hidden="true" className="pointer-events-none absolute -left-10 -top-16 -z-10 h-56 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(255,99,33,0.35),transparent)] blur-2xl" />
          <span className="text-gradient-brand font-sans text-[3.4rem] font-semibold leading-[0.9] tracking-[-0.05em] sm:text-[4.2rem]">
            {block.value}
          </span>
          <span className="text-[15px] leading-relaxed text-stone-300">
            {block.label}
          </span>
        </div>
      );
    case 'image':
      return (
        <figure className="my-12">
          <div className="overflow-hidden rounded-[24px] bg-[#FAF8F3] shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_40px_70px_-40px_rgba(0,0,0,0.9)]">
            <img
              src={block.src}
              alt={block.alt}
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-cover"
            />
          </div>
          {block.caption && (
            <figcaption className="mt-4 text-center text-xs text-stone-500">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    default:
      // Only the opening paragraph differs, and only by its drop cap — size,
      // leading and ink stay identical to every other paragraph.
      return (
        <p
          className={`font-serif text-[19px] leading-[1.8] text-stone-300 ${
            isLede
              ? 'first-letter:float-left first-letter:mr-3.5 first-letter:mt-2 first-letter:text-[68px] first-letter:font-medium first-letter:leading-[0.78] first-letter:text-[#FF6321]'
              : ''
          }`}
        >
          {block.text}
        </p>
      );
  }
};

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

export const Blog: React.FC<BlogProps> = ({ activeSlug, onSelectPost, onBackToHome, onOpenAudit }) => {
  const [filter, setFilter] = useState('All');

  // An unknown slug falls through to the listing rather than erroring, so a
  // stale or mistyped link still lands somewhere useful.
  const post = BLOG_POSTS.find((p) => p.slug === activeSlug) ?? null;

  const openPost = (p: BlogPost) => onSelectPost(p.slug);
  const closePost = () => onSelectPost(null);

  /* ---------------------------------------------------------------- article */
  if (post) {
    const others = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

    return (
      <article className="bg-[#07080C] text-stone-200">
        <div className="relative overflow-hidden">
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-[460px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,99,33,0.2),transparent)] blur-2xl" />

          <div className="relative mx-auto max-w-[760px] px-4 pb-12 pt-32 sm:px-6 sm:pt-40">
            <button
              onClick={closePost}
              className="group mb-10 inline-flex cursor-pointer items-center gap-2 rounded-full bg-white/[0.06] px-4 py-2 text-xs font-semibold text-stone-200 shadow-[0_0_0_1px_rgba(255,255,255,0.1)] transition-all duration-300 hover:-translate-y-px hover:bg-white/[0.1] hover:text-white hover:shadow-[0_0_0_1px_rgba(255,99,33,0.5),0_10px_24px_-10px_rgba(255,99,33,0.45)]"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-[#FF6321] transition-transform duration-300 group-hover:-translate-x-0.5" />
              <span>All articles</span>
            </button>

            <Reveal>
              <CategoryChip category={post.category} />
            </Reveal>

            <h1 className="mt-5 text-balance font-serif text-[2.4rem] font-medium leading-[1.1] tracking-[-0.025em] text-white sm:text-[3.4rem]">
              <WordReveal text={post.title} />
            </h1>

            <Reveal delay={0.2}>
              <p className="mt-6 text-pretty text-lg leading-relaxed text-stone-400 sm:text-xl">{post.excerpt}</p>
            </Reveal>

            <Reveal delay={0.28}>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-white/[0.08] pb-8 text-xs font-medium text-stone-400">
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#FF8A4C] to-[#F0530F] text-[11px] font-semibold text-white shadow-[0_8px_18px_-6px_rgba(255,99,33,0.7)]">
                    {initialsOf(post.author)}
                  </span>
                  <span className="leading-tight">
                    <span className="block text-[13px] font-semibold text-white">{post.author}</span>
                    {post.authorRole && <span className="text-stone-500">{post.authorRole}</span>}
                  </span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#FF6321]" />
                  {formatDate(post.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#FF6321]" />
                  {post.readMinutes} min read
                </span>
              </div>
            </Reveal>
          </div>
        </div>

        {post.coverImage && (
          <Reveal className="mx-auto max-w-5xl px-4 sm:px-6" y={40}>
            {/* 3:2 matches the covers, which are all 1536x1024. A 2:1 frame here
                cropped the top and bottom off every one of them. */}
            <div className="aspect-[3/2] overflow-hidden rounded-[30px] shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_60px_100px_-50px_rgba(0,0,0,0.9),0_30px_60px_-40px_rgba(255,99,33,0.45)]">
              <ImageReveal className="h-full w-full">
                <Cover post={post} />
              </ImageReveal>
            </div>
          </Reveal>
        )}

        <div className="mx-auto max-w-[720px] px-4 pb-16 pt-14 sm:px-6">
          <div className="space-y-7">
            {post.body.map((block, i) => (
              <Reveal key={i} y={16}>
                <BlockRenderer block={block} isLede={i === 0} />
              </Reveal>
            ))}
          </div>

          <div className="mt-16 flex flex-wrap gap-3 border-t border-white/[0.08] pt-8">
            <button
              onClick={onBackToHome}
              className="inline-flex cursor-pointer items-center rounded-full bg-[#FF6321] px-6 py-3 text-xs font-semibold text-white shadow-[0_10px_26px_-8px_rgba(255,99,33,0.7)] transition-colors hover:bg-[#FF7A3D]"
            >
              Back to home
            </button>
            <button
              onClick={closePost}
              className="inline-flex cursor-pointer items-center rounded-full bg-white/[0.06] px-6 py-3 text-xs font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.12)] transition-all hover:bg-white/[0.1] hover:shadow-[0_0_0_1px_rgba(255,99,33,0.5)]"
            >
              All articles
            </button>
          </div>
        </div>

        {others.length > 0 && (
          <div className="border-t border-white/[0.08] bg-[#0A0B10]">
            <div className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8">
              <Reveal>
                <h2 className="mb-10 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-stone-500">
                  Continue reading
                </h2>
              </Reveal>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {others.map((p, i) => (
                  <Reveal key={p.slug} delay={i * 0.08}>
                    <ArticleCard post={p} onOpen={openPost} />
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        )}

        {onOpenAudit && (
          <FinalCTA onOpenAudit={onOpenAudit} onExplore={onBackToHome} exploreLabel="Back to the Overview" />
        )}
      </article>
    );
  }

  /* ---------------------------------------------------------------- listing */
  const categories = ['All', ...Array.from(new Set(BLOG_POSTS.map((p) => p.category)))];
  const visible = filter === 'All' ? BLOG_POSTS : BLOG_POSTS.filter((p) => p.category === filter);
  const [lead, ...rest] = visible;

  return (
    <div className="bg-[#07080C]">
      {/* ---------------------------------------------------------------- hero */}
      <section className="noise relative isolate overflow-hidden bg-[#07080C] pb-28 pt-36 text-white sm:pt-44">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-[8%] top-[-30%] h-[640px] w-[900px] animate-aurora rounded-full bg-[radial-gradient(closest-side,rgba(255,99,33,0.26),rgba(255,99,33,0.05)_60%,transparent)] blur-2xl" />
          <div className="bg-grid-dark absolute inset-0" />
        </div>

        {/* The artwork sits behind the right half and dissolves into the page,
            rather than being a framed picture with decorations around it. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-[-4%] -z-10 hidden w-[58%] items-center justify-center lg:flex [mask-image:radial-gradient(closest-side,#000_45%,transparent)]"
        >
          <img
            src="/blog/hero-brain-book.png"
            alt=""
            className="h-auto w-full max-w-[720px] animate-float opacity-90"
          />
        </div>

        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow tone="dark" icon={<BookOpen className="h-3.5 w-3.5" />}>
                Blog
              </Eyebrow>
            </Reveal>
            <h1 className="mt-7 text-balance text-[2.9rem] font-semibold leading-[0.98] tracking-[-0.05em] sm:text-7xl lg:text-[5.2rem]">
              <WordReveal text="Insights that" wordClassName="text-gradient-light" />
              <br />
              <WordReveal text="advance learning" wordClassName="text-gradient-brand" delay={0.2} />
            </h1>
            <Reveal delay={0.3}>
              <p className="mt-7 max-w-md text-pretty text-base leading-relaxed text-stone-400 sm:text-lg">
                Ideas, perspectives, and real-world stories from the evolving landscape of
                education in India.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* The page slides up over the hero as a sheet. */}
      <div className="relative -mt-12 rounded-t-[44px] bg-[#0B0D13] pt-12 shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_-30px_80px_-30px_rgba(255,99,33,0.3)] sm:pt-16">
        <div className="mx-auto max-w-[1280px] px-4 pb-8 sm:px-6 lg:px-8">
          {BLOG_POSTS.length === 0 ? (
            <p className="py-20 text-sm text-stone-400">
              No articles published yet. Check back shortly.
            </p>
          ) : (
            <>
              {/* Filter */}
              <Reveal className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div
                  role="tablist"
                  aria-label="Filter articles"
                  className="scrollbar-none flex max-w-full gap-1 overflow-x-auto rounded-full bg-white/[0.05] p-1.5 ring-1 ring-inset ring-white/[0.08]"
                >
                  {categories.map((c) => {
                    const selected = filter === c;
                    return (
                      <button
                        key={c}
                        role="tab"
                        aria-selected={selected}
                        onClick={() => setFilter(c)}
                        className={`relative shrink-0 cursor-pointer rounded-full px-4 py-2 text-[13px] font-semibold tracking-tight transition-colors duration-300 ${
                          selected ? 'text-white' : 'text-stone-400 hover:text-white'
                        }`}
                      >
                        {selected && (
                          <motion.span
                            layoutId="blog-filter"
                            transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                            className="absolute inset-0 rounded-full bg-[#FF6321]/90 shadow-[0_8px_24px_-8px_rgba(255,99,33,0.8)]"
                          />
                        )}
                        <span className="relative">{c}</span>
                      </button>
                    );
                  })}
                </div>
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">
                  {visible.length} {visible.length === 1 ? 'article' : 'articles'}
                </span>
              </Reveal>

              <AnimatePresence mode="wait">
                <motion.div
                  key={filter}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="space-y-14"
                >
                  {lead && <CoverStory post={lead} onOpen={openPost} />}

                  {rest.length > 0 && (
                    <div>
                      <div className="mb-6 flex items-center gap-4">
                        <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-stone-500">
                          More stories
                        </h2>
                        <span className="h-px flex-1 bg-white/[0.1]" />
                      </div>
                      <div className="space-y-5">
                        {rest.map((p) => (
                          <StoryRow key={p.slug} post={p} onOpen={openPost} />
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </div>

        {/* The CTA paints its own paper; here it must share the sheet's. */}
        {onOpenAudit && (
          <div className="[&>section]:bg-transparent">
            <FinalCTA
              onOpenAudit={onOpenAudit}
              onExplore={onBackToHome}
              exploreLabel="Back to the Overview"
            />
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Cover story. The picture is the card: the headline sits on it, over a
 * gradient that gives the type something dark to stand on, so the lead reads as
 * one object instead of a picture with a text box attached.
 */
const CoverStory: React.FC<{ post: BlogPost; onOpen: (p: BlogPost) => void }> = ({
  post,
  onOpen,
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  // The picture drifts against the scroll, so the card has depth.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const drift = useTransform(scrollYProgress, [0, 1], ['-7%', '7%']);
  return (
  <Reveal y={40}>
    <button
      ref={ref}
      onClick={() => onOpen(post)}
      className="group relative block min-h-[480px] w-full cursor-pointer overflow-hidden rounded-[34px] bg-[#07080C] text-left shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_60px_100px_-50px_rgba(0,0,0,0.9),0_30px_70px_-50px_rgba(255,99,33,0.5)] sm:min-h-[600px]"
    >
      <motion.div style={{ y: drift, scale: 1.16 }} className="absolute inset-0">
        <div className="h-full w-full transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]">
          <Cover post={post} />
        </div>
      </motion.div>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#07080C] via-[#07080C]/60 to-[#07080C]/5" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#07080C]/70 via-transparent to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-12 lg:p-14">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF6321] px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-white shadow-[0_8px_20px_-6px_rgba(255,99,33,0.8)]">
            Cover story
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-stone-200 backdrop-blur">
            {post.category}
          </span>
        </div>

        <h2 className="mt-6 max-w-4xl text-balance text-[1.9rem] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-5xl">
          {post.title}
        </h2>

        <p className="mt-5 hidden max-w-2xl text-pretty text-base leading-relaxed text-stone-300 md:line-clamp-2">
          {post.excerpt}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-5">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-stone-300">
            <span className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#FF8A4C] to-[#F0530F] text-[10px] font-semibold text-white">
                {initialsOf(post.author)}
              </span>
              <span className="font-semibold text-white">{post.author}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#FF8A4C]" />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#FF8A4C]" />
              {post.readMinutes} min read
            </span>
          </div>

          <span className="inline-flex items-center gap-3 text-sm font-semibold">
            Read article
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#07080C] transition-all duration-500 group-hover:translate-x-1 group-hover:bg-[#FF6321] group-hover:text-white">
              <ArrowRight className="h-4 w-4" />
            </span>
          </span>
        </div>
      </div>
    </button>
  </Reveal>
  );
};

/**
 * A story in the index beneath the cover. Horizontal, so a single remaining
 * post still fills the row instead of sitting alone in a grid, and any number
 * of posts stack evenly.
 */
const StoryRow: React.FC<{ post: BlogPost; onOpen: (p: BlogPost) => void }> = ({
  post,
  onOpen,
}) => (
  <Reveal y={28}>
    <button
      onClick={() => onOpen(post)}
      className="group grid w-full cursor-pointer grid-cols-1 overflow-hidden rounded-[28px] bg-[#0E1016] text-left shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgba(255,99,33,0.4),0_40px_70px_-36px_rgba(255,99,33,0.35)] md:grid-cols-12"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#12141B] md:col-span-5 md:aspect-auto md:min-h-[280px]">
        <div className="absolute inset-0 transition-transform duration-[1000ms] ease-out group-hover:scale-[1.06]">
          <Cover post={post} />
        </div>
      </div>

      <div className="flex flex-col justify-center p-7 sm:p-10 md:col-span-7">
        <div className="flex flex-wrap items-center gap-3">
          <CategoryChip category={post.category} />
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-stone-500">
            {formatDate(post.date)} &middot; {post.readMinutes} min read
          </span>
        </div>

        <h3 className="mt-5 text-balance text-[1.5rem] font-semibold leading-[1.15] tracking-[-0.03em] text-white transition-colors duration-300 group-hover:text-[#FF8A4C] sm:text-[1.9rem]">
          {post.title}
        </h3>

        <p className="mt-4 line-clamp-3 text-[15px] leading-relaxed text-stone-400">{post.excerpt}</p>

        <div className="mt-7 flex items-center justify-between gap-4">
          <span className="flex items-center gap-2.5 text-xs font-medium text-stone-400">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[9px] font-semibold text-white">
              {initialsOf(post.author)}
            </span>
            {post.author}
          </span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF6321]/15 text-[#FF8A4C] transition-all duration-500 group-hover:translate-x-1 group-hover:bg-[#FF6321] group-hover:text-white">
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </button>
  </Reveal>
);

/**
 * The single article card used for every post after the lead, and for the
 * strip beneath an article. Flat at rest with a hairline rim; it lifts on hover
 * and the picture eases in behind a fixed frame.
 */
const ArticleCard: React.FC<{ post: BlogPost; onOpen: (p: BlogPost) => void }> = ({
  post,
  onOpen,
}) => (
  <GlowCard
    glow="rgba(255, 99, 33, 0.12)"
    className="h-full overflow-hidden rounded-[26px] bg-[#0E1016] shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgba(255,99,33,0.4),0_36px_60px_-30px_rgba(255,99,33,0.35)]"
  >
    <button onClick={() => onOpen(post)} className="group flex h-full w-full cursor-pointer flex-col text-left">
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-[#12141B]">
        <div className="absolute inset-0 transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]">
          <Cover post={post} />
        </div>
        <span className="absolute right-3 top-3 flex h-9 w-9 translate-y-1 items-center justify-center rounded-full bg-white/90 text-[#14161C] opacity-0 shadow-lg backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>

      <div className="relative z-10 flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <CategoryChip category={post.category} />
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-stone-500">
            {post.readMinutes} min read
          </span>
        </div>

        <h3 className="mt-4 font-serif text-[1.3rem] font-medium leading-[1.25] tracking-[-0.01em] text-white transition-colors duration-300 group-hover:text-[#FF8A4C]">
          {post.title}
        </h3>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-stone-400">{post.excerpt}</p>

        <div className="mt-6 flex items-center justify-between border-t border-white/[0.08] pt-4 text-xs">
          <span className="font-medium text-stone-500">{formatDate(post.date)}</span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-[#FF8A4C]">
            Read
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </button>
  </GlowCard>
);
