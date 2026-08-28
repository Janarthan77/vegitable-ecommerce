import { Request, Response } from 'express';
import { prisma } from '../config/db.js';

export async function getCategories(_req: Request, res: Response): Promise<void> {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch categories', details: error.message });
  }
}

export async function createCategory(req: Request, res: Response): Promise<void> {
  try {
    const { name, tamilName, slug, emoji, color } = req.body;
    if (!name || !tamilName || !slug) {
      res.status(400).json({ error: 'Missing name, tamilName, or slug' });
      return;
    }

    const category = await prisma.category.create({
      data: {
        name,
        tamilName,
        slug: slug.toLowerCase().trim(),
        emoji: emoji || '🥬',
        color: color || 'emerald',
      },
    });
    res.status(201).json(category);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create category', details: error.message });
  }
}

export async function updateCategory(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { name, tamilName, slug, emoji, color } = req.body;
    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        tamilName,
        slug: slug ? slug.toLowerCase().trim() : undefined,
        emoji,
        color,
      },
    });
    res.json(category);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update category', details: error.message });
  }
}

export async function deleteCategory(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id } });
    res.json({ success: true, message: 'Category deleted' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete category', details: error.message });
  }
}
