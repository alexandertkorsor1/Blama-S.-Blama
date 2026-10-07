import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import Timeline from '@/components/Timeline';
import EducationCard from '@/components/EducationCard';
import ExperienceCard from '@/components/ExperienceCard';
import PYPPSection from '@/components/PYPPSection';
import SkillGroup from '@/components/SkillGroup';
import LeadershipSection from '@/components/LeadershipSection';
import ArticleCardList from '@/components/ArticleCard';
import AchievementCard from '@/components/AchievementCard';
import CertificateVault from '@/components/CertificateVault';
import Gallery from '@/components/Gallery';
import ResumeSection from '@/components/ResumeSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import ExecutiveTextView from '@/components/ExecutiveTextView';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { PublicContentProvider, usePublicContent } from '@/context/PublicContentContext';

function PublicPortfolioContent() {
  useScrollReveal();
  const { isLoading, settings } = usePublicContent();
  const [viewMode, setViewMode] = useState<'visual' | 'text'>('visual');
  const [initialArticleId, setInitialArticleId] = useState<string | null>(null);

  // Check URL hash or query on mount
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#text-view' || hash === '#dossier') {
        setViewMode('text');
      } else if (hash.startsWith('#article/')) {
        const artId = hash.replace('#article/', '');
        setInitialArticleId(artId);
        setViewMode('text');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const openTextView = (articleId?: string) => {
    if (articleId) {
      setInitialArticleId(articleId);
    }
    setViewMode('text');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const backToVisual = () => {
    setViewMode('visual');
    setInitialArticleId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isLoading && settings?.maintenance_mode) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-navy-950 px-6 text-center text-white">
        <div className="max-w-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-400 font-mono">
            Blama S. Blama
          </p>
          <h1 className="mt-5 font-serif text-4xl font-bold">Executive Portfolio Maintenance</h1>
          <p className="mt-5 text-base leading-relaxed text-navy-200">
            The official dossier is undergoing scheduled updates and will return shortly. Thank you for your patience.
          </p>
        </div>
      </main>
    );
  }

  if (viewMode === 'text') {
    return (
      <ExecutiveTextView
        onBackToVisual={backToVisual}
        initialArticleId={initialArticleId}
      />
    );
  }

  return (
    <>
      <Navbar
        isTextView={false}
        onToggleTextView={() => openTextView()}
      />
      <main>
        <Hero onOpenTextView={() => openTextView()} />
        <AboutSection onOpenTextView={() => openTextView()} />
        <Timeline />
        <ExperienceCard onOpenTextView={() => openTextView()} />
        <EducationCard onOpenTextView={() => openTextView()} />
        <PYPPSection />
        <SkillGroup />
        <LeadershipSection />
        <ArticleCardList onOpenTextView={(id) => openTextView(id)} />
        <AchievementCard />
        <CertificateVault onOpenTextView={() => openTextView('education')} />
        <Gallery />
        <ResumeSection onOpenSectionInDossier={(sec) => openTextView(sec)} />
        <ContactSection />
      </main>
      <Footer onOpenTextView={() => openTextView()} />
    </>
  );
}

export default function PublicPortfolioPage() {
  return (
    <PublicContentProvider>
      <PublicPortfolioContent />
    </PublicContentProvider>
  );
}
