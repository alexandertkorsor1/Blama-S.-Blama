import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock3, Edit3, History, Loader2, Plus, RefreshCw, Save, Trash2, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database.types';

type TimelineItem = Database['public']['Tables']['timeline_items']['Row'];
type TimelineInsert = Database['public']['Tables']['timeline_items']['Insert'];
type TimelineUpdate = Database['public']['Tables']['timeline_items']['Update'];

type TimelineForm = {
  title: string;
  organization: string;
  year: string;
  category: string;
  description: string;
  display_order: string;
  published: boolean;
};

const emptyForm: TimelineForm = {
  title: '', organization: '', year: '', category: '', description: '', display_order: '0', published: true,
};

const toForm = (item: TimelineItem): TimelineForm => ({
  title: item.title,
  organization: item.organization,
  year: item.year,
  category: item.category,
  description: item.description ?? '',
  display_order: String(item.display_order),
  published: item.published,
});

const byDisplayOrder = (left: TimelineItem, right: TimelineItem) =>
  left.display_order === right.display_order
    ? right.created_at.localeCompare(left.created_at)
    : left.display_order - right.display_order;

export default function AdminTimelinePage() {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [form, setForm] = useState<TimelineForm>(emptyForm);
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    setFeedback(null);
    const { data, error } = await supabase
      .from('timeline_items')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      setFeedback({ type: 'error', text: 'Unable to load timeline items. Please try again.' });
    } else {
      setItems(data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  const openCreateForm = () => {
    setEditingItem(null);
    setForm(emptyForm);
    setFeedback(null);
    setIsFormOpen(true);
  };

  const openEditForm = (item: TimelineItem) => {
    setEditingItem(item);
    setForm(toForm(item));
    setFeedback(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    if (!isSaving) {
      setIsFormOpen(false);
      setEditingItem(null);
      setForm(emptyForm);
    }
  };

  const updateField = <Key extends keyof TimelineForm>(field: Key, value: TimelineForm[Key]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const saveItem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving) return;

    const title = form.title.trim();
    const organization = form.organization.trim();
    const year = form.year.trim();
    const category = form.category.trim();
    const displayOrder = Number(form.display_order);

    if (!title || !organization || !year || !category) {
      setFeedback({ type: 'error', text: 'Please complete the title, organization, year, and category fields.' });
      return;
    }
    if (!Number.isInteger(displayOrder) || displayOrder < 0) {
      setFeedback({ type: 'error', text: 'Display order must be a whole number of zero or greater.' });
      return;
    }

    const values = {
      title,
      organization,
      year,
      category,
      description: form.description.trim() || null,
      display_order: displayOrder,
      published: form.published,
    };
    setIsSaving(true);
    setFeedback(null);

    if (editingItem) {
      const update: TimelineUpdate = values;
      const { data, error } = await supabase.from('timeline_items').update(update).eq('id', editingItem.id).select().single();
      if (error) {
        setFeedback({ type: 'error', text: 'Unable to update this timeline item. Please try again.' });
        setIsSaving(false);
        return;
      }
      setItems((current) => current.map((item) => (item.id === data.id ? data : item)).sort(byDisplayOrder));
      setFeedback({ type: 'success', text: 'Timeline item updated successfully.' });
    } else {
      const insert: TimelineInsert = values;
      const { data, error } = await supabase.from('timeline_items').insert(insert).select().single();
      if (error) {
        setFeedback({ type: 'error', text: 'Unable to create this timeline item. Please try again.' });
        setIsSaving(false);
        return;
      }
      setItems((current) => [...current, data].sort(byDisplayOrder));
      setFeedback({ type: 'success', text: 'Timeline item created successfully.' });
    }

    setIsSaving(false);
    setIsFormOpen(false);
    setEditingItem(null);
    setForm(emptyForm);
  };

  const deleteItem = async (item: TimelineItem) => {
    if (deletingId || !window.confirm(`Delete “${item.title}” from the timeline? This cannot be undone.`)) return;
    setDeletingId(item.id);
    setFeedback(null);
    const { error } = await supabase.from('timeline_items').delete().eq('id', item.id);
    if (error) {
      setFeedback({ type: 'error', text: 'Unable to delete this timeline item. Please try again.' });
    } else {
      setItems((current) => current.filter((currentItem) => currentItem.id !== item.id));
      setFeedback({ type: 'success', text: 'Timeline item deleted successfully.' });
    }
    setDeletingId(null);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fadeIn">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link to="/admin" className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-navy-600 transition-colors hover:text-gold-600">
            <ArrowLeft size={14} /> Back to Command Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold-500/20 bg-gold-500/10 text-gold-600"><History size={24} /></div>
            <div>
              <h1 className="font-serif text-3xl font-bold text-navy-950">Career Timeline</h1>
              <p className="mt-1 text-sm text-navy-600">Curate the milestones that tell the professional journey.</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => void loadItems()} disabled={isLoading} className="btn-secondary !px-4 !py-2.5 !text-xs disabled:cursor-not-allowed disabled:opacity-60"><RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} /> Refresh</button>
          <button type="button" onClick={openCreateForm} className="btn-primary !px-4 !py-2.5 !text-xs"><Plus size={15} /> Add Timeline Item</button>
        </div>
      </div>

      {feedback && <div role={feedback.type === 'error' ? 'alert' : 'status'} className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${feedback.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800'}`}>
        {feedback.type === 'success' ? <CheckCircle2 size={18} className="mt-0.5 shrink-0" /> : <X size={18} className="mt-0.5 shrink-0" />}<span>{feedback.text}</span>
      </div>}

      {isFormOpen && <section className="card border border-navy-200 p-5 shadow-sm sm:p-7" aria-labelledby="timeline-form-heading">
        <div className="mb-6 flex items-start justify-between gap-4 border-b border-navy-100 pb-5">
          <div><h2 id="timeline-form-heading" className="font-serif text-xl font-bold text-navy-950">{editingItem ? 'Edit Timeline Item' : 'Add Timeline Item'}</h2><p className="mt-1 text-sm text-navy-600">Use a clear year or period so this milestone reads naturally in the public timeline.</p></div>
          <button type="button" onClick={closeForm} disabled={isSaving} aria-label="Close form" className="rounded-lg p-2 text-navy-500 transition-colors hover:bg-navy-50 hover:text-navy-900 disabled:opacity-50"><X size={18} /></button>
        </div>
        <form onSubmit={saveItem} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block text-sm font-semibold text-navy-800">Milestone title <span className="text-red-600">*</span><input value={form.title} onChange={(event) => updateField('title', event.target.value)} required className="input mt-1.5 w-full" placeholder="e.g. Operations Manager" /></label>
            <label className="block text-sm font-semibold text-navy-800">Organization <span className="text-red-600">*</span><input value={form.organization} onChange={(event) => updateField('organization', event.target.value)} required className="input mt-1.5 w-full" placeholder="e.g. Fassah Business Center" /></label>
            <label className="block text-sm font-semibold text-navy-800">Year or period <span className="text-red-600">*</span><input value={form.year} onChange={(event) => updateField('year', event.target.value)} required className="input mt-1.5 w-full" placeholder="e.g. 2018–2021" /></label>
            <label className="block text-sm font-semibold text-navy-800">Category <span className="text-red-600">*</span><input value={form.category} onChange={(event) => updateField('category', event.target.value)} required className="input mt-1.5 w-full" placeholder="e.g. Professional" /></label>
          </div>
          <label className="block text-sm font-semibold text-navy-800">Milestone description<textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} rows={5} className="input mt-1.5 w-full resize-y" placeholder="Briefly describe the significance of this milestone." /></label>
          <div className="flex flex-col gap-4 rounded-xl border border-navy-100 bg-navy-50/50 p-4 sm:flex-row sm:items-end sm:justify-between">
            <label className="block w-full text-sm font-semibold text-navy-800 sm:max-w-48">Display order<input type="number" min="0" step="1" inputMode="numeric" value={form.display_order} onChange={(event) => updateField('display_order', event.target.value)} required className="input mt-1.5 w-full" /></label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg bg-white px-3 py-2.5 text-sm font-semibold text-navy-800 shadow-xs"><input type="checkbox" checked={form.published} onChange={(event) => updateField('published', event.target.checked)} className="h-4 w-4 rounded border-navy-300 text-gold-600 focus:ring-gold-500" />Published on public timeline</label>
          </div>
          <div className="flex flex-col-reverse gap-2 border-t border-navy-100 pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={closeForm} disabled={isSaving} className="btn-secondary !px-4 !py-2.5 !text-xs disabled:opacity-60">Cancel</button><button type="submit" disabled={isSaving} className="btn-primary !px-4 !py-2.5 !text-xs disabled:cursor-not-allowed disabled:opacity-60">{isSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}{isSaving ? 'Saving…' : editingItem ? 'Save Changes' : 'Create Timeline Item'}</button></div>
        </form>
      </section>}

      <section className="card overflow-hidden border border-navy-200 shadow-sm" aria-labelledby="timeline-list-heading">
        <div className="flex items-center justify-between border-b border-navy-100 px-5 py-4 sm:px-7"><div><h2 id="timeline-list-heading" className="font-serif text-xl font-bold text-navy-950">Timeline Milestones</h2><p className="mt-1 text-xs text-navy-600">Ordered by display position, then most recently created.</p></div><span className="rounded-full bg-navy-100 px-3 py-1 text-xs font-semibold text-navy-700">{items.length} {items.length === 1 ? 'item' : 'items'}</span></div>
        {isLoading ? <div className="space-y-5 p-5 sm:p-7" aria-label="Loading timeline items">{[0, 1, 2].map((index) => <div key={index} className="h-36 animate-pulse rounded-xl bg-navy-50" />)}</div> : items.length === 0 ? <div className="px-6 py-16 text-center sm:px-10"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500/10 text-gold-600"><Clock3 size={27} /></div><h3 className="mt-4 font-serif text-xl font-bold text-navy-950">No timeline milestones yet</h3><p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-navy-600">Add the key education, professional, and leadership moments that define the portfolio journey.</p><button type="button" onClick={openCreateForm} className="btn-primary mt-5 !px-4 !py-2.5 !text-xs"><Plus size={15} /> Add First Timeline Item</button></div> : <div className="p-5 sm:p-7"><div className="relative space-y-5 before:absolute before:bottom-6 before:left-[19px] before:top-6 before:w-px before:bg-gold-500/30 sm:before:left-[27px]">
          {items.map((item) => {
            const isDeleting = deletingId === item.id;
            return <article key={item.id} className="relative pl-11 sm:pl-16"><span className="absolute left-[13px] top-6 z-10 flex h-3.5 w-3.5 rounded-full border-[3px] border-cream-50 bg-gold-500 sm:left-[21px]" aria-hidden="true" /><div className="rounded-xl border border-navy-150 bg-cream-50 p-4 shadow-xs transition-shadow hover:shadow-sm sm:p-5"><div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div className="min-w-0"><div className="mb-2 flex flex-wrap items-center gap-2"><span className="rounded-full bg-gold-500/10 px-2.5 py-1 text-xs font-bold tracking-wide text-gold-700">{item.year}</span><span className="rounded-full bg-navy-100 px-2.5 py-1 text-xs font-semibold text-navy-700">{item.category}</span><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.published ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{item.published ? 'Published' : 'Draft'}</span></div><h3 className="font-serif text-lg font-bold text-navy-950">{item.title}</h3><p className="mt-0.5 text-sm font-medium text-navy-700">{item.organization}</p>{item.description && <p className="mt-3 max-w-3xl whitespace-pre-wrap text-sm leading-relaxed text-navy-600">{item.description}</p>}</div><div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end"><span className="rounded-md border border-navy-150 bg-white px-2 py-1 text-xs font-semibold text-navy-600">Order {item.display_order}</span><button type="button" onClick={() => openEditForm(item)} disabled={Boolean(deletingId)} className="inline-flex items-center gap-1.5 rounded-lg border border-navy-200 bg-white px-3 py-2 text-xs font-semibold text-navy-700 transition-colors hover:border-gold-400 hover:text-gold-700 disabled:cursor-not-allowed disabled:opacity-50"><Edit3 size={14} /> Edit</button><button type="button" onClick={() => void deleteItem(item)} disabled={Boolean(deletingId)} className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50">{isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}{isDeleting ? 'Deleting…' : 'Delete'}</button></div></div></div></article>;
          })}
        </div></div>}
      </section>
    </div>
  );
}
