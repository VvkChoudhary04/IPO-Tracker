import React from 'react';
import { IpoStatus, AllotmentStatus } from '@ipotrack/shared';

interface StatusBadgeProps {
  status: IpoStatus | AllotmentStatus | 'ONLINE' | 'OFFLINE' | 'SYNCING';
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'sm',
}) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'OPEN':
      case 'ALLOTTED':
      case 'ONLINE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'UPCOMING':
      case 'AWAITING_RESULT':
      case 'SYNCING':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'CLOSED':
      case 'ALLOTMENT_FINALIZED':
        return 'bg-blue-50 text-blue-700 border-blue-200/80';
      case 'NOT_ALLOTTED':
      case 'OFFLINE':
        return 'bg-rose-50 text-rose-700 border-rose-200/80';
      case 'LISTED':
      case 'REFUND_INITIATED':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getDotStyle = () => {
    switch (status) {
      case 'OPEN':
      case 'ALLOTTED':
      case 'ONLINE':
        return 'bg-emerald-500';
      case 'UPCOMING':
      case 'AWAITING_RESULT':
      case 'SYNCING':
        return 'bg-amber-500';
      case 'CLOSED':
      case 'ALLOTMENT_FINALIZED':
        return 'bg-blue-500';
      case 'NOT_ALLOTTED':
      case 'OFFLINE':
        return 'bg-rose-500';
      default:
        return 'bg-slate-400';
    }
  };

  const formattedLabel = label || status.replace(/_/g, ' ');
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${sizeClasses} ${getBadgeStyle()}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${getDotStyle()}`} />
      <span>{formattedLabel}</span>
    </span>
  );
};
