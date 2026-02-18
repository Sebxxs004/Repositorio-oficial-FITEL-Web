'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, Image as ImageIcon, Save, X } from 'lucide-react'

interface Channel {
  id: number
  name: string
  number: number
  category: string
  logo?: string
  description?: string
  active: boolean
  createdAt?: string
  updatedAt?: string
}

interface ChannelFormData {
  name: string
  number: number
  category: string
  logo?: string
  description?: string
  active: boolean
}

export function ChannelManagement() {
  const [channels, setChannels] = useState<Channel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null)
  const [formData, setFormData] = useState<ChannelFormData>({
    name: '',
    number: 1,
    category: 'ENTRETENIMIENTO',
    logo: '',
    description: '',
    active: true,
  })
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadFile(e.target.files[0])
    }
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadFile(e.dataTransfer.files[0])
    }
  }

  const uploadFile = async (file: File) => {
    setIsUploading(true)
    const uploadData = new FormData()
    uploadData.append('file', file)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/channels/upload-logo`,
        {
          method: 'POST',
          credentials: 'include',
          body: uploadData,
        }
      )
      
      const data = await response.json()
      if (data.success && data.data) {
        setFormData((prev) => ({ ...prev, logo: data.data }))
      } else {
        alert('Error al subir la imagen: ' + (data.message || 'Error desconocido'))
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error al subir la imagen')
    } finally {
      setIsUploading(false)
    }
  }

  const categories = [
    'ENTRETENIMIENTO',
    'DEPORTES',
    'NOTICIAS',
    'INFANTIL',
    'DOCUMENTALES',
    'PELÍCULAS',
    'SERIES',
    'MÚSICA',
    'CULTURA',
    'EDUCATIVO',
    'OTRO',
  ]

  useEffect(() => {
    fetchChannels()
  }, [])

  const fetchChannels = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/channels`,
        {
          credentials: 'include',
        }
      )

      if (response.ok) {
        const data = await response.json()
        setChannels(data.data || [])
      }
    } catch (error) {
      console.error('Error al cargar canales:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingChannel
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/channels/${editingChannel.id}`
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/channels`

      const response = await fetch(url, {
        method: editingChannel ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchChannels()
        resetForm()
        alert(editingChannel ? 'Canal actualizado exitosamente' : 'Canal creado exitosamente')
      } else {
        const error = await response.json()
        alert(error.message || 'Error al guardar el canal')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al guardar el canal')
    }
  }

  const handleEdit = (channel: Channel) => {
    setEditingChannel(channel)
    setFormData({
      name: channel.name,
      number: channel.number,
      category: channel.category,
      logo: channel.logo || '',
      description: channel.description || '',
      active: channel.active,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar este canal?')) return

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/channels/${id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      )

      if (response.ok) {
        await fetchChannels()
        alert('Canal eliminado exitosamente')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al eliminar el canal')
    }
  }

  const toggleActive = async (channel: Channel) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/channels/${channel.id}/toggle-active`,
        {
          method: 'PATCH',
          credentials: 'include',
        }
      )

      if (response.ok) {
        await fetchChannels()
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al cambiar el estado del canal')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      number: 1,
      category: 'ENTRETENIMIENTO',
      logo: '',
      description: '',
      active: true,
    })
    setEditingChannel(null)
    setShowForm(false)
  }

  const filteredChannels = channels.filter((channel) =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    channel.number.toString().includes(searchTerm) ||
    channel.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-red"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-neutral-dark">
            Gestión de Canales de TV
          </h3>
          <p className="text-sm text-neutral-gray mt-1">
            Administra los canales de televisión disponibles
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary-red text-neutral-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
        >
          {showForm ? (
            <>
              <X className="w-5 h-5" />
              <span>Cancelar</span>
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              <span>Nuevo Canal</span>
            </>
          )}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-neutral-white p-6 rounded-lg shadow-md border border-neutral-gray-light">
          <h4 className="text-lg font-semibold text-neutral-dark mb-4">
            {editingChannel ? 'Editar Canal' : 'Nuevo Canal'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  Nombre del Canal *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  Número de Canal *
                </label>
                <input
                  type="number"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  Categoría *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  Logo del Canal
                </label>
                <div 
                  className="border-2 border-dashed border-neutral-gray-light rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors relative"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('logo-upload')?.click()}
                >
                  <input 
                    type="file" 
                    id="logo-upload" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                  
                  {isUploading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-red"></div>
                  ) : formData.logo ? (
                     <div className="text-center w-full">
                        <div className="h-20 flex items-center justify-center mb-2">
                          <img 
                            src={formData.logo} 
                            alt="Preview" 
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <p className="text-xs text-green-600 font-semibold truncate px-2">{formData.logo.split('/').pop()}</p>
                        <p className="text-xs text-gray-400 mt-1">Clic o arrastrar para cambiar</p>
                     </div>
                  ) : (
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-1 text-sm text-gray-600">
                        <span className="font-medium text-primary-red">Sube un archivo</span> o arrástralo aquí
                      </p>
                      <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF hasta 5MB</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                rows={3}
                placeholder="Descripción del canal..."
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 text-primary-red border-neutral-gray-light rounded focus:ring-primary-red"
              />
              <label htmlFor="active" className="ml-2 text-sm font-medium text-neutral-dark">
                Canal Activo
              </label>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-6 py-2 bg-primary-red text-neutral-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>{editingChannel ? 'Actualizar' : 'Crear'} Canal</span>
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-neutral-gray-light text-neutral-dark rounded-lg hover:bg-neutral-gray transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Búsqueda */}
      <div className="bg-neutral-white p-4 rounded-lg shadow-md border border-neutral-gray-light">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-gray w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre, número o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-gray-light rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
          />
        </div>
      </div>

      {/* Lista de Canales */}
      <div className="bg-neutral-white rounded-lg shadow-md border border-neutral-gray-light overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-gray-light">
            <thead className="bg-neutral-gray-light">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                  Logo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-neutral-white divide-y divide-neutral-gray-light">
              {filteredChannels.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-neutral-gray">
                    No se encontraron canales
                  </td>
                </tr>
              ) : (
                filteredChannels.map((channel) => (
                  <tr key={channel.id} className="hover:bg-neutral-gray-light/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-dark">
                      {channel.number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {channel.logo ? (
                        <img
                          src={channel.logo}
                          alt={channel.name}
                          className="h-8 w-auto object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-neutral-gray" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral-dark">{channel.name}</div>
                      {channel.description && (
                        <div className="text-xs text-neutral-gray line-clamp-1">
                          {channel.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {channel.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleActive(channel)}
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          channel.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {channel.active ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(channel)}
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(channel.id)}
                        className="text-red-600 hover:text-red-900 inline-flex items-center"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-neutral-white p-4 rounded-lg shadow-md border border-neutral-gray-light">
          <div className="text-sm text-neutral-gray">Total Canales</div>
          <div className="text-2xl font-bold text-neutral-dark">{channels.length}</div>
        </div>
        <div className="bg-neutral-white p-4 rounded-lg shadow-md border border-neutral-gray-light">
          <div className="text-sm text-neutral-gray">Canales Activos</div>
          <div className="text-2xl font-bold text-green-600">
            {channels.filter((c) => c.active).length}
          </div>
        </div>
        <div className="bg-neutral-white p-4 rounded-lg shadow-md border border-neutral-gray-light">
          <div className="text-sm text-neutral-gray">Categorías</div>
          <div className="text-2xl font-bold text-blue-600">
            {new Set(channels.map((c) => c.category)).size}
          </div>
        </div>
      </div>
    </div>
  )
}
