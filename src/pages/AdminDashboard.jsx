import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Employee Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Total Employees: 150</p>
            <p>Departments: 5</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Payroll Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Total Payroll: $500,000</p>
            <p>Next Payday: July 30, 2023</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>System Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Active Users: 45</p>
            <p>Last Backup: July 15, 2023</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;