
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { ticketService } from '@/services/api';
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ticket } from '@/types';

const AdminDashboard = () => {
  const { user } = useAuth();
  
  const { data: tickets = [] } = useQuery({
    queryKey: ['all-tickets'],
    queryFn: ticketService.getAllTickets,
  });
  
  // Calculate statistics
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in-progress').length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
  const closedTickets = tickets.filter(t => t.status === 'closed').length;
  
  const highPriorityTickets = tickets.filter(t => t.priority === 'high').length;
  const mediumPriorityTickets = tickets.filter(t => t.priority === 'medium').length;
  const lowPriorityTickets = tickets.filter(t => t.priority === 'low').length;

  // Prepare chart data
  const statusData = [
    { name: 'Open', value: openTickets, color: '#60a5fa' },
    { name: 'In Progress', value: inProgressTickets, color: '#8b5cf6' },
    { name: 'Resolved', value: resolvedTickets, color: '#34d399' },
    { name: 'Closed', value: closedTickets, color: '#9ca3af' },
  ];

  const priorityData = [
    { name: 'High', value: highPriorityTickets, color: '#f87171' },
    { name: 'Medium', value: mediumPriorityTickets, color: '#facc15' },
    { name: 'Low', value: lowPriorityTickets, color: '#4ade80' },
  ];
  
  const departmentData = getDepartmentData(tickets);

  // Recent activity (get most recently updated tickets)
  const recentActivity = [...tickets]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5);

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTickets}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-status-open">{openTickets}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-status-inProgress">{inProgressTickets}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-status-resolved">{resolvedTickets}</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Status</CardTitle>
              <CardDescription>Overview of tickets by status</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tickets by Priority</CardTitle>
              <CardDescription>Distribution of tickets by priority level</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={priorityData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" name="Tickets">
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Department Analysis</CardTitle>
            <CardDescription>Ticket distribution by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={departmentData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" name="Total Tickets" fill="#8884d8" />
                  <Bar dataKey="open" name="Open" fill="#60a5fa" />
                  <Bar dataKey="inProgress" name="In Progress" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest ticket updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map(ticket => (
                <div key={ticket.id} className="flex justify-between items-start p-3 rounded-md border">
                  <div>
                    <h3 className="font-medium">{ticket.subject}</h3>
                    <p className="text-sm text-gray-500">
                      #{ticket.id.split('-')[1]} • {ticket.department}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{getStatusLabel(ticket.status)}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(ticket.updated_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

// Helper functions
function getDepartmentData(tickets: Ticket[]) {
  const departmentMap = new Map<string, { total: number, open: number, inProgress: number }>();
  
  tickets.forEach(ticket => {
    if (!departmentMap.has(ticket.department)) {
      departmentMap.set(ticket.department, { total: 0, open: 0, inProgress: 0 });
    }
    
    const deptStats = departmentMap.get(ticket.department)!;
    deptStats.total++;
    
    if (ticket.status === 'open') {
      deptStats.open++;
    } else if (ticket.status === 'in-progress') {
      deptStats.inProgress++;
    }
  });
  
  return Array.from(departmentMap.entries())
    .map(([name, stats]) => ({
      name,
      ...stats
    }))
    .sort((a, b) => b.total - a.total);
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'open': return 'Open';
    case 'in-progress': return 'In Progress';
    case 'resolved': return 'Resolved';
    case 'closed': return 'Closed';
    default: return status;
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export default AdminDashboard;
