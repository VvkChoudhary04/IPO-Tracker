import React from 'react';
import { Database, Server, Mail, Shield, CheckCircle2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Platform Architecture & Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Infrastructure configurations and notification channels for automated checks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PostgreSQL / Supabase */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Supabase PostgreSQL + Prisma</h3>
                <p className="text-xs text-slate-500">Database & ORM layer</p>
              </div>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
              READY FOR STEP 2
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Will host encrypted applicant profiles, tracked applications, IPO metadata, and allotment audit logs.
          </p>
        </div>

        {/* Redis + BullMQ */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">BullMQ + Redis Engine</h3>
                <p className="text-xs text-slate-500">Asynchronous background jobs</p>
              </div>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
              SCHEDULED
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Handles rate-limited registrar queries, periodic cron checks during allotment release dates, and worker queues.
          </p>
        </div>

        {/* Resend Email Notifications */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Resend Email Gateway</h3>
                <p className="text-xs text-slate-500">Instant allotment notifications</p>
              </div>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
              SCHEDULED
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Sends transactional emails with masked PAN breakdown immediately upon allotment confirmation or refund.
          </p>
        </div>

        {/* Security & Cryptography */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">PAN & PII Vault</h3>
                <p className="text-xs text-slate-500">Cryptographic protection</p>
              </div>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              CONFIGURED
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Standardized masking rules and schema boundary definitions strictly enforce PAN safety across web and API.
          </p>
        </div>
      </div>
    </div>
  );
};
