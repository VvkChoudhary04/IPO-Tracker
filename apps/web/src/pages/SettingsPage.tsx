import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Shield,
  Bell,
  Sliders,
  Lock,
  CheckCircle2,
  Save,
  RefreshCw,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { userSettings, updateUserSettings, showToast, resetToDemoDefaults } = useApp();

  const [activeTab, setActiveTab] = useState<'PROFILE' | 'PREFERENCES' | 'NOTIFICATIONS' | 'SECURITY'>('PROFILE');

  // Form states
  const [name, setName] = useState(userSettings.name);
  const [email, setEmail] = useState(userSettings.email);
  const [timezone, setTimezone] = useState(userSettings.timezone);
  const [currency, setCurrency] = useState(userSettings.currency);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('error', 'Full name cannot be empty.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      showToast('error', 'Valid email address is required.');
      return;
    }

    updateUserSettings({
      name: name.trim(),
      email: email.trim(),
      timezone,
      currency,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Platform Architecture & Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage user profiles, automated notification channels, and cryptographic PAN vault configurations.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        {[
          { label: 'User Profile', value: 'PROFILE', icon: User },
          { label: 'Preferences', value: 'PREFERENCES', icon: Sliders },
          { label: 'Notification Channels', value: 'NOTIFICATIONS', icon: Bell },
          { label: 'Security & PAN Vault', value: 'SECURITY', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.value
                  ? 'border-emerald-600 text-emerald-700 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: User Profile */}
      {activeTab === 'PROFILE' && (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 space-y-6">
          <form onSubmit={handleSaveProfile} className="space-y-5 max-w-xl">
            {/* Avatar Pill */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
                {name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">{name}</h4>
                <p className="text-xs text-slate-500">Investor Workspace Administrator</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Legal Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Primary Account Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Used for Resend transactional email dispatches and allotment confirmations.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST - UTC+5:30)</option>
                  <option value="Asia/Dubai (GST)">Asia/Dubai (GST - UTC+4:00)</option>
                  <option value="Asia/Singapore (SGT)">Asia/Singapore (SGT - UTC+8:00)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Reporting Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="INR (₹)">Indian Rupee (INR ₹)</option>
                  <option value="USD ($)">US Dollar (USD $)</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Preferences */}
      {activeTab === 'PREFERENCES' && (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 space-y-6">
          <div className="space-y-4 max-w-xl">
            <h3 className="text-sm font-semibold text-slate-900">Application Defaults</h3>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">Default Investor Category</span>
                  <span className="text-slate-500">Applied when creating new bids</span>
                </div>
                <span className="font-mono font-medium px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  RETAIL (&lt; ₹2,00,000)
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                <div>
                  <span className="font-semibold text-slate-800 block">Allotment Polling Frequency</span>
                  <span className="text-slate-500">Scheduled registrar checks on allotment day</span>
                </div>
                <span className="font-mono font-medium px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  Every 15 Minutes
                </span>
              </div>
            </div>

            {/* Reset Demo Data Button */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Demonstration State Management
              </h4>
              <p className="text-xs text-slate-600 mb-3">
                Reset all in-memory and local storage modifications back to the default pristine demo fixtures.
              </p>
              <button
                onClick={resetToDemoDefaults}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset to Initial Demo Data</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Notification Channels */}
      {activeTab === 'NOTIFICATIONS' && (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 space-y-6">
          <div className="space-y-4 max-w-xl">
            <h3 className="text-sm font-semibold text-slate-900">Email & Dispatch Channels</h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200/80 bg-slate-50/50 cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">
                    Transactional Resend Emails
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Master switch for automated external dispatch
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={userSettings.emailNotifications}
                  onChange={(e) =>
                    updateUserSettings({ emailNotifications: e.target.checked })
                  }
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200/80 bg-slate-50/50 cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">
                    Instant Allotment Confirmation
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Trigger notification the second an allotment is confirmed by registrar
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={userSettings.notifyOnAllotmentRelease}
                  onChange={(e) =>
                    updateUserSettings({ notifyOnAllotmentRelease: e.target.checked })
                  }
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200/80 bg-slate-50/50 cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">
                    Bidding Window Deadlines
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Reminder 2 hours before retail market close
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={userSettings.notifyOnBiddingDeadline}
                  onChange={(e) =>
                    updateUserSettings({ notifyOnBiddingDeadline: e.target.checked })
                  }
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Security & PAN Vault */}
      {activeTab === 'SECURITY' && (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 space-y-6">
          <div className="space-y-4 max-w-xl">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Cryptographic PAN Vault & Access Controls</span>
            </h3>

            <div className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-900">
                  AES-256 Vault Encryption Status
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-emerald-950/80 leading-relaxed">
                Applicant Permanent Account Numbers (PANs) are strictly masked on all client boundaries.
                In Phase 3, database persistence will utilize hardware-backed encryption keys.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">Two-Factor Authentication (2FA)</h4>
                  <p className="text-[11px] text-slate-500">Mandatory for modifying authorized applicant PANs</p>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                  ENABLED (TOTP)
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">Active API Key Session</h4>
                  <p className="text-[11px] text-slate-500">Node.js Express backend handshake</p>
                </div>
                <span className="text-[11px] font-mono text-slate-600">
                  SESSION-ID: IPOTRACK-7A92...
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
