import type { NextConfig } from 'next'

const sanityProjectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID || 'xditqcf8'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
  turbopack: {
    root: process.cwd(),
  },
  // Same-origin proxy so the marketing SPA avoids Sanity CORS on Vercel.
  async rewrites() {
    return [
      {
        source: '/sanity-api/:path*',
        destination: `https://${sanityProjectId}.api.sanity.io/:path*`,
      },
    ]
  },
}

export default nextConfig
