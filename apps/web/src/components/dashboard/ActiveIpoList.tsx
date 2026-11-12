import React from 'react';
import { IpoItem } from '@ipotrack/shared';
import { StatusBadge } from '../common/StatusBadge';
import { Calendar, Building2, ChevronRight } from 'lucide-react';

// Sample demonstration catalog of public IPO offerings (market metadata, not allotment results)
const SAMPLE_IPOS: IpoItem[] = [
  {
    id: 'ipo-1',
    name: 'Tata Capital Technologies Ltd.',
    symbol: 'TATACAP',
    issueType: 'MAINBOARD',
    priceRange: { min: 475, max: 500 },
    lotSize: 30,
    minInvestment: 15000,
    openDate: '2026-11-10',
    closeDate: '2026-11-13',
    allotmentDate: '2026-11-14',
    listingDate: '2026-11-18',
    status: 'OPEN',
    registrar: 'LINK_INTIME',
    registrarDisplayName: 'Link Intime India',
    gmp: 85,
  },
  {
    id: 'ipo-2',
    name: 'CleanGrid Energy Solutions Ltd.',
    symbol: 'CLEANGRID',
    issueType: 'MAINBOARD',
    priceRange: { min: 215, max: 227 },
    lotSize: 65,
    minInvestment: 14755,
    openDate: '2026-11-08',
    closeDate: '2026-11-11',
    allotmentDate: '2026-11-12',
    listingDate: '2026-11-17',
    status: 'ALLOTMENT_FINALIZED',
    registrar: 'KFINTECH',
    registrarDisplayName: 'KFin Technologies',
    gmp: 42,
  },
  {
    id: 'ipo-3',
    name: 'AeroPrecision Components SME Ltd.',
    symbol: 'AEROPREC',
    issueType: 'SME',
    priceRange: { min: 140, max: 145 },
    lotSize: 1000,
    minInvestment: 145000,
    openDate: '2026-11-11',
    closeDate: '2026-11-14',
    allotmentDate: '2026-11-17',
    listingDate: '2026-11-20',
    status: 'OPEN',
    registrar: 'BIGSHARE',
    registrarDisplayName: 'Bigshare Services',
    gmp: 35,
  },
  {
    id: 'ipo-4',
    name: 'FinTech Cloud Networks Ltd.',
    symbol: 'FINCLOUD',
    issueType: 'MAINBOARD',
    priceRange: { min: 610, max: 642 },
    lotSize: 23,
    minInvestment: 14766,
    openDate: '2026-11-16',
    closeDate: '2026-11-19',
    allotmentDate: '2026-11-20',
    listingDate: '2026-11-25',
    status: 'UPCOMING',
    registrar: 'LINK_INTIME',
    registrarDisplayName: 'Link Intime India',
  },
];

export const ActiveIpoList: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Current & Upcoming Issues</h3>
          <p className="text-xs text-slate-500">Live Indian Mainboard & SME offerings monitored for allotment</p>
        </div>
        <button className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
          <span>View All Issues</span>
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
            {SAMPLE_IPOS.map((ipo) => (
              <tr
                key={ipo.id}
                className="hover:bg-slate-50/60 transition-colors group cursor-pointer"
              >
                <td className="py-4 px-6">
                  <div className="font-medium text-slate-900 flex items-center gap-2">
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
                  <div className="text-[10px] text-slate-400">Min ₹{ipo.minInvestment.toLocaleString('en-IN')}</div>
                </td>
                <td className="py-4 px-4 text-xs text-slate-700">
                  <div className="flex items-center gap-1.5">
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
    </div>
  );
};
