'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogIn, Loader2, AlertCircle, Lock } from 'lucide-react'
import Image from 'next/image'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Llamar al endpoint de autenticación del backend
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
      const response = await fetch(`${apiUrl}/auth/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Incluir cookies
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error de autenticación' }))
        throw new Error(errorData.message || 'Credenciales inválidas')
      }

      const jsonResponse = await response.json()
      // Estructura ApiResponse: { success: true, data: { token: ... }, ... }
      const data = jsonResponse.data || jsonResponse

      // Guardar token en cookie
      if (data.token) {
        document.cookie = `admin_token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
      }
      if (data.sessionToken) {
        document.cookie = `admin_session=${data.sessionToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
      }

      // Redirigir al dashboard
      router.push('/operaciones-internas/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-gray-light to-neutral-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-neutral-white rounded-xl shadow-2xl p-8 border border-neutral-gray-light">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-red/10 rounded-full mb-4">
              <Lock className="w-8 h-8 text-primary-red" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-dark mb-2">
              Acceso al Sistema
            </h1>
            <p className="text-neutral-gray text-sm">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {/* Formulario de login */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-neutral-dark mb-2">
                Usuario
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent"
                placeholder="Ingresa tu usuario"
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-neutral-dark mb-2">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent"
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Iniciar Sesión</span>
                </>
              )}
            </button>
          </form>

          {/* Información de seguridad */}
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
