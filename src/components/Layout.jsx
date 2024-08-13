import React from 'react';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { Navigate, Outlet } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Layout = () => {
  const { session, loading, logout } = useSupabaseAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
  {session?.user?.email} - {session?.user?.user_metadata?.is_admin ? 'Admin' : 'User'} Dashboard
</h1>
          <Button onClick={logout} variant="outline">Logout</Button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;