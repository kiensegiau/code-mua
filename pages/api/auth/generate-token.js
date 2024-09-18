import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { user } = req.body;
    if (!user || !user.uid || !user.email) {
      return res.status(400).json({ error: 'Invalid user data' });
    }

    try {
      const accessToken = jwt.sign({ uid: user.uid, email: user.email }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
      const refreshToken = jwt.sign({ uid: user.uid }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
      
      res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
      console.error('Error generating tokens:', error);
      res.status(500).json({ error: 'Failed to generate tokens' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}