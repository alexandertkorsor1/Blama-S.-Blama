import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshAdminStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAdminStatus = useCallback(async (userId: string): Promise<boolean> => {
    try {
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
    if (!authenticatedUser.email) return;

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
    if (!user) {
      setIsAdmin(false);
      return false;
    }
    const adminStatus = await checkAdminStatus(user.id);
    setIsAdmin(adminStatus);
    return adminStatus;
  }, [user, checkAdminStatus]);

  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
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
          }
          if (adminStatus) {
            void syncAdminEmail(currentUser);
          }
        } else {
          if (isMounted) {
            setIsAdmin(false);
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

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      const newUser = newSession?.user ?? null;

      if (isMounted) {
        setSession(newSession);
        setUser(newUser);
      }

      if (newUser) {
        // Supabase holds an internal session lock while dispatching auth events.
        // Schedule database work after the callback to avoid a lock-induced wait.
        window.setTimeout(() => {
          void (async () => {
            const adminStatus = await checkAdminStatus(newUser.id);
            if (adminStatus) {
              void syncAdminEmail(newUser);
            }
            if (isMounted) {
              setIsAdmin(adminStatus);
              setIsLoading(false);
            }
          })();
        }, 0);
      } else {
        if (isMounted) {
          setIsAdmin(false);
          setIsLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [checkAdminStatus, syncAdminEmail]);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    if (!isSupabaseConfigured) {
      return {
        error: 'Supabase credentials are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error('[Auth Diagnostic] Supabase Auth signInWithPassword error:', {
          message: error.message,
          code: (error as unknown as { code?: string }).code,
          status: error.status,
          name: error.name,
        });
        return {
          error: 'Unable to sign in with the provided credentials. Please check your email and password.',
        };
      }

      if (data.user) {
        const adminStatus = await checkAdminStatus(data.user.id);
        setIsAdmin(adminStatus);
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
      return {
        error: 'An unexpected connection error occurred. Please try again.',
      };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('[Auth] Error signing out:', err);
    } finally {
      setUser(null);
      setSession(null);
      setIsAdmin(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
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

/**
 * Standalone authorization helper to query the database-backed admin_users table for a given user ID
 * or the active session user. Ultimate authorization security remains enforced by PostgreSQL RLS.
 */
export async function isCurrentUserAdmin(userId?: string): Promise<boolean> {
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
