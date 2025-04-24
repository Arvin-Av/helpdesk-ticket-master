
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { ticketService } from '@/services/api';
import Layout from '@/components/Layout';
import TicketCard from '@/components/TicketCard';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { TicketIcon, PlusCircle, Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { TicketStatus } from '@/types';

const MyTickets = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['tickets', user?.id],
    queryFn: () => (user ? ticketService.getUserTickets(user.id) : Promise.resolve([])),
    enabled: !!user,
  });
  
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const viewTicket = (ticketId: string) => {
    navigate(`/ticket/${ticketId}`);
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Support Tickets</h1>
          <Button onClick={() => navigate('/new-ticket')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Ticket
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search tickets..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-1/4">
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">
            <p>Loading tickets...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-8">
            <TicketIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No tickets found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {tickets.length === 0 
                ? "You haven't created any tickets yet." 
                : "No tickets match your current filters."}
            </p>
            <div className="mt-6">
              <Button onClick={() => navigate('/new-ticket')}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Ticket
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {filteredTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} onView={viewTicket} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyTickets;
