import React, { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer } from '../common/ToastContainer';
import { DemoBadge } from '../common/DemoBadge';
import { fetchHealth } from '../../services/api';
import { HealthResponse } from '@ipotrack/shared';

export const AppLayout: React.FC = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [apiStatus, setApiStatus] = useState<'ONLINE' | 'OFFLINE' | 'CHECKING'>('CHECKING');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const checkStatus = useCallback(async () => {
    setIsRefreshing(true);
    const data = await fetchHealth();
    if (data && data.status === 'ok') {
      setHealth(data);
      setApiStatus('ONLINE');
    } else {
      setHealth(null);
      setApiStatus('OFFLINE');
    }
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, [checkStatus]);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar
        apiStatus={apiStatus}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          onRefreshHealth={checkStatus}
          isRefreshing={isRefreshing}
          onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
        />

        {/* Global Demo Notice Top Banner */}
        <div className="px-4 sm:px-6 lg:px-8 pt-4">
          <DemoBadge />
        </div>

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <Outlet context={{ health, apiStatus, checkStatus }} />
          </div>
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};
