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

  const checkAdminStatus = async (userId) => {
    const { data: userData, error } = await supabase.auth.admin.getUserById(userId);
    console.log('User data:', userData); // Log the entire user data for investigation
    if (!error && userData) {
      const isAdminUser = userData.user.app_metadata?.is_admin === true;
      setIsAdmin(isAdminUser);
      return isAdminUser;
    }
    return false;
  };

  useEffect(() => {
    const getSession = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        await checkAdminStatus(session.user.id);
      }
      setLoading(false);
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session) {
        await checkAdminStatus(session.user.id);
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
    
    const isAdminUser = await checkAdminStatus(data.user.id);
    
    return { data, isAdmin: isAdminUser };
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
  const context = useContext(SupabaseAuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};