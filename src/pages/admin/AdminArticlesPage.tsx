import { useCallback, useEffect, useState } from 'react';
import {
  Award,
  CalendarDays,
  Edit3,
  Eye,
  FileText,
  Image as ImageIcon,
  Plus,
  RefreshCw,
  Save,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database.types';
import CertificateAttachmentField, { type AttachedCertificateData } from '@/components/admin/CertificateAttachmentField';
import CertificateViewerModal, { type ViewableCertificate } from '@/components/CertificateViewerModal';
import { getCertificateForArticle } from '@/data/certificates';

type Article = Database['public']['Tables']['articles']['Row'];
type ArticleForm = {
  title: string;
  slug: string;
  category: string;
  status: string;
  date: string;
  published_at: string;
  read_time: string;
  excerpt: string;
  content: string;
  display_order: string;
};

const blankForm: ArticleForm = {
  title: '',
  slug: '',
  category: '',
  status: 'published',
  date: '',
  published_at: '',
  read_time: '5 min read',
  excerpt: '',
  content: '',
  display_order: '0',
};

const asDateInput = (value: string | null) => (value ? value.slice(0, 10) : '');
const asDateTimeInput = (value: string | null) => (value ? new Date(value).toISOString().slice(0, 16) : '');
const normalizeSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function AdminArticlesPage() {
  const [records, setRecords] = useState<Article[]>([]);
  const [form, setForm] = useState<ArticleForm>(blankForm);
  const [attachedCert, setAttachedCert] = useState<AttachedCertificateData | null>(null);
  const [editing, setEditing] = useState<Article | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);
  const [viewingCert, setViewingCert] = useState<ViewableCertificate | null>(null);

  const loadRecords = useCallback(async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('display_order', { ascending: true })
        .order('published_at', { ascending: false, nullsFirst: false });
      if (error) {
        console.error('[Articles] Load failed:', error);
        setMessage({ kind: 'error', text: 'Unable to load articles. Please try again.' });
        return;
      }
      setRecords(data ?? []);
    } catch (error) {
      console.error('[Articles] Unexpected load failure:', error);
      setMessage({ kind: 'error', text: 'Unable to load articles. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRecords();
  }, [loadRecords]);

  const setField = <K extends keyof ArticleForm>(field: K, value: ArticleForm[K]) =>
    setForm((current) => ({ ...current, [field]: value }));

  const openCreate = () => {
    setEditing(null);
    setForm({ ...blankForm, display_order: String(records.length) });
    setAttachedCert(null);
    setMessage(null);
    setIsFormOpen(true);
  };

  const openEdit = (article: Article) => {
    setEditing(article);
    setForm({
      title: article.title,
      slug: article.slug,
      category: article.category,
      status: article.status,
      date: asDateInput(article.date),
      published_at: asDateTimeInput(article.published_at),
      read_time: article.read_time ?? '',
      excerpt: article.excerpt ?? '',
      content: article.content ?? '',
      display_order: String(article.display_order),
    });

    const existingCert = getCertificateForArticle(article.title, article.category);
    if (existingCert) {
      setAttachedCert({
        title: existingCert.title,
        issuer: existingCert.issuer,
        category: existingCert.category,
        format: existingCert.format,
        fileUrl: existingCert.fileUrl,
        trustText: existingCert.trustText,
        credentialId: existingCert.credentialId,
        description: existingCert.description,
        issueDate: existingCert.issueDate,
        keyHighlights: existingCert.keyHighlights,
      });
    } else {
      setAttachedCert(null);
    }

    setMessage(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    if (!isSaving) {
      setEditing(null);
      setForm(blankForm);
      setAttachedCert(null);
      setIsFormOpen(false);
    }
  };

  const saveArticle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving) return;
    const slug = normalizeSlug(form.slug || form.title);
    if (!form.title.trim() || !slug || !form.category.trim() || !form.status.trim()) {
      setMessage({ kind: 'error', text: 'Title, category, and status are required.' });
      return;
    }
    setIsSaving(true);
    setMessage(null);

    const payload = {
      title: form.title.trim(),
      slug,
      category: form.category.trim(),
      status: form.status.trim(),
      date: form.date || null,
      published_at: form.published_at ? new Date(form.published_at).toISOString() : new Date().toISOString(),
      read_time: form.read_time.trim() || null,
      excerpt: form.excerpt.trim() || null,
      content: form.content.trim() || null,
      display_order: Number.isFinite(Number(form.display_order)) ? Number(form.display_order) : 0,
    };

    try {
      if (editing) {
        const { data, error } = await supabase
          .from('articles')
          .update(payload)
          .eq('id', editing.id)
          .select('*')
          .single();
        if (error || !data) {
          console.error('[Articles] Update failed:', error);
          setMessage({ kind: 'error', text: 'Unable to save this article. Please try again.' });
          return;
        }
        setRecords((current) =>
          current.map((item) => (item.id === data.id ? data : item)).sort((a, b) => a.display_order - b.display_order)
        );
      } else {
        const { data, error } = await supabase.from('articles').insert(payload).select('*').single();
        if (error || !data) {
          console.error('[Articles] Create failed:', error);
          setMessage({ kind: 'error', text: 'Unable to save this article. Please try again.' });
          return;
        }
        setRecords((current) => [...current, data].sort((a, b) => a.display_order - b.display_order));
      }
      closeForm();
      setMessage({ kind: 'success', text: 'Article and attached certificate record saved successfully.' });
    } catch (error) {
      console.error('[Articles] Unexpected save failure:', error);
      setMessage({ kind: 'error', text: 'Unable to save this article. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteArticle = async (article: Article) => {
    if (deletingId || !window.confirm('Delete “' + article.title + '”? This action cannot be undone.')) return;
    setDeletingId(article.id);
    setMessage(null);
    try {
      const { error } = await supabase.from('articles').delete().eq('id', article.id);
      if (error) {
        console.error('[Articles] Delete failed:', error);
        setMessage({ kind: 'error', text: 'Unable to delete this article. Please try again.' });
        return;
      }
      setRecords((current) => current.filter((item) => item.id !== article.id));
      setMessage({ kind: 'success', text: 'Article deleted successfully.' });
    } catch (error) {
      console.error('[Articles] Unexpected delete failure:', error);
      setMessage({ kind: 'error', text: 'Unable to delete this article. Please try again.' });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fadeIn">
      {/* Header */}
      <section className="rounded-3xl border border-navy-800 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 p-7 text-white shadow-xl sm:p-9">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gold-500/30 bg-gold-500/10 text-gold-300">
              <FileText size={22} />
            </div>
            <h1 className="font-serif text-3xl font-bold">Articles, Treatises & Publications</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy-200">
              Create, edit, and publish scholarly papers, policy briefs, and legal treatises. Upload verified research credentials and publication certificates.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void loadRecords()}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-navy-600 bg-navy-950/40 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} /> Refresh
            </button>
            <button
              type="button"
              onClick={openCreate}
              className="btn-gold !py-2.5 !px-5 text-sm font-bold shadow-md"
            >
              <Plus size={17} /> Add Publication & Certificate
            </button>
          </div>
        </div>
      </section>

      {message && (
        <div
          role={message.kind === 'error' ? 'alert' : 'status'}
          className={
            'rounded-2xl border p-4 text-sm ' +
            (message.kind === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-red-200 bg-red-50 text-red-800')
          }
        >
          {message.text}
        </div>
      )}

      {/* Create / Edit Article Form */}
      {isFormOpen && (
        <section className="rounded-3xl border border-navy-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-start justify-between gap-4 border-b border-navy-100 pb-5">
            <div>
              <h2 className="font-serif text-2xl font-bold text-navy-950">
                {editing ? 'Edit Publication & Certificate' : 'Add Publication & Certificate'}
              </h2>
              <p className="mt-1 text-sm text-navy-600">
                Draft editorial research papers, attach peer-review / publication certificates, and set trust seals.
              </p>
            </div>
            <button
              type="button"
              onClick={closeForm}
              disabled={isSaving}
              aria-label="Close article form"
              className="rounded-lg p-2 text-navy-500 hover:bg-navy-50"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={saveArticle} className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field
                label="Article Title"
                required
                value={form.title}
                onChange={(value) => {
                  setField('title', value);
                  if (!editing && !form.slug) {
                    setField('slug', normalizeSlug(value));
                  }
                }}
                placeholder="e.g. Constitutional Jurisprudence & Access to Equal Justice"
              />
              <Field
                label="URL Slug"
                required
                value={form.slug}
                onChange={(value) => setField('slug', normalizeSlug(value))}
                placeholder="constitutional-jurisprudence-liberia"
              />
              <Field
                label="Category"
                required
                value={form.category}
                onChange={(value) => setField('category', value)}
                placeholder="Constitutional Law, Defense Governance, Public Policy…"
              />
              <div>
                <label className="block text-sm font-semibold text-navy-800">
                  Publication Status <span className="text-gold-700">*</span>
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setField('status', e.target.value)}
                  className="mt-2 w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-sm font-normal text-navy-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <Field
                label="Editorial Date"
                type="date"
                value={form.date}
                onChange={(value) => setField('date', value)}
                placeholder=""
              />
              <Field
                label="Estimated Read Time"
                value={form.read_time}
                onChange={(value) => setField('read_time', value)}
                placeholder="e.g. 7 min read"
              />
              <Field
                label="Display Order"
                type="number"
                value={form.display_order}
                onChange={(value) => setField('display_order', value)}
                placeholder="0"
              />
            </div>

            <label className="block text-sm font-semibold text-navy-800">
              Executive Summary / Excerpt
              <textarea
                rows={3}
                value={form.excerpt}
                onChange={(event) => setField('excerpt', event.target.value)}
                placeholder="A concise summary of the legal doctrine, administrative analysis, and key policy findings."
                className="mt-2 w-full resize-y rounded-xl border border-navy-200 px-3.5 py-2.5 text-sm font-normal text-navy-950 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
              />
            </label>

            <label className="block text-sm font-semibold text-navy-800">
              Full Article & Treatise Content
              <textarea
                rows={10}
                value={form.content}
                onChange={(event) => setField('content', event.target.value)}
                placeholder="Full text of the paper, case law citations, statutory references, and policy recommendations…"
                className="mt-2 w-full resize-y rounded-xl border border-navy-200 px-3.5 py-3 text-sm font-normal leading-relaxed text-navy-950 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
              />
            </label>

            {/* Certificate Attachment Field for Publication / Research */}
            <div className="pt-2">
              <CertificateAttachmentField
                value={attachedCert}
                onChange={setAttachedCert}
                label="Upload or Attach Publication Certificate / Research Accreditation (PDF / Image)"
                defaultCategory="Legal Studies & Jurisprudence"
                defaultIssuer="Louis Arthur Grimes School of Law"
              />
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-navy-100 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeForm}
                disabled={isSaving}
                className="rounded-xl border border-navy-300 px-4 py-2.5 text-sm font-semibold text-navy-700 hover:bg-navy-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="btn-gold !py-2.5 !px-6 text-sm font-bold shadow-md disabled:opacity-60"
              >
                <Save size={16} />
                {isSaving ? 'Saving…' : 'Save Publication'}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* List of Articles */}
      <section>
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[0, 1].map((item) => (
              <div key={item} className="h-56 animate-pulse rounded-3xl bg-white" />
            ))}
          </div>
        ) : records.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-navy-300 bg-white p-10 text-center">
            <FileText size={32} className="mx-auto text-gold-600" />
            <h2 className="mt-4 font-serif text-xl font-bold text-navy-950">No articles yet</h2>
            <p className="mt-2 text-sm text-navy-600">Create the first editorial treatise or policy paper.</p>
            <button
              type="button"
              onClick={openCreate}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gold-500 px-4 py-2.5 text-sm font-bold text-navy-950"
            >
              <Plus size={16} /> Add Article
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {records.map((article) => {
              const matchedCert = getCertificateForArticle(article.title, article.category);
              return (
                <article
                  key={article.id}
                  className="rounded-3xl border border-navy-200 bg-white p-6 shadow-sm hover:border-gold-300 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-widest text-gold-700">
                          {article.category}
                        </p>
                        <h2 className="mt-1 font-serif text-xl font-bold text-navy-950">{article.title}</h2>
                        <p className="mt-1 text-xs text-navy-500 font-mono">/{article.slug}</p>
                      </div>
                      <span
                        className={
                          'h-fit rounded-full px-2.5 py-1 text-xs font-semibold ' +
                          (article.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-navy-100 text-navy-600')
                        }
                      >
                        {article.status}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 border-t border-navy-100 pt-3 text-sm text-navy-600">
                      {article.excerpt && <p className="leading-relaxed line-clamp-2 text-xs">{article.excerpt}</p>}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-navy-500 font-mono">
                        {article.date && (
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays size={13} className="text-gold-700" />
                            {article.date}
                          </span>
                        )}
                        {article.read_time && <span>• {article.read_time}</span>}
                        <span>• Order {article.display_order}</span>
                      </div>
                    </div>

                    {/* Attached Certificate Badge */}
                    {matchedCert && (
                      <div className="mt-4 flex items-center justify-between rounded-xl border border-gold-300 bg-gold-50/70 p-2.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-gold-400">
                            {matchedCert.format === 'pdf' ? <FileText size={14} /> : <ImageIcon size={14} />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-navy-950 truncate">{matchedCert.title}</p>
                            <p className="text-[10px] font-mono text-gold-900 truncate">{matchedCert.trustText}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setViewingCert(matchedCert)}
                          className="flex items-center gap-1 rounded-lg border border-navy-300 bg-white px-2 py-1 text-xs font-semibold text-navy-800 hover:bg-gold-100 shrink-0"
                        >
                          <Eye size={12} />
                          <span>Inspect</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex gap-3 border-t border-parchment-100 pt-3">
                    <button
                      type="button"
                      onClick={() => openEdit(article)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-navy-300 px-3 py-2 text-xs font-semibold text-navy-800 hover:bg-navy-50"
                    >
                      <Edit3 size={14} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteArticle(article)}
                      disabled={deletingId !== null}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
                    >
                      {deletingId === article.id ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />} Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Certificate Viewer Modal */}
      <CertificateViewerModal certificate={viewingCert} onClose={() => setViewingCert(null)} />
    </div>
  );
}

function Field({
  label,
  required,
  type = 'text',
  value,
  onChange,
  placeholder,
}: {
  label: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block text-sm font-semibold text-navy-800">
      {label}
      {required && <span className="ml-1 text-gold-700">*</span>}
      <input
        required={required}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-navy-200 px-3.5 py-2.5 text-sm font-normal text-navy-950 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
      />
    </label>
  );
}
