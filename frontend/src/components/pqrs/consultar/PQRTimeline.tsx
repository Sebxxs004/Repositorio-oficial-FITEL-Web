/**
 * PQRTimeline Component
 * 
 * Componente que muestra el progreso de la PQR en formato de timeline visual,
 * similar al seguimiento de un pedido.
 */

'use client'

import { 
  CheckCircle2, 
  Clock, 
  FileText, 
  MessageSquare, 
  XCircle,
  Circle,
  CheckCircle
} from 'lucide-react'
import type { PQRStatus, PQRResponse } from '@/types/pqr.types'

interface TimelineStep {
  status: PQRStatus
  label: string
  description: string
  icon: React.ReactNode
  date?: string
}

interface PQRTimelineProps {
  pqr: PQRResponse
}

function getTimelineSteps(pqr: PQRResponse): TimelineStep[] {
  const steps: TimelineStep[] = [
    {
      status: 'RECIBIDA',
      label: 'PQR Recibida',
      description: 'Tu solicitud ha sido recibida y registrada en nuestro sistema',
      icon: <FileText className="w-6 h-6" />,
      date: pqr.createdAt
    },
    {
      status: 'EN_ANALISIS',
      label: 'En Análisis',
      description: 'Nuestro equipo está revisando tu solicitud',
      icon: <Clock className="w-6 h-6" />,
      date: pqr.updatedAt && pqr.status !== 'RECIBIDA' ? pqr.updatedAt : undefined
    },
    {
      status: 'EN_RESPUESTA',
      label: 'En Respuesta',
      description: 'Estamos preparando la respuesta a tu solicitud',
      icon: <MessageSquare className="w-6 h-6" />,
      date: pqr.responseDate
    },
    {
      status: 'RESUELTA',
      label: 'Resuelta',
      description: 'Tu solicitud ha sido resuelta exitosamente',
      icon: <CheckCircle2 className="w-6 h-6" />,
      date: pqr.resolutionDate
    },
    {
      status: 'CERRADA',
      label: 'Cerrada',
      description: 'El proceso ha sido finalizado',
      icon: <XCircle className="w-6 h-6" />,
      date: pqr.updatedAt && pqr.status === 'CERRADA' ? pqr.updatedAt : undefined
    }
  ]

  return steps
}

function getStatusIndex(status: PQRStatus): number {
  const statusOrder: PQRStatus[] = ['RECIBIDA', 'EN_ANALISIS', 'EN_RESPUESTA', 'RESUELTA', 'CERRADA']
  return statusOrder.indexOf(status)
}

function formatDate(dateString?: string): string {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function PQRTimeline({ pqr }: PQRTimelineProps) {
  const steps = getTimelineSteps(pqr)
  const currentStatusIndex = getStatusIndex(pqr.status)

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
      <h3 className="text-xl font-bold text-neutral-dark mb-6 flex items-center gap-2">
        <Clock className="w-5 h-5 text-primary-red" />
        Seguimiento de tu PQR
      </h3>
      
      <div className="relative">
        {/* Línea de progreso */}
        <div className="absolute left-5 sm:left-6 top-0 bottom-0 w-0.5 bg-gray-200">
          <div 
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary-red to-primary-red/80 transition-all duration-500"
            style={{ 
              height: `${(currentStatusIndex / (steps.length - 1)) * 100}%`,
              minHeight: currentStatusIndex === 0 ? '20%' : undefined
            }}
          />
        </div>

        {/* Pasos del timeline */}
        <div className="space-y-6 sm:space-y-8">
          {steps.map((step, index) => {
            const isCompleted = index <= currentStatusIndex
            const isCurrent = index === currentStatusIndex
            const isPending = index > currentStatusIndex

            return (
              <div key={step.status} className="relative flex items-start gap-3 sm:gap-4">
                {/* Icono del paso */}
                <div className={`
                  relative z-10 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-300 flex-shrink-0
                  ${isCompleted 
                    ? 'bg-primary-red border-primary-red text-white shadow-lg shadow-primary-red/30' 
                    : isCurrent
                    ? 'bg-white border-primary-red text-primary-red shadow-lg shadow-primary-red/20 animate-pulse'
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                  }
                `}>
                  {isCompleted && !isCurrent ? (
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                  ) : (
                    <div className="scale-75">
                      {step.icon}
                    </div>
                  )}
                </div>

                {/* Contenido del paso */}
                <div className="flex-1 pt-0.5 sm:pt-1 min-w-0">
                  <div className={`
                    flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mb-1
                    ${isCompleted ? 'text-neutral-dark' : 'text-gray-400'}
                  `}>
                    <h4 className={`
                      font-semibold text-base sm:text-lg transition-colors
                      ${isCompleted ? 'text-neutral-dark' : 'text-gray-400'}
                      ${isCurrent ? 'text-primary-red' : ''}
                    `}>
                      {step.label}
                    </h4>
                    {step.date && isCompleted && (
                      <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                        {formatDate(step.date)}
                      </span>
                    )}
                  </div>
                  
                  <p className={`
                    text-sm mb-2 transition-colors
                    ${isCompleted ? 'text-neutral-gray' : 'text-gray-400'}
                  `}>
                    {step.description}
                  </p>

                  {/* Indicador de estado actual */}
                  {isCurrent && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-red/10 text-primary-red rounded-full text-xs font-semibold mt-2">
                      <Circle className="w-2 h-2 fill-primary-red animate-pulse" />
                      Estado Actual
                    </div>
                  )}

                  {/* Información adicional según el estado */}
                  {isCurrent && pqr.status === 'EN_RESPUESTA' && pqr.responseDate && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Respuesta enviada:</strong> {formatDate(pqr.responseDate)}
                      </p>
                    </div>
                  )}

                  {isCurrent && pqr.status === 'RESUELTA' && pqr.resolutionDate && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        <strong>Resuelta el:</strong> {formatDate(pqr.resolutionDate)}
                      </p>
                    </div>
                  )}

                  {isCurrent && pqr.slaDeadline && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-800">
                        <strong>Fecha límite de respuesta:</strong>{' '}
                        {new Date(pqr.slaDeadline).toLocaleDateString('es-CO', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Información adicional del CUN */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">Código Único Numérico (CUN)</p>
            <p className="text-2xl font-bold text-primary-red font-mono tracking-wider">{pqr.cun}</p>
            <p className="text-xs text-gray-500 mt-1">Guarda este código para futuras consultas</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm text-gray-600 mb-1">Tipo de PQR</p>
            <p className="text-lg font-semibold text-neutral-dark">
              {pqr.type === 'PETICION' ? 'Petición' : 
               pqr.type === 'QUEJA' ? 'Queja' : 'Recurso'}
            </p>
            {pqr.priority && (
              <p className="text-xs text-gray-500 mt-1">
                Prioridad: <span className="font-semibold">{pqr.priority}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
