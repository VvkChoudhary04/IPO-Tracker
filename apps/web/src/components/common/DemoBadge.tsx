import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface DemoBadgeProps {
  className?: string;
  compact?: boolean;
}

export const DemoBadge: React.FC<DemoBadgeProps> = ({ className = '', compact = false }) => {
  if (compact) {
    return (
      <span
        title="Simulated demo data for Phase 2 UI preview. Real registrar queries will be wired in Phase 3."
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-amber-50 text-amber-800 border border-amber-200/70 select-none ${className}`}
      >
        <Info className="w-3 h-3 text-amber-600" />
        <span>Demo Fixture</span>
      </span>
    );
  }

  return (
    <div
      className={`flex items-center justify-between px-3.5 py-2 rounded-lg bg-amber-50/70 border border-amber-200/70 text-xs text-amber-900 ${className}`}
    >
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
        <span className="font-medium">
          UI Prototyping Mode: Displaying simulated demo fixtures. No actual PANs or registrar connections are used.
        </span>
      </div>
      <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
        Zero PAN Leak Policy
      </span>
    </div>
  );
};
