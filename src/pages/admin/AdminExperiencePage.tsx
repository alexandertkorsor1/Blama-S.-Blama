import { useCallback, useEffect, useState } from 'react';
import { Briefcase, Edit3, Plus, RefreshCw, Save, Trash2, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database.types';

type Experience = Database['public']['Tables']['experiences']['Row'];
type ExperienceForm = { organization: string; role: string; period: string; current: boolean; display_order: string; published: boolean };
const blankForm: ExperienceForm = { organization: '', role: '', period: '', current: false, display_order: '0', published: true };

export default function AdminExperiencePage() {
  const [records, setRecords] = useState<Experience[]>([]);
  const [form, setForm] = useState<ExperienceForm>(blankForm);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);

  const loadRecords = useCallback(async () => {
    setIsLoading(true); setMessage(null);
    try {
      const { data, error } = await supabase.from('experiences').select('*').order('display_order', { ascending: true }).order('created_at', { ascending: false });
      if (error) { console.error('[Experience] Load failed:', error); setMessage({ kind: 'error', text: 'Unable to load experience records. Please try again.' }); return; }
      setRecords(data ?? []);
    } catch (error) { console.error('[Experience] Unexpected load failure:', error); setMessage({ kind: 'error', text: 'Unable to load experience records. Please try again.' }); }
    finally { setIsLoading(false); }
  }, []);
  useEffect(() => { void loadRecords(); }, [loadRecords]);

  const setField = <K extends keyof ExperienceForm>(field: K, value: ExperienceForm[K]) => setForm((current) => ({ ...current, [field]: value }));
  const openCreate = () => { setEditing(null); setForm({ ...blankForm, display_order: String(records.length) }); setMessage(null); setIsFormOpen(true); };
  const openEdit = (record: Experience) => { setEditing(record); setForm({ organization: record.organization, role: record.role, period: record.period ?? '', current: record.current, display_order: String(record.display_order), published: record.published }); setMessage(null); setIsFormOpen(true); };
  const closeForm = () => { if (!isSaving) { setEditing(null); setForm(blankForm); setIsFormOpen(false); } };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (isSaving) return;
    if (!form.organization.trim() || !form.role.trim()) { setMessage({ kind: 'error', text: 'Organization and role are required.' }); return; }
    setIsSaving(true); setMessage(null);
    const payload = { organization: form.organization.trim(), role: form.role.trim(), period: form.period.trim() || null, current: form.current, display_order: Number.isFinite(Number(form.display_order)) ? Number(form.display_order) : 0, published: form.published };
    try {
      if (editing) {
        const { data, error } = await supabase.from('experiences').update(payload).eq('id', editing.id).select('*').single();
        if (error || !data) { console.error('[Experience] Update failed:', error); setMessage({ kind: 'error', text: 'Unable to save this experience record. Please try again.' }); return; }
        setRecords((current) => current.map((record) => record.id === data.id ? data : record).sort((a, b) => a.display_order - b.display_order));
      } else {
        const { data, error } = await supabase.from('experiences').insert(payload).select('*').single();
        if (error || !data) { console.error('[Experience] Create failed:', error); setMessage({ kind: 'error', text: 'Unable to save this experience record. Please try again.' }); return; }
        setRecords((current) => [...current, data].sort((a, b) => a.display_order - b.display_order));
      }
      closeForm(); setMessage({ kind: 'success', text: 'Experience record saved successfully.' });
    } catch (error) { console.error('[Experience] Unexpected save failure:', error); setMessage({ kind: 'error', text: 'Unable to save this experience record. Please try again.' }); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async (record: Experience) => {
    if (deletingId || !window.confirm('Delete “' + record.role + '” at ' + record.organization + '? This action cannot be undone.')) return;
    setDeletingId(record.id); setMessage(null);
    try {
      const { error } = await supabase.from('experiences').delete().eq('id', record.id);
      if (error) { console.error('[Experience] Delete failed:', error); setMessage({ kind: 'error', text: 'Unable to delete this experience record. Please try again.' }); return; }
      setRecords((current) => current.filter((item) => item.id !== record.id)); setMessage({ kind: 'success', text: 'Experience record deleted successfully.' });
    } catch (error) { console.error('[Experience] Unexpected delete failure:', error); setMessage({ kind: 'error', text: 'Unable to delete this experience record. Please try again.' }); }
    finally { setDeletingId(null); }
  };

  return <div className="mx-auto max-w-6xl space-y-6 animate-fadeIn">
    <section className="rounded-3xl border border-navy-800 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 p-7 text-white shadow-xl sm:p-9"><div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gold-500/30 bg-gold-500/10 text-gold-300"><Briefcase size={22} /></div><h1 className="font-serif text-3xl font-bold">Experience</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy-200">Manage the professional experience records displayed throughout the portfolio.</p></div><div className="flex flex-wrap gap-3"><button type="button" onClick={() => void loadRecords()} disabled={isLoading} className="inline-flex items-center gap-2 rounded-xl border border-navy-600 bg-navy-950/40 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"><RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} /> Refresh</button><button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-gold-500 px-4 py-2.5 text-sm font-bold text-navy-950 hover:bg-gold-400"><Plus size={17} /> Add Experience</button></div></div></section>
    {message && <div role={message.kind === 'error' ? 'alert' : 'status'} className={'rounded-2xl border p-4 text-sm ' + (message.kind === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800')}>{message.text}</div>}
    {isFormOpen && <section className="rounded-3xl border border-navy-200 bg-white p-5 shadow-sm sm:p-7"><div className="flex items-start justify-between gap-4 border-b border-navy-100 pb-5"><div><h2 className="font-serif text-2xl font-bold text-navy-950">{editing ? 'Edit Experience' : 'Add Experience'}</h2><p className="mt-1 text-sm text-navy-600">{editing ? 'Update this professional record.' : 'Add a new professional experience record.'}</p></div><button type="button" onClick={closeForm} disabled={isSaving} aria-label="Close experience form" className="rounded-lg p-2 text-navy-500 hover:bg-navy-50"><X size={20} /></button></div><form onSubmit={handleSave} className="mt-6 space-y-6"><div className="grid grid-cols-1 gap-4 md:grid-cols-2"><Input label="Organization" required value={form.organization} onChange={(value) => setField('organization', value)} placeholder="Organization name" /><Input label="Role" required value={form.role} onChange={(value) => setField('role', value)} placeholder="Professional role" /><Input label="Period" value={form.period} onChange={(value) => setField('period', value)} placeholder="e.g., 2021 – Present" /><Input label="Display Order" type="number" value={form.display_order} onChange={(value) => setField('display_order', value)} placeholder="0" /></div><div className="flex flex-col gap-3 rounded-2xl bg-cream-50 p-4 sm:flex-row sm:items-center sm:gap-7"><label className="inline-flex items-center gap-3 text-sm font-semibold text-navy-800"><input type="checkbox" checked={form.current} onChange={(event) => setField('current', event.target.checked)} className="h-4 w-4 rounded border-navy-300 text-gold-600 focus:ring-gold-500" /> Current position</label><label className="inline-flex items-center gap-3 text-sm font-semibold text-navy-800"><input type="checkbox" checked={form.published} onChange={(event) => setField('published', event.target.checked)} className="h-4 w-4 rounded border-navy-300 text-gold-600 focus:ring-gold-500" /> Display publicly</label></div><div className="flex flex-col-reverse gap-3 border-t border-navy-100 pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={closeForm} disabled={isSaving} className="rounded-xl border border-navy-300 px-4 py-2.5 text-sm font-semibold text-navy-700">Cancel</button><button type="submit" disabled={isSaving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold-500 px-5 py-2.5 text-sm font-bold text-navy-950 disabled:opacity-60"><Save size={16} />{isSaving ? 'Saving…' : 'Save Experience'}</button></div></form></section>}
    <section>{isLoading ? <div className="grid gap-4 md:grid-cols-2">{[0, 1].map((item) => <div key={item} className="h-48 animate-pulse rounded-3xl bg-white" />)}</div> : records.length === 0 ? <div className="rounded-3xl border border-dashed border-navy-300 bg-white p-10 text-center"><Briefcase size={32} className="mx-auto text-gold-600" /><h2 className="mt-4 font-serif text-xl font-bold text-navy-950">No experience records yet</h2><p className="mt-2 text-sm text-navy-600">Add the first professional role to begin.</p><button type="button" onClick={openCreate} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gold-500 px-4 py-2.5 text-sm font-bold text-navy-950"><Plus size={16} /> Add Experience</button></div> : <div className="grid gap-4 md:grid-cols-2">{records.map((record) => <article key={record.id} className="rounded-3xl border border-navy-200 bg-white p-5 shadow-sm"><div className="flex justify-between gap-4"><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-widest text-gold-700">Order {record.display_order}</p><h2 className="mt-1 font-serif text-xl font-bold text-navy-950">{record.role}</h2><p className="mt-1 text-sm font-semibold text-navy-700">{record.organization}</p></div><div className="flex shrink-0 flex-col items-end gap-1"><span className={'rounded-full px-2.5 py-1 text-xs font-semibold ' + (record.published ? 'bg-emerald-50 text-emerald-700' : 'bg-navy-100 text-navy-600')}>{record.published ? 'Published' : 'Draft'}</span>{record.current && <span className="text-xs font-semibold text-gold-700">Current</span>}</div></div><div className="mt-5 border-t border-navy-100 pt-4 text-sm text-navy-600">{record.period ? <p><span className="font-semibold text-navy-800">Period:</span> {record.period}</p> : <p className="italic text-navy-500">No period provided</p>}</div><div className="mt-5 flex gap-3"><button type="button" onClick={() => openEdit(record)} className="inline-flex items-center gap-1.5 rounded-lg border border-navy-300 px-3 py-2 text-xs font-semibold text-navy-800"><Edit3 size={14} /> Edit</button><button type="button" onClick={() => void handleDelete(record)} disabled={deletingId !== null} className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 disabled:opacity-60">{deletingId === record.id ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />} Delete</button></div></article>)}</div>}</section>
  </div>;
}

function Input({ label, required, type = 'text', value, onChange, placeholder }: { label: string; required?: boolean; type?: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="block text-sm font-semibold text-navy-800">{label}{required && <span className="ml-1 text-gold-700">*</span>}<input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-sm font-normal text-navy-900 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20" /></label>;
}
