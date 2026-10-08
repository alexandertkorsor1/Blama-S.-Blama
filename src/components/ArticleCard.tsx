import { useState } from 'react';
import {
  Clock,
  Calendar,
  ArrowRight,
  BookOpen,
  X,
  Sparkles,
  FileText,
  ChevronRight,
  Award,
  ShieldCheck,
} from 'lucide-react';
import SectionHeading from './SectionHeading';
import type { Database } from '@/types/database.types';
import { usePublicContent } from '@/context/PublicContentContext';
import { useSectionContent } from '@/hooks/useSectionContent';
import { getCertificateForArticle, type CertificateItem } from '@/data/certificates';
import CertificateViewerModal from './CertificateViewerModal';

type Article = Database['public']['Tables']['articles']['Row'];

interface ArticleCardListProps {
  onOpenTextView?: (articleId?: string) => void;
}

function ArticleCardItem({
  article,
  onRead,
  onOpenInDossier,
  onViewCert,
}: {
  article: Article;
  onRead: () => void;
  onOpenInDossier?: () => void;
  onViewCert?: (cert: CertificateItem) => void;
}) {
  const cert = getCertificateForArticle(article.title, article.category);

  return (
    <article className="reveal card card-hover overflow-hidden flex flex-col justify-between group border border-navy-100 bg-white">
      <div>
        {/* Top Banner with Clean Editorial Monogram */}
        <div className="relative h-44 bg-navy-950 p-6 flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 10% 20%, rgba(197,165,114,0.3) 0%, transparent 60%)',
              }}
            />
          </div>

          <div className="flex items-center justify-between z-10">
            <span className="rounded-md bg-gold-600/90 backdrop-blur-xs px-2.5 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wider text-white">
              {article.category}
            </span>
            <div className="flex items-center gap-1.5 text-gold-300/80 text-xs font-mono">
              <BookOpen size={13} />
              <span>Policy Treatise</span>
            </div>
          </div>

          <div className="z-10">
            <p className="font-mono text-[10px] uppercase tracking-widest text-gold-400">
              LOUIS ARTHUR GRIMES SCHOOL OF LAW & PYPP COMPENDIUM
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <div className="flex items-center gap-3 text-xs text-navy-400 font-mono">
            {article.date && (
              <span className="flex items-center gap-1">
                <Calendar size={12} className="text-gold-600" />
                {article.date}
              </span>
            )}
            {article.read_time && (
              <span className="flex items-center gap-1">
                <Clock size={12} className="text-gold-600" />
                {article.read_time}
              </span>
            )}
          </div>

          <h3 className="mt-3 font-serif text-xl font-bold text-navy-950 leading-snug group-hover:text-gold-800 transition-colors">
            {article.title}
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-navy-700 font-sans">
            {article.excerpt}
          </p>
        </div>
      </div>

      <div>
        {/* Attached Certificate Tag */}
        {cert && (
          <div className="mx-6 mb-4 rounded-xl border border-gold-300 bg-gold-50/70 p-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <ShieldCheck size={14} className="text-gold-700 shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-navy-950 truncate">
                  {cert.title}
                </p>
                <p className="text-[9px] font-mono text-gold-900 truncate">
                  {cert.format.toUpperCase()} • {cert.trustText}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onViewCert?.(cert)}
              className="inline-flex items-center gap-1 rounded-md bg-navy-900 px-2 py-1 text-[10px] font-mono font-bold text-gold-300 hover:bg-gold-600 hover:text-navy-950 transition-colors shrink-0 shadow-2xs"
            >
              <Award size={11} />
              <span>Certificate</span>
            </button>
          </div>
        )}

        <div className="p-6 pt-0 border-t border-navy-50 flex items-center justify-between">
          <button
            onClick={onRead}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-700 transition-colors hover:text-navy-950 focus:outline-none"
          >
            <span>Read Summary</span>
            <ArrowRight size={13} />
          </button>

          {onOpenInDossier && (
            <button
              onClick={onOpenInDossier}
              className="inline-flex items-center gap-1 text-xs text-navy-500 hover:text-gold-700 transition-colors"
              title="Open full paper in Executive Text Dossier"
            >
              <FileText size={12} />
              <span>Full Dossier</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ArticleCardList({ onOpenTextView }: ArticleCardListProps) {
  const { articles } = usePublicContent();
  const { sections } = useSectionContent();
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  const selectedArticle = articles.find((a) => a.id === selectedArticleId);

  return (
    <section id="insights" className="section-padding py-20 lg:py-28 bg-parchment-100/60">
      <div className="site-container">
        <div className="reveal">
          <SectionHeading
            eyebrow={sections.articles.eyebrow}
            title={sections.articles.title}
            description={sections.articles.description}
            actionLabel="Read All in Text Dossier ↗"
            onAction={() => onOpenTextView?.()}
          />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCardItem
              key={article.id}
              article={article}
              onRead={() => setSelectedArticleId(article.id)}
              onOpenInDossier={() => onOpenTextView?.(article.id)}
              onViewCert={(cert) => setSelectedCert(cert)}
            />
          ))}
        </div>

        {/* Modal / Reading Overlay for Selected Article */}
        {selectedArticle && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm animate-fadeIn"
            onClick={() => setSelectedArticleId(null)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-10 border border-parchment-300 animate-scaleUp text-navy-900"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Close */}
              <div className="flex items-start justify-between border-b border-parchment-200 pb-5">
                <div>
                  <span className="rounded-md bg-gold-100 px-2.5 py-0.5 text-xs font-mono font-semibold text-gold-900">
                    {selectedArticle.category}
                  </span>
                  <div className="mt-2 flex items-center gap-3 text-xs text-navy-500 font-mono">
                    {selectedArticle.date && <span>{selectedArticle.date}</span>}
                    {selectedArticle.read_time && <span>• {selectedArticle.read_time}</span>}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedArticleId(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-50 text-navy-700 hover:bg-navy-100 transition-colors"
                  aria-label="Close reading view"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Title & Author */}
              <div className="mt-6">
                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-navy-950 leading-snug">
                  {selectedArticle.title}
                </h3>
                <p className="mt-2 text-xs font-mono text-gold-700 uppercase tracking-wider">
                  Author: Blama S. Blama • Legal Scholar & PYPP Fellow
                </p>
              </div>

              {/* Key Takeaways Box */}
              <div className="mt-6 rounded-xl border border-gold-200 bg-gold-50/70 p-5 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-900 font-mono">
                  <Sparkles size={14} className="text-gold-700" />
                  <span>Key Policy & Legal Takeaways</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-navy-800">
                  <li>Civilian administrative oversight and statutory compliance are prerequisites for durable defense governance.</li>
                  <li>Bridging private-sector operations with constitutional law expands access to equal justice.</li>
                  <li>Decentralized judicial missions reinforce the uniform protection of rights across all counties.</li>
                </ul>
              </div>

              {/* Body Content */}
              <div className="mt-6 font-editorial text-base sm:text-lg leading-relaxed text-navy-850 space-y-4 whitespace-pre-wrap">
                {selectedArticle.content || selectedArticle.excerpt}
              </div>

              {/* Footer Actions */}
              <div className="mt-8 pt-6 border-t border-parchment-200 flex flex-wrap items-center justify-between gap-4">
                <button
                  onClick={() => {
                    const id = selectedArticle.id;
                    setSelectedArticleId(null);
                    onOpenTextView?.(id);
                  }}
                  className="btn-primary !py-2 !px-4 text-xs font-semibold"
                >
                  <FileText size={14} />
                  <span>View in Full Text Dossier</span>
                </button>

                <button
                  onClick={() => setSelectedArticleId(null)}
                  className="btn-secondary !py-2 !px-4 text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Certificate Inspection Modal */}
        <CertificateViewerModal certificate={selectedCert} onClose={() => setSelectedCert(null)} />
      </div>
    </section>
  );
}
