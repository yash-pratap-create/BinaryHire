// ─── User & Auth ──────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'Recruiter' | 'Manager';
  avatar: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ─── Candidate ─────────────────────────────────────────────────────────────────
export type CandidateStatus = 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';
export type CandidateSource = 'LinkedIn' | 'Campus Referral' | 'Career Portal' | 'Direct Application';

export interface Scorecard {
  id: string;
  candidateId: string;
  interviewer: string;
  round: string;
  technicalRating: number;
  communicationRating: number;
  problemSolvingRating: number;
  cultureFitRating: number;
  recommendation: 'Strong Hire' | 'Hire' | 'No Hire' | 'Strong No Hire';
  comments: string;
  date: string;
}

export interface CandidateComment {
  id: string;
  candidateId: string;
  author: string;
  text: string;
  date: string;
}

export type OfferApprovalStage = 'Draft' | 'Manager Approved' | 'HR Approved' | 'Offer Extended';

export interface OfferApproval {
  stage: OfferApprovalStage;
  managerApprovedBy?: string;
  hrApprovedBy?: string;
  salaryOffered?: string;
  startDate?: string;
  notes?: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: CandidateStatus;
  experience: string;
  location: string;
  skills: string[];
  resumeFile: string;
  appliedDate: string;
  salary: string;
  notes: string;
  source?: CandidateSource;
  scorecards?: Scorecard[];
  comments?: CandidateComment[];
  offerApproval?: OfferApproval;
}

export interface CandidateFormData {
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: CandidateStatus;
  experience: string;
  location: string;
  skills: string;
  salary: string;
  notes: string;
}

// ─── Role ──────────────────────────────────────────────────────────────────────
export type RoleStatus = 'Open' | 'Closed' | 'Paused';
export type RoleType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';

export interface Role {
  id: string;
  title: string;
  department: string;
  location: string;
  type: RoleType;
  status: RoleStatus;
  salary: string;
  experience: string;
  description: string;
  requirements: string[];
  postedDate: string;
  deadline: string;
  applicants: number;
  hiringManager: string;
}

export interface RoleFormData {
  title: string;
  department: string;
  location: string;
  type: RoleType;
  status: RoleStatus;
  salary: string;
  experience: string;
  description: string;
  requirements: string;
  deadline: string;
  hiringManager: string;
}

// ─── Activity ──────────────────────────────────────────────────────────────────
export interface Activity {
  id: string;
  type: 'hired' | 'interview' | 'applied' | 'offer' | 'role';
  text: string;
  time: string;
  icon: string;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export interface DashboardStats {
  totalCandidates: number;
  activeRoles: number;
  interviewsThisWeek: number;
  hiredThisMonth: number;
  conversionRate: number;
  avgTimeToHire: number;
}

// ─── API ──────────────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiError {
  message: string;
  status: number;
}

// ─── Interview ────────────────────────────────────────────────────────────────
export type InterviewType = 'HR Screening' | 'Technical Round' | 'System Design' | 'Management Round';
export type InterviewStatus = 'Scheduled' | 'Completed' | 'Cancelled';

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateRole: string;
  interviewer: string;
  type: InterviewType;
  date: string;
  time: string;
  meetingUrl: string;
  status: InterviewStatus;
  notes?: string;
}

export interface InterviewFormData {
  candidateId: string;
  candidateName: string;
  candidateRole: string;
  interviewer: string;
  type: InterviewType;
  date: string;
  time: string;
  meetingUrl: string;
  status: InterviewStatus;
  notes?: string;
}
