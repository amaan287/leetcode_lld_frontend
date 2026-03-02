'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { isTokenExpired } from '@/lib/auth/token';

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
        }
        set({ user, token });
      },
      clearAuth: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
        set({ user: null, token: null });
      },
      isAuthenticated: () => {
        const token = get().token;
        if (!token) return false;
        if (isTokenExpired(token)) {
          get().clearAuth();
          return false;
        }
        return get().user !== null;
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
