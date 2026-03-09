/**
 * PQRSearchResults Component
 * 
 * Componente responsable de mostrar los resultados de la búsqueda.
 * Implementa el principio de Responsabilidad Única (SRP).
 */

'use client'

import { useState } from 'react'
import { CheckCircle, Clock, XCircle, AlertCircle, FileText, Eye, RefreshCw, AlertTriangle } from 'lucide-react'
import type { PQRResponse, PQRStatus } from '@/types/pqr.types'
import { PQRTimeline } from './PQRTimeline'
import { PQRService } from '@/services/pqr/PQRService'

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
  const [reanalysisOpen, setReanalysisOpen] = useState(false)
  const [selectedCun, setSelectedCun] = useState<string | null>(null)
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleOpenReanalysis = (cun: string) => {
    setSelectedCun(cun)
    setReanalysisOpen(true)
    setReason('')
    setSubmitSuccess(false)
    setErrorMessage(null)
  }

  const handleSubmitReanalysis = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCun || !reason || reason.length < 20) return

    setIsSubmitting(true)
    setErrorMessage(null)

    const response = await PQRService.requestReanalysis(selectedCun, reason)

    setIsSubmitting(false)
    if (response.success) {
      setSubmitSuccess(true)
      setTimeout(() => {
        setReanalysisOpen(false)
        window.location.reload()
      }, 2000)
    } else {
      setErrorMessage(response.error || 'Error desconocido al solicitar reanálisis')
    }
  }

  if (!pqrs || pqrs.length === 0) return null

  const parseDescription = (fullDescription: string) => {
    if (!fullDescription) return { description: '', attachments: [] }
    // Usar regex para ser más flexible con los saltos de línea y espacios
    const parts = fullDescription.split(/[\n\r]*--- Archivos Adjuntos ---[\n\r]*/)
    return {
      description: parts[0].trim(),
      attachments: parts.slice(1).flatMap(part => 
        part.split(/[\n\r]+/).map(url => url.trim()).filter(url => url.length > 0 && url.startsWith('http'))
      )
    }
  }

  return (
    <div className="space-y-12">
      {pqrs.map((pqr) => {
        const isReceived = pqr.status === 'RECIBIDA'
        const { description, attachments } = parseDescription(pqr.description)
        
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
                  <p className="text-neutral-dark whitespace-pre-line">{description}</p>
                  
                  {attachments.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-semibold text-neutral-gray mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Archivos Adjuntos
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {attachments.map((url, index) => {
                          const fileName = url.split('/').pop()?.split('?')[0] || `Adjunto ${index + 1}`
                          return (
                            <a
                              key={index}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-center p-3 bg-neutral-50 hover:bg-white border border-neutral-gray-light hover:border-primary-red rounded-lg transition-all duration-200 shadow-sm hover:shadow-md text-left w-full"
                            >
                              <div className="bg-white p-2 rounded-md border border-neutral-gray-light group-hover:border-primary-red/30 mr-3">
                                <FileText className="w-5 h-5 text-neutral-gray group-hover:text-primary-red" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-neutral-dark truncate">{fileName}</p>
                                <p className="text-xs text-neutral-gray group-hover:text-primary-red">Clic para abrir en nueva pestaña</p>
                              </div>
                              <Eye className="w-4 h-4 text-neutral-gray group-hover:text-primary-red opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-gray-light">
                  <div>
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
                     <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-neutral-dark">{pqr.response}</p>
                    </div>

                    {pqr.responseAttachmentPath && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-neutral-gray mb-2 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Documento adjunto de la respuesta
                        </h4>
                        <a
                          href={`/uploads/${pqr.responseAttachmentPath.replace(/\\/g, '/').replace(/^uploads\//, '')}?cun=${encodeURIComponent(pqr.cun)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center p-3 bg-neutral-50 hover:bg-white border border-neutral-gray-light hover:border-primary-red rounded-lg transition-all duration-200 shadow-sm hover:shadow-md gap-3"
                        >
                          <div className="bg-white p-2 rounded-md border border-neutral-gray-light group-hover:border-primary-red/30">
                            <FileText className="w-5 h-5 text-neutral-gray group-hover:text-primary-red" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-neutral-dark">
                              {pqr.responseAttachmentPath.split('/').pop()}
                            </p>
                            <p className="text-xs text-neutral-gray group-hover:text-primary-red">Clic para abrir en nueva pestaña</p>
                          </div>
                          <Eye className="w-4 h-4 text-neutral-gray group-hover:text-primary-red" />
                        </a>
                      </div>
                    )}

                     {/* Botón de reanálisis */}
                    {(pqr.status === 'RESUELTA' || pqr.status === 'CERRADA') && (
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => handleOpenReanalysis(pqr.cun)}
                                className="flex items-center gap-2 px-4 py-2 bg-neutral-white border border-primary-red text-primary-red hover:bg-primary-red hover:text-white rounded-lg transition-colors duration-300 font-medium text-sm"
                            >
                                <RefreshCw className="w-4 h-4" />
                                No estoy conforme (Solicitar Reanálisis)
                            </button>
                        </div>
                    )}
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
      {/* Modal de Reanálisis */}
      {reanalysisOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-xl font-bold text-neutral-dark flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        Solicitar Reanálisis
                    </h3>
                    <button 
                        onClick={() => setReanalysisOpen(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <XCircle className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="p-6 space-y-4">
                    {!submitSuccess ? (
                        <>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                                <p className="flex gap-2">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <span>
                                        Si no estás conforme con la respuesta recibida, puedes solicitar un reanálisis. 
                                        Tu caso será reabierto y asignado nuevamente para revisión.
                                    </span>
                                </p>
                            </div>

                            <form onSubmit={handleSubmitReanalysis}>
                                <div className="space-y-2">
                                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                                        Motivo de inconformidad <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="reason"
                                        rows={4}
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-red focus:ring focus:ring-primary-red/20 text-sm p-3 border"
                                        placeholder="Por favor explica detalladamente por qué no estás conforme con la respuesta..."
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        minLength={20}
                                        maxLength={2000}
                                        required
                                    />
                                    <p className="text-xs text-gray-500 text-right">
                                        {reason.length}/2000 caracteres (mínimo 20)
                                    </p>
                                </div>

                                {errorMessage && (
                                    <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200 flex items-center gap-2">
                                        <XCircle className="w-4 h-4" />
                                        {errorMessage}
                                    </div>
                                )}

                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setReanalysisOpen(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
                                        disabled={isSubmitting}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || reason.length < 20}
                                        className="flex items-center gap-2 px-4 py-2 bg-primary-red text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow text-sm font-medium"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                                Enviando...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-4 h-4" />
                                                Enviar Solicitud
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-2">¡Solicitud Recibida!</h4>
                            <p className="text-gray-600 mb-6">
                                Tu solicitud de reanálisis ha sido registrada correctamente. 
                                La PQR ha cambiado a estado "En Análisis" y recibirás una nueva respuesta pronto.
                            </p>
                            <p className="text-sm text-gray-400">Actualizando...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  )
}
