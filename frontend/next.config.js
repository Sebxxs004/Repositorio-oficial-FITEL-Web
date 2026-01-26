/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Solo usar standalone en producción
  ...(process.env.NODE_ENV === 'production' && { output: 'standalone' }),
  // Transpilar recharts para que funcione con Next.js
  transpilePackages: ['recharts'],
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
    ALLOWED_ADMIN_IPS: process.env.ALLOWED_ADMIN_IPS || '', // IPs permitidas para panel admin
  },
  // Optimizaciones para desarrollo más rápido
  ...(process.env.NODE_ENV === 'development' && {
    webpack: (config, { dev, isServer }) => {
      if (dev && !isServer) {
        config.watchOptions = {
          poll: 1000, // Verificar cambios cada segundo
          aggregateTimeout: 300, // Esperar 300ms antes de recompilar
        }
      }
      return config
    },
  }),
}

module.exports = nextConfig
