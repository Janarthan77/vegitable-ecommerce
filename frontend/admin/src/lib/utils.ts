export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatProductWeight(product: any, weight: number): string {
  if (!product) return `${weight}g`;
  if (product.unit === 'piece') return '1 piece';
  if (product.unit === 'bunch') return '1 bunch';
  if (product.unit === 'kg' || product.unit === 'g') {
    return weight >= 1000 ? `${weight / 1000} kg` : `${weight}g`;
  }
  return `${weight} ${product.unit || 'g'}`;
}

export function buildAdminOrderWhatsAppMessage(order: any): string {
  const displayId = order.id.length > 12 ? `#${order.id.slice(0, 8).toUpperCase()}` : `#${order.id}`;
  let msg = `🥬 *KAIKAARI - ORDER DETAILS* 🥬\n`;
  msg += `*Order ID:* ${displayId}\n`;
  msg += `*Status:* ${order.status.toUpperCase()}\n`;
  msg += `*Customer:* ${order.customerName}\n`;
  if (order.customerPhone) msg += `*Contact:* ${order.customerPhone}\n`;
  if (order.customerAddress) msg += `*Delivery Address:* ${order.customerAddress}\n`;
  if (order.notes) msg += `*Notes:* ${order.notes}\n`;

  msg += `\n📦 *ORDER ITEMS:*\n`;
  if (Array.isArray(order.items)) {
    order.items.forEach((item: any, idx: number) => {
      const p = item.product || {};
      const weightStr = formatProductWeight(p, item.weight || 1000);
      const itemPrice = (p.price || 0) * (item.quantity || 1);
      msg += `${idx + 1}. ${p.name || 'Produce Item'} ${p.tamilName ? `(${p.tamilName})` : ''} - ${item.quantity || 1} × ${weightStr} = ${formatPrice(itemPrice)}\n`;
    });
  }

  msg += `\n💰 *TOTAL AMOUNT:* ${formatPrice(order.total)}\n`;
  msg += `\nThank you for ordering with Kaikaari! 🌾`;
  return msg;
}
