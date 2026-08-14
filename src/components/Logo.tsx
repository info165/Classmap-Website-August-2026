import React, { useEffect, useState } from 'react';
import { firebaseConfig } from '../lib/firebase';
import { getOrSeedStorageUrl } from '../lib/firebaseStorageSync';
/** Mark plus wordmark only — no descriptor line. */
import defaultLogoImg from '../assets/images/logo-original.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  imageUrl?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  imageUrl
}) => {
  // The wordmark is a wide 5.4:1 lockup, so height reads much larger than the
  // number suggests — these sit deliberately below typical logo heights.
  const responsiveHeightClasses = {
    sm: 'h-6 sm:h-7',
    md: 'h-7 sm:h-8',
    lg: 'h-8 sm:h-9 md:h-10',
    xl: 'h-8 sm:h-9 md:h-10 lg:h-11'
  };

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

  return (
    <div className={`inline-flex flex-col items-start shrink-0 select-none ${className}`}>
      <img
        src={displayUrl}
        alt="ClassMap Logo"
        className={`object-contain max-w-full shrink-0 transition-transform duration-300 group-hover:scale-[1.02] ${responsiveHeightClasses[size]}`}
        onError={() => {
          if (displayUrl !== defaultLogoImg) {
            setDisplayUrl(defaultLogoImg);
          }
        }}
      />
    </div>
  );
};

