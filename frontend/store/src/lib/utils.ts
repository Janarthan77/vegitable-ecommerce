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

export function isStoreOpen(workingHours?: any): { isOpen: boolean; message: string } {
  if (!workingHours) return { isOpen: true, message: 'Open' };

  try {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    const currentDay = days[now.getDay()];

    if (Array.isArray(workingHours.workingDays) && !workingHours.workingDays.includes(currentDay)) {
      return { isOpen: false, message: `Closed today (${currentDay})` };
    }

    const parseToMinutes = (hourStr: string, minStr: string, periodStr: string) => {
      let h = parseInt(hourStr || '0', 10);
      const m = parseInt(minStr || '0', 10);
      if (periodStr === 'PM' && h < 12) h += 12;
      if (periodStr === 'AM' && h === 12) h = 0;
      return h * 60 + m;
    };

    const openMinutes = parseToMinutes(workingHours.openHour, workingHours.openMinute, workingHours.openPeriod);
    const closeMinutes = parseToMinutes(workingHours.closeHour, workingHours.closeMinute, workingHours.closePeriod);
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    if (currentMinutes >= openMinutes && currentMinutes <= closeMinutes) {
      return { isOpen: true, message: 'Shop is Open' };
    }

    const openTimeStr = `${workingHours.openHour}:${workingHours.openMinute} ${workingHours.openPeriod}`;
    const closeTimeStr = `${workingHours.closeHour}:${workingHours.closeMinute} ${workingHours.closePeriod}`;
    return {
      isOpen: false,
      message: `Shop is currently Closed. Open hours: ${openTimeStr} – ${closeTimeStr}`,
    };
  } catch {
    return { isOpen: true, message: 'Open' };
  }
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
  let msg = `✅ *ORDER CONFIRMED - KAIKAARI* ✅\n`;
  if (orderId) msg += `*Order ID:* #${orderId}\n`;
  msg += `*Customer Name:* ${customerName}\n`;
  if (phone) msg += `*Contact:* ${phone}\n`;
  if (address) msg += `*Delivery Address:* ${address}\n`;
  if (notes) msg += `*Special Instructions:* ${notes}\n`;
  msg += `\n📦 *ORDERED ITEMS:*\n`;

  items.forEach((item, index) => {
    const p = item.product;
    const weightStr = formatProductWeight(p, item.weight);
    const itemTotal = getItemTotalPrice(item);
    msg += `${index + 1}. ${p.name} ${p.tamilName ? `(${p.tamilName})` : ''} - ${item.quantity} × ${weightStr} = ${formatPrice(itemTotal)}\n`;
  });

  msg += `\n💰 *TOTAL PAYABLE AMOUNT:* ${formatPrice(total)}\n`;
  msg += `\nOrder has been placed and confirmed. Kindly dispatch for delivery. Thank you!`;

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
