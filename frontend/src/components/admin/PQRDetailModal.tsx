'use client'

import { useState, useEffect } from 'react'
import { X, Save, AlertTriangle, Calendar, User, Mail, Phone, FileText } from 'lucide-react'

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
  assignedTo?: string
  responsibleArea?: string
  realType?: string
  internalNotes?: string
  response?: string
  createdAt: string
  slaDeadline?: string
}

interface PQRDetailModalProps {
  pqr: PQR | null
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export function PQRDetailModal({ pqr, isOpen, onClose, onUpdate }: PQRDetailModalProps) {
  const [formData, setFormData] = useState({
    status: '',
    priority: '',
    assignedTo: '',
    responsibleArea: '',
    realType: '',
    internalNotes: '',
    response: '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOverdue, setIsOverdue] = useState(false)

  useEffect(() => {
    if (pqr) {
      setFormData({
        status: pqr.status || '',
        priority: pqr.priority || 'NORMAL',
        assignedTo: pqr.assignedTo || '',
        responsibleArea: pqr.responsibleArea || '',
        realType: pqr.realType || '',
        internalNotes: pqr.internalNotes || '',
        response: pqr.response || '',
      })
      
      // Verificar si está vencida
      if (pqr.slaDeadline) {
        const deadline = new Date(pqr.slaDeadline)
        setIsOverdue(deadline < new Date() && pqr.status !== 'CERRADA' && pqr.status !== 'RESUELTA')
      }
    }
  }, [pqr])

  if (!isOpen || !pqr) return null

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)

    try {
      // Validar que no se cierre fuera del SLA
      if (formData.status === 'CERRADA' && pqr.slaDeadline) {
        const deadline = new Date(pqr.slaDeadline)
        if (deadline > new Date()) {
          setError('No se puede cerrar la PQR antes de la fecha límite del SLA')
          setIsSaving(false)
          return
        }
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/pqrs/${pqr.id}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al actualizar PQR')
      }

      onUpdate()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar cambios')
    } finally {
      setIsSaving(false)
    }
  }

  const isDeadlineNear = pqr.slaDeadline
    ? new Date(pqr.slaDeadline).getTime() - new Date().getTime() < 3 * 24 * 60 * 60 * 1000
    : false

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
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, responsibleArea: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, realType: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red"
                >
                  <option value="">Seleccionar tipo...</option>
                  <option value="PETICION">Petición</option>
                  <option value="QUEJA">Queja</option>
                  <option value="RECURSO">Recurso</option>
                </select>
              </div>

              {/* Asignado a */}
              <div>
                <label className="block text-sm font-semibold text-neutral-dark mb-2">Asignado a</label>
                <input
                  type="text"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red"
                  placeholder="Nombre del operador"
                />
              </div>
            </div>

            {/* Notas Internas */}
            <div className="mt-4">
              <label className="block text-sm font-semibold text-neutral-dark mb-2">Notas Internas</label>
              <textarea
                value={formData.internalNotes}
                onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red resize-none"
                placeholder="Notas internas para el equipo..."
              />
            </div>

            {/* Respuesta Formal */}
            <div className="mt-4">
              <label className="block text-sm font-semibold text-neutral-dark mb-2">Respuesta Formal</label>
              <textarea
                value={formData.response}
                onChange={(e) => setFormData({ ...formData, response: e.target.value })}
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
    </div>
  )
}
