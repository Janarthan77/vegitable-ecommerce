import { CartItem } from '@/types';

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatWeight(grams: number): string {
  if (grams >= 1000) {
    return `${grams / 1000} kg`;
  }
  return `${grams}g`;
}

export function getItemUnitPrice(product: any, weight: number): number {
  const discountMultiplier = 1 - (product.discount || 0) / 100;
  const basePrice = product.price * discountMultiplier;
  if (product.unit === 'kg' || product.unit === 'g') {
    return basePrice * (weight / 1000);
  }
  return basePrice;
}

export function getItemTotalPrice(item: CartItem): number {
  return getItemUnitPrice(item.product, item.weight) * item.quantity;
}

export function formatProductWeight(product: any, weight: number): string {
  if (product.unit === 'piece') return '1 piece';
  if (product.unit === 'bunch') return '1 bunch';
  if (product.unit === 'kg' || product.unit === 'g') {
    return weight >= 1000 ? `${weight / 1000} kg` : `${weight}g`;
  }
  return `${weight} ${product.unit}`;
}

export function buildWhatsAppMessage(
  items: CartItem[], 
  total: number, 
  customerName: string,
  phone?: string,
  address?: string,
  notes?: string,
  orderId?: string
): string {
  let msg = `🥬 *NEW VEGETABLE ORDER* 🥬\n`;
  if (orderId) msg += `*Order ID:* #${orderId}\n`;
  msg += `*Customer:* ${customerName}\n`;
  if (phone) msg += `*Phone:* ${phone}\n`;
  if (address) msg += `*Address:* ${address}\n`;
  if (notes) msg += `*Notes:* ${notes}\n`;
  msg += `\n*ITEMS ORDERED:*\n`;

  items.forEach((item, index) => {
    const p = item.product;
    const weightStr = formatProductWeight(p, item.weight);
    const itemTotal = getItemTotalPrice(item);
    msg += `${index + 1}. ${p.name} (${p.tamilName || ''}) - ${item.quantity}× ${weightStr} = ${formatPrice(itemTotal)}\n`;
  });

  msg += `\n*TOTAL PAYABLE:* ${formatPrice(total)}\n`;
  msg += `\nPlease confirm my order and dispatch delivery. Thank you!`;

  return msg;
}

export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function generateOrderId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'ORD-';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
