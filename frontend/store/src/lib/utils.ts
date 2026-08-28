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

export function buildWhatsAppMessage(items: CartItem[], total: number, customerName: string): string {
  const intro = `Hello, I am ${customerName}. I would like to place an order:%0A%0A`;
  const itemsText = items.map((item, index) => {
    const p = item.product;
    let weightText = formatWeight(item.weight);
    if (p.unit === 'piece' || p.unit === 'bunch') {
      weightText = `${item.quantity} ${p.unit}(s)`;
    }
    const itemTotal = (p.unit === 'kg' || p.unit === 'g') 
      ? p.price * (item.weight / 1000) * item.quantity
      : p.price * item.quantity;
      
    return `${index + 1}. ${p.name} (${p.tamilName}) - ${weightText} - ${formatPrice(itemTotal)}`;
  }).join('%0A');
  const outro = `%0A%0ATotal Amount: ${formatPrice(total)}%0A%0APlease confirm my order.`;
  return intro + itemsText + outro;
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
