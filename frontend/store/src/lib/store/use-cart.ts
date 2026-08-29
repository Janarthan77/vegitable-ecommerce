'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  addItem as addItemAction,
  removeItem as removeItemAction,
  updateQuantity as updateQuantityAction,
  updateWeight as updateWeightAction,
  clearCart as clearCartAction,
} from '@/lib/redux/cartSlice';
import { Product } from '@/types';

import { getItemTotalPrice } from '@/lib/utils';

export function useCart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);

  function addItem(product: Product, weight: number) {
    dispatch(addItemAction({ product, weight }));
  }

  function removeItem(productId: string) {
    dispatch(removeItemAction(productId));
  }

  function updateQuantity(productId: string, quantity: number) {
    dispatch(updateQuantityAction({ productId, quantity }));
  }

  function updateWeight(productId: string, weight: number) {
    dispatch(updateWeightAction({ productId, weight }));
  }

  function clearCart() {
    dispatch(clearCartAction());
  }

  function getTotal(): number {
    return items.reduce((total, item) => {
      return total + getItemTotalPrice(item);
    }, 0);
  }

  function getItemCount(): number {
    return items.reduce((count, item) => count + item.quantity, 0);
  }

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    updateWeight,
    clearCart,
    getTotal,
    getItemCount,
  };
}
