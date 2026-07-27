import api from './api';
import type { Interview, InterviewFormData } from '../types';

export const interviewService = {
  getAll: () => api.get<Interview[]>('/interviews'),
  getById: (id: string) => api.get<Interview>(`/interviews/${id}`),
  create: (data: InterviewFormData) => api.post<Interview>('/interviews', data),
  update: (id: string, data: Partial<InterviewFormData>) => api.put<Interview>(`/interviews/${id}`, data),
  delete: (id: string) => api.delete(`/interviews/${id}`),
};
