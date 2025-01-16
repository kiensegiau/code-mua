import * as jose from 'jose';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// Tạo secret key cho jose
const accessSecretKey = new TextEncoder().encode(ACCESS_TOKEN_SECRET);
const refreshSecretKey = new TextEncoder().encode(REFRESH_TOKEN_SECRET);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { user } = req.body;
    if (!user || !user.uid || !user.email) {
      return res.status(400).json({ error: 'Invalid user data' });
    }

    try {
      // Tạo access token
      const accessToken = await new jose.SignJWT({ uid: user.uid, email: user.email })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('15m')
        .sign(accessSecretKey);

      // Tạo refresh token
      const refreshToken = await new jose.SignJWT({ uid: user.uid })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(refreshSecretKey);
      
      res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
      console.error('Error generating tokens:', error);
      res.status(500).json({ error: 'Failed to generate tokens' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}