'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ShieldAlert, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

type AlertState = 'loading' | 'success' | 'error';

function SecurityAlertContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [state, setState] = useState<AlertState>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!token) {
      setErrorMessage('Token de seguridad no encontrado. El enlace puede ser invalido o haber expirado.');
      setState('error');
      return;
    }

    const revokeSessions = async () => {
      try {
        const apiBase =
          process.env.NEXT_PUBLIC_API_URL ||
          'https://fitel-backend.blackocean-69d60157.eastus.azurecontainerapps.io';

        const res = await fetch(`${apiBase}/api/auth/admin/revoke-sessions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Error al revocar las sesiones.');
        }

        setResetToken(data.data);
        setState('success');
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : 'Ocurrio un error inesperado.';
        setErrorMessage(msg);
        setState('error');
      }
    };

    revokeSessions();
  }, [token]);

  useEffect(() => {
    if (state !== 'success' || !resetToken) return;

    if (countdown <= 0) {
      router.push(`/operaciones-internas/reset-password?token=${resetToken}`);
      return;
    }

    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [state, countdown, resetToken, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-red-600 px-8 py-6 text-center">
          <ShieldAlert className="mx-auto mb-2 text-white" size={40} strokeWidth={1.8} />
          <h1 className="text-xl font-bold text-white tracking-wide">FITEL</h1>
          <p className="text-red-100 text-sm mt-1">Alerta de Seguridad</p>
        </div>

        <div className="px-8 py-8 text-center">
          {state === 'loading' && (
            <>
              <Loader2 className="mx-auto mb-4 animate-spin text-red-600" size={48} />
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Procesando solicitud</h2>
              <p className="text-gray-500 text-sm">Estamos revocando todas las sesiones activas. Por favor espera.</p>
            </>
          )}

          {state === 'success' && (
            <>
              <CheckCircle className="mx-auto mb-4 text-green-500" size={48} />
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Sesiones revocadas correctamente</h2>
              <p className="text-gray-500 text-sm mb-6">
                Todas tus sesiones activas han sido cerradas. Seras redirigido para establecer una nueva contrasena.
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
                <p className="text-gray-600 text-sm">
                  Redirigiendo en <span className="font-bold text-red-600 text-lg">{countdown}</span> segundo{countdown !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={() => router.push(`/operaciones-internas/reset-password?token=${resetToken}`)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200"
              >
                Cambiar contrasena ahora
              </button>
            </>
          )}

          {state === 'error' && (
            <>
              <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
              <h2 className="text-lg font-semibold text-gray-800 mb-2">No se pudo completar la accion</h2>
              <p className="text-gray-500 text-sm mb-6">{errorMessage}</p>
              <button
                onClick={() => router.push('/operaciones-internas/forgot-password')}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200"
              >
                Recuperar contrasena manualmente
              </button>
            </>
          )}
        </div>

        <div className="px-8 pb-6 text-center">
          <p className="text-xs text-gray-400">Si no solicitaste este cambio, contacta al administrador del sistema.</p>
        </div>
      </div>
    </div>
  );
}

export default function SecurityAlertPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-red-600 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Cargando</p>
          </div>
        </div>
      }
    >
      <SecurityAlertContent />
    </Suspense>
  );
}
