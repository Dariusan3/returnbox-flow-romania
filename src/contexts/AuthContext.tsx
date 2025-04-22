import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  session: Session | null;
  user: Profile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: 'customer' | 'merchant') => Promise<boolean>;
  register: (email: string, password: string, role: 'customer' | 'merchant', profile: Partial<Profile>) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<Profile>) => Promise<void>;
  updateStoreLogo: (logoUrl: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<Profile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Get initial session and set up auth state change listener
    const initializeAuth = async () => {
      try {
        // Get the initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (initialSession) {
          setSession(initialSession);
          setIsAuthenticated(true);
          await fetchProfile(initialSession.user.id);
        }

        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
          setSession(session);
          setIsAuthenticated(!!session);
          
          if (session?.user) {
            await fetchProfile(session.user.id);
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
        });

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Error initializing auth:', error);
        setIsAuthenticated(false);
      }
    };

    initializeAuth();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    setUser(data);
  };

  const login = async (email: string, password: string, role: 'customer' | 'merchant') => {
    try {
      // Attempt to sign in and get profile in parallel
      const signInPromise = supabase.auth.signInWithPassword({ email, password });
      
      const { data: { user: authUser }, error } = await signInPromise;

      if (error) throw error;
      if (!authUser) return false;

      // Get profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, first_name, last_name, email, store_name, store_logo')
        .eq('id', authUser.id)
        .single();

      // Verify role matches and set user data
      if (profile && profile.role === role) {
        //setUser(profile);
        return true;
      }

      // Role mismatch - sign out
      await supabase.auth.signOut();
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (profile: Partial<Profile>) => {
    if (!session?.user) throw new Error('No user logged in');

    const { error } = await supabase
      .from('profiles')
      .update({
        ...profile,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.user.id);

    if (error) throw error;
    await fetchProfile(session.user.id);
  };

  const updateStoreLogo = async (logoUrl: string) => {
    if (!session?.user) throw new Error('No user logged in');

    const { error } = await supabase
      .from('profiles')
      .update({
        store_logo: logoUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.user.id);

    if (error) throw error;
    await fetchProfile(session.user.id);
  };

    const register = async (email: string, password: string, role: 'customer' | 'merchant', profile: Partial<Profile>) => {
    try {
      // Create the user in Supabase Auth
      const { data: { user: authUser, session }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role } // Add role to user metadata
        }
      });

      if (signUpError) throw signUpError;
      if (!authUser) throw new Error('User creation failed');

      // Create the user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authUser.id,
            email,
            role,
            website: profile.website || null,
            business_address: profile.business_address || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            store_name: role === 'merchant' ? profile.store_name || null : null,
            store_logo: role === 'merchant' ? profile.store_logo || null : null,
            first_name: profile.first_name || null,
            last_name: profile.last_name || null,
            phone: profile.phone || null,
            address: profile.address || null
          },
        ]);


      if (profileError) {
        // If profile creation fails, we should delete the auth user
        await supabase.auth.signOut();
        throw profileError;
      }

      // After successful registration, set session, update authenticated state and fetch profile
      if (session) {
        setSession(session);
        setIsAuthenticated(true);
        await fetchProfile(authUser.id);
      }

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const value = {
    session,
    user,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    updateStoreLogo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
