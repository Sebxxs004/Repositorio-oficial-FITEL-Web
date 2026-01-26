'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function AdminRouteHandler() {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/operaciones-internas')

  useEffect(() => {
    const body = document.body
    
    if (isAdminRoute) {
      // Agregar clase al body para ocultar Header/Footer con CSS
      body.classList.add('admin-route')
    } else {
      // Remover clase al salir de rutas admin
      body.classList.remove('admin-route')
    }
    
    return () => {
      body.classList.remove('admin-route')
    }
  }, [isAdminRoute])

  return null
}
