import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Plus, Filter, Trash2, Edit2, Users, ChevronDown, MapPin, Clock } from 'lucide-react';
import { clsx } from 'clsx';
import { roleService } from '../../services/roleService';
import type { Role } from '../../types';
import { formatDate } from '../../utils/helpers';
import { useSearch } from '../../hooks/useSearch';
import { usePagination } from '../../hooks/usePagination';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/UI/Button';
import { Modal } from '../../components/UI/Modal';
import { Pagination } from '../../components/UI/Pagination';
import { PageLoader } from '../../components/UI/Spinner';
import { RoleForm } from './RoleForm';

const STATUS_OPTIONS = ['Open', 'Closed', 'Paused'];

export const RolesPage: React.FC = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const [searchParams, setSearchParams] = useSearchParams();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (searchParams.get('new') === 'true' && isAdmin) {
      setEditRole(null);
      setShowForm(true);
      setSearchParams({});
    }
  }, [searchParams, isAdmin, setSearchParams]);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await roleService.getAll();
      setRoles(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRoles(); }, [fetchRoles]);

  const { query, setQuery, filtered: searchFiltered } = useSearch<Role>(
    roles,
    (r, q) =>
      r.title.toLowerCase().includes(q) ||
      r.department.toLowerCase().includes(q) ||
      r.location.toLowerCase().includes(q)
  );

  const statusFiltered = statusFilter === 'All'
    ? searchFiltered
    : searchFiltered.filter((r) => r.status === statusFilter);

  const pagination = usePagination(statusFiltered, 9);

  const handleDelete = async () => {
    if (!deleteId) return;
    await roleService.delete(deleteId);
    setDeleteId(null);
    fetchRoles();
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditRole(null);
    fetchRoles();
  };

  const roleStatusStylesDark: Record<string, { bg: string; text: string }> = {
    Open: { bg: '#1c3a2e', text: '#5fe0a8' },
    Closed: { bg: '#3a1f1f', text: '#ff8b8b' },
    Paused: { bg: '#3a341f', text: '#ffe07e' },
  };

  const roleStatusStylesLight: Record<string, { bg: string; text: string }> = {
    Open: { bg: '#e3f8ef', text: '#0f9d6c' },
    Closed: { bg: '#fef2f2', text: '#dc2626' },
    Paused: { bg: '#fffbe6', text: '#d97706' },
  };

  const roleStatusStyles = isDark ? roleStatusStylesDark : roleStatusStylesLight;

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: isDark ? '#f2f1f5' : '#18141f' }}
          >
            Roles & Positions
          </h2>
          <p className="text-sm mt-1" style={{ color: isDark ? '#8b899a' : '#6b6875' }}>
            {roles.filter((r) => r.status === 'Open').length} open positions active
          </p>
        </div>
        {isAdmin ? (
          <Button
            variant="primary"
            leftIcon={<Plus size={16} />}
            onClick={() => { setEditRole(null); setShowForm(true); }}
            id="add-role-btn"
          >
            Post New Role
          </Button>
        ) : (
          <span className="text-xs px-3.5 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-500 font-medium">
            🔒 Role Creation Restricted to Admin
          </span>
        )}
      </div>

      {/* Search + Filters */}
      <div
        className="rounded-2xl p-4 space-y-3"
        style={{
          background: isDark ? '#111116' : '#ffffff',
          border: isDark ? '1px solid #1f1d27' : '1px solid #e7e4ef',
        }}
      >
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: isDark ? '#8b899a' : '#6b6875' }} />
            <input
              id="role-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search roles by title, department, location..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{
                background: isDark ? '#08070b' : '#ffffff',
                border: isDark ? '1px solid #24212c' : '1px solid #e7e4ef',
                color: isDark ? '#f2f1f5' : '#18141f',
              }}
            />
          </div>
          <Button
            variant="outline"
            size="md"
            leftIcon={<Filter size={15} />}
            rightIcon={<ChevronDown size={14} className={clsx('transition-transform', showFilters && 'rotate-180')} />}
            onClick={() => setShowFilters((v) => !v)}
          >
            Filter
          </Button>
        </div>
        {showFilters && (
          <div className="flex flex-wrap gap-2 pt-1 animate-fade-in">
            {['All', ...STATUS_OPTIONS].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={clsx(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer',
                  statusFilter === s
                    ? (isDark ? 'bg-[#c94dff] text-[#0c0b10] font-semibold' : 'bg-[#9333ea] text-white font-semibold')
                    : (isDark ? 'bg-[#1a1820] text-[#8b899a] hover:bg-[#24212c] hover:text-[#f2f1f5]' : 'bg-[#f3f0f9] text-[#6b6875] hover:bg-[#e9e4f5] hover:text-[#18141f]')
                )}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Role Cards Grid */}
      {loading ? (
        <PageLoader />
      ) : statusFiltered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#8b899a]">
          <Search size={40} className="mb-3 opacity-30" />
          <p className="font-medium" style={{ color: isDark ? '#f2f1f5' : '#18141f' }}>No roles found</p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pagination.paginatedItems.map((role) => {
              const statusStyle = roleStatusStyles[role.status] || { bg: '#241f2e', text: '#c9a6ff' };
              return (
                <div
                  key={role.id}
                  className="rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 group"
                  style={{
                    background: isDark ? '#111116' : '#ffffff',
                    border: isDark ? '1px solid #1f1d27' : '1px solid #e7e4ef',
                  }}
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0 pr-2">
                        <h3
                          className="font-semibold text-sm leading-snug"
                          style={{ fontFamily: "'Space Grotesk', sans-serif", color: isDark ? '#f2f1f5' : '#18141f' }}
                        >
                          {role.title}
                        </h3>
                        <p className="text-xs mt-0.5" style={{ color: isDark ? '#8b899a' : '#6b6875' }}>{role.department}</p>
                      </div>
                      <span
                        className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                        style={{ background: statusStyle.bg, color: statusStyle.text }}
                      >
                        {role.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 mb-3 text-xs" style={{ color: isDark ? '#8b899a' : '#6b6875' }}>
                      <div className="flex items-center gap-2">
                        <MapPin size={12} style={{ color: isDark ? '#c94dff' : '#9333ea' }} />{role.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={12} style={{ color: isDark ? '#c94dff' : '#9333ea' }} />Deadline: {formatDate(role.deadline)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={12} style={{ color: isDark ? '#c94dff' : '#9333ea' }} />{role.applicants} applicants
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className="px-2.5 py-0.5 rounded-md text-xs font-medium border"
                        style={{
                          background: isDark ? '#1e1a29' : '#f3ecfd',
                          color: isDark ? '#e0b3ff' : '#7c3aed',
                          borderColor: isDark ? '#2a2733' : '#e9d5ff',
                        }}
                      >
                        {role.type}
                      </span>
                      <span className="text-xs" style={{ color: isDark ? '#8b899a' : '#6b6875' }}>{role.experience}</span>
                    </div>
                  </div>

                  <div>
                    <p
                      className="text-xs font-semibold mb-3"
                      style={{ color: isDark ? '#5fe0a8' : '#0f9d6c', fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {role.salary}
                    </p>

                    <div className="flex gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      {isAdmin ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Edit2 size={13} />}
                            className="flex-1 text-xs"
                            onClick={() => { setEditRole(role); setShowForm(true); }}
                            title="Edit role (Admin only)"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(role.id)}
                            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 px-2"
                            title="Delete role (Admin only)"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </>
                      ) : (
                        <span className="text-[11px] py-1 px-2.5 rounded-lg bg-gray-500/10 text-gray-400 font-medium">
                          🔒 Read-Only Position
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="pt-2">
            <Pagination {...pagination} onPageChange={pagination.goToPage} />
          </div>
        </>
      )}

      {/* Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditRole(null); }}
        title={editRole ? 'Edit Role' : 'Post New Role'}
        size="lg"
      >
        <RoleForm
          role={editRole}
          onSaved={handleSaved}
          onCancel={() => { setShowForm(false); setEditRole(null); }}
        />
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Role" size="sm">
        <p className="text-sm mb-5" style={{ color: isDark ? '#8b899a' : '#6b6875' }}>
          Are you sure you want to delete this role? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" className="flex-1" onClick={handleDelete} id="confirm-delete-role">Delete</Button>
        </div>
      </Modal>
    </div>
  );
};
