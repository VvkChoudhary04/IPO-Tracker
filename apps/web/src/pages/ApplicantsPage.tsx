import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ApplicantProfileSummary } from '@ipotrack/shared';
import { ApplicantModal } from '../components/applicants/ApplicantModal';
import { Modal } from '../components/common/Modal';
import {
  Users,
  Plus,
  Search,
  Shield,
  Edit2,
  Trash2,
  Lock,
  CheckCircle2,
  FileText,
  AlertTriangle,
} from 'lucide-react';

export const ApplicantsPage: React.FC = () => {
  const { applicants, deleteApplicant, applications } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applicantToEdit, setApplicantToEdit] = useState<ApplicantProfileSummary | null>(null);
  const [applicantToDelete, setApplicantToDelete] = useState<ApplicantProfileSummary | null>(null);

  // Filter applicants
  const filteredApplicants = applicants.filter((app) => {
    const matchesSearch =
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.maskedPan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.email && app.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'ALL' || app.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setApplicantToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (app: ApplicantProfileSummary) => {
    setApplicantToEdit(app);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (applicantToDelete) {
      deleteApplicant(applicantToDelete.id);
      setApplicantToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Authorized Applicant Profiles
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold font-mono">
              {applicants.length} Total
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage family, entity, and individual PAN profiles registered for automated allotment polling.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Applicant Profile</span>
        </button>
      </div>

      {/* Security Architecture Notice */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60 shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">
              Masked Applicant Profiles (UI Prototype)
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Every profile displays only a masked PAN placeholder (<code className="font-mono text-slate-800 bg-slate-100 px-1 py-0.5 rounded">ABCDE****F</code>).
              Real PAN numbers are not collected in this interface. Automated registrar querying pipelines will be configured in Phase 4.
            </p>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, masked PAN, or email..."
            className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'RETAIL', 'SHNI', 'BHNI', 'EMPLOYEE'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {cat === 'ALL' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Applicant Profiles Cards Grid */}
      {filteredApplicants.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <Users className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-semibold text-slate-800">No applicant profiles found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm
              ? `No profiles matched "${searchTerm}". Try resetting your search filters.`
              : 'Add your first authorized investor profile to start tracking IPO applications.'}
          </p>
          {!searchTerm && (
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-medium mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Applicant Now</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredApplicants.map((app) => {
            const activeBids = applications.filter((a) => a.applicantId === app.id).length;

            return (
              <div
                key={app.id}
                className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center justify-center font-bold text-xs">
                        {app.fullName
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 truncate max-w-[160px]">
                          {app.fullName}
                        </h4>
                        <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                          {app.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(app)}
                        title="Edit profile"
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setApplicantToDelete(app)}
                        title="Delete profile"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* PAN & Demat details */}
                  <div className="mt-4 p-3 rounded-lg bg-slate-50/70 border border-slate-200/60 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5 text-emerald-600" />
                        Masked PAN:
                      </span>
                      <span className="font-mono font-semibold text-slate-800 tracking-wider">
                        {app.maskedPan}
                      </span>
                    </div>

                    {app.dematAccount && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Demat DP/Client:</span>
                        <span className="font-mono text-slate-700 text-[11px]">
                          {app.dematAccount}
                        </span>
                      </div>
                    )}

                    {app.email && (
                      <div className="flex items-center justify-between truncate">
                        <span className="text-slate-500">Email Alerts:</span>
                        <span className="text-slate-700 text-[11px] truncate max-w-[150px]">
                          {app.email}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer status & application count */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-emerald-700 font-medium text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Consent Recorded</span>
                  </div>

                  <div className="flex items-center gap-1 font-mono text-slate-600">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>{activeBids} Bids Tracked</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      <ApplicantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        applicantToEdit={applicantToEdit}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(applicantToDelete)}
        onClose={() => setApplicantToDelete(null)}
        title="Remove Applicant Profile"
        subtitle="Confirmation required"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200/80 flex items-start gap-2.5 text-xs text-rose-800">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Are you sure you want to remove this profile?</p>
              <p className="mt-0.5 text-rose-700">
                Removing <strong>{applicantToDelete?.fullName}</strong> ({applicantToDelete?.maskedPan}) will also
                remove associated tracked applications and polling schedules.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => setApplicantToDelete(null)}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
            >
              Confirm Removal
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
