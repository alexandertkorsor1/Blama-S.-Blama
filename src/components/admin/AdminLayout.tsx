import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
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
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  BookOpen,
  Landmark,
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
  { name: 'Profile', path: '/admin/profile', icon: UserCheck },
  { name: 'Education', path: '/admin/education', icon: GraduationCap },
  { name: 'Experience', path: '/admin/experience', icon: Briefcase },
  { name: 'Achievements', path: '/admin/achievements', icon: Award },
  { name: 'Skills', path: '/admin/skills', icon: Layers },
  { name: 'Leadership & PYPP', path: '/admin/leadership', icon: Landmark },
  { name: 'Articles', path: '/admin/articles', icon: FileText },
  { name: 'Certificates Vault', path: '/admin/certificates', icon: ShieldCheck },
  { name: 'CV & Document Hub', path: '/admin/documents', icon: BookOpen },
  { name: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
  { name: 'Timeline', path: '/admin/timeline', icon: History },
  { name: 'Messages', path: '/admin/messages', icon: Mail },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  const getCurrentPageTitle = () => {
    const item = navigationItems.find((n) =>
      n.exact ? location.pathname === n.path : location.pathname.startsWith(n.path)
    );
    return item ? item.name : 'Administration';
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col lg:flex-row text-navy-900 font-sans">
      {/* Mobile Header Bar */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between bg-navy-950 px-5 py-4 text-white border-b border-navy-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold-500/40 bg-navy-900 text-gold-400 font-serif font-bold text-sm">
            BSB
          </div>
          <div>
            <h1 className="font-serif text-sm font-bold tracking-tight text-white">
              Blama S. Blama
            </h1>
            <p className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
              Admin Portal
            </p>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-navy-900 text-navy-200 hover:text-white border border-navy-800"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-navy-950 text-white flex flex-col border-r border-navy-800 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="p-6 border-b border-navy-800/80">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold-500/40 bg-gradient-to-br from-navy-900 to-navy-950 text-gold-400 font-serif font-bold text-base shadow-inner">
              BSB
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-serif text-base font-bold text-white truncate">
                Blama S. Blama
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-medium text-gold-300 truncate">
                  CMS Administrator
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-5 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-navy-400">
            Portfolio Management
          </div>

          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gold-500/15 text-gold-300 font-semibold border border-gold-500/30 shadow-sm'
                    : 'text-navy-300 hover:text-white hover:bg-navy-900/70'
                }`}
              >
                <Icon
                  size={18}
                  className={`shrink-0 transition-colors ${
                    isActive ? 'text-gold-400' : 'text-navy-400'
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Identity & Actions Footer */}
        <div className="p-4 border-t border-navy-800/80 bg-navy-950/70 space-y-3">
          {/* Admin Identity Card */}
          <div className="rounded-xl bg-navy-900/80 border border-navy-800 p-3">
            <div className="flex items-center gap-2 text-xs font-medium text-navy-200 truncate">
              <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
              <span className="truncate">{user?.email || 'admin@portfolio.local'}</span>
            </div>
            <p className="mt-1 text-[10px] text-gold-400/90 pl-5">
              Verified Database Role
            </p>
          </div>

          {/* Quick Buttons */}
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-xs font-medium text-navy-200 hover:text-white hover:bg-navy-800 transition-colors"
              title="Open Public Website in new tab"
            >
              <ExternalLink size={13} />
              <span>Live Site</span>
            </a>

            <button
              onClick={handleSignOut}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300 hover:bg-red-500/20 transition-colors"
              title="Sign Out of Admin Portal"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Desktop Top Header Bar */}
        <header className="hidden lg:flex items-center justify-between bg-white border-b border-navy-200/80 px-8 py-4 shadow-xs">
          <div>
            <nav className="flex items-center gap-2 text-xs text-navy-500 mb-0.5">
              <span>Admin Portal</span>
              <span>/</span>
              <span className="font-semibold text-gold-700">{getCurrentPageTitle()}</span>
            </nav>
            <h2 className="font-serif text-xl font-bold text-navy-950">
              {getCurrentPageTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full border border-navy-200 bg-navy-50/80 px-3 py-1 text-xs font-medium text-navy-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Supabase Connected</span>
            </div>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-navy-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-navy-800 hover:border-gold-500 hover:text-gold-700 transition-colors shadow-xs"
            >
              <ExternalLink size={13} />
              <span>View Public Site</span>
            </a>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-8 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
