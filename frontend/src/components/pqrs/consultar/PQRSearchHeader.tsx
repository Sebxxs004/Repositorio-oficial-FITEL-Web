/**
 * PQRSearchHeader Component
 * 
 * Componente responsable de mostrar el header de la página de consulta.
 * Implementa el principio de Responsabilidad Única (SRP).
 */

'use client'

import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'

export function PQRSearchHeader() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-red/10 mb-4">
        {mounted ? (
          <Search className="w-8 h-8 text-primary-red" />
        ) : (
          <div className="w-8 h-8 bg-primary-red/20 rounded" style={{ display: 'inline-block' }}></div>
        )}
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-neutral-dark mb-4">
        Consultar Estado de PQR
      </h1>
      <p className="text-base md:text-lg text-neutral-gray max-w-2xl mx-auto">
        Ingresa el número de tu PQR o tu número de documento para consultar el estado de tu solicitud
      </p>
    </div>
  )
}
