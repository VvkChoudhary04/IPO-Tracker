import React, { useState } from 'react';
import { Modal } from './Modal';
import { useApp } from '../../context/AppContext';
import { Shield } from 'lucide-react';
import { InvestorCategory } from '@ipotrack/shared';

interface AssociateApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultIpoId?: string;
}

export const AssociateApplicationModal: React.FC<AssociateApplicationModalProps> = ({
  isOpen,
  onClose,
  defaultIpoId,
}) => {
  const { applicants, ipos, addApplication } = useApp();

  const [selectedApplicantId, setSelectedApplicantId] = useState<string>(
    applicants[0]?.id || ''
  );
  const [selectedIpoId, setSelectedIpoId] = useState<string>(
    defaultIpoId || ipos[0]?.id || ''
  );
  const [applicationNumber, setApplicationNumber] = useState<string>('');
  const [lots, setLots] = useState<number>(1);
  const [category, setCategory] = useState<InvestorCategory>('RETAIL');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const selectedIpo = ipos.find((i) => i.id === selectedIpoId);

  const calculateAmount = () => {
    if (!selectedIpo) return 0;
    return lots * selectedIpo.lotSize * selectedIpo.priceRange.max;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!selectedApplicantId) {
      newErrors.applicant = 'Please select an authorized applicant profile.';
    }
    if (!selectedIpoId) {
      newErrors.ipo = 'Please choose an active IPO issue.';
    }
    if (!applicationNumber.trim()) {
      newErrors.applicationNumber = 'Application number or ASBA reference is required.';
    } else if (applicationNumber.trim().length < 6) {
      newErrors.applicationNumber = 'Application number must be at least 6 digits.';
    }
    if (lots < 1) {
      newErrors.lots = 'At least 1 lot must be applied.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    addApplication({
      applicantId: selectedApplicantId,
      ipoId: selectedIpoId,
      applicationNumber: applicationNumber.trim(),
      lotsApplied: lots,
      category,
    });

    // Reset and close
    setApplicationNumber('');
    setLots(1);
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Track IPO Application"
      subtitle="Link an applicant bid to automatically monitor registrar allotment status"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Applicant Profile Select */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Authorized Applicant Profile *
          </label>
          <select
            value={selectedApplicantId}
            onChange={(e) => setSelectedApplicantId(e.target.value)}
            className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
          >
            {applicants.map((app) => (
              <option key={app.id} value={app.id}>
                {app.fullName} ({app.maskedPan}) • {app.category}
              </option>
            ))}
          </select>
          {errors.applicant && (
            <p className="text-xs text-rose-600 mt-1">{errors.applicant}</p>
          )}
        </div>

        {/* IPO Issue Select */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Select IPO Offering *
          </label>
          <select
            value={selectedIpoId}
            onChange={(e) => setSelectedIpoId(e.target.value)}
            className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
          >
            {ipos.map((ipo) => (
              <option key={ipo.id} value={ipo.id}>
                {ipo.name} ({ipo.symbol}) — {ipo.registrarDisplayName}
              </option>
            ))}
          </select>
          {errors.ipo && <p className="text-xs text-rose-600 mt-1">{errors.ipo}</p>}
        </div>

        {/* Application Number (ASBA / Broker Reference) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Application / ASBA Reference Number *
            </label>
            <span className="text-[11px] text-slate-400">8-12 digits typically</span>
          </div>
          <input
            type="text"
            placeholder="e.g. 1092841920"
            value={applicationNumber}
            onChange={(e) => setApplicationNumber(e.target.value)}
            className="w-full text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
          />
          {errors.applicationNumber && (
            <p className="text-xs text-rose-600 mt-1">{errors.applicationNumber}</p>
          )}
        </div>

        {/* Category & Lots Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Investor Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as InvestorCategory)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="RETAIL">Retail (Individual)</option>
              <option value="SHNI">sHNI (₹2L - ₹10L)</option>
              <option value="BHNI">bHNI (&gt; ₹10L)</option>
              <option value="EMPLOYEE">Employee</option>
              <option value="SHAREHOLDER">Shareholder</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Lots Applied
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="1000"
                value={lots}
                onChange={(e) => setLots(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            {errors.lots && <p className="text-xs text-rose-600 mt-1">{errors.lots}</p>}
          </div>
        </div>

        {/* Calculated Bid Preview Card */}
        {selectedIpo && (
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Lot Size & Cut-off Price:</span>
              <span className="font-mono font-medium text-slate-800">
                {selectedIpo.lotSize} shares @ ₹{selectedIpo.priceRange.max}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Total Shares Blocked:</span>
              <span className="font-mono font-medium text-slate-800">
                {lots * selectedIpo.lotSize} shares
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 font-semibold text-slate-900">
              <span>Total Capital Blocked:</span>
              <span className="text-emerald-700 font-mono text-sm">
                ₹{calculateAmount().toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        )}

        {/* Registrar Compliance Notice */}
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200/60 text-[11px] text-emerald-900">
          <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            The registrar ({selectedIpo?.registrarDisplayName || 'Designated Registrar'}) will be polled
            automatically on allotment date ({selectedIpo?.allotmentDate || 'TBD'}) using masked credentials.
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
          >
            Start Tracking Application
          </button>
        </div>
      </form>
    </Modal>
  );
};
