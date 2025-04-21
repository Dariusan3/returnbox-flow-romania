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
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsAuthenticated(!!session);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsAuthenticated(!!session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
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
      const { data: { user: authUser }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (authUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authUser.id)
          .single();

        // Verify role matches
        if (profile && profile.role === role) {
          return true;
        }
      }

      // If we get here, either the user doesn't exist or role doesn't match
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
          // Removed email confirmation redirect!
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
            website: profile.website || '',
            business_address: profile.business_address || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            store_name: profile.store_name || '',
            store_logo: profile.store_logo || '',
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            phone: profile.phone || '',
            address: profile.address || ''
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
