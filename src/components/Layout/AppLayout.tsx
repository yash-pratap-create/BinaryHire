import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from './Navbar';
import { BinaryWatermark } from '../UI/BinaryWatermark';
import { useTheme } from '../../context/ThemeContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
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
      className="flex flex-col h-screen overflow-hidden transition-colors duration-200"
      style={{
        background: isDark ? '#08070b' : '#f5f4fa',
        color: isDark ? '#f2f1f5' : '#18141f',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Top Header Navigation Bar */}
      <Navbar />

      {/* Main Content Area */}
      <main
        className="flex-1 overflow-y-auto p-4 sm:p-6 animate-fade-in relative transition-colors duration-200"
        style={{ background: isDark ? '#08070b' : '#f5f4fa' }}
      >
        <BinaryWatermark />
        <div className="relative z-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
