import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, ArrowRight, Eye, EyeOff, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const { signIn, user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If already logged in as authorized admin, redirect immediately to dashboard or intended route
  useEffect(() => {
    if (!isLoading && user && isAdmin) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    }
  }, [user, isAdmin, isLoading, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your administrator email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setErrorMessage(error);
      } else {
        const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';
        navigate(from, { replace: true });
      }
    } catch {
      setErrorMessage('An unexpected error occurred during authentication. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-navy-950 px-4 py-12 relative overflow-hidden">
      {/* Subtle Background Lighting */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 30% 20%, rgba(197,165,114,0.2) 0%, transparent 60%), radial-gradient(circle at 70% 80%, rgba(197,165,114,0.1) 0%, transparent 60%)',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-gold-500/40 bg-gradient-to-b from-navy-800 to-navy-900 text-gold-400 font-serif font-bold text-2xl shadow-xl">
            BSB
          </div>
          <h1 className="mt-5 font-serif text-3xl font-bold tracking-tight text-white">
            Portfolio Administration
          </h1>
          <p className="mt-2 text-sm text-gold-300 font-medium">
            Blama S. Blama • Executive Content Management
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-navy-800 bg-navy-900/90 p-8 shadow-2xl backdrop-blur-xl ring-1 ring-gold-500/10">
          <div className="flex items-center gap-2 mb-6 text-xs uppercase tracking-wider text-gold-400 font-semibold">
            <ShieldCheck size={16} />
            <span>Secure Administrator Access</span>
          </div>

          {errorMessage && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs leading-relaxed text-red-200 animate-fadeIn">
              <AlertCircle size={16} className="shrink-0 text-red-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-navy-200 mb-1.5 uppercase tracking-wider">
                Administrator Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-navy-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@blamasblama.com"
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-navy-700 bg-navy-950/80 pl-10 pr-4 py-3 text-sm text-white placeholder-navy-500 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-200 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-navy-400">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-navy-700 bg-navy-950/80 pl-10 pr-11 py-3 text-sm text-white placeholder-navy-500 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-colors disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-navy-400 hover:text-white transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full justify-center !py-3.5 !rounded-xl !text-sm font-semibold !tracking-wide mt-2 shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Public Website Return Link */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-xs font-medium text-navy-400 hover:text-gold-300 transition-colors inline-flex items-center gap-1.5"
          >
            <span>← Return to Public Portfolio Website</span>
          </a>
        </div>
      </div>
    </div>
  );
}
