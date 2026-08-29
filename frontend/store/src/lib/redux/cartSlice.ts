import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<{ product: Product; weight: number }>) {
      const { product, weight } = action.payload;
      const existing = state.items.find(
        (item) => item.product.id === product.id && item.weight === weight
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ product, quantity: 1, weight });
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        (item) => item.product.id !== action.payload
      );
    },
    updateQuantity(
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) {
      const item = state.items.find(
        (i) => i.product.id === action.payload.productId
      );
      if (item) item.quantity = action.payload.quantity;
    },
    updateWeight(
      state,
      action: PayloadAction<{ productId: string; weight: number }>
    ) {
      const item = state.items.find(
        (i) => i.product.id === action.payload.productId
      );
      if (item) item.weight = action.payload.weight;
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, updateQuantity, updateWeight, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
