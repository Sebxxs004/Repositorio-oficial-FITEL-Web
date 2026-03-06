'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Loader2, AlertCircle, CheckCircle, ArrowLeft, Send } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/auth/admin/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSuccess(true)
      } else {
        setError(data.message || 'Error al procesar la solicitud')
      }
    } catch (err) {
      console.error('Error:', err)
      setError('Error de conexión. Por favor, intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-gray-light to-neutral-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-2xl p-8 border border-neutral-gray-light">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-dark mb-3">¡Correo Enviado!</h2>
              <p className="text-neutral-gray text-sm mb-2">
                Si el usuario existe, recibirás un correo electrónico con las instrucciones para recuperar tu contraseña.
              </p>
              <p className="text-neutral-gray text-xs mb-6">
                Revisa tu bandeja de entrada y la carpeta de spam.
              </p>
              <button
                onClick={() => router.push('/operaciones-internas')}
                className="w-full flex items-center justify-center space-x-2 btn-primary"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver al Login</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-gray-light to-neutral-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl p-8 border border-neutral-gray-light">
          {/* Encabezado */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-red/10 rounded-full mb-4">
              <Mail className="w-8 h-8 text-primary-red" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-dark mb-2">Recuperar Contraseña</h1>
            <p className="text-neutral-gray text-sm">
              Ingresa tu usuario o correo electrónico
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="usernameOrEmail" className="block text-sm font-semibold text-neutral-dark mb-2">
                Usuario o Email
              </label>
              <input
                id="usernameOrEmail"
                type="text"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent transition-all"
                placeholder="usuario o email@ejemplo.com"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Enviar Enlace de Recuperación</span>
                </>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push('/operaciones-internas')}
                className="inline-flex items-center space-x-1 text-sm text-primary-red hover:text-primary-red/80 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver al Login</span>
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-neutral-gray-light">
            <p className="text-xs text-neutral-gray text-center">
              Acceso restringido. Solo personal autorizado.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
