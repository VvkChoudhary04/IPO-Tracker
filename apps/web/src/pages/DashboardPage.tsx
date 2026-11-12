import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { HealthResponse } from '@ipotrack/shared';
import { MetricCards } from '../components/dashboard/MetricCards';
import { SystemStatusBanner } from '../components/dashboard/SystemStatusBanner';
import { ActiveIpoList } from '../components/dashboard/ActiveIpoList';
import { ApplicantProfilesOverview } from '../components/dashboard/ApplicantProfilesOverview';
import { ShieldCheck, Zap } from 'lucide-react';

interface LayoutContextType {
  health: HealthResponse | null;
  apiStatus: 'ONLINE' | 'OFFLINE' | 'CHECKING';
  checkStatus: () => void;
}

export const DashboardPage: React.FC = () => {
  const { health, apiStatus, checkStatus } = useOutletContext<LayoutContextType>();

  return (
    <div className="space-y-8">
      {/* Page Title & Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Portfolio & Allotment Overview
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Zap className="w-3 h-3 text-emerald-600" />
              Automated Tracker
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time monitoring across primary market registrars (Link Intime, KFintech, Bigshare).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 flex items-center gap-2 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-slate-800">Zero Mock Allotments Policy</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <MetricCards />

      {/* Backend Handshake Banner */}
      <SystemStatusBanner
        health={health}
        apiStatus={apiStatus}
        onRefresh={checkStatus}
      />

      {/* Active IPOs Table */}
      <ActiveIpoList />

      {/* Applicant Profiles Summary */}
      <ApplicantProfilesOverview />
    </div>
  );
};
