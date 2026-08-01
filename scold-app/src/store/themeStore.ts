import { create } from 'zustand';
import { storage } from '../utils/storage';

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setDarkMode: (value: boolean) => void;
  initializeTheme: () => Promise<void>;
}

const THEME_STORAGE_KEY = '@scold_theme_dark';

export const useThemeStore = create<ThemeState>((set, get) => ({
  isDarkMode: true, // Default to dark mode as per requirements
  
  toggleTheme: async () => {
    const newValue = !get().isDarkMode;
    set({ isDarkMode: newValue });
    await storage.setItem(THEME_STORAGE_KEY, newValue);
  },
  
  setDarkMode: async (value: boolean) => {
    set({ isDarkMode: value });
    await storage.setItem(THEME_STORAGE_KEY, value);
  },
  
  initializeTheme: async () => {
    const storedValue = await storage.getItem<boolean>(THEME_STORAGE_KEY);
    if (storedValue !== null) {
      set({ isDarkMode: storedValue });
    }
  }
}));
