import jwt from "jsonwebtoken";
import * as jose from "jose";

const ACCESS_TOKEN_SECRET =
  process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET || "your-access-token-secret";
const REFRESH_TOKEN_SECRET =
  process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET || "your-refresh-token-secret";

// Tạo secret key cho jose
const secretKey = new TextEncoder().encode(ACCESS_TOKEN_SECRET);

export const setTokenCookie = (token) => {
  try {
    console.log(
      "🍪 Setting cookie with token:",
      token.substring(0, 20) + "..."
    );

    // Đảm bảo token hợp lệ
    if (!token) {
      console.error("❌ Token không hợp lệ khi thiết lập cookie");
      return false;
    }

    // Đặt cookie với các thông số chuẩn
    document.cookie = `accessToken=${token}; path=/; max-age=604800; samesite=strict`; // 7 ngày = 604800 giây

    // Xác minh cookie đã được thiết lập
    setTimeout(() => {
      const cookies = document.cookie.split(";");
      const accessTokenCookie = cookies.find((c) =>
        c.trim().startsWith("accessToken=")
      );

      if (accessTokenCookie) {
        console.log("✅ Cookie đã được thiết lập thành công");
        return true;
      } else {
        console.error(
          "⚠️ Không thể thiết lập cookie thông qua phương thức thông thường"
        );

        // Thử phương pháp khác, không dùng httpOnly
        document.cookie = `accessToken=${token}; path=/; max-age=604800`;
        console.log("🔄 Đã thử phương pháp cookie thay thế");
        return true;
      }
    }, 100);

    return true;
  } catch (error) {
    console.error("❌ Lỗi khi thiết lập cookie:", error);
    return false;
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
    const response = await fetch("/api/auth/generate-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate tokens");
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
