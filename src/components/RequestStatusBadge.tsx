import React from 'react';
import { Clock, CheckCircle2, XCircle, Award } from 'lucide-react';
import { SessionStatus } from '../types';

interface Props {
  status: SessionStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const RequestStatusBadge: React.FC<Props> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2.5 py-0.5 gap-1 font-semibold',
    md: 'text-xs font-bold px-3 py-1 gap-1.5',
    lg: 'text-sm font-extrabold px-3.5 py-1.5 gap-2',
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
          className={`inline-flex items-center rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/40 shadow-xs shadow-amber-500/20 backdrop-blur-md ${sizeClasses[size]}`}
        >
          <Clock size={iconSizes[size]} className="animate-spin text-amber-400" style={{ animationDuration: '4s' }} />
          <span>Pending</span>
        </span>
      );
    case 'Accepted':
      return (
        <span
          data-testid="status-badge-accepted"
          className={`inline-flex items-center rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/50 shadow-xs shadow-emerald-500/20 backdrop-blur-md ${sizeClasses[size]}`}
        >
          <CheckCircle2 size={iconSizes[size]} className="text-emerald-400" />
          <span>Accepted</span>
        </span>
      );
    case 'Declined':
      return (
        <span
          data-testid="status-badge-declined"
          className={`inline-flex items-center rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/40 shadow-xs shadow-rose-500/20 backdrop-blur-md ${sizeClasses[size]}`}
        >
          <XCircle size={iconSizes[size]} className="text-rose-400" />
          <span>Declined</span>
        </span>
      );
    case 'Completed':
      return (
        <span
          data-testid="status-badge-completed"
          className={`inline-flex items-center rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-xs shadow-cyan-500/20 backdrop-blur-md ${sizeClasses[size]}`}
        >
          <Award size={iconSizes[size]} className="text-cyan-400" />
          <span>Completed</span>
        </span>
      );
    default:
      return null;
  }
};
