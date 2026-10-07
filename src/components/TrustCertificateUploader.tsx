import { useState, useRef, useEffect } from 'react';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  ShieldCheck,
  Check,
  X,
  Sparkles,
  Download,
  Eye,
  Sliders,
  Award,
  RefreshCw,
} from 'lucide-react';
import type { CertificateItem } from '@/data/certificates';

interface TrustCertificateUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCertificate?: (newCert: CertificateItem) => void;
}

const trustTextPresets = [
  'Verified Official Credential • Republic of Liberia',
  'Certified True Record • Louis Arthur Grimes School of Law',
  'Authentic Public Service Record • PYPP Class XI',
  'Academic Degree Verified • United Methodist University',
  'Official Civilian Defense Administration • Ministry of National Defense',
  'Decentralized Judicial Governance Verified • The Judiciary',
];

type StampPosition = 'bottom-banner' | 'bottom-right' | 'top-banner' | 'diagonal';

export default function TrustCertificateUploader({
  isOpen,
  onClose,
  onSaveCertificate,
}: TrustCertificateUploaderProps) {
  const [fileType, setFileType] = useState<'image' | 'pdf'>('image');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  
  // Form fields
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [category, setCategory] = useState<CertificateItem['category']>('Academic');
  const [issueDate, setIssueDate] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [description, setDescription] = useState('');
  const [keyHighlight, setKeyHighlight] = useState('');
  const [highlights, setHighlights] = useState<string[]>([]);
  
  // Trust Text & Stamp State
  const [trustText, setTrustText] = useState('Verified Official Credential • Republic of Liberia');
  const [stampPosition, setStampPosition] = useState<StampPosition>('bottom-banner');
  const [stampOpacity, setStampOpacity] = useState<number>(95);
  const [isSaved, setIsSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    setFileType(isPdf ? 'pdf' : 'image');

    if (isPdf) {
      // For PDF, generate an object URL or simulated preview
      const url = URL.createObjectURL(file);
      setFilePreview(url);
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFilePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddHighlight = () => {
    if (keyHighlight.trim()) {
      setHighlights([...highlights, keyHighlight.trim()]);
      setKeyHighlight('');
    }
  };

  const handleRemoveHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!title.trim() || !issuer.trim()) {
      alert('Please provide at least a Certificate Title and Issuing Organization.');
      return;
    }

    const newCertificate: CertificateItem = {
      id: `cert-${Date.now()}`,
      title: title.trim(),
      issuer: issuer.trim(),
      category,
      issueDate: issueDate.trim() || new Date().getFullYear().toString(),
      credentialId: credentialId.trim() || `VER-${Date.now().toString().slice(-6)}`,
      format: fileType,
      fileUrl: filePreview || `${import.meta.env.BASE_URL}gallery/blama-formal-suit.jpg`,
      trustText: trustText.trim(),
      verified: true,
      description: description.trim() || 'Verified official accreditation and credential record.',
      keyHighlights: highlights.length > 0 ? highlights : ['Verified by institutional authority', 'Official academic / public service record'],
    };

    onSaveCertificate?.(newCertificate);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-navy-950/85 p-4 sm:p-6 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 lg:p-10 shadow-2xl border border-parchment-300 text-navy-950 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-parchment-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-gold-700">
                CREDENTIAL & CERTIFICATE UPLOADER
              </span>
              <span className="rounded-md bg-gold-100 px-2 py-0.5 text-[10px] font-mono font-semibold text-gold-900">
                PDF & Image Compatible
              </span>
            </div>
            <h3 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-navy-950">
              Upload Certificate & Apply Trust Seal
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-navy-600 max-w-xl">
              Upload credentials in PDF or high-resolution Image format. Place a customized "Text of Trust" watermark to authenticate official provenance.
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-50 text-navy-700 hover:bg-navy-100 transition-colors"
            aria-label="Close uploader"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: File Dropzone & Trust Text Stamper (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* File Upload Zone */}
            <div>
              <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-navy-600 mb-2">
                1. Select Certificate File (PDF or Image):
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
                className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-parchment-300 bg-parchment-50/50 p-6 text-center cursor-pointer transition-all hover:border-gold-500 hover:bg-gold-50/20"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-gold-400 group-hover:scale-105 transition-transform">
                  <Upload size={22} />
                </div>
                <p className="mt-3 text-sm font-bold text-navy-900">
                  {fileName ? fileName : 'Click to Browse & Upload Certificate'}
                </p>
                <p className="mt-1 text-xs text-navy-500">
                  Supports PDF documents, PNG, JPG, JPEG, and WebP (up to 20MB)
                </p>
              </div>
            </div>

            {/* Trust Text Customizer */}
            <div className="rounded-2xl border border-parchment-300 bg-parchment-50/80 p-5 space-y-4">
              <div className="flex items-center gap-2 text-gold-800 font-mono text-xs font-bold uppercase tracking-wider">
                <ShieldCheck size={16} className="text-gold-700" />
                <span>2. Place Text of Trust (Watermark / Seal):</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1.5">
                  Custom Trust Text:
                </label>
                <input
                  type="text"
                  value={trustText}
                  onChange={(e) => setTrustText(e.target.value)}
                  placeholder="e.g. Verified by Louis Arthur Grimes School of Law"
                  className="w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2 text-xs font-medium text-navy-950 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                />
              </div>

              {/* Presets */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-mono font-semibold uppercase text-navy-500">
                  Quick Trust Text Presets:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {trustTextPresets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTrustText(preset)}
                      className="rounded-md border border-parchment-300 bg-white px-2 py-1 text-[10px] text-navy-700 hover:bg-gold-50 hover:text-gold-900 transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stamp Placement */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-parchment-200">
                <div>
                  <label className="block text-[11px] font-mono font-semibold uppercase text-navy-500 mb-1">
                    Seal Position:
                  </label>
                  <select
                    value={stampPosition}
                    onChange={(e) => setStampPosition(e.target.value as StampPosition)}
                    className="w-full rounded-lg border border-navy-200 bg-white px-2.5 py-1.5 text-xs text-navy-900 focus:outline-none"
                  >
                    <option value="bottom-banner">Bottom Formal Banner</option>
                    <option value="bottom-right">Bottom-Right Stamp</option>
                    <option value="top-banner">Top Archival Header</option>
                    <option value="diagonal">Diagonal Seal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-semibold uppercase text-navy-500 mb-1">
                    Stamp Opacity ({stampOpacity}%):
                  </label>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={stampOpacity}
                    onChange={(e) => setStampOpacity(Number(e.target.value))}
                    className="w-full accent-gold-600 mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Live Stamped Preview Pane */}
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-navy-600 mb-2">
                Live Certificate Preview with Trust Stamp:
              </p>

              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border-2 border-navy-900 bg-navy-950 shadow-md flex items-center justify-center">
                {filePreview ? (
                  fileType === 'pdf' ? (
                    <div className="flex flex-col items-center justify-center p-6 text-center text-white">
                      <FileText size={48} className="text-gold-400 mb-3" />
                      <p className="font-serif text-lg font-bold">{fileName || 'Official PDF Document'}</p>
                      <p className="font-mono text-xs text-gold-300 mt-1">Authenticated PDF Certificate</p>
                    </div>
                  ) : (
                    <img
                      src={filePreview}
                      alt="Certificate Preview"
                      className="h-full w-full object-cover"
                    />
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center text-navy-300">
                    <Award size={40} className="text-gold-400/50 mb-2" />
                    <p className="text-xs">Upload a file to see real-time preview with trust seal</p>
                  </div>
                )}

                {/* Stamped Trust Text Overlay */}
                {stampPosition === 'bottom-banner' && (
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-navy-950/90 backdrop-blur-xs border-t border-gold-400 px-3.5 py-2 text-center"
                    style={{ opacity: stampOpacity / 100 }}
                  >
                    <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-gold-300 flex items-center justify-center gap-1.5">
                      <ShieldCheck size={12} className="text-gold-400" />
                      {trustText || 'Verified Official Credential'}
                    </p>
                  </div>
                )}

                {stampPosition === 'bottom-right' && (
                  <div
                    className="absolute bottom-3 right-3 rounded-lg border-2 border-gold-400 bg-navy-950/90 backdrop-blur-xs px-3 py-1.5 text-center shadow-lg"
                    style={{ opacity: stampOpacity / 100 }}
                  >
                    <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-gold-300">
                      {trustText || 'Verified Official Credential'}
                    </p>
                  </div>
                )}

                {stampPosition === 'top-banner' && (
                  <div
                    className="absolute top-0 left-0 right-0 bg-navy-950/90 backdrop-blur-xs border-b border-gold-400 px-3.5 py-1.5 text-center"
                    style={{ opacity: stampOpacity / 100 }}
                  >
                    <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-gold-300 flex items-center justify-center gap-1.5">
                      <ShieldCheck size={12} className="text-gold-400" />
                      {trustText || 'Verified Official Credential'}
                    </p>
                  </div>
                )}

                {stampPosition === 'diagonal' && (
                  <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{ opacity: stampOpacity / 100 }}
                  >
                    <div className="rotate-[-25deg] rounded-xl border-2 border-gold-400/80 bg-navy-950/80 px-6 py-2 shadow-2xl backdrop-blur-xs">
                      <p className="font-mono text-xs font-bold uppercase tracking-widest text-gold-300">
                        {trustText || 'Verified Official Credential'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Certificate Metadata Details (6 cols) */}
          <div className="lg:col-span-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-navy-600">
                3. Certificate Metadata & Attribution:
              </p>

              <div>
                <label className="block text-xs font-semibold text-navy-800">
                  Certificate Title <span className="text-gold-700">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Bachelor of Business Administration (BBA)"
                  className="mt-1.5 w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-sm font-medium text-navy-950 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-800">
                    Issuing Authority <span className="text-gold-700">*</span>
                  </label>
                  <input
                    type="text"
                    value={issuer}
                    onChange={(e) => setIssuer(e.target.value)}
                    placeholder="e.g. United Methodist University"
                    className="mt-1.5 w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-sm font-medium text-navy-950 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-800">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CertificateItem['category'])}
                    className="mt-1.5 w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-sm font-medium text-navy-950 focus:outline-none"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Fellowship">Fellowship</option>
                    <option value="Public Service">Public Service</option>
                    <option value="Legal Studies">Legal Studies</option>
                    <option value="Governance">Governance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-800">
                    Issue Date / Year
                  </label>
                  <input
                    type="text"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    placeholder="e.g. 2021 or August 2021"
                    className="mt-1.5 w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-sm font-medium text-navy-950 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-800">
                    Credential Verification ID
                  </label>
                  <input
                    type="text"
                    value={credentialId}
                    onChange={(e) => setCredentialId(e.target.value)}
                    placeholder="e.g. UMU-BBA-2021-084"
                    className="mt-1.5 w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-sm font-medium text-navy-950 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800">
                  Description / Context
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of qualifications and institutional honors conferred."
                  className="mt-1.5 w-full resize-none rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-sm font-medium text-navy-950 focus:outline-none"
                />
              </div>

              {/* Highlights List */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-navy-800">
                  Key Verification Highlights
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={keyHighlight}
                    onChange={(e) => setKeyHighlight(e.target.value)}
                    placeholder="Add bullet point..."
                    className="flex-1 rounded-xl border border-navy-200 bg-white px-3.5 py-2 text-xs font-medium text-navy-950 focus:outline-none"
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
                    className="rounded-xl bg-navy-900 px-3 py-2 text-xs font-semibold text-white hover:bg-gold-600 transition-colors"
                  >
                    Add
                  </button>
                </div>

                {highlights.length > 0 && (
                  <ul className="space-y-1 pt-1">
                    {highlights.map((h, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between rounded-lg bg-parchment-100 px-3 py-1 text-xs text-navy-800"
                      >
                        <span>• {h}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveHighlight(i)}
                          className="text-navy-400 hover:text-red-600"
                        >
                          <X size={13} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-parchment-200 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto rounded-xl border border-navy-200 px-5 py-2.5 text-xs font-semibold text-navy-800 hover:bg-navy-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="w-full sm:w-auto btn-gold justify-center !py-2.5 text-xs font-bold shadow-md"
              >
                <Check size={15} />
                <span>Authenticate & Save to Vault</span>
              </button>
            </div>

            {isSaved && (
              <div className="rounded-xl bg-green-50 p-3 text-center text-xs font-semibold text-green-800 border border-green-200 animate-fadeIn">
                Certificate successfully authenticated with Trust Seal and added to repository.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
