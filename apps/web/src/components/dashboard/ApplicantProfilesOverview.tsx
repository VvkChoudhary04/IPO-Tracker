import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ApplicantModal } from '../applicants/ApplicantModal';
import { UserCheck, Shield, Plus, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ApplicantProfilesOverview: React.FC = () => {
  const navigate = useNavigate();
  const { applicants, applications } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <span>Configured Investor Profiles</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold font-mono">
              {applicants.length} Profiles
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Profiles monitored across Link Intime, KFintech, and Bigshare
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/applicants')}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Manage Profiles
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Applicant</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {applicants.slice(0, 3).map((applicant) => {
          const linkedCount = applications.filter((a) => a.applicantId === applicant.id).length;

          return (
            <div
              key={applicant.id}
              onClick={() => navigate('/applicants')}
              className="rounded-lg border border-slate-200/80 p-4 bg-slate-50/40 hover:bg-white hover:border-slate-300 transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center justify-center font-medium text-xs">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-200/70 text-slate-700">
                    {applicant.category}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-slate-900 mt-3 truncate group-hover:text-emerald-700 transition-colors">
                  {applicant.fullName}
                </h4>
                <div className="mt-1 flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-emerald-600" />
                  <span className="text-xs font-mono font-medium text-slate-600 tracking-wider">
                    {applicant.maskedPan}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                <span>{linkedCount} Tracked Bids</span>
                <span className="flex items-center gap-0.5 text-emerald-600 font-medium">
                  Active <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security Compliance Note */}
      <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200/60 text-xs text-slate-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Strict PAN Security Policy: All investor identifiers are masked in UI and encrypted at rest.
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">SEBI / RBI Aligned</span>
      </div>

      <ApplicantModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
