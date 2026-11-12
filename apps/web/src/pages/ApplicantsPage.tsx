import React from 'react';
import { ApplicantProfilesOverview } from '../components/dashboard/ApplicantProfilesOverview';
import { ShieldCheck, Lock, AlertTriangle } from 'lucide-react';

export const ApplicantsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Applicant Profiles Vault
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage family, entity, and individual PAN profiles authorized for automated status checks.
        </p>
      </div>

      {/* Security Architecture Notice */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Zero-Exposure PAN & Credential Architecture
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              In accordance with security best practices, Permanent Account Numbers (PANs) will be
              AES-256 encrypted at rest. PANs are never transmitted in cleartext, are masked across
              all frontend views, and are strictly utilized for targeted registrar queries during allotment windows.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Encrypted at rest with Supabase Vault / HSM keys</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>No registrar CAPTCHA bypass or rate-limit violations</span>
          </div>
        </div>
      </div>

      <ApplicantProfilesOverview />
    </div>
  );
};
