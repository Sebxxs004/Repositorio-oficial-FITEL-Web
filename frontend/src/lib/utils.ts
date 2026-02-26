import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utilidad para combinar clases de Tailwind
 * 
 * Implementa el principio DRY (Don't Repeat Yourself)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Resuelve la URL de un asset almacenado en el backend.
 * Las rutas relativas como /uploads/... se convierten en URLs absolutas
 * apuntando al servidor backend, evitando el 404 cuando el frontend y
 * el backend están en dominios distintos (Azure Container Apps).
 */
export function resolveAssetUrl(path: string | undefined | null): string {
  if (!path) return ''
  // Ya es una URL absoluta
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  // Ruta relativa al backend — construir URL absoluta
  if (path.startsWith('/uploads/') || path.startsWith('/assets/')) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
    // Quitar el sufijo /api para obtener la base del backend
    const backendBase = apiUrl.endsWith('/api')
      ? apiUrl.slice(0, -4)
      : apiUrl.replace(/\/api\/.*$/, '')
    return `${backendBase}${path}`
  }
  return path
}
