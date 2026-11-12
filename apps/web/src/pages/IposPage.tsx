import React from 'react';
import { ActiveIpoList } from '../components/dashboard/ActiveIpoList';
import { Filter, Search } from 'lucide-react';

export const IposPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Active & Upcoming IPOs
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Indian market primary offerings across NSE and BSE mainboard and SME boards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-xs transition-colors">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter by Registrar</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Filter IPOs by company name, scrip code or registrar..."
          className="w-full text-sm outline-none placeholder-slate-400 text-slate-800"
        />
      </div>

      <ActiveIpoList />
    </div>
  );
};
