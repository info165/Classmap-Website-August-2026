import React, { useRef, useState } from 'react';
import { Play, Quote } from 'lucide-react';
import { Reveal } from './ui/primitives';

/**
 * Video testimonial.
 *
 * The poster is a still lifted from a pause in the recording, so nothing is
 * downloaded until the visitor presses play — `preload="none"` keeps the 4MB
 * file off the initial page load entirely.
 */
export const VideoTestimonial: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const start = () => {
    setPlaying(true);
    // Let React paint the controls before asking the element to play.
    requestAnimationFrame(() => videoRef.current?.play());
  };

  return (
    <Reveal className="mt-24 sm:mt-32">
      <div className="noise relative isolate overflow-hidden rounded-[36px] bg-[#0A0B10] p-5 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_60px_100px_-40px_rgba(26,26,26,0.6)] sm:p-8 lg:p-10">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 -z-10 h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(255,99,33,0.25),transparent)] blur-2xl" />

        <div className="mb-8 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#FF8A4C]">
          <Quote className="h-3.5 w-3.5" />
          Hear it directly from school leaders
        </div>

        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* ----------------------------------------------------------- video */}
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-3xl bg-[#12151C] shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_40px_80px_-30px_rgba(0,0,0,0.9)]">
              <video
                ref={videoRef}
                src="/video/testimonial.mp4"
                poster="/video/testimonial-poster.jpg"
                preload="none"
                playsInline
                controls={playing}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
                className="block aspect-video h-auto w-full object-cover"
              />

              {/* Horizontally centred, but dropped below her face and kept
                  clear of the burned-in subtitle line. */}
              {!playing && (
                <button
                  onClick={start}
                  aria-label="Play the testimonial from The Newtown School"
                  className="group absolute inset-0 cursor-pointer bg-gradient-to-t from-[#07080C]/55 via-transparent to-transparent"
                >
                  <span className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2">
                    {/* Expanding ring */}
                    <span className="absolute inset-0 animate-pulse-ring rounded-full bg-white/40" />
                    <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-[0_14px_40px_-8px_rgba(0,0,0,0.7)] backdrop-blur-sm transition-transform duration-500 group-hover:scale-110 sm:h-[72px] sm:w-[72px]">
                      {/* Nudged right so the triangle looks centred, which it
                          is not when its bounding box is. */}
                      <Play className="h-6 w-6 translate-x-0.5 fill-[#FF6321] text-[#FF6321] sm:h-7 sm:w-7" />
                    </span>
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* ----------------------------------------------------------- quote */}
          <div className="lg:col-span-5">
            <Quote className="h-9 w-9 text-[#FF6321]/70" />

            {/* Verbatim from the recording. Do not paraphrase — this is
                attributed to a named principal on a public page. */}
            <blockquote className="mt-5 font-serif text-xl font-light leading-snug tracking-tight text-stone-100 sm:text-[1.65rem]">
              What strikes most is how they analyze the child&rsquo;s performance,
              and how each and every child, once he goes through that analysis,
              would be able to improve upon himself, identify his strengths, and
              also work upon the limitations.
            </blockquote>

            <div className="mt-8 flex items-center gap-4 border-t border-white/[0.09] pt-6">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_0_0_4px_rgba(255,255,255,0.06)]">
                <img
                  src="/logos/newtown.png"
                  alt="The Newtown School logo"
                  loading="lazy"
                  decoding="async"
                  className="h-11 w-auto max-w-[82%] object-contain"
                />
              </div>
              <div>
                <div className="text-lg font-semibold leading-snug tracking-tight text-white">
                  Mrs. Satabdi Bhattacharjee
                </div>
                <div className="mt-0.5 text-sm text-stone-400">
                  Principal, The Newtown School, Kolkata
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
};
