
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TicketPriority } from '@/types';

interface PriorityBadgeProps {
  priority: TicketPriority;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const getBadgeVariant = () => {
    switch (priority) {
      case 'low':
        return 'bg-priority-low text-black';
      case 'medium':
        return 'bg-priority-medium text-black';
      case 'high':
        return 'bg-priority-high text-white';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const getLabel = () => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  return (
    <Badge className={`${getBadgeVariant()} font-medium`}>
      {getLabel()}
    </Badge>
  );
};

export default PriorityBadge;
