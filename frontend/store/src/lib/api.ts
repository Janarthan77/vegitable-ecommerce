import { Product, Category, Order } from '@/types';

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api';
const API_BASE_URL = RAW_API_URL.replace(/\/+$/, '').endsWith('/api')
  ? RAW_API_URL.replace(/\/+$/, '')
  : `${RAW_API_URL.replace(/\/+$/, '')}/api`;

export async function fetchProducts(params?: { category?: string; search?: string; popular?: boolean }): Promise<Product[]> {
  try {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'all') query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.popular !== undefined) query.set('popular', String(params.popular));

    const res = await fetch(`${API_BASE_URL}/products?${query.toString()}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  } catch (error) {
    console.warn('Backend API not reachable, using fallback data:', error);
    // Fallback data
    return [];
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return await res.json();
  } catch (error) {
    console.warn('Backend categories API not reachable, using fallback:', error);
    return [
      { id: '1', name: 'Leafy Greens', tamilName: 'கீரை வகைகள்', slug: 'leafy-greens', emoji: '🥬', color: 'emerald' },
      { id: '2', name: 'Root Vegetables', tamilName: 'கிழங்கு வகைகள்', slug: 'root-vegetables', emoji: '🥕', color: 'orange' },
      { id: '3', name: 'Gourds', tamilName: 'சுரை வகைகள்', slug: 'gourds', emoji: '🥒', color: 'lime' },
      { id: '4', name: 'Daily Essentials', tamilName: 'தினசரி தேவை', slug: 'daily-essentials', emoji: '🧅', color: 'rose' },
      { id: '5', name: 'Fruits & Vegetables', tamilName: 'காய்கறிகள்', slug: 'fruits-vegetables', emoji: '🍅', color: 'yellow' },
    ];
  }
}

export async function submitOrder(orderData: {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes?: string;
  items: any[];
  total: number;
}): Promise<Order> {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to place order');
  }

  return await res.json();
}

export async function fetchStoreSettings(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/settings`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.warn('Could not fetch store settings:', error);
    return null;
  }
}
