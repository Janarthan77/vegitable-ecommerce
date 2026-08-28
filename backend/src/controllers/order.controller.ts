import { Request, Response } from 'express';
import { prisma } from '../config/db.js';

export async function getOrders(req: Request, res: Response): Promise<void> {
  try {
    const { status } = req.query;
    const where: any = {};
    if (status && status !== 'all') {
      where.status = String(status);
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Parse JSON items for client convenience
    const formatted = orders.map((o) => ({
      ...o,
      items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items,
    }));

    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
}

export async function createOrder(req: Request, res: Response): Promise<void> {
  try {
    const { customerName, customerPhone, customerAddress, notes, items, total } = req.body;

    if (!customerName || !customerPhone || !customerAddress || !items || !total) {
      res.status(400).json({ error: 'Missing required order fields' });
      return;
    }

    const order = await prisma.order.create({
      data: {
        customerName,
        customerPhone,
        customerAddress,
        notes: notes || '',
        status: 'pending',
        total: Number(total),
        items: typeof items === 'string' ? items : JSON.stringify(items),
      },
    });

    res.status(201).json({
      ...order,
      items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
}

export async function updateOrderStatus(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
      return;
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    res.json({
      ...order,
      items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update order status', details: error.message });
  }
}

export async function getDashboardStats(_req: Request, res: Response): Promise<void> {
  try {
    const totalProducts = await prisma.product.count();
    const inStockCount = await prisma.product.count({ where: { inStock: true } });
    const ordersCount = await prisma.order.count();
    
    // Revenue sum
    const orders = await prisma.order.findMany({
      where: {
        status: { not: 'cancelled' },
      },
      select: { total: true },
    });
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

    res.json({
      totalProducts,
      inStockCount,
      totalOrders: ordersCount,
      totalRevenue,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats', details: error.message });
  }
}
