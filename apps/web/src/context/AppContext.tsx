import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  ApplicantProfileSummary,
  IpoItem,
  ApplicationTrackingItem,
  NotificationItem,
} from '@ipotrack/shared';
import {
  INITIAL_DEMO_APPLICANTS,
  INITIAL_DEMO_IPOS,
  INITIAL_DEMO_APPLICATIONS,
  INITIAL_DEMO_NOTIFICATIONS,
} from '../fixtures/demoData';

export interface UserSettings {
  name: string;
  email: string;
  avatarUrl: string;
  timezone: string;
  currency: string;
  emailNotifications: boolean;
  notifyOnAllotmentRelease: boolean;
  notifyOnBiddingDeadline: boolean;
  dailyDigest: boolean;
  instantAllotmentAlerts: boolean;
  panVaultEncryptionActive: boolean;
  twoFactorEnabled: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}

interface AppContextType {
  applicants: ApplicantProfileSummary[];
  ipos: IpoItem[];
  applications: ApplicationTrackingItem[];
  notifications: NotificationItem[];
  userSettings: UserSettings;
  globalSearch: string;
  setGlobalSearch: (query: string) => void;
  toasts: ToastMessage[];
  showToast: (type: 'success' | 'info' | 'error', message: string) => void;
  dismissToast: (id: string) => void;
  addApplicant: (newApplicant: {
    fullName: string;
    maskedPan: string;
    category: ApplicantProfileSummary['category'];
    email?: string;
    phoneMasked?: string;
    dematAccount?: string;
    consentGiven: boolean;
  }) => void;
  updateApplicant: (id: string, updates: Partial<ApplicantProfileSummary>) => void;
  deleteApplicant: (id: string) => void;
  addApplication: (newApplication: {
    applicantId: string;
    ipoId: string;
    applicationNumber: string;
    lotsApplied: number;
    category?: ApplicantProfileSummary['category'];
  }) => void;
  deleteApplication: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  updateUserSettings: (updates: Partial<UserSettings>) => void;
  resetToDemoDefaults: () => void;
}

const DEFAULT_SETTINGS: UserSettings = {
  name: 'Vivek Choudhary',
  email: 'vivek.choudhary@enterprise.com',
  avatarUrl: '',
  timezone: 'Asia/Kolkata (IST)',
  currency: 'INR (₹)',
  emailNotifications: true,
  notifyOnAllotmentRelease: true,
  notifyOnBiddingDeadline: true,
  dailyDigest: false,
  instantAllotmentAlerts: true,
  panVaultEncryptionActive: true,
  twoFactorEnabled: true,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'ipotrack_phase2_state';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [applicants, setApplicants] = useState<ApplicantProfileSummary[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_applicants`);
    return saved ? JSON.parse(saved) : INITIAL_DEMO_APPLICANTS;
  });

  const [ipos, setIpos] = useState<IpoItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_ipos`);
    return saved ? JSON.parse(saved) : INITIAL_DEMO_IPOS;
  });

  const [applications, setApplications] = useState<ApplicationTrackingItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_applications`);
    return saved ? JSON.parse(saved) : INITIAL_DEMO_APPLICATIONS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_notifications`);
    return saved ? JSON.parse(saved) : INITIAL_DEMO_NOTIFICATIONS;
  });

  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_settings`);
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [globalSearch, setGlobalSearch] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync state changes to local storage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_applicants`, JSON.stringify(applicants));
  }, [applicants]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_ipos`, JSON.stringify(ipos));
  }, [ipos]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_applications`, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_notifications`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_settings`, JSON.stringify(userSettings));
  }, [userSettings]);

  const showToast = (type: 'success' | 'info' | 'error', message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addApplicant: AppContextType['addApplicant'] = (newApp) => {
    const id = `applicant-${Date.now()}`;
    const record: ApplicantProfileSummary = {
      id,
      fullName: newApp.fullName,
      maskedPan: newApp.maskedPan,
      category: newApp.category,
      email: newApp.email,
      phoneMasked: newApp.phoneMasked,
      dematAccount: newApp.dematAccount,
      isActive: true,
      totalApplicationsCount: 0,
      consentGiven: newApp.consentGiven,
      consentDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    setApplicants((prev) => [record, ...prev]);
    showToast('success', `Applicant "${newApp.fullName}" added successfully.`);
  };

  const updateApplicant = (id: string, updates: Partial<ApplicantProfileSummary>) => {
    setApplicants((prev) =>
      prev.map((app) => (app.id === id ? { ...app, ...updates } : app))
    );
    showToast('info', 'Applicant profile updated.');
  };

  const deleteApplicant = (id: string) => {
    const target = applicants.find((a) => a.id === id);
    setApplicants((prev) => prev.filter((a) => a.id !== id));
    // Also remove applications associated with this applicant
    setApplications((prev) => prev.filter((a) => a.applicantId !== id));
    showToast('info', `Applicant "${target?.fullName || 'Profile'}" deleted.`);
  };

  const addApplication: AppContextType['addApplication'] = (newAppl) => {
    const applicant = applicants.find((a) => a.id === newAppl.applicantId);
    const ipo = ipos.find((i) => i.id === newAppl.ipoId);
    if (!applicant || !ipo) {
      showToast('error', 'Applicant or IPO issue could not be found.');
      return;
    }

    const sharesApplied = newAppl.lotsApplied * ipo.lotSize;
    const bidAmount = sharesApplied * ipo.priceRange.max;

    const record: ApplicationTrackingItem = {
      id: `appl-${Date.now()}`,
      applicantId: applicant.id,
      applicantName: applicant.fullName,
      maskedPan: applicant.maskedPan,
      ipoId: ipo.id,
      ipoName: ipo.name,
      ipoSymbol: ipo.symbol,
      applicationNumber: newAppl.applicationNumber,
      category: newAppl.category || applicant.category,
      lotsApplied: newAppl.lotsApplied,
      sharesApplied,
      bidAmount,
      status: 'AWAITING_RESULT',
      verificationState: 'PENDING_CHECK',
      sharesAllotted: 0,
      registrar: ipo.registrar,
      registrarDisplayName: ipo.registrarDisplayName,
      appliedAt: new Date().toISOString(),
      allotmentDate: ipo.allotmentDate,
    };

    setApplications((prev) => [record, ...prev]);

    // Increment applicant application count
    setApplicants((prev) =>
      prev.map((a) =>
        a.id === applicant.id
          ? { ...a, totalApplicationsCount: a.totalApplicationsCount + 1 }
          : a
      )
    );

    // Add a notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Tracked Application Added: ${ipo.symbol}`,
      message: `Monitoring application #${newAppl.applicationNumber} for ${applicant.fullName} (${newAppl.lotsApplied} lots, ₹${bidAmount.toLocaleString('en-IN')}).`,
      type: 'BIDDING_CLOSING',
      timestamp: new Date().toISOString(),
      isRead: false,
      ipoId: ipo.id,
      applicantId: applicant.id,
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast(
      'success',
      `Application for ${applicant.fullName} linked to ${ipo.symbol} successfully.`
    );
  };

  const deleteApplication = (id: string) => {
    const target = applications.find((a) => a.id === id);
    setApplications((prev) => prev.filter((a) => a.id !== id));
    if (target) {
      setApplicants((prev) =>
        prev.map((a) =>
          a.id === target.applicantId && a.totalApplicationsCount > 0
            ? { ...a, totalApplicationsCount: a.totalApplicationsCount - 1 }
            : a
        )
      );
    }
    showToast('info', 'Tracked application removed.');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('info', 'All notifications marked as read.');
  };

  const updateUserSettings = (updates: Partial<UserSettings>) => {
    setUserSettings((prev) => ({ ...prev, ...updates }));
    showToast('success', 'Preferences updated successfully.');
  };

  const resetToDemoDefaults = () => {
    setApplicants(INITIAL_DEMO_APPLICANTS);
    setIpos(INITIAL_DEMO_IPOS);
    setApplications(INITIAL_DEMO_APPLICATIONS);
    setNotifications(INITIAL_DEMO_NOTIFICATIONS);
    setUserSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_applicants`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_ipos`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_applications`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_notifications`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_settings`);
    showToast('info', 'Reset all state to initial demo fixtures.');
  };

  return (
    <AppContext.Provider
      value={{
        applicants,
        ipos,
        applications,
        notifications,
        userSettings,
        globalSearch,
        setGlobalSearch,
        toasts,
        showToast,
        dismissToast,
        addApplicant,
        updateApplicant,
        deleteApplicant,
        addApplication,
        deleteApplication,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        updateUserSettings,
        resetToDemoDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
