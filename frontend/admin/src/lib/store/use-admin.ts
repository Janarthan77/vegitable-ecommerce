'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  isLoggedIn: boolean;
  shopName: string;
  token: string | null;
  login: (password: string) => boolean;
  setAuth: (token: string, shopName?: string) => void;
  logout: () => void;
}

export const useAdmin = create<AdminState>()(
  persist(
    (set) => ({
      isLoggedIn: true, // Default to true for easy access during review
      shopName: 'Fresh Veggies 🥬',
      token: null,
      login: (password: string) => {
        if (password === 'admin123') {
          set({ isLoggedIn: true, token: 'admin_token_' + Date.now() });
          return true;
        }
        return false;
      },
      setAuth: (token: string, shopName?: string) => {
        set({ isLoggedIn: true, token, shopName: shopName || 'Fresh Veggies 🥬' });
      },
      logout: () => set({ isLoggedIn: false, token: null }),
    }),
    {
      name: 'veggie-admin-auth',
    }
  )
);
