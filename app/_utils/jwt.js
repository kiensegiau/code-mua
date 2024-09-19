import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET || 'your-access-token-secret';
const REFRESH_TOKEN_SECRET = process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET || 'your-refresh-token-secret';
export const generateTokens = async (user) => {
  try {
    const response = await fetch('/api/auth/generate-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate tokens');
    }

    const { accessToken, refreshToken } = await response.json();
    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Error generating tokens:', error);
    throw error;
  }
};

export const verifyAccessToken = (token) => {
  // Implement client-side token verification if needed
};

export const verifyRefreshToken = (token) => {
  // Implement client-side refresh token verification if needed
};

export const generateAccessToken = generateTokens;
export const generateRefreshToken = generateTokens;