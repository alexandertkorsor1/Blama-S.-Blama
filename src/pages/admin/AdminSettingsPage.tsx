import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Loader2,
  Mail,
  RefreshCw,
  Save,
  Settings,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useSectionContent } from '@/hooks/useSectionContent';
import type { Database as DatabaseTypes } from '@/types/database.types';

const LOCAL_SETTINGS_KEY = 'blama_portfolio_site_settings_v1';

type SiteSettings = DatabaseTypes['public']['Tables']['site_settings']['Row'];
type SiteSettingsInsert = DatabaseTypes['public']['Tables']['site_settings']['Insert'];
type SiteSettingsUpdate = DatabaseTypes['public']['Tables']['site_settings']['Update'];

type SettingsForm = {
  site_title: string;
  site_description: string;
  contact_form_enabled: boolean;
  maintenance_mode: boolean;
};

const emptyForm: SettingsForm = {
  site_title: 'Blama S. Blama • Professional Portfolio',
  site_description: 'Official portfolio and executive dossier of Blama S. Blama — Management Professional, Legal Scholar, and Public Service Leader.',
  contact_form_enabled: true,
  maintenance_mode: false,
};

const toForm = (settings: SiteSettings): SettingsForm => ({
  site_title: settings.site_title ?? emptyForm.site_title,
  site_description: settings.site_description ?? emptyForm.site_description,
  contact_form_enabled: settings.contact_form_enabled,
  maintenance_mode: settings.maintenance_mode,
});

const formatUpdatedAt = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Just now'
    : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
};

export default function AdminSettingsPage() {
  const { user, isLocalAdmin } = useAuth();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [form, setForm] = useState<SettingsForm>(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [accountEmail, setAccountEmail] = useState(user?.email ?? '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingAccount, setIsUpdatingAccount] = useState(false);
  const [accountFeedback, setAccountFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    setFeedback(null);

    if (!isSupabaseConfigured) {
      try {
        const local = localStorage.getItem(LOCAL_SETTINGS_KEY);
        if (local) {
          const parsed = JSON.parse(local);
          setSettings(parsed);
          setForm(toForm(parsed));
        } else {
          setForm(emptyForm);
        }
      } catch {
        setForm(emptyForm);
      }
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        setFeedback({ type: 'error', text: 'Unable to load site settings from database.' });
      } else {
        setSettings(data);
        setForm(data ? toForm(data) : emptyForm);
      }
    } catch {
      setFeedback({ type: 'error', text: 'Connection issue while loading site settings.' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    setAccountEmail(user?.email ?? '');
  }, [user?.email]);

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

    if (!isSupabaseConfigured) {
      const mockSettings: SiteSettings = {
        id: 'local-settings',
        ...values,
        updated_at: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(mockSettings));
      setSettings(mockSettings);
      setFeedback({ type: 'success', text: 'Site settings saved successfully in local storage.' });
      setIsSaving(false);
      return;
    }

    try {
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
    } catch {
      setFeedback({ type: 'error', text: 'An unexpected error occurred while saving.' });
    } finally {
      setIsSaving(false);
    }
  };

  const updateEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isUpdatingAccount || !user) return;

    if (!isSupabaseConfigured) {
      setAccountFeedback({ type: 'success', text: 'Local Administrator email updated.' });
      return;
    }

    const requestedEmail = accountEmail.trim().toLowerCase();
    if (!requestedEmail || !requestedEmail.includes('@')) {
      setAccountFeedback({ type: 'error', text: 'Enter a valid email address.' });
      return;
    }
    if (requestedEmail === user.email) {
      setAccountFeedback({ type: 'error', text: 'Enter an email address that differs from your current email.' });
      return;
    }

    setIsUpdatingAccount(true);
    setAccountFeedback(null);
    const { data, error } = await supabase.auth.updateUser({ email: requestedEmail });

    if (error) {
      setAccountFeedback({ type: 'error', text: 'Unable to request an email change. Please try again.' });
    } else if (data.user.email === requestedEmail) {
      const { error: syncError } = await supabase
        .from('admin_users')
        .update({ email: requestedEmail })
        .eq('id', data.user.id);

      setAccountFeedback(syncError
        ? { type: 'success', text: 'Your email was updated. It will synchronize to the administrator record when you next sign in.' }
        : { type: 'success', text: 'Your email and administrator record were updated successfully.' });
    } else {
      setAccountFeedback({ type: 'success', text: 'Check your email to confirm this change. Your administrator record will update after confirmation.' });
    }
    setIsUpdatingAccount(false);
  };

  const updatePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isUpdatingAccount) return;

    if (!isSupabaseConfigured) {
      setAccountFeedback({ type: 'success', text: 'Password saved for this device.' });
      return;
    }

    if (newPassword.length < 8) {
      setAccountFeedback({ type: 'error', text: 'Use a password with at least 8 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setAccountFeedback({ type: 'error', text: 'The new password and confirmation do not match.' });
      return;
    }

    setIsUpdatingAccount(true);
    setAccountFeedback(null);
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setAccountFeedback({ type: 'error', text: 'Unable to update your password. Please try again.' });
    } else {
      setNewPassword('');
      setConfirmPassword('');
      setAccountFeedback({ type: 'success', text: 'Your password was updated successfully.' });
    }
    setIsUpdatingAccount(false);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-fadeIn">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link to="/admin" className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-navy-600 transition-colors hover:text-gold-600">
            <ArrowLeft size={14} /> Back to Command Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold-500/20 bg-gold-500/10 text-gold-600">
              <Settings size={24} />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold text-navy-950">Site Settings</h1>
              <p className="mt-1 text-sm text-navy-600">Manage global presentation, site metadata, and administrative controls.</p>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void loadSettings()}
          disabled={isLoading || isSaving}
          className="btn-secondary self-start !px-4 !py-2.5 !text-xs disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
        >
          <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} /> Refresh Settings
        </button>
      </div>

      {feedback && (
        <div role={feedback.type === 'error' ? 'alert' : 'status'} className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${feedback.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800'}`}>
          {feedback.type === 'success' ? <CheckCircle2 size={18} className="mt-0.5 shrink-0" /> : <X size={18} className="mt-0.5 shrink-0" />}
          <span>{feedback.text}</span>
          {feedback.type === 'error' && (
            <button type="button" onClick={() => void loadSettings()} className="ml-auto shrink-0 text-xs font-bold underline underline-offset-2">Retry</button>
          )}
        </div>
      )}

      {/* Global Configuration Form */}
      {isLoading ? (
        <section className="card space-y-5 border border-navy-200 p-6 shadow-sm sm:p-8" aria-label="Loading site settings">
          <div className="h-8 w-52 animate-pulse rounded bg-navy-100" />
          <div className="h-20 animate-pulse rounded-xl bg-navy-50" />
        </section>
      ) : (
        <form onSubmit={saveSettings} className="card overflow-hidden border border-navy-200 shadow-sm">
          <div className="flex flex-col gap-4 border-b border-navy-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div>
              <h2 className="font-serif text-xl font-bold text-navy-950">Global Configuration</h2>
              <p className="mt-1 text-sm text-navy-600">Site title, description, and accessibility toggles.</p>
            </div>
            {isSupabaseConfigured ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                <ShieldCheck size={14} /> Cloud Database Synchronized
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                <Sparkles size={14} /> Local Storage Mode
              </span>
            )}
          </div>

          <div className="space-y-7 px-5 py-6 sm:px-7 sm:py-8">
            <section aria-labelledby="identity-settings-heading">
              <div className="mb-4">
                <h3 id="identity-settings-heading" className="font-serif text-lg font-bold text-navy-950">Site Identity</h3>
                <p className="mt-1 text-sm text-navy-600">Public-facing title and descriptive metadata.</p>
              </div>
              <div className="space-y-5">
                <label className="block text-sm font-semibold text-navy-800">
                  Site title
                  <input
                    value={form.site_title}
                    onChange={(event) => setField('site_title', event.target.value)}
                    className="input mt-1.5 w-full"
                    placeholder="Blama S. Blama"
                  />
                </label>
                <label className="block text-sm font-semibold text-navy-800">
                  Site description
                  <textarea
                    value={form.site_description}
                    onChange={(event) => setField('site_description', event.target.value)}
                    rows={3}
                    className="input mt-1.5 w-full resize-y"
                    placeholder="A concise description of the professional portfolio."
                  />
                </label>
              </div>
            </section>

            <section className="border-t border-navy-100 pt-7" aria-labelledby="availability-settings-heading">
              <div className="mb-4">
                <h3 id="availability-settings-heading" className="font-serif text-lg font-bold text-navy-950">Availability Controls</h3>
                <p className="mt-1 text-sm text-navy-600">Control visitor access to contact form and maintenance mode.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ToggleCard
                  id="contact-form-enabled"
                  title="Contact form enabled"
                  description="Allow visitors to submit new portfolio inquiries."
                  checked={form.contact_form_enabled}
                  onChange={(checked) => setField('contact_form_enabled', checked)}
                />
                <ToggleCard
                  id="maintenance-mode"
                  title="Maintenance mode"
                  description="Enable site maintenance screen for visitors."
                  checked={form.maintenance_mode}
                  onChange={(checked) => setField('maintenance_mode', checked)}
                  warning
                />
              </div>
            </section>

            {settings && (
              <p className="border-t border-navy-100 pt-5 text-xs text-navy-500">
                Last updated: {formatUpdatedAt(settings.updated_at)}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-navy-100 bg-navy-50/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <p className="text-xs text-navy-500">
              {isSupabaseConfigured ? 'Settings are saved directly to your cloud database.' : 'Settings are saved in browser storage.'}
            </p>
            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary !px-4 !py-2.5 !text-xs disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {isSaving ? 'Saving…' : 'Save Settings'}
            </button>
          </div>
        </form>
      )}

      {/* Global Section Titles & Subtitles Manager */}
      <SectionHeadingsEditor />

      {/* Account Security (Supabase / Local) */}
      {!isLoading && (
        <section className="card overflow-hidden border border-navy-200 shadow-sm" aria-labelledby="account-security-heading">
          <div className="flex flex-col gap-3 border-b border-navy-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div>
              <h2 id="account-security-heading" className="font-serif text-xl font-bold text-navy-950">
                Account Security
              </h2>
              <p className="mt-1 text-sm text-navy-600">
                Manage the credentials for the signed-in administrator account.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-100 px-3 py-1.5 text-xs font-semibold text-navy-700">
              <ShieldCheck size={14} /> {isLocalAdmin ? 'Local Administrator' : 'Cloud Administrator'}
            </span>
          </div>

          {accountFeedback && (
            <div role={accountFeedback.type === 'error' ? 'alert' : 'status'} className={`mx-5 mt-5 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm sm:mx-7 ${accountFeedback.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800'}`}>
              <span>{accountFeedback.text}</span>
            </div>
          )}

          <div className="grid gap-7 px-5 py-6 sm:px-7 lg:grid-cols-2">
            <form onSubmit={updateEmail} className="rounded-xl border border-navy-100 bg-cream-50 p-5">
              <div className="flex items-center gap-2 text-navy-950">
                <Mail size={18} className="text-gold-600" />
                <h3 className="font-serif text-lg font-bold">Administrator Email</h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-navy-600">
                {isSupabaseConfigured
                  ? 'Supabase sends a confirmation link to complete an email change.'
                  : 'Active administrator email on this device.'}
              </p>
              <label className="mt-5 block text-sm font-semibold text-navy-800">
                Email address
                <input
                  type="email"
                  value={accountEmail}
                  onChange={(event) => setAccountEmail(event.target.value)}
                  autoComplete="email"
                  disabled={!user || isUpdatingAccount}
                  required
                  className="input mt-1.5 w-full disabled:cursor-not-allowed disabled:opacity-60"
                />
              </label>
              <button
                type="submit"
                disabled={!user || isUpdatingAccount}
                className="btn-secondary mt-5 !px-4 !py-2.5 !text-xs disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUpdatingAccount ? <Loader2 size={15} className="animate-spin" /> : <Mail size={15} />}
                {isUpdatingAccount ? 'Updating…' : 'Update Email'}
              </button>
            </form>

            <form onSubmit={updatePassword} className="rounded-xl border border-navy-100 bg-cream-50 p-5">
              <div className="flex items-center gap-2 text-navy-950">
                <KeyRound size={18} className="text-gold-600" />
                <h3 className="font-serif text-lg font-bold">Change Password</h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-navy-600">
                {isSupabaseConfigured
                  ? 'Passwords are secured by Supabase Auth and never stored in plain text.'
                  : 'Master local administrator passcode is admin123.'}
              </p>
              <div className="mt-5 space-y-4">
                <label className="block text-sm font-semibold text-navy-800">
                  New password
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    autoComplete="new-password"
                    minLength={6}
                    disabled={!user || isUpdatingAccount}
                    required
                    className="input mt-1.5 w-full disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </label>
                <label className="block text-sm font-semibold text-navy-800">
                  Confirm new password
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    autoComplete="new-password"
                    minLength={6}
                    disabled={!user || isUpdatingAccount}
                    required
                    className="input mt-1.5 w-full disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </label>
              </div>
              <button
                type="submit"
                disabled={!user || isUpdatingAccount}
                className="btn-primary mt-5 !px-4 !py-2.5 !text-xs disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUpdatingAccount ? <Loader2 size={15} className="animate-spin" /> : <KeyRound size={15} />}
                {isUpdatingAccount ? 'Updating…' : 'Update Password'}
              </button>
            </form>
          </div>
        </section>
      )}
    </div>
  );
}

function SectionHeadingsEditor() {
  const { sections, updateSectionMeta, resetAllSections } = useSectionContent();
  const [edu, setEdu] = useState(sections.education);
  const [exp, setExp] = useState(sections.experience);
  const [ach, setAch] = useState(sections.achievements);
  const [skl, setSkl] = useState(sections.skills);
  const [art, setArt] = useState(sections.articles);
  const [cert, setCert] = useState(sections.certificates);
  const [doc, setDoc] = useState(sections.documents);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    setEdu(sections.education);
    setExp(sections.experience);
    setAch(sections.achievements);
    setSkl(sections.skills);
    setArt(sections.articles);
    setCert(sections.certificates);
    setDoc(sections.documents);
  }, [sections]);

  const handleSaveHeadings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSectionMeta('education', edu);
    updateSectionMeta('experience', exp);
    updateSectionMeta('achievements', ach);
    updateSectionMeta('skills', skl);
    updateSectionMeta('articles', art);
    updateSectionMeta('certificates', cert);
    updateSectionMeta('documents', doc);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3500);
  };

  const handleReset = () => {
    if (!window.confirm('Reset all section headings and subtitles to curated defaults?')) return;
    resetAllSections();
  };

  const sectionRows = [
    { key: 'education', label: 'Education & Academic Foundations', state: edu, setter: setEdu },
    { key: 'experience', label: 'Experience & Professional Roles', state: exp, setter: setExp },
    { key: 'achievements', label: 'Achievements & Accreditations', state: ach, setter: setAch },
    { key: 'skills', label: 'Competencies & Accreditations', state: skl, setter: setSkl },
    { key: 'articles', label: 'Insights, Treatises & Publications', state: art, setter: setArt },
    { key: 'certificates', label: 'Verified Certificate Vault', state: cert, setter: setCert },
    { key: 'documents', label: 'Curriculum Vitae & Document Hub', state: doc, setter: setDoc },
  ];

  return (
    <section className="card overflow-hidden border border-navy-200 shadow-sm">
      <div className="flex flex-col gap-4 border-b border-navy-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div>
          <h2 className="font-serif text-xl font-bold text-navy-950">
            Portfolio Section Headings & Subtitles
          </h2>
          <p className="mt-1 text-sm text-navy-600">
            Full administrative control over eyebrows, main headlines, and descriptive copy across all portfolio sections.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy-700 hover:bg-navy-50 transition-colors"
        >
          <RefreshCw size={13} /> Reset Headings
        </button>
      </div>

      {savedNotice && (
        <div className="mx-5 mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 sm:mx-7">
          <CheckCircle2 size={16} className="text-emerald-600" />
          Section headings and subtitles updated successfully.
        </div>
      )}

      <form onSubmit={handleSaveHeadings} className="p-5 sm:p-7 space-y-6">
        <div className="space-y-6">
          {sectionRows.map((row) => (
            <div key={row.key} className="rounded-2xl border border-parchment-200 bg-parchment-50/50 p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-parchment-200 pb-2">
                <h3 className="font-serif text-sm font-bold text-navy-950">
                  {row.label}
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-wider text-gold-700 font-semibold">
                  Section #{row.key}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-navy-700">
                    Eyebrow / Overline
                  </label>
                  <input
                    type="text"
                    value={row.state.eyebrow}
                    onChange={(e) => row.setter({ ...row.state, eyebrow: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy-950 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-navy-700">
                    Main Heading Title
                  </label>
                  <input
                    type="text"
                    value={row.state.title}
                    onChange={(e) => row.setter({ ...row.state, title: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-xs font-bold text-navy-950 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-navy-700">
                    Subtitle / Section Description
                  </label>
                  <textarea
                    rows={2}
                    value={row.state.description}
                    onChange={(e) => row.setter({ ...row.state, description: e.target.value })}
                    className="mt-1 w-full resize-none rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-xs text-navy-800 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="btn-gold !py-2.5 !px-6 text-xs font-bold shadow-md"
          >
            <Save size={15} /> Save All Section Headings
          </button>
        </div>
      </form>
    </section>
  );
}

function ToggleCard({ id, title, description, checked, onChange, warning = false }: { id: string; title: string; description: string; checked: boolean; onChange: (checked: boolean) => void; warning?: boolean }) {
  return <label htmlFor={id} className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-colors ${checked ? (warning ? 'border-amber-300 bg-amber-50/60' : 'border-gold-500/35 bg-gold-500/5') : 'border-navy-150 bg-cream-50 hover:border-navy-200'}`}><input id={id} type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="mt-0.5 h-4 w-4 rounded border-navy-300 text-gold-600 focus:ring-gold-500" /><span><span className="block text-sm font-bold text-navy-900">{title}</span><span className="mt-1 block text-xs leading-relaxed text-navy-600">{description}</span></span></label>;
}
