import React from 'react';
import { HealthResponse } from '@ipotrack/shared';
import { CheckCircle2, AlertCircle, RefreshCw, Cpu, Database, Mail } from 'lucide-react';

interface SystemStatusBannerProps {
  health: HealthResponse | null;
  apiStatus: 'ONLINE' | 'OFFLINE' | 'CHECKING';
  onRefresh: () => void;
}

export const SystemStatusBanner: React.FC<SystemStatusBannerProps> = ({
  health,
  apiStatus,
  onRefresh,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${
              apiStatus === 'ONLINE'
                ? 'bg-emerald-500 ring-4 ring-emerald-50'
                : apiStatus === 'CHECKING'
                ? 'bg-amber-500 ring-4 ring-amber-50 animate-pulse'
                : 'bg-rose-500 ring-4 ring-rose-50'
            }`}
          />
          <div>
            <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <span>Express API Health Service</span>
              <span className="text-xs font-normal text-slate-500">
                (v{health?.version || '0.1.0'})
              </span>
            </h4>
            <p className="text-xs text-slate-500">
              {apiStatus === 'ONLINE'
                ? `Node.js + Express backend is healthy • Uptime: ${health?.uptimeSeconds ?? 0}s • Env: ${health?.environment}`
                : apiStatus === 'CHECKING'
                ? 'Attempting handshake with Express API (http://localhost:4000)...'
                : 'Backend API offline or unreachable. Ensure the API server is running on port 4000.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Verify Handshake</span>
          </button>
        </div>
      </div>

      {/* Tech Stack Modules Prepared For Next Increments */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        <div className="bg-slate-50/70 border border-slate-200/60 rounded-lg p-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-slate-600" />
              Express API
            </span>
            {apiStatus === 'ONLINE' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            )}
          </div>
          <p className="text-[11px] font-medium text-slate-800 mt-1">Health Endpoint Active</p>
        </div>

        <div className="bg-slate-50/70 border border-slate-200/60 rounded-lg p-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-slate-600" />
              PostgreSQL
            </span>
            <span className="text-[10px] text-slate-400 font-mono">NEXT PHASE</span>
          </div>
          <p className="text-[11px] font-medium text-slate-800 mt-1">Prisma Schema Planned</p>
        </div>

        <div className="bg-slate-50/70 border border-slate-200/60 rounded-lg p-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
              BullMQ + Redis
            </span>
            <span className="text-[10px] text-slate-400 font-mono">NEXT PHASE</span>
          </div>
          <p className="text-[11px] font-medium text-slate-800 mt-1">Cron Scrapers Planned</p>
        </div>

        <div className="bg-slate-50/70 border border-slate-200/60 rounded-lg p-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-600" />
              Resend
            </span>
            <span className="text-[10px] text-slate-400 font-mono">NEXT PHASE</span>
          </div>
          <p className="text-[11px] font-medium text-slate-800 mt-1">Email Alerts Planned</p>
        </div>
      </div>
    </div>
  );
};

