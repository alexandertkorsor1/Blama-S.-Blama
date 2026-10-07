import { useState, useEffect, useRef } from 'react';
import {
  FileText,
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
  ShieldCheck,
  Scale,
  Landmark,
  GraduationCap,
  BookOpen,
  Download,
  Printer,
  Calendar,
  Layers,
} from 'lucide-react';
import { initialHubDocuments, type HubDocumentItem } from '@/data/documents';

const DOCS_STORAGE_KEY = 'blama_portfolio_document_hub_v1';

const categoriesList = [
  'Executive Summary',
  'Full Compendium',
  'Public Service',
  'Policy White Paper',
  'Legal Jurisprudence',
  'Leadership Briefing',
  'Academic Dissertation',
  'Defense Administration',
];

const targetSectionOptions = [
  { value: 'cv', label: 'Executive Curriculum Vitae (CV)' },
  { value: 'education', label: 'Education & Academic Record' },
  { value: 'public-service', label: 'Public Service & Defense' },
  { value: 'articles', label: 'Published Policy Papers & Treatises' },
  { value: 'achievements', label: 'Achievements & Fellowships' },
];

export default function AdminDocumentsPage() {
  const [docList, setDocList] = useState<HubDocumentItem[]>(() => {
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

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<HubDocumentItem | null>(null);
  const [previewDoc, setPreviewDoc] = useState<HubDocumentItem | null>(null);
  const [message, setMessage] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Executive Summary');
  const [badge, setBadge] = useState('Official Brief');
  const [description, setDescription] = useState('');
  const [pageCount, setPageCount] = useState('2 Pages');
  const [targetDossierSection, setTargetDossierSection] = useState('cv');
  const [format, setFormat] = useState<'pdf' | 'text' | 'docx'>('pdf');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [attestationText, setAttestationText] = useState('');
  const [publishedDate, setPublishedDate] = useState('2026');
  const [citationText, setCitationText] = useState('');
  const [customBody, setCustomBody] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save to LocalStorage and trigger event
  useEffect(() => {
    try {
      localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(docList));
      window.dispatchEvent(new Event('documents-updated'));
    } catch (e) {
      console.error('Failed to persist documents:', e);
    }
  }, [docList]);

  const categories = ['All', ...new Set(docList.map((d) => d.category))];

  const filteredDocs = docList.filter((doc) => {
    const matchesCat = activeCategory === 'All' || doc.category === activeCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const openCreate = () => {
    setEditingDoc(null);
    setTitle('');
    setCategory('Executive Summary');
    setBadge('Official Publication');
    setDescription('');
    setPageCount('3 Pages');
    setTargetDossierSection('cv');
    setFormat('pdf');
    setFileUrl('');
    setFileName('');
    setAttestationText('Authenticated at Monrovia, Republic of Liberia • President\'s Young Professionals Program Class XI.');
    setPublishedDate(new Date().getFullYear().toString());
    setCitationText('');
    setCustomBody('');
    setMessage(null);
    setIsFormOpen(true);
  };

  const openEdit = (doc: HubDocumentItem) => {
    setEditingDoc(doc);
    setTitle(doc.title);
    setCategory(doc.category);
    setBadge(doc.badge);
    setDescription(doc.description);
    setPageCount(doc.pageCount);
    setTargetDossierSection(doc.targetDossierSection);
    setFormat(doc.format);
    setFileUrl(doc.fileUrl || '');
    setFileName(doc.fileName || doc.title);
    setAttestationText(doc.attestationText || '');
    setPublishedDate(doc.publishedDate || '2026');
    setCitationText(doc.citationText || '');
    setCustomBody(doc.customBody || '');
    setMessage(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingDoc(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    setFormat(isPdf ? 'pdf' : 'text');

    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    }

    if (isPdf) {
      setFileUrl(URL.createObjectURL(file));
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomBody(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setMessage({ kind: 'error', text: 'Document title and description are required.' });
      return;
    }

    const payload: HubDocumentItem = {
      id: editingDoc ? editingDoc.id : `doc-${Date.now()}`,
      title: title.trim(),
      category: category.trim(),
      badge: badge.trim() || 'Official Document',
      description: description.trim(),
      pageCount: pageCount.trim() || '2 Pages',
      targetDossierSection,
      format,
      fileUrl: fileUrl.trim() || undefined,
      fileName: fileName.trim() || undefined,
      attestationText: attestationText.trim() || 'Official Attestation • Republic of Liberia',
      publishedDate: publishedDate.trim() || new Date().getFullYear().toString(),
      citationText: citationText.trim() || `Blama, S. B. (${publishedDate}). ${title}. Monrovia: Republic of Liberia.`,
      customBody: customBody.trim() || undefined,
    };

    if (editingDoc) {
      setDocList((prev) => prev.map((d) => (d.id === editingDoc.id ? payload : d)));
      setMessage({ kind: 'success', text: `Document “${payload.title}” updated successfully.` });
    } else {
      setDocList((prev) => [payload, ...prev]);
      setMessage({ kind: 'success', text: `Document “${payload.title}” added to the Document Hub.` });
    }

    closeForm();
  };

  const handleDelete = (doc: HubDocumentItem) => {
    if (!window.confirm(`Delete document “${doc.title}” from the Document Hub?`)) return;
    setDocList((prev) => prev.filter((d) => d.id !== doc.id));
    setMessage({ kind: 'success', text: `Document “${doc.title}” removed.` });
  };

  const handleResetDefaults = () => {
    if (!window.confirm('Reset the Curriculum Vitae & Document Hub to curated official defaults?')) return;
    setDocList(initialHubDocuments);
    setMessage({ kind: 'success', text: 'Document Hub restored to standard executive collection.' });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-fadeIn font-sans">
      {/* Top Banner */}
      <section className="rounded-3xl border border-navy-800 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 p-7 text-white shadow-xl sm:p-9">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gold-500/30 bg-gold-500/10 text-gold-300">
              <FileText size={22} />
            </div>
            <h1 className="font-serif text-3xl font-bold">Curriculum Vitae & Document Hub</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy-200">
              Administrative management of downloadable executive CVs, defense briefings, legal monographs, and policy treatises displayed in the Document Hub.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-2 rounded-xl border border-navy-600 bg-navy-950/40 px-4 py-2.5 text-sm font-semibold text-white hover:border-gold-500 transition-colors"
            >
              <RefreshCw size={16} /> Reset Default Docs
            </button>
            <button
              type="button"
              onClick={openCreate}
              className="btn-gold !py-2.5 !px-5 text-sm font-bold shadow-md"
            >
              <Plus size={17} /> Add New Document
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
            const count = cat === 'All' ? docList.length : docList.filter((d) => d.category === cat).length;
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
            placeholder="Search documents, titles..."
            className="w-full sm:w-64 rounded-xl border border-navy-200 bg-white py-2 pl-9 pr-3 text-xs text-navy-900 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
          />
        </div>
      </div>

      {/* Create / Edit Document Modal Form */}
      {isFormOpen && (
        <section className="rounded-3xl border border-navy-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-start justify-between gap-4 border-b border-navy-100 pb-5">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-gold-700">
                DOCUMENT HUB PUBLICATION
              </span>
              <h2 className="mt-1 font-serif text-2xl font-bold text-navy-950">
                {editingDoc ? `Edit Document: ${editingDoc.title}` : 'Add New Document to Hub'}
              </h2>
              <p className="mt-1 text-sm text-navy-600">
                Configure document titles, page counts, target dossier chapters, official attestation seals, and file attachments.
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
                Downloadable PDF or Document File (Optional Attachment)
              </label>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="application/pdf,.txt,.docx"
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
                  {fileName ? fileName : 'Click to Browse & Select PDF or Text File'}
                </p>
                <p className="mt-1 text-xs text-navy-500">
                  Select an authenticated PDF, Word doc, or Markdown brief for direct downloading
                </p>
              </div>
            </div>

            {/* Core Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy-800">
                  Document Title <span className="text-gold-700">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Official Executive Curriculum Vitae (CV)"
                  className="mt-1.5 w-full rounded-xl border border-navy-200 px-3.5 py-2.5 text-xs font-medium text-navy-950 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800">
                  Category / Classification
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Executive Summary or Policy White Paper"
                  className="mt-1.5 w-full rounded-xl border border-navy-200 px-3.5 py-2.5 text-xs font-medium text-navy-950 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800">
                  Badge Label
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. Standard 2-Page Brief or PYPP Class XI"
                  className="mt-1.5 w-full rounded-xl border border-navy-200 px-3.5 py-2.5 text-xs font-medium text-navy-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800">
                  Page Count Indicator
                </label>
                <input
                  type="text"
                  value={pageCount}
                  onChange={(e) => setPageCount(e.target.value)}
                  placeholder="e.g. 2 Pages or 5 Pages"
                  className="mt-1.5 w-full rounded-xl border border-navy-200 px-3.5 py-2.5 text-xs font-medium text-navy-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800">
                  Target Dossier Chapter (For Instant Reading)
                </label>
                <select
                  value={targetDossierSection}
                  onChange={(e) => setTargetDossierSection(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-navy-200 px-3.5 py-2.5 text-xs font-medium text-navy-950 focus:outline-none"
                >
                  {targetSectionOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800">
                  Publication Year / Date
                </label>
                <input
                  type="text"
                  value={publishedDate}
                  onChange={(e) => setPublishedDate(e.target.value)}
                  placeholder="e.g. 2026 or 2023-2025"
                  className="mt-1.5 w-full rounded-xl border border-navy-200 px-3.5 py-2.5 text-xs font-medium text-navy-950 focus:outline-none"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-navy-800">
                Executive Document Description <span className="text-gold-700">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed summary of the document's scope, analytical framework, and intended institutional audience."
                className="mt-1.5 w-full resize-none rounded-xl border border-navy-200 px-3.5 py-2.5 text-xs font-medium text-navy-950 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
              />
            </div>

            {/* Attestation Seal & Citations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy-800">
                  Official Digital Attestation Text
                </label>
                <input
                  type="text"
                  value={attestationText}
                  onChange={(e) => setAttestationText(e.target.value)}
                  placeholder="e.g. Authenticated at Monrovia, Republic of Liberia • PYPP Class XI."
                  className="mt-1.5 w-full rounded-xl border border-navy-200 px-3.5 py-2.5 text-xs font-medium text-navy-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800">
                  Formal Academic Citation Line
                </label>
                <input
                  type="text"
                  value={citationText}
                  onChange={(e) => setCitationText(e.target.value)}
                  placeholder="e.g. Blama, S. B. (2026). Executive Compendium. Monrovia: Republic of Liberia."
                  className="mt-1.5 w-full rounded-xl border border-navy-200 px-3.5 py-2.5 text-xs font-medium text-navy-950 focus:outline-none"
                />
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
                <span>{editingDoc ? 'Save Document Changes' : 'Publish Document to Hub'}</span>
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Grid of All Documents */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDocs.map((doc) => (
          <article
            key={doc.id}
            className="rounded-3xl border border-navy-200 bg-white p-6 shadow-sm hover:border-gold-300 transition-colors flex flex-col justify-between"
          >
            <div>
              {/* Header Badge */}
              <div className="flex items-start justify-between gap-2 border-b border-parchment-200 pb-3">
                <span className="rounded-md bg-navy-100 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-navy-800">
                  {doc.category}
                </span>

                <span className="rounded-md bg-gold-100 px-2 py-0.5 text-[10px] font-mono font-semibold text-gold-900">
                  {doc.badge} • {doc.pageCount}
                </span>
              </div>

              {/* Title */}
              <h3 className="mt-4 font-serif text-lg font-bold text-navy-950 leading-snug">
                {doc.title}
              </h3>
              <p className="mt-1 text-xs font-semibold text-gold-800">
                Published {doc.publishedDate} • Chapter: {doc.targetDossierSection}
              </p>

              {/* Attestation text */}
              {doc.attestationText && (
                <div className="mt-3 rounded-lg border border-gold-300 bg-gold-50/70 p-2.5">
                  <p className="font-mono text-[10px] font-bold text-gold-950 line-clamp-1 flex items-center gap-1.5">
                    <ShieldCheck size={12} className="text-gold-700 shrink-0" />
                    <span>{doc.attestationText}</span>
                  </p>
                </div>
              )}

              {/* Description */}
              <p className="mt-3 text-xs text-navy-600 leading-relaxed font-sans line-clamp-3">
                {doc.description}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-5 pt-4 border-t border-parchment-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setPreviewDoc(doc)}
                className="inline-flex items-center gap-1 text-xs font-bold text-navy-800 hover:text-gold-700 transition-colors"
              >
                <Eye size={13} />
                <span>Quick View</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(doc)}
                  className="inline-flex items-center gap-1 rounded-lg border border-navy-300 px-2.5 py-1.5 text-xs font-semibold text-navy-800 hover:bg-navy-50 transition-colors"
                >
                  <Edit3 size={13} />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(doc)}
                  className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Quick Preview Modal */}
      {previewDoc && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy-950/85 p-4 sm:p-6 backdrop-blur-md animate-fadeIn"
          onClick={() => setPreviewDoc(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-parchment-300 text-navy-950 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-parchment-200 pb-4">
              <div>
                <span className="rounded-md bg-navy-900 px-2.5 py-0.5 text-xs font-mono font-bold uppercase tracking-wider text-white">
                  {previewDoc.category}
                </span>
                <h3 className="mt-2 font-serif text-2xl font-bold text-navy-950">
                  {previewDoc.title}
                </h3>
                <p className="mt-1 text-xs text-gold-800 font-semibold">
                  Badge: {previewDoc.badge} • Length: {previewDoc.pageCount} • Target: {previewDoc.targetDossierSection}
                </p>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-50 text-navy-700 hover:bg-navy-100"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs leading-relaxed text-navy-700 font-sans">
              <div className="rounded-xl bg-parchment-50 p-4 border border-parchment-200">
                <p className="font-mono text-[10px] font-bold uppercase text-navy-500 mb-1">Summary:</p>
                <p>{previewDoc.description}</p>
              </div>

              {previewDoc.attestationText && (
                <div className="rounded-xl bg-gold-50/70 p-3.5 border border-gold-300">
                  <p className="font-mono text-[10px] font-bold uppercase text-gold-900 mb-0.5">Attestation Seal:</p>
                  <p className="font-mono text-gold-950">{previewDoc.attestationText}</p>
                </div>
              )}

              {previewDoc.citationText && (
                <div className="rounded-xl bg-navy-50 p-3.5 border border-navy-200">
                  <p className="font-mono text-[10px] font-bold uppercase text-navy-600 mb-0.5">Citation Line:</p>
                  <p className="font-mono text-navy-900">{previewDoc.citationText}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setPreviewDoc(null)}
                className="btn-secondary !py-2 text-xs font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
