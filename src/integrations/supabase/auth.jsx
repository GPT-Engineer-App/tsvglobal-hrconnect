import { useState, useEffect, createContext, useContext } from 'react';
import { supabase, SupabaseProvider } from './index.js';
import { useQueryClient } from '@tanstack/react-query';

const SupabaseAuthContext = createContext();

export const SupabaseAuthProvider = ({ children }) => {
  return (
    <SupabaseProvider>
      <SupabaseAuthProviderInner>
        {children}
      </SupabaseAuthProviderInner>
    </SupabaseProvider>
  );
}

export const SupabaseAuthProviderInner = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const getSession = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        const { data: userData, error } = await supabase.auth.admin.getUserById(session.user.id);
        if (!error && userData) {
          setIsAdmin(userData.app_metadata?.is_admin === true);
        }
      }
      setLoading(false);
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session) {
        const { data: userData, error } = await supabase.auth.admin.getUserById(session.user.id);
        if (!error && userData) {
          setIsAdmin(userData.app_metadata?.is_admin === true);
        }
      } else {
        setIsAdmin(false);
      }
      queryClient.invalidateQueries('user');
    });

    getSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [queryClient]);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    setSession(data.session);
    
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(data.user.id);
    if (!userError && userData) {
      setIsAdmin(userData.app_metadata?.is_admin === true);
    }
    
    return { data, isAdmin: userData?.app_metadata?.is_admin === true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
    queryClient.invalidateQueries('user');
  };

  return (
    <SupabaseAuthContext.Provider value={{ session, loading, isAdmin, login, logout }}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export const useSupabaseAuth = () => {
  return useContext(SupabaseAuthContext);
};