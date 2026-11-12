import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  IndianRupee,
} from 'lucide-react';

export const MetricCards: React.FC = () => {
  const { applications, applicants } = useApp();

  const totalApplications = applications.length;
  const allottedCount = applications.filter((a) => a.status === 'ALLOTTED').length;
  const pendingCount = applications.filter((a) => a.status === 'AWAITING_RESULT').length;
  const notAllottedCount = applications.filter(
    (a) => a.status === 'NOT_ALLOTTED' || a.status === 'REFUND_INITIATED'
  ).length;

  const totalCapitalBlocked = applications.reduce((acc, curr) => acc + curr.bidAmount, 0);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {/* 1. Total Tracked */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total Bids
          </span>
          <div className="w-7 h-7 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center">
            <FileText className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-2xl font-bold font-mono text-slate-900 mt-2">
          {totalApplications}
        </div>
        <div className="text-[11px] text-slate-500 mt-1 truncate">Across all profiles</div>
      </div>

      {/* 2. Total Applicants */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Applicants
          </span>
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Users className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-2xl font-bold font-mono text-slate-900 mt-2">
          {applicants.length}
        </div>
        <div className="text-[11px] text-emerald-600 font-medium mt-1 truncate">
          Authorized PANs
        </div>
      </div>

      {/* 3. Pending Result */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Pending
          </span>
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-2xl font-bold font-mono text-amber-700 mt-2">
          {pendingCount}
        </div>
        <div className="text-[11px] text-amber-600 font-medium mt-1 truncate">
          Awaiting Registrar
        </div>
      </div>

      {/* 4. Allotted Applications */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Allotted
          </span>
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-2xl font-bold font-mono text-emerald-600 mt-2">
          {allottedCount}
        </div>
        <div className="text-[11px] text-emerald-600 font-medium mt-1 truncate">
          Shares Confirmed
        </div>
      </div>

      {/* 5. Not Allotted / Refund */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Not Allotted
          </span>
          <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
            <XCircle className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-2xl font-bold font-mono text-slate-700 mt-2">
          {notAllottedCount}
        </div>
        <div className="text-[11px] text-slate-500 mt-1 truncate">Refunds unblocked</div>
      </div>

      {/* 6. Capital Blocked */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Capital Blocked
          </span>
          <div className="w-7 h-7 rounded-lg bg-slate-50 text-slate-700 flex items-center justify-center">
            <IndianRupee className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-xl font-bold font-mono text-slate-900 mt-2 truncate">
          ₹{(totalCapitalBlocked / 100000).toFixed(2)}L
        </div>
        <div className="text-[11px] text-slate-500 mt-1 truncate">
          ₹{totalCapitalBlocked.toLocaleString('en-IN')}
        </div>
      </div>
    </div>
  );
};
