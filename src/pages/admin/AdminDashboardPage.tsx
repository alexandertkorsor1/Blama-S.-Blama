import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Database,
  FileText,
  GraduationCap,
  History,
  Image as ImageIcon,
  Landmark,
  Layers,
  Mail,
  RefreshCw,
  Settings,
  ShieldCheck,
  Sparkles,
  UserCheck,
  X,
  AlertCircle,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase, isSupabaseConfigured, getSupabaseConfigInfo, saveSupabaseConfig, testSupabaseConnection } from '@/lib/supabase';
import { certificates as initialCertificates } from '@/data/certificates';
import { initialHubDocuments } from '@/data/documents';
import { education as staticEducation } from '@/data/education';
import { experiences as staticExperiences } from '@/data/experience';
import { skillGroups as staticSkillGroups } from '@/data/skills';
import { articles as staticArticles } from '@/data/articles';
import { achievements as staticAchievements } from '@/data/achievements';
import { timelineEntries as staticTimelineEntries } from '@/data/timeline';
import { galleryImages as staticGalleryImages } from '@/data/gallery';

const CERT_STORAGE_KEY = 'blama_portfolio_certificates_vault_v1';
const DOCS_STORAGE_KEY = 'blama_portfolio_document_hub_v1';

type DashboardStats = {
  education: number;
  experiences: number;
  achievements: number;
  skills: number;
  articles: number;
  galleryImages: number;
  timelineItems: number;
  unreadMessages: number;
  certificates: number;
  documents: number;
};

const totalStaticSkills = staticSkillGroups.reduce((acc, g) => acc + g.skills.length, 0);

const emptyStats: DashboardStats = {
  education: staticEducation.length,
  experiences: staticExperiences.length,
  achievements: staticAchievements.length,
  skills: totalStaticSkills,
  articles: staticArticles.length,
  galleryImages: staticGalleryImages.length,
  timelineItems: staticTimelineEntries.length,
  unreadMessages: 0,
  certificates: initialCertificates.length,
  documents: initialHubDocuments.length,
};

const actions = [
  ['Profile', '/admin/profile', UserCheck],
  ['Education', '/admin/education', GraduationCap],
  ['Experience', '/admin/experience', Briefcase],
  ['Achievements', '/admin/achievements', Award],
  ['Skills', '/admin/skills', Layers],
  ['Leadership & PYPP', '/admin/leadership', Landmark],
  ['Articles', '/admin/articles', FileText],
  ['Certificates', '/admin/certificates', ShieldCheck],
  ['Document Hub', '/admin/documents', BookOpen],
  ['Gallery', '/admin/gallery', ImageIcon],
  ['Timeline', '/admin/timeline', History],
  ['Messages', '/admin/messages', Mail],
  ['Settings', '/admin/settings', Settings],
] as const;

export default function AdminDashboardPage() {
  const { user, isLocalAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Database Connection Modal
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const configInfo = getSupabaseConfigInfo();
  const [configUrl, setConfigUrl] = useState(configInfo.url || '');
  const [configKey, setConfigKey] = useState(configInfo.anonKey || '');
  const [isTestingConfig, setIsTestingConfig] = useState(false);
  const [configTestResult, setConfigTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const loadStats = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    let certCount = initialCertificates.length;
    try {
      const saved = localStorage.getItem(CERT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) certCount = parsed.length;
      }
    } catch {
      // fallback
    }

    let docCount = initialHubDocuments.length;
    try {
      const savedDocs = localStorage.getItem(DOCS_STORAGE_KEY);
      if (savedDocs) {
        const parsed = JSON.parse(savedDocs);
        if (Array.isArray(parsed)) docCount = parsed.length;
      }
    } catch {
      // fallback
    }

    if (!isSupabaseConfigured) {
      setStats({
        education: staticEducation.length,
        experiences: staticExperiences.length,
        achievements: staticAchievements.length,
        skills: totalStaticSkills,
        articles: staticArticles.length,
        galleryImages: staticGalleryImages.length,
        timelineItems: staticTimelineEntries.length,
        unreadMessages: 0,
        certificates: certCount,
        documents: docCount,
      });
      setIsLoading(false);
      return;
    }

    try {
      const [education, experiences, achievements, skills, articles, galleryImages, timelineItems, unreadMessages] =
        await Promise.all([
          supabase.from('education').select('*', { count: 'exact', head: true }),
          supabase.from('experiences').select('*', { count: 'exact', head: true }),
          supabase.from('achievements').select('*', { count: 'exact', head: true }),
          supabase.from('skills').select('*', { count: 'exact', head: true }),
          supabase.from('articles').select('*', { count: 'exact', head: true }),
          supabase.from('gallery_images').select('*', { count: 'exact', head: true }),
          supabase.from('timeline_items').select('*', { count: 'exact', head: true }),
          supabase.from('contact_messages').select('*', { count: 'exact', head: true }).is('read_at', null),
        ]);

      const results = [
        ['education records', education],
        ['experience records', experiences],
        ['achievements', achievements],
        ['skills', skills],
        ['articles', articles],
        ['gallery images', galleryImages],
        ['timeline items', timelineItems],
        ['unread messages', unreadMessages],
      ] as const;

      const failures = results.filter(([, result]) => result.error).map(([label]) => label);
      if (failures.length) {
        console.warn('[Dashboard] Database query warnings (using local fallback counts):', failures);
      }

      setStats({
        education: education.count ?? staticEducation.length,
        experiences: experiences.count ?? staticExperiences.length,
        achievements: achievements.count ?? staticAchievements.length,
        skills: skills.count ?? totalStaticSkills,
        articles: articles.count ?? staticArticles.length,
        galleryImages: galleryImages.count ?? staticGalleryImages.length,
        timelineItems: timelineItems.count ?? staticTimelineEntries.length,
        unreadMessages: unreadMessages.count ?? 0,
        certificates: certCount,
        documents: docCount,
      });
    } catch {
      // Graceful fallback to static counts
      setStats({
        education: staticEducation.length,
        experiences: staticExperiences.length,
        achievements: staticAchievements.length,
        skills: totalStaticSkills,
        articles: staticArticles.length,
        galleryImages: staticGalleryImages.length,
        timelineItems: staticTimelineEntries.length,
        unreadMessages: 0,
        certificates: certCount,
        documents: docCount,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  const handleTestAndSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTestingConfig(true);
    setConfigTestResult(null);

    const test = await testSupabaseConnection(configUrl, configKey);
    if (!test.success) {
      setConfigTestResult({ success: false, message: test.error || 'Connection failed.' });
      setIsTestingConfig(false);
      return;
    }

    saveSupabaseConfig(configUrl, configKey);
    setConfigTestResult({
      success: true,
      message: 'Connection verified! Reloading with your Supabase database...',
    });

    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  const cards = [
    ['Document Hub', stats.documents, 'CV & policy briefs in hub', '/admin/documents', BookOpen, 'bg-emerald-50 text-emerald-800'],
    ['Certificates', stats.certificates, 'verified credentials in vault', '/admin/certificates', ShieldCheck, 'bg-amber-50 text-amber-800'],
    ['Education', stats.education, 'academic records', '/admin/education', GraduationCap, 'bg-sky-50 text-sky-700'],
    ['Experience', stats.experiences, 'career positions', '/admin/experience', Briefcase, 'bg-violet-50 text-violet-700'],
    ['Achievements', stats.achievements, 'honors and awards', '/admin/achievements', Award, 'bg-gold-50 text-gold-700'],
    ['Skills', stats.skills, 'competencies listed', '/admin/skills', Layers, 'bg-teal-50 text-teal-700'],
    ['Articles', stats.articles, 'articles in library', '/admin/articles', FileText, 'bg-rose-50 text-rose-700'],
    ['Gallery', stats.galleryImages, 'portfolio images', '/admin/gallery', ImageIcon, 'bg-cyan-50 text-cyan-700'],
    ['Timeline', stats.timelineItems, 'career milestones', '/admin/timeline', History, 'bg-indigo-50 text-indigo-700'],
    ['Unread Messages', stats.unreadMessages, 'awaiting review', '/admin/messages', Mail, 'bg-red-50 text-red-700'],
  ] as const;

  return (
    <div className="mx-auto max-w-7xl space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-navy-800 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 p-7 text-white shadow-xl sm:p-10">
        <div className="pointer-events-none absolute -right-12 -top-16 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-xs font-semibold text-gold-300">
              <Sparkles size={13} /> Portfolio content management
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back, Administrator.
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-navy-200 sm:text-base">
              Manage the professional story, credentials, publications, and visual archive of the Blama S. Blama portfolio from one secure workspace.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="rounded-2xl border border-navy-700 bg-navy-950/60 px-4 py-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-navy-400">
                    Signed in as {isLocalAdmin ? '(Local Admin)' : ''}
                  </p>
                  <p className="mt-0.5 max-w-[220px] truncate text-xs font-semibold text-white">
                    {user?.email ?? 'admin@blamasblama.com'}
                  </p>
                </div>
                <span
                  className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                    isSupabaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                  title={isSupabaseConfigured ? 'Supabase Connected' : 'Local Storage Mode'}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsDbModalOpen(true)}
              className="rounded-2xl border border-gold-500/40 bg-gold-500/10 hover:bg-gold-500/20 px-4 py-3 text-xs font-semibold text-gold-300 transition-colors flex items-center gap-2 shrink-0"
            >
              <Database size={15} />
              <span>{isSupabaseConfigured ? 'DB Sync: Active' : 'Connect Supabase'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Local Storage Mode Information Notice (if Supabase is not connected) */}
      {!isSupabaseConfigured && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-start gap-3">
            <Sparkles size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950">
                Running in Local Administrative Storage Mode
              </p>
              <p className="mt-0.5 text-amber-800">
                All certificate uploads, document attachments, and section customizer edits are saved directly in your browser. To synchronize across multiple devices, connect a Supabase database.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsDbModalOpen(true)}
            className="btn-gold !py-2 !px-4 !text-xs font-bold shrink-0 self-start sm:self-auto"
          >
            <Database size={14} /> Connect Supabase
          </button>
        </div>
      )}

      {/* Overview */}
      <section aria-labelledby="overview">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gold-700">Portfolio overview</p>
            <h2 id="overview" className="mt-1 font-serif text-2xl font-bold text-navy-950">
              Content at a glance
            </h2>
            <p className="mt-1 text-sm text-navy-600">
              {isSupabaseConfigured ? 'Live totals from the portfolio database.' : 'Total records active in the portfolio system.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadStats()}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-navy-300 bg-white px-4 py-2.5 text-sm font-semibold text-navy-800 shadow-sm disabled:opacity-60"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            {isLoading ? 'Refreshing…' : 'Refresh overview'}
          </button>
        </div>

        {errorMessage && (
          <div role="alert" className="mb-5 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">Dashboard statistics could not be loaded.</p>
              <p className="mt-1 text-red-700">{errorMessage}</p>
            </div>
            <button type="button" onClick={() => void loadStats()} className="font-semibold underline">
              Try again
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(([label, value, description, path, Icon, colour]) => (
            <Link
              key={path}
              to={path}
              className="card card-hover group p-5 transition-all hover:border-gold-500/50"
            >
              <div className="flex items-start justify-between gap-4">
                <div className={'flex h-11 w-11 items-center justify-center rounded-xl ' + colour}>
                  <Icon size={20} />
                </div>
                <span className="text-3xl font-bold tracking-tight text-navy-950">
                  {isLoading ? <span className="inline-block h-8 w-12 animate-pulse rounded bg-navy-100 align-middle" /> : value}
                </span>
              </div>
              <p className="mt-5 font-serif text-base font-bold text-navy-900 group-hover:text-gold-700">
                {label}
              </p>
              <p className="mt-1 text-xs text-navy-600">{description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="rounded-3xl border border-navy-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gold-700">Quick actions</p>
            <h2 className="mt-1 font-serif text-2xl font-bold text-navy-950">Manage portfolio content</h2>
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-700">
            <CheckCircle2 size={15} /> Secure administrator session
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {actions.map(([label, path, Icon]) => (
            <Link
              key={path}
              to={path}
              className="group flex min-h-24 flex-col justify-between rounded-2xl border border-navy-200 bg-cream-50 p-4 text-navy-800 transition-all hover:-translate-y-0.5 hover:border-gold-500 hover:bg-white hover:shadow-md"
            >
              <Icon size={19} className="text-gold-600" />
              <span className="mt-3 text-sm font-semibold">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Database Setup Modal */}
      {isDbModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-2xl border border-navy-700 bg-navy-900 p-6 sm:p-7 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-navy-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400 border border-gold-500/30">
                  <Database size={20} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold">Supabase Database Connection</h3>
                  <p className="text-xs text-navy-400">Configure or update live database synchronization</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDbModalOpen(false)}
                className="rounded-lg p-1 text-navy-400 hover:bg-navy-800 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-navy-300 leading-relaxed">
              <p>
                Connect your Supabase project to enable cloud database storage and multi-admin collaboration across all devices.
              </p>

              {configTestResult && (
                <div
                  className={`flex items-start gap-2.5 rounded-xl border p-3.5 ${
                    configTestResult.success
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                      : 'border-red-500/30 bg-red-500/10 text-red-200'
                  }`}
                >
                  {configTestResult.success ? (
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                  )}
                  <span>{configTestResult.message}</span>
                </div>
              )}

              <form onSubmit={handleTestAndSaveConfig} className="space-y-4 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-navy-200 mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://your-project.supabase.co"
                    value={configUrl}
                    onChange={(e) => setConfigUrl(e.target.value)}
                    className="w-full rounded-xl border border-navy-700 bg-navy-950 px-3.5 py-2.5 text-xs text-white placeholder-navy-500 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-navy-200 mb-1">
                    Supabase Anon Public API Key
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={configKey}
                    onChange={(e) => setConfigKey(e.target.value)}
                    className="w-full rounded-xl border border-navy-700 bg-navy-950 px-3.5 py-2.5 text-xs text-white placeholder-navy-500 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 font-mono"
                  />
                </div>

                <div className="rounded-xl border border-navy-800 bg-navy-950/60 p-3 text-[11px] text-navy-400">
                  <p className="font-semibold text-navy-300">Finding your credentials:</p>
                  <p className="mt-1">
                    In your Supabase project dashboard, visit <strong>Project Settings → API</strong>.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsDbModalOpen(false)}
                    className="rounded-xl border border-navy-700 bg-navy-800 px-4 py-2 text-xs font-semibold text-white hover:bg-navy-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isTestingConfig}
                    className="btn-primary !py-2 !px-5 !text-xs font-bold"
                  >
                    {isTestingConfig ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Testing & Connecting...</span>
                      </>
                    ) : (
                      <>
                        <Database size={14} />
                        <span>Save & Connect</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
