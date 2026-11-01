import React, { useEffect, useState } from 'react';
import { firebaseConfig } from '../lib/firebase';
import { getOrSeedStorageUrl } from '../lib/firebaseStorageSync';
/**
 * The mark on its own — it carries no wordmark, so the name is set as live text
 * beside it rather than baked into the artwork. That keeps it selectable, sharp
 * at every size, and translatable.
 */
import defaultLogoImg from '../assets/images/logo-mark-new.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  imageUrl?: string;
  /** Hide the name, e.g. where a custom full lockup has been uploaded. */
  showWordmark?: boolean;
}

/* The mark is roughly square, so its height reads much smaller than the old
   5.4:1 lockup did at the same value — these run a step taller to compensate.
   The name is sized at about 0.7x the mark, the ratio the previous lockup used
   between its wordmark and its symbol. */
const SIZES = {
  sm: { mark: 'h-7 sm:h-8', text: 'text-base sm:text-lg', weight: 'font-bold' },
  // The header sets the name larger and at 800. Against this mark it read
  // undersized and light at 700; the footer, which is already larger, keeps 700.
  md: { mark: 'h-8 sm:h-9', text: 'text-2xl sm:text-[28px]', weight: 'font-extrabold' },
  lg: { mark: 'h-9 sm:h-10 md:h-11', text: 'text-xl sm:text-2xl', weight: 'font-bold' },
  xl: { mark: 'h-9 sm:h-10 md:h-11 lg:h-12', text: 'text-xl sm:text-2xl md:text-[26px]', weight: 'font-bold' },
};

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  imageUrl,
  showWordmark = true
}) => {
  const [displayUrl, setDisplayUrl] = useState<string>(imageUrl || defaultLogoImg);

  useEffect(() => {
    if (imageUrl) {
      setDisplayUrl(imageUrl);
      return;
    }

    let isMounted = true;

    // Listen for instant logo update events from UI uploads
    const handleLogoUpdate = (e: Event) => {
      const customEv = e as CustomEvent<{ url: string }>;
      if (customEv.detail?.url && isMounted) {
        setDisplayUrl(customEv.detail.url);
      }
    };

    window.addEventListener('classmap-logo-updated', handleLogoUpdate);

    // Seed/Fetch company logo from Firebase Storage
    getOrSeedStorageUrl('logos/company-logo.png', defaultLogoImg)
      .then((url) => {
        if (isMounted && url) {
          setDisplayUrl(url);
        }
      })
      .catch(() => {
        if (isMounted) {
          setDisplayUrl(defaultLogoImg);
        }
      });

    return () => {
      isMounted = false;
      window.removeEventListener('classmap-logo-updated', handleLogoUpdate);
    };
  }, [imageUrl]);

  const s = SIZES[size];

  return (
    <div className={`inline-flex items-center gap-2 sm:gap-2.5 shrink-0 select-none ${className}`}>
      {/* Decorative: the name sits in the text beside it, so announcing the
          image too would read the brand out twice. */}
      <img
        src={displayUrl}
        alt=""
        aria-hidden="true"
        className={`w-auto object-contain shrink-0 transition-transform duration-300 group-hover:-rotate-[8deg] group-hover:scale-[1.1] ${s.mark}`}
        onError={() => {
          if (displayUrl !== defaultLogoImg) {
            setDisplayUrl(defaultLogoImg);
          }
        }}
      />
      {showWordmark && (
        <span
          className={`font-sans tracking-[-0.02em] text-[#FF6321] leading-none ${s.weight} ${s.text}`}
        >
          ClassMap
        </span>
      )}
    </div>
  );
};
