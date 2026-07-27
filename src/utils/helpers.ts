import type { CandidateStatus, RoleStatus } from '../types';

// ─── Status Helpers ───────────────────────────────────────────────────────────
export const candidateStatusColors: Record<CandidateStatus, string> = {
  Applied:   'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Screening: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Interview: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  Offer:     'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  Hired:     'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  Rejected:  'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

export const roleStatusColors: Record<RoleStatus, string> = {
  Open:   'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  Closed: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  Paused: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
};

// ─── Date Helpers ─────────────────────────────────────────────────────────────
export function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function daysAgo(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
}

// ─── String Helpers ───────────────────────────────────────────────────────────
export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('');
}

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + '…';
}

// ─── Number Helpers ───────────────────────────────────────────────────────────
export function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

// ─── Resume Download Helper ───────────────────────────────────────────────────
export function downloadCandidateResume(candidate: {
  name: string;
  email: string;
  phone?: string;
  role: string;
  department: string;
  status: string;
  experience: string;
  location?: string;
  skills?: string[];
  appliedDate?: string;
  salary?: string;
  notes?: string;
}): void {
  const content = `====================================================
              BINARYHIRE RESUME DOSSIER
====================================================

CANDIDATE INFORMATION
---------------------
Name:        ${candidate.name}
Email:       ${candidate.email}
Phone:       ${candidate.phone || 'N/A'}
Location:    ${candidate.location || 'N/A'}

APPLICATION DETAILS
-------------------
Applied Role: ${candidate.role}
Department:   ${candidate.department}
Status:       ${candidate.status}
Experience:   ${candidate.experience}
Salary Exp:   ${candidate.salary || 'N/A'}
Applied Date: ${candidate.appliedDate || 'N/A'}

SKILLS
------
${candidate.skills && candidate.skills.length > 0 ? candidate.skills.join(', ') : 'None listed'}

NOTES & EVALUATION
------------------
${candidate.notes || 'No evaluation notes attached.'}

====================================================
Document Generated via BinaryHire Recruitment Platform
====================================================`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const fileName = `${candidate.name.replace(/[^a-zA-Z0-9]/g, '_')}_Resume.txt`;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
