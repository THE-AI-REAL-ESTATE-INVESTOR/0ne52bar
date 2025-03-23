/** @type {import('next').NextConfig} */
const nextConfig = {
  // Experimental features configuration
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000']
    }
  },
  // Enable strict mode for better development practices
  reactStrictMode: true,
  // Ensure proper environment variable loading
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
  // Add custom headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  // Optimize image domains if needed
  images: {
    domains: ['localhost', 'images.unsplash.com'],
  },
}

module.exports = nextConfig 