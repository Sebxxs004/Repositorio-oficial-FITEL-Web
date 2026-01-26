'use client'

import { useState, useEffect } from 'react'
import { Network, Plus, Trash2, Lock, Save, X, Loader2, AlertCircle } from 'lucide-react'

interface AllowedIP {
  id: number
  ipAddress: string
  ipRange: string | null
  description: string | null
  active: boolean
  createdAt: string
}

interface NewIPForm {
  ipAddress: string
  ipRange: string
  description: string
  isRange: boolean
}

export function IPManagement() {
  const [ips, setIPs] = useState<AllowedIP[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newIP, setNewIP] = useState<NewIPForm>({
    ipAddress: '',
    ipRange: '',
    description: '',
    isRange: false,
  })
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadIPs()
  }, [])

  const loadIPs = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/ips`, {
        method: 'GET',
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setIPs(data.data || [])
      } else {
        setMessage({ type: 'error', text: 'Error al cargar las IPs' })
      }
    } catch (error) {
      console.error('Error al cargar IPs:', error)
      setMessage({ type: 'error', text: 'Error al cargar las IPs' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddIP = async () => {
    // Validar que se ingrese IP o rango
    if (!newIP.isRange && !newIP.ipAddress.trim()) {
      setMessage({ type: 'error', text: 'Por favor, ingresa una dirección IP' })
      return
    }

    if (newIP.isRange && !newIP.ipRange.trim()) {
      setMessage({ type: 'error', text: 'Por favor, ingresa un rango IP (ej: 192.168.1.0/24)' })
      return
    }

    // Validar formato de IP o rango
    if (newIP.isRange) {
      const rangePattern = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/
      if (!rangePattern.test(newIP.ipRange)) {
        setMessage({ type: 'error', text: 'Formato de rango inválido. Use el formato: 192.168.1.0/24' })
        return
      }
    } else {
      const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/
      if (!ipPattern.test(newIP.ipAddress)) {
        setMessage({ type: 'error', text: 'Formato de IP inválido' })
        return
      }
    }

    setIsSaving(true)
    setMessage(null)

    try {
      const requestBody: any = {
        description: newIP.description || null,
      }

      if (newIP.isRange) {
        requestBody.ipRange = newIP.ipRange
      } else {
        requestBody.ipAddress = newIP.ipAddress
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/ips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'IP agregada correctamente' })
        setNewIP({
          ipAddress: '',
          ipRange: '',
          description: '',
          isRange: false,
        })
        setShowAddForm(false)
        loadIPs()
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.message || 'Error al agregar la IP' })
      }
    } catch (error) {
      console.error('Error al agregar IP:', error)
      setMessage({ type: 'error', text: 'Error al agregar la IP' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleActive = async (ipId: number, currentStatus: boolean) => {
    if (!confirm(`¿Estás seguro de que deseas ${currentStatus ? 'inactivar' : 'activar'} esta IP?`)) {
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/ips/${ipId}/toggle-active`, {
        method: 'PUT',
        credentials: 'include',
      })

      if (response.ok) {
        setMessage({ type: 'success', text: `IP ${currentStatus ? 'inactivada' : 'activada'} correctamente` })
        loadIPs()
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.message || 'Error al cambiar el estado de la IP' })
      }
    } catch (error) {
      console.error('Error al cambiar estado:', error)
      setMessage({ type: 'error', text: 'Error al cambiar el estado de la IP' })
    }
  }

  const handleDelete = async (ipId: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta IP? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/ips/${ipId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'IP eliminada correctamente' })
        loadIPs()
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.message || 'Error al eliminar la IP' })
      }
    } catch (error) {
      console.error('Error al eliminar:', error)
      setMessage({ type: 'error', text: 'Error al eliminar la IP' })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-red mx-auto mb-4" />
          <p className="text-neutral-gray">Cargando IPs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-dark mb-2">Gestión de IPs Permitidas</h2>
        <p className="text-neutral-gray">Administra las direcciones IP permitidas para acceder al panel de administración.</p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Botón para agregar nueva IP */}
      <div className="flex items-center justify-between p-4 bg-neutral-gray-light rounded-lg border border-neutral-gray-light">
        <div>
          <h3 className="font-semibold text-neutral-dark mb-1">Agregar Nueva IP o Rango</h3>
          <p className="text-sm text-neutral-gray">Agrega una dirección IP individual o un rango CIDR (ej: 192.168.1.0/24)</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>{showAddForm ? 'Cancelar' : 'Agregar IP'}</span>
        </button>
      </div>

      {/* Formulario para agregar IP */}
      {showAddForm && (
        <div className="bg-neutral-white rounded-lg border border-neutral-gray-light p-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center space-x-4 mb-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!newIP.isRange}
                  onChange={() => setNewIP({ ...newIP, isRange: false })}
                  className="text-primary-red"
                />
                <span>Dirección IP Individual</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={newIP.isRange}
                  onChange={() => setNewIP({ ...newIP, isRange: true })}
                  className="text-primary-red"
                />
                <span>Rango CIDR</span>
              </label>
            </div>

            {newIP.isRange ? (
              <div>
                <label className="block text-sm font-semibold text-neutral-dark mb-2">
                  Rango IP (CIDR)
                </label>
                <input
                  type="text"
                  value={newIP.ipRange}
                  onChange={(e) => setNewIP({ ...newIP, ipRange: e.target.value })}
                  placeholder="192.168.1.0/24"
                  className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red"
                />
                <p className="text-xs text-neutral-gray mt-1">Ejemplo: 192.168.1.0/24 para permitir todo el rango 192.168.1.x</p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-neutral-dark mb-2">
                  Dirección IP
                </label>
                <input
                  type="text"
                  value={newIP.ipAddress}
                  onChange={(e) => setNewIP({ ...newIP, ipAddress: e.target.value })}
                  placeholder="192.168.1.5"
                  className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red"
                />
                <p className="text-xs text-neutral-gray mt-1">Ejemplo: 192.168.1.5</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-neutral-dark mb-2">
                Descripción (opcional)
              </label>
              <input
                type="text"
                value={newIP.description}
                onChange={(e) => setNewIP({ ...newIP, description: e.target.value })}
                placeholder="Ej: Oficina principal, Casa del administrador, etc."
                className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-gray-light">
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setNewIP({
                    ipAddress: '',
                    ipRange: '',
                    description: '',
                    isRange: false,
                  })
                }}
                className="px-4 py-2 border border-neutral-gray-light rounded-lg text-neutral-gray hover:bg-neutral-gray-light transition-colors flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Cancelar</span>
              </button>
              <button
                onClick={handleAddIP}
                disabled={isSaving}
                className="btn-primary flex items-center space-x-2 px-4 py-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Agregar IP</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de IPs */}
      <div className="space-y-4">
        <h3 className="font-semibold text-neutral-dark">IPs Registradas ({ips.length})</h3>
        {ips.map((ip) => (
          <div
            key={ip.id}
            className="bg-neutral-white rounded-lg border border-neutral-gray-light p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <Network className="w-5 h-5 text-primary-red" />
                  <h3 className="text-lg font-bold text-neutral-dark">
                    {ip.ipAddress || ip.ipRange || 'N/A'}
                  </h3>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    ip.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {ip.active ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-neutral-gray">
                  {ip.description && (
                    <div>
                      <span className="font-semibold">Descripción:</span> {ip.description}
                    </div>
                  )}
                  <div>
                    <span className="font-semibold">Tipo:</span>{' '}
                    {ip.ipRange ? 'Rango CIDR' : 'IP Individual'}
                  </div>
                  <div>
                    <span className="font-semibold">Creada:</span>{' '}
                    {new Date(ip.createdAt).toLocaleDateString('es-CO')}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleToggleActive(ip.id, ip.active)}
                  className={`p-2 rounded ${
                    ip.active
                      ? 'hover:bg-yellow-50 text-yellow-600'
                      : 'hover:bg-green-50 text-green-600'
                  }`}
                  title={ip.active ? 'Inactivar IP' : 'Activar IP'}
                >
                  <Lock className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(ip.id)}
                  className="p-2 rounded hover:bg-red-50 text-red-600"
                  title="Eliminar IP"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {ips.length === 0 && (
          <div className="text-center py-12 bg-neutral-gray-light rounded-lg border border-neutral-gray-light">
            <AlertCircle className="w-12 h-12 text-neutral-gray mx-auto mb-4" />
            <p className="text-neutral-gray">No hay IPs registradas. Agrega una IP para comenzar.</p>
          </div>
        )}
      </div>
    </div>
  )
}
