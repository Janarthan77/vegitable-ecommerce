import https from 'https';

/**
 * Sends automated WhatsApp notification to Admin using CallMeBot API.
 * Free & Instant - No Meta approval required.
 */
export async function sendAdminWhatsAppAlert(order: {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes?: string | null;
  total: number;
  items: any[];
}) {
  const adminPhone = process.env.ADMIN_WHATSAPP_PHONE; // e.g. 919344059480
  const apiKey = process.env.CALLMEBOT_API_KEY; // e.g. 123456

  if (!adminPhone || !apiKey) {
    console.log(
      '⚠️ Admin WhatsApp auto-notification skipped: ADMIN_WHATSAPP_PHONE or CALLMEBOT_API_KEY not configured in backend .env'
    );
    return;
  }

  const displayId = order.id.length > 12 ? `#${order.id.slice(0, 8).toUpperCase()}` : `#${order.id}`;

  let message = `🛒 *NEW ORDER RECEIVED - KAIKAARI* 🛒\n`;
  message += `*Order ID:* ${displayId}\n`;
  message += `*Customer:* ${order.customerName}\n`;
  message += `*Phone:* ${order.customerPhone}\n`;
  message += `*Address:* ${order.customerAddress}\n`;
  if (order.notes) message += `*Notes:* ${order.notes}\n`;

  message += `\n📦 *ITEMS:*\n`;
  if (Array.isArray(order.items)) {
    order.items.forEach((item: any, idx: number) => {
      const p = item.product || {};
      message += `${idx + 1}. ${p.name || 'Produce Item'} ${p.tamilName ? `(${p.tamilName})` : ''} - ${item.quantity || 1} qty\n`;
    });
  }

  message += `\n💰 *Total Amount:* ₹${order.total}\n`;
  message += `\nPlease check Admin Portal to process this order.`;

  const encodedPhone = encodeURIComponent(adminPhone.replace(/[^0-9]/g, ''));
  const encodedText = encodeURIComponent(message);
  const encodedKey = encodeURIComponent(apiKey);

  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodedPhone}&text=${encodedText}&apikey=${encodedKey}`;

  return new Promise<void>((resolve) => {
    https
      .get(url, (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          console.log('✅ Automated WhatsApp notification sent to Admin:', body.slice(0, 100));
          resolve();
        });
      })
      .on('error', (err) => {
        console.error('❌ Error sending Admin WhatsApp alert:', err.message);
        resolve(); // resolve so it doesn't block order creation
      });
  });
}
