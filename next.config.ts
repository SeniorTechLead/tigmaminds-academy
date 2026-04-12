import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: __dirname,
  },
  // Environment variables available on client
  // NEXT_PUBLIC_ env vars are auto-exposed by Next.js — no manual override needed
  async redirects() {
    return [
      { source: '/reference', destination: '/library', permanent: true },
      { source: '/reference/:slug', destination: '/library/:slug', permanent: true },
    ];
  },
};

export default nextConfig;
