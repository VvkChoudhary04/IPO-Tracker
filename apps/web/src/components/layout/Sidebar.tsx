import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  FileText,
  Users,
  Settings,
  ShieldCheck,
  Activity,
  Layers,
} from 'lucide-react';

interface SidebarProps {
  apiStatus: 'ONLINE' | 'OFFLINE' | 'CHECKING';
}

export const Sidebar: React.FC<SidebarProps> = ({ apiStatus }) => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Active IPOs', path: '/ipos', icon: TrendingUp },
    { name: 'Applications', path: '/applications', icon: FileText },
    { name: 'Applicant Profiles', path: '/applicants', icon: Users },
    { name: 'System Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <div className="font-semibold text-slate-900 tracking-tight flex items-center gap-1.5">
            <span>IPOTrack</span>
            <span className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              PRO
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-none">Automated Allotments</p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Core Engine
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Security & System Status Box */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="rounded-lg border border-slate-200/80 bg-white p-3 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-slate-500" />
              Backend API
            </span>
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                apiStatus === 'ONLINE'
                  ? 'bg-emerald-50 text-emerald-700'
                  : apiStatus === 'CHECKING'
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-rose-50 text-rose-700'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  apiStatus === 'ONLINE'
                    ? 'bg-emerald-500'
                    : apiStatus === 'CHECKING'
                    ? 'bg-amber-500 animate-pulse'
                    : 'bg-rose-500'
                }`}
              />
              {apiStatus}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">Encrypted Applicant PANs</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
