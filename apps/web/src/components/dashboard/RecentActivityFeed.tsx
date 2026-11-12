import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCircle2, Clock, AlertCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RecentActivityFeed: React.FC = () => {
  const navigate = useNavigate();
  const { notifications } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case 'ALLOTTED':
      case 'ALLOTMENT_SUCCESS':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'NOT_ALLOTTED':
        return <AlertCircle className="w-3.5 h-3.5 text-rose-500" />;
      case 'BIDDING_CLOSING':
        return <Clock className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-blue-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-slate-500" />
            <span>Recent Allotment & Bidding Alerts</span>
          </h4>
          <p className="text-xs text-slate-500">Real-time status changes and registrar notifications</p>
        </div>
        <button
          onClick={() => navigate('/notifications')}
          className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5"
        >
          <span>View All Alerts</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="divide-y divide-slate-100 mt-2">
        {notifications.slice(0, 4).map((notif) => (
          <div
            key={notif.id}
            onClick={() => navigate('/notifications')}
            className="py-3 flex items-start gap-3 hover:bg-slate-50/60 transition-colors rounded-lg px-2 cursor-pointer"
          >
            <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 mt-0.5 shrink-0">
              {getIcon(notif.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h5 className="text-xs font-semibold text-slate-900 truncate">{notif.title}</h5>
                <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                  {new Date(notif.timestamp).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">{notif.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

