import jwt from 'jsonwebtoken';
import * as jose from 'jose';

const ACCESS_TOKEN_SECRET = process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET || 'your-access-token-secret';
const REFRESH_TOKEN_SECRET = process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET || 'your-refresh-token-secret';

// Tạo secret key cho jose
const secretKey = new TextEncoder().encode(ACCESS_TOKEN_SECRET);

export const setTokenCookie = (token) => {
  try {
    console.log("🍪 Setting cookie with token:", token.substring(0, 20) + "...");
    // Set cookie với httpOnly và secure
    document.cookie = `accessToken=${token}; path=/; max-age=604800; samesite=strict`; // 7 ngày = 604800 giây
    console.log("✅ Cookie set successfully");
    
    // Verify cookie was set
    const cookies = document.cookie.split(';');
    const accessTokenCookie = cookies.find(c => c.trim().startsWith('accessToken='));
    console.log("🔍 Verifying cookie:", accessTokenCookie ? "Found" : "Not found");
  } catch (error) {
    console.error("❌ Error setting cookie:", error);
  }
};

export const verifyJwtToken = async (token) => {
  try {
    console.log("🔑 Verifying token:", token.substring(0, 20) + "...");
    const { payload } = await jose.jwtVerify(token, secretKey);
    console.log("✅ Token verified successfully:", payload);
    return payload;
  } catch (error) {
    console.error("❌ Token verification failed:", error);
    return null;
  }
};

export const generateTokens = async (user) => {
  try {
    console.log("🎲 Generating tokens for user:", user.email);
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
    console.log("✅ Tokens generated successfully");
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("❌ Error generating tokens:", error);
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