import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  new_password: string;
}

export interface VaultEntry {
  id: number;
  user_id: number;
  title: string;
  encrypted_data: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateVaultEntry {
  title: string;
  encrypted_data: string;
}

export interface UpdateVaultEntry {
  title?: string;
  encrypted_data?: string;
}

// Auth API
export const authAPI = {
  login: (data: LoginData) => {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
    return api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },
  register: (data: RegisterData) => api.post('/auth/register', data),
  forgotPassword: (data: ForgotPasswordData) => api.post('/auth/forgot-password', data),
  resetPassword: (data: ResetPasswordData) => api.post('/auth/reset-password', data),
  getMe: (token?: string) => {
    const config = token ? {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    } : {};
    return api.get('/auth/me', config);
  },
};

// Vault API
export const vaultAPI = {
  getEntries: () => api.get<VaultEntry[]>('/vault/entries'),
  getEntry: (id: number) => api.get<VaultEntry>(`/vault/entries/${id}`),
  createEntry: (data: CreateVaultEntry) => api.post<VaultEntry>('/vault/entries', data),
  updateEntry: (id: number, data: UpdateVaultEntry) => api.put<VaultEntry>(`/vault/entries/${id}`, data),
  deleteEntry: (id: number) => api.delete(`/vault/entries/${id}`),
};

export default api;