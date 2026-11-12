import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  CheckCircle2,
  Users,
  Bell,
  Settings,
  ShieldCheck,
  Activity,
  Layers,
  X,
  Database,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  apiStatus: 'ONLINE' | 'OFFLINE' | 'CHECKING';
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  apiStatus,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const { notifications, resetToDemoDefaults } = useApp();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'My Applicants', path: '/applicants', icon: Users },
    { name: 'IPO Tracker', path: '/ipos', icon: TrendingUp },
    { name: 'Allotment Results', path: '/allotments', icon: CheckCircle2 },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 select-none transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>IPOTrack</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-none">Automated Allotments</p>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Core Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Demo Data Reset Trigger */}
        <div className="px-4 py-2 border-t border-slate-100">
          <button
            onClick={resetToDemoDefaults}
            className="w-full py-1.5 px-3 rounded-lg border border-dashed border-slate-200 hover:border-slate-300 text-[11px] font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Demo State</span>
          </button>
        </div>

        {/* Security & System Status Box */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="rounded-lg border border-slate-200/80 bg-white p-3 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-slate-500" />
                API Health Check
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
              <span className="truncate">Client-Side PAN Masking (Demo)</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
