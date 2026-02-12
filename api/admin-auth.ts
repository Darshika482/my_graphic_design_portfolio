import type { VercelRequest, VercelResponse } from '@vercel/node';

// Support both ADMIN_PASSWORD (production) and VITE_ADMIN_PASSWORD (local dev fallback)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD || 'Darshika97550';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  if (!ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'Admin password not configured' });
  }

  if (password === ADMIN_PASSWORD) {
    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ error: 'Invalid password' });
  }
}
