import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'instructor' | 'manager' | 'admin' | 'affiliate';
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        const normalizedUser = { ...user, role: user.role.toLowerCase() as any };
        localStorage.setItem('auth_token', token);
        set({ user: normalizedUser, token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('auth_token');
        set({ user: null, token: null, isAuthenticated: false });
      },
      setUser: (user: User) => {
        const normalizedUser = { ...user, role: user.role.toLowerCase() as any };
        set({ user: normalizedUser });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
