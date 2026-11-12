import React, { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { fetchHealth } from '../../services/api';
import { HealthResponse } from '@ipotrack/shared';

export const AppLayout: React.FC = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [apiStatus, setApiStatus] = useState<'ONLINE' | 'OFFLINE' | 'CHECKING'>('CHECKING');
  const [isRefreshing, setIsRefreshing] = useState(false);

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
    // Poll API status every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, [checkStatus]);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar apiStatus={apiStatus} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onRefreshHealth={checkStatus} isRefreshing={isRefreshing} />
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <Outlet context={{ health, apiStatus, checkStatus }} />
          </div>
        </main>
      </div>
    </div>
  );
};
