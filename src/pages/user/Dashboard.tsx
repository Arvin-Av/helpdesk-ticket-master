
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { ticketService } from '@/services/api';
import TicketCard from '@/components/TicketCard';
import { PlusCircle, Clock, AlertCircle, CheckCircle2, TicketIcon, LineChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Ticket } from '@/types';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['tickets', user?.id],
    queryFn: () => (user ? ticketService.getUserTickets(user.id) : Promise.resolve([])),
    enabled: !!user,
  });

  const getTicketsByStatus = (status: string) => {
    return tickets.filter((ticket) => ticket.status === status);
  };

  const openTickets = getTicketsByStatus('open');
  const inProgressTickets = getTicketsByStatus('in-progress');
  const resolvedTickets = getTicketsByStatus('resolved');

  const viewTicket = (id: string) => {
    navigate(`/ticket/${id}`);
  };

  const createNewTicket = () => {
    navigate('/new-ticket');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Welcome back, {user?.name}</h1>
          <Button onClick={createNewTicket}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Ticket
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
                <div className="p-1 bg-blue-100 rounded">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openTickets.length}</div>
              <p className="text-xs text-muted-foreground pt-1">
                Awaiting assignment
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <div className="p-1 bg-purple-100 rounded">
                  <AlertCircle className="h-4 w-4 text-purple-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressTickets.length}</div>
              <p className="text-xs text-muted-foreground pt-1">
                Being worked on
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                <div className="p-1 bg-green-100 rounded">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resolvedTickets.length}</div>
              <p className="text-xs text-muted-foreground pt-1">
                Completed tickets
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Tickets</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="pt-4">
            {isLoading ? (
              <p>Loading tickets...</p>
            ) : tickets.length === 0 ? (
              <div className="text-center py-8">
                <TicketIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No tickets</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new ticket.</p>
                <div className="mt-6">
                  <Button onClick={createNewTicket}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Ticket
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tickets.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} onView={viewTicket} />
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="open" className="pt-4">
            {openTickets.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">No open tickets</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {openTickets.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} onView={viewTicket} />
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="in-progress" className="pt-4">
            {inProgressTickets.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">No tickets in progress</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inProgressTickets.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} onView={viewTicket} />
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="resolved" className="pt-4">
            {resolvedTickets.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">No resolved tickets</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resolvedTickets.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} onView={viewTicket} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default UserDashboard;
