import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: '/admin',
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
  turbopack: {
    root: process.cwd(),
  },
  // basePath mounts the portal at /admin only — without these, `/` is a platform 404.
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/robots.txt',
          destination: '/site/robots.txt',
          basePath: false,
        },
        {
          source: '/sitemap.xml',
          destination: '/site/sitemap.xml',
          basePath: false,
        },
        {
          source: '/og-image.jpg',
          destination: '/site/og-image.jpg',
          basePath: false,
        },
      ],
      fallback: [
        {
          source: '/',
          destination: '/site/index.html',
          basePath: false,
        },
        {
          source: '/:path*',
          destination: '/site/index.html',
          basePath: false,
        },
      ],
    }
  },
}

export default nextConfig
