import { Product, Category, Order, DashboardStats } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api';

/**
 * Uploads an image file to backend and returns the public image URL.
 */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to upload image');
  }

  const data = await res.json();
  return data.imageUrl;
}

export async function fetchProducts(params?: { category?: string; search?: string }): Promise<Product[]> {
  const query = new URLSearchParams();
  if (params?.category && params.category !== 'all') query.set('category', params.category);
  if (params?.search) query.set('search', params.search);

  const res = await fetch(`${API_BASE_URL}/products?${query.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch products');
  return await res.json();
}

export async function createProduct(productData: Partial<Product>): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create product');
  }

  return await res.json();
}

export async function updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update product');
  }

  return await res.json();
}

export async function toggleStock(id: string): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/products/${id}/toggle-stock`, {
    method: 'PATCH',
  });
  if (!res.ok) throw new Error('Failed to toggle product stock');
  return await res.json();
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete product');
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE_URL}/categories`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return await res.json();
}

export async function createCategory(data: Partial<Category>): Promise<Category> {
  const res = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create category');
  return await res.json();
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<Category> {
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update category');
  return await res.json();
}

export async function deleteCategory(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete category');
}

export async function fetchOrders(status?: string): Promise<Order[]> {
  const query = status && status !== 'all' ? `?status=${status}` : '';
  const res = await fetch(`${API_BASE_URL}/orders${query}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch orders');
  return await res.json();
}

export async function updateOrderStatus(id: string, status: string): Promise<Order> {
  const res = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update order status');
  return await res.json();
}

export async function deleteOrder(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete order');
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await fetch(`${API_BASE_URL}/orders/stats`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch stats');
  return await res.json();
}

export async function adminLogin(password: string): Promise<{ success: boolean; token?: string; shopName?: string }> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Invalid password');
  }

  return data;
}

export async function fetchStoreSettings(): Promise<any> {
  const url = `${API_BASE_URL}/settings`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch settings: ${res.status}`);
  }
  return await res.json();
}

export async function updateStoreSettings(data: any): Promise<any> {
  const url = `${API_BASE_URL}/settings`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to update settings: ${res.status}`);
  }
  return await res.json();
}
