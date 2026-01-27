'use client'

import { useState, useEffect } from 'react'
import { Mail, Key, Server, Save, Loader2, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react'

interface EmailInfo {
  email: string
  appPassword: string
  smtpHost: string
  smtpPort: number
  enabled: boolean
}

export function EmailConfig() {
  const [emailInfo, setEmailInfo] = useState<EmailInfo>({
    email: '',
    appPassword: '',
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    enabled: true,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadEmailInfo()
  }, [])

  const loadEmailInfo = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/config/email`, {
        method: 'GET',
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setEmailInfo({
          email: data.data?.email || '',
          appPassword: '', // No se devuelve la contraseña por seguridad
          smtpHost: data.data?.smtpHost || 'smtp.gmail.com',
          smtpPort: data.data?.smtpPort || 587,
          enabled: data.data?.enabled !== undefined ? data.data.enabled : true,
        })
      } else {
        // Valores por defecto
        setEmailInfo({
          email: 'sebastincano12560@gmail.com',
          appPassword: '',
          smtpHost: 'smtp.gmail.com',
          smtpPort: 587,
          enabled: true,
        })
      }
    } catch (error) {
      console.error('Error al cargar configuración de email:', error)
      setMessage({ type: 'error', text: 'Error al cargar la configuración de email' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    try {
      // Validar que si se habilita, tenga email y contraseña
      if (emailInfo.enabled && (!emailInfo.email || !emailInfo.appPassword)) {
        setMessage({ type: 'error', text: 'El email y la contraseña de aplicación son requeridos cuando el envío está habilitado' })
        setIsSaving(false)
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/config/email`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: emailInfo.email,
          appPassword: emailInfo.appPassword || undefined, // Solo enviar si hay valor
          smtpHost: emailInfo.smtpHost,
          smtpPort: emailInfo.smtpPort,
          enabled: emailInfo.enabled,
        }),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Configuración de email actualizada correctamente' })
        // Limpiar contraseña del formulario después de guardar
        setEmailInfo((prev) => ({ ...prev, appPassword: '' }))
        // Recargar después de 2 segundos
        setTimeout(() => {
          loadEmailInfo()
        }, 2000)
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.message || 'Error al actualizar la configuración de email' })
      }
    } catch (error) {
      console.error('Error al guardar:', error)
      setMessage({ type: 'error', text: 'Error al guardar la configuración de email' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (field: keyof EmailInfo, value: string | number | boolean) => {
    setEmailInfo((prev) => ({ ...prev, [field]: value }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-red mx-auto mb-4" />
          <p className="text-neutral-gray">Cargando configuración...</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-dark mb-2">Configuración de Email</h2>
        <p className="text-neutral-gray">
          Configura el email y contraseña de aplicación de Gmail para el envío automático de constancias de PQR.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg flex items-start space-x-3 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <p>{message.text}</p>
        </div>
      )}

      {/* Información importante */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">¿Cómo obtener una contraseña de aplicación?</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Habilita la verificación en dos pasos en tu cuenta de Gmail</li>
              <li>Ve a: <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="underline">myaccount.google.com/apppasswords</a></li>
              <li>Selecciona "Correo" y "Otro (nombre personalizado)" → "FITEL Web"</li>
              <li>Copia la contraseña de 16 caracteres (sin espacios)</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="flex items-center space-x-2 text-sm font-semibold text-neutral-dark">
          <Mail className="w-4 h-4 text-primary-red" />
          <span>Email de Gmail</span>
        </label>
        <input
          type="email"
          value={emailInfo.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="tu-email@gmail.com"
          className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red"
          required
        />
        <p className="text-xs text-neutral-gray">Email desde el cual se enviarán los correos</p>
      </div>

      {/* Contraseña de aplicación */}
      <div className="space-y-2">
        <label className="flex items-center space-x-2 text-sm font-semibold text-neutral-dark">
          <Key className="w-4 h-4 text-primary-red" />
          <span>Contraseña de Aplicación</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={emailInfo.appPassword}
            onChange={(e) => handleChange('appPassword', e.target.value)}
            placeholder="Ingresa la contraseña de aplicación (sin espacios)"
            className="w-full px-4 py-2 pr-10 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red"
            required={emailInfo.enabled}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-gray hover:text-neutral-dark"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        <p className="text-xs text-neutral-gray">
          Deja en blanco si no quieres cambiar la contraseña actual. Ingresa la contraseña sin espacios.
        </p>
      </div>

      {/* Servidor SMTP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-semibold text-neutral-dark">
            <Server className="w-4 h-4 text-primary-red" />
            <span>Servidor SMTP</span>
          </label>
          <input
            type="text"
            value={emailInfo.smtpHost}
            onChange={(e) => handleChange('smtpHost', e.target.value)}
            placeholder="smtp.gmail.com"
            className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-neutral-dark">Puerto SMTP</label>
          <input
            type="number"
            value={emailInfo.smtpPort}
            onChange={(e) => handleChange('smtpPort', parseInt(e.target.value) || 587)}
            placeholder="587"
            className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red"
            required
            min="1"
            max="65535"
          />
        </div>
      </div>

      {/* Habilitar/Deshabilitar */}
      <div className="flex items-center space-x-3 p-4 bg-neutral-gray-light rounded-lg">
        <input
          type="checkbox"
          id="enabled"
          checked={emailInfo.enabled}
          onChange={(e) => handleChange('enabled', e.target.checked)}
          className="w-5 h-5 text-primary-red border-neutral-gray-light rounded focus:ring-primary-red"
        />
        <label htmlFor="enabled" className="text-sm font-semibold text-neutral-dark cursor-pointer">
          Habilitar envío de correos electrónicos
        </label>
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
              <span>Guardar Configuración</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}
