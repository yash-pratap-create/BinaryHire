import React, { useEffect, useState, useCallback } from 'react';
import {
  Search, Plus, Filter, Trash2, Edit2, Eye,
  Download, ChevronDown, Calendar,
} from 'lucide-react';
import { clsx } from 'clsx';
import { candidateService } from '../../services/candidateService';
import { aiService } from '../../services/aiService';
import type { Candidate, CandidateStatus } from '../../types';
import { getInitials, formatDate, downloadCandidateResume } from '../../utils/helpers';
import { useSearch } from '../../hooks/useSearch';
import { usePagination } from '../../hooks/usePagination';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/UI/Button';
import { Modal } from '../../components/UI/Modal';
import { Pagination } from '../../components/UI/Pagination';
import { PageLoader } from '../../components/UI/Spinner';
import { CandidateForm } from './CandidateForm';
import { CandidateDetail } from './CandidateDetail';
import { ScheduleInterviewModal } from '../../components/Interviews/ScheduleInterviewModal';

const STATUS_OPTIONS: CandidateStatus[] = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];

const stageColorDark: Record<string, { bg: string; text: string }> = {
  Applied: { bg: '#241f2e', text: '#c9a6ff' },
  Screening: { bg: '#1e2a3a', text: '#7ec8ff' },
  Interview: { bg: '#3a2440', text: '#e29bff' },
  Offer: { bg: '#2a3a24', text: '#a8e07e' },
  Hired: { bg: '#1c3a2e', text: '#5fe0a8' },
  Rejected: { bg: '#3a1f1f', text: '#ff8b8b' },
};

const stageColorLight: Record<string, { bg: string; text: string }> = {
  Applied: { bg: '#f3ecfd', text: '#7c3aed' },
  Screening: { bg: '#e6f2fc', text: '#1d6fb8' },
  Interview: { bg: '#fbeafe', text: '#a21caf' },
  Offer: { bg: '#eef8e6', text: '#4d7c0f' },
  Hired: { bg: '#e3f8ef', text: '#0f9d6c' },
  Rejected: { bg: '#fef2f2', text: '#dc2626' },
};

function ScoreRing({ score, isDark }: { score: number; isDark: boolean }) {
  const r = 14;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
      <svg width="36" height="36" className="-rotate-90">
        <circle cx="18" cy="18" r={r} stroke={isDark ? "#26232f" : "#e7e4ef"} strokeWidth="2.5" fill="none" />
        <circle
          cx="18"
          cy="18"
          r={r}
          stroke="url(#violetGradList)"
          strokeWidth="2.5"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="violetGradList" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c94dff" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
      </svg>
      <span
        className="absolute text-[9px] font-medium"
        style={{ fontFamily: "'JetBrains Mono', monospace", color: isDark ? '#e8e6ef' : '#18141f' }}
      >
        {score}
      </span>
    </div>
  );
}

export const CandidatesPage: React.FC = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showForm, setShowForm] = useState(false);
  const [editCandidate, setEditCandidate] = useState<Candidate | null>(null);
  const [viewCandidate, setViewCandidate] = useState<Candidate | null>(null);
  const [scheduleCandidate, setScheduleCandidate] = useState<Candidate | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await candidateService.getAll();
      setCandidates(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCandidates(); }, [fetchCandidates]);

  const { query, setQuery, filtered: searchFiltered } = useSearch<Candidate>(
    candidates,
    (c, q) =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      c.department.toLowerCase().includes(q)
  );

  const statusFiltered = statusFilter === 'All'
    ? searchFiltered
    : searchFiltered.filter((c) => c.status === statusFilter);

  const pagination = usePagination(statusFiltered, 8);

  const handleDelete = async () => {
    if (!deleteId) return;
    await candidateService.delete(deleteId);
    setDeleteId(null);
    fetchCandidates();
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditCandidate(null);
    fetchCandidates();
  };

  const openEdit = (c: Candidate) => { setEditCandidate(c); setShowForm(true); };

  const candidateScores: Record<string, number> = {
    'Jordan Lee': 92,
    'Taylor Kim': 78,
    'Morgan Chen': 96,
    'Riley Johnson': 89,
    'Casey Wilson': 61,
    'Drew Martinez': 74,
  };

  const stageColor = isDark ? stageColorDark : stageColorLight;

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: isDark ? '#f2f1f5' : '#18141f' }}
          >
            Candidates
          </h2>
          <p className="text-sm mt-1" style={{ color: isDark ? '#8b899a' : '#6b6875' }}>
            {candidates.length} total candidates in pipeline
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus size={16} />}
          onClick={() => { setEditCandidate(null); setShowForm(true); }}
          id="add-candidate-btn"
        >
          Add Candidate
        </Button>
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              (e.currentTarget.querySelector('input') as HTMLInputElement)?.blur();
            }}
            className="relative flex-1"
          >
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: isDark ? '#8b899a' : '#6b6875' }} />
            <input
              id="candidate-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  (e.target as HTMLInputElement).blur();
                } else if (e.key === 'Escape') {
                  setQuery('');
                  (e.target as HTMLInputElement).blur();
                }
              }}
              placeholder="Search candidates by name, email, role..."
              className="w-full pl-10 pr-32 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{
                background: isDark ? '#08070b' : '#ffffff',
                border: isDark ? '1px solid #24212c' : '1px solid #e7e4ef',
                color: isDark ? '#f2f1f5' : '#18141f',
              }}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="px-2 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                  style={{
                    background: isDark ? 'rgba(239,68,68,0.15)' : '#fee2e2',
                    color: isDark ? '#f87171' : '#dc2626',
                  }}
                  title="Clear search query (Esc)"
                >
                  Clear (Esc)
                </button>
              )}
              <button
                type="submit"
                className="px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all hover:scale-105"
                style={{
                  background: isDark ? '#1a1820' : '#f3ecfd',
                  color: isDark ? '#c94dff' : '#7c3aed',
                  border: isDark ? '1px solid #2a2733' : '1px solid #e9d5ff',
                }}
                title="Press Enter to search"
              >
                ↵ Enter
              </button>
            </div>
          </form>
          <Button
            variant="outline"
            size="md"
            leftIcon={<Filter size={15} />}
            rightIcon={<ChevronDown size={14} className={clsx('transition-transform', showFilters && 'rotate-180')} />}
            onClick={() => setShowFilters((v) => !v)}
            id="filter-toggle"
          >
            Filter
          </Button>
        </div>

        {/* Status filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 pt-1 animate-fade-in">
            {['All', ...STATUS_OPTIONS].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={clsx(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer',
                  statusFilter === status
                    ? (isDark ? 'bg-[#c94dff] text-[#0c0b10] font-semibold' : 'bg-[#9333ea] text-white font-semibold')
                    : (isDark ? 'bg-[#1a1820] text-[#8b899a] hover:bg-[#24212c] hover:text-[#f2f1f5]' : 'bg-[#f3f0f9] text-[#6b6875] hover:bg-[#e9e4f5] hover:text-[#18141f]')
                )}
              >
                {status}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Floating Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 animate-slide-up"
          style={{
            background: isDark ? '#18161e' : '#ffffff',
            border: isDark ? '1px solid #372b49' : '1px solid #e9d5ff',
            boxShadow: isDark ? '0 8px 32px rgba(201,77,255,0.3)' : '0 8px 24px rgba(0,0,0,0.12)',
          }}
        >
          <span className="text-xs font-bold text-[#c94dff]">
            {selectedIds.length} candidate(s) selected
          </span>

          <div className="h-4 w-px bg-[#24212c]" />

          {/* Bulk Stage Move */}
          <select
            className="text-xs font-semibold px-3 py-1.5 rounded-xl outline-none bg-[#0c0b10] border border-[#24212c] text-[#f2f1f5] cursor-pointer"
            onChange={async (e) => {
              if (!e.target.value) return;
              const newStage = e.target.value as CandidateStatus;
              await Promise.all(selectedIds.map((id) => candidateService.update(id, { status: newStage })));
              setSelectedIds([]);
              fetchCandidates();
            }}
          >
            <option value="">Bulk Move Stage...</option>
            {STATUS_OPTIONS.map((st) => (
              <option key={st} value={st}>Move to {st}</option>
            ))}
          </select>

          {/* Bulk Reject */}
          <button
            onClick={async () => {
              await Promise.all(selectedIds.map((id) => candidateService.update(id, { status: 'Rejected' })));
              setSelectedIds([]);
              fetchCandidates();
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 transition-colors cursor-pointer"
          >
            Bulk Reject
          </button>

          {/* Clear Selection */}
          <button
            onClick={() => setSelectedIds([])}
            className="text-xs text-[#8b899a] hover:text-[#f2f1f5] underline cursor-pointer"
          >
            Deselect All
          </button>
        </div>
      )}

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: isDark ? '#111116' : '#ffffff',
          border: isDark ? '1px solid #1f1d27' : '1px solid #e7e4ef',
        }}
      >
        {loading ? (
          <PageLoader />
        ) : statusFiltered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16" style={{ color: isDark ? '#8b899a' : '#6b6875' }}>
            <Search size={40} className="mb-3 opacity-30" />
            <p className="font-medium" style={{ color: isDark ? '#f2f1f5' : '#18141f' }}>No candidates found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ color: isDark ? '#8b899a' : '#6b6875' }}>
                    <th className="px-4 py-3.5 text-left w-10">
                      <input
                        type="checkbox"
                        checked={selectedIds.length > 0 && selectedIds.length === statusFiltered.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds(statusFiltered.map((c) => c.id));
                          } else {
                            setSelectedIds([]);
                          }
                        }}
                        className="rounded border-[#24212c] cursor-pointer"
                      />
                    </th>
                    {['Candidate', 'Role', 'Department', 'Stage', 'AI Match', 'Applied', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-3.5 text-left text-xs font-normal whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pagination.paginatedItems.map((c) => {
                    const stageStyle = stageColor[c.status] || { bg: '#241f2e', text: '#c9a6ff' };
                    const score = aiService.calculateMatchScore(c);
                    const isSelected = selectedIds.includes(c.id);

                    return (
                      <tr
                        key={c.id}
                        style={{ borderTop: isDark ? '1px solid #1a1820' : '1px solid #eeecf5' }}
                        className={clsx('transition-colors group', isSelected ? (isDark ? 'bg-[#1e1927]' : 'bg-[#f3ecfd]') : (isDark ? 'hover:bg-[#16151c]' : 'hover:bg-[#f8f7fc]'))}
                      >
                        <td className="px-4 py-3.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedIds((prev) => [...prev, c.id]);
                              } else {
                                setSelectedIds((prev) => prev.filter((id) => id !== c.id));
                              }
                            }}
                            className="rounded border-[#24212c] cursor-pointer"
                          />
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0"
                              style={{ background: 'rgba(201,77,255,0.12)', color: isDark ? '#e0b3ff' : '#7c3aed' }}
                            >
                              {getInitials(c.name)}
                            </div>
                            <div>
                              <p className="text-sm font-medium" style={{ color: isDark ? '#f2f1f5' : '#18141f' }}>{c.name}</p>
                              <p className="text-xs" style={{ color: isDark ? '#6f6d7a' : '#8b899a' }}>{c.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-sm whitespace-nowrap" style={{ color: isDark ? '#a8a6b3' : '#6b6875' }}>{c.role}</td>
                        <td className="px-5 py-3.5 text-sm whitespace-nowrap" style={{ color: isDark ? '#8b899a' : '#6b6875' }}>{c.department}</td>
                        <td className="px-5 py-3.5">
                          <span
                            className="text-xs font-medium px-2.5 py-1 rounded-full"
                            style={{ background: stageStyle.bg, color: stageStyle.text }}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <ScoreRing score={score} isDark={isDark} />
                        </td>
                        <td className="px-5 py-3.5 text-xs whitespace-nowrap" style={{ color: isDark ? '#8b899a' : '#6b6875', fontFamily: "'JetBrains Mono', monospace" }}>
                          {formatDate(c.appliedDate)}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setViewCandidate(c)}
                              className="p-1.5 rounded-lg text-[#8b899a] hover:text-[#5ce1e6] hover:bg-[#1a1820] transition-colors cursor-pointer"
                              title="View details"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              onClick={() => openEdit(c)}
                              className="p-1.5 rounded-lg text-[#8b899a] hover:text-[#c94dff] hover:bg-[#1a1820] transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => setScheduleCandidate(c)}
                              className="p-1.5 rounded-lg text-[#8b899a] hover:text-[#e0b3ff] hover:bg-[#1a1820] transition-colors cursor-pointer"
                              title="Schedule interview"
                            >
                              <Calendar size={15} />
                            </button>
                            <button
                              onClick={() => downloadCandidateResume(c)}
                              className="p-1.5 rounded-lg text-[#8b899a] hover:text-[#5fe0a8] hover:bg-[#1a1820] transition-colors cursor-pointer"
                              title="Download resume"
                            >
                              <Download size={15} />
                            </button>
                            {isAdmin && (
                              <button
                                onClick={() => setDeleteId(c.id)}
                                className="p-1.5 rounded-lg text-[#8b899a] hover:text-red-400 hover:bg-[#1a1820] transition-colors cursor-pointer"
                                title="Delete candidate (Admin only)"
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-4 border-t" style={{ borderTop: isDark ? '1px solid #1a1820' : '1px solid #eeecf5' }}>
              <Pagination {...pagination} onPageChange={pagination.goToPage} />
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditCandidate(null); }}
        title={editCandidate ? 'Edit Candidate' : 'Add New Candidate'}
        size="lg"
      >
        <CandidateForm
          candidate={editCandidate}
          onSaved={handleSaved}
          onCancel={() => { setShowForm(false); setEditCandidate(null); }}
        />
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={!!viewCandidate}
        onClose={() => setViewCandidate(null)}
        title="Candidate Profile"
        size="lg"
      >
        {viewCandidate && (
          <CandidateDetail
            candidate={viewCandidate}
            onEdit={() => { setViewCandidate(null); openEdit(viewCandidate); }}
            onRefresh={fetchCandidates}
          />
        )}
      </Modal>

      {/* Schedule Interview Modal */}
      <Modal
        isOpen={!!scheduleCandidate}
        onClose={() => setScheduleCandidate(null)}
        title={`Schedule Interview for ${scheduleCandidate?.name}`}
        size="lg"
      >
        {scheduleCandidate && (
          <ScheduleInterviewModal
            candidate={scheduleCandidate}
            onSaved={() => { setScheduleCandidate(null); fetchCandidates(); }}
            onCancel={() => setScheduleCandidate(null)}
          />
        )}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Candidate"
        size="sm"
      >
        <p className="text-sm mb-5 text-[#8b899a]">
          Are you sure you want to delete this candidate? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" className="flex-1" onClick={handleDelete} id="confirm-delete">
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};
