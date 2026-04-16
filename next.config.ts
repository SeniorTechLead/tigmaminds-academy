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
  async headers() {
    return [
      {
        // All page routes — never cache HTML at the CDN edge.
        // Static assets (_next/static) are content-hashed and cached separately by Vercel.
        source: '/((?!_next/static|_next/image|content/|favicon).*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0, s-maxage=0' },
          { key: 'CDN-Cache-Control', value: 'no-store' },
          { key: 'Surrogate-Control', value: 'no-store' },
        ],
      },
    ];
  },
};

export default nextConfig;
