'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { Plus, Edit, Trash2, Power, PowerOff, Save, X, Loader2, Upload, Image as ImageIcon } from 'lucide-react'
import { resolveAssetUrl } from '@/lib/utils'

interface Plan {
  id: number
  name: string
  description: string
  internetSpeedMbps: number
  tvChannels: number
  monthlyPrice: number
  active: boolean
  popular: boolean
  planType: string
  backgroundImage?: string
  createdAt?: string
  updatedAt?: string
}

interface PlanForm {
  name: string
  description: string
  internetSpeedMbps: number
  tvChannels: number
  monthlyPrice: number | null
  active: boolean
  popular: boolean
  backgroundImage?: string
}

// Función para calcular el total de canales en la malla
function getTotalChannelsInGrid(): number {
  const canales = [
    { categoria: 'Telenovelas', count: 4 },
    { categoria: 'Deportes', count: 7 },
    { categoria: 'Nacionales', count: 21 },
    { categoria: 'Infantiles', count: 11 },
    { categoria: 'Series y Películas', count: 20 },
    { categoria: 'Investigación / Documentales', count: 8 },
    { categoria: 'Música', count: 8 },
    { categoria: 'Religiosos', count: 5 },
  ]
  return canales.reduce((total, grupo) => total + grupo.count, 0)
}

export function PlanManagement() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [useFullChannelGrid, setUseFullChannelGrid] = useState(false)
  
  // Calcular el total de canales
  const totalChannels = useMemo(() => getTotalChannelsInGrid(), [])
  
  const [formData, setFormData] = useState<PlanForm>({
    name: '',
    description: '',
    internetSpeedMbps: 50,
    tvChannels: 84,
    monthlyPrice: null,
    active: true,
    popular: false,
    backgroundImage: '',
  })

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/plans`, {
        method: 'GET',
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setPlans(data.data || [])
      } else {
        setMessage({ type: 'error', text: 'Error al cargar los planes' })
      }
    } catch (error) {
      console.error('Error al cargar planes:', error)
      setMessage({ type: 'error', text: 'Error al cargar los planes' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingPlan(null)
    setUseFullChannelGrid(false)
    setFormData({
      name: '',
      description: '',
      internetSpeedMbps: 50,
      tvChannels: 84,
      monthlyPrice: null,
      active: true,
      popular: false,
      backgroundImage: '',
    })
    setShowForm(true)
    setMessage(null)
  }
  
  // Asegurar que backgroundImage siempre sea una cadena
  const safeBackgroundImage = formData.backgroundImage || ''

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan)
    const isFullGrid = plan.tvChannels === totalChannels
    setUseFullChannelGrid(isFullGrid)
    setFormData({
      name: plan.name || '',
      description: plan.description || '',
      internetSpeedMbps: plan.internetSpeedMbps || 0,
      tvChannels: plan.tvChannels || 0,
      monthlyPrice: plan.monthlyPrice > 0 ? plan.monthlyPrice : null,
      backgroundImage: plan.backgroundImage || '',
      active: plan.active ?? true,
      popular: plan.popular ?? false,
    })
    setShowForm(true)
    setMessage(null)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingPlan(null)
    setUseFullChannelGrid(false)
    setMessage(null)
  }

  // Efecto para sincronizar el checkbox con el número de canales
  useEffect(() => {
    if (useFullChannelGrid) {
      setFormData((prev) => ({ ...prev, tvChannels: totalChannels }))
    }
  }, [useFullChannelGrid, totalChannels])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  const handleFileUpload = async (file: File) => {
    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'El archivo debe ser una imagen' })
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'La imagen no puede ser mayor a 5MB' })
      return
    }

    setIsUploadingImage(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/plans/upload-image`,
        {
          method: 'POST',
          credentials: 'include',
          body: formData,
        }
      )

      if (response.ok) {
        const data = await response.json()
        setFormData((prev) => ({ ...prev, backgroundImage: data.data || '' }))
        setMessage({ type: 'success', text: 'Imagen subida correctamente' })
      } else {
        const errorData = await response.json()
        setMessage({ type: 'error', text: errorData.message || 'Error al subir la imagen' })
      }
    } catch (error) {
      console.error('Error al subir imagen:', error)
      setMessage({ type: 'error', text: 'Error al subir la imagen' })
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleSave = async () => {
    if (!formData.name || !formData.internetSpeedMbps || !formData.tvChannels) {
      setMessage({ type: 'error', text: 'Por favor completa todos los campos obligatorios' })
      return
    }

    setIsSaving(true)
    setMessage(null)

    try {
      const url = editingPlan
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/plans/${editingPlan.id}`
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/plans`

      const method = editingPlan ? 'PUT' : 'POST'

      // Asegurar que todos los campos estén definidos antes de enviar
      const dataToSend = {
        name: formData.name,
        description: formData.description || '',
        internetSpeedMbps: formData.internetSpeedMbps || 0,
        tvChannels: formData.tvChannels || 0,
        monthlyPrice: formData.monthlyPrice ?? 0,
        active: formData.active ?? true,
        popular: formData.popular ?? false,
        backgroundImage: formData.backgroundImage || '',
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(dataToSend),
      })

      if (response.ok) {
        const data = await response.json()
        setMessage({ type: 'success', text: editingPlan ? 'Plan actualizado exitosamente' : 'Plan creado exitosamente' })
        setShowForm(false)
        setEditingPlan(null)
        loadPlans()
      } else {
        const errorData = await response.json()
        setMessage({ type: 'error', text: errorData.message || 'Error al guardar el plan' })
      }
    } catch (error) {
      console.error('Error al guardar plan:', error)
      setMessage({ type: 'error', text: 'Error al guardar el plan' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este plan?')) {
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/plans/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Plan eliminado exitosamente' })
        loadPlans()
      } else {
        const errorData = await response.json()
        setMessage({ type: 'error', text: errorData.message || 'Error al eliminar el plan' })
      }
    } catch (error) {
      console.error('Error al eliminar plan:', error)
      setMessage({ type: 'error', text: 'Error al eliminar el plan' })
    }
  }

  const handleToggleActive = async (id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/plans/${id}/toggle-active`, {
        method: 'PUT',
        credentials: 'include',
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Estado del plan actualizado exitosamente' })
        loadPlans()
      } else {
        const errorData = await response.json()
        setMessage({ type: 'error', text: errorData.message || 'Error al actualizar el estado del plan' })
      }
    } catch (error) {
      console.error('Error al actualizar estado del plan:', error)
      setMessage({ type: 'error', text: 'Error al actualizar el estado del plan' })
    }
  }

  const formatPrice = (price: number | null | undefined) => {
    if (!price || price <= 0) return '—'
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-red" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con botón de crear */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-neutral-dark">Gestión de Planes</h2>
          <p className="text-neutral-gray mt-1">Administra los planes de Internet y TV disponibles</p>
        </div>
        <button
          onClick={handleCreate}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Plan</span>
        </button>
      </div>

      {/* Mensaje de éxito/error */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Formulario de crear/editar */}
      {showForm && (
        <div className="bg-neutral-white rounded-xl shadow-lg border border-neutral-gray-light p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-neutral-dark">
              {editingPlan ? 'Editar Plan' : 'Nuevo Plan'}
            </h3>
            <button
              onClick={handleCancel}
              className="text-neutral-gray hover:text-neutral-dark"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-neutral-dark mb-2">
                Nombre del Plan *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red"
                placeholder="Ej: Básico, Familiar, Gaming"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-dark mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red"
                rows={3}
                placeholder="Descripción del plan..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-neutral-dark mb-2">
                Imagen de Fondo del Plan
              </label>
              
              {/* Zona de Drag & Drop */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
                  dragActive
                    ? 'border-primary-red bg-primary-red/5'
                    : 'border-neutral-gray-light hover:border-primary-red/50'
                } ${isUploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                  disabled={isUploadingImage}
                />
                
                {isUploadingImage ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-8 h-8 text-primary-red animate-spin mb-2" />
                    <p className="text-sm text-neutral-gray">Subiendo imagen...</p>
                  </div>
                ) : safeBackgroundImage ? (
                  <div className="relative">
                    <img
                      src={resolveAssetUrl(safeBackgroundImage)}
                      alt="Vista previa"
                      className="w-full h-48 object-cover rounded-lg border border-neutral-gray-light"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <div className="text-white text-center">
                        <Upload className="w-6 h-6 mx-auto mb-1" />
                        <p className="text-xs">Haz clic para cambiar</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <ImageIcon className="w-12 h-12 text-neutral-gray mb-2" />
                    <p className="text-sm font-semibold text-neutral-dark mb-1">
                      Arrastra una imagen aquí o haz clic para seleccionar
                    </p>
                    <p className="text-xs text-neutral-gray">
                      PNG, JPG, GIF hasta 5MB
                    </p>
                  </div>
                )}
              </div>
              
              {safeBackgroundImage && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setFormData((prev) => ({ ...prev, backgroundImage: '' }))
                  }}
                  className="mt-2 text-sm text-primary-red hover:text-primary-red/80"
                >
                  Eliminar imagen
                </button>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-dark mb-2">
                Velocidad de Internet (Mbps) *
              </label>
              <input
                type="number"
                value={formData.internetSpeedMbps}
                onChange={(e) => setFormData({ ...formData, internetSpeedMbps: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-dark mb-2">
                Canales de TV *
              </label>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-neutral-gray-light/50 rounded-lg border border-neutral-gray-light">
                  <input
                    type="checkbox"
                    id="useFullChannelGrid"
                    checked={useFullChannelGrid}
                    onChange={(e) => {
                      setUseFullChannelGrid(e.target.checked)
                      if (e.target.checked) {
                        setFormData((prev) => ({ ...prev, tvChannels: totalChannels }))
                      }
                    }}
                    className="w-5 h-5 text-primary-red border-neutral-gray-light rounded focus:ring-primary-red cursor-pointer"
                  />
                  <label htmlFor="useFullChannelGrid" className="text-sm font-semibold text-neutral-dark cursor-pointer flex-1">
                    Toda la malla de canales ({totalChannels} canales)
                  </label>
                </div>
                <input
                  type="number"
                  value={formData.tvChannels || 0}
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value) || 0
                    setFormData((prev) => ({ ...prev, tvChannels: newValue }))
                    // Si el usuario cambia manualmente y no coincide con el total, desmarcar el checkbox
                    if (useFullChannelGrid && newValue !== totalChannels) {
                      setUseFullChannelGrid(false)
                    }
                  }}
                  disabled={useFullChannelGrid}
                  className={`w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red ${
                    useFullChannelGrid ? 'bg-neutral-gray-light/50 cursor-not-allowed' : ''
                  }`}
                  min="1"
                />
                {useFullChannelGrid && (
                  <p className="text-xs text-primary-red font-medium">
                    ✓ Incluye todos los {totalChannels} canales de la malla completa
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-dark mb-2">
                Precio Mensual (COP) <span className="text-neutral-gray font-normal text-xs ml-1">(opcional)</span>
              </label>
              <input
                type="number"
                value={formData.monthlyPrice === null ? '' : formData.monthlyPrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    monthlyPrice: e.target.value === '' ? null : parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red"
                placeholder="Dejar vacío si el precio es a convenir"
                min="0"
                step="0.01"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-primary-red rounded focus:ring-primary-red"
                />
                <span className="text-sm font-semibold text-neutral-dark">Activo</span>
              </label>

              <div className="flex flex-col">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.popular}
                    onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                    className="w-4 h-4 text-primary-red rounded focus:ring-primary-red"
                  />
                  <span className="text-sm font-semibold text-neutral-dark">Más Popular</span>
                </label>
                {formData.popular && (
                  <p className="text-xs text-neutral-gray mt-1 ml-6">
                    Al marcar este plan como popular, se desmarcará automáticamente el otro plan popular.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-neutral-gray-light rounded-lg text-neutral-dark hover:bg-neutral-gray-light transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn-primary flex items-center space-x-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Guardar</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Tabla de planes */}
      <div className="bg-neutral-white rounded-xl shadow-lg border border-neutral-gray-light overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-gray-light">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-dark">Nombre</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-dark">Velocidad</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-dark">Canales</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-dark">Precio</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-dark">Estado</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-neutral-dark">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-gray-light">
              {plans.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-gray">
                    No hay planes registrados
                  </td>
                </tr>
              ) : (
                plans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-neutral-gray-light/50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-neutral-dark">{plan.name}</div>
                        {plan.popular && (
                          <span className="text-xs bg-primary-red text-white px-2 py-1 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-gray">{plan.internetSpeedMbps} Mbps</td>
                    <td className="px-6 py-4 text-neutral-gray">{plan.tvChannels}</td>
                    <td className="px-6 py-4 font-semibold text-neutral-dark">{formatPrice(plan.monthlyPrice)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          plan.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {plan.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleToggleActive(plan.id)}
                          className="p-2 text-neutral-gray hover:text-primary-red transition-colors"
                          title={plan.active ? 'Desactivar' : 'Activar'}
                        >
                          {plan.active ? <PowerOff className="w-5 h-5" /> : <Power className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={() => handleEdit(plan)}
                          className="p-2 text-neutral-gray hover:text-secondary-blue transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(plan.id)}
                          className="p-2 text-neutral-gray hover:text-primary-red transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
