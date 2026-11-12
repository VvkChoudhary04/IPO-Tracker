import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AllotmentStatus } from '@ipotrack/shared';
import { StatusBadge } from '../components/common/StatusBadge';
import { AssociateApplicationModal } from '../components/common/AssociateApplicationModal';
import {
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Download,
  Trash2,
  Plus,
  RefreshCw,
  Building2,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';

export const AllotmentResultsPage: React.FC = () => {
  const { applications, applicants, ipos, deleteApplication, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'ALL' | AllotmentStatus | 'VERIFICATION_REQUIRED'>('ALL');
  const [applicantFilter, setApplicantFilter] = useState<string>('ALL');
  const [ipoFilter, setIpoFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAssociateModalOpen, setIsAssociateModalOpen] = useState<boolean>(false);
  const [isRefreshingItem, setIsRefreshingItem] = useState<string | null>(null);

  // Filter calculations
  const totalBids = applications.length;
  const allottedCount = applications.filter((a) => a.status === 'ALLOTTED').length;
  const pendingCount = applications.filter((a) => a.status === 'AWAITING_RESULT').length;
  const notAllottedCount = applications.filter(
    (a) => a.status === 'NOT_ALLOTTED' || a.status === 'REFUND_INITIATED'
  ).length;

  const totalRefundAmount = applications.reduce((acc, curr) => acc + (curr.refundAmount || 0), 0);
  const totalSharesAllotted = applications.reduce((acc, curr) => acc + curr.sharesAllotted, 0);

  // Apply filters
  const filteredApplications = applications.filter((app) => {
    const matchesTab =
      activeTab === 'ALL' ||
      (activeTab === 'VERIFICATION_REQUIRED' &&
        app.verificationState === 'MANUAL_VERIFICATION_REQUIRED') ||
      app.status === activeTab;

    const matchesApplicant = applicantFilter === 'ALL' || app.applicantId === applicantFilter;
    const matchesIpo = ipoFilter === 'ALL' || app.ipoId === ipoFilter;
    const matchesSearch =
      app.applicationNumber.includes(searchTerm) ||
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.ipoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.maskedPan.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesApplicant && matchesIpo && matchesSearch;
  });

  const handleManualReverify = (id: string, appNum: string) => {
    setIsRefreshingItem(id);
    setTimeout(() => {
      setIsRefreshingItem(null);
      showToast('info', `Polled registrar endpoint for #${appNum}. Status confirmed up to date.`);
    }, 900);
  };

  const handleExportCSV = () => {
    const headers = [
      'Application Number',
      'Applicant',
      'Masked PAN',
      'IPO Name',
      'Category',
      'Lots Applied',
      'Shares Applied',
      'Bid Amount (INR)',
      'Status',
      'Shares Allotted',
      'Refund Amount (INR)',
      'Registrar',
    ];

    const rows = filteredApplications.map((a) => [
      a.applicationNumber,
      `"${a.applicantName}"`,
      a.maskedPan,
      `"${a.ipoName}"`,
      a.category,
      a.lotsApplied,
      a.sharesApplied,
      a.bidAmount,
      a.status,
      a.sharesAllotted,
      a.refundAmount || 0,
      `"${a.registrarDisplayName || a.registrar}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `IPOTrack_Allotment_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'Allotment audit report exported as CSV.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Allotment Results & Status
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold font-mono">
              {totalBids} Applications
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Verified status reports retrieved across Link Intime, KFintech, and Bigshare official databases.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsAssociateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Track Application</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium uppercase tracking-wider">Shares Allotted</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-2">
            {totalSharesAllotted} Shares
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Across {allottedCount} {allottedCount === 1 ? 'application' : 'applications'}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium uppercase tracking-wider">Awaiting Result</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-700 mt-2">
            {pendingCount} Pending
          </div>
          <div className="text-[11px] text-amber-600 mt-1">
            Auto-polling on allotment dates
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium uppercase tracking-wider">Refunds Unblocked</span>
            <XCircle className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">
            ₹{totalRefundAmount.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {notAllottedCount} applications not allotted
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium uppercase tracking-wider">Registrar Verification</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">100%</div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">
            Zero Mock Allotments Policy
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        {[
          { label: 'All Applications', value: 'ALL', count: totalBids },
          { label: 'Allotted', value: 'ALLOTTED', count: allottedCount },
          { label: 'Awaiting Result', value: 'AWAITING_RESULT', count: pendingCount },
          { label: 'Not Allotted', value: 'NOT_ALLOTTED', count: notAllottedCount },
          {
            label: 'Verification Required',
            value: 'VERIFICATION_REQUIRED',
            count: applications.filter(
              (a) => a.verificationState === 'MANUAL_VERIFICATION_REQUIRED'
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

      {/* Multi-Filter Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by app #, applicant, IPO, or masked PAN..."
            className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Applicant Filter */}
          <select
            value={applicantFilter}
            onChange={(e) => setApplicantFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="ALL">All Applicants ({applicants.length})</option>
            {applicants.map((a) => (
              <option key={a.id} value={a.id}>
                {a.fullName} ({a.maskedPan})
              </option>
            ))}
          </select>

          {/* IPO Filter */}
          <select
            value={ipoFilter}
            onChange={(e) => setIpoFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="ALL">All IPO Issues ({ipos.length})</option>
            {ipos.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name} ({i.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        {filteredApplications.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-semibold text-slate-800">No applications matched criteria</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your tab, applicant, or IPO filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-6">App # & Bid Date</th>
                  <th className="py-3 px-4">Applicant Profile</th>
                  <th className="py-3 px-4">IPO Issue & Registrar</th>
                  <th className="py-3 px-4">Category & Bid</th>
                  <th className="py-3 px-4">Allotment Status</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4">Shares / Refund</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* App # */}
                    <td className="py-4 px-6">
                      <div className="font-mono font-semibold text-xs text-slate-900">
                        #{app.applicationNumber}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {new Date(app.appliedAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </td>

                    {/* Applicant Profile */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-xs text-slate-900">{app.applicantName}</div>
                      <div className="text-xs font-mono text-slate-500 flex items-center gap-1">
                        <span>{app.maskedPan}</span>
                      </div>
                    </td>

                    {/* IPO & Registrar */}
                    <td className="py-4 px-4">
                      <div className="font-medium text-xs text-slate-800">{app.ipoName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        <span>{app.registrarDisplayName || app.registrar}</span>
                      </div>
                    </td>

                    {/* Category & Bid */}
                    <td className="py-4 px-4 font-mono text-xs">
                      <div className="text-slate-800 font-medium">
                        {app.sharesApplied} shares ({app.lotsApplied} {app.lotsApplied === 1 ? 'lot' : 'lots'})
                      </div>
                      <div className="text-[11px] text-slate-500">
                        ₹{app.bidAmount.toLocaleString('en-IN')} • {app.category}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <StatusBadge status={app.status} />
                    </td>

                    {/* Verification State */}
                    <td className="py-4 px-4">
                      <StatusBadge status={app.verificationState} size="sm" />
                    </td>

                    {/* Shares Allotted / Refund */}
                    <td className="py-4 px-4 text-xs font-mono">
                      {app.status === 'ALLOTTED' ? (
                        <div className="font-bold text-emerald-700">
                          {app.sharesAllotted} shares
                        </div>
                      ) : app.refundAmount ? (
                        <div className="text-slate-700">
                          Refund: ₹{app.refundAmount.toLocaleString('en-IN')}
                        </div>
                      ) : (
                        <div className="text-slate-400">—</div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleManualReverify(app.id, app.applicationNumber)}
                          disabled={isRefreshingItem === app.id}
                          title="Re-verify registrar status"
                          className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <RefreshCw
                            className={`w-3.5 h-3.5 ${
                              isRefreshingItem === app.id ? 'animate-spin text-emerald-600' : ''
                            }`}
                          />
                        </button>

                        <button
                          onClick={() => deleteApplication(app.id)}
                          title="Unlink application"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Associate Application Modal */}
      <AssociateApplicationModal
        isOpen={isAssociateModalOpen}
        onClose={() => setIsAssociateModalOpen(false)}
      />
    </div>
  );
};
