import { useState, useEffect, useCallback } from 'react';
import {
  GraduationCap,
  Briefcase,
  Scale,
  Landmark,
  X,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import SectionHeading from './SectionHeading';
import { profile } from '@/data/profile';

interface PillarDetail {
  icon: typeof Briefcase;
  title: string;
  subtitle: string;
  badge: string;
  summary: string;
  image: string;
  detailedText: string[];
  keyHighlights: string[];
  competencies: string[];
  sectionLink: string;
  sectionLinkText: string;
}

const aboutPillars: PillarDetail[] = [
  {
    icon: Briefcase,
    title: 'Business Management',
    subtitle: 'Strategic Leadership & Operational Stewardship',
    badge: 'BBA in Management (2021)',
    summary:
      'A Bachelor of Business Administration in Management from United Methodist University, with hands-on experience in operations and administration.',
    image: '/gallery/blama-formal-suit.jpg',
    detailedText: [
      'Blama earned his Bachelor of Business Administration (BBA) in Management from United Methodist University in 2021, establishing a rigorous grounding in organizational theory, strategic planning, and administrative oversight.',
      'His practical background spans commercial operations and community initiatives — serving as Operations Manager at Fassah Business Center where he streamlined daily workflows, client services, and administrative controls, and as Administrative Assistant at Block 3-Self Help Community Initiative.',
      'He combines private-sector efficiency with structural planning, delivering sustainable outcomes across teams and enterprise environments.',
    ],
    keyHighlights: [
      'Bachelor of Business Administration (BBA) in Management from United Methodist University (2021)',
      'Operations Manager at Fassah Business Center: Workflow optimization & administration',
      'Administrative coordination for Block 3-Self Help Community Initiative',
      'Strong expertise in organizational efficiency, team coordination, and financial controls',
    ],
    competencies: [
      'Operations Management',
      'Strategic Planning',
      'Resource Allocation',
      'Process Optimization',
      'Administrative Leadership',
    ],
    sectionLink: 'experience',
    sectionLinkText: 'Explore Experience & Roles',
  },
  {
    icon: Landmark,
    title: 'Public Service',
    subtitle: 'National Governance & Institutional Placement',
    badge: 'PYPP Class XI Fellow',
    summary:
      'Professional placement at the Ministry of National Defense through the President\'s Young Professionals Program, gaining direct exposure to national governance.',
    image: '/gallery/blama-judiciary-sinoe-county.png',
    detailedText: [
      'Selected into Class XI of the prestigious President\'s Young Professionals Program (PYPP), Blama was placed at the Ministry of National Defense, Republic of Liberia, gaining firsthand insight into high-level state administration.',
      'Through the fellowship, he underwent intensive mentorship, ethics, and governance training designed to build Liberia\'s next generation of civil-service leaders.',
      'His public-sector engagements include institutional delegation visits to national judicial and circuit courts, notably The Judiciary Third Judicial Circuit Court in Greenville City, Sinoe County.',
    ],
    keyHighlights: [
      'President\'s Young Professionals Program (PYPP) Fellow — Class XI',
      'Professional placement at the Ministry of National Defense, Republic of Liberia',
      'Field engagements across county administrative and judicial institutions',
      'Dedicated to building transparent, high-integrity governance systems',
    ],
    competencies: [
      'Public Sector Governance',
      'Ministry Operations',
      'Policy Implementation',
      'Inter-Agency Coordination',
      'Civil Service Ethics',
    ],
    sectionLink: 'pypp',
    sectionLinkText: 'Explore PYPP Fellowship',
  },
  {
    icon: Scale,
    title: 'Legal Studies',
    subtitle: 'Jurisprudence, Rule of Law & Equal Justice',
    badge: 'Louis Arthur Grimes School of Law',
    summary:
      'Pursuing legal education at the Louis Arthur Grimes School of Law, with interests in legal research, equal justice, and the rule of law.',
    image: '/gallery/blama-law-library-books.png',
    detailedText: [
      'Blama is pursuing advanced legal education at the Louis Arthur Grimes School of Law — the premier faculty of law in Liberia at the University of Liberia.',
      'His legal scholarship centers on constitutional governance, commercial law, legal research, and the protection of equal justice under the law.',
      'By bridging business management acumen with statutory rigor, he aims to contribute to legal reforms, equitable governance, and statutory clarity across Liberian enterprises and institutions.',
    ],
    keyHighlights: [
      'Legal Scholar at the Louis Arthur Grimes School of Law (University of Liberia)',
      'Core focus on Legal Research, Equal Justice, and the Rule of Law',
      'Synthesis of commercial management principles with judicial doctrine',
      'Active engagement in statutory jurisprudence and legal research',
    ],
    competencies: [
      'Legal Research & Writing',
      'Constitutional Law',
      'Statutory Analysis',
      'Equal Justice Advocacy',
      'Commercial Law',
    ],
    sectionLink: 'education',
    sectionLinkText: 'Explore Academic Background',
  },
  {
    icon: GraduationCap,
    title: 'Continuous Learning',
    subtitle: 'Multi-Disciplinary Synthesis & Leadership Horizon',
    badge: 'Lifelong Leadership Development',
    summary:
      'A commitment to professional development that bridges enterprise, governance, and law — preparing for leadership roles that serve Liberia\'s future.',
    image: '/gallery/blama-portrait-robes.jpg',
    detailedText: [
      'Blama views leadership and professional development not as static milestones, but as an ongoing continuum of growth, discipline, and community impact.',
      'His journey reflects a deliberate synthesis of enterprise management, public-sector service, and jurisprudence — equipping him to navigate complex socio-economic and policy challenges.',
      'Committed to mentoring emerging youth and advancing Liberia\'s institutional resilience, he continually participates in leadership seminars, judicial dialogues, and governance initiatives.',
    ],
    keyHighlights: [
      'Multi-disciplinary foundation connecting business, public administration, and law',
      'Committed to youth mentorship and civic leadership development in Liberia',
      'Continuous participation in governance, legal, and managerial seminars',
      'Vision for sustainable national development through strong, equitable institutions',
    ],
    competencies: [
      'Ethical Leadership',
      'Multi-Disciplinary Analysis',
      'Youth Mentorship',
      'Institutional Reform',
      'Executive Communication',
    ],
    sectionLink: 'journey',
    sectionLinkText: 'Explore Professional Journey',
  },
];

export default function AboutSection() {
  const [selectedPillarIndex, setSelectedPillarIndex] = useState<number | null>(null);

  const activePillar = selectedPillarIndex !== null ? aboutPillars[selectedPillarIndex] : null;

  const closeModal = useCallback(() => setSelectedPillarIndex(null), []);

  const nextPillar = useCallback(() => {
    setSelectedPillarIndex((prev) => (prev !== null ? (prev + 1) % aboutPillars.length : null));
  }, []);

  const prevPillar = useCallback(() => {
    setSelectedPillarIndex((prev) =>
      prev !== null ? (prev - 1 + aboutPillars.length) % aboutPillars.length : null
    );
  }, []);

  const scrollToSection = (id: string) => {
    closeModal();
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 150);
  };

  useEffect(() => {
    if (selectedPillarIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') nextPillar();
      if (e.key === 'ArrowLeft') prevPillar();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedPillarIndex, closeModal, nextPillar, prevPillar]);

  return (
    <section id="about" className="section-padding py-20 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="reveal">
          <SectionHeading
            eyebrow="About"
            title="A professional journey bridging enterprise, governance, and law"
          />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
          <div className="reveal lg:col-span-2">
            <div className="space-y-6 text-base leading-relaxed text-navy-700 sm:text-lg">
              <p>
                {profile.fullName}, also known professionally as {profile.professionalName}, is a
                Liberian professional whose career reflects a steady commitment to management,
                public service, and the pursuit of justice. His background spans business
                operations, community development, national-level public-sector exposure, and
                ongoing legal education.
              </p>
              <p>
                His academic foundation was built at the United Methodist University, where he
                earned a Bachelor of Business Administration in Management, graduating in 2021.
                This education equipped him with the organizational and strategic skills that
                would shape his early professional career — from managing operations at a business
                center to providing administrative support for a community self-help initiative.
              </p>
              <p>
                His trajectory took a significant step forward with his selection into the
                President's Young Professionals Program (PYPP), Class XI — a prestigious fellowship
                that cultivates emerging Liberian leaders for public service. Through this
                program, he gained professional placement at the Ministry of National Defense,
                acquiring firsthand experience in national institutional operations and
                public-sector governance.
              </p>
              <p>
                Building on this foundation, he is currently pursuing legal studies at the Louis
                Arthur Grimes School of Law. His professional interests — equal justice, the rule
                of law, and legal research — reflect a deepening conviction that effective
                governance and equitable institutions are essential to Liberia's development.
              </p>
              <p className="font-serif text-xl text-navy-900 italic border-l-2 border-gold-500 pl-6">
                "Professional development is not a destination but a continuum — each experience
                builds toward a larger capacity to serve."
              </p>
            </div>
          </div>

          <div className="reveal space-y-4" style={{ transitionDelay: '0.1s' }}>
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                Core Pillars of Expertise
              </span>
              <span className="text-xs text-navy-400">Click to explore details</span>
            </div>

            {aboutPillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <button
                  key={pillar.title}
                  type="button"
                  onClick={() => setSelectedPillarIndex(index)}
                  className="card card-hover group w-full p-5 text-left transition-all duration-300 hover:border-gold-500/50 hover:bg-gold-500/[0.02] focus:outline-none focus:ring-2 focus:ring-gold-500/40"
                  aria-label={`View details about ${pillar.title}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-gold-600 transition-colors duration-300 group-hover:bg-gold-500 group-hover:text-white">
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-base font-semibold text-navy-900 group-hover:text-gold-700 transition-colors">
                          {pillar.title}
                        </h3>
                        <ChevronRight
                          size={16}
                          className="text-navy-300 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-gold-600"
                        />
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-navy-600 line-clamp-2">
                        {pillar.summary}
                      </p>
                      <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-gold-600 group-hover:text-gold-700">
                        <span>Learn more</span>
                        <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Expanded Pillar Detail Modal */}
      {activePillar && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-navy-950/80 backdrop-blur-sm animate-fadeIn"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="pillar-modal-title"
        >
          <div
            className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-navy-100 flex flex-col animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Banner */}
            <div className="relative bg-gradient-to-r from-navy-950 via-navy-900 to-navy-850 p-6 sm:p-8 text-white rounded-t-2xl overflow-hidden">
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-gold-400 via-gold-300 to-gold-500" />
              
              <button
                type="button"
                onClick={closeModal}
                className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Close details"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/40 bg-gold-400/10 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-gold-300">
                  <Sparkles size={12} />
                  {activePillar.badge}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/20 text-gold-300 border border-gold-500/30">
                  {(() => {
                    const Icon = activePillar.icon;
                    return <Icon size={24} />;
                  })()}
                </div>
                <div>
                  <h3 id="pillar-modal-title" className="font-serif text-2xl sm:text-3xl font-bold text-white">
                    {activePillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gold-200/90 font-medium">
                    {activePillar.subtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 sm:p-8 space-y-6 flex-1 text-navy-800">
              {/* Photo Preview & Key Context */}
              <div className="flex flex-col sm:flex-row gap-5 items-center rounded-xl bg-navy-50/70 p-4 border border-navy-100">
                <div className="h-32 w-32 shrink-0 overflow-hidden rounded-lg shadow-md border border-gold-500/30 bg-navy-900">
                  <img
                    src={activePillar.image}
                    alt={activePillar.title}
                    className="h-full w-full object-cover object-[center_20%]"
                  />
                </div>
                <div className="flex-1 min-w-0 text-sm text-navy-700 leading-relaxed">
                  <p className="font-medium text-navy-900 mb-1">Professional Focus:</p>
                  <p>{activePillar.summary}</p>
                </div>
              </div>

              {/* Detailed Narrative */}
              <div className="space-y-3.5 text-sm sm:text-base leading-relaxed text-navy-700">
                <h4 className="font-serif text-lg font-bold text-navy-900 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-gold-500" />
                  Background & Trajectory
                </h4>
                {activePillar.detailedText.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              {/* Key Highlights */}
              <div className="space-y-3">
                <h4 className="font-serif text-lg font-bold text-navy-900 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-gold-500" />
                  Key Highlights
                </h4>
                <div className="grid grid-cols-1 gap-2.5">
                  {activePillar.keyHighlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-sm text-navy-700">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-gold-600" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Competencies */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-navy-500">
                  Core Competencies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activePillar.competencies.map((comp) => (
                    <span
                      key={comp}
                      className="rounded-lg bg-navy-100/80 px-3 py-1 text-xs font-semibold text-navy-800 border border-navy-200"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="border-t border-navy-100 bg-navy-50/50 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 rounded-b-2xl">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevPillar}
                  className="flex h-9 items-center gap-1 rounded-lg border border-navy-200 bg-white px-3 text-xs font-medium text-navy-700 hover:bg-navy-50 transition-colors"
                >
                  <ChevronLeft size={14} />
                  <span>Previous</span>
                </button>
                <button
                  type="button"
                  onClick={nextPillar}
                  className="flex h-9 items-center gap-1 rounded-lg border border-navy-200 bg-white px-3 text-xs font-medium text-navy-700 hover:bg-navy-50 transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollToSection(activePillar.sectionLink)}
                  className="btn-primary !py-2 !px-4 !text-xs"
                >
                  <span>{activePillar.sectionLinkText}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
