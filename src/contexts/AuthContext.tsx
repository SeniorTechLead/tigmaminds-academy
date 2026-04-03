import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  role: 'student' | 'teacher' | 'admin';
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: (returnTo?: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateEmail: (newEmail: string) => Promise<{ error: string | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile
  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (data) setProfile(data);
  };

  useEffect(() => {
    // Handle tokens from custom Google OAuth callback (hash fragment)
    const hash = window.location.hash;
    if (hash.includes('access_token=') && hash.includes('refresh_token=')) {
      const params = new URLSearchParams(hash.slice(1));
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      if (accessToken && refreshToken) {
        // Set the session from our custom OAuth flow, then clean the URL
        supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken }).then(({ data: { session } }) => {
          if (session) {
            setSession(session);
            setUser(session.user);
            fetchProfile(session.user.id);
            // Clean hash from URL without triggering navigation
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          }
          setLoading(false);
        });
        return; // skip normal getSession — setSession handles it
      }
    }

    // Normal flow: get existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName || email.split('@')[0] },
      },
    });
    return { error: error?.message || null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message || null };
  };

  const signInWithGoogle = async (overrideReturnTo?: string) => {
    let dest = overrideReturnTo || window.location.pathname + window.location.search;
    // If on /auth page with no override, read its returnTo query param
    if (!overrideReturnTo && window.location.pathname === '/auth') {
      const params = new URLSearchParams(window.location.search);
      dest = params.get('returnTo') || '/lessons';
    }
    window.location.href = `/api/auth/google/login?returnTo=${encodeURIComponent(dest)}`;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const { data } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    if (data) setProfile(data);
  };

  const updateEmail = async (newEmail: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) return { error: error.message };
    return { error: null };
  };

  const updatePassword = async (newPassword: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { error: error.message };
    return { error: null };
  };

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, signUp, signIn, signInWithGoogle, signOut, updateProfile, updateEmail, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
