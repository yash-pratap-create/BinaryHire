import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp, Users, Briefcase, Clock, ArrowUpRight } from 'lucide-react';
import { candidateService } from '../services/candidateService';
import { roleService } from '../services/roleService';
import { useTheme } from '../context/ThemeContext';
import type { Candidate, Role } from '../types';

const HIRING_FUNNEL = [
  { stage: 'Applied', count: 156 },
  { stage: 'Screening', count: 89 },
  { stage: 'Interview', count: 42 },
  { stage: 'Offer', count: 18 },
  { stage: 'Hired', count: 12 },
];

const MONTHLY_APPS = [
  { month: 'Aug', applications: 32, hired: 4 },
  { month: 'Sep', applications: 41, hired: 6 },
  { month: 'Oct', applications: 38, hired: 5 },
  { month: 'Nov', applications: 55, hired: 8 },
  { month: 'Dec', applications: 47, hired: 7 },
  { month: 'Jan', applications: 63, hired: 9 },
];

const TIME_TO_HIRE = [
  { month: 'Aug', days: 28 },
  { month: 'Sep', days: 24 },
  { month: 'Oct', days: 22 },
  { month: 'Nov', days: 19 },
  { month: 'Dec', days: 21 },
  { month: 'Jan', days: 16 },
];

const PIE_COLORS = ['#c94dff', '#7c3aed', '#5ce1e6', '#5fe0a8', '#ffe07e', '#ff8b8b'];

interface ChartCardProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isDark: boolean;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, subtitle, icon, children, isDark }) => (
  <div
    className="rounded-2xl p-5 card-shadow animate-slide-up"
    style={{
      background: isDark ? '#111116' : '#ffffff',
      border: isDark ? '1px solid #1f1d27' : '1px solid #e7e4ef',
    }}
  >
    <div className="flex items-start justify-between mb-5">
      <div>
        <h3 className="font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: isDark ? '#f2f1f5' : '#18141f' }}>
          {title}
        </h3>
        {subtitle && <p className="text-xs mt-0.5" style={{ color: isDark ? '#8b899a' : '#6b6875' }}>{subtitle}</p>}
      </div>
      <div className="p-2 rounded-xl" style={{ background: 'rgba(201,77,255,0.1)', color: isDark ? '#c94dff' : '#9333ea' }}>
        {icon}
      </div>
    </div>
    {children}
  </div>
);

export const AnalyticsPage: React.FC = () => {
  const { isDark } = useTheme();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      candidateService.getAll(),
      roleService.getAll(),
    ]).then(([cRes, rRes]) => {
      setCandidates(cRes.data);
      setRoles(rRes.data);
    }).finally(() => setLoading(false));
  }, []);

  const chartConfig = {
    textColor: isDark ? '#8b899a' : '#6b6875',
    gridColor: isDark ? '#1a1820' : '#eeecf5',
    tooltipBg: isDark ? '#18161e' : '#ffffff',
    tooltipBorder: isDark ? '#2a2733' : '#e7e4ef',
    tooltipText: isDark ? '#f2f1f5' : '#18141f',
  };

  const deptData = roles.reduce<Record<string, number>>((acc, r) => {
    acc[r.department] = (acc[r.department] ?? 0) + 1;
    return acc;
  }, {});
  const deptPieData = Object.entries(deptData).map(([name, value]) => ({ name, value }));

  const statusData = candidates.reduce<Record<string, number>>((acc, c) => {
    acc[c.status] = (acc[c.status] ?? 0) + 1;
    return acc;
  }, {});

  const tooltipStyle = {
    backgroundColor: chartConfig.tooltipBg,
    border: `1px solid ${chartConfig.tooltipBorder}`,
    borderRadius: '10px',
    color: chartConfig.tooltipText,
    fontSize: '12px',
    padding: '10px 14px',
  };

  const kpis = [
    { label: 'Total Applications', value: '156', change: '+23% MoM', icon: <Users size={16} /> },
    { label: 'Conversion Rate', value: '7.7%', change: '+1.2% MoM', icon: <TrendingUp size={16} /> },
    { label: 'Open Positions', value: String(roles.filter(r => r.status === 'Open').length || 6), change: '4 departments', icon: <Briefcase size={16} /> },
    { label: 'Avg. Time to Hire', value: '16 days', change: '-4d vs last month', icon: <Clock size={16} /> },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2
          className="text-2xl font-bold"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: isDark ? '#f2f1f5' : '#18141f' }}
        >
          Analytics & Insights
        </h2>
        <p className="text-sm mt-1" style={{ color: isDark ? '#8b899a' : '#6b6875' }}>
          Hiring performance metrics & team insights
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-2xl p-4 flex flex-col justify-between"
            style={{
              background: isDark ? '#111116' : '#ffffff',
              border: isDark ? '1px solid #1f1d27' : '1px solid #e7e4ef',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs" style={{ color: isDark ? '#8b899a' : '#6b6875' }}>{kpi.label}</p>
              <div className="p-1.5 rounded-lg" style={{ background: 'rgba(201,77,255,0.1)', color: isDark ? '#c94dff' : '#9333ea' }}>
                {kpi.icon}
              </div>
            </div>
            <div>
              <p
                className="text-2xl font-bold"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: isDark ? '#f2f1f5' : '#18141f' }}
              >
                {kpi.value}
              </p>
              <p className="text-xs text-[#5fe0a8] mt-1 font-medium flex items-center gap-0.5">
                <ArrowUpRight size={12} /> {kpi.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Hiring Funnel - BarChart */}
        <ChartCard
          title="Hiring Funnel"
          subtitle="Application pipeline breakdown"
          icon={<Users size={18} />}
          isDark={isDark}
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={HIRING_FUNNEL} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.gridColor} horizontal={false} />
              <XAxis type="number" tick={{ fill: chartConfig.textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="stage"
                tick={{ fill: chartConfig.textColor, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={65}
              />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(201,77,255,0.06)' }} />
              <defs>
                <linearGradient id="barFunnel" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#c94dff" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
              <Bar dataKey="count" fill="url(#barFunnel)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Applications vs Hired - LineChart */}
        <ChartCard
          title="Applications vs Hired"
          subtitle="Last 6 months trend"
          icon={<TrendingUp size={18} />}
          isDark={isDark}
        >
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={MONTHLY_APPS}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.gridColor} />
              <XAxis dataKey="month" tick={{ fill: chartConfig.textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: chartConfig.textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '12px', color: chartConfig.textColor }} />
              <Line type="monotone" dataKey="applications" stroke="#c94dff" strokeWidth={2.5} dot={{ r: 4, fill: '#c94dff' }} activeDot={{ r: 6 }} name="Applications" />
              <Line type="monotone" dataKey="hired" stroke="#5fe0a8" strokeWidth={2.5} dot={{ r: 4, fill: '#5fe0a8' }} activeDot={{ r: 6 }} name="Hired" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Department Distribution - PieChart */}
        <ChartCard
          title="Roles by Department"
          subtitle="Open positions distribution"
          icon={<Briefcase size={18} />}
          isDark={isDark}
        >
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="55%" height={220}>
              <PieChart>
                <Pie
                  data={deptPieData.length > 0 ? deptPieData : [{ name: 'Engineering', value: 3 }, { name: 'Product', value: 1 }, { name: 'Design', value: 1 }, { name: 'Data', value: 1 }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {(deptPieData.length > 0 ? deptPieData : []).map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {(deptPieData.length > 0 ? deptPieData : [{ name: 'Engineering', value: 3 }, { name: 'Product', value: 1 }, { name: 'Design', value: 1 }]).map((entry, i) => (
                <div key={entry.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-xs" style={{ color: isDark ? '#8b899a' : '#6b6875' }}>{entry.name}</span>
                  </div>
                  <span className="text-xs font-semibold" style={{ color: isDark ? '#f2f1f5' : '#18141f' }}>{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Time to Hire - AreaChart */}
        <ChartCard
          title="Time to Hire"
          subtitle="Average days per month"
          icon={<Clock size={18} />}
          isDark={isDark}
        >
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={TIME_TO_HIRE}>
              <defs>
                <linearGradient id="timeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5ce1e6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#5ce1e6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.gridColor} />
              <XAxis dataKey="month" tick={{ fill: chartConfig.textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: chartConfig.textColor, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                unit=" d"
                domain={[10, 35]}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => [`${value} days`, 'Avg. Time to Hire']}
              />
              <Area type="monotone" dataKey="days" stroke="#5ce1e6" strokeWidth={2.5} fill="url(#timeGrad)" dot={{ r: 4, fill: '#5ce1e6' }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Candidate Status breakdown */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: isDark ? '#111116' : '#ffffff',
          border: isDark ? '1px solid #1f1d27' : '1px solid #e7e4ef',
        }}
      >
        <h3
          className="font-semibold mb-4"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: isDark ? '#f2f1f5' : '#18141f' }}
        >
          Candidate Pipeline Breakdown
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {Object.entries(statusData).map(([status, count]) => (
            <div
              key={status}
              className="text-center p-3 rounded-xl"
              style={{
                background: isDark ? '#18161e' : '#f8f7fc',
                border: isDark ? '1px solid #24212c' : '1px solid #e7e4ef',
              }}
            >
              <p
                className="text-2xl font-bold"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: isDark ? '#c94dff' : '#7c3aed' }}
              >
                {count}
              </p>
              <p className="text-xs mt-1" style={{ color: isDark ? '#8b899a' : '#6b6875' }}>{status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
