import React from 'react';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { IpoItem } from '@ipotrack/shared';
import {
  Calendar,
  Building2,
  TrendingUp,
  Plus,
  PieChart,
} from 'lucide-react';

interface IpoDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  ipo: IpoItem | null;
  onTrackApplication: (ipo: IpoItem) => void;
}

export const IpoDetailModal: React.FC<IpoDetailModalProps> = ({
  isOpen,
  onClose,
  ipo,
  onTrackApplication,
}) => {
  if (!ipo) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={ipo.name}
      subtitle={`${ipo.symbol} • ${ipo.exchange || 'NSE & BSE'} • ${ipo.issueType}`}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Top Badges & GMP Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-2">
            <StatusBadge status={ipo.status} />
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                ipo.issueType === 'MAINBOARD'
                  ? 'bg-slate-200 text-slate-800'
                  : 'bg-purple-100 text-purple-800'
              }`}
            >
              {ipo.issueType}
            </span>
          </div>

          {ipo.gmp !== undefined && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>GMP: +₹{ipo.gmp} ({Math.round((ipo.gmp / ipo.priceRange.max) * 100)}% premium)</span>
            </div>
          )}
        </div>

        {/* Company Description */}
        {ipo.description && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Issue Profile
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">{ipo.description}</p>
          </div>
        )}

        {/* Financial Issue Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg border border-slate-200/80 bg-white">
            <div className="text-[11px] text-slate-500 uppercase tracking-wider">Price Band</div>
            <div className="text-sm font-bold font-mono text-slate-900 mt-1">
              ₹{ipo.priceRange.min} - ₹{ipo.priceRange.max}
            </div>
          </div>

          <div className="p-3 rounded-lg border border-slate-200/80 bg-white">
            <div className="text-[11px] text-slate-500 uppercase tracking-wider">Market Lot</div>
            <div className="text-sm font-bold font-mono text-slate-900 mt-1">
              {ipo.lotSize} Shares
            </div>
          </div>

          <div className="p-3 rounded-lg border border-slate-200/80 bg-white">
            <div className="text-[11px] text-slate-500 uppercase tracking-wider">Min Investment</div>
            <div className="text-sm font-bold font-mono text-emerald-700 mt-1">
              ₹{ipo.minInvestment.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="p-3 rounded-lg border border-slate-200/80 bg-white">
            <div className="text-[11px] text-slate-500 uppercase tracking-wider">Issue Size</div>
            <div className="text-sm font-bold font-mono text-slate-900 mt-1">
              {ipo.issueSizeCr ? `₹${ipo.issueSizeCr} Cr` : 'N/A'}
            </div>
          </div>
        </div>

        {/* Official Issue Timetable */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Official Timeline & Dates</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
              <span className="text-[11px] text-slate-500 block">Bidding Window</span>
              <span className="font-semibold text-slate-800 font-mono mt-0.5 block">
                {ipo.openDate} to {ipo.closeDate}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/60">
              <span className="text-[11px] text-emerald-700 block font-medium">Allotment Date</span>
              <span className="font-bold text-emerald-900 font-mono mt-0.5 block">
                {ipo.allotmentDate}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
              <span className="text-[11px] text-slate-500 block">Refunds Initiation</span>
              <span className="font-semibold text-slate-800 font-mono mt-0.5 block">
                {ipo.allotmentDate}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
              <span className="text-[11px] text-slate-500 block">Listing on Exchange</span>
              <span className="font-semibold text-slate-800 font-mono mt-0.5 block">
                {ipo.listingDate}
              </span>
            </div>
          </div>
        </div>

        {/* Subscription Demand Breakdown */}
        {ipo.subscription && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <PieChart className="w-3.5 h-3.5 text-slate-500" />
              <span>Subscription Status (Times Subscribed)</span>
            </h4>

            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-500 block">QIB (Inst.)</span>
                <span className="text-sm font-bold font-mono text-slate-800">{ipo.subscription.qib}x</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-500 block">NII (HNI)</span>
                <span className="text-sm font-bold font-mono text-slate-800">{ipo.subscription.nii}x</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-500 block">Retail</span>
                <span className="text-sm font-bold font-mono text-slate-800">{ipo.subscription.retail}x</span>
              </div>
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="text-[11px] text-emerald-700 font-semibold block">Total</span>
                <span className="text-sm font-bold font-mono text-emerald-800">{ipo.subscription.total}x</span>
              </div>
            </div>
          </div>
        )}

        {/* Registrar Information */}
        <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
            <div>
              <span className="text-slate-500 block text-[11px]">Designated Allotment Registrar</span>
              <span className="font-semibold text-slate-800">{ipo.registrarDisplayName}</span>
            </div>
          </div>

          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700">
            {ipo.registrar}
          </span>
        </div>

        {/* Modal Action Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Close Details
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onTrackApplication(ipo);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Track Application for this IPO</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
