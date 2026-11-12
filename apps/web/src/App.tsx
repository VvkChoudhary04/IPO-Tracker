import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { IposPage } from './pages/IposPage';
import { ApplicantsPage } from './pages/ApplicantsPage';
import { AllotmentResultsPage } from './pages/AllotmentResultsPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="applicants" element={<ApplicantsPage />} />
              <Route path="ipos" element={<IposPage />} />
              <Route path="allotments" element={<AllotmentResultsPage />} />
              <Route path="applications" element={<ApplicationsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
};

export default App;
