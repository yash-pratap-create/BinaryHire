import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  LayoutGrid, Users, Briefcase, BarChart3, Settings, Calendar,
  Sun, Moon, Bell, Search, ChevronDown, Plus, LogOut, User, Menu, X
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';
import { Logo } from '../UI/Logo';

interface NavItem {
  to: string;
  icon: React.FC<{ size?: number; className?: string }>;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', icon: LayoutGrid, label: 'Dashboard' },
  { to: '/candidates', icon: Users, label: 'Candidates' },
  { to: '/roles', icon: Briefcase, label: 'Roles' },
  { to: '/interviews', icon: Calendar, label: 'Interviews' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export const Navbar: React.FC = () => {
  const { toggleTheme, isDark } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isAdmin = user?.role === 'Admin';
  const canPostRole = user?.role === 'Admin' || user?.role === 'Recruiter';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 backdrop-blur-md transition-all duration-200"
      style={{
        background: isDark ? 'rgba(8,7,11,0.92)' : 'rgba(255,255,255,0.92)',
        borderBottom: isDark ? '1px solid #1a1820' : '1px solid #e7e4ef',
        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 2px 12px rgba(0,0,0,0.04)',
      }}
    >
      {/* Left: Brand Logo & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen((v) => !v)}
          className="lg:hidden p-2 rounded-xl text-[#8b899a] hover:text-[#18141f] dark:hover:text-white transition-colors"
          aria-label="Toggle mobile navigation"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div onClick={() => navigate('/dashboard')} className="cursor-pointer">
          <Logo size="md" />
        </div>
      </div>

      {/* Center: Desktop Navigation Links */}
      <nav className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-2xl" style={{ background: isDark ? '#111116' : '#f5f4fa', border: isDark ? '1px solid #1f1d27' : '1px solid #e7e4ef' }}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={clsx(
                'flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer relative',
                isActive
                  ? (isDark
                    ? 'bg-[#1e1927] text-[#e0b3ff] border border-[#372b49] shadow-sm shadow-[#c94dff]/20'
                    : 'bg-white text-[#7c3aed] border border-[#e9d5ff] shadow-sm')
                  : (isDark
                    ? 'text-[#8b899a] hover:text-[#f2f1f5] hover:bg-[#1a1820]'
                    : 'text-[#6b6875] hover:text-[#18141f] hover:bg-white/60')
              )}
            >
              <Icon size={14} className={clsx('transition-transform duration-200', isActive && 'scale-110')} />
              <span>{item.label}</span>
              {isActive && (
                <span
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                  style={{ background: 'linear-gradient(90deg,#c94dff,#5ce1e6)' }}
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Right: Quick Action, Search, Theme & Profile */}
      <div className="flex items-center gap-2.5">
        {/* Quick Role Action Button (Admin & Recruiter) */}
        {canPostRole && (
          <button
            type="button"
            onClick={() => navigate('/roles?new=true')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer hover:scale-105"
            style={{
              background: 'linear-gradient(135deg,#c94dff,#7c3aed)',
              color: '#0c0b10',
              boxShadow: '0 2px 10px rgba(201,77,255,0.3)',
            }}
          >
            <Plus size={14} /> Post Role
          </button>
        )}

        {/* Global Search */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = e.currentTarget.querySelector('input') as HTMLInputElement;
            if (input && input.value.trim()) {
              window.location.href = `/candidates?q=${encodeURIComponent(input.value.trim())}`;
            }
            input?.blur();
          }}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl w-44 lg:w-56 relative transition-all"
          style={{
            background: isDark ? '#111116' : '#ffffff',
            border: isDark ? '1px solid #1f1d27' : '1px solid #e7e4ef',
          }}
        >
          <button type="submit" className="p-0 border-0 bg-transparent cursor-pointer flex items-center shrink-0 hover:opacity-80" title="Click to search">
            <Search size={14} style={{ color: isDark ? '#c94dff' : '#9333ea' }} />
          </button>
          <input
            placeholder="Search candidates, roles..."
            className="bg-transparent outline-none text-xs w-full"
            style={{
              color: isDark ? '#f2f1f5' : '#18141f',
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                (e.target as HTMLInputElement).value = '';
                (e.target as HTMLInputElement).blur();
              }
            }}
          />
        </form>

        {/* Notifications */}
        <button
          id="notifications-btn"
          className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer hover:scale-105"
          style={{
            background: isDark ? '#111116' : '#ffffff',
            border: isDark ? '1px solid #1f1d27' : '1px solid #e7e4ef',
          }}
          aria-label="Notifications"
        >
          <Bell size={15} style={{ color: isDark ? '#8b899a' : '#6b6875' }} />
          <span
            className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: '#c94dff' }}
          />
        </button>

        {/* Light / Dark Mode Toggle */}
        <button
          id="theme-toggle"
          onClick={toggleTheme}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-105"
          style={{
            background: isDark ? '#111116' : '#ffffff',
            border: isDark ? '1px solid #1f1d27' : '1px solid #e7e4ef',
            boxShadow: isDark ? '0 0 12px rgba(201,77,255,0.2)' : '0 2px 8px rgba(0,0,0,0.08)',
          }}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun size={16} className="text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
          ) : (
            <Moon size={16} className="text-indigo-600 drop-shadow-[0_0_6px_rgba(79,70,229,0.3)]" />
          )}
        </button>

        {/* User Profile & Dropdown Menu */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen((v) => !v)}
              className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl cursor-pointer transition-all hover:scale-105"
              style={{
                background: isDark ? '#111116' : '#ffffff',
                border: isDark ? '1px solid #1f1d27' : '1px solid #e7e4ef',
              }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: 'linear-gradient(135deg,#c94dff,#7c3aed)',
                  color: '#0c0b10',
                }}
              >
                {getInitials(user.name)}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-none">
                <span className="text-xs font-semibold" style={{ color: isDark ? '#f2f1f5' : '#18141f' }}>
                  {user.name.split(' ')[0]}
                </span>
                <span className="text-[9px] font-medium text-[#c94dff] mt-0.5">
                  {user.role}
                </span>
              </div>
              <ChevronDown size={13} className={clsx('transition-transform duration-200', profileDropdownOpen && 'rotate-180')} style={{ color: isDark ? '#8b899a' : '#6b6875' }} />
            </button>

            {/* Profile Dropdown */}
            {profileDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-52 rounded-2xl p-2 shadow-2xl z-50 animate-slide-up"
                style={{
                  background: isDark ? '#111116' : '#ffffff',
                  border: isDark ? '1px solid #1f1d27' : '1px solid #e7e4ef',
                }}
              >
                <div className="px-3 py-2 border-b mb-1" style={{ borderColor: isDark ? '#1f1d27' : '#eeecf5' }}>
                  <p className="text-xs font-semibold" style={{ color: isDark ? '#f2f1f5' : '#18141f' }}>{user.name}</p>
                  <p className="text-[11px] truncate" style={{ color: isDark ? '#8b899a' : '#6b6875' }}>{user.email}</p>
                </div>

                <button
                  onClick={() => { setProfileDropdownOpen(false); navigate('/profile'); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors"
                  style={{
                    color: isDark ? '#f2f1f5' : '#18141f',
                  }}
                >
                  <User size={14} className="text-[#c94dff]" />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => { setProfileDropdownOpen(false); navigate('/settings'); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors"
                  style={{
                    color: isDark ? '#f2f1f5' : '#18141f',
                  }}
                >
                  <Settings size={14} className="text-[#c94dff]" />
                  <span>Settings</span>
                </button>

                <button
                  onClick={() => { setProfileDropdownOpen(false); handleLogout(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer text-red-500 hover:bg-red-500/10 transition-colors mt-1"
                >
                  <LogOut size={14} />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 z-40 bg-black/75 backdrop-blur-md lg:hidden flex flex-col p-4 space-y-4 animate-fade-in"
          style={{ background: isDark ? 'rgba(8,7,11,0.95)' : 'rgba(255,255,255,0.95)' }}
        >
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.to);
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors',
                    isActive
                      ? (isDark ? 'bg-[#1e1927] text-[#e0b3ff]' : 'bg-[#f3ecfd] text-[#7c3aed]')
                      : (isDark ? 'text-[#8b899a]' : 'text-[#6b6875]')
                  )}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          <div className="pt-2 border-t" style={{ borderColor: isDark ? '#1f1d27' : '#e7e4ef' }}>
            <button
              onClick={() => { setMobileMenuOpen(false); navigate(isAdmin ? '/roles?new=true' : '/roles'); }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
              style={{ background: 'linear-gradient(135deg,#c94dff,#7c3aed)', color: '#0c0b10' }}
            >
              {isAdmin ? <><Plus size={16} /> Post New Role</> : <>View Roles</>}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
