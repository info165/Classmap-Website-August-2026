import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { firebaseConfig } from '../lib/firebase';
import { getOrSeedStorageUrl } from '../lib/firebaseStorageSync';
import defaultLogoImg from '../assets/images/logo-horizontal.svg';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  imageUrl?: string;
  showTagline?: boolean;
  showTaglineOnMobile?: boolean;
  variant?: 'light' | 'dark';
  taglineClassName?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  imageUrl,
  showTagline = true,
  showTaglineOnMobile = false,
  variant = 'light',
  taglineClassName = ''
}) => {
  const responsiveHeightClasses = {
    sm: 'h-7 sm:h-8',
    md: 'h-8 sm:h-10',
    lg: 'h-9 sm:h-12 md:h-14',
    xl: 'h-8 sm:h-11 md:h-14 lg:h-16'
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

  const pillStyle = variant === 'dark'
    ? 'bg-[#222736] border border-[#FF6321]/35 text-[#FF6321]'
    : 'bg-[#FFF0E6] border border-[#FF6321]/25 text-[#FF6321]';

  const sizeClasses = size === 'sm' || size === 'md'
    ? 'px-2.5 py-0.5 text-[10px]'
    : 'px-3 py-1 text-[11px]';

  const taglineVisibilityClass = showTaglineOnMobile
    ? 'inline-flex'
    : 'hidden md:inline-flex';

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
      {showTagline && (
        <div className={`items-center gap-1.5 rounded-full font-bold tracking-tight mt-1 sm:mt-1.5 ${pillStyle} ${sizeClasses} ${taglineVisibilityClass} ${taglineClassName}`}>
          <Sparkles className="w-3 h-3 text-[#FF6321] shrink-0" />
          <span>Building India’s Learning Intelligence Infrastructure</span>
        </div>
      )}
    </div>
  );
};

