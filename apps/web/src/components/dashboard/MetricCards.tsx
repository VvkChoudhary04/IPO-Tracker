import React from 'react';
import { TrendingUp, Users, CheckCircle2, Server } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  trend?: string;
  trendType?: 'positive' | 'neutral';
  icon: React.ElementType;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendType = 'positive',
  icon: Icon,
}) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{value}</h3>
        </div>
        <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500">{subtitle}</span>
        {trend && (
          <span
            className={`font-medium ${
              trendType === 'positive' ? 'text-emerald-600' : 'text-slate-600'
            }`}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};

export const MetricCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <MetricCard
        title="Active IPOs"
        value="6"
        subtitle="3 Mainboard • 3 SME"
        trend="2 Closing Today"
        trendType="positive"
        icon={TrendingUp}
      />
      <MetricCard
        title="Tracked Applications"
        value="14"
        subtitle="Across 3 PAN profiles"
        trend="₹2,10,000 Blocked"
        trendType="neutral"
        icon={Users}
      />
      <MetricCard
        title="Expected Allotments"
        value="2"
        subtitle="Finalizing today"
        trend="Auto-check ready"
        trendType="positive"
        icon={CheckCircle2}
      />
      <MetricCard
        title="Registrar Connections"
        value="5 / 5"
        subtitle="Link Intime, KFin, Bigshare..."
        trend="Operational"
        trendType="positive"
        icon={Server}
      />
    </div>
  );
};
