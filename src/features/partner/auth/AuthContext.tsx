import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error: string | null }>;
  logout: () => Promise<void>;
  getToken: () => string | null;
  // getCurrentUser: () => Promise<User | null>; // Leaving this out for simplicity, can add if needed
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    console.log('AuthContext: VITE_SUPABASE_URL:', supabaseUrl ? 'Provided' : 'MISSING');
    console.log('AuthContext: VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Provided' : 'MISSING');

    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
      console.error('AuthService: Supabase credentials are not configured. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.');
      return;
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    setSupabase(supabaseClient);

    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
        setUser(session.user);
        setAuthToken(session.access_token);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setAuthToken(null);
      }
    });

    const { data: { subscription: authListener } } = supabaseClient.auth.onAuthStateChange((event, session) => {
      if (session) {
        setIsAuthenticated(true);
        setUser(session.user);
        setAuthToken(session.access_token);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setAuthToken(null);
      }
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const login = useCallback(async (credentials: { email: string; password: string }) => {
    if (!supabase) {
      return { success: false, error: 'Supabase client not initialized.' };
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      console.error('AuthService: Supabase login error:', error.message);
      return { success: false, error: error.message };
    }

    if (data.session) {
      setIsAuthenticated(true);
      setUser(data.user);
      setAuthToken(data.session.access_token);
      console.log('AuthService: Login successful.');
      return { success: true, error: null };
    }
    console.error('AuthService: Unknown login error, no session data.');
    return { success: false, error: 'Unknown login error' };
  }, [supabase]);

  const logout = useCallback(async () => {
    if (!supabase) {
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('AuthService: Supabase logout error:', error.message);
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setAuthToken(null);
      console.log('AuthService: Logout successful.');
    }
  }, [supabase]);

  const getToken = useCallback(() => authToken, [authToken]);

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    getToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
