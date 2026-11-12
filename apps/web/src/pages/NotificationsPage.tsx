import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NotificationType } from '@ipotrack/shared';
import {
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
  Mail,
  Check,
  Shield,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    userSettings,
    updateUserSettings,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'UNREAD' | 'ALLOTMENTS' | 'DEADLINES'>('ALL');

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((notif) => {
    if (activeFilter === 'UNREAD') return !notif.isRead;
    if (activeFilter === 'ALLOTMENTS')
      return (
        notif.type === 'ALLOTMENT_FINALIZED' ||
        notif.type === 'ALLOTMENT_SUCCESS' ||
        notif.type === 'NOT_ALLOTTED'
      );
    if (activeFilter === 'DEADLINES') return notif.type === 'BIDDING_CLOSING';
    return true;
  });

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'ALLOTMENT_SUCCESS':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'NOT_ALLOTTED':
        return <AlertCircle className="w-4 h-4 text-rose-500" />;
      case 'BIDDING_CLOSING':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'ALLOTMENT_FINALIZED':
        return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
      default:
        return <Shield className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Notification Center & Alerts
            </h1>
            {unreadCount > 0 && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold font-mono">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time allotment releases, registrar announcements, and email dispatch preferences.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
          >
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Resend Email Gateway Integration Box */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Mail className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <span>Resend Transactional Email Gateway</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                  CONNECTED
                </span>
              </h4>
              <p className="text-xs text-slate-500">
                Dispatches instant allotment result emails containing masked PAN summaries to {userSettings.email}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/settings')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 self-start md:self-auto"
          >
            Configure Gateway &rarr;
          </button>
        </div>

        {/* Quick Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
          <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200/80 bg-slate-50/50 cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-slate-900 block">Instant Allotment Alerts</span>
              <span className="text-[11px] text-slate-500">Sent immediately upon registrar finalization</span>
            </div>
            <input
              type="checkbox"
              checked={userSettings.instantAllotmentAlerts}
              onChange={(e) =>
                updateUserSettings({ instantAllotmentAlerts: e.target.checked })
              }
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 ml-3"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200/80 bg-slate-50/50 cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-slate-900 block">Bidding Deadline Reminders</span>
              <span className="text-[11px] text-slate-500">Alerts 2 hours before 5:00 PM IST close</span>
            </div>
            <input
              type="checkbox"
              checked={userSettings.notifyOnBiddingDeadline}
              onChange={(e) =>
                updateUserSettings({ notifyOnBiddingDeadline: e.target.checked })
              }
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 ml-3"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200/80 bg-slate-50/50 cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-slate-900 block">Daily Portfolio Digest</span>
              <span className="text-[11px] text-slate-500">Morning summary of active IPO schedules</span>
            </div>
            <input
              type="checkbox"
              checked={userSettings.dailyDigest}
              onChange={(e) => updateUserSettings({ dailyDigest: e.target.checked })}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 ml-3"
            />
          </label>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        {[
          { label: 'All Notifications', value: 'ALL', count: notifications.length },
          { label: 'Unread Only', value: 'UNREAD', count: unreadCount },
          {
            label: 'Allotment Announcements',
            value: 'ALLOTMENTS',
            count: notifications.filter(
              (n) =>
                n.type === 'ALLOTMENT_FINALIZED' ||
                n.type === 'ALLOTMENT_SUCCESS' ||
                n.type === 'NOT_ALLOTTED'
            ).length,
          },
          {
            label: 'Bidding Deadlines',
            value: 'DEADLINES',
            count: notifications.filter((n) => n.type === 'BIDDING_CLOSING').length,
          },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveFilter(tab.value as any)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeFilter === tab.value
                ? 'border-emerald-600 text-emerald-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeFilter === tab.value ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
            <Bell className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-semibold text-slate-800">No notifications to display</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You are completely caught up! We will notify you as soon as new registrar allotment files are finalized.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationAsRead(notif.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                notif.isRead
                  ? 'bg-white border-slate-200/90 hover:border-slate-300'
                  : 'bg-emerald-50/20 border-emerald-200/80 shadow-xs'
              }`}
            >
              <div className="p-2 rounded-lg bg-white border border-slate-200/80 mt-0.5 shrink-0">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-slate-900">{notif.title}</h4>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(notif.timestamp).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
