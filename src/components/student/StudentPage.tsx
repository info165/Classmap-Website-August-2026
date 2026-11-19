import React, { useEffect, useRef } from 'react';
import html from './page/body.html?raw';
import css from './page/page.css?raw';
import props from './page/props.css?raw';
import { mount } from './page/studentPage.js';

/**
 * The For Students page.
 *
 * It is a standalone, light-themed page (white and peach, serif headings) with
 * its own styles and scripts. It runs inside a shadow root, so its CSS cannot
 * touch the rest of the site and the site's CSS cannot touch it. The site's own
 * header and footer stay; the page's header and footer are left out.
 */

const FONTS =
  'https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..700&family=Geist:wght@300..800&family=Geist+Mono:wght@400..600&family=Caveat:wght@500..700&display=swap';

/** Things a shadow root cannot hold: web fonts and registered custom properties. */
function ensureDocumentAssets() {
  if (!document.getElementById('student-page-fonts')) {
    const link = document.createElement('link');
    link.id = 'student-page-fonts';
    link.rel = 'stylesheet';
    link.href = FONTS;
    document.head.appendChild(link);
  }
  if (!document.getElementById('student-page-props')) {
    const style = document.createElement('style');
    style.id = 'student-page-props';
    style.textContent = props;
    document.head.appendChild(style);
  }
}

interface StudentPageProps {
  /** Tells the app when the page is on screen, so the footer waits for it. */
  onReady?: (ready: boolean) => void;
}

export const StudentPage: React.FC<StudentPageProps> = ({ onReady }) => {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    ensureDocumentAssets();
    const root = host.shadowRoot ?? host.attachShadow({ mode: 'open' });
    root.innerHTML = `<style>${css}</style>${html}`;
    host.classList.add('js');
    const stop = mount(root, host);
    onReady?.(true);
    return () => {
      onReady?.(false);
      stop();
      root.innerHTML = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={hostRef} className="min-h-screen bg-[#FFFAF6]" />;
};
