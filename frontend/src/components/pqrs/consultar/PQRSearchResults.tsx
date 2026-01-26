/**
 * PQRSearchResults Component
 * 
 * Componente responsable de mostrar los resultados de la búsqueda.
 * Implementa el principio de Responsabilidad Única (SRP).
 */

'use client'

import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react'
import type { PQRStatusResponse, PQRStatus } from '@/types/pqr.types'

interface PQRSearchResultsProps {
  pqr: PQRStatusResponse
}

function getStatusIcon(status: PQRStatus) {
  switch (status) {
    case 'resuelta':
      return <CheckCircle className="w-5 h-5 text-green-600" />
    case 'en_proceso':
      return <Clock className="w-5 h-5 text-yellow-600" />
    case 'rechazada':
      return <XCircle className="w-5 h-5 text-red-600" />
    default:
      return <AlertCircle className="w-5 h-5 text-gray-600" />
  }
}

function getStatusLabel(status: PQRStatus): string {
  switch (status) {
    case 'pendiente':
      return 'Pendiente'
    case 'en_proceso':
      return 'En Proceso'
    case 'resuelta':
      return 'Resuelta'
    case 'rechazada':
      return 'Rechazada'
    default:
      return status
  }
}

function getStatusColor(status: PQRStatus): string {
  switch (status) {
    case 'resuelta':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'en_proceso':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'rechazada':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export function PQRSearchResults({ pqr }: PQRSearchResultsProps) {
  return (
    <div className="bg-neutral-white rounded-xl shadow-lg p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-dark mb-2">
            PQR #{pqr.id}
          </h2>
          <p className="text-neutral-gray">
            {pqr.type.charAt(0).toUpperCase() + pqr.type.slice(1)} - {pqr.category}
          </p>
        </div>
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${getStatusColor(pqr.status)}`}>
          {getStatusIcon(pqr.status)}
          <span className="font-semibold">{getStatusLabel(pqr.status)}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-neutral-gray mb-2">Descripción</h3>
          <p className="text-neutral-dark">{pqr.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-gray-light">
          <div>
            <h3 className="text-sm font-semibold text-neutral-gray mb-1">Fecha de Creación</h3>
            <p className="text-neutral-dark">
              {new Date(pqr.createdAt).toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-gray mb-1">Última Actualización</h3>
            <p className="text-neutral-dark">
              {new Date(pqr.updatedAt).toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {pqr.resolutionDate && (
          <div className="pt-4 border-t border-neutral-gray-light">
            <h3 className="text-sm font-semibold text-neutral-gray mb-1">Fecha de Resolución</h3>
            <p className="text-neutral-dark">
              {new Date(pqr.resolutionDate).toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        )}

        {pqr.resolutionNotes && (
          <div className="pt-4 border-t border-neutral-gray-light">
            <h3 className="text-sm font-semibold text-neutral-gray mb-2">Notas de Resolución</h3>
            <p className="text-neutral-dark">{pqr.resolutionNotes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
