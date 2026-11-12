import React from 'react';
import { StatusBadge } from '../components/common/StatusBadge';
import { ApplicationTrackingItem } from '@ipotrack/shared';
import { FileText, ShieldAlert } from 'lucide-react';

const SAMPLE_APPLICATIONS: ApplicationTrackingItem[] = [
  {
    id: 'app-001',
    applicantId: 'app-1',
    applicantName: 'Vivek Choudhary',
    maskedPan: 'ABCDE****F',
    ipoId: 'ipo-1',
    ipoName: 'Tata Capital Technologies Ltd.',
    applicationNumber: '1092839120',
    category: 'RETAIL',
    lotsApplied: 1,
    sharesApplied: 30,
    bidAmount: 15000,
    status: 'AWAITING_RESULT',
    sharesAllotted: 0,
    lastCheckedAt: '2026-11-12T18:45:00Z',
  },
  {
    id: 'app-002',
    applicantId: 'app-2',
    applicantName: 'Family Demat Profile (HUF)',
    maskedPan: 'AAACG****H',
    ipoId: 'ipo-1',
    ipoName: 'Tata Capital Technologies Ltd.',
    applicationNumber: '1092839981',
    category: 'SHNI',
    lotsApplied: 14,
    sharesApplied: 420,
    bidAmount: 210000,
    status: 'AWAITING_RESULT',
    sharesAllotted: 0,
    lastCheckedAt: '2026-11-12T18:45:00Z',
  },
  {
    id: 'app-003',
    applicantId: 'app-1',
    applicantName: 'Vivek Choudhary',
    maskedPan: 'ABCDE****F',
    ipoId: 'ipo-2',
    ipoName: 'CleanGrid Energy Solutions Ltd.',
    applicationNumber: '8917264811',
    category: 'RETAIL',
    lotsApplied: 1,
    sharesApplied: 65,
    bidAmount: 14755,
    status: 'AWAITING_RESULT',
    sharesAllotted: 0,
    lastCheckedAt: '2026-11-12T18:40:00Z',
  },
];

export const ApplicationsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Tracked Applications
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Applications linked across PAN profiles with automated status polling.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>Real registrar verification active on allotment release</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-500" />
            <h3 className="text-base font-semibold text-slate-900">Active Bids Monitored</h3>
          </div>
          <span className="text-xs text-slate-500">
            {SAMPLE_APPLICATIONS.length} Applications Pending Result
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-6">Applicant & PAN</th>
                <th className="py-3 px-4">IPO Issue</th>
                <th className="py-3 px-4">App Number</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Shares / Amount</th>
                <th className="py-3 px-6 text-right">Allotment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {SAMPLE_APPLICATIONS.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-medium text-slate-900">{app.applicantName}</div>
                    <div className="text-xs font-mono text-slate-500">{app.maskedPan}</div>
                  </td>
                  <td className="py-4 px-4 font-medium text-slate-800">{app.ipoName}</td>
                  <td className="py-4 px-4 font-mono text-xs text-slate-600">
                    {app.applicationNumber}
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {app.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-xs font-mono text-slate-700">
                    {app.sharesApplied} shares ({app.lotsApplied} {app.lotsApplied === 1 ? 'lot' : 'lots'})
                    <div className="text-[10px] text-slate-400">₹{app.bidAmount.toLocaleString('en-IN')}</div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <StatusBadge status={app.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
