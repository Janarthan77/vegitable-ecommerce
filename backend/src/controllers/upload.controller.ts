import { Request, Response } from 'express';
import { uploadToCloudflare } from '../config/cloudflare.js';

export async function uploadImage(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No image file uploaded' });
      return;
    }

    const publicUrl = await uploadToCloudflare(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    res.status(200).json({
      success: true,
      imageUrl: publicUrl,
      filename: req.file.originalname,
      size: req.file.size,
    });
  } catch (error: any) {
    console.error('Error uploading image to Cloudflare:', error);
    res.status(500).json({
      error: 'Failed to upload image to Cloudflare storage',
      details: error.message,
    });
  }
}
