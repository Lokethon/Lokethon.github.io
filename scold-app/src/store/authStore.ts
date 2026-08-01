import { create } from 'zustand';
import { authService } from '../services/auth';
import type { User } from '@/types/user';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
  // Subscribe to auth service changes
  authService.onAuthStateChanged((user) => {
    set({ 
      user, 
      isAuthenticated: !!user,
      isLoading: false 
    });
  });

  return {
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,

    initialize: async () => {
      try {
        const user = await authService.getCurrentUser();
        set({ user, isAuthenticated: !!user, isLoading: false });
      } catch (error: any) {
        set({ error: error.message, isLoading: false });
      }
    },

    login: async (email, password) => {
      set({ isLoading: true, error: null });
      try {
        await authService.signIn(email, password);
      } catch (error: any) {
        set({ error: error.message, isLoading: false });
      }
    },

    register: async (email, password, displayName) => {
      set({ isLoading: true, error: null });
      try {
        await authService.signUp(email, password, displayName);
      } catch (error: any) {
        set({ error: error.message, isLoading: false });
      }
    },

    logout: async () => {
      set({ isLoading: true, error: null });
      try {
        await authService.signOut();
      } catch (error: any) {
        set({ error: error.message });
      } finally {
        set({ isLoading: false });
      }
    },

    clearError: () => set({ error: null }),

    updateProfile: async (updates: Partial<User>) => {
      set({ isLoading: true, error: null });
      try {
        const user = await authService.getCurrentUser();
        if (!user) throw new Error('Not authenticated');
        
        const updatedUser = { ...user, ...updates };
        await authService.updateUser(updatedUser);
        
      } catch (error: any) {
        set({ error: error.message });
      } finally {
        set({ isLoading: false });
      }
    }
  };
});
