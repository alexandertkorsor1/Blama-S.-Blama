import { useCallback, useEffect, useState } from 'react';
import { Award, Edit3, Eye, FileText, GraduationCap, Image as ImageIcon, Plus, RefreshCw, Save, ShieldCheck, Trash2, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database.types';
import CertificateAttachmentField, { type AttachedCertificateData } from '@/components/admin/CertificateAttachmentField';
import CertificateViewerModal, { type ViewableCertificate } from '@/components/CertificateViewerModal';
import { getCertificateForEducation } from '@/data/certificates';

type Education = Database['public']['Tables']['education']['Row'];
type EducationForm = {
  institution: string;
  degree: string;
  field: string;
  year: string;
  status: string;
  description: string;
  display_order: string;
  published: boolean;
};

const blankForm: EducationForm = {
  institution: '',
  degree: '',
  field: '',
  year: '',
  status: 'Completed',
  description: '',
  display_order: '0',
  published: true,
};

const optional = (value: string) => value.trim() || null;

export default function AdminEducationPage() {
  const [records, setRecords] = useState<Education[]>([]);
  const [form, setForm] = useState<EducationForm>(blankForm);
  const [attachedCert, setAttachedCert] = useState<AttachedCertificateData | null>(null);
  const [editing, setEditing] = useState<Education | null>(null);
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
        .from('education')
        .select('*')
        .order('display_order', { ascending: true })
        .order('year', { ascending: false });
      if (error) {
        console.error('[Education] Load failed:', error);
        setMessage({ kind: 'error', text: 'Unable to load education records. Please try again.' });
        return;
      }
      setRecords(data ?? []);
    } catch (error) {
      console.error('[Education] Unexpected load failure:', error);
      setMessage({ kind: 'error', text: 'Unable to load education records. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRecords();
  }, [loadRecords]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...blankForm, display_order: String(records.length) });
    setAttachedCert(null);
    setMessage(null);
    setIsFormOpen(true);
  };

  const openEdit = (record: Education) => {
    setEditing(record);
    setForm({
      institution: record.institution,
      degree: record.degree,
      field: record.field,
      year: record.year ?? '',
      status: record.status,
      description: record.description ?? '',
      display_order: String(record.display_order),
      published: record.published,
    });

    const existingCert = getCertificateForEducation(record.degree, record.institution);
    if (existingCert) {
      setAttachedCert({
        title: existingCert.title,
        issuer: existingCert.issuer,
        category: existingCert.category,
        format: existingCert.format,
        fileUrl: existingCert.fileUrl,
        trustText: existingCert.trustText,
        credentialId: existingCert.credentialId,
      });
    } else {
      setAttachedCert(null);
    }

    setMessage(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    if (!isSaving) {
      setIsFormOpen(false);
      setEditing(null);
      setForm(blankForm);
      setAttachedCert(null);
    }
  };

  const setField = <K extends keyof EducationForm>(field: K, value: EducationForm[K]) =>
    setForm((current) => ({ ...current, [field]: value }));

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving) return;
    if (!form.institution.trim() || !form.degree.trim() || !form.field.trim()) {
      setMessage({ kind: 'error', text: 'Institution, degree, and field are required.' });
      return;
    }
    setIsSaving(true);
    setMessage(null);

    const payload = {
      institution: form.institution.trim(),
      degree: form.degree.trim(),
      field: form.field.trim(),
      year: optional(form.year),
      status: form.status.trim() || 'Completed',
      description: optional(form.description),
      display_order: Number.isFinite(Number(form.display_order)) ? Number(form.display_order) : 0,
      published: form.published,
    };

    try {
      if (editing) {
        const { data, error } = await supabase
          .from('education')
          .update(payload)
          .eq('id', editing.id)
          .select('*')
          .single();
        if (error || !data) {
          console.error('[Education] Update failed:', error);
          setMessage({ kind: 'error', text: 'Unable to save this education record. Please try again.' });
          return;
        }
        setRecords((current) =>
          current.map((record) => (record.id === data.id ? data : record)).sort((a, b) => a.display_order - b.display_order)
        );
      } else {
        const { data, error } = await supabase.from('education').insert(payload).select('*').single();
        if (error || !data) {
          console.error('[Education] Create failed:', error);
          setMessage({ kind: 'error', text: 'Unable to save this education record. Please try again.' });
          return;
        }
        setRecords((current) => [...current, data].sort((a, b) => a.display_order - b.display_order));
      }
      setMessage({ kind: 'success', text: 'Education record and certificate settings saved successfully.' });
      closeForm();
    } catch (error) {
      console.error('[Education] Unexpected save failure:', error);
      setMessage({ kind: 'error', text: 'Unable to save this education record. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (record: Education) => {
    if (
      deletingId ||
      !window.confirm('Delete “' + record.degree + '” at ' + record.institution + '? This action cannot be undone.')
    )
      return;
    setDeletingId(record.id);
    setMessage(null);
    try {
      const { error } = await supabase.from('education').delete().eq('id', record.id);
      if (error) {
        console.error('[Education] Delete failed:', error);
        setMessage({ kind: 'error', text: 'Unable to delete this education record. Please try again.' });
        return;
      }
      setRecords((current) => current.filter((item) => item.id !== record.id));
      setMessage({ kind: 'success', text: 'Education record deleted successfully.' });
    } catch (error) {
      console.error('[Education] Unexpected delete failure:', error);
      setMessage({ kind: 'error', text: 'Unable to delete this education record. Please try again.' });
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
              <GraduationCap size={22} />
            </div>
            <h1 className="font-serif text-3xl font-bold">Education & Credentials</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy-200">
              Manage academic qualifications and upload authenticated degrees, transcripts, or certificates with official trust seals.
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
              <Plus size={17} /> Add Education & Certificate
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

      {/* Education Create / Edit Form Modal */}
      {isFormOpen && (
        <section className="rounded-3xl border border-navy-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-start justify-between gap-4 border-b border-navy-100 pb-5">
            <div>
              <h2 className="font-serif text-2xl font-bold text-navy-950">
                {editing ? 'Edit Education & Certificate' : 'Add Education & Certificate'}
              </h2>
              <p className="mt-1 text-sm text-navy-600">
                {editing
                  ? 'Update academic details and attach verified certificate documents.'
                  : 'Add an academic record along with its verified certificate or credential document.'}
              </p>
            </div>
            <button
              type="button"
              onClick={closeForm}
              disabled={isSaving}
              aria-label="Close education form"
              className="rounded-lg p-2 text-navy-500 hover:bg-navy-50"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSave} className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Institution"
                required
                value={form.institution}
                onChange={(value) => setField('institution', value)}
                placeholder="e.g. United Methodist University (UMU)"
              />
              <Input
                label="Degree / Program"
                required
                value={form.degree}
                onChange={(value) => setField('degree', value)}
                placeholder="e.g. Bachelor of Business Administration (BBA)"
              />
              <Input
                label="Field / Discipline"
                required
                value={form.field}
                onChange={(value) => setField('field', value)}
                placeholder="e.g. Management & Public Administration"
              />
              <Input
                label="Year"
                value={form.year}
                onChange={(value) => setField('year', value)}
                placeholder="e.g. 2021 or Current Candidate"
              />
              <Input
                label="Status"
                value={form.status}
                onChange={(value) => setField('status', value)}
                placeholder="Completed, Current Candidate, etc."
              />
              <Input
                label="Display Order"
                type="number"
                value={form.display_order}
                onChange={(value) => setField('display_order', value)}
                placeholder="0"
              />
            </div>

            <label className="block text-sm font-semibold text-navy-800">
              Description
              <textarea
                rows={3}
                value={form.description}
                onChange={(event) => setField('description', event.target.value)}
                placeholder="Academic honors, coursework summary, and leadership commendations."
                className="mt-2 w-full resize-y rounded-xl border border-navy-200 px-3.5 py-2.5 text-sm font-normal text-navy-950 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
              />
            </label>

            {/* Certificate Attachment Field */}
            <div className="pt-2">
              <CertificateAttachmentField
                value={attachedCert}
                onChange={setAttachedCert}
                label="Upload or Attach Conferred Certificate (PDF / Image)"
                defaultCategory="Academic"
                defaultIssuer={form.institution || 'United Methodist University'}
              />
            </div>

            <label className="inline-flex items-center gap-3 text-sm font-semibold text-navy-800">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(event) => setField('published', event.target.checked)}
                className="h-4 w-4 rounded border-navy-300 text-gold-600 focus:ring-gold-500"
              />
              Display this education record publicly on the portfolio
            </label>

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
                {isSaving ? 'Saving…' : 'Save Education Record'}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* List of Education Records */}
      <section className="space-y-4">
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[0, 1].map((item) => (
              <div key={item} className="h-52 animate-pulse rounded-3xl bg-white" />
            ))}
          </div>
        ) : records.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-navy-300 bg-white p-10 text-center">
            <GraduationCap size={32} className="mx-auto text-gold-600" />
            <h2 className="mt-4 font-serif text-xl font-bold text-navy-950">No education records yet</h2>
            <p className="mt-2 text-sm text-navy-600">Add the first academic qualification and upload its certificate.</p>
            <button
              type="button"
              onClick={openCreate}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gold-500 px-4 py-2.5 text-sm font-bold text-navy-950"
            >
              <Plus size={16} /> Add Education
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {records.map((record) => {
              const matchedCert = getCertificateForEducation(record.degree, record.institution);
              return (
                <article
                  key={record.id}
                  className="rounded-3xl border border-navy-200 bg-white p-5 shadow-sm hover:border-gold-300 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-widest text-gold-700">
                          {record.status}
                        </p>
                        <h2 className="mt-1 font-serif text-xl font-bold text-navy-950">{record.degree}</h2>
                        <p className="mt-1 text-sm font-semibold text-navy-700">{record.institution}</p>
                      </div>
                      <span
                        className={
                          'shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ' +
                          (record.published ? 'bg-emerald-50 text-emerald-700' : 'bg-navy-100 text-navy-600')
                        }
                      >
                        {record.published ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    <div className="mt-4 space-y-1.5 border-t border-navy-100 pt-3 text-sm text-navy-600">
                      <p>
                        <span className="font-semibold text-navy-800">Field:</span> {record.field}
                      </p>
                      {record.year && (
                        <p>
                          <span className="font-semibold text-navy-800">Year:</span> {record.year}
                        </p>
                      )}
                      {record.description && <p className="leading-relaxed text-xs">{record.description}</p>}
                    </div>

                    {/* Attached Certificate Preview Tag */}
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
                      onClick={() => openEdit(record)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-navy-300 px-3 py-2 text-xs font-semibold text-navy-800 hover:bg-navy-50"
                    >
                      <Edit3 size={14} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(record)}
                      disabled={deletingId !== null}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
                    >
                      {deletingId === record.id ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />} Delete
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

function Input({
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
        className="mt-2 w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-sm font-normal text-navy-900 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
      />
    </label>
  );
}
