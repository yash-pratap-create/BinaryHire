import api from './api';
import type { Candidate, CandidateFormData } from '../types';

export const candidateService = {
  async getAll(params?: { q?: string; status?: string; page?: number; limit?: number }) {
    const response = await api.get<Candidate[]>('/candidates', { params });
    return response;
  },

  async getById(id: string) {
    const response = await api.get<Candidate>(`/candidates/${id}`);
    return response.data;
  },

  async create(data: CandidateFormData) {
    const candidate: Omit<Candidate, 'id'> = {
      ...data,
      skills: data.skills.split(',').map((s) => s.trim()).filter(Boolean),
      resumeFile: '',
      appliedDate: new Date().toISOString().split('T')[0],
    };
    const response = await api.post<Candidate>('/candidates', candidate);
    return response.data;
  },

  async update(id: string, data: CandidateFormData) {
    const candidate = {
      ...data,
      skills: data.skills.split(',').map((s) => s.trim()).filter(Boolean),
    };
    const response = await api.put<Candidate>(`/candidates/${id}`, { id, ...candidate });
    return response.data;
  },

  async updateResume(id: string, filename: string) {
    const response = await api.patch<Candidate>(`/candidates/${id}`, { resumeFile: filename });
    return response.data;
  },

  async delete(id: string) {
    await api.delete(`/candidates/${id}`);
  },
};
