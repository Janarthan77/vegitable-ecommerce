import { Category } from '@/types';

export const categories: Category[] = [
  { id: 'c1', name: 'Leafy Greens', tamilName: 'கீரை வகைகள்', slug: 'leafy-greens', emoji: '🥬', color: 'from-emerald-400 to-green-500' },
  { id: 'c2', name: 'Root Vegetables', tamilName: 'கிழங்கு வகைகள்', slug: 'root-vegetables', emoji: '🥕', color: 'from-orange-400 to-amber-500' },
  { id: 'c3', name: 'Gourds', tamilName: 'சுரை வகைகள்', slug: 'gourds', emoji: '🫛', color: 'from-lime-400 to-green-500' },
  { id: 'c4', name: 'Daily Essentials', tamilName: 'தினசரி தேவை', slug: 'daily-essentials', emoji: '🧅', color: 'from-red-400 to-rose-500' },
  { id: 'c5', name: 'Fruits & Vegetables', tamilName: 'காய்கறிகள்', slug: 'fruits-vegetables', emoji: '🍅', color: 'from-yellow-400 to-orange-500' }
];

export const getCategoryBySlug = (slug: string) => categories.find(c => c.slug === slug);
