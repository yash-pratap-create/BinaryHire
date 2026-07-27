import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { BinaryWatermark } from '../UI/BinaryWatermark';
import { useTheme } from '../../context/ThemeContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Do not navigate if an interactive modal dialog is open
        const hasModal = document.querySelector('[role="dialog"]') !== null;
        if (hasModal) return;

        // Do not navigate if an input or textarea is currently focused
        const activeEl = document.activeElement;
        const isInput = activeEl && ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeEl.tagName);
        if (isInput) return;

        // Navigate to dashboard if on any other page
        if (location.pathname !== '/dashboard') {
          navigate('/dashboard');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [location.pathname, navigate]);

  const isNotDashboard = location.pathname !== '/dashboard';

  return (
    <div
      className="flex h-screen overflow-hidden transition-colors duration-200"
      style={{
        background: isDark ? '#08070b' : '#f5f4fa',
        color: isDark ? '#f2f1f5' : '#18141f',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main
          className="flex-1 overflow-y-auto p-4 sm:p-6 animate-fade-in relative transition-colors duration-200"
          style={{ background: isDark ? '#08070b' : '#f5f4fa' }}
        >
          <BinaryWatermark />
          <div className="relative z-10">
            {children}
          </div>

          {/* Esc to Dashboard floating badge button */}
          {isNotDashboard && (
            <button
              onClick={() => navigate('/dashboard')}
              className="fixed bottom-5 right-5 z-20 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold shadow-lg transition-all duration-200 cursor-pointer hover:scale-105"
              style={{
                background: isDark ? '#111116' : '#ffffff',
                border: isDark ? '1px solid #24212c' : '1px solid #e7e4ef',
                color: isDark ? '#c94dff' : '#9333ea',
                boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 16px rgba(0,0,0,0.08)',
              }}
              title="Click or press Esc key on keyboard to return to Dashboard"
            >
              <ArrowLeft size={14} />
              <span>Back to Dashboard</span>
              <kbd
                className="px-1.5 py-0.5 rounded text-[10px] uppercase font-mono border"
                style={{
                  background: isDark ? '#1a1820' : '#f3ecfd',
                  borderColor: isDark ? '#2a2733' : '#e9d5ff',
                  color: isDark ? '#e0b3ff' : '#7c3aed',
                }}
              >
                Esc
              </kbd>
            </button>
          )}
        </main>
      </div>
    </div>
  );
};
