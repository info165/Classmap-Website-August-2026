import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PartnerSchools } from './components/PartnerSchools';
import { HandwrittenEvaluator } from './components/HandwrittenEvaluator';
import { PhilosophySection } from './components/PhilosophySection';
import { ProductShowcase } from './components/ProductShowcase';
import { TargetUsers } from './components/TargetUsers';
import { TrustAndSecurity } from './components/TrustAndSecurity';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { Blog } from './components/Blog';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';
import { BookAuditModal } from './components/BookAuditModal';
import { WebsiteBillingModal } from './components/WebsiteBillingModal';
import { PortalIframe } from './components/PortalIframe';
import { Sparkles, ArrowRight, BrainCircuit, BarChart3, Search, ShieldCheck } from 'lucide-react';

type Tab = 'home' | 'learning-gap' | 'privacy' | 'blog';

/**
 * Every tab owns a URL. Previously only the blog pushed history, so switching
 * away from it left /blog in the address bar and a refresh snapped back to the
 * blog. Tab and path now move together in both directions.
 */
const TAB_PATHS: Record<Tab, string> = {
  home: '/',
  'learning-gap': '/diagnostic-engine',
  privacy: '/privacy-policy',
  blog: '/blog'
};

const pathToTab = (path: string): Tab => {
  if (path === TAB_PATHS['learning-gap']) return 'learning-gap';
  if (path === TAB_PATHS.privacy) return 'privacy';
  if (path === '/blog' || path.startsWith('/blog/')) return 'blog';
  return 'home';
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<Tab>('home');
  const [activePortal, setActivePortal] = useState<'teachers' | 'students' | 'admin' | null>(null);
  /** Slug of the open article, or null for the blog listing. */
  const [blogSlug, setBlogSlug] = useState<string | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginRole, setLoginRole] = useState<'teacher' | 'student' | 'admin'>('teacher');
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [websiteBillingModalOpen, setWebsiteBillingModalOpen] = useState(false);

  useEffect(() => {
    /**
     * Single source of truth for what the URL means. Runs on first paint and on
     * every back/forward, so a refresh or a shared link lands on the right view
     * instead of falling back to the homepage.
     */
    const checkPath = () => {
      // Keep the raw pathname around: slugs must match the data with their
      // original casing, even though routes are compared lowercased.
      const raw = window.location.pathname.replace(/\/+$/, '');
      const path = raw.toLowerCase() || '/';

      if (path === '/teachers' || path === '/students' || path === '/admin') {
        setActivePortal(path.slice(1) as 'teachers' | 'students' | 'admin');
        return;
      }
      setActivePortal(null);

      setCurrentTab(pathToTab(path));
      setBlogSlug(path.startsWith('/blog/') ? raw.slice('/blog/'.length) : null);
    };

    checkPath();
    window.addEventListener('popstate', checkPath);
    return () => window.removeEventListener('popstate', checkPath);
  }, []);

  /** Navigate within the blog, keeping the URL in step. */
  const handleSelectPost = (slug: string | null) => {
    window.history.pushState({}, '', slug ? `/blog/${slug}` : '/blog');
    setBlogSlug(slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /** The only way to change tab. Keeps the URL and the view in lockstep. */
  const navigateToTab = (tab: Tab) => {
    window.history.pushState({}, '', TAB_PATHS[tab]);
    setCurrentTab(tab);
    setBlogSlug(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPortal = (portal: 'teachers' | 'students' | 'admin') => {
    window.history.pushState({}, '', `/${portal}`);
    setActivePortal(portal);
  };

  const handleGoHome = () => {
    window.history.pushState({}, '', '/');
    setActivePortal(null);
  };

  const handleOpenLogin = (role?: 'teacher' | 'student' | 'admin') => {
    if (role) setLoginRole(role);
    setLoginModalOpen(true);
  };

  const handleScrollToSection = (sectionId: string) => {
    if (sectionId === 'learning-gap-intelligence' || sectionId === 'evaluator-demo' || sectionId === 'dashboards') {
      navigateToTab('learning-gap');
      return;
    }

    if (currentTab !== 'home') {
      navigateToTab('home');
      setTimeout(() => {
        const elem = document.getElementById(sectionId);
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const elem = document.getElementById(sectionId);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  if (activePortal) {
    return <PortalIframe portal={activePortal} onGoHome={handleGoHome} />;
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#12151C] font-sans antialiased selection:bg-[#FFF2EE] selection:text-[#F95721]">
      {/* Top Fixed Navigation */}
      <Navbar
        onOpenLogin={handleOpenLogin}
        onOpenAudit={() => setAuditModalOpen(true)}
        onScrollToSection={handleScrollToSection}
        currentTab={currentTab}
        onSelectTab={navigateToTab}
      />

      {/* Main Page Content */}
      {/* Clears the fixed header, which is taller now that the logo carries its
          descriptor inside the artwork. */}
      <main className="pt-16 sm:pt-20">
        {currentTab === 'privacy' ? (
          <PrivacyPolicy
            onBackToHome={() => navigateToTab('home')}
            onOpenAudit={() => setAuditModalOpen(true)}
          />
        ) : currentTab === 'blog' ? (
          <Blog
            activeSlug={blogSlug}
            onSelectPost={handleSelectPost}
            onBackToHome={() => navigateToTab('home')}
          />
        ) : currentTab === 'home' ? (
          <>
            {/* 1. Hero Section */}
            <Hero
              onExploreEvaluator={() => handleScrollToSection('learning-gap-intelligence')}
              onOpenAudit={() => setAuditModalOpen(true)}
            />

            {/* 2. Partner Schools & Trusted Institutions */}
            <PartnerSchools />

            {/* 3. Target Users & Stakeholders */}
            <TargetUsers onOpenAudit={() => setAuditModalOpen(true)} />

            {/* 4. Enterprise Trust Architecture */}
            <TrustAndSecurity />
          </>
        ) : (
          /* SEPARATE PAGE: Learning Gap Intelligence */
          <div className="animate-in fade-in duration-300">
            {/* 1. Core Philosophy Narrative */}
            <PhilosophySection />

            {/* 2. Handwritten Subjective Answer Evaluation */}
            <HandwrittenEvaluator onOpenAudit={() => setAuditModalOpen(true)} />

            {/* 3. Usable Intelligence Dashboards */}
            <ProductShowcase onOpenAudit={() => setAuditModalOpen(true)} />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenLogin={handleOpenLogin}
        onOpenAudit={() => setAuditModalOpen(true)}
        onOpenPrivacy={() => navigateToTab('privacy')}
        onOpenBlog={() => navigateToTab('blog')}
        onScrollToSection={handleScrollToSection}
      />

      {/* Portal Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        initialRole={loginRole}
        onClose={() => setLoginModalOpen(false)}
        onSelectPortal={handleSelectPortal}
      />

      {/* Website Billing Details Modal for Classmapwebsite */}
      <WebsiteBillingModal
        isOpen={websiteBillingModalOpen}
        onClose={() => setWebsiteBillingModalOpen(false)}
      />

      {/* Floating WhatsApp Quick Connect Button */}
      <a
        href="https://wa.me/918981716969?text=Hi%20Classmap%20Team%2C%20I%20would%20like%20to%20learn%20more%20about%20Classmap."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Connect on WhatsApp"
        className="fixed bottom-6 right-6 z-50 p-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-xl hover:scale-110 transition-all flex items-center gap-2 group border-2 border-white"
      >
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
        <span className="text-xs font-bold hidden sm:inline max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap pr-1">
          Chat on WhatsApp
        </span>
      </a>

      {/* Book Free Demo Modal */}
      <BookAuditModal
        isOpen={auditModalOpen}
        onClose={() => setAuditModalOpen(false)}
      />
    </div>
  );
}
