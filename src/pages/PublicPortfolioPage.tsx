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
import Gallery from '@/components/Gallery';
import ResumeSection from '@/components/ResumeSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function PublicPortfolioPage() {
  useScrollReveal();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <AboutSection />
        <Timeline />
        <ExperienceCard />
        <EducationCard />
        <PYPPSection />
        <SkillGroup />
        <LeadershipSection />
        <ArticleCardList />
        <AchievementCard />
        <Gallery />
        <ResumeSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
