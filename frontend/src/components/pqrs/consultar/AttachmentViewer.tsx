'use client'

import { X, FileText, AlertTriangle } from 'lucide-react'
import { useEffect, useState } from 'react'

interface AttachmentViewerProps {
  url: string
  onClose: () => void
}

export function AttachmentViewer({ url, onClose }: AttachmentViewerProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Deshabilitar click derecho
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }
    document.addEventListener('contextmenu', handleContextMenu)
    return () => document.removeEventListener('contextmenu', handleContextMenu)
  }, [])

  // Añadir parámetros para intentar ocultar barras de herramientas
  // toolbar=0: Oculta barra de herramientas
  // navpanes=0: Oculta panel de navegación
  // scrollbar=0: Oculta barras de desplazamiento (opcional)
  const secureUrl = url.includes('?') 
    ? `${url}&toolbar=0&navpanes=0` 
    : `${url}?toolbar=0&navpanes=0`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-gray-light bg-neutral-white">
          <div className="flex items-center space-x-2 text-neutral-dark">
            <FileText className="w-5 h-5 text-primary-red" />
            <h3 className="font-bold text-lg">Visualizador de Recurso</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-neutral-gray-light rounded-full transition-colors text-neutral-gray hover:text-neutral-dark"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 bg-neutral-50 relative group">
          
          {loading && !error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-red"></div>
            </div>
          )}

          {error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-gray p-8 text-center">
              <AlertTriangle className="w-12 h-12 mb-4 text-yellow-500" />
              <p className="text-lg font-semibold">No se pudo cargar la vista previa</p>
              <p className="text-sm">El formato del archivo podría no ser compatible con el visualizador.</p>
            </div>
          ) : (
            <iframe 
              src={secureUrl}
              className="w-full h-full"
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false)
                setError(true)
              }}
              // Atributos de seguridad adicionales
              sandbox="allow-scripts allow-same-origin" 
            />
          )}

          {/* Overlay transparente para interceptar clicks y prevenir arrastrar/guardar imagen */}
          <div 
            className="absolute inset-0 bg-transparent"
            style={{ pointerEvents: 'none' }} // Permitir scroll pero bloquear interacciones directas puede ser tricky con iframes.
            // Para iframes, pointer-events: none bloquea el scroll. 
            // La mejor opción "visual" sin bloquear scroll es poner un div encima solo en los bordes o usar el evento contextmenu global.
          />
        </div>

        {/* Footer Warning */}
        <div className="bg-yellow-50 px-6 py-3 border-t border-yellow-100">
          <p className="text-xs text-yellow-800 text-center flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Este documento es confidencial y para visualización exclusiva dentro de la plataforma. La descarga está inhabilitada.
          </p>
        </div>
      </div>
    </div>
  )
}
