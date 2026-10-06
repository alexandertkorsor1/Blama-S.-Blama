import { useCallback, useEffect, useState } from 'react';
import { Edit3, FolderPlus, Layers, Plus, RefreshCw, Save, Tag, Trash2, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database.types';

type SkillCategory = Database['public']['Tables']['skill_categories']['Row'];
type Skill = Database['public']['Tables']['skills']['Row'];
type CategoryForm = { category: string; icon: string; display_order: string; published: boolean };
type SkillForm = { name: string; display_order: string; published: boolean };
const blankCategory: CategoryForm = { category: '', icon: '', display_order: '0', published: true };
const blankSkill: SkillForm = { name: '', display_order: '0', published: true };

export default function AdminSkillsPage() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categoryForm, setCategoryForm] = useState<CategoryForm>(blankCategory);
  const [skillForm, setSkillForm] = useState<SkillForm>(blankSkill);
  const [editingCategory, setEditingCategory] = useState<SkillCategory | null>(null);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillCategoryId, setSkillCategoryId] = useState<string | null>(null);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [isSkillFormOpen, setIsSkillFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true); setMessage(null);
    try {
      const [categoryResponse, skillResponse] = await Promise.all([
        supabase.from('skill_categories').select('*').order('display_order', { ascending: true }),
        supabase.from('skills').select('*').order('display_order', { ascending: true }),
      ]);
      if (categoryResponse.error || skillResponse.error) {
        console.error('[Skills] Load failed:', { categories: categoryResponse.error, skills: skillResponse.error });
        setMessage({ kind: 'error', text: 'Unable to load skills and categories. Please try again.' }); return;
      }
      setCategories(categoryResponse.data ?? []); setSkills(skillResponse.data ?? []);
    } catch (error) { console.error('[Skills] Unexpected load failure:', error); setMessage({ kind: 'error', text: 'Unable to load skills and categories. Please try again.' }); }
    finally { setIsLoading(false); }
  }, []);
  useEffect(() => { void loadData(); }, [loadData]);

  const closeCategoryForm = () => { if (!isSaving) { setEditingCategory(null); setCategoryForm(blankCategory); setIsCategoryFormOpen(false); } };
  const closeSkillForm = () => { if (!isSaving) { setEditingSkill(null); setSkillCategoryId(null); setSkillForm(blankSkill); setIsSkillFormOpen(false); } };
  const openCreateCategory = () => { setEditingCategory(null); setCategoryForm({ ...blankCategory, display_order: String(categories.length) }); setMessage(null); setIsCategoryFormOpen(true); };
  const openEditCategory = (item: SkillCategory) => { setEditingCategory(item); setCategoryForm({ category: item.category, icon: item.icon ?? '', display_order: String(item.display_order), published: item.published }); setMessage(null); setIsCategoryFormOpen(true); };
  const openCreateSkill = (categoryId: string) => { setEditingSkill(null); setSkillCategoryId(categoryId); setSkillForm({ ...blankSkill, display_order: String(skills.filter((skill) => skill.category_id === categoryId).length) }); setMessage(null); setIsSkillFormOpen(true); };
  const openEditSkill = (item: Skill) => { setEditingSkill(item); setSkillCategoryId(item.category_id); setSkillForm({ name: item.name, display_order: String(item.display_order), published: item.published }); setMessage(null); setIsSkillFormOpen(true); };

  const saveCategory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (isSaving) return;
    if (!categoryForm.category.trim()) { setMessage({ kind: 'error', text: 'Category name is required.' }); return; }
    setIsSaving(true); setMessage(null);
    const payload = { category: categoryForm.category.trim(), icon: categoryForm.icon.trim() || null, display_order: Number.isFinite(Number(categoryForm.display_order)) ? Number(categoryForm.display_order) : 0, published: categoryForm.published };
    try {
      if (editingCategory) {
        const { data, error } = await supabase.from('skill_categories').update(payload).eq('id', editingCategory.id).select('*').single();
        if (error || !data) { console.error('[Skills] Category update failed:', error); setMessage({ kind: 'error', text: 'Unable to save this category. Please try again.' }); return; }
        setCategories((current) => current.map((item) => item.id === data.id ? data : item).sort((a, b) => a.display_order - b.display_order));
      } else {
        const { data, error } = await supabase.from('skill_categories').insert(payload).select('*').single();
        if (error || !data) { console.error('[Skills] Category create failed:', error); setMessage({ kind: 'error', text: 'Unable to save this category. Please try again.' }); return; }
        setCategories((current) => [...current, data].sort((a, b) => a.display_order - b.display_order));
      }
      closeCategoryForm(); setMessage({ kind: 'success', text: 'Category saved successfully.' });
    } catch (error) { console.error('[Skills] Unexpected category save failure:', error); setMessage({ kind: 'error', text: 'Unable to save this category. Please try again.' }); }
    finally { setIsSaving(false); }
  };

  const saveSkill = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (isSaving || !skillCategoryId) return;
    if (!skillForm.name.trim()) { setMessage({ kind: 'error', text: 'Skill name is required.' }); return; }
    setIsSaving(true); setMessage(null);
    const payload = { category_id: skillCategoryId, name: skillForm.name.trim(), display_order: Number.isFinite(Number(skillForm.display_order)) ? Number(skillForm.display_order) : 0, published: skillForm.published };
    try {
      if (editingSkill) {
        const { data, error } = await supabase.from('skills').update(payload).eq('id', editingSkill.id).select('*').single();
        if (error || !data) { console.error('[Skills] Skill update failed:', error); setMessage({ kind: 'error', text: 'Unable to save this skill. Please try again.' }); return; }
        setSkills((current) => current.map((item) => item.id === data.id ? data : item).sort((a, b) => a.display_order - b.display_order));
      } else {
        const { data, error } = await supabase.from('skills').insert(payload).select('*').single();
        if (error || !data) { console.error('[Skills] Skill create failed:', error); setMessage({ kind: 'error', text: 'Unable to save this skill. Please try again.' }); return; }
        setSkills((current) => [...current, data].sort((a, b) => a.display_order - b.display_order));
      }
      closeSkillForm(); setMessage({ kind: 'success', text: 'Skill saved successfully.' });
    } catch (error) { console.error('[Skills] Unexpected skill save failure:', error); setMessage({ kind: 'error', text: 'Unable to save this skill. Please try again.' }); }
    finally { setIsSaving(false); }
  };

  const deleteCategory = async (item: SkillCategory) => {
    if (deletingId || !window.confirm('Delete the “' + item.category + '” category? Delete its skills first, as this category may be in use.')) return;
    setDeletingId(item.id); setMessage(null);
    try { const { error } = await supabase.from('skill_categories').delete().eq('id', item.id); if (error) { console.error('[Skills] Category delete failed:', error); setMessage({ kind: 'error', text: 'Unable to delete this category. Remove its skills first, then try again.' }); return; } setCategories((current) => current.filter((category) => category.id !== item.id)); setMessage({ kind: 'success', text: 'Category deleted successfully.' }); }
    catch (error) { console.error('[Skills] Unexpected category delete failure:', error); setMessage({ kind: 'error', text: 'Unable to delete this category. Please try again.' }); }
    finally { setDeletingId(null); }
  };
  const deleteSkill = async (item: Skill) => {
    if (deletingId || !window.confirm('Delete the skill “' + item.name + '”? This action cannot be undone.')) return;
    setDeletingId(item.id); setMessage(null);
    try { const { error } = await supabase.from('skills').delete().eq('id', item.id); if (error) { console.error('[Skills] Skill delete failed:', error); setMessage({ kind: 'error', text: 'Unable to delete this skill. Please try again.' }); return; } setSkills((current) => current.filter((skill) => skill.id !== item.id)); setMessage({ kind: 'success', text: 'Skill deleted successfully.' }); }
    catch (error) { console.error('[Skills] Unexpected skill delete failure:', error); setMessage({ kind: 'error', text: 'Unable to delete this skill. Please try again.' }); }
    finally { setDeletingId(null); }
  };

  return <div className="mx-auto max-w-6xl space-y-6 animate-fadeIn">
    <section className="rounded-3xl border border-navy-800 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 p-7 text-white shadow-xl sm:p-9"><div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gold-500/30 bg-gold-500/10 text-gold-300"><Layers size={22} /></div><h1 className="font-serif text-3xl font-bold">Skills & Competencies</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy-200">Organize the portfolio’s skills in professional categories and control their public visibility.</p></div><div className="flex flex-wrap gap-3"><button type="button" onClick={() => void loadData()} disabled={isLoading} className="inline-flex items-center gap-2 rounded-xl border border-navy-600 bg-navy-950/40 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"><RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} /> Refresh</button><button type="button" onClick={openCreateCategory} className="inline-flex items-center gap-2 rounded-xl bg-gold-500 px-4 py-2.5 text-sm font-bold text-navy-950 hover:bg-gold-400"><FolderPlus size={17} /> Add Category</button></div></div></section>
    {message && <div role={message.kind === 'error' ? 'alert' : 'status'} className={'rounded-2xl border p-4 text-sm ' + (message.kind === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800')}>{message.text}</div>}
    {isCategoryFormOpen && <CategoryForm form={categoryForm} setForm={setCategoryForm} editing={Boolean(editingCategory)} saving={isSaving} onSave={saveCategory} onClose={closeCategoryForm} />}
    {isSkillFormOpen && <SkillForm form={skillForm} setForm={setSkillForm} editing={Boolean(editingSkill)} saving={isSaving} onSave={saveSkill} onClose={closeSkillForm} />}
    {isLoading ? <div className="grid gap-4">{[0, 1].map((item) => <div key={item} className="h-56 animate-pulse rounded-3xl bg-white" />)}</div> : categories.length === 0 ? <div className="rounded-3xl border border-dashed border-navy-300 bg-white p-10 text-center"><Layers size={32} className="mx-auto text-gold-600" /><h2 className="mt-4 font-serif text-xl font-bold text-navy-950">No skill categories yet</h2><p className="mt-2 text-sm text-navy-600">Create the first category to begin organizing portfolio competencies.</p><button type="button" onClick={openCreateCategory} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gold-500 px-4 py-2.5 text-sm font-bold text-navy-950"><FolderPlus size={16} /> Add Category</button></div> : <section className="space-y-4">{categories.map((category) => { const categorySkills = skills.filter((skill) => skill.category_id === category.id); return <article key={category.id} className="rounded-3xl border border-navy-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex items-center gap-2"><Tag size={17} className="text-gold-600" /><p className="text-xs font-bold uppercase tracking-widest text-gold-700">Order {category.display_order}</p></div><h2 className="mt-2 font-serif text-2xl font-bold text-navy-950">{category.category}</h2>{category.icon && <p className="mt-1 text-xs text-navy-500">Icon: {category.icon}</p>}</div><div className="flex flex-wrap items-center gap-2"><span className={'rounded-full px-2.5 py-1 text-xs font-semibold ' + (category.published ? 'bg-emerald-50 text-emerald-700' : 'bg-navy-100 text-navy-600')}>{category.published ? 'Published' : 'Draft'}</span><button type="button" onClick={() => openEditCategory(category)} className="rounded-lg border border-navy-300 p-2 text-navy-700" aria-label={'Edit ' + category.category}><Edit3 size={15} /></button><button type="button" disabled={deletingId !== null} onClick={() => void deleteCategory(category)} className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-700 disabled:opacity-60" aria-label={'Delete ' + category.category}>{deletingId === category.id ? <RefreshCw size={15} className="animate-spin" /> : <Trash2 size={15} />}</button></div></div><div className="mt-6 border-t border-navy-100 pt-5"><div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><h3 className="font-serif text-lg font-bold text-navy-900">Skills <span className="text-sm font-medium text-navy-500">({categorySkills.length})</span></h3><button type="button" onClick={() => openCreateSkill(category.id)} className="inline-flex items-center gap-2 rounded-lg border border-gold-500/50 px-3 py-2 text-xs font-bold text-gold-700"><Plus size={14} /> Add Skill</button></div>{categorySkills.length === 0 ? <p className="rounded-xl bg-cream-50 p-4 text-sm text-navy-600">No skills in this category yet.</p> : <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{categorySkills.map((skill) => <div key={skill.id} className="rounded-2xl border border-navy-100 bg-cream-50 p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-navy-900">{skill.name}</p><p className="mt-1 text-xs text-navy-500">Order {skill.display_order} · {skill.published ? 'Published' : 'Draft'}</p></div><div className="flex gap-1"><button type="button" onClick={() => openEditSkill(skill)} className="rounded-md p-1.5 text-navy-700 hover:bg-white" aria-label={'Edit ' + skill.name}><Edit3 size={14} /></button><button type="button" disabled={deletingId !== null} onClick={() => void deleteSkill(skill)} className="rounded-md p-1.5 text-red-700 hover:bg-red-100 disabled:opacity-60" aria-label={'Delete ' + skill.name}>{deletingId === skill.id ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}</button></div></div></div>)}</div>}</div></article>; })}</section>}
  </div>;
}

function CategoryForm({ form, setForm, editing, saving, onSave, onClose }: { form: CategoryForm; setForm: React.Dispatch<React.SetStateAction<CategoryForm>>; editing: boolean; saving: boolean; onSave: (event: React.FormEvent<HTMLFormElement>) => void; onClose: () => void }) { const update = <K extends keyof CategoryForm>(field: K, value: CategoryForm[K]) => setForm((current) => ({ ...current, [field]: value })); return <section className="rounded-3xl border border-navy-200 bg-white p-5 shadow-sm sm:p-7"><div className="flex justify-between border-b border-navy-100 pb-5"><div><h2 className="font-serif text-2xl font-bold text-navy-950">{editing ? 'Edit Category' : 'Add Category'}</h2><p className="mt-1 text-sm text-navy-600">Create a group for related competencies.</p></div><button type="button" onClick={onClose} disabled={saving} aria-label="Close category form" className="p-2 text-navy-500"><X size={20} /></button></div><form onSubmit={onSave} className="mt-6 space-y-5"><div className="grid gap-4 md:grid-cols-2"><Field label="Category Name" required value={form.category} onChange={(value) => update('category', value)} placeholder="Leadership" /><Field label="Icon" value={form.icon} onChange={(value) => update('icon', value)} placeholder="Optional icon name" /><Field label="Display Order" type="number" value={form.display_order} onChange={(value) => update('display_order', value)} placeholder="0" /></div><label className="inline-flex items-center gap-3 text-sm font-semibold text-navy-800"><input type="checkbox" checked={form.published} onChange={(event) => update('published', event.target.checked)} className="h-4 w-4 rounded border-navy-300 text-gold-600 focus:ring-gold-500" /> Display category publicly</label><Actions saving={saving} label={editing ? 'Save Category' : 'Create Category'} onClose={onClose} /></form></section>; }
function SkillForm({ form, setForm, editing, saving, onSave, onClose }: { form: SkillForm; setForm: React.Dispatch<React.SetStateAction<SkillForm>>; editing: boolean; saving: boolean; onSave: (event: React.FormEvent<HTMLFormElement>) => void; onClose: () => void }) { const update = <K extends keyof SkillForm>(field: K, value: SkillForm[K]) => setForm((current) => ({ ...current, [field]: value })); return <section className="rounded-3xl border border-navy-200 bg-white p-5 shadow-sm sm:p-7"><div className="flex justify-between border-b border-navy-100 pb-5"><div><h2 className="font-serif text-2xl font-bold text-navy-950">{editing ? 'Edit Skill' : 'Add Skill'}</h2><p className="mt-1 text-sm text-navy-600">This skill will remain in its selected category.</p></div><button type="button" onClick={onClose} disabled={saving} aria-label="Close skill form" className="p-2 text-navy-500"><X size={20} /></button></div><form onSubmit={onSave} className="mt-6 space-y-5"><div className="grid gap-4 md:grid-cols-2"><Field label="Skill Name" required value={form.name} onChange={(value) => update('name', value)} placeholder="Strategic Leadership" /><Field label="Display Order" type="number" value={form.display_order} onChange={(value) => update('display_order', value)} placeholder="0" /></div><label className="inline-flex items-center gap-3 text-sm font-semibold text-navy-800"><input type="checkbox" checked={form.published} onChange={(event) => update('published', event.target.checked)} className="h-4 w-4 rounded border-navy-300 text-gold-600 focus:ring-gold-500" /> Display skill publicly</label><Actions saving={saving} label={editing ? 'Save Skill' : 'Create Skill'} onClose={onClose} /></form></section>; }
function Field({ label, required, type = 'text', value, onChange, placeholder }: { label: string; required?: boolean; type?: string; value: string; onChange: (value: string) => void; placeholder: string }) { return <label className="block text-sm font-semibold text-navy-800">{label}{required && <span className="ml-1 text-gold-700">*</span>}<input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-navy-200 px-3.5 py-2.5 text-sm font-normal outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20" /></label>; }
function Actions({ saving, label, onClose }: { saving: boolean; label: string; onClose: () => void }) { return <div className="flex flex-col-reverse gap-3 border-t border-navy-100 pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} disabled={saving} className="rounded-xl border border-navy-300 px-4 py-2.5 text-sm font-semibold text-navy-700">Cancel</button><button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold-500 px-5 py-2.5 text-sm font-bold text-navy-950 disabled:opacity-60"><Save size={16} />{saving ? 'Saving…' : label}</button></div>; }
