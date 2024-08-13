import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabaseAuth } from '../integrations/supabase/auth';

const Dashboard = () => {
  const { isAdmin } = useSupabaseAuth();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        Welcome to the {isAdmin ? 'Admin' : 'User'} Dashboard
      </h2>
      <Card>
        <CardHeader>
          <CardTitle>User Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You are logged in as a {isAdmin ? 'an admin' : 'a non-admin'} user.</p>
        </CardContent>
      </Card>
      {/* Add more dashboard content here */}
    </div>
  );
};

export default Dashboard;