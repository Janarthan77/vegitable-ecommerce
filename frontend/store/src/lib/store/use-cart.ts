'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, weight: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateWeight: (productId: string, weight: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, weight) => set((state) => {
        const existing = state.items.find((item) => item.product.id === product.id && item.weight === weight);
        if (existing) {
          return {
            items: state.items.map((item) =>
              item.product.id === product.id && item.weight === weight
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          };
        }
        return { items: [...state.items, { product, quantity: 1, weight }] };
      }),
      removeItem: (productId) => set((state) => ({
        items: state.items.filter((item) => item.product.id !== productId)
      })),
      updateQuantity: (productId, quantity) => set((state) => ({
        items: state.items.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      })),
      updateWeight: (productId, weight) => set((state) => ({
        items: state.items.map((item) =>
          item.product.id === productId ? { ...item, weight } : item
        )
      })),
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => {
          let priceCalc = item.product.price;
          if (item.product.unit === 'kg' || item.product.unit === 'g') {
             priceCalc = item.product.price * (item.weight / 1000);
          }
          return total + (priceCalc * item.quantity);
        }, 0);
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'veggie-cart',
    }
  )
);
