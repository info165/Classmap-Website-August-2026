import React, { useState } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star, Building2, Award } from 'lucide-react';
import { PRINCIPAL_TESTIMONIALS } from '../data/mockData';

const AvatarImage: React.FC<{ src: string; name: string }> = ({ src, name }) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    return (
      <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-[#FFF0E6] text-[#FF6321] border-2 border-[#FF6321] shadow-md mx-auto flex items-center justify-center font-bold font-serif text-3xl">
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-2 border-[#FF6321] shadow-md mx-auto"
      referrerPolicy="no-referrer"
      onError={() => setError(true)}
    />
  );
};

export const Testimonials: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  const current = PRINCIPAL_TESTIMONIALS[activeIdx];

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % PRINCIPAL_TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + PRINCIPAL_TESTIMONIALS.length) % PRINCIPAL_TESTIMONIALS.length);
  };

  return (
    <section className="py-24 bg-[#FDFCFB] border-t border-[#EAE7DE]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF0E6] text-[#FF6321] text-xs font-bold uppercase tracking-widest">
            <Award className="w-3.5 h-3.5" />
            <span>Voices of Academic Leadership</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-[#1A1A1A] tracking-tight">
            Trusted by School Leadership
          </h2>

          <p className="text-base sm:text-lg text-[#555] font-normal leading-relaxed">
            Leading schools across India are replacing generic report cards with ClassMap Learning Gap Intelligence.
          </p>
        </div>

        {/* Testimonials Carousel Container */}
        <div className="bg-white rounded-3xl border border-[#EEE] p-8 sm:p-12 shadow-xl relative overflow-hidden max-w-5xl mx-auto">
          <div className="absolute top-6 right-8 text-[#FAF3EE]">
            <Quote className="w-24 h-24 text-[#FFF0E6]" />
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Image & Badge */}
            <div className="md:col-span-4 text-center">
              <div className="relative inline-block">
                <AvatarImage src={current.avatar} name={current.name} />
                <div className="absolute -bottom-2 right-0 bg-[#1A1A1A] text-white px-2.5 py-1 rounded-md text-[10px] font-bold font-mono">
                  {current.stats}
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-base font-serif font-semibold text-[#1A1A1A]">{current.name}</h3>
                <p className="text-xs text-[#FF6321] font-semibold">{current.title}</p>
                <p className="text-xs text-[#706E66] mt-0.5">{current.school}</p>
              </div>
            </div>

            {/* Right Quote Content */}
            <div className="md:col-span-8 space-y-6">
              <div className="flex items-center gap-1 text-[#FF6321]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>

              <blockquote className="text-lg sm:text-xl font-serif text-[#1A1A1A] italic leading-relaxed">
                "{current.quote}"
              </blockquote>

              <div className="flex items-center justify-between pt-4 border-t border-[#F0ECE1]">
                <div className="flex items-center gap-2">
                  {PRINCIPAL_TESTIMONIALS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveIdx(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        activeIdx === idx ? 'w-8 bg-[#FF6321]' : 'w-2 bg-[#E0DDD3]'
                      }`}
                      aria-label={`Go to testimonial ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="p-2.5 rounded-full border border-[#E0DDD3] text-[#1A1A1A] hover:bg-[#FAF8F3] transition-colors cursor-pointer"
                    aria-label="Previous Testimonial"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-2.5 rounded-full border border-[#E0DDD3] text-[#1A1A1A] hover:bg-[#FAF8F3] transition-colors cursor-pointer"
                    aria-label="Next Testimonial"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
