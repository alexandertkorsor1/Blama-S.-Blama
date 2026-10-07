import { useState, useRef, useEffect } from 'react';
import {
  Award,
  FileText,
  Image as ImageIcon,
  ShieldCheck,
  Check,
  Trash2,
  Upload,
  Plus,
  X,
  AlignLeft,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { certificates, type CertificateItem } from '@/data/certificates';

export interface AttachedCertificateData {
  title: string;
  issuer: string;
  category: string;
  format: 'pdf' | 'image';
  fileUrl: string;
  trustText: string;
  credentialId: string;
  description?: string;
  issueDate?: string;
  keyHighlights?: string[];
}

interface CertificateAttachmentFieldProps {
  value?: AttachedCertificateData | null;
  onChange: (cert: AttachedCertificateData | null) => void;
  label?: string;
  defaultCategory?: string;
  defaultIssuer?: string;
}

const certificateCategories = [
  'Academic Degree',
  'Fellowship Award',
  'Public Service & Defense Record',
  'Legal Studies & Jurisprudence',
  'Judicial Governance & Field Delegation',
  'Professional Certification',
  'Executive Leadership Training',
  'Honorary Commendation',
];

const defaultTrustPresets = [
  'Verified Official Credential • Republic of Liberia',
  'Certified True Academic Record • United Methodist University',
  'Authentic Public-Service Leadership Credential • PYPP Class XI',
  'Official Civilian Defense Service Record • Ministry of National Defense',
  'Verified Legal Scholar Standing • Louis Arthur Grimes School of Law',
  'Official Judicial Field Observation Credential • Sinoe County',
];

export default function CertificateAttachmentField({
  value,
  onChange,
  label = 'Attach Verified Certificate / Credential',
  defaultCategory = 'Academic Degree',
  defaultIssuer = 'Republic of Liberia',
}: CertificateAttachmentFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [certFormat, setCertFormat] = useState<'pdf' | 'image'>('pdf');
  const [certTitle, setCertTitle] = useState('');
  const [certIssuer, setCertIssuer] = useState(defaultIssuer);
  const [category, setCategory] = useState(defaultCategory);
  const [issueDate, setIssueDate] = useState('');
  const [credentialId, setCredentialId] = useState(`VER-${Date.now().toString().slice(-6)}`);
  const [description, setDescription] = useState('');
  const [trustText, setTrustText] = useState('Verified Official Credential • Republic of Liberia');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [keyHighlights, setKeyHighlights] = useState<string[]>([]);
  const [newHighlight, setNewHighlight] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when modal opens or value changes
  useEffect(() => {
    if (value) {
      setCertTitle(value.title || '');
      setCertIssuer(value.issuer || defaultIssuer);
      setCategory(value.category || defaultCategory);
      setCertFormat(value.format || 'pdf');
      setCredentialId(value.credentialId || `VER-${Date.now().toString().slice(-6)}`);
      setDescription(value.description || '');
      setIssueDate(value.issueDate || '');
      setTrustText(value.trustText || 'Verified Official Credential • Republic of Liberia');
      setFileUrl(value.fileUrl || '');
      setKeyHighlights(value.keyHighlights || []);
      setFileName(value.title || 'Attached Document');
    }
  }, [value, defaultIssuer, defaultCategory]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    setCertFormat(isPdf ? 'pdf' : 'image');

    if (!certTitle) {
      setCertTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    }

    if (isPdf) {
      setFileUrl(URL.createObjectURL(file));
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectFromArchive = (archivalCert: CertificateItem) => {
    setCertTitle(archivalCert.title);
    setCertIssuer(archivalCert.issuer);
    setCategory(archivalCert.category);
    setCertFormat(archivalCert.format);
    setCredentialId(archivalCert.credentialId);
    setTrustText(archivalCert.trustText);
    setFileUrl(archivalCert.fileUrl);
    setDescription(archivalCert.description || '');
    setIssueDate(archivalCert.issueDate || '');
    setKeyHighlights(archivalCert.keyHighlights || []);
    setFileName(`${archivalCert.title} (${archivalCert.format.toUpperCase()})`);
  };

  const handleAddHighlight = () => {
    if (newHighlight.trim()) {
      setKeyHighlights([...keyHighlights, newHighlight.trim()]);
      setNewHighlight('');
    }
  };

  const handleRemoveHighlight = (idx: number) => {
    setKeyHighlights(keyHighlights.filter((_, i) => i !== idx));
  };

  const handleApply = () => {
    if (!certTitle.trim()) {
      alert('Please enter a certificate or credential title.');
      return;
    }

    onChange({
      title: certTitle.trim(),
      issuer: certIssuer.trim() || defaultIssuer,
      category: category.trim() || defaultCategory,
      format: certFormat,
      fileUrl: fileUrl || `${import.meta.env.BASE_URL}gallery/blama-formal-suit.jpg`,
      trustText: trustText.trim() || 'Verified Official Credential • Republic of Liberia',
      credentialId: credentialId.trim() || `VER-${Date.now().toString().slice(-6)}`,
      description: description.trim() || 'Verified official accreditation and credential record.',
      issueDate: issueDate.trim() || new Date().getFullYear().toString(),
      keyHighlights: keyHighlights.length > 0 ? keyHighlights : ['Official authenticated credential', 'Verified institutional record'],
    });
    setIsOpen(false);
  };

  return (
    <div className="space-y-3 rounded-2xl border border-parchment-300 bg-parchment-50/70 p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-navy-800 flex items-center gap-1.5">
          <Award size={15} className="text-gold-700" />
          <span>{label}</span>
        </label>
        {value && (
          <span className="flex items-center gap-1 text-xs font-mono font-semibold text-emerald-700">
            <ShieldCheck size={13} />
            Certificate Attached
          </span>
        )}
      </div>

      {/* When NO certificate is currently attached */}
      {!value ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-parchment-300 bg-white p-4 text-xs font-bold text-navy-800 transition-all hover:border-gold-500 hover:bg-gold-50/30"
        >
          <Plus size={15} className="text-gold-600" />
          <span>Click to Upload or Select Certificate (PDF / Image) & Add Description</span>
        </button>
      ) : (
        /* When a certificate IS attached */
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-gold-400 bg-white p-3.5 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-gold-400">
              {value.format === 'pdf' ? <FileText size={20} /> : <ImageIcon size={20} />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-serif text-sm font-bold text-navy-950 truncate">
                  {value.title}
                </p>
                <span className="rounded-md bg-gold-100 px-2 py-0.5 text-[10px] font-mono font-semibold text-gold-900">
                  {value.format.toUpperCase()}
                </span>
                {value.category && (
                  <span className="rounded-md bg-navy-100 px-2 py-0.5 text-[10px] font-mono font-semibold text-navy-800 hidden md:inline">
                    {value.category}
                  </span>
                )}
              </div>
              <p className="text-xs text-navy-600 font-mono truncate">
                {value.issuer} • Ref: {value.credentialId} {value.issueDate ? `(${value.issueDate})` : ''}
              </p>
              {value.description && (
                <p className="text-[11px] text-navy-500 line-clamp-1 mt-0.5">
                  {value.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="rounded-lg border border-navy-200 bg-white px-2.5 py-1 text-xs font-semibold text-navy-800 hover:bg-navy-50"
            >
              Edit Certificate
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
            >
              <Trash2 size={13} />
              <span>Remove</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal / Dialog to Upload & Configure Certificate */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-navy-950/85 p-4 sm:p-6 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-parchment-300 text-navy-950 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-parchment-200 pb-4">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-gold-700">
                  CREDENTIAL ATTACHMENT & ACCREDITATION
                </span>
                <h3 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-navy-950">
                  Upload Certificate, Description & Trust Seal
                </h3>
                <p className="mt-0.5 text-xs text-navy-600">
                  Attach official PDF or Image documents, define certificate type/scope, and configure authenticated provenance seals.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-navy-400 hover:bg-navy-50 hover:text-navy-700 transition-colors"
                aria-label="Close certificate modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Step 1: Choose from Pre-verified Vault */}
            <div className="space-y-2">
              <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-navy-600">
                1. Select from Pre-Verified Credentials (Or Upload Below):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-36 overflow-y-auto p-1 border border-parchment-200 rounded-2xl bg-parchment-50/40">
                {certificates.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectFromArchive(c)}
                    className="flex items-center gap-2.5 rounded-xl border border-parchment-200 bg-white p-2.5 text-left transition-colors hover:border-gold-500 hover:bg-gold-50/40 shadow-2xs"
                  >
                    <Award size={18} className="text-gold-700 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-navy-950 truncate">{c.title}</p>
                      <p className="text-[10px] text-navy-500 font-mono truncate">{c.issuer} • {c.format.toUpperCase()}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Or Upload From Device */}
            <div className="space-y-2 border-t border-parchment-200 pt-4">
              <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-navy-600">
                2. Or Upload File from Device (PDF or Image):
              </label>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="application/pdf,image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-navy-300 bg-navy-50/40 p-5 text-center cursor-pointer hover:border-gold-500 hover:bg-gold-50/20 transition-all"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900 text-gold-400 group-hover:scale-105 transition-transform">
                  <Upload size={20} />
                </div>
                <p className="mt-2 text-xs font-bold text-navy-900">
                  {fileName ? fileName : 'Click to Browse & Select PDF or Image File'}
                </p>
                <p className="text-[10px] text-navy-500">Supports PDF documents and high-resolution images</p>
              </div>
            </div>

            {/* Step 3: Certificate Details & Descriptions */}
            <div className="space-y-4 border-t border-parchment-200 pt-4">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-navy-700">
                <AlignLeft size={14} className="text-gold-700" />
                <span>3. Certificate Metadata & Detailed Descriptions:</span>
              </div>

              {/* Title & Issuing Authority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-800">
                    Certificate Title <span className="text-gold-700">*</span>
                  </label>
                  <input
                    type="text"
                    value={certTitle}
                    onChange={(e) => setCertTitle(e.target.value)}
                    placeholder="e.g. Bachelor of Business Administration (BBA) in Management"
                    className="mt-1 w-full rounded-xl border border-navy-200 px-3.5 py-2 text-xs font-medium text-navy-950 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-800">
                    Issuing Authority / Institution
                  </label>
                  <input
                    type="text"
                    value={certIssuer}
                    onChange={(e) => setCertIssuer(e.target.value)}
                    placeholder="e.g. United Methodist University (UMU)"
                    className="mt-1 w-full rounded-xl border border-navy-200 px-3.5 py-2 text-xs font-medium text-navy-950 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                  />
                </div>
              </div>

              {/* Certificate Category / Type & Format */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-800">
                    Certificate Kind / Type
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-navy-200 px-3 py-2 text-xs font-medium text-navy-950 focus:outline-none"
                  >
                    {certificateCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-800">
                    Issue Date / Year
                  </label>
                  <input
                    type="text"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    placeholder="e.g. August 2021 or 2023"
                    className="mt-1 w-full rounded-xl border border-navy-200 px-3.5 py-2 text-xs font-medium text-navy-950 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-800">
                    Document Format
                  </label>
                  <select
                    value={certFormat}
                    onChange={(e) => setCertFormat(e.target.value as 'pdf' | 'image')}
                    className="mt-1 w-full rounded-xl border border-navy-200 px-3 py-2 text-xs font-medium text-navy-950 focus:outline-none"
                  >
                    <option value="pdf">📄 PDF Document</option>
                    <option value="image">🖼 Image Certificate</option>
                  </select>
                </div>
              </div>

              {/* Credential ID */}
              <div>
                <label className="block text-xs font-semibold text-navy-800">
                  Credential ID / Serial Ref
                </label>
                <input
                  type="text"
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value)}
                  placeholder="e.g. UMU-BBA-2021-MGMT-084"
                  className="mt-1 w-full rounded-xl border border-navy-200 px-3.5 py-2 text-xs font-medium text-navy-950 focus:outline-none"
                />
              </div>

              {/* Extra Description of What Kind of Certificate */}
              <div>
                <label className="block text-xs font-semibold text-navy-800">
                  Certificate Description & Scope of Accreditation:
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide full details: what kind of certificate this is, academic/professional coursework, honors conferred, and institutional context."
                  className="mt-1 w-full resize-none rounded-xl border border-navy-200 px-3.5 py-2 text-xs font-medium text-navy-950 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                />
              </div>

              {/* Key Verification Highlights / Points */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-navy-800">
                  Key Verification Highlights & Commendations:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    placeholder="e.g. Conferred with academic honors in management..."
                    className="flex-1 rounded-xl border border-navy-200 px-3.5 py-1.5 text-xs font-medium text-navy-950 focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddHighlight();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="rounded-xl bg-navy-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-gold-600 transition-colors"
                  >
                    Add
                  </button>
                </div>

                {keyHighlights.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {keyHighlights.map((hl, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-parchment-100 px-2.5 py-1 text-xs text-navy-800 border border-parchment-300"
                      >
                        <span>• {hl}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveHighlight(i)}
                          className="text-navy-400 hover:text-red-600"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Text of Trust Seal */}
              <div>
                <label className="block text-xs font-semibold text-navy-800">
                  Custom "Text of Trust" Watermark Seal:
                </label>
                <input
                  type="text"
                  value={trustText}
                  onChange={(e) => setTrustText(e.target.value)}
                  placeholder="e.g. Verified Official Academic Credential • United Methodist University"
                  className="mt-1 w-full rounded-xl border border-navy-200 px-3.5 py-2 text-xs font-medium text-navy-950 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                />

                {/* Quick Trust Text Presets */}
                <div className="mt-2 space-y-1">
                  <p className="text-[10px] font-mono font-semibold uppercase text-navy-500">
                    Quick Trust Text Presets:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {defaultTrustPresets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setTrustText(preset)}
                        className="rounded-md border border-parchment-300 bg-parchment-50 px-2 py-0.5 text-[10px] text-navy-700 hover:bg-gold-50 hover:text-gold-950 transition-colors"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-parchment-200 pt-4">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-xl border border-navy-200 px-4 py-2 text-xs font-semibold text-navy-800 hover:bg-navy-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="btn-gold !py-2.5 !px-6 text-xs font-bold shadow-sm"
              >
                <Check size={14} />
                <span>Attach Certificate & Save Description</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
