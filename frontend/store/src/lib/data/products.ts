import { Product } from '@/types';

export const products: Product[] = [
  { id: 'p1', name: 'Tomato', tamilName: 'தக்காளி', price: 40, unit: 'kg', category: 'daily-essentials', emoji: '🍅', description: 'Fresh red tomatoes', inStock: true, isPopular: true },
  { id: 'p2', name: 'Onion', tamilName: 'வெங்காயம்', price: 60, unit: 'kg', category: 'daily-essentials', emoji: '🧅', description: 'Fresh onions', inStock: true, isPopular: true },
  { id: 'p3', name: 'Potato', tamilName: 'உருளைக்கிழங்கு', price: 50, unit: 'kg', category: 'daily-essentials', emoji: '🥔', description: 'Fresh potatoes', inStock: true, isPopular: true },
  { id: 'p4', name: 'Carrot', tamilName: 'கேரட்', price: 80, unit: 'kg', category: 'root-vegetables', emoji: '🥕', description: 'Crunchy orange carrots', inStock: true, discount: 10 },
  { id: 'p5', name: 'Beans', tamilName: 'பீன்ஸ்', price: 100, unit: 'kg', category: 'fruits-vegetables', emoji: '🫘', description: 'Fresh green beans', inStock: true },
  { id: 'p6', name: 'Brinjal', tamilName: 'கத்தரிக்காய்', price: 60, unit: 'kg', category: 'fruits-vegetables', emoji: '🍆', description: 'Fresh purple brinjal', inStock: true, isPopular: true },
  { id: 'p7', name: "Lady's Finger", tamilName: 'வெண்டைக்காய்', price: 70, unit: 'kg', category: 'fruits-vegetables', emoji: '🥒', description: 'Fresh ladies finger (Okra)', inStock: true },
  { id: 'p8', name: 'Capsicum', tamilName: 'குடைமிளகாய்', price: 120, unit: 'kg', category: 'fruits-vegetables', emoji: '🫑', description: 'Fresh green capsicum', inStock: true },
  { id: 'p9', name: 'Cabbage', tamilName: 'முட்டைக்கோஸ்', price: 40, unit: 'kg', category: 'leafy-greens', emoji: '🥬', description: 'Fresh cabbage', inStock: true },
  { id: 'p10', name: 'Cauliflower', tamilName: 'காலிஃபிளவர்', price: 50, unit: 'piece', category: 'fruits-vegetables', emoji: '🥦', description: 'Fresh cauliflower', inStock: true },
  { id: 'p11', name: 'Drumstick', tamilName: 'முருங்கைக்காய்', price: 80, unit: 'kg', category: 'fruits-vegetables', emoji: '🥖', description: 'Fresh drumsticks', inStock: true, isPopular: true },
  { id: 'p12', name: 'Bitter Gourd', tamilName: 'பாகற்காய்', price: 60, unit: 'kg', category: 'gourds', emoji: '🥒', description: 'Fresh bitter gourd', inStock: true },
  { id: 'p13', name: 'Snake Gourd', tamilName: 'புடலங்காய்', price: 50, unit: 'kg', category: 'gourds', emoji: '🥒', description: 'Fresh snake gourd', inStock: true },
  { id: 'p14', name: 'Bottle Gourd', tamilName: 'சுரைக்காய்', price: 40, unit: 'kg', category: 'gourds', emoji: '🥒', description: 'Fresh bottle gourd', inStock: true },
  { id: 'p15', name: 'Ridge Gourd', tamilName: 'பீர்க்கங்காய்', price: 60, unit: 'kg', category: 'gourds', emoji: '🥒', description: 'Fresh ridge gourd', inStock: true },
  { id: 'p16', name: 'Beetroot', tamilName: 'பீட்ரூட்', price: 70, unit: 'kg', category: 'root-vegetables', emoji: '🍠', description: 'Fresh beetroot', inStock: true, discount: 15 },
  { id: 'p17', name: 'Radish', tamilName: 'முள்ளங்கி', price: 40, unit: 'kg', category: 'root-vegetables', emoji: '🥕', description: 'Fresh white radish', inStock: true },
  { id: 'p18', name: 'Spinach', tamilName: 'பசலைக்கீரை', price: 30, unit: 'bunch', category: 'leafy-greens', emoji: '🥬', description: 'Fresh spinach', inStock: true, isPopular: true },
  { id: 'p19', name: 'Coriander', tamilName: 'கொத்தமல்லி', price: 20, unit: 'bunch', category: 'leafy-greens', emoji: '🌿', description: 'Fresh coriander leaves', inStock: true },
  { id: 'p20', name: 'Curry Leaves', tamilName: 'கறிவேப்பிலை', price: 20, unit: 'bunch', category: 'leafy-greens', emoji: '🍃', description: 'Fresh curry leaves', inStock: true },
  { id: 'p21', name: 'Green Chilli', tamilName: 'பச்சை மிளகாய்', price: 80, unit: 'kg', category: 'daily-essentials', emoji: '🌶️', description: 'Fresh green chillies', inStock: true },
  { id: 'p22', name: 'Ginger', tamilName: 'இஞ்சி', price: 120, unit: 'kg', category: 'daily-essentials', emoji: '🫚', description: 'Fresh ginger', inStock: true },
  { id: 'p23', name: 'Garlic', tamilName: 'பூண்டு', price: 150, unit: 'kg', category: 'daily-essentials', emoji: '🧄', description: 'Fresh garlic', inStock: true },
  { id: 'p24', name: 'Lemon', tamilName: 'எலுமிச்சை', price: 100, unit: 'kg', category: 'daily-essentials', emoji: '🍋', description: 'Fresh lemons', inStock: true },
  { id: 'p25', name: 'Coconut', tamilName: 'தேங்காய்', price: 40, unit: 'piece', category: 'daily-essentials', emoji: '🥥', description: 'Fresh coconut', inStock: true, isPopular: true }
];

export const getProductById = (id: string) => products.find(p => p.id === id);
export const getProductsByCategory = (slug: string) => products.filter(p => p.category === slug);
export const getPopularProducts = () => products.filter(p => p.isPopular);
export const searchProducts = (query: string) => {
  const q = query.toLowerCase();
  return products.filter(p => p.name.toLowerCase().includes(q) || p.tamilName.includes(q));
};
