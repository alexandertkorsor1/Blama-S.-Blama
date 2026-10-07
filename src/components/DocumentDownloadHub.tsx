import { useState, useMemo, useEffect } from 'react';
import {
  FileText,
  Download,
  Printer,
  CheckCircle2,
  Scale,
  Landmark,
  GraduationCap,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import { usePublicContent } from '@/context/PublicContentContext';
import { initialHubDocuments, type HubDocumentItem } from '@/data/documents';

const DOCS_STORAGE_KEY = 'blama_portfolio_document_hub_v1';

interface DocumentDownloadHubProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpenSectionInDossier?: (sectionId: string) => void;
  defaultDocId?: string;
}

const getIconForCategory = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('legal') || cat.includes('jurisprudence')) return Scale;
  if (cat.includes('public') || cat.includes('defense') || cat.includes('governance')) return Landmark;
  if (cat.includes('academic') || cat.includes('dissertation') || cat.includes('compendium')) return GraduationCap;
  if (cat.includes('paper') || cat.includes('treatise') || cat.includes('monograph')) return BookOpen;
  return FileText;
};

export default function DocumentDownloadHub({
  isOpen = true,
  onClose,
  onOpenSectionInDossier,
  defaultDocId = 'executive-cv',
}: DocumentDownloadHubProps) {
  const { profile, education, experiences, skillCategories, skills, articles, achievements } = usePublicContent();
  const [documents, setDocuments] = useState<HubDocumentItem[]>(() => {
    try {
      const saved = localStorage.getItem(DOCS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return initialHubDocuments;
  });

  const [selectedDocId, setSelectedDocId] = useState<string>(defaultDocId);
  const [includeSeal, setIncludeSeal] = useState(true);
  const [includeResearch, setIncludeResearch] = useState(true);
  const [includeCitations, setIncludeCitations] = useState(true);
  const [format, setFormat] = useState<'pdf' | 'text'>('pdf');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Sync with Admin updates in real-time
  useEffect(() => {
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem(DOCS_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setDocuments(parsed);
          }
        }
      } catch (e) {
        console.warn('Failed to sync Document Hub:', e);
      }
    };

    window.addEventListener('documents-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('documents-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const selectedDoc = documents.find((d) => d.id === selectedDocId) || documents[0] || initialHubDocuments[0];

  // Generate customized text for download
  const generatedDocumentText = useMemo(() => {
    if (!selectedDoc) return '';
    const lines: string[] = [];
    lines.push('================================================================================');
    lines.push('REPUBLIC OF LIBERIA • EXECUTIVE & JURISPRUDENCE DOSSIER');
    lines.push(`DOCUMENT: ${selectedDoc.title.toUpperCase()}`);
    lines.push(`REFERENCE ID: LBR-BSB-2026-${selectedDoc.id.toUpperCase()}`);
    lines.push(`DATE OF ISSUANCE: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`);
    lines.push('================================================================================\n');

    lines.push(`AUTHOR / SUBJECT: ${profile?.full_name ?? 'Blama S. Blama'} (${profile?.professional_name ?? 'Saah Blama'})`);
    lines.push(`TITLE: ${profile?.title ?? 'Business Management Professional | Law Scholar | Public Administration & PYPP Fellow'}`);
    lines.push(`LOCATION: ${profile?.location ?? 'Monrovia, Republic of Liberia'}`);
    lines.push(`CONTACT: ${profile?.email ?? 'blama.s.blama@alumni.umu.edu.lr'}\n`);

    lines.push('--------------------------------------------------------------------------------');
    lines.push('EXECUTIVE STATEMENT');
    lines.push('--------------------------------------------------------------------------------');
    lines.push(`${profile?.statement ?? ''}\n`);

    if (selectedDoc.customBody) {
      lines.push('--------------------------------------------------------------------------------');
      lines.push('OFFICIAL TREATISE TEXT');
      lines.push('--------------------------------------------------------------------------------');
      lines.push(`${selectedDoc.customBody}\n`);
    }

    if (selectedDoc.id === 'executive-cv' || selectedDoc.id === 'legal-academic-dossier' || selectedDoc.targetDossierSection === 'cv' || selectedDoc.targetDossierSection === 'education') {
      lines.push('--------------------------------------------------------------------------------');
      lines.push('ACADEMIC & LEGAL QUALIFICATIONS');
      lines.push('--------------------------------------------------------------------------------');
      education.forEach((edu) => {
        lines.push(`* ${edu.institution}`);
        lines.push(`  Degree: ${edu.degree} — ${edu.field}`);
        if (edu.year) lines.push(`  Year/Status: ${edu.year} (${edu.status})`);
        if (edu.description) lines.push(`  Summary: ${edu.description}`);
        lines.push('');
      });

      lines.push('--------------------------------------------------------------------------------');
      lines.push('PROFESSIONAL EXPERIENCE & PUBLIC SERVICE RECORD');
      lines.push('--------------------------------------------------------------------------------');
      experiences.forEach((exp) => {
        lines.push(`* ${exp.role} — ${exp.organization}`);
        if (exp.period) lines.push(`  Period: ${exp.period}`);
        lines.push('  Responsibilities:');
        exp.responsibilities.forEach((r) => lines.push(`    - ${r.responsibility}`));
        if (exp.achievements.length > 0) {
          lines.push('  Verified Milestones:');
          exp.achievements.forEach((a) => lines.push(`    - ${a.achievement}`));
        }
        lines.push('');
      });

      lines.push('--------------------------------------------------------------------------------');
      lines.push('CORE COMPETENCIES');
      lines.push('--------------------------------------------------------------------------------');
      skillCategories.forEach((cat) => {
        const catSkills = skills.filter((s) => s.category_id === cat.id).map((s) => s.name).join(', ');
        lines.push(`* ${cat.category}: ${catSkills}`);
      });
      lines.push('');
    }

    if (includeResearch && (selectedDoc.id.startsWith('paper-') || selectedDoc.id === 'legal-academic-dossier' || selectedDoc.targetDossierSection === 'articles')) {
      lines.push('--------------------------------------------------------------------------------');
      lines.push('PUBLISHED POLICY PAPERS & SCHOLARLY TREATISES');
      lines.push('--------------------------------------------------------------------------------');
      const targetArticles = selectedDoc.id === 'paper-defense-governance'
        ? articles.filter(a => a.id.includes('defense') || a.id.includes('statutory'))
        : selectedDoc.id === 'paper-equal-justice'
        ? articles.filter(a => a.id.includes('justice') || a.id.includes('commercial'))
        : selectedDoc.id === 'paper-civil-service'
        ? articles.filter(a => a.id.includes('civil') || a.id.includes('pypp'))
        : articles;

      targetArticles.forEach((art) => {
        lines.push(`\nTITLE: ${art.title}`);
        lines.push(`CATEGORY: ${art.category} | DATE: ${art.date ?? 'Recent'}`);
        lines.push(`EXCERPT: ${art.excerpt ?? ''}\n`);
        if (art.content) {
          lines.push(art.content);
        }
        lines.push('');
      });
    }

    if (includeSeal) {
      lines.push('\n--------------------------------------------------------------------------------');
      lines.push('OFFICIAL ATTESTATION & SEAL');
      lines.push('--------------------------------------------------------------------------------');
      lines.push(selectedDoc.attestationText || 'This document represents the verified executive curriculum of Blama S. Blama.');
      lines.push('Authenticated at Monrovia, Republic of Liberia • President\'s Young Professionals Program Class XI.');
    }

    if (includeCitations) {
      lines.push('\n--------------------------------------------------------------------------------');
      lines.push('FORMAL CITATION');
      lines.push('--------------------------------------------------------------------------------');
      lines.push(selectedDoc.citationText || `Blama, S. B. (${selectedDoc.publishedDate || '2026'}). ${selectedDoc.title}. Executive Compendium. Monrovia: Republic of Liberia.`);
    }

    return lines.join('\n');
  }, [selectedDoc, profile, education, experiences, skillCategories, skills, articles, includeSeal, includeResearch, includeCitations]);

  const handleDownloadFile = () => {
    // If the admin provided a custom downloadable file URL, navigate to or download that file
    if (selectedDoc.fileUrl) {
      const a = document.createElement('a');
      a.href = selectedDoc.fileUrl;
      a.download = selectedDoc.fileName || `Blama_S_Blama_${selectedDoc.id}.pdf`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
      return;
    }

    if (format === 'pdf') {
      window.print();
      return;
    }

    const blob = new Blob([generatedDocumentText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Blama_S_Blama_${selectedDoc.id.replace(/-/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="rounded-2xl border border-parchment-300 bg-white p-6 sm:p-8 lg:p-10 shadow-lg text-navy-950">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-parchment-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-gold-700">
              DOCUMENT & PDF SELECTION CENTER
            </span>
            <span className="rounded-md bg-gold-100 px-2 py-0.5 text-[10px] font-mono font-semibold text-gold-900">
              {documents.length} Verified Briefings
            </span>
          </div>
          <h3 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-navy-950">
            Select Official Document & PDF Briefing
          </h3>
          <p className="mt-1 text-sm text-navy-600 max-w-2xl">
            Choose from the verified official publications, executive CV, or legal monographs below. Select your document, customize included modules, and download or print directly.
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="self-start sm:self-auto flex h-9 w-9 items-center justify-center rounded-full bg-navy-50 text-navy-700 hover:bg-navy-100 transition-colors"
            aria-label="Close selector"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Main Two-Column Interactive Selector */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Selectable Document List (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-navy-500">
            1. Select Document to Generate / View:
          </p>

          <div className="space-y-3">
            {documents.map((doc) => {
              const isSelected = selectedDoc.id === doc.id;
              const Icon = getIconForCategory(doc.category);
              return (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  type="button"
                  className={`w-full text-left rounded-xl p-4.5 sm:p-5 transition-all flex items-start gap-4 border cursor-pointer ${
                    isSelected
                      ? 'border-gold-600 bg-gold-50/50 shadow-md ring-2 ring-gold-500/30'
                      : 'border-parchment-200 bg-parchment-50/40 hover:bg-white hover:border-navy-300'
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      isSelected ? 'bg-navy-900 text-gold-400' : 'bg-white border border-parchment-300 text-navy-700'
                    }`}
                  >
                    <Icon size={20} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-serif text-base font-bold text-navy-950">
                        {doc.title}
                      </h4>
                      <span className="rounded-md bg-navy-100 px-2 py-0.5 text-[10px] font-mono font-semibold text-navy-800 shrink-0">
                        {doc.badge} • {doc.pageCount}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-navy-600 leading-relaxed font-sans">
                      {doc.description}
                    </p>

                    <div className="mt-2.5 flex items-center gap-2 text-[11px] font-mono font-semibold text-gold-800">
                      <span>Category: {doc.category}</span>
                      {isSelected && (
                        <span className="flex items-center gap-1 text-green-700 ml-auto">
                          <Check size={12} />
                          Selected
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Customizer & Action Pane (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          <div className="rounded-xl border border-parchment-300 bg-parchment-50/80 p-5 sm:p-6 space-y-5">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-navy-500">
                2. Selected Document Context
              </p>
              <h4 className="mt-2 font-serif text-lg font-bold text-navy-950">
                {selectedDoc.title}
              </h4>
              <p className="text-xs text-navy-600 mt-1">
                Formatted according to official Liberian executive standards.
              </p>
            </div>

            {/* Customizer Toggles */}
            <div className="space-y-3 border-t border-parchment-200 pt-4">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-navy-600">
                Include Components in Export:
              </p>

              <label className="flex items-center gap-2.5 text-xs text-navy-800 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeSeal}
                  onChange={(e) => setIncludeSeal(e.target.checked)}
                  className="rounded border-navy-300 text-navy-900 focus:ring-gold-500"
                />
                <span className="font-medium">Official Digital Verification Seal & Attestation</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-navy-800 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeResearch}
                  onChange={(e) => setIncludeResearch(e.target.checked)}
                  className="rounded border-navy-300 text-navy-900 focus:ring-gold-500"
                />
                <span className="font-medium">Published Research & Policy Abstracts</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-navy-800 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeCitations}
                  onChange={(e) => setIncludeCitations(e.target.checked)}
                  className="rounded border-navy-300 text-navy-900 focus:ring-gold-500"
                />
                <span className="font-medium">Formal Academic & Statutory Citation Block</span>
              </label>
            </div>

            {/* Format Option */}
            <div className="space-y-2 border-t border-parchment-200 pt-4">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-navy-600">
                Select Export Format:
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormat('pdf')}
                  className={`rounded-lg p-2.5 text-center text-xs font-semibold transition-all border ${
                    format === 'pdf'
                      ? 'border-navy-900 bg-navy-900 text-white shadow-xs'
                      : 'border-parchment-300 bg-white text-navy-800 hover:bg-parchment-100'
                  }`}
                >
                  📄 PDF / Print Layout
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('text')}
                  className={`rounded-lg p-2.5 text-center text-xs font-semibold transition-all border ${
                    format === 'text'
                      ? 'border-navy-900 bg-navy-900 text-white shadow-xs'
                      : 'border-parchment-300 bg-white text-navy-800 hover:bg-parchment-100'
                  }`}
                >
                  📑 Clean Text Dossier
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleDownloadFile}
                className="btn-gold w-full justify-center !py-3 font-semibold shadow-md"
              >
                <Download size={16} />
                <span>
                  {selectedDoc.fileUrl
                    ? 'Download Authenticated File'
                    : format === 'pdf'
                    ? 'Print / Save as PDF'
                    : 'Download Text Dossier'}
                </span>
              </button>

              <button
                onClick={handlePrint}
                className="btn-secondary w-full justify-center !py-2.5 text-xs font-semibold"
              >
                <Printer size={14} />
                <span>Direct Print Preview</span>
              </button>

              {onOpenSectionInDossier && (
                <button
                  onClick={() => onOpenSectionInDossier(selectedDoc.targetDossierSection)}
                  className="w-full text-center text-xs font-semibold text-gold-800 hover:text-gold-900 hover:underline pt-1 flex items-center justify-center gap-1"
                >
                  <span>Read selected chapter in Executive Text Dossier</span>
                  <ArrowRight size={12} />
                </button>
              )}
            </div>

            {downloadSuccess && (
              <div className="flex items-center gap-2 rounded-lg bg-green-50 p-2.5 text-xs font-semibold text-green-800 border border-green-200">
                <CheckCircle2 size={14} className="text-green-600" />
                Document downloaded successfully.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
