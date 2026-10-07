import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ShieldCheck, FileText, CheckCircle2, Printer } from 'lucide-react';

export interface ViewableCertificate {
  title: string;
  issuer: string;
  category?: string;
  issueDate?: string;
  credentialId?: string;
  format: 'pdf' | 'image';
  fileUrl: string;
  trustText: string;
  verified?: boolean;
  description?: string;
  keyHighlights?: string[];
}

interface CertificateViewerModalProps {
  certificate: ViewableCertificate | null;
  onClose: () => void;
}

export default function CertificateViewerModal({ certificate, onClose }: CertificateViewerModalProps) {
  // Lock body scroll and listen for Escape key
  useEffect(() => {
    if (!certificate) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [certificate, onClose]);

  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy-950/85 p-4 sm:p-6 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 lg:p-10 shadow-2xl border border-parchment-300 text-navy-950 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-parchment-200 pb-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {certificate.category && (
                <span className="rounded-md bg-navy-900 px-2.5 py-0.5 text-xs font-mono font-bold uppercase tracking-wider text-white">
                  {certificate.category}
                </span>
              )}
              <span className="rounded-md bg-gold-100 px-2.5 py-0.5 text-xs font-mono font-bold text-gold-900">
                Format: {certificate.format.toUpperCase()}
              </span>
              <span className="flex items-center gap-1 text-xs font-mono font-semibold text-emerald-700 ml-1">
                <ShieldCheck size={14} />
                Authenticated Record
              </span>
            </div>

            <h3 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-navy-950">
              {certificate.title}
            </h3>
            <p className="mt-1 text-sm font-semibold text-gold-800">
              Conferred by {certificate.issuer} {certificate.issueDate ? `• ${certificate.issueDate}` : ''}
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-50 text-navy-700 hover:bg-navy-100 transition-colors"
            aria-label="Close certificate viewer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content: Document Preview + Verification Details */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Visual Stamped Document Container (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border-2 border-navy-900 bg-navy-950 shadow-xl flex items-center justify-center">
              {certificate.format === 'pdf' ? (
                <div className="flex flex-col items-center justify-center p-8 text-center text-white">
                  <FileText size={56} className="text-gold-400 mb-3" />
                  <h4 className="font-serif text-xl font-bold">{certificate.title}</h4>
                  <p className="font-mono text-xs text-gold-300 mt-1">Official Authenticated PDF Document</p>
                  {certificate.credentialId && (
                    <p className="font-mono text-[11px] text-navy-400 mt-2">Credential Ref: {certificate.credentialId}</p>
                  )}
                </div>
              ) : (
                <img
                  src={certificate.fileUrl}
                  alt={certificate.title}
                  className="h-full w-full object-cover object-[center_20%]"
                />
              )}

              {/* Official Trust Text Seal Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-navy-950/95 backdrop-blur-xs border-t border-gold-400 px-4 py-2.5 text-center shadow-lg">
                <p className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gold-300 flex items-center justify-center gap-1.5">
                  <ShieldCheck size={13} className="text-gold-400 shrink-0" />
                  <span>{certificate.trustText}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Highlights & Institutional Details (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-xl border border-parchment-200 bg-parchment-50 p-5 space-y-3">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-navy-500">
                Verification Details:
              </p>
              {certificate.description && (
                <p className="text-xs text-navy-700 font-sans leading-relaxed">
                  {certificate.description}
                </p>
              )}
              <div className="text-xs font-mono text-navy-600 border-t border-parchment-200 pt-2 space-y-1">
                {certificate.credentialId && (
                  <p><span className="font-bold text-navy-900">Credential Ref:</span> {certificate.credentialId}</p>
                )}
                <p><span className="font-bold text-navy-900">Issuing Body:</span> {certificate.issuer}</p>
                <p><span className="font-bold text-navy-900">Status:</span> Verified Official Record</p>
              </div>
            </div>

            {certificate.keyHighlights && certificate.keyHighlights.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-navy-700">
                  Accreditation Highlights:
                </h4>
                <ul className="space-y-1.5">
                  {certificate.keyHighlights.map((hl, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-navy-800">
                      <CheckCircle2 size={13} className="text-gold-700 mt-0.5 shrink-0" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="btn-gold w-full justify-center !py-2.5 text-xs font-bold shadow-md"
              >
                <Printer size={14} />
                <span>Print / Save Authenticated PDF</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="btn-secondary w-full justify-center !py-2 text-xs font-semibold"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
