import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { ApplicantProfileSummary, InvestorCategory } from '@ipotrack/shared';
import { Lock } from 'lucide-react';

interface ApplicantModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicantToEdit?: ApplicantProfileSummary | null;
}

export const ApplicantModal: React.FC<ApplicantModalProps> = ({
  isOpen,
  onClose,
  applicantToEdit,
}) => {
  const { addApplicant, updateApplicant } = useApp();

  const isEdit = Boolean(applicantToEdit);

  const [fullName, setFullName] = useState('');
  const [maskedPan, setMaskedPan] = useState('');
  const [category, setCategory] = useState<InvestorCategory>('RETAIL');
  const [email, setEmail] = useState('');
  const [phoneMasked, setPhoneMasked] = useState('');
  const [dematAccount, setDematAccount] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (applicantToEdit) {
      setFullName(applicantToEdit.fullName);
      setMaskedPan(applicantToEdit.maskedPan);
      setCategory(applicantToEdit.category);
      setEmail(applicantToEdit.email || '');
      setPhoneMasked(applicantToEdit.phoneMasked || '');
      setDematAccount(applicantToEdit.dematAccount || '');
      setConsentGiven(applicantToEdit.consentGiven ?? true);
    } else {
      setFullName('');
      setMaskedPan('ABCDE****F');
      setCategory('RETAIL');
      setEmail('');
      setPhoneMasked('');
      setDematAccount('');
      setConsentGiven(true);
    }
    setErrors({});
  }, [applicantToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full legal name is required.';
    }

    if (!maskedPan.trim()) {
      newErrors.maskedPan = 'Masked PAN is required (e.g. ABCDE****F).';
    } else if (maskedPan.length !== 10) {
      newErrors.maskedPan = 'PAN must be exactly 10 characters (e.g. ABCDE****F).';
    }

    if (!consentGiven) {
      newErrors.consent = 'You must acknowledge the registrar lookup consent.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isEdit && applicantToEdit) {
      updateApplicant(applicantToEdit.id, {
        fullName: fullName.trim(),
        maskedPan: maskedPan.trim().toUpperCase(),
        category,
        email: email.trim() || undefined,
        phoneMasked: phoneMasked.trim() || undefined,
        dematAccount: dematAccount.trim() || undefined,
        consentGiven,
      });
    } else {
      addApplicant({
        fullName: fullName.trim(),
        maskedPan: maskedPan.trim().toUpperCase(),
        category,
        email: email.trim() || undefined,
        phoneMasked: phoneMasked.trim() || undefined,
        dematAccount: dematAccount.trim() || undefined,
        consentGiven,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Applicant Profile' : 'Add Authorized Applicant'}
      subtitle={
        isEdit
          ? 'Update applicant metadata or investment categories'
          : 'Create a new masked investor profile for automated allotment tracking'
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Legal Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Full Legal Name (as per ITD / PAN Card) *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Vivek Choudhary"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
          />
          {errors.fullName && <p className="text-xs text-rose-600 mt-1">{errors.fullName}</p>}
        </div>

        {/* Masked PAN & Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Masked PAN *
              </label>
              <span className="text-[10px] text-slate-500 font-mono">Masked Format</span>
            </div>
            <input
              type="text"
              required
              maxLength={10}
              placeholder="ABCDE****F"
              value={maskedPan}
              onChange={(e) => setMaskedPan(e.target.value.toUpperCase())}
              className="w-full text-sm font-mono tracking-wider bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 uppercase focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            {errors.maskedPan && (
              <p className="text-xs text-rose-600 mt-1">{errors.maskedPan}</p>
            )}
            <p className="text-[11px] text-slate-400 mt-1">Format: 5 letters, 4 stars, 1 letter</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Default Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as InvestorCategory)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="RETAIL">Retail (Individual &lt; ₹2L)</option>
              <option value="SHNI">sHNI (₹2L - ₹10L)</option>
              <option value="BHNI">bHNI (&gt; ₹10L)</option>
              <option value="EMPLOYEE">Company Employee</option>
              <option value="SHAREHOLDER">Eligible Shareholder</option>
            </select>
          </div>
        </div>

        {/* Demat Account & Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Masked Demat DP / Client ID
            </label>
            <input
              type="text"
              placeholder="12081600********"
              value={dematAccount}
              onChange={(e) => setDematAccount(e.target.value)}
              className="w-full text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email for Allotment Alerts
            </label>
            <input
              type="email"
              placeholder="investor@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Privacy Callout */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
          <div className="flex items-center gap-1.5 font-medium text-slate-900">
            <Lock className="w-3.5 h-3.5 text-slate-600" />
            <span>Client Masking & Prototype Security</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-500">
            For UI demonstration, enter only masked PAN placeholders (e.g. ABCDE****F).
            Database encryption and secure credential handling will be configured in Phase 3.
          </p>
        </div>

        {/* Consent Checkbox */}
        <div>
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-xs text-slate-600 leading-normal">
              I authorize IPOTrack to query public registrar allotment records (Link Intime, KFintech,
              Bigshare) on behalf of this applicant profile.
            </span>
          </label>
          {errors.consent && <p className="text-xs text-rose-600 mt-1">{errors.consent}</p>}
        </div>

        {/* Modal Buttons */}
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
            {isEdit ? 'Save Changes' : 'Add Profile'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
