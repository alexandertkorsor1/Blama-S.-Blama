import { useState, useMemo } from 'react';
import {
  Printer,
  Copy,
  Check,
  BookOpen,
  ArrowLeft,
  GraduationCap,
  Briefcase,
  Landmark,
  Scale,
  Award,
  ChevronDown,
  ChevronUp,
  FileText,
  Mail,
  Linkedin,
  MapPin,
  Sparkles,
  Search,
} from 'lucide-react';
import { usePublicContent } from '@/context/PublicContentContext';

interface ExecutiveTextViewProps {
  onBackToVisual: () => void;
  initialArticleId?: string | null;
}

type FontStyle = 'serif' | 'sans' | 'mono';
type TextSize = 'normal' | 'large' | 'compact';

export default function ExecutiveTextView({ onBackToVisual, initialArticleId }: ExecutiveTextViewProps) {
  const { profile, education, experiences, skillCategories, skills, articles, achievements, timelineItems } = usePublicContent();
  const [fontStyle, setFontStyle] = useState<FontStyle>('serif');
  const [textSize, setTextSize] = useState<TextSize>('normal');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(initialArticleId ?? null);
  const [activeTab, setActiveTab] = useState<'all' | 'bio' | 'education' | 'public-service' | 'articles' | 'cv'>('all');

  const fullName = profile?.full_name ?? 'Blama S. Blama';
  const professionalName = profile?.professional_name ?? 'Saah Blama';
  const title = profile?.title ?? 'Business Management Professional | Law Scholar | Public Administration & PYPP Fellow';
  const location = profile?.location ?? 'Monrovia, Republic of Liberia';

  const citationText = `Blama, S. B. (2026). Executive Dossier, Public Administration Record & Legal Studies Compendium. Monrovia: Republic of Liberia. URL: https://blamasblama.com/`;

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(citationText);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const fontClass = useMemo(() => {
    switch (fontStyle) {
      case 'serif':
        return 'font-editorial';
      case 'sans':
        return 'font-sans';
      case 'mono':
        return 'font-mono';
    }
  }, [fontStyle]);

  const textSizeClass = useMemo(() => {
    switch (textSize) {
      case 'compact':
        return 'text-sm leading-relaxed';
      case 'normal':
        return 'text-base leading-relaxed sm:text-[17px] sm:leading-8';
      case 'large':
        return 'text-lg leading-relaxed sm:text-xl sm:leading-9';
    }
  }, [textSize]);

  // Filter articles based on search query if applicable
  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return articles;
    const q = searchQuery.toLowerCase();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        (a.excerpt && a.excerpt.toLowerCase().includes(q)) ||
        (a.content && a.content.toLowerCase().includes(q))
    );
  }, [articles, searchQuery]);

  return (
    <div className="min-h-screen bg-parchment-100 text-navy-950 font-sans selection:bg-gold-200">
      {/* Top Floating Document Control Bar */}
      <nav className="sticky top-0 z-50 border-b border-parchment-200 bg-white/95 backdrop-blur-md shadow-sm no-print">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToVisual}
              className="inline-flex items-center gap-1.5 rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy-800 transition-colors hover:bg-navy-50 hover:text-navy-950"
            >
              <ArrowLeft size={14} />
              <span>Visual Mode</span>
            </button>
            <div className="hidden sm:flex items-center gap-2 border-l border-navy-200 pl-3">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-gold-700">
                EXECUTIVE TEXT DOSSIER
              </span>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold-600" />
              <span className="text-xs text-navy-600 font-medium">Official Compendium</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Font Style Selector */}
            <div className="hidden sm:flex items-center rounded-lg border border-navy-200 bg-navy-50/70 p-0.5 text-xs">
              <button
                onClick={() => setFontStyle('serif')}
                className={`rounded-md px-2.5 py-1 font-serif transition-colors ${
                  fontStyle === 'serif' ? 'bg-white font-bold text-navy-950 shadow-xs' : 'text-navy-600 hover:text-navy-900'
                }`}
                title="Editorial Serif Typography"
              >
                Serif
              </button>
              <button
                onClick={() => setFontStyle('sans')}
                className={`rounded-md px-2.5 py-1 font-sans transition-colors ${
                  fontStyle === 'sans' ? 'bg-white font-bold text-navy-950 shadow-xs' : 'text-navy-600 hover:text-navy-900'
                }`}
                title="Clean Sans-Serif Typography"
              >
                Sans
              </button>
              <button
                onClick={() => setFontStyle('mono')}
                className={`rounded-md px-2.5 py-1 font-mono transition-colors ${
                  fontStyle === 'mono' ? 'bg-white font-bold text-navy-950 shadow-xs' : 'text-navy-600 hover:text-navy-900'
                }`}
                title="Monograph Courier Typography"
              >
                Mono
              </button>
            </div>

            {/* Text Size Selector */}
            <div className="hidden md:flex items-center rounded-lg border border-navy-200 bg-navy-50/70 p-0.5 text-xs">
              <button
                onClick={() => setTextSize('compact')}
                className={`rounded-md px-2 py-1 transition-colors ${
                  textSize === 'compact' ? 'bg-white font-bold text-navy-950 shadow-xs' : 'text-navy-600 hover:text-navy-900'
                }`}
              >
                A-
              </button>
              <button
                onClick={() => setTextSize('normal')}
                className={`rounded-md px-2 py-1 transition-colors ${
                  textSize === 'normal' ? 'bg-white font-bold text-navy-950 shadow-xs' : 'text-navy-600 hover:text-navy-900'
                }`}
              >
                A
              </button>
              <button
                onClick={() => setTextSize('large')}
                className={`rounded-md px-2 py-1 transition-colors ${
                  textSize === 'large' ? 'bg-white font-bold text-navy-950 shadow-xs' : 'text-navy-600 hover:text-navy-900'
                }`}
              >
                A+
              </button>
            </div>

            {/* Copy Citation */}
            <button
              onClick={handleCopyCitation}
              className="inline-flex items-center gap-1.5 rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy-800 transition-colors hover:bg-navy-50"
              title="Copy Formal Academic Citation"
            >
              {copiedCitation ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
              <span className="hidden sm:inline">{copiedCitation ? 'Citation Copied' : 'Cite Dossier'}</span>
            </button>

            {/* Print / Save PDF */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg bg-navy-900 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-gold-600"
            >
              <Printer size={14} />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Document Body */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Document Sheet */}
        <article className="dossier-sheet p-6 sm:p-12 lg:p-16 border border-parchment-300">
          {/* Formal Dossier Letterhead & Legal Header */}
          <header className="border-b-2 border-navy-900 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-gold-700">
                  REPUBLIC OF LIBERIA • EXECUTIVE & JURISPRUDENCE DOSSIER
                </p>
                <p className="mt-1 text-xs text-navy-500 font-mono">
                  REF-NO: LBR-BSB-2026-EXECUTIVE • CLASSIFICATION: OFFICIAL PROFESSIONAL COMPENDIUM
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto rounded-md border border-gold-400 bg-gold-50/70 px-3 py-1">
                <Sparkles size={13} className="text-gold-700" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-gold-900">
                  Verified Leadership Record
                </span>
              </div>
            </div>

            {/* Scholar & Executive Title */}
            <div className="mt-8">
              <h1 className="font-serif text-3xl font-extrabold tracking-tight text-navy-950 sm:text-5xl">
                {fullName}
              </h1>
              <p className="mt-2 text-lg font-medium text-gold-700 sm:text-xl">
                {professionalName ? `Known Professionally as ${professionalName}` : ''}
              </p>
              <p className="mt-2 text-sm sm:text-base font-semibold text-navy-800">
                {title}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-navy-600 font-mono">
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-gold-600" />
                  {location}
                </span>
                {profile?.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail size={13} className="text-gold-600" />
                    {profile.email}
                  </span>
                )}
                {profile?.linkedin && (
                  <span className="flex items-center gap-1.5">
                    <Linkedin size={13} className="text-gold-600" />
                    linkedin.com/in/saahblama
                  </span>
                )}
              </div>
            </div>

            {/* Quick Filter Tabs for Long-Form Reading */}
            <div className="mt-8 flex flex-wrap gap-2 border-t border-parchment-200 pt-4 no-print">
              {[
                { id: 'all', label: 'Complete Dossier' },
                { id: 'bio', label: '§ 1.0 Executive Overview' },
                { id: 'education', label: '§ 2.0 Academic Record' },
                { id: 'public-service', label: '§ 3.0 Public Service & PYPP' },
                { id: 'articles', label: '§ 4.0 Published Insights & Papers' },
                { id: 'cv', label: '§ 5.0 Chronological CV' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-navy-900 text-white shadow-xs'
                      : 'bg-parchment-100 text-navy-700 hover:bg-parchment-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </header>

          {/* Document Content Container */}
          <div className={`mt-10 space-y-14 ${fontClass} ${textSizeClass}`}>
            {/* SECTION 1: EXECUTIVE STATEMENT & DOCTRINE */}
            {(activeTab === 'all' || activeTab === 'bio') && (
              <section id="dossier-overview" className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="dossier-section-num">SECTION 1.0</span>
                  <h2 className="dossier-heading">Executive Overview & Statement of Purpose</h2>
                </div>

                <div className="space-y-4 text-navy-800">
                  <p className="drop-cap">
                    {profile?.statement ||
                      'A Liberian professional grounded in enterprise management and dedicated to public service, ethical leadership, and statutory jurisprudence. My career unites operational discipline with legal scholarship at the Louis Arthur Grimes School of Law — actively building toward a future where national institutions, commercial frameworks, and governance serve all citizens with equity and integrity.'}
                  </p>
                  <p>
                    Blama’s professional trajectory represents a disciplined synthesis across three essential pillars of national development: private-sector operations management, national public-service fellowship through the President’s Young Professionals Program (PYPP Class XI) at the Ministry of National Defense, and advanced legal scholarship at the Louis Arthur Grimes School of Law.
                  </p>
                  
                  <div className="pull-quote">
                    "Sustainable governance is not built by doctrine alone, nor solely by commercial efficiency. It is achieved when statutory clarity, ethical civil service, and operational rigor are united in service to the citizen."
                  </div>

                  <p>
                    Throughout his engagements — spanning commercial management at Fassah Business Center, grassroots administrative coordination with the Block 3-Self Help Community Initiative, and institutional judicial delegation field visits across Sinoe County — Blama has maintained a consistent focus on procedural fairness, transparent documentation, and institutional capacity building.
                  </p>
                </div>
              </section>
            )}

            {/* SECTION 2: ACADEMIC CREDENTIALS & LEGAL SCHOLARSHIP */}
            {(activeTab === 'all' || activeTab === 'education') && (
              <section id="dossier-education" className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="dossier-section-num">SECTION 2.0</span>
                  <h2 className="dossier-heading">Academic Credentials & Legal Jurisprudence</h2>
                </div>

                <div className="space-y-8">
                  {education.map((edu, idx) => (
                    <div
                      key={edu.id}
                      className="rounded-xl border border-parchment-300 bg-parchment-50/60 p-6 sm:p-7 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-parchment-200 pb-3">
                        <div>
                          <span className="font-mono text-xs font-semibold text-gold-700 uppercase">
                            Degree Program § 2.{idx + 1}
                          </span>
                          <h3 className="font-serif text-xl font-bold text-navy-950 sm:text-2xl">
                            {edu.institution}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-navy-900 px-2.5 py-1 text-xs font-semibold text-white font-mono">
                            {edu.year || edu.status}
                          </span>
                        </div>
                      </div>

                      <div className="text-sm font-semibold text-gold-800">
                        {edu.degree} — <span className="text-navy-700">{edu.field}</span>
                      </div>

                      {edu.description && (
                        <p className="text-navy-800 leading-relaxed pt-1">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Jurisprudential Focus Areas */}
                <div className="rounded-xl border border-navy-200 bg-navy-950 p-6 sm:p-8 text-white space-y-4">
                  <div className="flex items-center gap-2">
                    <Scale size={20} className="text-gold-400" />
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-gold-300">
                      Core Legal Research & Jurisprudential Interests
                    </h3>
                  </div>
                  <p className="text-sm text-navy-200 leading-relaxed">
                    At the Louis Arthur Grimes School of Law (University of Liberia), current legal inquiry centers on the following statutory and constitutional doctrines:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-sm">
                    <div className="border-l-2 border-gold-500 pl-3">
                      <p className="font-bold text-white">Equal Justice & Constitutional Protection</p>
                      <p className="text-navy-300 text-xs mt-1">Ensuring statutory access to justice, equitable court procedures, and procedural fairness for all citizens across Liberia’s 15 counties.</p>
                    </div>
                    <div className="border-l-2 border-gold-500 pl-3">
                      <p className="font-bold text-white">Commercial Law & Statutory Enforcement</p>
                      <p className="text-navy-300 text-xs mt-1">Strengthening commercial dispute resolution, contractual certainty, and corporate compliance frameworks to catalyze domestic economic investment.</p>
                    </div>
                    <div className="border-l-2 border-gold-500 pl-3">
                      <p className="font-bold text-white">Civil Service & Administrative Law</p>
                      <p className="text-navy-300 text-xs mt-1">Institutionalizing standard operating directives, public financial management compliance, and anti-corruption safeguards in public administration.</p>
                    </div>
                    <div className="border-l-2 border-gold-500 pl-3">
                      <p className="font-bold text-white">Judicial Decentralization & Circuit Oversight</p>
                      <p className="text-navy-300 text-xs mt-1">Analyzing statutory jurisdiction, court administration, and regional judicial coordination based on firsthand circuit court field observations.</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* SECTION 3: PUBLIC SERVICE & PYPP FELLOWSHIP */}
            {(activeTab === 'all' || activeTab === 'public-service') && (
              <section id="dossier-service" className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="dossier-section-num">SECTION 3.0</span>
                  <h2 className="dossier-heading">Public Service Record & PYPP Fellowship (Class XI)</h2>
                </div>

                <div className="space-y-4 text-navy-800">
                  <p>
                    Selection into **Class XI of the President’s Young Professionals Program (PYPP)** represents one of the defining leadership milestones of Blama’s career. The program was founded to identify, train, and place Liberia’s highest-caliber university graduates within key government ministries to rebuild institutional capacity.
                  </p>

                  {/* Ministry of National Defense Placement Highlight */}
                  <div className="rounded-xl border border-parchment-300 bg-white p-6 shadow-sm space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-900 text-gold-400">
                          <Landmark size={20} />
                        </div>
                        <div>
                          <h3 className="font-serif text-lg font-bold text-navy-950">
                            Ministry of National Defense — Executive Fellowship Placement
                          </h3>
                          <p className="font-mono text-xs text-gold-700">PYPP Class XI • Barclay Training Center, Monrovia</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-navy-700 leading-relaxed">
                      Deployed into civilian defense administration, Blama has actively engaged in high-level institutional workflows, logistics auditing, inter-agency administrative correspondence, and policy compliance verification.
                    </p>

                    <div className="space-y-2 pt-2">
                      <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-navy-600">
                        Key Administrative & Operational Functions:
                      </h4>
                      <ul className="list-disc pl-5 space-y-1.5 text-sm text-navy-800">
                        <li>Drafting and reviewing formal administrative memoranda, ministerial correspondence, and policy briefings.</li>
                        <li>Coordinating logistics verification, supply-chain documentation, and asset tracking protocols.</li>
                        <li>Participating in structured civil-service ethics, administrative reform, and governance modules with senior leadership.</li>
                        <li>Engaging in decentralized state missions, including institutional delegation visits to The Judiciary 3rd Judicial Circuit Court in Greenville, Sinoe County.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* SECTION 4: PUBLISHED POLICY BRIEFS & LEGAL ESSAYS */}
            {(activeTab === 'all' || activeTab === 'articles') && (
              <section id="dossier-articles" className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="dossier-section-num">SECTION 4.0</span>
                    <h2 className="dossier-heading">Published Policy Briefs & Scholarly Papers</h2>
                  </div>

                  {/* Search filter within articles */}
                  <div className="relative no-print">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
                    <input
                      type="text"
                      placeholder="Search papers & topics..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="rounded-lg border border-navy-200 bg-white py-1.5 pl-8 pr-3 text-xs text-navy-900 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                    />
                  </div>
                </div>

                <p className="text-sm text-navy-600">
                  Original research, policy treatises, and analytical essays authored by Blama S. Blama addressing public administration, defense governance, and legal reform in Liberia.
                </p>

                <div className="space-y-8">
                  {filteredArticles.map((art, idx) => {
                    const isExpanded = expandedArticleId === art.id;
                    return (
                      <article
                        key={art.id}
                        className="rounded-xl border border-parchment-300 bg-white p-6 sm:p-8 shadow-sm transition-all"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-parchment-200 pb-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-gold-700 uppercase">
                              Paper § 4.{idx + 1}
                            </span>
                            <span className="rounded-md bg-navy-100 px-2.5 py-0.5 text-xs font-semibold text-navy-800">
                              {art.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-navy-500 font-mono">
                            {art.date && <span>{art.date}</span>}
                            {art.read_time && <span>• {art.read_time}</span>}
                          </div>
                        </div>

                        <h3 className="mt-4 font-serif text-xl sm:text-2xl font-bold text-navy-950 leading-snug">
                          {art.title}
                        </h3>

                        {art.excerpt && (
                          <p className="mt-3 text-sm sm:text-base text-navy-700 leading-relaxed font-sans">
                            {art.excerpt}
                          </p>
                        )}

                        {/* Expandable Full Article Content */}
                        {isExpanded && art.content && (
                          <div className="mt-6 border-t border-parchment-200 pt-6 space-y-6">
                            {/* Key Takeaways Box */}
                            <div className="rounded-lg border border-gold-200 bg-gold-50/70 p-5 space-y-2">
                              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-gold-900">
                                Key Policy Implications:
                              </h4>
                              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-navy-800">
                                <li>Civilian administrative oversight guarantees institutional credibility and resource protection.</li>
                                <li>Combining commercial inventory systems with statutory compliance strengthens national readiness.</li>
                                <li>Decentralized circuit court coordination fosters uniform legal protection across counties.</li>
                              </ul>
                            </div>

                            {/* Full Markdown / Article Body */}
                            <div className="prose prose-navy max-w-none text-navy-850 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                              {art.content}
                            </div>
                          </div>
                        )}

                        <div className="mt-5 flex items-center justify-between pt-2 border-t border-parchment-100">
                          <button
                            onClick={() => setExpandedArticleId(isExpanded ? null : art.id)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-700 hover:text-gold-900 transition-colors"
                          >
                            <BookOpen size={14} />
                            <span>{isExpanded ? 'Collapse Full Paper' : 'Read Complete Treatise'}</span>
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {/* SECTION 5: CHRONOLOGICAL CURRICULUM VITAE & EXPERIENCE */}
            {(activeTab === 'all' || activeTab === 'cv') && (
              <section id="dossier-cv" className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="dossier-section-num">SECTION 5.0</span>
                  <h2 className="dossier-heading">Chronological Curriculum Vitae & Service Record</h2>
                </div>

                <div className="space-y-6">
                  {experiences.map((exp, idx) => (
                    <div
                      key={exp.id}
                      className="rounded-xl border border-parchment-300 bg-white p-6 shadow-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-parchment-200 pb-3">
                        <div>
                          <span className="font-mono text-xs font-semibold text-gold-700">
                            Service Record § 5.{idx + 1}
                          </span>
                          <h3 className="font-serif text-lg font-bold text-navy-950">
                            {exp.role}
                          </h3>
                          <p className="text-sm font-semibold text-gold-800">{exp.organization}</p>
                        </div>
                        {exp.period && (
                          <span className="self-start sm:self-auto rounded-md bg-navy-50 px-2.5 py-1 text-xs font-mono font-medium text-navy-700 border border-navy-200">
                            {exp.period}
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-navy-500">
                          Primary Responsibilities & Directives:
                        </p>
                        <ul className="list-disc pl-5 space-y-1.5 text-sm text-navy-700">
                          {exp.responsibilities.map((resp) => (
                            <li key={resp.id}>{resp.responsibility}</li>
                          ))}
                        </ul>
                      </div>

                      {exp.skills.length > 0 && (
                        <div className="space-y-1.5 pt-2 border-t border-parchment-100">
                          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-navy-400">
                            Applied Competencies:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {exp.skills.map((s) => (
                              <span
                                key={s.id}
                                className="rounded-md bg-parchment-100 px-2 py-0.5 text-xs font-medium text-navy-800"
                              >
                                {s.skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SECTION 6: COMPETENCIES & VERIFIED HONORS */}
            {activeTab === 'all' && (
              <section id="dossier-skills" className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="dossier-section-num">SECTION 6.0</span>
                  <h2 className="dossier-heading">Core Competency Matrix & Verified Accreditations</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {skillCategories.map((group) => {
                    const groupSkills = skills.filter((s) => s.category_id === group.id);
                    return (
                      <div
                        key={group.id}
                        className="rounded-xl border border-parchment-300 bg-parchment-50/70 p-5 space-y-3"
                      >
                        <h3 className="font-serif text-base font-bold text-navy-950 border-b border-parchment-200 pb-2">
                          {group.category}
                        </h3>
                        <ul className="space-y-1.5 text-sm text-navy-800">
                          {groupSkills.map((s) => (
                            <li key={s.id} className="flex items-start gap-2">
                              <span className="text-gold-600 mt-1">•</span>
                              <span>{s.name}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>

                {/* Verified Achievements */}
                <div className="mt-8 space-y-4">
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-gold-700">
                    Verified Honors & Milestones
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {achievements.map((ach) => (
                      <div
                        key={ach.id}
                        className="rounded-lg border border-parchment-200 bg-white p-4 shadow-xs flex items-start gap-3"
                      >
                        <Award size={18} className="shrink-0 text-gold-600 mt-0.5" />
                        <div>
                          <p className="font-bold text-navy-950 text-sm">{ach.title}</p>
                          <p className="text-xs font-semibold text-gold-700 mt-0.5">{ach.organization} {ach.year ? `(${ach.year})` : ''}</p>
                          {ach.description && <p className="text-xs text-navy-600 mt-1">{ach.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* SECTION 7: INSTITUTIONAL INQUIRIES & AUTHENTICATION SEAL */}
            {activeTab === 'all' && (
              <section id="dossier-verification" className="border-t-2 border-navy-900 pt-10 space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl border border-gold-300 bg-parchment-50 p-6 sm:p-8">
                  <div className="space-y-2 text-center sm:text-left">
                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-gold-800">
                      OFFICIAL ATTESTATION & CITATION NOTICE
                    </p>
                    <h3 className="font-serif text-xl font-bold text-navy-950">
                      Dossier Verification & Inquiries
                    </h3>
                    <p className="text-xs sm:text-sm text-navy-700 max-w-xl leading-relaxed">
                      This curriculum dossier represents the verified professional, public-service, and academic record of Blama S. Blama. For institutional verification, academic inquiries, or government correspondence, direct inquiries to:
                    </p>
                    <p className="font-mono text-xs font-bold text-navy-900 pt-1">
                      {profile?.email || 'blama.s.blama@alumni.umu.edu.lr'} • Monrovia, Republic of Liberia
                    </p>
                  </div>

                  {/* Insignia Stamp */}
                  <div className="flex flex-col items-center justify-center shrink-0 h-28 w-28 rounded-full border-2 border-gold-600 bg-white shadow-inner p-2 text-center">
                    <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-gold-800">REPUBLIC OF</span>
                    <span className="font-serif text-lg font-extrabold text-navy-950">LIBERIA</span>
                    <span className="font-mono text-[8px] font-semibold text-gold-700">VERIFIED DOSSIER</span>
                    <span className="font-mono text-[8px] text-navy-400">2026</span>
                  </div>
                </div>
              </section>
            )}
          </div>
        </article>
      </main>
    </div>
  );
}
