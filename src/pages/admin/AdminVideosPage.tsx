import { useCallback, useEffect, useRef, useState } from 'react';
import { Edit3, Film, Loader2, Plus, RefreshCw, Save, Trash2, Upload, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database.types';

type PortfolioVideo = Database['public']['Tables']['portfolio_videos']['Row'];
type VideoForm = { title: string; description: string; display_order: string; published: boolean };
const blankForm: VideoForm = { title: '', description: '', display_order: '0', published: true };
const MAX_VIDEO_SIZE = 250 * 1024 * 1024;

const toPath = (file: File) => `videos/${crypto.randomUUID()}-${file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-')}`;

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<PortfolioVideo[]>([]);
  const [form, setForm] = useState<VideoForm>(blankForm);
  const [editing, setEditing] = useState<PortfolioVideo | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const loadVideos = useCallback(async () => {
    setIsLoading(true); setFeedback(null);
    const { data, error } = await supabase.from('portfolio_videos').select('*').order('display_order', { ascending: true }).order('created_at', { ascending: false });
    if (error) { console.error('[Videos] Load failed:', error); setFeedback({ type: 'error', text: 'Unable to load videos. Please try again.' }); }
    else setVideos(data ?? []);
    setIsLoading(false);
  }, []);
  useEffect(() => { void loadVideos(); }, [loadVideos]);

  const closeForm = () => { if (!isSaving) { setEditing(null); setVideoFile(null); setForm(blankForm); setIsFormOpen(false); if (fileInput.current) fileInput.current.value = ''; } };
  const openCreate = () => { setEditing(null); setVideoFile(null); setForm({ ...blankForm, display_order: String(videos.length) }); setFeedback(null); setIsFormOpen(true); };
  const openEdit = (video: PortfolioVideo) => { setEditing(video); setVideoFile(null); setForm({ title: video.title, description: video.description ?? '', display_order: String(video.display_order), published: video.published }); setFeedback(null); setIsFormOpen(true); };
  const setField = <K extends keyof VideoForm>(key: K, value: VideoForm[K]) => setForm((current) => ({ ...current, [key]: value }));

  const chooseVideo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/') || file.size > MAX_VIDEO_SIZE) { setFeedback({ type: 'error', text: 'Select a video file smaller than 250 MB.' }); event.target.value = ''; return; }
    setVideoFile(file); setFeedback(null);
  };

  const saveVideo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving) return;
    const displayOrder = Number(form.display_order);
    if (!form.title.trim() || (!editing && !videoFile)) { setFeedback({ type: 'error', text: 'Provide a title and select a video file.' }); return; }
    if (!Number.isInteger(displayOrder) || displayOrder < 0) { setFeedback({ type: 'error', text: 'Display order must be a whole number of zero or more.' }); return; }
    setIsSaving(true); setFeedback(null);
    try {
      let videoUrl = editing?.video_url ?? '';
      let storagePath = editing?.storage_path ?? null;
      if (videoFile) {
        storagePath = toPath(videoFile);
        const { error: uploadError } = await supabase.storage.from('portfolio-media').upload(storagePath, videoFile, { cacheControl: '3600', contentType: videoFile.type, upsert: false });
        if (uploadError) { console.error('[Videos] Upload failed:', uploadError); setFeedback({ type: 'error', text: 'Unable to upload the video. Please try again.' }); return; }
        videoUrl = supabase.storage.from('portfolio-media').getPublicUrl(storagePath).data.publicUrl;
      }
      const payload = { title: form.title.trim(), description: form.description.trim() || null, display_order: displayOrder, published: form.published, video_url: videoUrl, storage_path: storagePath };
      const { data, error } = editing
        ? await supabase.from('portfolio_videos').update(payload).eq('id', editing.id).select('*').single()
        : await supabase.from('portfolio_videos').insert(payload).select('*').single();
      if (error || !data) { console.error('[Videos] Save failed:', error); setFeedback({ type: 'error', text: 'Unable to save the video. Please try again.' }); return; }
      setVideos((current) => (editing ? current.map((item) => item.id === data.id ? data : item) : [...current, data]).sort((a, b) => a.display_order - b.display_order));
      closeForm(); setFeedback({ type: 'success', text: 'Video saved successfully.' });
    } catch (error) { console.error('[Videos] Unexpected save failure:', error); setFeedback({ type: 'error', text: 'Unable to save the video. Please try again.' }); }
    finally { setIsSaving(false); }
  };

  const deleteVideo = async (video: PortfolioVideo) => {
    if (deletingId || !window.confirm(`Delete “${video.title}”? The video record will be removed from the public portfolio.`)) return;
    setDeletingId(video.id); setFeedback(null);
    const { error } = await supabase.from('portfolio_videos').delete().eq('id', video.id);
    if (error) { console.error('[Videos] Delete failed:', error); setFeedback({ type: 'error', text: 'Unable to delete the video. Please try again.' }); }
    else { setVideos((current) => current.filter((item) => item.id !== video.id)); setFeedback({ type: 'success', text: 'Video removed successfully.' }); }
    setDeletingId(null);
  };

  return <div className="mx-auto max-w-6xl space-y-6 animate-fadeIn">
    <section className="rounded-3xl border border-navy-800 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 p-7 text-white shadow-xl sm:p-9"><div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gold-500/30 bg-gold-500/10 text-gold-300"><Film size={22} /></div><h1 className="font-serif text-3xl font-bold">Video Library</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy-200">Upload and curate professional recordings for the public portfolio.</p></div><div className="flex gap-3"><button type="button" onClick={() => void loadVideos()} disabled={isLoading} className="inline-flex items-center gap-2 rounded-xl border border-navy-600 bg-navy-950/40 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"><RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} /> Refresh</button><button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-gold-500 px-4 py-2.5 text-sm font-bold text-navy-950"><Plus size={17} /> Add Video</button></div></div></section>
    {feedback && <div role={feedback.type === 'error' ? 'alert' : 'status'} className={`rounded-2xl border p-4 text-sm ${feedback.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800'}`}>{feedback.text}</div>}
    {isFormOpen && <section className="rounded-3xl border border-navy-200 bg-white p-5 shadow-sm sm:p-7"><div className="flex items-start justify-between gap-4 border-b border-navy-100 pb-5"><div><h2 className="font-serif text-2xl font-bold text-navy-950">{editing ? 'Edit Video' : 'Add Video'}</h2><p className="mt-1 text-sm text-navy-600">Select a video file from your device. It is stored in the secure portfolio media library.</p></div><button type="button" onClick={closeForm} disabled={isSaving} className="rounded-lg p-2 text-navy-500 hover:bg-navy-50" aria-label="Close video form"><X size={20} /></button></div><form onSubmit={saveVideo} className="mt-6 space-y-5"><div className="rounded-2xl border border-dashed border-navy-300 bg-cream-50 p-5"><input ref={fileInput} id="portfolio-video-file" type="file" accept="video/*" onChange={chooseVideo} className="sr-only" /><p className="text-sm font-semibold text-navy-900">{videoFile ? videoFile.name : editing ? 'Keep current video or choose a replacement' : 'Select a video file'}</p><p className="mt-1 text-xs text-navy-600">MP4, MOV, WebM, and other browser-compatible formats — maximum 250 MB.</p><button type="button" onClick={() => fileInput.current?.click()} className="mt-3 inline-flex items-center gap-2 rounded-lg border border-navy-300 bg-white px-3 py-2 text-xs font-bold text-navy-800 hover:border-gold-500"><Upload size={14} /> {editing ? 'Choose replacement' : 'Choose video'}</button></div><div className="grid gap-4 md:grid-cols-2"><Field label="Video title" required value={form.title} onChange={(value) => setField('title', value)} placeholder="Public address at …" /><Field label="Display order" type="number" value={form.display_order} onChange={(value) => setField('display_order', value)} placeholder="0" /></div><label className="block text-sm font-semibold text-navy-800">Description<textarea rows={4} value={form.description} onChange={(event) => setField('description', event.target.value)} placeholder="Briefly describe the recording and context." className="mt-2 w-full resize-y rounded-xl border border-navy-200 px-3.5 py-2.5 text-sm font-normal outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20" /></label><label className="inline-flex items-center gap-3 rounded-xl bg-cream-50 px-4 py-3 text-sm font-semibold text-navy-800"><input type="checkbox" checked={form.published} onChange={(event) => setField('published', event.target.checked)} className="h-4 w-4 rounded border-navy-300 text-gold-600 focus:ring-gold-500" /> Display on the public portfolio</label><div className="flex flex-col-reverse gap-3 border-t border-navy-100 pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={closeForm} disabled={isSaving} className="rounded-xl border border-navy-300 px-4 py-2.5 text-sm font-semibold text-navy-700">Cancel</button><button type="submit" disabled={isSaving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold-500 px-5 py-2.5 text-sm font-bold text-navy-950 disabled:opacity-60">{isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}{isSaving ? 'Saving…' : 'Save Video'}</button></div></form></section>}
    {isLoading ? <div className="grid gap-5 md:grid-cols-2">{[0, 1].map((item) => <div key={item} className="h-64 animate-pulse rounded-3xl bg-white" />)}</div> : videos.length === 0 ? <div className="rounded-3xl border border-dashed border-navy-300 bg-white p-12 text-center"><Film size={32} className="mx-auto text-gold-600" /><h2 className="mt-4 font-serif text-xl font-bold text-navy-950">No videos yet</h2><p className="mt-2 text-sm text-navy-600">Professional recordings selected here will appear in the public portfolio.</p><button type="button" onClick={openCreate} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gold-500 px-4 py-2.5 text-sm font-bold text-navy-950"><Plus size={16} /> Add first video</button></div> : <div className="grid gap-5 md:grid-cols-2">{videos.map((video) => <article key={video.id} className="overflow-hidden rounded-3xl border border-navy-200 bg-white shadow-sm"><div className="aspect-video bg-navy-950"><video controls preload="metadata" className="h-full w-full"><source src={video.video_url} /></video></div><div className="p-5"><div className="flex items-start justify-between gap-3"><div><h2 className="font-serif text-xl font-bold text-navy-950">{video.title}</h2>{video.description && <p className="mt-2 text-sm leading-relaxed text-navy-600">{video.description}</p>}</div><span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${video.published ? 'bg-emerald-50 text-emerald-700' : 'bg-navy-100 text-navy-700'}`}>{video.published ? 'Published' : 'Draft'}</span></div><p className="mt-3 text-xs text-navy-500">Display order: {video.display_order}</p><div className="mt-5 flex gap-3"><button type="button" onClick={() => openEdit(video)} className="inline-flex items-center gap-1.5 rounded-lg border border-navy-300 px-3 py-2 text-xs font-semibold text-navy-800"><Edit3 size={14} /> Edit</button><button type="button" onClick={() => void deleteVideo(video)} disabled={deletingId !== null} className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 disabled:opacity-60">{deletingId === video.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Delete</button></div></div></article>)}</div>}
  </div>;
}

function Field({ label, required, type = 'text', value, onChange, placeholder }: { label: string; required?: boolean; type?: string; value: string; onChange: (value: string) => void; placeholder: string }) { return <label className="block text-sm font-semibold text-navy-800">{label}{required && <span className="ml-1 text-gold-700">*</span>}<input required={required} type={type} min={type === 'number' ? 0 : undefined} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-navy-200 px-3.5 py-2.5 text-sm font-normal outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20" /></label>; }
