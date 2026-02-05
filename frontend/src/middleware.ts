import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rutas protegidas del panel de administración
const ADMIN_ROUTES = ['/operaciones-internas']
const PUBLIC_ADMIN_ROUTES = ['/operaciones-internas/login']

// Flag global para habilitar/deshabilitar temporalmente la restricción por IP
// Mientras esté en false, NO se hará ningún filtro por IP para rutas admin.
const ENABLE_ADMIN_IP_WHITELIST = false

// Función para obtener las IPs permitidas desde variables de entorno
// Si está vacío, se permiten todas las IPs (solo para desarrollo)
function getAllowedIPs(): string[] {
  const ips = process.env.ALLOWED_ADMIN_IPS
  if (!ips || ips.trim() === '') {
    return []
  }
  return ips.split(',').map(ip => ip.trim()).filter(ip => ip.length > 0)
}

// Función para obtener la IP real del cliente
function getClientIP(request: NextRequest): string {
  // Intentar obtener la IP real desde headers comunes
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIP) {
    return realIP
  }
  if (cfConnectingIP) {
    return cfConnectingIP
  }
  
  // Fallback: usar la IP de la conexión
  return request.ip || 'unknown'
}

// Función para verificar si la IP está permitida
function isIPAllowed(ip: string, allowedIPs: string[]): boolean {
  // Si no hay IPs configuradas, permitir todas (solo para desarrollo)
  if (allowedIPs.length === 0) {
    return true
  }
  
  // Verificar si la IP está en la lista blanca
  return allowedIPs.some(allowedIP => {
    // Soporte para rangos CIDR básicos (ej: 192.168.1.0/24)
    if (allowedIP.includes('/')) {
      // Implementación básica de verificación CIDR
      const [network, prefix] = allowedIP.split('/')
      const prefixLength = parseInt(prefix)
      // Simplificado: solo verificar si coincide el prefijo
      return ip.startsWith(network.split('.').slice(0, Math.floor(prefixLength / 8)).join('.'))
    }
    
    // Comparación exacta o comodín
    return ip === allowedIP || allowedIP === '*'
  })
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar si es una ruta de administración
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route))
  const isPublicAdminRoute = PUBLIC_ADMIN_ROUTES.some((route) => pathname === route)

  if (isAdminRoute) {
    // Restricción por IP DESHABILITADA mientras ENABLE_ADMIN_IP_WHITELIST sea false
    if (ENABLE_ADMIN_IP_WHITELIST) {
      // Verificar IP solo si hay IPs configuradas (aplica a todas las rutas admin, incluyendo login)
      const allowedIPs = getAllowedIPs()
      if (allowedIPs.length > 0) {
        const clientIP = getClientIP(request)
        
        if (!isIPAllowed(clientIP, allowedIPs)) {
          // IP no permitida - devolver 404 para ocultar la ruta
          console.warn(`Acceso denegado desde IP: ${clientIP} a ruta: ${pathname}`)
          return new NextResponse(null, { status: 404 })
        }
      }
    }

    // Si es la ruta de login, permitir acceso (solo verificar IP si está configurada)
    if (isPublicAdminRoute) {
      return NextResponse.next()
    }

    // Para otras rutas admin, verificar autenticación
    const token = request.cookies.get('admin_token')?.value
    const sessionToken = request.cookies.get('admin_session')?.value

    // Si no hay token, devolver 404 para ocultar la ruta
    if (!token && !sessionToken) {
      return new NextResponse(null, { status: 404 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/operaciones-internas/:path*',
  ],
}
