import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable server actions
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Standalone output for Docker
  output: 'standalone',
}

export default nextConfig
