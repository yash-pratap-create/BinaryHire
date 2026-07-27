import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Calendar, Clock, Video, Plus, Search, Filter, Trash2, Edit2,
  User, CheckCircle, AlertCircle, ChevronDown, MapPin, ExternalLink
} from 'lucide-react';
import { clsx } from 'clsx';
import { interviewService } from '../../services/interviewService';
import type { Interview, InterviewStatus } from '../../types';
import { formatDate } from '../../utils/helpers';
import { useSearch } from '../../hooks/useSearch';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/UI/Button';
import { Modal } from '../../components/UI/Modal';
import { PageLoader } from '../../components/UI/Spinner';
import { ScheduleInterviewModal } from '../../components/Interviews/ScheduleInterviewModal';

const STATUS_OPTIONS: InterviewStatus[] = ['Scheduled', 'Completed', 'Cancelled'];

export const InterviewListPage: React.FC = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editInterview, setEditInterview] = useState<Interview | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchInterviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await interviewService.getAll();
      setInterviews(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  useEffect(() => {
    if (searchParams.get('schedule') === 'true') {
      setEditInterview(null);
      setShowScheduleModal(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const { query, setQuery, filtered: searchFiltered } = useSearch<Interview>(
    interviews,
    (item, q) =>
      item.candidateName.toLowerCase().includes(q) ||
      item.candidateRole.toLowerCase().includes(q) ||
      item.interviewer.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q)
  );

  const filteredInterviews = statusFilter === 'All'
    ? searchFiltered
    : searchFiltered.filter((i) => i.status === statusFilter);

  const handleDelete = async () => {
    if (!deleteId) return;
    await interviewService.delete(deleteId);
    setDeleteId(null);
    fetchInterviews();
  };

  const handleStatusChange = async (id: string, status: InterviewStatus) => {
    await interviewService.update(id, { status });
    fetchInterviews();
  };

  const typeBadgesDark: Record<string, { bg: string; text: string }> = {
    'HR Screening': { bg: '#241f2e', text: '#c9a6ff' },
    'Technical Round': { bg: '#1e2a3a', text: '#7ec8ff' },
    'System Design': { bg: '#3a2440', text: '#e29bff' },
    'Management Round': { bg: '#2a3a24', text: '#a8e07e' },
  };

  const typeBadgesLight: Record<string, { bg: string; text: string }> = {
    'HR Screening': { bg: '#f3ecfd', text: '#7c3aed' },
    'Technical Round': { bg: '#e6f2fc', text: '#1d6fb8' },
    'System Design': { bg: '#fbeafe', text: '#a21caf' },
    'Management Round': { bg: '#eef8e6', text: '#4d7c0f' },
  };

  const typeBadges = isDark ? typeBadgesDark : typeBadgesLight;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2
            className="text-2xl font-bold flex items-center gap-2.5"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: isDark ? '#f2f1f5' : '#18141f' }}
          >
            <Calendar className="text-[#c94dff]" size={26} /> Interview Schedule
          </h2>
          <p className="text-sm mt-1" style={{ color: isDark ? '#8b899a' : '#6b6875' }}>
            Coordinate candidates, assign interviewers, and manage meeting links
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus size={16} />}
          onClick={() => { setEditInterview(null); setShowScheduleModal(true); }}
          id="schedule-interview-btn"
        >
          Schedule Interview
        </Button>
      </div>

      {/* Filter Tabs & Search */}
      <div
        className="rounded-2xl p-4 space-y-3"
        style={{
          background: isDark ? '#111116' : '#ffffff',
          border: isDark ? '1px solid #1f1d27' : '1px solid #e7e4ef',
        }}
      >
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Form with Enter Submit & Esc Clear */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              (e.currentTarget.querySelector('input') as HTMLInputElement)?.blur();
            }}
            className="relative w-full sm:w-96"
          >
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: isDark ? '#8b899a' : '#6b6875' }} />
            <input
              id="interview-search"
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
              placeholder="Search candidate, role, or interviewer..."
              className="w-full pl-10 pr-24 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{
                background: isDark ? '#08070b' : '#ffffff',
                border: isDark ? '1px solid #24212c' : '1px solid #e7e4ef',
                color: isDark ? '#f2f1f5' : '#18141f',
              }}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="px-2 py-0.5 rounded text-xs font-medium text-red-400 hover:bg-red-950/30 transition-colors"
                  title="Clear search (Esc)"
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                className="px-2 py-0.5 rounded text-xs font-semibold"
                style={{
                  background: isDark ? '#1a1820' : '#f3ecfd',
                  color: isDark ? '#c94dff' : '#7c3aed',
                  border: isDark ? '1px solid #2a2733' : '1px solid #e9d5ff',
                }}
              >
                ↵ Enter
              </button>
            </div>
          </form>

          {/* Status Filter Buttons */}
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {['All', ...STATUS_OPTIONS].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={clsx(
                  'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer',
                  statusFilter === st
                    ? (isDark ? 'bg-[#c94dff] text-[#0c0b10]' : 'bg-[#9333ea] text-white')
                    : (isDark ? 'bg-[#1a1820] text-[#8b899a] hover:text-white' : 'bg-[#f3f0f9] text-[#6b6875] hover:text-black')
                )}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interview Cards Grid */}
      {loading ? (
        <PageLoader />
      ) : filteredInterviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#8b899a]">
          <Calendar size={44} className="mb-3 opacity-30" />
          <p className="font-medium" style={{ color: isDark ? '#f2f1f5' : '#18141f' }}>
            No interviews found
          </p>
          <p className="text-xs mt-1">Schedule an interview to start tracking candidate meetings.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInterviews.map((item) => {
            const badge = typeBadges[item.type] || { bg: '#1f1d27', text: '#c9a6ff' };
            const isCompleted = item.status === 'Completed';
            const isCancelled = item.status === 'Cancelled';

            return (
              <div
                key={item.id}
                className="rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 relative group"
                style={{
                  background: isDark ? '#111116' : '#ffffff',
                  border: isDark ? '1px solid #1f1d27' : '1px solid #e7e4ef',
                  opacity: isCancelled ? 0.65 : 1,
                }}
              >
                <div>
                  {/* Candidate Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3
                        className="font-bold text-base leading-snug"
                        style={{ fontFamily: "'Space Grotesk', sans-serif", color: isDark ? '#f2f1f5' : '#18141f' }}
                      >
                        {item.candidateName}
                      </h3>
                      <p className="text-xs mt-0.5" style={{ color: isDark ? '#8b899a' : '#6b6875' }}>
                        {item.candidateRole}
                      </p>
                    </div>
                    <span
                      className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                      style={{ background: badge.bg, color: badge.text }}
                    >
                      {item.type}
                    </span>
                  </div>

                  {/* Interview Details */}
                  <div className="space-y-2 mb-4 text-xs" style={{ color: isDark ? '#8b899a' : '#6b6875' }}>
                    <div className="flex items-center gap-2">
                      <Calendar size={13} className="text-[#c94dff]" />
                      <span>{formatDate(item.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={13} className="text-[#5ce1e6]" />
                      <span className="font-semibold" style={{ color: isDark ? '#f2f1f5' : '#18141f' }}>
                        {item.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={13} className="text-[#e0b3ff]" />
                      <span>Interviewer: <strong>{item.interviewer}</strong></span>
                    </div>
                    {item.notes && (
                      <p className="text-xs italic pt-1 line-clamp-2" style={{ color: isDark ? '#6f6d7a' : '#8b899a' }}>
                        "{item.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Actions & Join Button */}
                <div className="pt-3 border-t space-y-2" style={{ borderColor: isDark ? '#1a1820' : '#eeecf5' }}>
                  <a
                    href={item.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] cursor-pointer"
                    style={{
                      background: 'linear-gradient(135deg,#c94dff,#7c3aed)',
                      color: '#0c0b10',
                    }}
                  >
                    <Video size={14} /> Join Meeting <ExternalLink size={12} />
                  </a>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <select
                      className="text-xs font-semibold px-2 py-1 rounded-lg outline-none cursor-pointer bg-transparent border"
                      style={{
                        borderColor: isDark ? '#24212c' : '#e7e4ef',
                        color: isCompleted ? '#5fe0a8' : isCancelled ? '#ff8b8b' : '#c94dff',
                      }}
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value as InterviewStatus)}
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { setEditInterview(item); setShowScheduleModal(true); }}
                        className="p-1.5 rounded-lg text-[#8b899a] hover:text-[#f2f1f5] hover:bg-[#1a1820] transition-colors"
                        title="Edit interview details"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(item.id)}
                        className="p-1.5 rounded-lg text-[#8b899a] hover:text-red-400 hover:bg-red-950/30 transition-colors"
                        title="Delete interview schedule"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Schedule / Edit Modal */}
      <Modal
        isOpen={showScheduleModal}
        onClose={() => { setShowScheduleModal(false); setEditInterview(null); }}
        title={editInterview ? 'Edit Interview Schedule' : 'Schedule Candidate Interview'}
        size="lg"
      >
        <ScheduleInterviewModal
          interviewToEdit={editInterview}
          onSaved={() => { setShowScheduleModal(false); setEditInterview(null); fetchInterviews(); }}
          onCancel={() => { setShowScheduleModal(false); setEditInterview(null); }}
        />
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Cancel & Delete Interview" size="sm">
        <p className="text-sm mb-5" style={{ color: isDark ? '#8b899a' : '#6b6875' }}>
          Are you sure you want to remove this scheduled interview? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" className="flex-1" onClick={handleDelete} id="confirm-delete-interview">Delete</Button>
        </div>
      </Modal>
    </div>
  );
};
