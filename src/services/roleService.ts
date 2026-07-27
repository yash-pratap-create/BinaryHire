import api from './api';
import type { Role, RoleFormData } from '../types';

export const roleService = {
  async getAll(params?: { q?: string; status?: string; department?: string }) {
    const response = await api.get<Role[]>('/roles', { params });
    return response;
  },

  async getById(id: string) {
    const response = await api.get<Role>(`/roles/${id}`);
    return response.data;
  },

  async create(data: RoleFormData) {
    const role: Omit<Role, 'id'> = {
      ...data,
      requirements: data.requirements.split(',').map((r) => r.trim()).filter(Boolean),
      postedDate: new Date().toISOString().split('T')[0],
      applicants: 0,
    };
    const response = await api.post<Role>('/roles', role);
    return response.data;
  },

  async update(id: string, data: RoleFormData) {
    const role = {
      ...data,
      requirements: data.requirements.split(',').map((r) => r.trim()).filter(Boolean),
    };
    const response = await api.put<Role>(`/roles/${id}`, { id, ...role });
    return response.data;
  },

  async delete(id: string) {
    await api.delete(`/roles/${id}`);
  },
};
