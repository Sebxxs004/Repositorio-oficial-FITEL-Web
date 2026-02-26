'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Save, AlertTriangle, Calendar, User, Mail, Phone, FileText, Paperclip, ArrowRight } from 'lucide-react'

interface PQR {
  id: number
  cun: string
  type: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerDocumentType: string
  customerDocumentNumber: string
  subject: string
  description: string
  status: string
  priority: string
  responsibleArea?: string
  realType?: string
  internalNotes?: string
  response?: string
  responseAttachmentPath?: string
  createdAt: string
  slaDeadline?: string
}

interface PQRDetailModalProps {
  pqr: PQR | null
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

// Función helper para crear un objeto seguro con solo valores primitivos
function createSafeRequestBody(data: {
  status?: string
  priority?: string
  responsibleArea?: string
  realType?: string
  internalNotes?: string
  response?: string
  skipStatusChangeEmail?: boolean
  skipResponseEmail?: boolean
}): Record<string, string | boolean> {
  const safe: Record<string, string | boolean> = {}
  
  if (data.status !== undefined && data.status !== null) {
    safe.status = String(data.status).trim()
  }
  if (data.priority !== undefined && data.priority !== null && String(data.priority).trim()) {
    safe.priority = String(data.priority).trim()
  }
  if (data.responsibleArea !== undefined && data.responsibleArea !== null && String(data.responsibleArea).trim()) {
    safe.responsibleArea = String(data.responsibleArea).trim()
  }
  if (data.realType !== undefined && data.realType !== null && String(data.realType).trim()) {
    safe.realType = String(data.realType).trim()
  }
  if (data.internalNotes !== undefined && data.internalNotes !== null && String(data.internalNotes).trim()) {
    safe.internalNotes = String(data.internalNotes).trim()
  }
  if (data.response !== undefined && data.response !== null && String(data.response).trim()) {
    safe.response = String(data.response).trim()
  }
  if (data.skipStatusChangeEmail !== undefined) {
    safe.skipStatusChangeEmail = Boolean(data.skipStatusChangeEmail)
  }
  if (data.skipResponseEmail !== undefined) {
    safe.skipResponseEmail = Boolean(data.skipResponseEmail)
  }
  
  return safe
}

export function PQRDetailModal({ pqr, isOpen, onClose, onUpdate }: PQRDetailModalProps) {
  const [formData, setFormData] = useState({
    status: '',
    priority: '',
    responsibleArea: '',
    realType: '',
    internalNotes: '',
    response: '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOverdue, setIsOverdue] = useState(false)
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null)
  const [showResolveModal, setShowResolveModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false)
  const [pendingStatusChange, setPendingStatusChange] = useState<string | null>(null)

  useEffect(() => {
    if (pqr) {
      setFormData({
        status: String(pqr.status || ''),
        priority: String(pqr.priority || 'NORMAL'),
        responsibleArea: String(pqr.responsibleArea || ''),
        realType: String(pqr.realType || ''),
        internalNotes: String(pqr.internalNotes || ''),
        response: String(pqr.response || ''),
      })
      setShowResolveModal(false) // Resetear el modal cuando cambia la PQR
      setShowStatusChangeModal(false) // Resetear el modal de cambio de estado
      setPendingStatusChange(null) // Resetear el estado pendiente
      
      // Verificar si está vencida
      if (pqr.slaDeadline) {
        const deadline = new Date(pqr.slaDeadline)
        setIsOverdue(deadline < new Date() && pqr.status !== 'CERRADA' && pqr.status !== 'RESUELTA')
      }
    }
  }, [pqr])

  const handleSaveWithStatus = useCallback(async (status: string, skipStatusChangeEmail: boolean, skipResponseEmail: boolean = false) => {
    setIsSaving(true)
    setError(null)

    try {
      const currentPqr = pqr
      if (!currentPqr) {
        throw new Error('PQR no disponible')
      }

      // Validar que no se cierre fuera del SLA
      if (status === 'CERRADA' && currentPqr.slaDeadline) {
        const deadline = new Date(currentPqr.slaDeadline)
        if (deadline > new Date()) {
          setError('No se puede cerrar la PQR antes de la fecha límite del SLA')
          setIsSaving(false)
          return
        }
      }

      // Subir archivo adjunto si se seleccionó uno
      const currentAttachment = attachmentFile
      if (currentAttachment) {
        const formDataFile = new FormData()
        formDataFile.append('file', currentAttachment)

        const uploadResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/pqrs/${currentPqr.id}/response-attachment`,
          {
            method: 'POST',
            credentials: 'include',
            body: formDataFile,
          }
        )

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json().catch(() => null)
          throw new Error(errorData?.message || 'Error al subir el archivo adjunto')
        }
      }

      // Obtener valores primitivos directamente del estado actual
      const currentFormData = formData
      const requestBody = createSafeRequestBody({
        status: status,
        priority: currentFormData.priority,
        responsibleArea: currentFormData.responsibleArea,
        realType: currentFormData.realType,
        internalNotes: currentFormData.internalNotes,
        response: currentFormData.response,
        skipStatusChangeEmail: skipStatusChangeEmail,
        skipResponseEmail: skipResponseEmail
      })

      const requestBodyString = JSON.stringify(requestBody)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/pqrs/${currentPqr.id}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: requestBodyString,
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al actualizar PQR')
      }

      // Mostrar modal de éxito
      setShowSuccessModal(true)
      onUpdate()
      setAttachmentFile(null)
      
      // Si se cambió el estado, forzar actualización de la PQR para reflejar los nuevos campos
      if (status && status !== currentPqr.status) {
        // Esperar un momento para que el backend procese y luego actualizar
        setTimeout(() => {
          onUpdate()
        }, 300)
      }
      
      // Ocultar modal de éxito después de 2 segundos y cerrar el modal de detalles
      setTimeout(() => {
        setShowSuccessModal(false)
        onClose()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar cambios')
    } finally {
      setIsSaving(false)
    }
  }, [pqr, formData, attachmentFile, onUpdate, onClose])

  const handleSave = useCallback(async (skipStatusChangeEmail = false, skipResponseEmail = false) => {
    setIsSaving(true)
    setError(null)

    try {
      const currentPqr = pqr
      if (!currentPqr) {
        throw new Error('PQR no disponible')
      }

      // Obtener valores primitivos directamente del estado actual
      const currentFormData = formData
      // Para "Guardar Cambios", mantener el estado original de la PQR (no cambiarlo)
      const currentStatus = currentPqr.status
      const currentResponse = String(currentFormData.response || '').trim()

      // Validar que no se cierre fuera del SLA (solo si se intenta cambiar a CERRADA)
      // Como estamos manteniendo el estado original, esta validación no aplica para "Guardar Cambios"

      // Verificar si está en EN_RESPUESTA, tiene respuesta y se está guardando sin cambiar estado
      // Si es así, mostrar modal para preguntar si quiere marcarla como RESUELTA
      // El modal debe aparecer si:
      // 1. La PQR original está en EN_RESPUESTA
      // 2. Hay contenido en el campo response (no vacío)
      // 3. El estado no ha sido cambiado manualmente a otro valor diferente de EN_RESPUESTA
      const isInEnRespuesta = currentPqr.status === 'EN_RESPUESTA'
      const hasResponse = currentResponse && currentResponse.trim().length > 0
      const statusStillEnRespuesta = true // Siempre es true porque no cambiamos el estado
      
      // Debug: verificar condiciones
      console.log('🔍 Modal check:', {
        skipStatusChangeEmail,
        isInEnRespuesta,
        hasResponse,
        statusStillEnRespuesta,
        currentStatus: currentStatus || '(vacío)',
        currentPqrStatus: currentPqr.status,
        currentResponseLength: currentResponse?.length,
        currentResponsePreview: currentResponse?.substring(0, 50),
        originalResponse: String(currentPqr.response || '').trim(),
        responseChanged: currentResponse !== String(currentPqr.response || '').trim()
      })
      
      // Mostrar modal solo si no se está saltando el correo de cambio de estado
      // y se cumplen todas las condiciones
      if (!skipStatusChangeEmail && isInEnRespuesta && hasResponse && statusStillEnRespuesta) {
        console.log('✅ Mostrando modal de resolución')
        setShowResolveModal(true)
        setIsSaving(false)
        return
      } else {
        console.log('❌ Modal NO se mostrará porque:', {
          skipStatusChangeEmail: skipStatusChangeEmail ? 'true (skip)' : 'false',
          isInEnRespuesta: isInEnRespuesta ? 'true' : 'false',
          hasResponse: hasResponse ? 'true' : 'false',
          statusStillEnRespuesta: statusStillEnRespuesta ? 'true' : 'false',
          currentStatusValue: currentStatus || '(vacío)',
          originalStatus: currentPqr.status
        })
      }

      // Subir archivo adjunto si se seleccionó uno
      const currentAttachment = attachmentFile
      if (currentAttachment) {
        const formDataFile = new FormData()
        formDataFile.append('file', currentAttachment)

        const uploadResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/pqrs/${currentPqr.id}/response-attachment`,
          {
            method: 'POST',
            credentials: 'include',
            body: formDataFile,
          }
        )

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json().catch(() => null)
          throw new Error(errorData?.message || 'Error al subir el archivo adjunto')
        }
      }

      // Para "Guardar Cambios", siempre saltar correos (no cambiar estado, no enviar correos)
      const shouldSkipStatusChangeEmail = true
      const shouldSkipResponseEmail = true

      // Crear objeto seguro usando la función helper
      // No incluir status para que no se cambie el estado
      const requestBody = createSafeRequestBody({
        // status: NO se incluye para mantener el estado original
        priority: currentFormData.priority,
        responsibleArea: currentFormData.responsibleArea,
        realType: currentFormData.realType,
        internalNotes: currentFormData.internalNotes,
        response: currentFormData.response,
        skipStatusChangeEmail: shouldSkipStatusChangeEmail,
        skipResponseEmail: shouldSkipResponseEmail
      })

      const requestBodyString = JSON.stringify(requestBody)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/pqrs/${currentPqr.id}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: requestBodyString,
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al actualizar PQR')
      }

      // Mostrar modal de éxito
      setShowSuccessModal(true)
      onUpdate()
      setAttachmentFile(null)
      
      // Ocultar modal de éxito después de 2 segundos y cerrar el modal de detalles
      setTimeout(() => {
        setShowSuccessModal(false)
        onClose()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar cambios')
    } finally {
      setIsSaving(false)
    }
  }, [pqr, formData, attachmentFile, onUpdate, onClose])

  const isDeadlineNear = pqr?.slaDeadline
    ? new Date(pqr.slaDeadline).getTime() - new Date().getTime() < 3 * 24 * 60 * 60 * 1000
    : false

  if (!isOpen || !pqr) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-gray-light px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neutral-dark">Detalles de PQR</h2>
            <p className="text-sm text-neutral-gray">CUN: {pqr.cun}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-gray hover:text-neutral-dark transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Alertas */}
        {(isOverdue || isDeadlineNear) && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-semibold">
                {isOverdue ? '⚠️ PQR Vencida' : '⚠️ PQR Próxima a Vencer'}
              </p>
              <p className="text-red-700 text-sm">
                Fecha límite: {pqr.slaDeadline ? new Date(pqr.slaDeadline).toLocaleDateString('es-CO') : 'N/A'}
              </p>
            </div>
          </div>
        )}

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Información del Cliente */}
          <div className="bg-neutral-gray-light/50 rounded-lg p-4">
            <h3 className="font-semibold text-neutral-dark mb-3 flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Información del Cliente</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-neutral-gray">Nombre</p>
                <p className="font-semibold text-neutral-dark">{pqr.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-gray">Documento</p>
                <p className="font-semibold text-neutral-dark">
                  {pqr.customerDocumentType} {pqr.customerDocumentNumber}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-gray flex items-center space-x-1">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </p>
                <p className="font-semibold text-neutral-dark">{pqr.customerEmail}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-gray flex items-center space-x-1">
                  <Phone className="w-4 h-4" />
                  <span>Teléfono</span>
                </p>
                <p className="font-semibold text-neutral-dark">{pqr.customerPhone}</p>
              </div>
            </div>
          </div>

          {/* Información de la PQR */}
          <div>
            <h3 className="font-semibold text-neutral-dark mb-3 flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Información de la PQR</span>
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-dark mb-2">Tipo</label>
                <p className="text-neutral-dark">{pqr.type}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-dark mb-2">Asunto</label>
                <p className="text-neutral-dark">{pqr.subject}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-dark mb-2">Descripción</label>
                {(() => {
                  const parts = pqr.description.split('--- Archivos Adjuntos ---')
                  const descriptionText = parts[0].trim()
                  const attachments = parts.length > 1 ? parts[1].trim().split('\n').filter(url => url.trim().length > 0) : []
                  
                  return (
                    <div className="space-y-4">
                      <p className="text-neutral-dark whitespace-pre-wrap">{descriptionText}</p>
                      
                      {attachments.length > 0 && (
                        <div className="mt-3 bg-neutral-50 border border-neutral-gray-light rounded-lg p-3">
                          <h4 className="text-sm font-semibold text-neutral-dark mb-2 flex items-center gap-2">
                            <Paperclip className="w-4 h-4 text-primary-red" />
                            Archivos Adjuntos del Usuario
                          </h4>
                          <ul className="space-y-2">
                            {attachments.map((url, index) => {
                               const cleanUrl = url.split('\n')[0].trim();
                               const fileName = cleanUrl.split('/').pop()?.split('?')[0] || `Archivo ${index + 1}`;
                               // Asegurarnos de que el link tenga el CUN si no lo tiene (caso legacy o fallo)
                               const finalUrl = cleanUrl.includes('?cun=') ? cleanUrl : `${cleanUrl}?cun=${pqr.cun}`;
                               
                               return (
                                <li key={index}>
                                  <a 
                                    href={finalUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-primary-red hover:underline text-sm break-all"
                                  >
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary-red flex-shrink-0" />
                                    {fileName}
                                  </a>
                                </li>
                               )
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  )
                })()}
              </div>
            </div>
          </div>

          {/* Formulario de Gestión */}
          <div className="border-t border-neutral-gray-light pt-6">
            <h3 className="font-semibold text-neutral-dark mb-4">Gestión de PQR</h3>
            
            {/* Si está en RECIBIDA, no mostrar formulario */}
            {pqr.status === 'RECIBIDA' ? null : pqr.status === 'EN_ANALISIS' ? (
              /* Si está en EN_ANALISIS, solo mostrar Notas Internas */
              <div className="mt-4">
                <label className="block text-sm font-semibold text-neutral-dark mb-2">Notas del Caso</label>
                <textarea
                  value={formData.internalNotes}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, internalNotes: e.target.value }))
                  }}
                  rows={6}
                  className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red resize-none"
                  placeholder="Agregar notas sobre el análisis del caso..."
                />
              </div>
            ) : pqr.status === 'EN_RESPUESTA' ? (
              /* Si está en EN_RESPUESTA, mostrar todos los campos excepto Estado */
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Prioridad */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-dark mb-2">Prioridad</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => {
                        const value = String(e.target.value || '').trim()
                        setFormData(prev => ({ ...prev, priority: value }))
                      }}
                      className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red"
                    >
                      <option value="BAJA">Baja</option>
                      <option value="NORMAL">Normal</option>
                      <option value="ALTA">Alta</option>
                      <option value="URGENTE">Urgente</option>
                    </select>
                  </div>

                  {/* Área Responsable */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-dark mb-2">Área Responsable</label>
                    <select
                      value={formData.responsibleArea}
                      onChange={(e) => {
                        const value = String(e.target.value || '').trim()
                        setFormData(prev => ({ ...prev, responsibleArea: value }))
                      }}
                      className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red"
                    >
                      <option value="">Seleccionar área...</option>
                      <option value="soporte">Soporte</option>
                      <option value="facturacion">Facturación</option>
                      <option value="tecnica">Técnica</option>
                    </select>
                  </div>

                  {/* Tipo Real */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-dark mb-2">Tipo Real</label>
                    <select
                      value={formData.realType}
                      onChange={(e) => {
                        const value = String(e.target.value || '').trim()
                        setFormData(prev => ({ ...prev, realType: value }))
                      }}
                      className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red"
                    >
                      <option value="">Seleccionar tipo...</option>
                      <option value="PETICION">Petición</option>
                      <option value="QUEJA">Queja</option>
                      <option value="RECURSO">Recurso</option>
                    </select>
                  </div>
                </div>

                {/* Notas Internas */}
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-neutral-dark mb-2">Notas Internas</label>
                  <textarea
                    value={formData.internalNotes}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, internalNotes: e.target.value }))
                    }}
                    rows={4}
                    className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red resize-none"
                    placeholder="Notas internas para el equipo..."
                  />
                </div>

                {/* Archivo adjunto en la respuesta */}
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-neutral-dark mb-2 flex items-center gap-2">
                    <Paperclip className="w-4 h-4" />
                    <span>Adjuntar archivo a la respuesta</span>
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt"
                    onChange={(e) => setAttachmentFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-neutral-dark
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary-red file:text-white
                      hover:file:bg-primary-red/90
                      cursor-pointer"
                  />
                  {pqr.responseAttachmentPath && !attachmentFile && (
                    <p className="mt-2 text-xs text-neutral-gray">
                      Ya existe un archivo adjunto para esta PQR.
                    </p>
                  )}
                </div>

                {/* Respuesta Formal */}
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-neutral-dark mb-2">Respuesta Formal</label>
                  <textarea
                    value={formData.response}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, response: e.target.value }))
                    }}
                    rows={6}
                    className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red resize-none"
                    placeholder="Respuesta formal para el cliente..."
                  />
                </div>
              </>
            ) : (
              /* Para otros estados (RESUELTA, CERRADA), mostrar formulario completo */
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Estado */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-dark mb-2">Estado *</label>
                    <select
                      value={formData.status}
                      onChange={(e) => {
                        const value = String(e.target.value || '').trim()
                        setFormData(prev => ({ ...prev, status: value }))
                      }}
                      className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red"
                    >
                      <option value="RECIBIDA">Recibida</option>
                      <option value="EN_ANALISIS">En Análisis</option>
                      <option value="EN_RESPUESTA">En Respuesta</option>
                      <option value="RESUELTA">Resuelta</option>
                      <option value="CERRADA">Cerrada</option>
                    </select>
                  </div>

                  {/* Prioridad */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-dark mb-2">Prioridad</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => {
                        const value = String(e.target.value || '').trim()
                        setFormData(prev => ({ ...prev, priority: value }))
                      }}
                      className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red"
                    >
                      <option value="BAJA">Baja</option>
                      <option value="NORMAL">Normal</option>
                      <option value="ALTA">Alta</option>
                      <option value="URGENTE">Urgente</option>
                    </select>
                  </div>

                  {/* Área Responsable */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-dark mb-2">Área Responsable</label>
                    <select
                      value={formData.responsibleArea}
                      onChange={(e) => {
                        const value = String(e.target.value || '').trim()
                        setFormData(prev => ({ ...prev, responsibleArea: value }))
                      }}
                      className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red"
                    >
                      <option value="">Seleccionar área...</option>
                      <option value="soporte">Soporte</option>
                      <option value="facturacion">Facturación</option>
                      <option value="tecnica">Técnica</option>
                    </select>
                  </div>

                  {/* Tipo Real */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-dark mb-2">Tipo Real</label>
                    <select
                      value={formData.realType}
                      onChange={(e) => {
                        const value = String(e.target.value || '').trim()
                        setFormData(prev => ({ ...prev, realType: value }))
                      }}
                      className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red"
                    >
                      <option value="">Seleccionar tipo...</option>
                      <option value="PETICION">Petición</option>
                      <option value="QUEJA">Queja</option>
                      <option value="RECURSO">Recurso</option>
                    </select>
                  </div>
                </div>

                {/* Notas Internas */}
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-neutral-dark mb-2">Notas Internas</label>
                  <textarea
                    value={formData.internalNotes}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, internalNotes: e.target.value }))
                    }}
                    rows={4}
                    className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red resize-none"
                    placeholder="Notas internas para el equipo..."
                  />
                </div>

                {/* Archivo adjunto en la respuesta */}
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-neutral-dark mb-2 flex items-center gap-2">
                    <Paperclip className="w-4 h-4" />
                    <span>Adjuntar archivo a la respuesta</span>
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt"
                    onChange={(e) => setAttachmentFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-neutral-dark
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary-red file:text-white
                      hover:file:bg-primary-red/90
                      cursor-pointer"
                  />
                  {pqr.responseAttachmentPath && !attachmentFile && (
                    <p className="mt-2 text-xs text-neutral-gray">
                      Ya existe un archivo adjunto para esta PQR.
                    </p>
                  )}
                </div>

                {/* Respuesta Formal */}
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-neutral-dark mb-2">Respuesta Formal</label>
                  <textarea
                    value={formData.response}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, response: e.target.value }))
                    }}
                    rows={6}
                    className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red resize-none"
                    placeholder="Respuesta formal para el cliente..."
                  />
                </div>
              </>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Botones */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-neutral-gray-light">
            {pqr.status === 'RECIBIDA' ? (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-neutral-gray-light rounded-lg text-neutral-dark hover:bg-neutral-gray-light transition-colors"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleSaveWithStatus('EN_ANALISIS', false, false).catch(err => {
                      console.error('Error al actualizar:', err)
                    })
                  }}
                  disabled={isSaving}
                  className="px-6 py-2 bg-primary-red text-white rounded-lg hover:bg-primary-red/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <span>{isSaving ? 'Actualizando...' : 'Actualizar a Revisión'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : pqr.status === 'EN_ANALISIS' ? (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-neutral-gray-light rounded-lg text-neutral-dark hover:bg-neutral-gray-light transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => handleSave()}
                  disabled={isSaving}
                  className="px-6 py-2 border border-primary-red text-primary-red rounded-lg hover:bg-primary-red/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Guardando...' : 'Guardar Cambios'}</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setPendingStatusChange('EN_RESPUESTA')
                    setShowStatusChangeModal(true)
                  }}
                  disabled={isSaving}
                  className="px-6 py-2 bg-primary-red text-white rounded-lg hover:bg-primary-red/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <span>{isSaving ? 'Actualizando...' : 'Actualizar a En Respuesta'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : pqr.status === 'EN_RESPUESTA' ? (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-neutral-gray-light rounded-lg text-neutral-dark hover:bg-neutral-gray-light transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => handleSave()}
                  disabled={isSaving}
                  className="px-6 py-2 border border-primary-red text-primary-red rounded-lg hover:bg-primary-red/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Guardando...' : 'Guardar Cambios'}</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setPendingStatusChange('RESUELTA')
                    setShowStatusChangeModal(true)
                  }}
                  disabled={isSaving}
                  className="px-6 py-2 bg-primary-red text-white rounded-lg hover:bg-primary-red/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <span>{isSaving ? 'Actualizando...' : 'Actualizar a Resuelta'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-neutral-gray-light rounded-lg text-neutral-dark hover:bg-neutral-gray-light transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => handleSave()}
                  disabled={isSaving}
                  className="px-6 py-2 bg-primary-red text-white rounded-lg hover:bg-primary-red/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Guardando...' : 'Guardar Cambios'}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal de éxito con animación de check */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[70] p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-8 flex flex-col items-center animate-scale-in">
            {/* Círculo con check animado */}
            <div className="relative w-20 h-20 mb-4">
              <svg className="w-20 h-20 transform rotate-[-90deg]" viewBox="0 0 100 100">
                {/* Círculo de fondo */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="4"
                />
                {/* Círculo animado */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="283"
                  strokeDashoffset="283"
                  className="animate-draw-circle"
                />
              </svg>
              {/* Check animado */}
              <svg
                className="absolute top-0 left-0 w-20 h-20"
                viewBox="0 0 100 100"
              >
                <path
                  d="M 25 50 L 45 70 L 75 30"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="60"
                  strokeDashoffset="60"
                  className="animate-draw-check"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-neutral-dark mb-2">¡Actualizado exitosamente!</h3>
            <p className="text-neutral-gray text-center">Los cambios se han actualizado correctamente</p>
          </div>
        </div>
      )}

      {/* Modal de confirmación de cambio de estado */}
      {showStatusChangeModal && pendingStatusChange && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[70] p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary-red/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-primary-red" />
              </div>
              <h3 className="text-xl font-bold text-neutral-dark">Confirmar Cambio de Estado</h3>
            </div>
            
            <p className="text-neutral-gray mb-6">
              ¿Está seguro de que desea actualizar el estado de esta PQR a <strong>"{pendingStatusChange === 'EN_RESPUESTA' ? 'En Respuesta' : pendingStatusChange === 'RESUELTA' ? 'Resuelta' : pendingStatusChange}"</strong>?
            </p>
            <p className="text-sm text-neutral-gray mb-6">
              Se enviará una notificación al cliente sobre el cambio de estado.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowStatusChangeModal(false)
                  setPendingStatusChange(null)
                }}
                className="px-4 py-2 border border-neutral-gray-light rounded-lg text-neutral-dark hover:bg-neutral-gray-light transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowStatusChangeModal(false)
                  const statusToChange = pendingStatusChange
                  setPendingStatusChange(null)
                  if (statusToChange) {
                    handleSaveWithStatus(statusToChange, false, false).catch(err => {
                      console.error('Error al actualizar:', err)
                    })
                  }
                }}
                className="px-4 py-2 bg-primary-red text-white rounded-lg hover:bg-primary-red-dark transition-colors"
              >
                Sí, actualizar estado
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para preguntar si quiere enviar la respuesta y dejarla como recibida */}
      {showResolveModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary-red/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-primary-red" />
              </div>
              <h3 className="text-xl font-bold text-neutral-dark">Enviar Respuesta</h3>
            </div>
            
            <p className="text-neutral-gray mb-6">
              ¿Quiere enviar la respuesta y dejarla como recibida?
            </p>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowResolveModal(false)
                  // Guardar sin enviar correo (ni de respuesta ni de cambio de estado)
                  handleSave(true, true).catch(err => {
                    console.error('Error al guardar:', err)
                  })
                }}
                className="px-4 py-2 border border-neutral-gray-light rounded-lg text-neutral-dark hover:bg-neutral-gray-light transition-colors"
              >
                No, solo guardar
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowResolveModal(false)
                  // Cambiar estado a RECIBIDA y enviar correo de respuesta (no enviar correo de cambio de estado)
                  handleSaveWithStatus('RECIBIDA', true, false).catch(err => {
                    console.error('Error al guardar:', err)
                  })
                }}
                className="px-4 py-2 bg-primary-red text-white rounded-lg hover:bg-primary-red-dark transition-colors"
              >
                Sí, enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
