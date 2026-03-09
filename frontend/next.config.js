/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Solo usar standalone en producción
  ...(process.env.NODE_ENV === 'production' && { output: 'standalone' }),
  // Transpilar recharts y leaflet para que funcionen con Next.js
  transpilePackages: ['recharts', 'leaflet', '@react-leaflet/core'],
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
    ALLOWED_ADMIN_IPS: process.env.ALLOWED_ADMIN_IPS || '', // IPs permitidas para panel admin
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
    const backendUrl = apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;
    // En producción usar URL interna Docker para evitar loop Nginx → Next.js → Nginx
    // NODE_ENV es 'production' durante `next build`, así queda compilado correctamente
    const internalBackendUrl = process.env.NODE_ENV === 'production'
      ? 'http://fitel-backend:8080'
      : backendUrl;
    return [
      {
        source: '/assets/:path*',
        destination: `${internalBackendUrl}/assets/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${internalBackendUrl}/uploads/:path*`,
      },
    ];
  },
  // Optimizaciones para desarrollo más rápido
  webpack: (config, { dev, isServer }) => {
    // Configurar webpack para resolver correctamente leaflet
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    }
    
    // Asegurar que webpack pueda resolver módulos de node_modules
    if (!config.resolve.modules) {
      config.resolve.modules = []
    }
    if (!config.resolve.modules.includes('node_modules')) {
      config.resolve.modules.push('node_modules')
    }
    
    // Configurar para que webpack pueda resolver importaciones dinámicas
    // No marcar leaflet como externo para que webpack pueda resolverlo
    config.externals = config.externals || []
    config.externals = config.externals.filter((external) => {
      if (typeof external === 'string' && external === 'leaflet') {
        return false // No excluir leaflet
      }
      if (typeof external === 'function') {
        // Filtrar funciones que excluyan leaflet
        return true
      }
      return true
    })
    
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000, // Verificar cambios cada segundo
        aggregateTimeout: 300, // Esperar 300ms antes de recompilar
      }
    }
    return config
  },
}

module.exports = nextConfig
