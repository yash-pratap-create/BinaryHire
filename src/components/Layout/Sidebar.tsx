import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  LayoutGrid, Users, Briefcase, BarChart3, Settings,
  User, LogOut, X, Zap, Plus,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
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
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <style>{`
        @keyframes navGlow {
          0%, 100% { box-shadow: 0 0 0 1px rgba(201,77,255,0.25), 0 0 16px 2px rgba(201,77,255,0.18); }
          50% { box-shadow: 0 0 0 1px rgba(201,77,255,0.4), 0 0 24px 6px rgba(201,77,255,0.32); }
        }
        @keyframes dotPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.6); opacity: 0.4; }
        }
        @keyframes shimmerBorder {
          0% { background-position: 0% 0%; }
          100% { background-position: 0% 200%; }
        }
        .nav-item { transition: all 0.28s cubic-bezier(.4,0,.2,1); position: relative; }
        .nav-item:hover { transform: translateX(3px); }
        .nav-item .nav-icon { transition: all 0.28s cubic-bezier(.4,0,.2,1); }
        .nav-item:hover .nav-icon { transform: scale(1.12) rotate(-4deg); }
        .nav-item-active { animation: navGlow 2.6s ease-in-out infinite; }
        .nav-item-active::before {
          content: "";
          position: absolute;
          left: -12px; top: 8px; bottom: 8px;
          width: 3px;
          border-radius: 4px;
          background: linear-gradient(180deg, #c94dff, #5ce1e6, #c94dff);
          background-size: 100% 200%;
          animation: shimmerBorder 2.4s linear infinite;
        }
        .nav-dot { animation: dotPulse 1.8s ease-in-out infinite; }
      `}</style>

      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={clsx(
          'fixed top-0 left-0 z-30 h-full w-60 shrink-0 flex flex-col justify-between py-6 px-4',
          'transition-all duration-300 ease-in-out',
          'lg:translate-x-0 lg:static lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{
          background: isDark ? '#0c0b10' : '#ffffff',
          borderRight: isDark ? '1px solid #1a1820' : '1px solid #e7e4ef',
        }}
      >
        <div>
          {/* Logo */}
          <div className="flex items-center justify-between px-2 mb-8">
            <Logo size="sm" />
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-[#8b899a] hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => onClose()}
                  className={({ isActive }) =>
                    clsx(
                      'nav-item flex items-center gap-3 pl-3 pr-2.5 py-2.5 rounded-xl text-sm font-medium',
                      isActive && 'nav-item-active'
                    )
                  }
                  style={({ isActive }) => ({
                    background: isActive
                      ? 'linear-gradient(90deg, rgba(201,77,255,0.16), rgba(92,225,230,0.05))'
                      : 'transparent',
                    color: isActive ? (isDark ? '#e9c9ff' : '#6d28d9') : (isDark ? '#8b899a' : '#6b6875'),
                  })}
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className="nav-icon w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          background: isActive ? 'rgba(201,77,255,0.18)' : 'transparent',
                          color: isActive ? (isDark ? '#c94dff' : '#9333ea') : (isDark ? '#8b899a' : '#6b6875'),
                        }}
                      >
                        <Icon size={15} />
                      </span>
                      <span className="flex-1 text-left">{item.label}</span>
                      {isActive && (
                        <span
                          className="nav-dot w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: '#5ce1e6' }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom card & user profile */}
        <div className="space-y-4">
          <div
            className="rounded-xl p-4 relative overflow-hidden"
            style={{
              background: isDark ? '#111116' : '#ffffff',
              border: isDark ? '1px solid #1f1d27' : '1px solid #e7e4ef',
            }}
          >
            <p className="text-xs font-medium mb-1" style={{ color: isDark ? '#f2f1f5' : '#18141f' }}>
              Open roles
            </p>
            <p className="text-xs mb-3" style={{ color: isDark ? '#8b899a' : '#6b6875' }}>
              12 active across 4 teams
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
                if (user?.role === 'Admin') {
                  navigate('/roles?new=true');
                } else {
                  navigate('/roles');
                }
              }}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg transition-all hover:opacity-90 cursor-pointer relative z-10"
              style={{ background: 'linear-gradient(135deg,#c94dff,#7c3aed)', color: '#0c0b10' }}
              id="sidebar-roles-action-btn"
            >
              {user?.role === 'Admin' ? (
                <><Plus size={13} /> New role</>
              ) : (
                <>View roles</>
              )}
            </button>
          </div>

          {user && (
            <div
              className="flex items-center justify-between p-2.5 rounded-xl"
              style={{
                background: isDark ? '#111116' : '#ffffff',
                border: isDark ? '1px solid #1f1d27' : '1px solid #e7e4ef',
              }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0"
                  style={{ background: 'rgba(201,77,255,0.15)', color: '#e0b3ff' }}
                >
                  {getInitials(user.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium truncate" style={{ color: '#f2f1f5' }}>
                    {user.name}
                  </p>
                  <p className="text-[10px] truncate" style={{ color: '#8b899a' }}>
                    {user.role}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="Sign out"
                className="p-1.5 rounded-lg text-red-400 hover:bg-red-950/30 transition-colors"
              >
                <LogOut size={15} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
