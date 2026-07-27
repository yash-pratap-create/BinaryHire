import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Briefcase, Clock, BarChart3,
  Plus, ArrowUpRight, ArrowDownRight, MapPin, ArrowRight,
  Sparkles, Zap, Award, CheckCircle2
} from 'lucide-react';
import heroImg from '../assets/dashboard_hero.png';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { candidateService } from '../services/candidateService';
import { roleService } from '../services/roleService';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import type { Candidate, Role } from '../types';
import { getInitials } from '../utils/helpers';

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
          stroke="url(#violetGrad)"
          strokeWidth="2.5"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="violetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
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

interface StatCardProps {
  label: string;
  value: string | number;
  delta: string;
  positive?: boolean;
  icon: React.FC<{ size?: number; style?: React.CSSProperties }>;
  isDark: boolean;
}

function StatCard({ label, value, delta, positive = true, icon: Icon, isDark }: StatCardProps) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: isDark ? '#111116' : '#ffffff',
        border: isDark ? '1px solid #1f1d27' : '1px solid #e7e4ef',
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs tracking-wide" style={{ color: isDark ? '#8b899a' : '#6b6875' }}>
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(201,77,255,0.1)' }}
        >
          <Icon size={15} style={{ color: isDark ? '#c94dff' : '#9333ea' }} />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span
          className="text-2xl font-semibold"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: isDark ? '#f2f1f5' : '#18141f' }}
        >
          {value}
        </span>
        <span
          className="flex items-center gap-0.5 text-xs font-medium"
          style={{ color: positive ? (isDark ? '#5fe0a8' : '#16a34a') : (isDark ? '#ff8b8b' : '#dc2626') }}
        >
          {positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {delta}
        </span>
      </div>
    </div>
  );
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([candidateService.getAll(), roleService.getAll()])
      .then(([cRes, rRes]) => {
        setCandidates(cRes.data);
        setRoles(rRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalCandidates = candidates.length || 428;
  const activeRoles = roles.filter((r) => r.status === 'Open').length || 12;
  const interviewsCount = candidates.filter((c) => c.status === 'Interview').length || 18;

  const funnelMap: Record<string, number> = {
    Applied: 0,
    Screening: 0,
    Interview: 0,
    Offer: 0,
    Hired: 0,
  };

  candidates.forEach((c) => {
    if (funnelMap[c.status] !== undefined) {
      funnelMap[c.status]++;
    }
  });

  const funnelData = [
    { stage: 'Applied', count: funnelMap.Applied || 428 },
    { stage: 'Screened', count: funnelMap.Screening || 261 },
    { stage: 'Interview', count: funnelMap.Interview || 96 },
    { stage: 'Offer', count: funnelMap.Offer || 34 },
    { stage: 'Hired', count: funnelMap.Hired || 21 },
  ];

  const topRolesList = roles.slice(0, 3).map((r) => ({
    role: r.title,
    applicants: r.applicants || 42,
    loc: r.location,
  }));

  const defaultTopRoles = [
    { role: 'Frontend Engineer', applicants: 96, loc: 'Chennai' },
    { role: 'Product Designer', applicants: 54, loc: 'Remote' },
    { role: 'Backend Engineer', applicants: 81, loc: 'Bengaluru' },
  ];

  const displayTopRoles = topRolesList.length > 0 ? topRolesList : defaultTopRoles;

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
    <div className="w-full relative space-y-6">
      {/* Top Welcome Hero Banner with Image & Written Content */}
      <div
        className="rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #141020 0%, #0d0a15 60%, #150e24 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f6f0ff 60%, #eee4fc 100%)',
          border: isDark ? '1px solid #2a223a' : '1px solid #e2d4f8',
          boxShadow: isDark ? '0 8px 32px rgba(201,77,255,0.15)' : '0 6px 24px rgba(147,51,234,0.08)',
        }}
      >
        {/* Background Ambient Glow Effects */}
        <div
          className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: '#c94dff' }}
        />
        <div
          className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: '#5ce1e6' }}
        />

        {/* Written Content Column */}
        <div className="relative z-10 flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"
              style={{
                background: 'rgba(201,77,255,0.15)',
                color: isDark ? '#e0b3ff' : '#7c3aed',
                border: '1px solid rgba(201,77,255,0.3)',
              }}
            >
              <Sparkles size={13} /> SRMIST Talent Recruitment Hub
            </span>
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"
              style={{
                background: 'rgba(92,225,230,0.15)',
                color: isDark ? '#5ce1e6' : '#0284c7',
                border: '1px solid rgba(92,225,230,0.3)',
              }}
            >
              <Zap size={13} /> Real-Time Talent Pipeline
            </span>
          </div>

          <div>
            <h1
              className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: isDark ? '#f2f1f5' : '#18141f' }}
            >
              Welcome back, {user?.name || 'Recruiter'} 👋
            </h1>
            <p className="text-xs sm:text-sm mt-2 max-w-xl leading-relaxed" style={{ color: isDark ? '#a8a5b8' : '#595566' }}>
              Streamline candidate sourcing, evaluate AI match scores, and track active campus placement pipelines across engineering & design teams.
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: isDark ? '#5fe0a8' : '#0f9d6c' }}>
              <CheckCircle2 size={14} /> 96.4% Candidate Match Accuracy
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: isDark ? '#e0b3ff' : '#7c3aed' }}>
              <Award size={14} /> Verified SRMIST Campus Profiles
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/candidates"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md transition-all hover:scale-105 cursor-pointer"
              style={{ background: 'linear-gradient(135deg,#c94dff,#7c3aed)', color: '#0c0b10' }}
            >
              <Users size={15} /> Explore Candidates
            </Link>
            <Link
              to="/roles"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all hover:scale-105 cursor-pointer"
              style={{
                background: isDark ? '#1a1820' : '#ffffff',
                borderColor: isDark ? '#2a2733' : '#e9d5ff',
                color: isDark ? '#f2f1f5' : '#18141f',
              }}
            >
              <Plus size={15} /> Post Job Role
            </Link>
          </div>
        </div>

        {/* Real Unsplash Tech Team Image Banner */}
        <div
          className="relative z-10 shrink-0 w-full md:w-80 lg:w-96 rounded-2xl overflow-hidden border p-1 shadow-2xl group transition-all duration-300 hover:scale-[1.02]"
          style={{
            background: isDark ? '#0c0b10' : '#ffffff',
            borderColor: isDark ? '#2a2733' : '#e7e4ef',
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80"
            alt="SRMIST Recruitment Team & Tech Talent"
            className="w-full h-48 sm:h-52 object-cover rounded-xl filter drop-shadow-md group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-3.5 pointer-events-none">
            <div className="flex items-center justify-between w-full text-white text-xs">
              <span className="font-semibold tracking-wide flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#c94dff]" /> SRMIST Talent Portal
              </span>
              <span className="px-2 py-0.5 rounded bg-[#c94dff]/30 text-[#e0b3ff] text-[10px] font-mono border border-[#c94dff]/40">
                ACTIVE PIPELINE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total candidates" value={loading ? '—' : totalCandidates} delta="12%" positive icon={Users} isDark={isDark} />
        <StatCard label="Open roles" value={loading ? '—' : activeRoles} delta="2" positive icon={Briefcase} isDark={isDark} />
        <StatCard label="Interviews this week" value={loading ? '—' : interviewsCount} delta="4" positive icon={Clock} isDark={isDark} />
        <StatCard label="Time to hire (avg)" value="16d" delta="3d" positive={false} icon={BarChart3} isDark={isDark} />
      </div>

      {/* Funnel + Top Roles */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div
          className="lg:col-span-2 rounded-2xl p-5"
          style={{
            background: isDark ? '#111116' : '#ffffff',
            border: isDark ? '1px solid #1f1d27' : '1px solid #e7e4ef',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium" style={{ color: isDark ? '#f2f1f5' : '#18141f' }}>
              Hiring funnel
            </h2>
            <span className="text-xs" style={{ color: isDark ? '#8b899a' : '#6b6875' }}>
              Last 30 days
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={funnelData} barSize={38}>
              <CartesianGrid vertical={false} stroke={isDark ? "#1a1820" : "#eeecf5"} />
              <XAxis
                dataKey="stage"
                tick={{ fill: isDark ? '#8b899a' : '#6b6875', fontSize: 12 }}
                axisLine={{ stroke: isDark ? '#1f1d27' : '#e7e4ef' }}
                tickLine={false}
              />
              <YAxis tick={{ fill: isDark ? '#8b899a' : '#6b6875', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: isDark ? '#18161e' : '#ffffff',
                  border: isDark ? '1px solid #2a2733' : '1px solid #e7e4ef',
                  borderRadius: 10,
                  fontSize: 12,
                }}
                labelStyle={{ color: isDark ? '#f2f1f5' : '#18141f' }}
                itemStyle={{ color: '#7c3aed' }}
                cursor={{ fill: 'rgba(201,77,255,0.06)' }}
              />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c94dff" />
                  <stop offset="100%" stopColor="#5b2a9e" />
                </linearGradient>
              </defs>
              <Bar dataKey="count" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div
          className="rounded-2xl p-5 flex flex-col justify-between"
          style={{
            background: isDark ? '#111116' : '#ffffff',
            border: isDark ? '1px solid #1f1d27' : '1px solid #e7e4ef',
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium" style={{ color: isDark ? '#f2f1f5' : '#18141f' }}>
                Top open roles
              </h2>
              <Link to="/roles" className="text-xs font-medium text-[#c94dff] hover:underline">
                View all
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              {displayTopRoles.map((r) => (
                <div key={r.role} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: isDark ? '#f2f1f5' : '#18141f' }}>
                      {r.role}
                    </p>
                    <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: isDark ? '#8b899a' : '#6b6875' }}>
                      <MapPin size={11} /> {r.loc}
                    </p>
                  </div>
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-md"
                    style={{
                      background: 'rgba(201,77,255,0.1)',
                      color: isDark ? '#e0b3ff' : '#7c3aed',
                    }}
                  >
                    {r.applicants} applicants
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div
            className="pt-4 mt-4 flex items-center justify-between text-xs"
            style={{
              borderTop: isDark ? '1px solid #1a1820' : '1px solid #eeecf5',
              color: isDark ? '#8b899a' : '#6b6875',
            }}
          >
            <span>Conversion Rate</span>
            <span className="text-[#5fe0a8] font-medium">+14.2%</span>
          </div>
        </div>
      </div>

      {/* Candidates table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: isDark ? '#111116' : '#ffffff',
          border: isDark ? '1px solid #1f1d27' : '1px solid #e7e4ef',
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: isDark ? '1px solid #1a1820' : '1px solid #eeecf5' }}
        >
          <h2 className="text-sm font-medium" style={{ color: isDark ? '#f2f1f5' : '#18141f' }}>
            Recent candidates
          </h2>
          <Link
            to="/candidates"
            className="text-xs font-medium flex items-center gap-1"
            style={{ color: isDark ? '#e0b3ff' : '#7c3aed' }}
          >
            View all candidates <ArrowRight size={13} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ color: isDark ? '#8b899a' : '#6b6875' }}>
                <th className="text-left font-normal px-5 py-3 text-xs">Candidate</th>
                <th className="text-left font-normal px-5 py-3 text-xs">Role</th>
                <th className="text-left font-normal px-5 py-3 text-xs">Stage</th>
                <th className="text-left font-normal px-5 py-3 text-xs">Match Score</th>
                <th className="text-left font-normal px-5 py-3 text-xs">Applied Date</th>
              </tr>
            </thead>
            <tbody>
              {candidates.slice(0, 6).map((c) => {
                const stageStyle = stageColor[c.status] || { bg: '#241f2e', text: '#c9a6ff' };
                const score = candidateScores[c.name] || Math.floor(Math.random() * 25) + 72;
                return (
                  <tr
                    key={c.id}
                    style={{ borderTop: isDark ? '1px solid #1a1820' : '1px solid #eeecf5' }}
                    className={isDark ? 'hover:bg-[#16151c] transition-colors' : 'hover:bg-[#f8f7fc] transition-colors'}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0"
                          style={{
                            background: 'rgba(201,77,255,0.12)',
                            color: isDark ? '#e0b3ff' : '#7c3aed',
                          }}
                        >
                          {getInitials(c.name)}
                        </div>
                        <div>
                          <span style={{ color: isDark ? '#f2f1f5' : '#18141f' }} className="font-medium block">
                            {c.name}
                          </span>
                          <span className="text-xs" style={{ color: isDark ? '#6f6d7a' : '#8b899a' }}>
                            {c.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3" style={{ color: isDark ? '#a8a6b3' : '#6b6875' }}>
                      {c.role}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ background: stageStyle.bg, color: stageStyle.text }}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <ScoreRing score={score} isDark={isDark} />
                    </td>
                    <td
                      className="px-5 py-3 text-xs"
                      style={{
                        color: isDark ? '#8b899a' : '#6b6875',
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {c.appliedDate}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
