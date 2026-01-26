/**
 * PQRSearchError Component
 * 
 * Componente responsable de mostrar mensajes de error.
 * Implementa el principio de Responsabilidad Única (SRP).
 */

'use client'

import { AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'

interface PQRSearchErrorProps {
  error: string
  onDismiss?: () => void
}

export function PQRSearchError({ error, onDismiss }: PQRSearchErrorProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!error) return null

  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
      {mounted ? (
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      ) : (
        <div className="w-5 h-5 bg-red-600/20 rounded flex-shrink-0 mt-0.5" style={{ display: 'inline-block' }}></div>
      )}
      <div className="flex-1">
        <p className="text-red-800 text-sm">{error}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-600 hover:text-red-800 text-sm font-medium"
          aria-label="Cerrar mensaje de error"
        >
          ✕
        </button>
      )}
    </div>
  )
}
