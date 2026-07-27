import React, { useState } from 'react';
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
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main
          className="flex-1 overflow-y-auto p-4 sm:p-6 animate-fade-in relative transition-colors duration-200"
          style={{ background: isDark ? '#08070b' : '#f5f4fa' }}
        >
          <BinaryWatermark />
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
