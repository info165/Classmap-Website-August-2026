import React, { useRef, useState } from 'react';
import { Play, Quote } from 'lucide-react';

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
    <div className="mt-14">
      {/* Same treatment as the "Trusted by Leading Schools" heading above:
          orange pill eyebrow, then a serif heading. */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#FFF0E6] text-[#FF6321] text-[10px] font-bold uppercase tracking-wider mb-2">
          <Quote className="w-3 h-3" />
          <span>Testimonials</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1A1A]">
          Hear It Directly From School Leaders
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* ------------------------------------------------------------ video */}
        <div className="lg:col-span-7">
          <div className="relative overflow-hidden rounded-3xl border border-[#E5E1D6] bg-[#12151C] shadow-[0_20px_50px_-24px_rgba(26,26,26,0.35)]">
            <video
              ref={videoRef}
              src="/video/testimonial.mp4"
              poster="/video/testimonial-poster.jpg"
              preload="none"
              playsInline
              controls={playing}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
              className="w-full h-auto block aspect-video object-cover"
            />

            {/* Bottom-right, not centred: a centred button lands on the
                speaker's face, and bottom-left is taken by her name card. */}
            {!playing && (
              <button
                onClick={start}
                aria-label="Play the testimonial from The Newtown School"
                className="group absolute inset-0 bg-gradient-to-t from-[#12151C]/45 via-transparent to-transparent cursor-pointer"
              >
                {/* Horizontally centred, but dropped below her face and kept
                    clear of the burned-in subtitle line. */}
                <span className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-white/95 backdrop-blur-sm shadow-[0_10px_28px_-10px_rgba(0,0,0,0.55)] transition-transform duration-300 group-hover:scale-105">
                  {/* Nudged right so the triangle looks centred, which it is not
                      when its bounding box is. */}
                  <Play className="h-5 w-5 sm:h-6 sm:w-6 translate-x-0.5 fill-[#FF6321] text-[#FF6321]" />
                </span>
              </button>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------ quote */}
        <div className="lg:col-span-5">
          <Quote className="h-8 w-8 text-[#FFD9C7]" />

          {/* Verbatim from the recording. Do not paraphrase — this is attributed
              to a named principal on a public page. */}
          <blockquote className="mt-4 text-lg sm:text-xl font-serif font-light leading-snug text-[#1A1A1A]">
            What strikes most is how they analyze the child&rsquo;s performance,
            and how each and every child, once he goes through that analysis,
            would be able to improve upon himself, identify his strengths, and
            also work upon the limitations.
          </blockquote>

          <div className="mt-7 pt-6 border-t border-[#EAE7DE] flex items-center gap-5">
            <div className="h-16 w-16 shrink-0 rounded-full bg-white ring-1 ring-inset ring-[#EFEBE1] flex items-center justify-center overflow-hidden">
              <img
                src="/logos/newtown.png"
                alt="The Newtown School logo"
                loading="lazy"
                decoding="async"
                className="h-11 w-auto max-w-[82%] object-contain"
              />
            </div>
            <div>
              <div className="text-lg font-serif font-bold text-[#1A1A1A] leading-snug">
                Mrs. Satabdi Bhattacharjee
              </div>
              <div className="text-sm text-[#77746B] font-medium mt-0.5">
                Principal, The Newtown School, Kolkata
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
