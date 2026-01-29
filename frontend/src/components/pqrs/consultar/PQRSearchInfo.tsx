/**
 * PQRSearchInfo Component
 * 
 * Componente responsable de mostrar información adicional y ayuda.
 * Implementa el principio de Responsabilidad Única (SRP).
 */

'use client'

import { Info } from 'lucide-react'
import { useState, useEffect } from 'react'
import { FITEL_PHONE_DISPLAY, FITEL_PHONE_TEL, FITEL_WHATSAPP_URL } from '@/config/constants'

export function PQRSearchInfo() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="bg-secondary-blue/10 rounded-xl p-6">
      <div className="flex items-start space-x-3">
        {mounted ? (
          <Info className="w-5 h-5 text-secondary-blue flex-shrink-0 mt-0.5" />
        ) : (
          <div className="w-5 h-5 bg-secondary-blue/20 rounded flex-shrink-0 mt-0.5" style={{ display: 'inline-block' }}></div>
        )}
        <div>
          <h3 className="font-semibold text-neutral-dark mb-2">¿Necesitas ayuda?</h3>
          <p className="text-neutral-gray text-sm mb-3">
            Si no encuentras tu PQR o tienes alguna duda, puedes contactarnos directamente:
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <a href={FITEL_PHONE_TEL} className="text-primary-red hover:underline font-medium">
              📞 Llamar: {FITEL_PHONE_DISPLAY}
            </a>
            <a
              href={FITEL_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-red hover:underline font-medium"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
