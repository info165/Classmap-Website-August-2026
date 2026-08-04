import React from 'react';
import { Building2, ShieldCheck } from 'lucide-react';

export const PartnerSchools: React.FC = () => {
  // Institutional Partners.
  // Logos are served from public/logos/. They are trimmed to their artwork and
  // exported at 240px tall, so every crest lands at the same optical size on the
  // white plate below. Masters live in ss/, which is not committed.
  const institutionalPartners = [
    {
      id: 'dbse',
      fullName: 'Delhi Board of School Education',
      subTitle: 'Govt. of NCT Delhi',
      tag: 'State Board Partner',
      logo: '/logos/dbse.png'
    },
    {
      id: 'iit-m',
      fullName: 'IIT Madras',
      subTitle: 'Academic & Research Partner',
      tag: 'Institute of Eminence',
      logo: '/logos/iit-madras.png'
    },
    {
      id: 'moe',
      fullName: 'Ministry of Education',
      subTitle: 'Government of India',
      tag: 'National Alignment',
      logo: '/logos/ministry-of-education.png'
    },
    {
      id: 'bodhan',
      fullName: 'Bodhan AI',
      subTitle: 'Cognitive AI Research',
      tag: 'Learning Gap Intelligence',
      logo: '/logos/bodhan-ai.png'
    }
  ];

  // Real Partner Schools & Coaching Institutes
  const partnerInstitutions = [
    {
      name: 'Siddhartha Public School',
      subtitle: 'Hyderabad, Telangana',
      badge: 'CBSE Affiliated'
    },
    {
      name: 'DPS Howrah',
      subtitle: 'Delhi Public School, Howrah',
      badge: 'CBSE'
    },
    {
      name: 'B.D. Memorial International',
      subtitle: 'Kolkata, West Bengal',
      badge: 'CBSE / International'
    },
    {
      name: 'The Newtown School',
      subtitle: 'Kolkata, West Bengal',
      badge: 'IGCSE & CBSE'
    },
    {
      name: 'St. Thomas School',
      subtitle: 'New Delhi / Eastern Region',
      badge: 'ICSE / CBSE'
    },
    {
      name: 'Khaitan Public School',
      subtitle: 'NCR / Ghaziabad',
      badge: 'CBSE'
    }
  ];

  return (
    <section id="partners" className="py-16 bg-[#FAF9F6] border-y border-[#EAE7DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* 1. TRUSTED BY GOVERNMENT & ACADEMIC INSTITUTIONS */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E0DDD3] shadow-xs relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3 pb-4 border-b border-[#F0ECE1]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF6321]" />
              <h2 className="text-xs uppercase tracking-widest font-bold text-[#66635B]">
                Institutional Alignment & Partnerships
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-[#88857B] bg-[#F4F2EC] px-3 py-1 rounded-full border border-[#E5E2D8]">
              Official Academic & Government Bodies
            </span>
          </div>

          {/* Clean Institutional Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {institutionalPartners.map((item) => (
              <div
                key={item.id}
                className="relative rounded-2xl p-5 bg-[#FDFBF7] border border-[#E8E5DA] hover:border-[#FF6321]/40 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-12px_rgba(26,26,26,0.18)] transition-all duration-300 flex flex-col group cursor-default"
              >
                {/* Logo plate. Pure white regardless of the card tint, so every
                    crest keeps its own colours at full contrast. */}
                <div className="mb-4 flex h-28 items-center justify-center rounded-xl bg-white ring-1 ring-inset ring-[#EFEBE1]">
                  <img
                    src={item.logo}
                    alt={`${item.fullName} logo`}
                    loading="lazy"
                    decoding="async"
                    className="h-20 w-auto max-w-[85%] object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <span className="self-start text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-[#F3F0E6] text-[#555248] border border-[#E2DFD4]">
                  {item.tag}
                </span>

                <h3 className="mt-3 text-base font-serif font-bold text-[#1A1A1A] group-hover:text-[#FF6321] transition-colors leading-snug">
                  {item.fullName}
                </h3>
                <p className="text-xs font-medium text-[#77746B] mt-1">
                  {item.subTitle}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. PARTNER SCHOOLS & COACHING INSTITUTES */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#FFF0E6] text-[#FF6321] text-[10px] font-bold uppercase tracking-wider mb-2">
                <Building2 className="w-3 h-3" />
                <span>Partner Educational Institutions</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1A1A]">
                Trusted by Leading Schools & Coaching Institutes
              </h2>
            </div>
            <p className="text-xs text-[#66635B] max-w-md">
              Over <span className="font-bold text-[#1A1A1A]">8,000+ students</span> across forward-thinking K-12 schools and test prep coaching centres are evaluated using ClassMap learning gap intelligence.
            </p>
          </div>

          {/* Clean Partner School Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {partnerInstitutions.map((inst, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-[#E2DFD4] shadow-2xs hover:shadow-md hover:border-[#FF6321]/40 transition-all flex flex-col justify-between group space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-base font-serif font-bold text-[#1A1A1A] group-hover:text-[#FF6321] transition-colors leading-snug">
                      {inst.name}
                    </h3>
                    <p className="text-xs text-[#77746B] mt-1 font-medium">{inst.subtitle}</p>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-[#F4F2EC] text-[#66635B] flex items-center justify-center shrink-0 border border-[#E2DFD4]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="pt-2 border-t border-[#F4F2EC] flex items-center justify-between">
                  <span className="inline-block px-3 py-1 rounded-md bg-[#F4F2EC] text-[10px] font-semibold text-[#555248] border border-[#E2DFD4]">
                    {inst.badge}
                  </span>
                  <span className="text-[11px] font-bold text-[#FF6321] opacity-0 group-hover:opacity-100 transition-opacity">
                    ClassMap Partner &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

