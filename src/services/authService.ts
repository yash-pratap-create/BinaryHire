import api from './api';
import type { User } from '../types';

interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
  role?: 'Admin' | 'Recruiter' | 'Manager';
}

interface LoginResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    // JSON Server doesn't support POST /login natively, so we query users
    const response = await api.get<User[]>('/users', {
      params: { email: credentials.email },
    });

    const users = response.data;
    if (!users || users.length === 0) {
      throw new Error('Invalid email or password');
    }

    // Cast to include password for matching
    const user = users[0] as User & { password: string };
    if ((user as any).password !== credentials.password) {
      throw new Error('Invalid email or password');
    }

    const token = btoa(`${user.id}:${Date.now()}`);
    const { password: _pw, ...safeUser } = user as any;

    return { user: safeUser, token };
  },

  async signUp(credentials: SignUpCredentials): Promise<LoginResponse> {
    // Check if email already exists
    const checkResponse = await api.get<User[]>('/users', {
      params: { email: credentials.email },
    });

    if (checkResponse.data && checkResponse.data.length > 0) {
      throw new Error('An account with this email already exists');
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: credentials.name,
      email: credentials.email,
      password: credentials.password,
      role: credentials.role || 'Recruiter',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
    };

    const createResponse = await api.post('/users', newUser);
    const { password: _pw, ...safeUser } = createResponse.data;

    const token = btoa(`${safeUser.id}:${Date.now()}`);
    return { user: safeUser as User, token };
  },

  async getMe(): Promise<User | null> {
    const stored = localStorage.getItem('bh_user');
    if (!stored) return null;
    return JSON.parse(stored);
  },

  logout(): void {
    localStorage.removeItem('bh_token');
    localStorage.removeItem('bh_user');
  },
};
