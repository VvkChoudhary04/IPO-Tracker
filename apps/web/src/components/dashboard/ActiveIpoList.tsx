import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IpoItem } from '@ipotrack/shared';
import { StatusBadge } from '../common/StatusBadge';
import { IpoDetailModal } from '../ipos/IpoDetailModal';
import { AssociateApplicationModal } from '../common/AssociateApplicationModal';
import { Calendar, Building2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ActiveIpoList: React.FC = () => {
  const navigate = useNavigate();
  const { ipos } = useApp();
  const [selectedIpo, setSelectedIpo] = useState<IpoItem | null>(null);
  const [trackIpo, setTrackIpo] = useState<IpoItem | null>(null);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Current & Upcoming Issues</h3>
          <p className="text-xs text-slate-500">
            Live Indian Mainboard & SME offerings monitored for allotment
          </p>
        </div>
        <button
          onClick={() => navigate('/ipos')}
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
        >
          <span>View All Issues ({ipos.length})</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="py-3 px-6">Company & Symbol</th>
              <th className="py-3 px-4">Segment</th>
              <th className="py-3 px-4">Price Band</th>
              <th className="py-3 px-4">Lot Size</th>
              <th className="py-3 px-4">Allotment Date</th>
              <th className="py-3 px-4">Registrar</th>
              <th className="py-3 px-6 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {ipos.slice(0, 5).map((ipo) => (
              <tr
                key={ipo.id}
                onClick={() => setSelectedIpo(ipo)}
                className="hover:bg-slate-50/60 transition-colors group cursor-pointer"
              >
                <td className="py-4 px-6">
                  <div className="font-semibold text-slate-900 flex items-center gap-2 group-hover:text-emerald-700 transition-colors">
                    <span>{ipo.name}</span>
                    {ipo.gmp && (
                      <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                        +₹{ipo.gmp} GMP
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono text-slate-500">{ipo.symbol}</div>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded ${
                      ipo.issueType === 'MAINBOARD'
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-purple-50 text-purple-700 border border-purple-200/50'
                    }`}
                  >
                    {ipo.issueType}
                  </span>
                </td>
                <td className="py-4 px-4 font-mono text-xs text-slate-700">
                  ₹{ipo.priceRange.min} - ₹{ipo.priceRange.max}
                </td>
                <td className="py-4 px-4 text-xs text-slate-700 font-mono">
                  {ipo.lotSize} shares
                  <div className="text-[10px] text-slate-400">
                    Min ₹{ipo.minInvestment.toLocaleString('en-IN')}
                  </div>
                </td>
                <td className="py-4 px-4 text-xs text-slate-700">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ipo.allotmentDate}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate max-w-[130px]">{ipo.registrarDisplayName}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-right">
                  <StatusBadge status={ipo.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <IpoDetailModal
        isOpen={Boolean(selectedIpo)}
        onClose={() => setSelectedIpo(null)}
        ipo={selectedIpo}
        onTrackApplication={(ipo) => setTrackIpo(ipo)}
      />

      <AssociateApplicationModal
        isOpen={Boolean(trackIpo)}
        onClose={() => setTrackIpo(null)}
        defaultIpoId={trackIpo?.id}
      />
    </div>
  );
};
