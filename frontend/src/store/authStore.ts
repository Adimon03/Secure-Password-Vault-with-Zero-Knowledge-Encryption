import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  email: string;
  is_active: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  masterPassword: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  setMasterPassword: (password: string) => void;
  logout: () => void;
  clearMasterPassword: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      masterPassword: null,
      isAuthenticated: false,
      setAuth: (user, token) =>
        set({ user, token, isAuthenticated: true }),
      setMasterPassword: (password) =>
        set({ masterPassword: password }),
      logout: () =>
        set({ user: null, token: null, masterPassword: null, isAuthenticated: false }),
      clearMasterPassword: () =>
        set({ masterPassword: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        // Never persist master password
      }),
    }
  )
);