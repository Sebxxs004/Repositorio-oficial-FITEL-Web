'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Save, AlertTriangle, Calendar, User, Mail, Phone, FileText, Paperclip } from 'lucide-react'

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
      
      // Verificar si está vencida
      if (pqr.slaDeadline) {
        const deadline = new Date(pqr.slaDeadline)
        setIsOverdue(deadline < new Date() && pqr.status !== 'CERRADA' && pqr.status !== 'RESUELTA')
      }
    }
  }, [pqr])

  const handleSaveWithStatus = useCallback(async (status: string, skipStatusChangeEmail: boolean) => {
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
        skipStatusChangeEmail: skipStatusChangeEmail
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

      onUpdate()
      onClose()
      setAttachmentFile(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar cambios')
    } finally {
      setIsSaving(false)
    }
  }, [pqr, formData, attachmentFile, onUpdate, onClose])

  const handleSave = useCallback(async (skipStatusChangeEmail = false) => {
    setIsSaving(true)
    setError(null)

    try {
      const currentPqr = pqr
      if (!currentPqr) {
        throw new Error('PQR no disponible')
      }

      // Obtener valores primitivos directamente del estado actual
      const currentFormData = formData
      // Usar el estado del formulario, o si está vacío, usar el estado original de la PQR
      const currentStatus = String(currentFormData.status || currentPqr.status || '').trim()
      const currentResponse = String(currentFormData.response || '').trim()

      // Validar que no se cierre fuera del SLA
      if (currentStatus === 'CERRADA' && currentPqr.slaDeadline) {
        const deadline = new Date(currentPqr.slaDeadline)
        if (deadline > new Date()) {
          setError('No se puede cerrar la PQR antes de la fecha límite del SLA')
          setIsSaving(false)
          return
        }
      }

      // Verificar si está en EN_RESPUESTA, tiene respuesta y se está guardando sin cambiar estado
      // Si es así, mostrar modal para preguntar si quiere marcarla como RESUELTA
      // El modal debe aparecer si:
      // 1. La PQR original está en EN_RESPUESTA
      // 2. Hay contenido en el campo response (no vacío)
      // 3. El estado no ha sido cambiado manualmente a otro valor diferente de EN_RESPUESTA
      const isInEnRespuesta = currentPqr.status === 'EN_RESPUESTA'
      const hasResponse = currentResponse && currentResponse.trim().length > 0
      
      // El estado sigue siendo EN_RESPUESTA si:
      // - currentStatus es 'EN_RESPUESTA' (explícitamente)
      // - currentStatus está vacío o es igual al estado original
      // - currentStatus es igual al estado original de la PQR (que es 'EN_RESPUESTA')
      const normalizedCurrentStatus = currentStatus || currentPqr.status
      const statusStillEnRespuesta = 
        normalizedCurrentStatus === 'EN_RESPUESTA' || 
        normalizedCurrentStatus === currentPqr.status
      
      // Debug: verificar condiciones
      console.log('🔍 Modal check:', {
        skipStatusChangeEmail,
        isInEnRespuesta,
        hasResponse,
        statusStillEnRespuesta,
        currentStatus: currentStatus || '(vacío)',
        normalizedCurrentStatus,
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
          normalizedCurrentStatus,
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

      // Si se está marcando como RESUELTA y hay respuesta, no enviar correo de cambio de estado
      const shouldSkipStatusChangeEmail = skipStatusChangeEmail || 
        (currentStatus === 'RESUELTA' && currentResponse !== '')

      // Crear objeto seguro usando la función helper
      const requestBody = createSafeRequestBody({
        status: currentStatus || currentFormData.status,
        priority: currentFormData.priority,
        responsibleArea: currentFormData.responsibleArea,
        realType: currentFormData.realType,
        internalNotes: currentFormData.internalNotes,
        response: currentFormData.response,
        skipStatusChangeEmail: shouldSkipStatusChangeEmail
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

      onUpdate()
      onClose()
      setAttachmentFile(null)
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
                <p className="text-neutral-dark whitespace-pre-wrap">{pqr.description}</p>
              </div>
            </div>
          </div>

          {/* Formulario de Gestión */}
          <div className="border-t border-neutral-gray-light pt-6">
            <h3 className="font-semibold text-neutral-dark mb-4">Gestión de PQR</h3>
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
                  const value = String(e.target.value || '').trim()
                  setFormData(prev => ({ ...prev, internalNotes: value }))
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
                  const value = String(e.target.value || '').trim()
                  setFormData(prev => ({ ...prev, response: value }))
                }}
                rows={6}
                className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red resize-none"
                placeholder="Respuesta formal para el cliente..."
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Botones */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-neutral-gray-light">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-neutral-gray-light rounded-lg text-neutral-dark hover:bg-neutral-gray-light transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 bg-primary-red text-white rounded-lg hover:bg-primary-red/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal para preguntar si quiere marcar como RESUELTA */}
      {showResolveModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary-red/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-primary-red" />
              </div>
              <h3 className="text-xl font-bold text-neutral-dark">Marcar como Resuelta</h3>
            </div>
            
            <p className="text-neutral-gray mb-6">
              Esta PQR tiene una respuesta y está en estado "EN_RESPUESTA". 
              ¿Deseas marcarla como "RESUELTA" y enviar la respuesta al cliente?
            </p>
            <p className="text-sm text-neutral-gray mb-6">
              <strong>Nota:</strong> Solo se enviará el correo con la respuesta, no se notificará el cambio de estado.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowResolveModal(false)
                  setIsSaving(false)
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
                  setShowResolveModal(false)
                  // Llamar directamente a handleSaveWithStatus con el estado actualizado
                  handleSaveWithStatus('RESUELTA', true).catch(err => {
                    console.error('Error al guardar:', err)
                  })
                }}
                className="px-4 py-2 bg-primary-red text-white rounded-lg hover:bg-primary-red-dark transition-colors"
              >
                Sí, marcar como Resuelta
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowResolveModal(false)
                  // Guardar sin cambiar el estado (no enviar correo de cambio de estado)
                  handleSave(false).catch(err => {
                    console.error('Error al guardar:', err)
                  })
                }}
                className="px-4 py-2 bg-neutral-gray-light text-neutral-dark rounded-lg hover:bg-neutral-gray transition-colors"
              >
                No, solo guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
