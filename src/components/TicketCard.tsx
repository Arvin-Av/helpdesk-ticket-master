
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Ticket } from '@/types';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';
import { formatDistanceToNow } from 'date-fns';

interface TicketCardProps {
  ticket: Ticket;
  onView: (ticketId: string) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onView }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{ticket.subject}</CardTitle>
            <CardDescription className="mt-1">
              {ticket.department} • Ticket #{ticket.id.split('-')[1]}
            </CardDescription>
          </div>
          <StatusBadge status={ticket.status} />
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {ticket.description}
        </p>
      </CardContent>
      <CardFooter className="pt-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <PriorityBadge priority={ticket.priority} />
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(ticket.updated_at), { addSuffix: true })}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={() => onView(ticket.id)}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TicketCard;
