import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  UserCheck,
  GraduationCap,
  Briefcase,
  Award,
  Layers,
  FileText,
  Image as ImageIcon,
  History,
  Mail,
  Settings,
  ShieldCheck,
  Database,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const cmsSections = [
  {
    title: 'Professional Profile',
    description: 'Manage name, titles, biographical statements, contact links, and official portrait.',
    path: '/admin/profile',
    icon: UserCheck,
    phase: 'Phase 5',
    status: 'Ready for CRUD',
  },
  {
    title: 'Academic Education',
    description: 'Curate university degrees, institutions, graduation years, and status indicators.',
    path: '/admin/education',
    icon: GraduationCap,
    phase: 'Phase 6',
    status: 'Ready for CRUD',
  },
  {
    title: 'Professional Experience',
    description: 'Manage career positions, relational responsibilities, skills developed, and achievements.',
    path: '/admin/experience',
    icon: Briefcase,
    phase: 'Phase 7',
    status: 'Ready for CRUD',
  },
  {
    title: 'Achievements & Honors',
    description: 'Manage fellowships, academic awards, verifications, and leadership milestones.',
    path: '/admin/achievements',
    icon: Award,
    phase: 'Phase 8',
    status: 'Ready for CRUD',
  },
  {
    title: 'Skills & Competencies',
    description: 'Two-level relational categories and skills taxonomy with display reordering.',
    path: '/admin/skills',
    icon: Layers,
    phase: 'Phase 8',
    status: 'Ready for CRUD',
  },
  {
    title: 'Articles & Publications',
    description: 'Publishing engine for articles, drafting, scheduling, markdown content, and excerpts.',
    path: '/admin/articles',
    icon: FileText,
    phase: 'Phase 9',
    status: 'Ready for CRUD',
  },
  {
    title: 'Media Gallery',
    description: 'Curate portfolio photographs, Supabase storage media uploads, and category tagging.',
    path: '/admin/gallery',
    icon: ImageIcon,
    phase: 'Phase 10',
    status: 'Ready for CRUD',
  },
  {
    title: 'Career Journey Timeline',
    description: 'Manage curated chronological milestones and career progression highlights.',
    path: '/admin/timeline',
    icon: History,
    phase: 'Phase 11',
    status: 'Ready for CRUD',
  },
  {
    title: 'Contact Messages Inbox',
    description: 'Private administration inbox for visitor contact inquiries with read/reply workflows.',
    path: '/admin/messages',
    icon: Mail,
    phase: 'Phase 12',
    status: 'Ready for CRUD',
  },
  {
    title: 'Site Configuration',
    description: 'Global parameters, maintenance mode toggles, and contact form settings.',
    path: '/admin/settings',
    icon: Settings,
    phase: 'Phase 13',
    status: 'Ready for CRUD',
  },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-850 p-8 lg:p-10 text-white shadow-xl border border-navy-800">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-3.5 py-1 text-xs font-semibold text-gold-300 mb-3">
              <Sparkles size={13} />
              <span>Phase 2 Active: Authentication & Authorization Enforced</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Welcome back, Administrator
            </h1>
            <p className="mt-2 text-sm sm:text-base text-navy-200 max-w-2xl leading-relaxed">
              This is the centralized executive command center for the <strong className="text-gold-300 font-semibold">Blama S. Blama</strong> professional portfolio. All administration routes are guarded by database-backed RLS security.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="rounded-2xl bg-navy-900/90 border border-navy-800 p-4 min-w-[200px]">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-navy-400">
                Active Admin Identity
              </p>
              <p className="text-sm font-bold text-white mt-0.5 truncate">
                {user?.email || 'admin@portfolio.local'}
              </p>
              <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-400">
                ● Database Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Security & System Infrastructure Status */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-navy-500 mb-3 px-1">
          System & Security Architecture
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-5 border-l-4 border-l-emerald-500">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Database size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-navy-500">
                  Supabase Database
                </p>
                <h4 className="text-sm font-bold text-navy-900">zxstupxcdelwmkevidtr</h4>
              </div>
            </div>
            <p className="mt-2.5 text-xs text-navy-600">
              PostgreSQL schema verified and linked via Supabase CLI.
            </p>
          </div>

          <div className="card p-5 border-l-4 border-l-gold-500">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-50 text-gold-600">
                <Lock size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-navy-500">
                  Row Level Security
                </p>
                <h4 className="text-sm font-bold text-navy-900">100% Enforced</h4>
              </div>
            </div>
            <p className="mt-2.5 text-xs text-navy-600">
              15 application tables guarded by granular RLS policies.
            </p>
          </div>

          <div className="card p-5 border-l-4 border-l-navy-700">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-navy-800">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-navy-500">
                  Role Authorization
                </p>
                <h4 className="text-sm font-bold text-navy-900">is_admin() Guard</h4>
              </div>
            </div>
            <p className="mt-2.5 text-xs text-navy-600">
              Evaluated server-side against <code className="text-[11px] bg-navy-100 px-1 py-0.5 rounded">admin_users</code> table.
            </p>
          </div>

          <div className="card p-5 border-l-4 border-l-sky-500">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                <ImageIcon size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-navy-500">
                  Supabase Storage
                </p>
                <h4 className="text-sm font-bold text-navy-900">portfolio-media</h4>
              </div>
            </div>
            <p className="mt-2.5 text-xs text-navy-600">
              Storage bucket provisioned with public read and admin write.
            </p>
          </div>
        </div>
      </div>

      {/* CMS Management Sections Grid */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <h2 className="font-serif text-xl font-bold text-navy-950">
              Portfolio Content Management Modules
            </h2>
            <p className="text-xs text-navy-600">
              Select a module below to view the module interface.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cmsSections.map((sec) => {
            const Icon = sec.icon;
            return (
              <Link
                key={sec.path}
                to={sec.path}
                className="card card-hover group p-6 flex flex-col justify-between transition-all duration-300 hover:border-gold-500/50 hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-navy-800 transition-colors group-hover:bg-gold-500 group-hover:text-white">
                      <Icon size={20} />
                    </div>
                    <span className="rounded-full bg-navy-100 px-2.5 py-0.5 text-[11px] font-semibold text-navy-700">
                      {sec.phase}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-navy-900 group-hover:text-gold-700 transition-colors">
                    {sec.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-navy-600">
                    {sec.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-navy-100 flex items-center justify-between text-xs font-semibold text-gold-600 group-hover:text-gold-700">
                  <span>Open Management View</span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
