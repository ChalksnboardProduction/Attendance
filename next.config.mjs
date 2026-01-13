/** @type {import('next').nextConfig} */
const nextConfig = {
  reactCompiler: true,
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
  // Enable compression
  compress: true,
  // Production optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  // Images configuration
  images: {
    unoptimized: false,
  },
};

export default nextConfig;
