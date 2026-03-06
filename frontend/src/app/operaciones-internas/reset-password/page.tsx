'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle, ArrowLeft, KeyRound } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Token no válido');
      setValidating(false);
      return;
    }

    validateToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const validateToken = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/admin/validate-reset-token?token=${token}`);
      const data = await response.json();

      if (response.ok && data.success && data.data === true) {
        setTokenValid(true);
      } else {
        setError('El enlace de recuperación es inválido o ha expirado');
      }
    } catch (err) {
      console.error('Error validando token:', err);
      setError('Error al validar el enlace. Por favor, intenta nuevamente.');
    } finally {
      setValidating(false);
    }
  };

  const validatePassword = () => {
    if (newPassword.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    if (!/(?=.*[a-z])/.test(newPassword)) {
      return 'La contraseña debe contener al menos una minúscula';
    }
    if (!/(?=.*[A-Z])/.test(newPassword)) {
      return 'La contraseña debe contener al menos una mayúscula';
    }
    if (!/(?=.*\d)/.test(newPassword)) {
      return 'La contraseña debe contener al menos un número';
    }
    if (newPassword !== confirmPassword) {
      return 'Las contraseñas no coinciden';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validatePassword();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/admin/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
      } else {
        setError(data.message || 'Error al restablecer la contraseña');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error de conexión. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-gray-light to-neutral-white flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary-red mx-auto mb-4" />
          <p className="text-neutral-gray text-sm">Validando enlace...</p>
        </div>
      </div>
    )
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-gray-light to-neutral-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-2xl p-8 border border-neutral-gray-light">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-dark mb-3">Enlace Inválido</h2>
              <p className="text-neutral-gray text-sm mb-6">{error}</p>
              <button
                onClick={() => router.push('/operaciones-internas/forgot-password')}
                className="w-full flex items-center justify-center space-x-2 btn-primary"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Solicitar Nuevo Enlace</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
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
              <h2 className="text-2xl font-bold text-neutral-dark mb-3">¡Contraseña Actualizada!</h2>
              <p className="text-neutral-gray text-sm mb-6">
                Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.
              </p>
              <button
                onClick={() => router.push('/operaciones-internas/login')}
                className="w-full flex items-center justify-center space-x-2 btn-primary"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Ir al Login</span>
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
              <KeyRound className="w-8 h-8 text-primary-red" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-dark mb-2">Nueva Contraseña</h1>
            <p className="text-neutral-gray text-sm">Ingresa y confirma tu nueva contraseña</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-semibold text-neutral-dark mb-2">
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent transition-all pr-12"
                  placeholder="Mínimo 8 caracteres"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-gray hover:text-neutral-dark transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-neutral-gray mt-1">
                Debe contener al menos una mayúscula, una minúscula y un número
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-neutral-dark mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent transition-all pr-12"
                  placeholder="Confirma tu contraseña"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-gray hover:text-neutral-dark transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
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
                  <span>Actualizando...</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Restablecer Contraseña</span>
                </>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push('/operaciones-internas/login')}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-neutral-gray-light to-neutral-white flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary-red mx-auto mb-4" />
          <p className="text-neutral-gray text-sm">Cargando...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}
