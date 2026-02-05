'use client'

import { usePathname } from 'next/navigation'
import { ChatBot } from './ChatBot'

/**
 * Envuelve el ChatBot y lo oculta en las rutas de administración
 * (incluyendo el login de /operaciones-internas).
 */
export function ChatBotWrapper() {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/operaciones-internas')

  if (isAdminRoute) {
    return null
  }

  return <ChatBot />
}

