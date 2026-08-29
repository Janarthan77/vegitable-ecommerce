export interface Product {
  id: string;
  name: string;
  tamilName: string;
  price: number;
  unit: string;
  category?: string | Category;
  categoryId?: string;
  imageUrl?: string | null;
  emoji: string;
  description?: string;
  inStock: boolean;
  discount?: number;
  isPopular?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  tamilName: string;
  slug: string;
  emoji: string;
  color: string;
  _count?: { products: number };
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  weight: number; // in grams or count
}

export type WeightOption = {
  label: string;
  grams: number;
};

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
