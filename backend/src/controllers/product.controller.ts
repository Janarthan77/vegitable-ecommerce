import { Request, Response } from 'express';
import { prisma } from '../config/db.js';

export async function getProducts(req: Request, res: Response): Promise<void> {
  try {
    const { category, search, inStock, popular } = req.query;

    const where: any = {};

    if (category && category !== 'all') {
      where.category = {
        slug: String(category),
      };
    }

    if (search) {
      const q = String(search);
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { tamilName: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (inStock !== undefined) {
      where.inStock = inStock === 'true';
    }

    if (popular !== undefined) {
      where.isPopular = popular === 'true';
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(products);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products', details: error.message });
  }
}

export async function getProductById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json(product);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch product', details: error.message });
  }
}

export async function createProduct(req: Request, res: Response): Promise<void> {
  try {
    const {
      name,
      tamilName,
      price,
      unit,
      imageUrl, // Cloudflare image URL
      emoji,
      description,
      inStock,
      discount,
      isPopular,
      categoryId,
    } = req.body;

    if (!name || !tamilName || price === undefined || !categoryId) {
      res.status(400).json({ error: 'Missing required fields (name, tamilName, price, categoryId)' });
      return;
    }

    const product = await prisma.product.create({
      data: {
        name,
        tamilName,
        price: Number(price),
        unit: unit || 'kg',
        imageUrl: imageUrl || null, // Stores Cloudflare Image URL
        emoji: emoji || '🥬',
        description: description || '',
        inStock: inStock !== undefined ? Boolean(inStock) : true,
        discount: discount ? Number(discount) : 0,
        isPopular: isPopular !== undefined ? Boolean(isPopular) : false,
        categoryId,
      },
      include: { category: true },
    });

    res.status(201).json(product);
  } catch (error: any) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product', details: error.message });
  }
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const {
      name,
      tamilName,
      price,
      unit,
      imageUrl,
      emoji,
      description,
      inStock,
      discount,
      isPopular,
      categoryId,
    } = req.body;

    const data: any = {};
    if (name !== undefined) data.name = name;
    if (tamilName !== undefined) data.tamilName = tamilName;
    if (price !== undefined) data.price = Number(price);
    if (unit !== undefined) data.unit = unit;
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (emoji !== undefined) data.emoji = emoji;
    if (description !== undefined) data.description = description;
    if (inStock !== undefined) data.inStock = Boolean(inStock);
    if (discount !== undefined) data.discount = Number(discount);
    if (isPopular !== undefined) data.isPopular = Boolean(isPopular);
    if (categoryId !== undefined) data.categoryId = categoryId;

    const product = await prisma.product.update({
      where: { id },
      data,
      include: { category: true },
    });

    res.json(product);
  } catch (error: any) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product', details: error.message });
  }
}

export async function toggleStock(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const current = await prisma.product.findUnique({ where: { id } });
    if (!current) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const updated = await prisma.product.update({
      where: { id },
      data: { inStock: !current.inStock },
      include: { category: true },
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to toggle stock', details: error.message });
  }
}

export async function deleteProduct(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.json({ success: true, message: 'Product deleted' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete product', details: error.message });
  }
}
