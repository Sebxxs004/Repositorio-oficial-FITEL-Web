'use client'

import { X, CheckCircle, Info, MessageCircle, Phone } from 'lucide-react'
import { useEffect } from 'react'
import { FITEL_WHATSAPP_URL } from '@/config/constants'

interface CoverageResultModalProps {
  isOpen: boolean
  onClose: () => void
  result: {
    available: boolean
    message: string
    distance?: number
  } | null
  address: string
}

export function CoverageResultModal({ isOpen, onClose, result, address }: CoverageResultModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !result) return null

  const handleWhatsApp = () => {
    const message = result.available
      ? `Hola, acabo de verificar mi dirección "${address}" y está en su zona de cobertura. Me gustaría obtener más información sobre los planes disponibles.`
      : `Hola, acabo de verificar mi dirección "${address}" y me gustaría saber si tienen planes para expandir la cobertura a mi zona o si hay alguna alternativa disponible.`
    
    window.open(
      `${FITEL_WHATSAPP_URL}?text=${encodeURIComponent(message)}`,
      '_blank'
    )
  }

  const handleContact = () => {
    window.location.href = '/contacto'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-neutral-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className={`p-6 rounded-t-2xl ${
          result.available 
            ? 'bg-gradient-to-r from-green-500 to-green-600' 
            : 'bg-gradient-to-r from-yellow-500 to-yellow-600'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              {result.available ? (
                <div className="bg-white/20 p-3 rounded-full">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              ) : (
                <div className="bg-white/20 p-3 rounded-full">
                  <Info className="w-8 h-8 text-white" />
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {result.available ? '¡Cobertura Disponible!' : 'Verificación de Cobertura'}
                </h2>
                <p className="text-white/90 text-sm">
                  {result.available 
                    ? 'Tu dirección está en nuestra zona de cobertura'
                    : 'Estamos trabajando para llegar a tu zona'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Dirección verificada */}
          <div className="mb-6 p-4 bg-neutral-gray-light rounded-lg">
            <p className="text-sm text-neutral-gray mb-1">Dirección verificada:</p>
            <p className="font-semibold text-neutral-dark">{address}</p>
            {result.distance !== undefined && (
              <p className="text-xs text-neutral-gray mt-2">
                Distancia desde el centro de cobertura: {result.distance.toFixed(1)} km
              </p>
            )}
          </div>

          {/* Mensaje */}
          <div className={`mb-6 p-4 rounded-lg ${
            result.available 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <p className={`font-medium ${
              result.available ? 'text-green-800' : 'text-yellow-800'
            }`}>
              {result.message}
            </p>
          </div>

          {/* Call to Action */}
          <div className="space-y-4">
            <p className="text-center text-neutral-gray font-medium">
              {result.available 
                ? '¿Listo para contratar? Contáctanos y te ayudamos a elegir el plan perfecto.'
                : '¿Quieres más información? Contáctanos y te ayudamos a encontrar una solución.'}
            </p>

            {/* Botones de acción */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleWhatsApp}
                className="flex items-center justify-center space-x-3 w-full px-6 py-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-6 h-6" />
                <span>Contactar por WhatsApp</span>
              </button>

              <button
                onClick={handleContact}
                className="flex items-center justify-center space-x-3 w-full px-6 py-4 bg-secondary-blue hover:bg-secondary-blue-dark text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Phone className="w-6 h-6" />
                <span>Contactar Asesor</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
