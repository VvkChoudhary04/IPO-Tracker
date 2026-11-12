import React from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, ChevronRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UpcomingAllotmentsTimeline: React.FC = () => {
  const navigate = useNavigate();
  const { ipos, applications } = useApp();

  // Find IPOs with pending applications
  const upcomingIpos = ipos
    .filter((ipo) => ipo.status === 'OPEN' || ipo.status === 'CLOSED')
    .sort((a, b) => new Date(a.allotmentDate).getTime() - new Date(b.allotmentDate).getTime());

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>Upcoming Allotment Dates</span>
          </h4>
          <p className="text-xs text-slate-500">Scheduled registrar finalization dates</p>
        </div>
        <button
          onClick={() => navigate('/allotments')}
          className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5"
        >
          <span>All Results</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3 py-3">
        {upcomingIpos.slice(0, 3).map((ipo) => {
          const linkedCount = applications.filter((a) => a.ipoId === ipo.id).length;

          return (
            <div
              key={ipo.id}
              onClick={() => navigate('/ipos')}
              className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-all cursor-pointer flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-slate-900 truncate">
                    {ipo.name}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                    {ipo.symbol}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                  <span>Registrar: {ipo.registrarDisplayName}</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-medium">
                    {linkedCount} {linkedCount === 1 ? 'application' : 'applications'} linked
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs font-semibold text-slate-800 font-mono flex items-center gap-1 justify-end">
                  <Clock className="w-3 h-3 text-amber-500" />
                  <span>{ipo.allotmentDate}</span>
                </div>
                <span className="text-[10px] text-slate-400">Finalization</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5 text-slate-600">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Automated registrar polling kicks off at 08:00 AM on allotment date</span>
        </span>
      </div>
    </div>
  );
};
