import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { IpoItem, IpoStatus, IpoIssueType } from '@ipotrack/shared';
import { StatusBadge } from '../components/common/StatusBadge';
import { IpoDetailModal } from '../components/ipos/IpoDetailModal';
import { AssociateApplicationModal } from '../components/common/AssociateApplicationModal';
import {
  Search,
  Calendar,
  Building2,
  Plus,
  ChevronRight,
} from 'lucide-react';

export const IposPage: React.FC = () => {
  const { ipos } = useApp();

  const [activeTab, setActiveTab] = useState<'ALL' | IpoStatus>('ALL');
  const [issueTypeFilter, setIssueTypeFilter] = useState<'ALL' | IpoIssueType>('ALL');
  const [registrarFilter, setRegistrarFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedIpoForDetail, setSelectedIpoForDetail] = useState<IpoItem | null>(null);
  const [selectedIpoForTrack, setSelectedIpoForTrack] = useState<IpoItem | null>(null);

  // Filter IPOs
  const filteredIpos = ipos.filter((ipo) => {
    const matchesTab =
      activeTab === 'ALL' ||
      (activeTab === 'OPEN' && ipo.status === 'OPEN') ||
      (activeTab === 'UPCOMING' && ipo.status === 'UPCOMING') ||
      (activeTab === 'CLOSED' && (ipo.status === 'CLOSED' || ipo.status === 'ALLOTMENT_FINALIZED' || ipo.status === 'LISTED'));

    const matchesType = issueTypeFilter === 'ALL' || ipo.issueType === issueTypeFilter;
    const matchesRegistrar = registrarFilter === 'ALL' || ipo.registrar === registrarFilter;
    const matchesSearch =
      ipo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ipo.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ipo.registrarDisplayName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesType && matchesRegistrar && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">IPO Tracker Catalog</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold font-mono">
              {ipos.length} Tracked Issues
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Indian primary offerings across NSE & BSE Mainboard and SME boards with registrar connectivity.
          </p>
        </div>

        <button
          onClick={() => setSelectedIpoForTrack(ipos[0] || null)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Track Application</span>
        </button>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        {[
          { label: 'All Issues', value: 'ALL', count: ipos.length },
          {
            label: 'Open for Bidding',
            value: 'OPEN',
            count: ipos.filter((i) => i.status === 'OPEN').length,
          },
          {
            label: 'Upcoming Offerings',
            value: 'UPCOMING',
            count: ipos.filter((i) => i.status === 'UPCOMING').length,
          },
          {
            label: 'Closed / Allotment Phase',
            value: 'CLOSED',
            count: ipos.filter(
              (i) =>
                i.status === 'CLOSED' ||
                i.status === 'ALLOTMENT_FINALIZED' ||
                i.status === 'LISTED'
            ).length,
          },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value as any)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.value
                ? 'border-emerald-600 text-emerald-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === tab.value ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search company name, symbol, or registrar..."
            className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Segment Filter */}
          <select
            value={issueTypeFilter}
            onChange={(e) => setIssueTypeFilter(e.target.value as any)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="ALL">All Segments (Mainboard + SME)</option>
            <option value="MAINBOARD">Mainboard Only</option>
            <option value="SME">SME Boards Only</option>
          </select>

          {/* Registrar Filter */}
          <select
            value={registrarFilter}
            onChange={(e) => setRegistrarFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="ALL">All Registrars</option>
            <option value="LINK_INTIME">Link Intime</option>
            <option value="KFINTECH">KFintech</option>
            <option value="BIGSHARE">Bigshare</option>
            <option value="CAMEO">Cameo</option>
          </select>
        </div>
      </div>

      {/* IPOs Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-6">Company & Symbol</th>
                <th className="py-3 px-4">Segment</th>
                <th className="py-3 px-4">Price Band</th>
                <th className="py-3 px-4">Lot Size / Min Bid</th>
                <th className="py-3 px-4">Bidding Dates</th>
                <th className="py-3 px-4">Allotment Date</th>
                <th className="py-3 px-4">Registrar</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredIpos.map((ipo) => (
                <tr
                    key={ipo.id}
                    onClick={() => setSelectedIpoForDetail(ipo)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        <span className="group-hover:text-emerald-700 transition-colors">
                          {ipo.name}
                        </span>
                        {ipo.gmp && (
                          <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                            +₹{ipo.gmp} GMP
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-mono text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>{ipo.symbol}</span>
                        <span>•</span>
                        <span>{ipo.exchange || 'NSE & BSE'}</span>
                      </div>
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

                    <td className="py-4 px-4 font-mono text-xs text-slate-800">
                      ₹{ipo.priceRange.min} - ₹{ipo.priceRange.max}
                    </td>

                    <td className="py-4 px-4 text-xs font-mono text-slate-700">
                      {ipo.lotSize} shares
                      <div className="text-[10px] text-slate-400">
                        ₹{ipo.minInvestment.toLocaleString('en-IN')}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-600 font-mono">
                      {ipo.openDate} to {ipo.closeDate}
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

                    <td className="py-4 px-4">
                      <StatusBadge status={ipo.status} />
                    </td>

                    <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedIpoForTrack(ipo)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-200/60 transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Track</span>
                        </button>

                        <button
                          onClick={() => setSelectedIpoForDetail(ipo)}
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <IpoDetailModal
        isOpen={Boolean(selectedIpoForDetail)}
        onClose={() => setSelectedIpoForDetail(null)}
        ipo={selectedIpoForDetail}
        onTrackApplication={(ipo) => setSelectedIpoForTrack(ipo)}
      />

      {/* Track Application Modal */}
      <AssociateApplicationModal
        isOpen={Boolean(selectedIpoForTrack)}
        onClose={() => setSelectedIpoForTrack(null)}
        defaultIpoId={selectedIpoForTrack?.id}
      />
    </div>
  );
};
