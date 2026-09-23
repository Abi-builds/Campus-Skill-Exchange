import React from 'react';
import { Clock, CheckCircle2, XCircle, Award } from 'lucide-react';
import { SessionStatus } from '../types';

interface Props {
  status: SessionStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const RequestStatusBadge: React.FC<Props> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  switch (status) {
    case 'Pending':
      return (
        <span
          data-testid="status-badge-pending"
          className={`inline-flex items-center rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 shadow-xs ${sizeClasses[size]}`}
        >
          <Clock size={iconSizes[size]} className="animate-pulse text-amber-500" />
          <span>Pending</span>
        </span>
      );
    case 'Accepted':
      return (
        <span
          data-testid="status-badge-accepted"
          className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs ${sizeClasses[size]}`}
        >
          <CheckCircle2 size={iconSizes[size]} className="text-emerald-500" />
          <span>Accepted</span>
        </span>
      );
    case 'Declined':
      return (
        <span
          data-testid="status-badge-declined"
          className={`inline-flex items-center rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 shadow-xs ${sizeClasses[size]}`}
        >
          <XCircle size={iconSizes[size]} className="text-rose-500" />
          <span>Declined</span>
        </span>
      );
    case 'Completed':
      return (
        <span
          data-testid="status-badge-completed"
          className={`inline-flex items-center rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 shadow-xs ${sizeClasses[size]}`}
        >
          <Award size={iconSizes[size]} className="text-blue-500" />
          <span>Completed</span>
        </span>
      );
    default:
      return null;
  }
};
