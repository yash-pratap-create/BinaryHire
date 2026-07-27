import React, { useState } from 'react';
import { Moon, Sun, Bell, Shield, Trash2, Lock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/UI/Button';
import { clsx } from 'clsx';

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
  isDark: boolean;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, id, isDark }) => (
  <button
    id={id}
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={clsx(
      'relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-200 focus:outline-none cursor-pointer',
      checked ? (isDark ? 'bg-[#c94dff]' : 'bg-[#9333ea]') : (isDark ? 'bg-[#1a1820]' : 'bg-[#e7e4ef]')
    )}
  >
    <span className={clsx(
      'inline-block w-4 h-4 rounded-full shadow-sm transition-transform duration-200',
      checked ? 'translate-x-6 bg-white' : 'translate-x-1 bg-[#8b899a]'
    )} />
  </button>
);

export const SettingsPage: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const [notifications, setNotifications] = useState({ email: true, browser: false, weekly: true });
  const [privacy, setPrivacy] = useState({ analytics: true, dataSharing: false });

  const sectionStyle = {
    background: isDark ? '#111116' : '#ffffff',
    border: isDark ? '1px solid #1f1d27' : '1px solid #e7e4ef',
  };

  const headerBorderStyle = {
    borderBottom: isDark ? '1px solid #1a1820' : '1px solid #eeecf5',
  };

  const itemBorderStyle = {
    borderColor: isDark ? '#1a1820' : '#eeecf5',
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: isDark ? '#f2f1f5' : '#18141f' }}
          >
            Platform Settings
          </h2>
          <p className="text-sm mt-1" style={{ color: isDark ? '#8b899a' : '#6b6875' }}>
            Manage system preferences & notifications
          </p>
        </div>
        {user && (
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"
            style={{
              background: isAdmin ? 'rgba(201,77,255,0.15)' : 'rgba(92,225,230,0.15)',
              color: isAdmin ? (isDark ? '#e0b3ff' : '#7c3aed') : (isDark ? '#5ce1e6' : '#0284c7'),
              border: isAdmin ? '1px solid rgba(201,77,255,0.3)' : '1px solid rgba(92,225,230,0.3)',
            }}
          >
            <Shield size={13} /> {user.role} Permissions
          </span>
        )}
      </div>

      {/* Appearance */}
      <section className="rounded-2xl overflow-hidden" style={sectionStyle}>
        <div className="px-5 py-4 flex items-center gap-2" style={headerBorderStyle}>
          <div className="p-1.5 rounded-lg" style={{ background: 'rgba(201,77,255,0.1)', color: isDark ? '#c94dff' : '#9333ea' }}>
            {isDark ? <Moon size={16} /> : <Sun size={16} />}
          </div>
          <h3 className="font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: isDark ? '#f2f1f5' : '#18141f' }}>
            Appearance & Theme
          </h3>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: isDark ? '#f2f1f5' : '#18141f' }}>
                {isDark ? 'Cyberpunk Dark Mode' : 'Clean Light Mode'}
              </p>
              <p className="text-xs mt-0.5" style={{ color: isDark ? '#8b899a' : '#6b6875' }}>
                {isDark ? 'High-contrast violet dark aesthetic active' : 'Crisp SRMIST light palette active'}
              </p>
            </div>
            <Toggle id="dark-mode-toggle" checked={isDark} onChange={toggleTheme} isDark={isDark} />
          </div>
        </div>

        {/* Theme preview */}
        <div className="px-5 pb-5 grid grid-cols-2 gap-3">
          {[
            { label: 'Clean Light Theme', active: !isDark },
            { label: 'SRMIST Cyber Violet (Dark)', active: isDark },
          ].map((t) => (
            <div
              key={t.label}
              onClick={toggleTheme}
              className={clsx(
                'rounded-xl p-3 text-left transition-all border cursor-pointer',
                t.active
                  ? (isDark ? 'border-[#c94dff] bg-[#18161e]' : 'border-[#9333ea] bg-[#f3ecfd]')
                  : (isDark ? 'border-[#1f1d27] bg-[#0c0b10]' : 'border-[#e7e4ef] bg-[#ffffff]')
              )}
            >
              <div className="space-y-1.5">
                <div className={clsx('h-2 w-16 rounded-full', t.active ? (isDark ? 'bg-[#c94dff]' : 'bg-[#9333ea]') : 'bg-gray-300 dark:bg-[#24212c]')} />
                <div className={clsx('h-1.5 w-12 rounded-full', t.active ? (isDark ? 'bg-[#5ce1e6]' : 'bg-[#7c3aed]') : 'bg-gray-200 dark:bg-[#1a1820]')} />
                <div className={clsx('h-1.5 w-10 rounded-full', t.active ? (isDark ? 'bg-[#7c3aed]' : 'bg-[#c94dff]') : 'bg-gray-200 dark:bg-[#1a1820]')} />
              </div>
              <p className="text-xs font-medium mt-3" style={{ color: isDark ? '#f2f1f5' : '#18141f' }}>{t.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Notifications */}
      <section className="rounded-2xl overflow-hidden" style={sectionStyle}>
        <div className="px-5 py-4 flex items-center gap-2" style={headerBorderStyle}>
          <div className="p-1.5 rounded-lg" style={{ background: 'rgba(255,224,126,0.15)', color: '#d97706' }}>
            <Bell size={16} />
          </div>
          <h3 className="font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: isDark ? '#f2f1f5' : '#18141f' }}>
            Notifications
          </h3>
        </div>
        <div className="divide-y" style={itemBorderStyle}>
          {[
            { key: 'email' as const, label: 'Email Notifications', desc: 'Receive candidate application alerts via email' },
            { key: 'browser' as const, label: 'Browser Push Alerts', desc: 'Instant desktop notifications on new applications' },
            { key: 'weekly' as const, label: 'Weekly Hiring Digest', desc: 'Summary report sent every Monday' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between px-5 py-3.5" style={itemBorderStyle}>
              <div>
                <p className="text-sm font-medium" style={{ color: isDark ? '#f2f1f5' : '#18141f' }}>{item.label}</p>
                <p className="text-xs mt-0.5" style={{ color: isDark ? '#8b899a' : '#6b6875' }}>{item.desc}</p>
              </div>
              <Toggle
                id={`notif-${item.key}`}
                checked={notifications[item.key]}
                onChange={(v) => setNotifications((n) => ({ ...n, [item.key]: v }))}
                isDark={isDark}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Privacy */}
      <section className="rounded-2xl overflow-hidden" style={sectionStyle}>
        <div className="px-5 py-4 flex items-center gap-2" style={headerBorderStyle}>
          <div className="p-1.5 rounded-lg" style={{ background: 'rgba(92,225,230,0.1)', color: '#0284c7' }}>
            <Shield size={16} />
          </div>
          <h3 className="font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: isDark ? '#f2f1f5' : '#18141f' }}>
            Privacy & Security
          </h3>
        </div>
        <div className="divide-y" style={itemBorderStyle}>
          {[
            { key: 'analytics' as const, label: 'Candidate Match Scoring', desc: 'Enable automated resume scoring algorithms' },
            { key: 'dataSharing' as const, label: 'Anonymized Reporting', desc: 'Share aggregated hiring metrics with HR partners' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between px-5 py-3.5" style={itemBorderStyle}>
              <div>
                <p className="text-sm font-medium" style={{ color: isDark ? '#f2f1f5' : '#18141f' }}>{item.label}</p>
                <p className="text-xs mt-0.5" style={{ color: isDark ? '#8b899a' : '#6b6875' }}>{item.desc}</p>
              </div>
              <Toggle
                id={`privacy-${item.key}`}
                checked={privacy[item.key]}
                onChange={(v) => setPrivacy((p) => ({ ...p, [item.key]: v }))}
                isDark={isDark}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Danger zone (Admin only) */}
      <section
        className="rounded-2xl overflow-hidden"
        style={{
          background: isDark ? '#111116' : '#ffffff',
          border: isDark ? '1px solid #3a1f1f' : '1px solid #fecaca',
          opacity: isAdmin ? 1 : 0.75,
        }}
      >
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ borderBottom: isDark ? '1px solid #3a1f1f' : '1px solid #fee2e2' }}
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400">
              <Trash2 size={16} />
            </div>
            <h3 className="font-semibold text-red-600 dark:text-red-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Danger Zone (Admin Only)
            </h3>
          </div>
          {!isAdmin && (
            <span className="text-xs font-medium text-amber-500 flex items-center gap-1">
              <Lock size={12} /> Restricted to Admin
            </span>
          )}
        </div>
        <div className="p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium" style={{ color: isDark ? '#f2f1f5' : '#18141f' }}>Reset Candidate Database</p>
            <p className="text-xs mt-0.5" style={{ color: isDark ? '#8b899a' : '#6b6875' }}>
              {isAdmin ? 'Reset all records back to seed data' : 'Administrative privilege required to reset platform database'}
            </p>
          </div>
          <Button variant="danger" size="sm" id="clear-data-btn" disabled={!isAdmin}>
            {isAdmin ? 'Reset Data' : 'Admin Required'}
          </Button>
        </div>
      </section>
    </div>
  );
};
