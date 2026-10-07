import { useState, useEffect } from 'react';
import {
  Award,
  ShieldCheck,
  FileText,
  CheckCircle2,
  ExternalLink,
  Printer,
  X,
  Search,
} from 'lucide-react';
import SectionHeading from './SectionHeading';
import { certificates as initialCertificates, type CertificateItem } from '@/data/certificates';
import CertificateViewerModal from './CertificateViewerModal';

const CERT_STORAGE_KEY = 'blama_portfolio_certificates_vault_v1';

interface CertificateVaultProps {
  onOpenTextView?: () => void;
}

export default function CertificateVault({ onOpenTextView }: CertificateVaultProps) {
  const [certList, setCertList] = useState<CertificateItem[]>(() => {
    try {
      const saved = localStorage.getItem(CERT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not parse stored certificates:', e);
    }
    return initialCertificates;
  });

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  // Sync when Admin updates certificates in real-time
  useEffect(() => {
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem(CERT_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCertList(parsed);
          }
        }
      } catch (e) {
        console.warn('Failed to sync certificates:', e);
      }
    };

    window.addEventListener('certificates-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('certificates-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const categories = ['All', ...new Set(certList.map((c) => c.category))];

  const filteredCerts = certList.filter((cert) => {
    const matchesCat = activeCategory === 'All' || cert.category === activeCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.trustText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.credentialId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handlePrintCert = () => {
    window.print();
  };

  return (
    <section id="certificates" className="section-padding py-20 lg:py-28 bg-parchment-100/60 border-t border-parchment-200">
      <div className="mx-auto max-w-7xl">
        <div className="reveal">
          <SectionHeading
            eyebrow="Credentials & Accreditations"
            title="Verified Certificate Vault"
            description="Official academic degrees, national fellowship awards, and public service commendations. Available for inspection in authenticated PDF and image formats with official trust watermarks."
            actionLabel="View in Text Dossier ↗"
            onAction={onOpenTextView}
          />
        </div>

        {/* Controls & Filter Bar */}
        <div className="reveal mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const count = cat === 'All' ? certList.length : certList.filter((c) => c.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    activeCategory === cat
                      ? 'bg-navy-900 text-white shadow-xs'
                      : 'bg-white text-navy-800 border border-parchment-300 hover:bg-parchment-100'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {/* Search filter */}
            <div className="relative w-full sm:w-72">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search certificates, institutions..."
                className="w-full rounded-lg border border-navy-200 bg-white py-1.5 pl-8 pr-3 text-xs text-navy-900 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
              />
            </div>
          </div>
        </div>

        {/* Selectable Certificate Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCerts.map((cert) => (
            <div
              key={cert.id}
              onClick={() => setSelectedCert(cert)}
              className="reveal card card-hover group overflow-hidden border border-parchment-300 bg-white p-6 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Header Banner */}
                <div className="flex items-start justify-between gap-2 border-b border-parchment-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-navy-100 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-navy-800">
                      {cert.category}
                    </span>
                    <span className="rounded-md bg-gold-100 px-2 py-0.5 text-[10px] font-mono font-semibold text-gold-900">
                      {cert.format === 'pdf' ? '📄 PDF Document' : '🖼 Stamped Image'}
                    </span>
                  </div>

                  <span className="flex items-center gap-1 text-[11px] font-mono font-semibold text-green-700">
                    <ShieldCheck size={13} />
                    Verified
                  </span>
                </div>

                {/* Certificate Title & Issuer */}
                <h3 className="mt-4 font-serif text-xl font-bold text-navy-950 group-hover:text-gold-800 transition-colors leading-snug">
                  {cert.title}
                </h3>
                <p className="mt-1 text-sm font-semibold text-gold-800">
                  {cert.issuer}
                </p>

                {/* Trust Seal Banner */}
                <div className="mt-3 rounded-lg border border-gold-300 bg-gold-50/70 p-2.5">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-gold-950 flex items-center gap-1.5">
                    <ShieldCheck size={12} className="text-gold-700 shrink-0" />
                    <span className="line-clamp-1">{cert.trustText}</span>
                  </p>
                </div>

                <p className="mt-3 text-xs text-navy-600 leading-relaxed font-sans line-clamp-3">
                  {cert.description}
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="mt-6 pt-4 border-t border-parchment-100 flex items-center justify-between text-xs font-mono">
                <span className="text-navy-400">Ref: {cert.credentialId}</span>
                <span className="font-bold text-gold-700 group-hover:text-navy-950 flex items-center gap-1 transition-colors">
                  <span>Inspect Credential</span>
                  <ExternalLink size={12} />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Certificate Inspection Modal */}
        <CertificateViewerModal
          certificate={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      </div>
    </section>
  );
}
