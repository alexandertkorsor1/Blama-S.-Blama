import { useState, useEffect, useRef } from 'react';
import {
  Award,
  ShieldCheck,
  FileText,
  Image as ImageIcon,
  Plus,
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  RefreshCw,
  Save,
  X,
  Upload,
  Check,
  Sparkles,
  AlignLeft,
  Calendar,
} from 'lucide-react';
import { certificates as initialCertificates, type CertificateItem } from '@/data/certificates';
import CertificateViewerModal from '@/components/CertificateViewerModal';

const CERT_STORAGE_KEY = 'blama_portfolio_certificates_vault_v1';

const certificateCategories = [
  'Academic',
  'Fellowship',
  'Public Service',
  'Legal Studies',
  'Governance',
  'Professional Certification',
  'Executive Training',
];

const defaultTrustPresets = [
  'Verified Official Credential • Republic of Liberia',
  'Certified True Academic Record • United Methodist University',
  'Authentic Public-Service Leadership Credential • PYPP Class XI',
  'Official Civilian Defense Service Record • Ministry of National Defense',
  'Verified Legal Scholar Standing • Louis Arthur Grimes School of Law',
  'Official Judicial Field Observation Credential • Sinoe County',
];

export default function AdminCertificatesPage() {
  const [certList, setCertList] = useState<CertificateItem[]>(() => {
    try {
      const saved = localStorage.getItem(CERT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return initialCertificates;
  });

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<CertificateItem | null>(null);
  const [viewingCert, setViewingCert] = useState<CertificateItem | null>(null);
  const [message, setMessage] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [category, setCategory] = useState<CertificateItem['category']>('Academic');
  const [issueDate, setIssueDate] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [format, setFormat] = useState<'pdf' | 'image'>('pdf');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [trustText, setTrustText] = useState('Verified Official Credential • Republic of Liberia');
  const [description, setDescription] = useState('');
  const [highlights, setHighlights] = useState<string[]>([]);
  const [newHighlight, setNewHighlight] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save to LocalStorage whenever certList updates
  useEffect(() => {
    try {
      localStorage.setItem(CERT_STORAGE_KEY, JSON.stringify(certList));
      // Dispatch custom event to sync public components in real-time
      window.dispatchEvent(new Event('certificates-updated'));
    } catch (e) {
      console.error('Failed to persist certificates:', e);
    }
  }, [certList]);

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

  const openCreate = () => {
    setEditingCert(null);
    setTitle('');
    setIssuer('');
    setCategory('Academic');
    setIssueDate(new Date().getFullYear().toString());
    setCredentialId(`VER-${Date.now().toString().slice(-6)}`);
    setFormat('pdf');
    setFileUrl(`${import.meta.env.BASE_URL}gallery/blama-formal-suit.jpg`);
    setFileName('');
    setTrustText('Verified Official Credential • Republic of Liberia');
    setDescription('');
    setHighlights(['Conferred with institutional commendation', 'Official authenticated credential']);
    setNewHighlight('');
    setMessage(null);
    setIsFormOpen(true);
  };

  const openEdit = (cert: CertificateItem) => {
    setEditingCert(cert);
    setTitle(cert.title);
    setIssuer(cert.issuer);
    setCategory(cert.category);
    setIssueDate(cert.issueDate || '');
    setCredentialId(cert.credentialId);
    setFormat(cert.format);
    setFileUrl(cert.fileUrl);
    setFileName(cert.title);
    setTrustText(cert.trustText);
    setDescription(cert.description);
    setHighlights(cert.keyHighlights || []);
    setNewHighlight('');
    setMessage(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingCert(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    setFormat(isPdf ? 'pdf' : 'image');

    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
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

  const handleAddHighlight = () => {
    if (newHighlight.trim()) {
      setHighlights([...highlights, newHighlight.trim()]);
      setNewHighlight('');
    }
  };

  const handleRemoveHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !issuer.trim()) {
      setMessage({ kind: 'error', text: 'Certificate title and issuing authority are required.' });
      return;
    }

    const payload: CertificateItem = {
      id: editingCert ? editingCert.id : `cert-${Date.now()}`,
      title: title.trim(),
      issuer: issuer.trim(),
      category,
      issueDate: issueDate.trim() || new Date().getFullYear().toString(),
      credentialId: credentialId.trim() || `VER-${Date.now().toString().slice(-6)}`,
      format,
      fileUrl: fileUrl || `${import.meta.env.BASE_URL}gallery/blama-formal-suit.jpg`,
      trustText: trustText.trim() || 'Verified Official Credential • Republic of Liberia',
      verified: true,
      description: description.trim() || 'Official accredited credential and institutional record.',
      keyHighlights: highlights.length > 0 ? highlights : ['Official authenticated credential'],
    };

    if (editingCert) {
      setCertList((prev) => prev.map((c) => (c.id === editingCert.id ? payload : c)));
      setMessage({ kind: 'success', text: `Certificate “${payload.title}” updated successfully.` });
    } else {
      setCertList((prev) => [payload, ...prev]);
      setMessage({ kind: 'success', text: `Certificate “${payload.title}” created and added to Vault.` });
    }

    closeForm();
  };

  const handleDelete = (cert: CertificateItem) => {
    if (!window.confirm(`Delete certificate “${cert.title}”? This action cannot be undone.`)) return;
    setCertList((prev) => prev.filter((c) => c.id !== cert.id));
    setMessage({ kind: 'success', text: `Certificate “${cert.title}” deleted successfully.` });
  };

  const handleResetToDefaults = () => {
    if (!window.confirm('Reset the certificate repository to curated defaults?')) return;
    setCertList(initialCertificates);
    setMessage({ kind: 'success', text: 'Certificate vault reset to authentic curated records.' });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-fadeIn font-sans">
      {/* Top Banner */}
      <section className="rounded-3xl border border-navy-800 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 p-7 text-white shadow-xl sm:p-9">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gold-500/30 bg-gold-500/10 text-gold-300">
              <Award size={22} />
            </div>
            <h1 className="font-serif text-3xl font-bold">Certificate & Credential Vault</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy-200">
              Administrative management of all authenticated degrees, diplomas, national fellowship awards, and public service commendations.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleResetToDefaults}
              className="inline-flex items-center gap-2 rounded-xl border border-navy-600 bg-navy-950/40 px-4 py-2.5 text-sm font-semibold text-white hover:border-gold-500 transition-colors"
            >
              <RefreshCw size={16} /> Reset Archive
            </button>
            <button
              type="button"
              onClick={openCreate}
              className="btn-gold !py-2.5 !px-5 text-sm font-bold shadow-md"
            >
              <Plus size={17} /> Add New Certificate
            </button>
          </div>
        </div>
      </section>

      {/* Alert Notice */}
      {message && (
        <div
          role={message.kind === 'error' ? 'alert' : 'status'}
          className={
            'rounded-2xl border p-4 text-sm font-medium ' +
            (message.kind === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-red-200 bg-red-50 text-red-800')
          }
        >
          {message.text}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-navy-200 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const count = cat === 'All' ? certList.length : certList.filter((c) => c.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-navy-900 text-white shadow-xs'
                    : 'bg-cream-50 text-navy-800 border border-navy-200 hover:bg-gold-50'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search certificates, ref codes..."
            className="w-full sm:w-64 rounded-xl border border-navy-200 bg-white py-2 pl-9 pr-3 text-xs text-navy-900 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
          />
        </div>
      </div>

      {/* Create / Edit Certificate Modal Form */}
      {isFormOpen && (
        <section className="rounded-3xl border border-navy-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-start justify-between gap-4 border-b border-navy-100 pb-5">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-gold-700">
                CREDENTIAL MANAGEMENT
              </span>
              <h2 className="mt-1 font-serif text-2xl font-bold text-navy-950">
                {editingCert ? 'Edit Certificate & Trust Watermark' : 'Upload New Certificate to Vault'}
              </h2>
              <p className="mt-1 text-sm text-navy-600">
                Configure authenticated document details, description, key highlights, and custom Text of Trust seal.
              </p>
            </div>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-lg p-2 text-navy-500 hover:bg-navy-50"
              aria-label="Close form"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSave} className="mt-6 space-y-6">
            {/* File Upload Dropzone */}
            <div className="space-y-2">
              <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-navy-700">
                Certificate Document File (PDF or High-Res Image) *
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
                className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-navy-300 bg-navy-50/40 p-6 text-center cursor-pointer transition-all hover:border-gold-500 hover:bg-gold-50/20"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-gold-400 group-hover:scale-105 transition-transform shadow-xs">
                  <Upload size={22} />
                </div>
                <p className="mt-3 text-sm font-bold text-navy-950">
                  {fileName ? fileName : 'Click to Browse & Select PDF or Image File'}
                </p>
                <p className="mt-1 text-xs text-navy-500">
                  Supports PDF documents, PNG, JPG, JPEG, and WebP (up to 20MB)
                </p>
              </div>
            </div>

            {/* Core Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy-800">
                  Certificate Title <span className="text-gold-700">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Bachelor of Business Administration (BBA) in Management"
                  className="mt-1.5 w-full rounded-xl border border-navy-200 px-3.5 py-2.5 text-xs font-medium text-navy-950 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800">
                  Issuing Authority / Institution <span className="text-gold-700">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  placeholder="e.g. United Methodist University (UMU)"
                  className="mt-1.5 w-full rounded-xl border border-navy-200 px-3.5 py-2.5 text-xs font-medium text-navy-950 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800">
                  Category / Classification
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CertificateItem['category'])}
                  className="mt-1.5 w-full rounded-xl border border-navy-200 px-3.5 py-2.5 text-xs font-medium text-navy-950 focus:outline-none"
                >
                  <option value="Academic">Academic</option>
                  <option value="Fellowship">Fellowship</option>
                  <option value="Public Service">Public Service</option>
                  <option value="Legal Studies">Legal Studies</option>
                  <option value="Governance">Governance</option>
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
                  className="mt-1.5 w-full rounded-xl border border-navy-200 px-3.5 py-2.5 text-xs font-medium text-navy-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800">
                  Credential Verification Ref ID
                </label>
                <input
                  type="text"
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value)}
                  placeholder="e.g. UMU-BBA-2021-MGMT-084"
                  className="mt-1.5 w-full rounded-xl border border-navy-200 px-3.5 py-2.5 text-xs font-medium text-navy-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800">
                  Document Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as 'pdf' | 'image')}
                  className="mt-1.5 w-full rounded-xl border border-navy-200 px-3.5 py-2.5 text-xs font-medium text-navy-950 focus:outline-none"
                >
                  <option value="pdf">📄 PDF Document</option>
                  <option value="image">🖼 Stamped Image Certificate</option>
                </select>
              </div>
            </div>

            {/* Description Textarea */}
            <div>
              <label className="block text-xs font-semibold text-navy-800">
                Detailed Certificate Description & Scope of Qualification:
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed explanation of the coursework, institutional honors, and administrative scope conferred."
                className="mt-1.5 w-full resize-none rounded-xl border border-navy-200 px-3.5 py-2.5 text-xs font-medium text-navy-950 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
              />
            </div>

            {/* Highlights List */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-navy-800">
                Key Accreditations & Commendations:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  placeholder="e.g. Four-year comprehensive curriculum in enterprise administration..."
                  className="flex-1 rounded-xl border border-navy-200 px-3.5 py-2 text-xs font-medium text-navy-950 focus:outline-none"
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
                  className="rounded-xl bg-navy-900 px-4 py-2 text-xs font-bold text-white hover:bg-gold-600 transition-colors"
                >
                  Add
                </button>
              </div>

              {highlights.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {highlights.map((h, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-parchment-100 px-3 py-1 text-xs text-navy-800 border border-parchment-300"
                    >
                      <span>• {h}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(i)}
                        className="text-navy-400 hover:text-red-600"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Text of Trust Seal */}
            <div className="rounded-2xl border border-parchment-300 bg-parchment-50/70 p-4 sm:p-5 space-y-3">
              <label className="block text-xs font-bold text-navy-900 flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-gold-700" />
                <span>Custom "Text of Trust" Watermark Seal:</span>
              </label>
              <input
                type="text"
                value={trustText}
                onChange={(e) => setTrustText(e.target.value)}
                placeholder="e.g. Verified Official Academic Credential • United Methodist University"
                className="w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-xs font-medium text-navy-950 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
              />

              <div className="space-y-1">
                <p className="text-[10px] font-mono font-semibold uppercase text-navy-500">
                  Quick Trust Text Presets:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {defaultTrustPresets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTrustText(preset)}
                      className="rounded-md border border-parchment-300 bg-white px-2.5 py-1 text-[10px] text-navy-700 hover:bg-gold-50 hover:text-gold-950 transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-navy-100 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-xl border border-navy-300 px-4 py-2.5 text-sm font-semibold text-navy-700 hover:bg-navy-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-gold !py-2.5 !px-6 text-sm font-bold shadow-md"
              >
                <Save size={16} />
                <span>{editingCert ? 'Save Changes' : 'Authenticate & Save to Vault'}</span>
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Grid of All Certificates */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCerts.map((cert) => (
          <article
            key={cert.id}
            className="rounded-3xl border border-navy-200 bg-white p-6 shadow-sm hover:border-gold-300 transition-colors flex flex-col justify-between"
          >
            <div>
              {/* Header Badge */}
              <div className="flex items-start justify-between gap-2 border-b border-parchment-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-navy-100 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-navy-800">
                    {cert.category}
                  </span>
                  <span className="rounded-md bg-gold-100 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-gold-900">
                    {cert.format === 'pdf' ? '📄 PDF' : '🖼 IMAGE'}
                  </span>
                </div>

                <span className="flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-700">
                  <ShieldCheck size={13} />
                  Verified
                </span>
              </div>

              {/* Title & Issuer */}
              <h3 className="mt-4 font-serif text-lg font-bold text-navy-950 leading-snug">
                {cert.title}
              </h3>
              <p className="mt-1 text-xs font-semibold text-gold-800">
                {cert.issuer} {cert.issueDate ? `• ${cert.issueDate}` : ''}
              </p>

              {/* Trust Text Stamp */}
              <div className="mt-3 rounded-lg border border-gold-300 bg-gold-50/70 p-2.5">
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-gold-950 line-clamp-1 flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-gold-700 shrink-0" />
                  <span>{cert.trustText}</span>
                </p>
              </div>

              {/* Description */}
              <p className="mt-3 text-xs text-navy-600 leading-relaxed font-sans line-clamp-3">
                {cert.description}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-5 pt-4 border-t border-parchment-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setViewingCert(cert)}
                className="inline-flex items-center gap-1 text-xs font-bold text-navy-800 hover:text-gold-700 transition-colors"
              >
                <Eye size={13} />
                <span>Inspect</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(cert)}
                  className="inline-flex items-center gap-1 rounded-lg border border-navy-300 px-2.5 py-1.5 text-xs font-semibold text-navy-800 hover:bg-navy-50 transition-colors"
                >
                  <Edit3 size={13} />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cert)}
                  className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Certificate Viewer Modal */}
      <CertificateViewerModal certificate={viewingCert} onClose={() => setViewingCert(null)} />
    </div>
  );
}
