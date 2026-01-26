'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Upload, Trash2, ArrowUp, ArrowDown, Loader2, Save, Plus } from 'lucide-react'

interface CarouselImage {
  id: number
  filename: string
  order: number
  url: string
}

export function CarouselConfig() {
  const [images, setImages] = useState<CarouselImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadCarouselImages()
  }, [])

  const loadCarouselImages = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/config/carousel`, {
        method: 'GET',
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setImages(data.data || [])
      }
    } catch (error) {
      console.error('Error al cargar imágenes del carrusel:', error)
      setMessage({ type: 'error', text: 'Error al cargar las imágenes del carrusel' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Por favor, selecciona un archivo de imagen válido' })
      return
    }

    setIsUploading(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/config/carousel/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Imagen subida correctamente' })
        loadCarouselImages()
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.message || 'Error al subir la imagen' })
      }
    } catch (error) {
      console.error('Error al subir imagen:', error)
      setMessage({ type: 'error', text: 'Error al subir la imagen' })
    } finally {
      setIsUploading(false)
      // Limpiar el input
      e.target.value = ''
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta imagen?')) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/config/carousel/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Imagen eliminada correctamente' })
        loadCarouselImages()
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.message || 'Error al eliminar la imagen' })
      }
    } catch (error) {
      console.error('Error al eliminar imagen:', error)
      setMessage({ type: 'error', text: 'Error al eliminar la imagen' })
    }
  }

  const handleMove = async (id: number, direction: 'up' | 'down') => {
    const currentIndex = images.findIndex((img) => img.id === id)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= images.length) return

    const newImages = [...images]
    const temp = newImages[currentIndex]
    newImages[currentIndex] = newImages[newIndex]
    newImages[newIndex] = temp

    // Actualizar el orden
    const updatedImages = newImages.map((img, index) => ({
      ...img,
      order: index + 1,
    }))

    setImages(updatedImages)

    // Guardar el nuevo orden
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/config/carousel/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ imageIds: updatedImages.map((img) => img.id) }),
      })

      if (!response.ok) {
        // Revertir si falla
        loadCarouselImages()
        setMessage({ type: 'error', text: 'Error al actualizar el orden' })
      } else {
        setMessage({ type: 'success', text: 'Orden actualizado correctamente' })
      }
    } catch (error) {
      console.error('Error al actualizar orden:', error)
      loadCarouselImages()
      setMessage({ type: 'error', text: 'Error al actualizar el orden' })
    }
  }

  const handleSaveOrder = async () => {
    setIsSaving(true)
    setMessage(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/config/carousel/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ imageIds: images.map((img) => img.id) }),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Orden guardado correctamente' })
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.message || 'Error al guardar el orden' })
      }
    } catch (error) {
      console.error('Error al guardar orden:', error)
      setMessage({ type: 'error', text: 'Error al guardar el orden' })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-red mx-auto mb-4" />
          <p className="text-neutral-gray">Cargando imágenes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-dark mb-2">Gestión del Carrusel</h2>
        <p className="text-neutral-gray">Administra las imágenes del carrusel de la página principal.</p>
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

      {/* Botón para subir nueva imagen */}
      <div className="flex items-center justify-between p-4 bg-neutral-gray-light rounded-lg border border-neutral-gray-light">
        <div>
          <h3 className="font-semibold text-neutral-dark mb-1">Agregar Nueva Imagen</h3>
          <p className="text-sm text-neutral-gray">Sube una nueva imagen para el carrusel (PNG, JPG, WEBP)</p>
        </div>
        <label className="btn-primary flex items-center space-x-2 cursor-pointer">
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Subiendo...</span>
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              <span>Subir Imagen</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading}
          />
        </label>
      </div>

      {/* Lista de imágenes */}
      {images.length === 0 ? (
        <div className="text-center py-12 bg-neutral-gray-light rounded-lg border border-neutral-gray-light">
          <p className="text-neutral-gray">No hay imágenes en el carrusel. Sube una imagen para comenzar.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-neutral-dark">Imágenes del Carrusel ({images.length})</h3>
            <button
              onClick={handleSaveOrder}
              disabled={isSaving}
              className="btn-secondary flex items-center space-x-2 px-4 py-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Guardar Orden</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images
              .sort((a, b) => a.order - b.order)
              .map((image, index) => (
                <div
                  key={image.id}
                  className="bg-neutral-white rounded-lg border border-neutral-gray-light overflow-hidden shadow-sm"
                >
                  <div className="relative aspect-video bg-neutral-gray-light">
                    <Image
                      src={image.url}
                      alt={`Carrusel ${image.order}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-2 left-2 bg-primary-red text-white px-2 py-1 rounded text-xs font-bold">
                      #{image.order}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-medium text-neutral-dark mb-2 truncate">{image.filename}</p>
                    <div className="flex items-center justify-between space-x-2">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleMove(image.id, 'up')}
                          disabled={index === 0}
                          className="p-2 rounded hover:bg-neutral-gray-light disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Mover arriba"
                        >
                          <ArrowUp className="w-4 h-4 text-neutral-gray" />
                        </button>
                        <button
                          onClick={() => handleMove(image.id, 'down')}
                          disabled={index === images.length - 1}
                          className="p-2 rounded hover:bg-neutral-gray-light disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Mover abajo"
                        >
                          <ArrowDown className="w-4 h-4 text-neutral-gray" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleDelete(image.id)}
                        className="p-2 rounded hover:bg-red-50 text-red-600"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
