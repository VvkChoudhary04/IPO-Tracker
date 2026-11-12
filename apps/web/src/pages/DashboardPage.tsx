import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { HealthResponse } from '@ipotrack/shared';
import { MetricCards } from '../components/dashboard/MetricCards';
import { AllotmentDonutChart } from '../components/dashboard/AllotmentDonutChart';
import { UpcomingAllotmentsTimeline } from '../components/dashboard/UpcomingAllotmentsTimeline';
import { SystemStatusBanner } from '../components/dashboard/SystemStatusBanner';
import { RecentActivityFeed } from '../components/dashboard/RecentActivityFeed';
import { ActiveIpoList } from '../components/dashboard/ActiveIpoList';
import { AssociateApplicationModal } from '../components/common/AssociateApplicationModal';
import { Plus, ShieldCheck, Zap } from 'lucide-react';

interface LayoutContextType {
  health: HealthResponse | null;
  apiStatus: 'ONLINE' | 'OFFLINE' | 'CHECKING';
  checkStatus: () => void;
}

export const DashboardPage: React.FC = () => {
  const { health, apiStatus, checkStatus } = useOutletContext<LayoutContextType>();
  const [isAssociateModalOpen, setIsAssociateModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Top Header & Fast Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Portfolio & Allotment Overview
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Zap className="w-3 h-3 text-emerald-600" />
              Auto-Sync Active
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time Indian primary market allotment monitoring across Link Intime, KFintech, and Bigshare.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 items-center gap-2 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-slate-800">SEBI-Compliant</span>
          </div>

          <button
            onClick={() => setIsAssociateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Track New Application</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <MetricCards />

      {/* Analytics & Timeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AllotmentDonutChart />
        <UpcomingAllotmentsTimeline />
      </div>

      {/* System Status Banner */}
      <SystemStatusBanner
        health={health}
        apiStatus={apiStatus}
        onRefresh={checkStatus}
      />

      {/* Live Alerts & Active Offerings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RecentActivityFeed />
        </div>
        <div className="lg:col-span-2">
          <ActiveIpoList />
        </div>
      </div>

      {/* Associate Application Modal */}
      <AssociateApplicationModal
        isOpen={isAssociateModalOpen}
        onClose={() => setIsAssociateModalOpen(false)}
      />
    </div>
  );
};
