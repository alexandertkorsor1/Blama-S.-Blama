import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
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
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
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
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

          <div className="rounded-2xl border border-navy-700 bg-navy-950/60 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-navy-400">
              Signed in as
            </p>
            <p className="mt-0.5 max-w-[240px] truncate text-xs font-semibold text-white">
              {user?.email ?? 'admin@blamasblama.com'}
            </p>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section aria-labelledby="overview">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gold-700">Portfolio overview</p>
            <h2 id="overview" className="mt-1 font-serif text-2xl font-bold text-navy-950">
              Content at a glance
            </h2>
            <p className="mt-1 text-sm text-navy-600">
              Live totals from the portfolio system.
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
    </div>
  );
}
