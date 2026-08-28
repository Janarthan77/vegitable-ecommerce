export interface Product {
  id: string;
  name: string;
  tamilName: string;
  price: number;
  unit: string; // kg, g, piece, bunch
  category?: Category | string;
  categoryId: string;
  imageUrl?: string | null; // Cloudflare R2 / Cloudflare CDN Public URL
  emoji: string;
  description?: string;
  inStock: boolean;
  discount?: number;
  isPopular?: boolean;
}

export interface Category {
  id: string;
  name: string;
  tamilName: string;
  slug: string;
  emoji: string;
  color: string;
  _count?: { products: number };
}

export interface CartItem {
  product: Product;
  quantity: number;
  weight: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered' | 'cancelled';
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  createdAt: string;
  notes?: string;
}

export interface DashboardStats {
  totalProducts: number;
  inStockCount: number;
  totalOrders: number;
  totalRevenue: number;
}
