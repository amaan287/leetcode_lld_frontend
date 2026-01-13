import { apiClient } from './client';
import { AuthResponse } from '@/types';

export const authApi = {
  register: async (email: string, password: string, name: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', {
      email,
      password,
      name,
    });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  googleAuth: async (googleId: string, email: string, name: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/google', {
      googleId,
      email,
      name,
    });
    return response.data;
  },
};

