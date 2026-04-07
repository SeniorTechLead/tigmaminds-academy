import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: __dirname,
  },
  // Environment variables available on client
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },
  async redirects() {
    return [
      { source: '/reference', destination: '/library', permanent: true },
      { source: '/reference/:slug', destination: '/library/:slug', permanent: true },
    ];
  },
};

export default nextConfig;
