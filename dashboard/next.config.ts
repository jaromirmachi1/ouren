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
}

export default nextConfig
