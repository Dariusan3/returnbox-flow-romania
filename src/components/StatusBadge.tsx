
import React from 'react';
import { cn } from '@/lib/utils';

export type ReturnStatus = 'pending' | 'approved' | 'denied' | 'completed';

interface StatusBadgeProps {
  status: ReturnStatus;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const statusConfig = {
    pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: 'Pending',
    },
    approved: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Approved',
    },
    denied: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: 'Denied',
    },
    completed: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      label: 'Completed',
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.bg,
        config.text,
        className
      )}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
