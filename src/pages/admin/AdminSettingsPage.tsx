import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Info,
  Loader2,
  RefreshCw,
  Save,
  Settings,
  ShieldCheck,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database.types';

type SiteSettings = Database['public']['Tables']['site_settings']['Row'];
type SiteSettingsInsert = Database['public']['Tables']['site_settings']['Insert'];
type SiteSettingsUpdate = Database['public']['Tables']['site_settings']['Update'];

type SettingsForm = {
  site_title: string;
  site_description: string;
  contact_form_enabled: boolean;
  maintenance_mode: boolean;
};

const emptyForm: SettingsForm = {
  site_title: '',
  site_description: '',
  contact_form_enabled: true,
  maintenance_mode: false,
};

const toForm = (settings: SiteSettings): SettingsForm => ({
  site_title: settings.site_title ?? '',
  site_description: settings.site_description ?? '',
  contact_form_enabled: settings.contact_form_enabled,
  maintenance_mode: settings.maintenance_mode,
});

const formatUpdatedAt = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Update time unavailable'
    : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [form, setForm] = useState<SettingsForm>(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    setFeedback(null);
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      setFeedback({ type: 'error', text: 'Unable to load site settings. Please try again.' });
    } else {
      setSettings(data);
      setForm(data ? toForm(data) : emptyForm);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const setField = <Key extends keyof SettingsForm>(field: Key, value: SettingsForm[Key]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const saveSettings = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving) return;

    const values = {
      site_title: form.site_title.trim() || null,
      site_description: form.site_description.trim() || null,
      contact_form_enabled: form.contact_form_enabled,
      maintenance_mode: form.maintenance_mode,
    };

    setIsSaving(true);
    setFeedback(null);

    if (settings) {
      const update: SiteSettingsUpdate = values;
      const { data, error } = await supabase
        .from('site_settings')
        .update(update)
        .eq('id', settings.id)
        .select()
        .single();

      if (error) {
        setFeedback({ type: 'error', text: 'Unable to save site settings. Please try again.' });
      } else {
        setSettings(data);
        setForm(toForm(data));
        setFeedback({ type: 'success', text: 'Site settings saved successfully.' });
      }
    } else {
      const insert: SiteSettingsInsert = values;
      const { data, error } = await supabase.from('site_settings').insert(insert).select().single();

      if (error) {
        setFeedback({ type: 'error', text: 'Unable to initialize site settings. Please try again.' });
      } else {
        setSettings(data);
        setForm(toForm(data));
        setFeedback({ type: 'success', text: 'Site settings initialized successfully.' });
      }
    }

    setIsSaving(false);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-fadeIn">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link to="/admin" className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-navy-600 transition-colors hover:text-gold-600">
            <ArrowLeft size={14} /> Back to Command Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold-500/20 bg-gold-500/10 text-gold-600"><Settings size={24} /></div>
            <div><h1 className="font-serif text-3xl font-bold text-navy-950">Site Settings</h1><p className="mt-1 text-sm text-navy-600">Manage the global presentation and availability controls for the portfolio.</p></div>
          </div>
        </div>
        <button type="button" onClick={() => void loadSettings()} disabled={isLoading || isSaving} className="btn-secondary self-start !px-4 !py-2.5 !text-xs disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"><RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} /> Refresh Settings</button>
      </div>

      {feedback && <div role={feedback.type === 'error' ? 'alert' : 'status'} className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${feedback.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800'}`}>
        {feedback.type === 'success' ? <CheckCircle2 size={18} className="mt-0.5 shrink-0" /> : <X size={18} className="mt-0.5 shrink-0" />}<span>{feedback.text}</span>{feedback.type === 'error' && <button type="button" onClick={() => void loadSettings()} className="ml-auto shrink-0 text-xs font-bold underline underline-offset-2">Retry</button>}
      </div>}

      {isLoading ? <section className="card space-y-5 border border-navy-200 p-6 shadow-sm sm:p-8" aria-label="Loading site settings"><div className="h-8 w-52 animate-pulse rounded bg-navy-100" /><div className="h-20 animate-pulse rounded-xl bg-navy-50" /><div className="grid gap-4 sm:grid-cols-2"><div className="h-24 animate-pulse rounded-xl bg-navy-50" /><div className="h-24 animate-pulse rounded-xl bg-navy-50" /></div></section> : <form onSubmit={saveSettings} className="card overflow-hidden border border-navy-200 shadow-sm">
        <div className="flex flex-col gap-4 border-b border-navy-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div><h2 className="font-serif text-xl font-bold text-navy-950">Global Configuration</h2><p className="mt-1 text-sm text-navy-600">Changes are saved directly to the portfolio settings record.</p></div>
          {settings ? <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"><ShieldCheck size={14} /> Settings active</span> : <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500/10 px-3 py-1.5 text-xs font-semibold text-gold-700"><Info size={14} /> Not initialized</span>}
        </div>

        {!settings && <div className="mx-5 mt-5 flex gap-3 rounded-xl border border-gold-500/25 bg-gold-500/5 px-4 py-3 text-sm text-navy-700 sm:mx-7"><Info size={18} className="mt-0.5 shrink-0 text-gold-600" /><p>No site settings record exists yet. Review the available values below, then select <strong>Initialize Settings</strong> to create the first record with these controls.</p></div>}

        <div className="space-y-7 px-5 py-6 sm:px-7 sm:py-8">
          <section aria-labelledby="identity-settings-heading"><div className="mb-4"><h3 id="identity-settings-heading" className="font-serif text-lg font-bold text-navy-950">Site Identity</h3><p className="mt-1 text-sm text-navy-600">Public-facing title and descriptive copy, when provided.</p></div><div className="space-y-5"><label className="block text-sm font-semibold text-navy-800">Site title<input value={form.site_title} onChange={(event) => setField('site_title', event.target.value)} className="input mt-1.5 w-full" placeholder="Blama S. Blama" /></label><label className="block text-sm font-semibold text-navy-800">Site description<textarea value={form.site_description} onChange={(event) => setField('site_description', event.target.value)} rows={4} className="input mt-1.5 w-full resize-y" placeholder="A concise description of the professional portfolio." /></label></div></section>

          <section className="border-t border-navy-100 pt-7" aria-labelledby="availability-settings-heading"><div className="mb-4"><h3 id="availability-settings-heading" className="font-serif text-lg font-bold text-navy-950">Availability Controls</h3><p className="mt-1 text-sm text-navy-600">Control visitor access to the contact form and the portfolio maintenance state.</p></div><div className="grid gap-4 md:grid-cols-2"><ToggleCard id="contact-form-enabled" title="Contact form enabled" description="Allow visitors to submit new portfolio inquiries." checked={form.contact_form_enabled} onChange={(checked) => setField('contact_form_enabled', checked)} /><ToggleCard id="maintenance-mode" title="Maintenance mode" description="Enable the site maintenance state according to the public-site implementation." checked={form.maintenance_mode} onChange={(checked) => setField('maintenance_mode', checked)} warning /></div></section>

          {settings && <p className="border-t border-navy-100 pt-5 text-xs text-navy-500">Last updated: {formatUpdatedAt(settings.updated_at)}</p>}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-navy-100 bg-navy-50/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7"><p className="text-xs text-navy-500">{settings ? 'Saving updates the existing settings record.' : 'Initialization creates a single settings record.'}</p><button type="submit" disabled={isSaving} className="btn-primary !px-4 !py-2.5 !text-xs disabled:cursor-not-allowed disabled:opacity-60">{isSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}{isSaving ? 'Saving…' : settings ? 'Save Settings' : 'Initialize Settings'}</button></div>
      </form>}
    </div>
  );
}

function ToggleCard({ id, title, description, checked, onChange, warning = false }: { id: string; title: string; description: string; checked: boolean; onChange: (checked: boolean) => void; warning?: boolean }) {
  return <label htmlFor={id} className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-colors ${checked ? (warning ? 'border-amber-300 bg-amber-50/60' : 'border-gold-500/35 bg-gold-500/5') : 'border-navy-150 bg-cream-50 hover:border-navy-200'}`}><input id={id} type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="mt-0.5 h-4 w-4 rounded border-navy-300 text-gold-600 focus:ring-gold-500" /><span><span className="block text-sm font-bold text-navy-900">{title}</span><span className="mt-1 block text-xs leading-relaxed text-navy-600">{description}</span></span></label>;
}
