import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, LOCAL_ADMIN_DEFAULT_EMAIL, LOCAL_ADMIN_DEFAULT_PASSCODE } from '@/context/AuthContext';
import {
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Database,
  Sparkles,
  CheckCircle2,
  X,
  Key,
  ExternalLink,
} from 'lucide-react';
import { getSupabaseConfigInfo, saveSupabaseConfig, clearSupabaseConfig, testSupabaseConnection } from '@/lib/supabase';

export default function AdminLoginPage() {
  const { signIn, user, isAdmin, isLoading, isSupabaseConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Supabase Config Modal State
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const configInfo = getSupabaseConfigInfo();
  const [configUrl, setConfigUrl] = useState(configInfo.url || '');
  const [configKey, setConfigKey] = useState(configInfo.anonKey || '');
  const [isTestingConfig, setIsTestingConfig] = useState(false);
  const [configTestResult, setConfigTestResult] = useState<{ success: boolean; message: string } | null>(null);

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

    const targetEmail = email.trim() || LOCAL_ADMIN_DEFAULT_EMAIL;
    if (!password) {
      setErrorMessage('Please enter your administrator password or passcode.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await signIn(targetEmail, password);
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

  const handleFillDemo = () => {
    setEmail(LOCAL_ADMIN_DEFAULT_EMAIL);
    setPassword(LOCAL_ADMIN_DEFAULT_PASSCODE);
    setErrorMessage(null);
  };

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

  const handleClearConfig = () => {
    if (window.confirm('Clear custom Supabase credentials from this browser?')) {
      clearSupabaseConfig();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-navy-950 px-4 py-12 relative overflow-hidden">
      {/* Background Lighting */}
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

        {/* Database Connection Status Badge */}
        <div className="mb-4 flex items-center justify-between rounded-xl border border-navy-800 bg-navy-900/80 px-4 py-2 text-xs text-navy-300 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                isSupabaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span>
              {isSupabaseConfigured ? 'Supabase Database Connected' : 'Local Storage Mode (Standby)'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsConfigModalOpen(true)}
            className="flex items-center gap-1 text-[11px] font-semibold text-gold-400 hover:text-gold-300 transition-colors"
          >
            <Database size={13} />
            <span>{isSupabaseConfigured ? 'Change DB' : 'Configure DB'}</span>
          </button>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-navy-800 bg-navy-900/90 p-8 shadow-2xl backdrop-blur-xl ring-1 ring-gold-500/10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gold-400 font-semibold">
              <ShieldCheck size={16} />
              <span>Secure Administrator Access</span>
            </div>
            {!isSupabaseConfigured && (
              <span className="rounded bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                Master Fallback Active
              </span>
            )}
          </div>

          {!isSupabaseConfigured && (
            <div className="mb-5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200">
              <div className="flex items-start gap-2">
                <Sparkles size={15} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-300">Instant Admin Access Available</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-amber-200/90">
                    Use default passcode <code className="rounded bg-navy-950 px-1.5 py-0.5 text-amber-300 font-mono font-bold">admin123</code> to access all certificate, document, and content tools immediately.
                  </p>
                  <button
                    type="button"
                    onClick={handleFillDemo}
                    className="mt-2 text-[11px] font-bold text-amber-300 underline hover:text-white transition-colors"
                  >
                    ⚡ Auto-fill Admin Credentials
                  </button>
                </div>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs leading-relaxed text-red-200 animate-fadeIn">
              <AlertCircle size={16} className="shrink-0 text-red-400 mt-0.5" />
              <div className="flex-1">
                <span>{errorMessage}</span>
                {!isSupabaseConfigured && (
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={handleFillDemo}
                      className="font-bold text-red-300 underline hover:text-white"
                    >
                      Click here to use default admin passcode (admin123)
                    </button>
                  </div>
                )}
              </div>
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-navy-200 uppercase tracking-wider">
                  Password / Passcode
                </label>
                {!isSupabaseConfigured && (
                  <span className="text-[11px] text-gold-400 font-mono">
                    Passcode: admin123
                  </span>
                )}
              </div>
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
                  <span>Verifying Administrator Access...</span>
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
        <div className="mt-8 flex items-center justify-between text-xs text-navy-400">
          <a
            href="/"
            className="font-medium hover:text-gold-300 transition-colors inline-flex items-center gap-1.5"
          >
            <span>← Return to Public Portfolio</span>
          </a>

          <button
            type="button"
            onClick={() => setIsConfigModalOpen(true)}
            className="font-medium hover:text-gold-300 transition-colors inline-flex items-center gap-1"
          >
            <Database size={13} />
            <span>Database Setup</span>
          </button>
        </div>
      </div>

      {/* Supabase Connection Setup Modal */}
      {isConfigModalOpen && (
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
                onClick={() => setIsConfigModalOpen(false)}
                className="rounded-lg p-1 text-navy-400 hover:bg-navy-800 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-navy-300 leading-relaxed">
              <p>
                You can connect your own Supabase project by pasting the credentials below. They will be securely stored in your browser without requiring a repository rebuild.
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
                    Supabase Project URL (VITE_SUPABASE_URL)
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
                    Supabase Anon Public API Key (VITE_SUPABASE_ANON_KEY)
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
                  <p className="flex items-center gap-1.5 font-semibold text-navy-300">
                    <Key size={13} className="text-gold-400" />
                    How to find your keys in Supabase:
                  </p>
                  <p className="mt-1">
                    Log in to <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-gold-400 underline inline-flex items-center gap-0.5">supabase.com <ExternalLink size={10} /></a> → Select your Project → Go to <strong>Project Settings → API</strong>.
                  </p>
                </div>

                <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2">
                  {configInfo.isCustom ? (
                    <button
                      type="button"
                      onClick={handleClearConfig}
                      className="text-xs text-red-400 hover:text-red-300 underline"
                    >
                      Clear Browser Credentials
                    </button>
                  ) : (
                    <span />
                  )}

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => setIsConfigModalOpen(false)}
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
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
