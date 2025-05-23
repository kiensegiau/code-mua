const dotenv = require("dotenv");
dotenv.config();

/** @type {import('next').NextConfig} */
const DotenvWebpackPlugin = require('dotenv-webpack');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },
  images: {
    domains: ['randomuser.me', 'images.unsplash.com'],
    unoptimized: true
  },
  experimental: {
    scrollRestoration: true
  },
  compress: true,
  webpack: (config) => {
    config.plugins.push(new DotenvWebpackPlugin());
    return config;
  },
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID:
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:
      process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    NEXT_PUBLIC_ACCESS_TOKEN_SECRET:
      process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET,
    NEXT_PUBLIC_REFRESH_TOKEN_SECRET:
      process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET,
    MONGODB_URI: process.env.MONGODB_URI,
  },
  // Tạm thời tắt redirects để tránh vòng lặp chuyển hướng
  async redirects() {
    return [
      // Đã tắt tạm thời để khắc phục vấn đề vòng lặp chuyển hướng
      // {
      //   source: '/((?!sign-in|sign-up|forgot-password|reset-password|api|_next|favicon.ico|static|public|hoc-thu-free).*)',
      //   missing: [
      //     {
      //       type: 'cookie',
      //       key: 'firebaseToken',
      //     },
      //   ],
      //   destination: '/sign-in',
      //   permanent: false,
      // },
    ];
  },
  poweredByHeader: false
};

module.exports = nextConfig;
