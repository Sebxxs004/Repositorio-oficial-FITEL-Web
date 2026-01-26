'use client'

import { useState, useEffect } from 'react'
import { Phone, Mail, MessageCircle, Save, Loader2 } from 'lucide-react'

interface ContactInfo {
  phone: string
  phoneDisplay: string
  email: string
  whatsapp: string
}

export function ContactConfig() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phone: '',
    phoneDisplay: '',
    email: '',
    whatsapp: '',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadContactInfo()
  }, [])

  const loadContactInfo = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/config/contact`, {
        method: 'GET',
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setContactInfo(data.data || {
          phone: '',
          phoneDisplay: '',
          email: '',
          whatsapp: '',
        })
      } else {
        // Si no existe, cargar valores por defecto
        setContactInfo({
          phone: '573108830925',
          phoneDisplay: '+57 310 883 0925',
          email: 'contacto@fitel.com.co',
          whatsapp: '573108830925',
        })
      }
    } catch (error) {
      console.error('Error al cargar información de contacto:', error)
      setMessage({ type: 'error', text: 'Error al cargar la información de contacto' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/config/contact`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(contactInfo),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Información de contacto actualizada correctamente' })
        // Recargar después de 2 segundos para verificar cambios
        setTimeout(() => {
          loadContactInfo()
        }, 2000)
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.message || 'Error al actualizar la información de contacto' })
      }
    } catch (error) {
      console.error('Error al guardar:', error)
      setMessage({ type: 'error', text: 'Error al guardar la información de contacto' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (field: keyof ContactInfo, value: string) => {
    setContactInfo((prev) => ({ ...prev, [field]: value }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-red mx-auto mb-4" />
          <p className="text-neutral-gray">Cargando información...</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-dark mb-2">Información de Contacto</h2>
        <p className="text-neutral-gray">Actualiza la información de contacto que se muestra en el sitio web.</p>
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

      {/* Teléfono */}
      <div className="space-y-2">
        <label className="flex items-center space-x-2 text-sm font-semibold text-neutral-dark">
          <Phone className="w-4 h-4 text-primary-red" />
          <span>Número de Teléfono</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              value={contactInfo.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="573001234567"
              className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red"
              required
            />
            <p className="text-xs text-neutral-gray mt-1">Número sin espacios ni signos (ej: 573001234567)</p>
          </div>
          <div>
            <input
              type="text"
              value={contactInfo.phoneDisplay}
              onChange={(e) => handleChange('phoneDisplay', e.target.value)}
              placeholder="+57 300 123 4567"
              className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red"
              required
            />
            <p className="text-xs text-neutral-gray mt-1">Formato para mostrar (ej: +57 300 123 4567)</p>
          </div>
        </div>
      </div>

      {/* WhatsApp */}
      <div className="space-y-2">
        <label className="flex items-center space-x-2 text-sm font-semibold text-neutral-dark">
          <MessageCircle className="w-4 h-4 text-primary-red" />
          <span>Número de WhatsApp</span>
        </label>
        <input
          type="text"
          value={contactInfo.whatsapp}
          onChange={(e) => handleChange('whatsapp', e.target.value)}
          placeholder="573001234567"
          className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red"
          required
        />
        <p className="text-xs text-neutral-gray">Número sin espacios ni signos (ej: 573001234567)</p>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="flex items-center space-x-2 text-sm font-semibold text-neutral-dark">
          <Mail className="w-4 h-4 text-primary-red" />
          <span>Correo Electrónico</span>
        </label>
        <input
          type="email"
          value={contactInfo.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="contacto@fitel.com.co"
          className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red"
          required
        />
      </div>

      {/* Botón de guardar */}
      <div className="flex justify-end pt-4 border-t border-neutral-gray-light">
        <button
          type="submit"
          disabled={isSaving}
          className="btn-primary flex items-center space-x-2 px-6 py-3"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Guardar Cambios</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}
