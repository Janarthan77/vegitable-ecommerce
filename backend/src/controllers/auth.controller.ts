import { Request, Response } from 'express';

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_SECRET_PASSWORD || 'admin123';

    if (password === adminPassword) {
      res.json({
        success: true,
        token: 'admin_session_token_' + Date.now(),
        message: 'Authentication successful',
        shopName: 'Fresh Veggies 🥬',
      });
      return;
    }

    res.status(401).json({
      success: false,
      error: 'Invalid admin password',
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Auth failed', details: error.message });
  }
}
