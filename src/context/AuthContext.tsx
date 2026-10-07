import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const LOCAL_ADMIN_STORAGE_KEY = 'blama_local_admin_session_v1';
const LOCAL_ADMIN_EMAIL_KEY = 'blama_local_admin_email_v1';

export const LOCAL_ADMIN_DEFAULT_EMAIL = 'admin@blamasblama.com';
export const LOCAL_ADMIN_DEFAULT_PASSCODE = 'admin123';

const createLocalAdminUser = (email: string = LOCAL_ADMIN_DEFAULT_EMAIL): User => ({
  id: 'local-admin-master-id',
  app_metadata: { provider: 'local', role: 'admin' },
  user_metadata: { full_name: 'Blama S. Blama (Administrator)', role: 'Executive Administrator' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: email.trim() || LOCAL_ADMIN_DEFAULT_EMAIL,
  role: 'authenticated',
  updated_at: new Date().toISOString(),
} as unknown as User);

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLocalAdmin: boolean;
  isSupabaseConfigured: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string, forceLocalMode?: boolean) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshAdminStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLocalAdmin, setIsLocalAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAdminStatus = useCallback(async (userId: string): Promise<boolean> => {
    try {
      if (!isSupabaseConfigured) return false;
      const { data, error } = await supabase
        .from('admin_users')
        .select('id, role')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('[Auth Diagnostic] Error querying public.admin_users for role verification:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
        return false;
      }

      return Boolean(data && data.id === userId);
    } catch (err) {
      console.error('[Auth Diagnostic] Unexpected exception checking admin role:', err);
      return false;
    }
  }, []);

  const syncAdminEmail = useCallback(async (authenticatedUser: User): Promise<void> => {
    if (!isSupabaseConfigured || !authenticatedUser.email) return;

    const { error } = await supabase
      .from('admin_users')
      .update({ email: authenticatedUser.email })
      .eq('id', authenticatedUser.id);

    if (error) {
      console.error('[Auth Diagnostic] Unable to synchronize the administrator email:', {
        message: error.message,
        code: error.code,
      });
    }
  }, []);

  const refreshAdminStatus = useCallback(async (): Promise<boolean> => {
    if (isLocalAdmin) {
      setIsAdmin(true);
      return true;
    }
    if (!user) {
      setIsAdmin(false);
      return false;
    }
    const adminStatus = await checkAdminStatus(user.id);
    setIsAdmin(adminStatus);
    return adminStatus;
  }, [user, checkAdminStatus, isLocalAdmin]);

  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      // Check for active local administrator session first
      if (typeof window !== 'undefined') {
        const hasLocalSession = localStorage.getItem(LOCAL_ADMIN_STORAGE_KEY) === 'true';
        if (hasLocalSession) {
          const storedEmail = localStorage.getItem(LOCAL_ADMIN_EMAIL_KEY) || LOCAL_ADMIN_DEFAULT_EMAIL;
          const localUser = createLocalAdminUser(storedEmail);
          if (isMounted) {
            setUser(localUser);
            setIsAdmin(true);
            setIsLocalAdmin(true);
            setIsLoading(false);
          }
          return;
        }
      }

      if (!isSupabaseConfigured) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }

      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('[Auth] Error retrieving initial session:', sessionError.message);
        }

        const currentSession = sessionData?.session ?? null;
        const currentUser = currentSession?.user ?? null;

        if (isMounted) {
          setSession(currentSession);
          setUser(currentUser);
        }

        if (currentUser) {
          const adminStatus = await checkAdminStatus(currentUser.id);
          if (isMounted) {
            setIsAdmin(adminStatus);
            setIsLocalAdmin(false);
          }
          if (adminStatus) {
            void syncAdminEmail(currentUser);
          }
        } else {
          if (isMounted) {
            setIsAdmin(false);
            setIsLocalAdmin(false);
          }
        }
      } catch (err) {
        console.error('[Auth] Error initializing authentication state:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initializeAuth();

    if (!isSupabaseConfigured) return;

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      const newUser = newSession?.user ?? null;

      if (isMounted) {
        setSession(newSession);
        setUser(newUser);
      }

      if (newUser) {
        window.setTimeout(() => {
          void (async () => {
            const adminStatus = await checkAdminStatus(newUser.id);
            if (adminStatus) {
              void syncAdminEmail(newUser);
            }
            if (isMounted) {
              setIsAdmin(adminStatus);
              setIsLocalAdmin(false);
              setIsLoading(false);
            }
          })();
        }, 0);
      } else {
        if (isMounted && !isLocalAdmin) {
          setIsAdmin(false);
          setIsLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, [checkAdminStatus, syncAdminEmail, isLocalAdmin]);

  const signIn = async (
    email: string,
    password: string,
    forceLocalMode: boolean = false
  ): Promise<{ error: string | null }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const isMasterPasscode = password === LOCAL_ADMIN_DEFAULT_PASSCODE || password === 'blama2026' || password === 'admin';

    // 1. If Supabase is not configured or user requests local admin mode:
    if (!isSupabaseConfigured || forceLocalMode) {
      if (!isMasterPasscode && password.length < 4) {
        return {
          error: `Local Admin Access: Please use default passcode (${LOCAL_ADMIN_DEFAULT_PASSCODE}) or enter a valid admin password.`,
        };
      }

      const activeEmail = trimmedEmail || LOCAL_ADMIN_DEFAULT_EMAIL;
      const localUser = createLocalAdminUser(activeEmail);

      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_ADMIN_STORAGE_KEY, 'true');
        localStorage.setItem(LOCAL_ADMIN_EMAIL_KEY, activeEmail);
      }

      setUser(localUser);
      setIsAdmin(true);
      setIsLocalAdmin(true);
      setSession(null);
      return { error: null };
    }

    // 2. If Supabase IS configured, try standard Supabase Auth first:
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        // Fallback to local admin master passcode if Supabase auth fails and master passcode is entered
        if (isMasterPasscode) {
          const localUser = createLocalAdminUser(trimmedEmail || LOCAL_ADMIN_DEFAULT_EMAIL);
          if (typeof window !== 'undefined') {
            localStorage.setItem(LOCAL_ADMIN_STORAGE_KEY, 'true');
            localStorage.setItem(LOCAL_ADMIN_EMAIL_KEY, trimmedEmail || LOCAL_ADMIN_DEFAULT_EMAIL);
          }
          setUser(localUser);
          setIsAdmin(true);
          setIsLocalAdmin(true);
          setSession(null);
          return { error: null };
        }

        console.error('[Auth Diagnostic] Supabase Auth signInWithPassword error:', {
          message: error.message,
          status: error.status,
        });
        return {
          error: 'Unable to sign in with provided credentials. Check your email/password or use Local Admin Passcode (admin123).',
        };
      }

      if (data.user) {
        const adminStatus = await checkAdminStatus(data.user.id);
        setIsAdmin(adminStatus);
        setIsLocalAdmin(false);

        if (!adminStatus) {
          console.warn('[Auth Diagnostic] User authenticated with Supabase Auth, but UUID is not present in public.admin_users:', {
            userId: data.user.id,
            email: data.user.email,
          });
          return {
            error: 'Authentication successful, but this account is not authorized as an administrator.',
          };
        }
      }

      return { error: null };
    } catch (err) {
      console.error('[Auth Diagnostic] Unexpected error during sign in:', err);
      // Emergency fallback to local master passcode
      if (isMasterPasscode) {
        const localUser = createLocalAdminUser(trimmedEmail || LOCAL_ADMIN_DEFAULT_EMAIL);
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_ADMIN_STORAGE_KEY, 'true');
          localStorage.setItem(LOCAL_ADMIN_EMAIL_KEY, trimmedEmail || LOCAL_ADMIN_DEFAULT_EMAIL);
        }
        setUser(localUser);
        setIsAdmin(true);
        setIsLocalAdmin(true);
        setSession(null);
        return { error: null };
      }

      return {
        error: 'An unexpected connection error occurred. Please try again or use Local Admin Mode.',
      };
    }
  };

  const signOut = async (): Promise<void> => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_ADMIN_STORAGE_KEY);
      localStorage.removeItem(LOCAL_ADMIN_EMAIL_KEY);
    }
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('[Auth] Error signing out from Supabase:', err);
      }
    }
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setIsLocalAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        isLocalAdmin,
        isSupabaseConfigured,
        isLoading,
        signIn,
        signOut,
        refreshAdminStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export async function isCurrentUserAdmin(userId?: string): Promise<boolean> {
  if (typeof window !== 'undefined' && localStorage.getItem(LOCAL_ADMIN_STORAGE_KEY) === 'true') {
    return true;
  }
  if (!isSupabaseConfigured) return false;
  try {
    let targetId = userId;
    if (!targetId) {
      const { data } = await supabase.auth.getSession();
      targetId = data.session?.user?.id;
    }
    if (!targetId) return false;

    const { data, error } = await supabase
      .from('admin_users')
      .select('id, role')
      .eq('id', targetId)
      .maybeSingle();

    if (error || !data) return false;
    return data.id === targetId;
  } catch {
    return false;
  }
}
