import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Sun, Moon, Bell, Search, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';

const ROUTE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/candidates': 'Candidates',
  '/roles': 'Roles',
  '/analytics': 'Analytics',
  '/profile': 'Profile',
  '/settings': 'Settings',
};

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { toggleTheme, isDark } = useTheme();
  const { user } = useAuth();
  const location = useLocation();

  const title = ROUTE_TITLES[location.pathname] ??
    Object.entries(ROUTE_TITLES).find(([key]) => location.pathname.startsWith(key))?.[1] ??
    'BinaryHire';

  return (
    <header
      className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 sm:px-6 backdrop-blur-md transition-all duration-200"
      style={{
        background: isDark ? 'rgba(8,7,11,0.85)' : 'rgba(255,255,255,0.85)',
        borderBottom: isDark ? '1px solid #1a1820' : '1px solid #e7e4ef',
      }}
    >
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-3">
        <button
          id="sidebar-toggle"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-[#8b899a] hover:text-[#18141f] dark:hover:text-white transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1
            className="text-lg font-semibold"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: isDark ? '#f2f1f5' : '#18141f',
            }}
          >
            {title}
          </h1>
        </div>
      </div>

      {/* Right: Search, Notifications, Theme, User */}
      <div className="flex items-center gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = e.currentTarget.querySelector('input') as HTMLInputElement;
            if (input && input.value.trim()) {
              window.location.href = `/candidates?q=${encodeURIComponent(input.value.trim())}`;
            }
            input?.blur();
          }}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl w-52 md:w-72 relative"
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
            className="bg-transparent outline-none text-xs w-full pr-16"
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
          <button
            type="submit"
            className="absolute right-1.5 text-[10px] font-semibold px-2 py-0.5 rounded transition-all cursor-pointer hover:scale-105"
            style={{
              background: isDark ? '#1a1820' : '#f3ecfd',
              color: isDark ? '#c94dff' : '#7c3aed',
              border: isDark ? '1px solid #2a2733' : '1px solid #e9d5ff',
            }}
            title="Click or press Enter to search"
          >
            Search ↵
          </button>
        </form>

        {/* Notifications */}
        <button
          id="notifications-btn"
          className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
          style={{
            background: isDark ? '#111116' : '#ffffff',
            border: isDark ? '1px solid #1f1d27' : '1px solid #e7e4ef',
          }}
          aria-label="Notifications"
        >
          <Bell size={15} style={{ color: isDark ? '#8b899a' : '#6b6875' }} />
          <span
            className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
            style={{ background: '#c94dff' }}
          />
        </button>

        {/* Light / Dark mode toggle */}
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

        {/* User avatar */}
        {user && (
          <div
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl cursor-pointer"
            style={{
              background: isDark ? '#111116' : '#ffffff',
              border: isDark ? '1px solid #1f1d27' : '1px solid #e7e4ef',
            }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium"
              style={{
                background: 'rgba(201,77,255,0.15)',
                color: isDark ? '#e0b3ff' : '#7c3aed',
              }}
            >
              {getInitials(user.name)}
            </div>
            <span
              className="hidden md:inline text-xs font-medium leading-none"
              style={{ color: isDark ? '#f2f1f5' : '#18141f' }}
            >
              {user.name.split(' ')[0]}
            </span>
            <ChevronDown size={13} style={{ color: isDark ? '#8b899a' : '#6b6875' }} />
          </div>
        )}
      </div>
    </header>
  );
};
