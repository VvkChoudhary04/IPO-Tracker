import React from 'react';
import { useApp } from '../../context/AppContext';
import { PieChart, TrendingUp } from 'lucide-react';

export const AllotmentDonutChart: React.FC = () => {
  const { applications } = useApp();

  const total = applications.length;
  const allotted = applications.filter((a) => a.status === 'ALLOTTED').length;
  const pending = applications.filter((a) => a.status === 'AWAITING_RESULT').length;
  const notAllotted = applications.filter(
    (a) => a.status === 'NOT_ALLOTTED' || a.status === 'REFUND_INITIATED'
  ).length;

  const allottedPct = total ? Math.round((allotted / total) * 100) : 0;
  const pendingPct = total ? Math.round((pending / total) * 100) : 0;
  const notAllottedPct = total ? 100 - allottedPct - pendingPct : 0;

  // SVG Circumference calculation for strokeDasharray
  const radius = 40;
  const circumference = 2 * Math.PI * radius; // ~251.32

  const allottedStroke = (allottedPct / 100) * circumference;
  const pendingStroke = (pendingPct / 100) * circumference;
  const notAllottedStroke = (notAllottedPct / 100) * circumference;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
            <PieChart className="w-4 h-4 text-slate-500" />
            <span>Allotment Success Distribution</span>
          </h4>
          <p className="text-xs text-slate-500">Historical hit-rate across all PAN portfolios</p>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-mono">
          {allottedPct}% Success
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4">
        {/* SVG Donut Chart */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="text-slate-100"
              strokeWidth="12"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Not Allotted Arc */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="text-slate-300 transition-all duration-500"
              strokeWidth="12"
              strokeDasharray={`${notAllottedStroke} ${circumference}`}
              strokeDashoffset={0}
              stroke="currentColor"
              fill="transparent"
            />
            {/* Pending Arc */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="text-amber-400 transition-all duration-500"
              strokeWidth="12"
              strokeDasharray={`${pendingStroke} ${circumference}`}
              strokeDashoffset={-notAllottedStroke}
              stroke="currentColor"
              fill="transparent"
            />
            {/* Allotted Arc */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="text-emerald-500 transition-all duration-500"
              strokeWidth="12"
              strokeDasharray={`${allottedStroke} ${circumference}`}
              strokeDashoffset={-(notAllottedStroke + pendingStroke)}
              stroke="currentColor"
              fill="transparent"
            />
          </svg>

          {/* Center Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xl font-bold font-mono text-slate-900">{total}</span>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              Bids
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2.5 w-full sm:w-auto">
          <div className="flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-600">Allotted</span>
            </div>
            <span className="font-mono font-semibold text-slate-900">
              {allotted} ({allottedPct}%)
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-slate-600">Awaiting Check</span>
            </div>
            <span className="font-mono font-semibold text-slate-900">
              {pending} ({pendingPct}%)
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span className="text-slate-600">Not Allotted / Refund</span>
            </div>
            <span className="font-mono font-semibold text-slate-900">
              {notAllotted} ({notAllottedPct}%)
            </span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span>Allotments based on official registrar records</span>
        </span>
        <span className="font-mono text-slate-400">SEBI Basis of Allotment</span>
      </div>
    </div>
  );
};
