import { Request, Response } from 'express';
import { prisma } from '../config/db.js';

export async function getSettings(_req: Request, res: Response): Promise<void> {
  try {
    const records = await prisma.storeSetting.findMany();
    const result: Record<string, any> = {};
    for (const r of records) {
      try {
        result[r.key] = JSON.parse(r.value);
      } catch {
        result[r.key] = r.value;
      }
    }

    const defaultSettings = {
      shop_profile: {
        shopName: 'Fresh Veggies 🥬',
        phone: '+91 98765 43210',
        address: '123 Anna Salai, Chennai, TN 600002',
      },
      delivery_settings: {
        deliveryRadius: '10',
        minOrder: '100',
        deliveryCharge: '0',
      },
      working_hours: {
        openHour: '06',
        openMinute: '00',
        openPeriod: 'AM',
        closeHour: '09',
        closeMinute: '00',
        closePeriod: 'PM',
        workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
    };

    res.json({ ...defaultSettings, ...result });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch store settings', details: error.message });
  }
}

export async function updateSettings(req: Request, res: Response): Promise<void> {
  try {
    const payload = req.body;

    for (const [key, value] of Object.entries(payload)) {
      const stringVal = typeof value === 'string' ? value : JSON.stringify(value);
      await prisma.storeSetting.upsert({
        where: { key },
        update: { value: stringVal },
        create: { key, value: stringVal },
      });
    }

    res.json({ success: true, message: 'Settings saved successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update store settings', details: error.message });
  }
}
