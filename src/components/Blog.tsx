import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  PenLine,
  BarChart3,
  GraduationCap,
  Users,
  FileText,
  BookOpen,
} from 'lucide-react';
import { BLOG_POSTS, BlogPost, BlogBlock } from '../data/blogPosts';

interface BlogProps {
  /** Slug from the URL, or null for the listing. Owned by App so that a
   *  refresh, a shared link and the back button all behave. */
  activeSlug: string | null;
  onSelectPost: (slug: string | null) => void;
  onBackToHome: () => void;
}

/** 2026-08-04 -> 4 August 2026 */
const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

/**
 * Card tints, assigned per category so the recent-insights row reads as a set of
 * distinct topics. Unknown categories fall back to the brand tint rather than
 * going uncoloured.
 */
const CATEGORY_THEMES: Record<string, { bg: string; border: string; text: string; chip: string }> = {
  assessment: {
    bg: 'bg-[#FFF6F0]',
    border: 'border-[#F6DFCF]',
    text: 'text-[#C9541C]',
    chip: 'bg-[#FDE4D3] text-[#C9541C]',
  },
  teaching: {
    bg: 'bg-[#F6F4FF]',
    border: 'border-[#E0DAF6]',
    text: 'text-[#6D53C4]',
    chip: 'bg-[#E5DEFB] text-[#6D53C4]',
  },
  'learning design': {
    bg: 'bg-[#F1F9F3]',
    border: 'border-[#D5E9DA]',
    text: 'text-[#2F7D4C]',
    chip: 'bg-[#DCEFE1] text-[#2F7D4C]',
  },
  policy: {
    bg: 'bg-[#F2F7FD]',
    border: 'border-[#D8E5F4]',
    text: 'text-[#2C6BAF]',
    chip: 'bg-[#DDEAF8] text-[#2C6BAF]',
  },
};

const themeFor = (category: string) =>
  CATEGORY_THEMES[category.toLowerCase()] ?? CATEGORY_THEMES.assessment;

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

  const theme = themeFor(post.category);
  return (
    <div className={`w-full h-full ${theme.bg} bg-gradient-to-br from-white/40 to-transparent`} />
  );
};

/** Small floating glyph ringed in white, echoing the hero artwork. */
const FloatingIcon: React.FC<{
  icon: React.ElementType;
  className: string;
}> = ({ icon: Icon, className }) => (
  <div
    className={`absolute hidden sm:flex h-11 w-11 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border border-white shadow-[0_6px_18px_-6px_rgba(26,26,26,0.18)] ${className}`}
  >
    <Icon className="h-4.5 w-4.5 text-[#C9541C]" />
  </div>
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
        <h2 className="pt-8 first:pt-0 font-serif text-2xl sm:text-[28px] font-medium leading-snug tracking-tight text-[#1A1A1A]">
          {block.text}
        </h2>
      );
    case 'list':
      return (
        <ul className="space-y-3.5 pl-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-4 font-serif text-[19px] leading-[1.7] text-[#33302A]">
              <span className="mt-[0.72em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF6321]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case 'quote':
      return (
        <blockquote className="my-10 border-l-2 border-[#FF6321] pl-7 font-serif text-[26px] sm:text-[30px] font-light leading-[1.3] tracking-tight text-[#1A1A1A]">
          {block.text}
        </blockquote>
      );
    case 'stat':
      return (
        <div className="my-10 flex gap-6 rounded-2xl border border-[#F2D5C4] bg-gradient-to-b from-[#FFF9F5] to-[#FFF1E8] px-7 py-7">
          <span className="font-serif text-[44px] sm:text-[52px] font-medium leading-[0.9] text-[#FF6321]">
            {block.value}
          </span>
          <span className="self-center text-sm leading-relaxed text-[#5C5749]">
            {block.label}
          </span>
        </div>
      );
    case 'image':
      return (
        <figure className="my-10">
          <div className="overflow-hidden rounded-2xl border border-[#E5E1D6] bg-[#FAF8F3]">
            <img
              src={block.src}
              alt={block.alt}
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-cover"
            />
          </div>
          {block.caption && (
            <figcaption className="mt-3 text-xs text-[#8A8578] text-center">
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
          className={`font-serif text-[19px] leading-[1.75] text-[#33302A] ${
            isLede
              ? 'first-letter:float-left first-letter:mr-3.5 first-letter:mt-2 first-letter:text-[62px] first-letter:font-medium first-letter:leading-[0.78] first-letter:text-[#FF6321]'
              : ''
          }`}
        >
          {block.text}
        </p>
      );
  }
};

export const Blog: React.FC<BlogProps> = ({ activeSlug, onSelectPost, onBackToHome }) => {
  // An unknown slug falls through to the listing rather than erroring, so a
  // stale or mistyped link still lands somewhere useful.
  const post = BLOG_POSTS.find((p) => p.slug === activeSlug) ?? null;

  const openPost = (p: BlogPost) => onSelectPost(p.slug);
  const closePost = () => onSelectPost(null);

  /* ---------------------------------------------------------------- article */
  if (post) {
    const others = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

    return (
      <article className="bg-[#FDFCFB] animate-in fade-in duration-300">
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
          {/* Lit-surface pill, same language as the header controls: warm
              gradient, hairline rim, inset top highlight, lifts on hover. */}
          <button
            onClick={closePost}
            className="group inline-flex items-center gap-2 mb-10 px-4 py-2 rounded-full border border-[#F2D5C4] bg-gradient-to-b from-white to-[#FFF4EC] text-xs font-semibold text-[#C9541C] shadow-[0_1px_2px_rgba(26,26,26,0.05),inset_0_1px_0_#ffffff] hover:-translate-y-px hover:border-[#FFB68F] hover:text-[#FF6321] hover:shadow-[0_2px_4px_rgba(26,26,26,0.05),0_8px_18px_-8px_rgba(255,99,33,0.45),inset_0_1px_0_#ffffff] transition-all duration-300 ease-out cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#FF6321] transition-transform duration-300 group-hover:-translate-x-0.5" />
            <span>All articles</span>
          </button>

          <h1 className="text-[34px] sm:text-[44px] font-serif font-medium text-[#1A1A1A] leading-[1.15] tracking-tight">
            {post.title}
          </h1>

          <p className="mt-5 text-lg text-[#5C5749] leading-relaxed">{post.excerpt}</p>

          <div className="mt-7 pb-8 border-b border-[#EAE7DE] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#77746B] font-medium">
            <span className="flex items-center gap-1.5">
              <PenLine className="w-3.5 h-3.5 text-[#FF6321]" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#FF6321]" />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#FF6321]" />
              {post.readMinutes} min read
            </span>
          </div>
        </div>

        {post.coverImage && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="overflow-hidden rounded-3xl border border-[#E5E1D6] aspect-[16/8]">
              <Cover post={post} />
            </div>
          </div>
        )}

        <div className="max-w-[720px] mx-auto px-4 sm:px-6 pt-12 pb-16">
          <div className="space-y-7">
            {post.body.map((block, i) => (
              <BlockRenderer key={i} block={block} isLede={i === 0} />
            ))}
          </div>

          <div className="mt-14 pt-8 border-t border-[#EAE7DE] flex flex-wrap gap-3">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center px-5 py-2.5 rounded-full border border-[#F2D5C4] bg-gradient-to-b from-white to-[#FFF4EC] text-xs font-bold text-[#C9541C] shadow-[0_1px_2px_rgba(26,26,26,0.05),inset_0_1px_0_#ffffff] hover:-translate-y-px hover:border-[#FFB68F] hover:text-[#FF6321] hover:shadow-[0_2px_4px_rgba(26,26,26,0.05),0_8px_18px_-8px_rgba(255,99,33,0.45),inset_0_1px_0_#ffffff] transition-all duration-300 ease-out cursor-pointer"
            >
              Back to home
            </button>
          </div>
        </div>

        {others.length > 0 && (
          <div className="border-t border-[#EAE7DE] bg-[#FAF8F3]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
              <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-[#8A8578] mb-8">
                Continue reading
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {others.map((p) => (
                  <ArticleCard key={p.slug} post={p} onOpen={openPost} />
                ))}
              </div>
            </div>
          </div>
        )}
      </article>
    );
  }

  /* ---------------------------------------------------------------- listing */
  const [featured, ...rest] = BLOG_POSTS;

  return (
    <div className="bg-[#FDFCFB] animate-in fade-in duration-300">
      {/* ---------------------------------------------------------------- hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FFFDFB] via-[#FFF4EC] to-[#FFE7D6]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10 sm:pt-16 sm:pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-[40px] sm:text-[56px] font-serif font-normal text-[#1A1A1A] leading-[1.08] tracking-tight">
                Insights that
                <br />
                advance learning
              </h1>
              <p className="mt-5 text-base sm:text-lg text-[#5C5749] leading-relaxed max-w-md">
                Ideas, perspectives, and real-world stories from the evolving landscape of
                education in India.
              </p>
            </div>

            <div className="relative">
              <img
                src="/blog/hero-brain-book.png"
                alt="An open book with a glowing network of ideas rising from its pages"
                className="w-full max-w-lg mx-auto h-auto"
              />
              <FloatingIcon icon={BarChart3} className="top-[12%] left-[6%]" />
              <FloatingIcon icon={GraduationCap} className="top-[2%] right-[12%]" />
              <FloatingIcon icon={Users} className="top-[38%] left-[-2%]" />
              <FloatingIcon icon={FileText} className="top-[32%] right-[2%]" />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {BLOG_POSTS.length === 0 ? (
          <p className="py-20 text-sm text-[#77746B]">
            No articles published yet. Check back shortly.
          </p>
        ) : (
          <>
            {/* ------------------------------------------------------ featured */}
            {/* Lead article. The picture takes five columns of twelve, which
                leaves the headline a wide enough measure to break in three
                lines instead of five, and keeps the image from towering. */}
            <button
              onClick={() => openPost(featured)}
              className="group mt-10 block w-full max-w-5xl overflow-hidden rounded-2xl border border-[#E8E4DA] bg-white text-left transition-all duration-300 ease-out cursor-pointer hover:-translate-y-1 hover:border-[#D6CFC0] hover:shadow-[0_26px_54px_-30px_rgba(26,26,26,0.3)]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="relative lg:col-span-5 aspect-[16/10] lg:aspect-auto overflow-hidden bg-[#F5F1EA]">
                  <div className="absolute inset-0 transition-transform duration-[650ms] ease-out group-hover:scale-[1.05]">
                    <Cover post={featured} />
                  </div>
                </div>

                <div className="lg:col-span-7 flex flex-col justify-center p-8 sm:p-10">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9A9488]">
                    {formatDate(featured.date)} &middot; {featured.readMinutes} min read
                  </div>

                  <h2 className="mt-4 font-serif text-2xl sm:text-[28px] font-medium leading-[1.22] tracking-tight text-[#1A1A1A] transition-colors group-hover:text-[#FF6321]">
                    {featured.title}
                  </h2>

                  <p className="mt-4 text-[15px] leading-relaxed text-[#66635B]">
                    {featured.excerpt}
                  </p>

                  <span className="mt-7 inline-flex items-center gap-2 text-xs font-bold text-[#FF6321]">
                    Read article
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </button>

            {rest.length > 0 && (
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                {rest.map((p) => (
                  <ArticleCard key={p.slug} post={p} onOpen={openPost} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

/**
 * The single article card used everywhere — the listing and the strip beneath
 * an article. Flat at rest with a hairline rim; it lifts on hover and the
 * picture eases in behind a fixed frame. Resting drop shadows are what make a
 * card look like a stock template.
 */
const ArticleCard: React.FC<{ post: BlogPost; onOpen: (p: BlogPost) => void }> = ({
  post,
  onOpen,
}) => (
  <button
    onClick={() => onOpen(post)}
    className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[#E8E4DA] bg-white text-left transition-all duration-300 ease-out cursor-pointer hover:-translate-y-1 hover:border-[#D6CFC0] hover:shadow-[0_22px_46px_-26px_rgba(26,26,26,0.3)]"
  >
    <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-[#F5F1EA]">
      <div className="absolute inset-0 transition-transform duration-[650ms] ease-out group-hover:scale-[1.06]">
        <Cover post={post} />
      </div>
    </div>

    <div className="flex flex-1 flex-col p-6">
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9A9488]">
        {formatDate(post.date)} &middot; {post.readMinutes} min read
      </div>

      <h3 className="mt-3 font-serif text-xl font-medium leading-[1.25] tracking-tight text-[#1A1A1A] transition-colors group-hover:text-[#FF6321]">
        {post.title}
      </h3>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-[#66635B]">{post.excerpt}</p>

      <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-[#FF6321]">
        Read article
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </div>
  </button>
);
