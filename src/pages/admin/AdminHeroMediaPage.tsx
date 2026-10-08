import { useCallback, useEffect, useRef, useState } from 'react';
import { Edit3, Image as ImageIcon, Loader2, RefreshCw, Save, Trash2, Upload, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database.types';

type HeroImage = Database['public']['Tables']['hero_images']['Row'];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const storagePathFor = (file: File) => `hero/${crypto.randomUUID()}-${file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-')}`;
const filenameAsAlt = (file: File) => file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').trim();

export default function AdminHeroMediaPage() {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [editing, setEditing] = useState<HeroImage | null>(null);
  const [alt, setAlt] = useState('');
  const [caption, setCaption] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState('0');
  const [published, setPublished] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const loadImages = useCallback(async () => {
    setIsLoading(true); setFeedback(null);
    const { data, error } = await supabase.from('hero_images').select('*').order('display_order', { ascending: true }).order('created_at', { ascending: true });
    if (error) { console.error('[Hero media] Load failed:', error); setFeedback({ type: 'error', text: 'Unable to load hero images. Please try again.' }); }
    else setImages(data ?? []);
    setIsLoading(false);
  }, []);
  useEffect(() => { void loadImages(); }, [loadImages]);

  const chooseFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    if (files.some((file) => !file.type.startsWith('image/') || file.size > MAX_IMAGE_SIZE)) { setFeedback({ type: 'error', text: 'Select only image files smaller than 10 MB.' }); event.target.value = ''; return; }
    setSelectedFiles(files); setFeedback(null);
  };

  const uploadImages = async () => {
    if (!selectedFiles.length || isUploading) return;
    setIsUploading(true); setFeedback(null);
    try {
      const added: HeroImage[] = [];
      for (const [index, file] of selectedFiles.entries()) {
        const storagePath = storagePathFor(file);
        const { error: uploadError } = await supabase.storage.from('portfolio-media').upload(storagePath, file, { cacheControl: '3600', contentType: file.type, upsert: false });
        if (uploadError) throw uploadError;
        const imageUrl = supabase.storage.from('portfolio-media').getPublicUrl(storagePath).data.publicUrl;
        const generatedCaption = filenameAsAlt(file) || 'Portfolio portrait';
        const { data, error } = await supabase.from('hero_images').insert({ image_url: imageUrl, storage_path: storagePath, alt: generatedCaption, caption: generatedCaption, display_order: images.length + index, published: true }).select('*').single();
        if (error || !data) throw error ?? new Error('No record returned');
        added.push(data);
      }
      setImages((current) => [...current, ...added].sort((a, b) => a.display_order - b.display_order));
      setSelectedFiles([]); if (fileInput.current) fileInput.current.value = '';
      setFeedback({ type: 'success', text: `${added.length} hero ${added.length === 1 ? 'image was' : 'images were'} uploaded successfully.` });
    } catch (error) { console.error('[Hero media] Upload failed:', error); setFeedback({ type: 'error', text: 'Unable to upload all selected images. Please try again.' }); }
    finally { setIsUploading(false); }
  };

  const openEdit = (image: HeroImage) => { setEditing(image); setAlt(image.alt); setCaption(image.caption ?? ''); setDescription(image.description ?? ''); setDisplayOrder(String(image.display_order)); setPublished(image.published); setFeedback(null); };
  const closeEdit = () => { if (!isSaving) { setEditing(null); setAlt(''); setCaption(''); setDescription(''); setDisplayOrder('0'); setPublished(true); } };
  const saveEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (!editing || isSaving) return;
    const order = Number(displayOrder);
    if (!alt.trim() || !Number.isInteger(order) || order < 0) { setFeedback({ type: 'error', text: 'Provide alternative text and a whole-number display order.' }); return; }
    setIsSaving(true); setFeedback(null);
    const { data, error } = await supabase.from('hero_images').update({ alt: alt.trim(), caption: caption.trim() || null, description: description.trim() || null, display_order: order, published }).eq('id', editing.id).select('*').single();
    if (error || !data) { console.error('[Hero media] Update failed:', error); setFeedback({ type: 'error', text: 'Unable to update this hero image. Please try again.' }); }
    else { setImages((current) => current.map((image) => image.id === data.id ? data : image).sort((a, b) => a.display_order - b.display_order)); closeEdit(); setFeedback({ type: 'success', text: 'Hero image updated successfully.' }); }
    setIsSaving(false);
  };

  const deleteImage = async (image: HeroImage) => {
    if (deletingId || !window.confirm(`Remove “${image.alt}” from the hero carousel?`)) return;
    setDeletingId(image.id); setFeedback(null);
    const { error } = await supabase.from('hero_images').delete().eq('id', image.id);
    if (error) { console.error('[Hero media] Delete failed:', error); setFeedback({ type: 'error', text: 'Unable to remove this hero image. Please try again.' }); }
    else { setImages((current) => current.filter((item) => item.id !== image.id)); setFeedback({ type: 'success', text: 'Hero image removed successfully.' }); }
    setDeletingId(null);
  };

  return <div className="mx-auto max-w-6xl space-y-6 animate-fadeIn">
    <section className="rounded-3xl border border-navy-800 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 p-7 text-white shadow-xl sm:p-9"><div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gold-500/30 bg-gold-500/10 text-gold-300"><ImageIcon size={22} /></div><h1 className="font-serif text-3xl font-bold">Hero Media</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy-200">Curate the portrait sequence shown at the top of the public portfolio. Published images rotate every 10 seconds.</p></div><button type="button" onClick={() => void loadImages()} disabled={isLoading || isUploading} className="inline-flex items-center gap-2 self-start rounded-xl border border-navy-600 bg-navy-950/40 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60 sm:self-auto"><RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} /> Refresh</button></div></section>
    {feedback && <div role={feedback.type === 'error' ? 'alert' : 'status'} className={`rounded-2xl border p-4 text-sm ${feedback.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800'}`}>{feedback.text}</div>}
    <section className="rounded-3xl border border-navy-200 bg-white p-5 shadow-sm sm:p-7"><h2 className="font-serif text-2xl font-bold text-navy-950">Add carousel images</h2><p className="mt-1 text-sm text-navy-600">Select several official portraits or professional photographs at once. You can refine the captions and sequence after upload.</p><div className="mt-5 rounded-2xl border border-dashed border-navy-300 bg-cream-50 p-5"><input ref={fileInput} id="hero-image-files" type="file" accept="image/*" multiple onChange={chooseFiles} className="sr-only" /><p className="text-sm font-semibold text-navy-900">{selectedFiles.length ? `${selectedFiles.length} image${selectedFiles.length === 1 ? '' : 's'} selected` : 'No images selected'}</p><p className="mt-1 text-xs text-navy-600">JPG, PNG, WebP, or another image format — maximum 10 MB each.</p><div className="mt-4 flex flex-wrap gap-3"><button type="button" onClick={() => fileInput.current?.click()} disabled={isUploading} className="inline-flex items-center gap-2 rounded-xl border border-navy-300 bg-white px-4 py-2.5 text-sm font-bold text-navy-800 hover:border-gold-500 disabled:opacity-60"><Upload size={16} /> Select images</button><button type="button" onClick={() => void uploadImages()} disabled={!selectedFiles.length || isUploading} className="inline-flex items-center gap-2 rounded-xl bg-gold-500 px-4 py-2.5 text-sm font-bold text-navy-950 disabled:opacity-60">{isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}{isUploading ? 'Uploading…' : 'Upload to carousel'}</button></div></div></section>
    {editing && <section className="rounded-3xl border border-navy-200 bg-white p-5 shadow-sm sm:p-7"><div className="flex items-start justify-between gap-4 border-b border-navy-100 pb-5"><div><h2 className="font-serif text-2xl font-bold text-navy-950">Edit hero image</h2><p className="mt-1 text-sm text-navy-600">Set the exact caption and descriptive line shown on this slide.</p></div><button type="button" onClick={closeEdit} disabled={isSaving} aria-label="Close editor" className="rounded-lg p-2 text-navy-500 hover:bg-navy-50"><X size={20} /></button></div><form onSubmit={saveEdit} className="mt-6 space-y-5"><div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold text-navy-800">Alternative text<input required value={alt} onChange={(event) => setAlt(event.target.value)} className="mt-2 w-full rounded-xl border border-navy-200 px-3.5 py-2.5 text-sm font-normal outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20" /></label><label className="block text-sm font-semibold text-navy-800">Display order<input required type="number" min="0" value={displayOrder} onChange={(event) => setDisplayOrder(event.target.value)} className="mt-2 w-full rounded-xl border border-navy-200 px-3.5 py-2.5 text-sm font-normal outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20" /></label></div><label className="block text-sm font-semibold text-navy-800">Caption<input value={caption} onChange={(event) => setCaption(event.target.value)} placeholder="Blama S. Blama" className="mt-2 w-full rounded-xl border border-navy-200 px-3.5 py-2.5 text-sm font-normal outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20" /></label><label className="block text-sm font-semibold text-navy-800">Description<textarea rows={3} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Sir Blama • PYPP Class XI" className="mt-2 w-full resize-y rounded-xl border border-navy-200 px-3.5 py-2.5 text-sm font-normal outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20" /></label><label className="inline-flex items-center gap-3 rounded-xl bg-cream-50 px-4 py-3 text-sm font-semibold text-navy-800"><input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} className="h-4 w-4 rounded border-navy-300 text-gold-600 focus:ring-gold-500" /> Include in the public carousel</label><div className="flex flex-col-reverse gap-3 border-t border-navy-100 pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={closeEdit} disabled={isSaving} className="rounded-xl border border-navy-300 px-4 py-2.5 text-sm font-semibold text-navy-700">Cancel</button><button type="submit" disabled={isSaving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold-500 px-5 py-2.5 text-sm font-bold text-navy-950 disabled:opacity-60"><Save size={16} />{isSaving ? 'Saving…' : 'Save image'}</button></div></form></section>}
    {isLoading ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((index) => <div key={index} className="h-64 animate-pulse rounded-3xl bg-white" />)}</div> : images.length === 0 ? <div className="rounded-3xl border border-dashed border-navy-300 bg-white p-12 text-center"><ImageIcon size={32} className="mx-auto text-gold-600" /><h2 className="mt-4 font-serif text-xl font-bold text-navy-950">No hero images yet</h2><p className="mt-2 text-sm text-navy-600">The profile portrait remains visible until you upload the first carousel image.</p></div> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{images.map((image) => <article key={image.id} className="overflow-hidden rounded-3xl border border-navy-200 bg-white shadow-sm"><img src={image.image_url} alt={image.alt} className="aspect-[4/5] w-full object-cover" /><div className="p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-navy-900">{image.caption || image.alt}</p>{image.description && <p className="mt-1 text-xs text-navy-600">{image.description}</p>}</div><span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${image.published ? 'bg-emerald-50 text-emerald-700' : 'bg-navy-100 text-navy-700'}`}>{image.published ? 'Published' : 'Hidden'}</span></div><p className="mt-2 text-xs text-navy-500">Display order: {image.display_order}</p><div className="mt-5 flex gap-3"><button type="button" onClick={() => openEdit(image)} className="inline-flex items-center gap-1.5 rounded-lg border border-navy-300 px-3 py-2 text-xs font-semibold text-navy-800"><Edit3 size={14} /> Edit</button><button type="button" onClick={() => void deleteImage(image)} disabled={deletingId !== null} className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 disabled:opacity-60">{deletingId === image.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Delete</button></div></div></article>)}</div>}
  </div>;
}
