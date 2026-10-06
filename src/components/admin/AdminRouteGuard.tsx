import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ShieldAlert, LogOut, ArrowLeft, Loader2 } from 'lucide-react';

export default function AdminRouteGuard() {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-navy-950 text-white px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gold-500/30 bg-navy-900 shadow-2xl mb-6">
          <Loader2 className="h-8 w-8 animate-spin text-gold-400" />
        </div>
        <h2 className="font-serif text-xl font-bold tracking-wide text-white">
          Authenticating Administrative Session
        </h2>
        <p className="mt-2 text-sm text-navy-300">
          Verifying credentials and security permissions...
        </p>
      </div>
    );
  }

  // Not authenticated at all -> redirect to login
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Authenticated with Supabase Auth, but NOT listed in admin_users
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-950 px-4 py-12">
        <div className="max-w-md w-full rounded-2xl border border-red-500/20 bg-navy-900/90 p-8 text-center shadow-2xl backdrop-blur-md">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 mb-5">
            <ShieldAlert size={28} />
          </div>

          <h1 className="font-serif text-2xl font-bold text-white">
            Administrative Access Required
          </h1>

          <p className="mt-3 text-sm text-navy-200 leading-relaxed">
            You are signed in as <span className="font-medium text-gold-300">{user.email}</span>, but this account is not registered in the system's administrator registry.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={() => signOut()}
              className="flex items-center justify-center gap-2 rounded-lg bg-navy-800 border border-navy-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 transition-colors"
            >
              <LogOut size={16} />
              <span>Sign Out & Switch Account</span>
            </button>

            <a
              href="/"
              className="flex items-center justify-center gap-2 rounded-lg border border-gold-500/30 bg-gold-500/10 px-4 py-2.5 text-sm font-semibold text-gold-300 hover:bg-gold-500/20 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Return to Public Website</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Authorized Admin
  return <Outlet />;
}
