import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Advice {
  id: number;
  advice: string;
}

export interface ToastType {
  id: string;
  message: string;
  type?: 'success' | 'info';
  actionLabel?: string;
  onAction?: () => void;
}

interface AppState {
  favorites: Advice[];
  addFavorite: (advice: Advice) => void;
  removeFavorite: (id: number) => void;
  clearFavorites: () => void;
  
  searchHistory: string[];
  addSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  removeSearchHistoryItem: (query: string) => void;
  
  animationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
  
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  toasts: ToastType[];
  addToast: (toast: Omit<ToastType, 'id'>) => string;
  removeToast: (id: string) => void;

  resetPreferences: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      favorites: [],
      addFavorite: (advice) =>
        set((state) => ({
          favorites: state.favorites.some((f) => f.id === advice.id)
            ? state.favorites
            : [...state.favorites, advice],
        })),
      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id),
        })),
      clearFavorites: () => set({ favorites: [] }),

      searchHistory: [],
      addSearchHistory: (query) =>
        set((state) => {
          if (!query.trim()) return state;
          const filtered = state.searchHistory.filter((q) => q.toLowerCase() !== query.toLowerCase());
          return { searchHistory: [query, ...filtered].slice(0, 10) };
        }),
      clearSearchHistory: () => set({ searchHistory: [] }),
      removeSearchHistoryItem: (query) =>
        set((state) => ({
          searchHistory: state.searchHistory.filter((q) => q !== query),
        })),

      animationsEnabled: true,
      setAnimationsEnabled: (enabled) => set({ animationsEnabled: enabled }),

      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      toasts: [],
      addToast: (toastProps) => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({
          toasts: [...state.toasts, { id, ...toastProps }]
        }));
        return id;
      },
      removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter(t => t.id !== id)
      })),

      resetPreferences: () => set({ animationsEnabled: true, sidebarCollapsed: false }),
    }),
    {
      name: 'adviceflow-storage',
      partialize: (state) => Object.fromEntries(
        Object.entries(state).filter(([key]) => key !== 'toasts')
      ),
    }
  )
);
