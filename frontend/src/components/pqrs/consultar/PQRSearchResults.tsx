/**
 * PQRSearchResults Component
 * 
 * Componente responsable de mostrar los resultados de la búsqueda.
 * Implementa el principio de Responsabilidad Única (SRP).
 */

'use client'

import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react'
import type { PQRResponse, PQRStatus } from '@/types/pqr.types'
import { PQRTimeline } from './PQRTimeline'

interface PQRSearchResultsProps {
  pqr: PQRResponse
}

function getStatusIcon(status: PQRStatus) {
  switch (status) {
    case 'RESUELTA':
      return <CheckCircle className="w-5 h-5 text-green-600" />
    case 'EN_ANALISIS':
    case 'EN_RESPUESTA':
      return <Clock className="w-5 h-5 text-yellow-600" />
    case 'RECIBIDA':
      return <AlertCircle className="w-5 h-5 text-blue-600" />
    case 'CERRADA':
      return <XCircle className="w-5 h-5 text-gray-600" />
    default:
      return <AlertCircle className="w-5 h-5 text-gray-600" />
  }
}

function getStatusLabel(status: PQRStatus): string {
  switch (status) {
    case 'RECIBIDA':
      return 'Recibida'
    case 'EN_ANALISIS':
      return 'En Análisis'
    case 'EN_RESPUESTA':
      return 'En Respuesta'
    case 'RESUELTA':
      return 'Resuelta'
    case 'CERRADA':
      return 'Cerrada'
    default:
      return status
  }
}

function getStatusColor(status: PQRStatus): string {
  switch (status) {
    case 'RECIBIDA':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'EN_ANALISIS':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'EN_RESPUESTA':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'RESUELTA':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'CERRADA':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export function PQRSearchResults({ pqr }: PQRSearchResultsProps) {
  return (
    <div className="space-y-6">
      {/* Timeline visual del progreso */}
      <PQRTimeline pqr={pqr} />

      {/* Detalles de la PQR */}
      <div className="bg-neutral-white rounded-xl shadow-lg p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral-dark mb-2">
              Detalles de la PQR #{pqr.id}
            </h2>
            <p className="text-neutral-gray">
              {pqr.type === 'PETICION' ? 'Petición' : 
               pqr.type === 'QUEJA' ? 'Queja' : 'Recurso'} - {pqr.subject}
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
                hour: '2-digit',
                minute: '2-digit',
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
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          {pqr.slaDeadline && (
            <div>
              <h3 className="text-sm font-semibold text-neutral-gray mb-1">Fecha Límite de Respuesta (SLA)</h3>
              <p className="text-neutral-dark font-semibold text-primary-red">
                {new Date(pqr.slaDeadline).toLocaleDateString('es-CO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          )}
        </div>

        {pqr.response && (
          <div className="pt-4 border-t border-neutral-gray-light">
            <h3 className="text-sm font-semibold text-neutral-gray mb-2">Respuesta</h3>
            <p className="text-neutral-dark">{pqr.response}</p>
          </div>
        )}

        {pqr.responseDate && (
          <div className="pt-4 border-t border-neutral-gray-light">
            <h3 className="text-sm font-semibold text-neutral-gray mb-1">Fecha de Respuesta</h3>
            <p className="text-neutral-dark">
              {new Date(pqr.responseDate).toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        )}

        {pqr.resolutionDate && (
          <div className="pt-4 border-t border-neutral-gray-light">
            <h3 className="text-sm font-semibold text-neutral-gray mb-1">Fecha de Resolución</h3>
            <p className="text-neutral-dark">
              {new Date(pqr.resolutionDate).toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
