import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Clock, RefreshCw, Menu, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onRefreshHealth: () => void;
  isRefreshing?: boolean;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onRefreshHealth,
  isRefreshing = false,
  onToggleMobileMenu,
}) => {
  const navigate = useNavigate();
  const { globalSearch, setGlobalSearch, notifications, applicants, userSettings } = useApp();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 gap-4">
      {/* Mobile Toggle + Search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search IPOs, symbols, applicants, or PAN masks..."
            className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      {/* Right Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Market Timings Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>NSE / BSE Primary Market: 10 AM - 5 PM IST</span>
        </div>

        {/* Sync / Refresh Button */}
        <button
          onClick={onRefreshHealth}
          disabled={isRefreshing}
          title="Verify API health and sync registrars"
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
        </button>

        {/* Notification Bell */}
        <button
          onClick={() => navigate('/notifications')}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg relative transition-colors"
          title="Open Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="min-w-4 h-4 px-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center absolute top-1 right-1">
              {unreadCount}
            </span>
          )}
        </button>

        <div className="h-5 w-px bg-slate-200 hidden sm:block" />

        {/* User Account Pill */}
        <div
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2.5 cursor-pointer p-1 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-medium text-xs tracking-wider">
            {userSettings.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-slate-900 flex items-center gap-1">
              <span>{userSettings.name}</span>
              <Shield className="w-3 h-3 text-emerald-600" />
            </div>
            <div className="text-[11px] text-slate-500">
              {applicants.length} {applicants.length === 1 ? 'Applicant' : 'Applicants'} Linked
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
