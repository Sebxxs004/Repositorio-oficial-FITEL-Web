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
  pqrs: PQRResponse[]
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

export function PQRSearchResults({ pqrs }: PQRSearchResultsProps) {
  if (!pqrs || pqrs.length === 0) return null

  return (
    <div className="space-y-12">
      {pqrs.map((pqr) => {
        const isReceived = pqr.status === 'RECIBIDA'
        return (
          <div key={pqr.id} className="space-y-6">
            {!isReceived && <PQRTimeline pqr={pqr} />}
            
            <div className="bg-neutral-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-neutral-dark mb-2">
                    Detalles de la PQR #{pqr.id}
                  </h2>
                  <p className="text-sm sm:text-base text-neutral-gray">
                    {pqr.type === 'PETICION' ? 'Petición' : 
                     pqr.type === 'QUEJA' ? 'Queja' : 'Recurso'} - {pqr.subject}
                  </p>
                </div>
                <div className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border w-full md:w-auto ${getStatusColor(pqr.status)}`}>
                  {getStatusIcon(pqr.status)}
                  <span className="font-semibold whitespace-nowrap">{getStatusLabel(pqr.status)}</span>
                </div>
              </div>

              <div className="space-y-4">
                {isReceived && (
                  <div className="pt-4 border-t border-neutral-gray-light">
                    <h3 className="text-lg font-semibold text-neutral-dark mb-4">Información del Usuario</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-neutral-gray mb-1">Nombre Completo</h4>
                        <p className="text-neutral-dark">{pqr.customerName}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-neutral-gray mb-1">Correo Electrónico</h4>
                        <p className="text-neutral-dark">{pqr.customerEmail}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-neutral-gray mb-1">Teléfono</h4>
                        <p className="text-neutral-dark">{pqr.customerPhone}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-neutral-gray mb-1">Documento de Identidad</h4>
                        <p className="text-neutral-dark">
                          {pqr.customerDocumentType} - {pqr.customerDocumentNumber}
                        </p>
                      </div>
                      {pqr.customerAddress && (
                        <div className="md:col-span-2">
                          <h4 className="text-sm font-semibold text-neutral-gray mb-1">Dirección</h4>
                          <p className="text-neutral-dark">{pqr.customerAddress}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

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
                  {!isReceived && (
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
                  )}
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

                <div className="pt-4 border-t border-neutral-gray-light">
                  <h3 className="text-sm font-semibold text-neutral-gray mb-1">Código Único Numérico (CUN)</h3>
                  <p className="text-neutral-dark font-mono text-lg font-bold text-primary-red">{pqr.cun}</p>
                  <p className="text-xs text-neutral-gray mt-1">Guarda este código para futuras consultas</p>
                </div>

                {!isReceived && pqr.response && (
                  <div className="pt-4 border-t border-neutral-gray-light">
                    <h3 className="text-sm font-semibold text-neutral-gray mb-2">Respuesta</h3>
                    <p className="text-neutral-dark">{pqr.response}</p>
                  </div>
                )}

                {!isReceived && pqr.responseDate && (
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

                {!isReceived && pqr.resolutionDate && (
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
            {/* Si no es el último, ponemos un separador opcional o solo espaciado que ya tenemos con space-y-12 */}
          </div>
        )
      })}
    </div>
  )
}
