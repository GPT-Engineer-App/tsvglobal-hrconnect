import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from './index.js';
import { useQueryClient } from '@tanstack/react-query';

const SupabaseAuthContext = createContext();

export const SupabaseAuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const queryClient = useQueryClient();

  const checkAdminStatus = async (userId) => {
    try {
      const { data: userData, error } = await supabase.auth.admin.getUserById(userId);
      if (error) throw error;
      const isAdminUser = userData.user.app_metadata?.is_admin === true;
      setIsAdmin(isAdminUser);
      return isAdminUser;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
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