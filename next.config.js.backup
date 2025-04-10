const dotenv = require("dotenv");
dotenv.config();

/** @type {import('next').NextConfig} */
const DotenvWebpackPlugin = require('dotenv-webpack');

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },
  images: {
    domains: [
      "media.graphassets.com",
      "cdn.dribbble.com",
      "storage.googleapis.com",
      "firebasestorage.googleapis.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "dummyimage.com",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/webp"],
  },
  experimental: {
    optimizeCss: false,
    scrollRestoration: true,
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
};

module.exports = nextConfig;
