
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TicketStatus } from '@/types';

interface StatusBadgeProps {
  status: TicketStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getBadgeVariant = () => {
    switch (status) {
      case 'open':
        return 'bg-status-open text-white';
      case 'in-progress':
        return 'bg-status-inProgress text-white';
      case 'resolved':
        return 'bg-status-resolved text-white';
      case 'closed':
        return 'bg-status-closed text-white';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const getLabel = () => {
    // Convert kebab-case to Title Case (e.g., in-progress to In Progress)
    return status.split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Badge className={`${getBadgeVariant()} font-medium`}>
      {getLabel()}
    </Badge>
  );
};

export default StatusBadge;
