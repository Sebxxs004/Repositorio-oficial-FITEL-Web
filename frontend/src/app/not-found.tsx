'use client'

import Link from 'next/link'
import { Home, ArrowLeft, Search, Phone, MessageCircle } from 'lucide-react'
import { FITEL_PHONE_NUMBER, FITEL_WHATSAPP_URL } from '@/config/constants'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-gray-light to-neutral-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Ilustración del error */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-primary-red/10 rounded-full mb-6">
            <span className="text-6xl font-bold text-primary-red">404</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-dark mb-4">
            Página no encontrada
          </h1>
          <p className="text-lg text-neutral-gray max-w-md mx-auto">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
        </div>

        {/* Opciones de navegación */}
        <div className="bg-neutral-white rounded-xl shadow-lg p-8 border border-neutral-gray-light mb-8">
          <h2 className="text-xl font-bold text-neutral-dark mb-6">
            ¿Qué te gustaría hacer?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Link
              href="/"
              className="flex items-center justify-center space-x-3 p-4 bg-primary-red/10 hover:bg-primary-red/20 rounded-lg border border-primary-red/20 transition-all duration-300 transform hover:-translate-y-1"
            >
              <Home className="w-5 h-5 text-primary-red" />
              <span className="font-semibold text-neutral-dark">Ir al Inicio</span>
            </Link>

            <Link
              href="/planes"
              className="flex items-center justify-center space-x-3 p-4 bg-secondary-blue/10 hover:bg-secondary-blue/20 rounded-lg border border-secondary-blue/20 transition-all duration-300 transform hover:-translate-y-1"
            >
              <Search className="w-5 h-5 text-secondary-blue" />
              <span className="font-semibold text-neutral-dark">Ver Planes</span>
            </Link>
          </div>

          <div className="pt-6 border-t border-neutral-gray-light">
            <p className="text-sm text-neutral-gray mb-4">
              ¿Necesitas ayuda? Contáctanos:
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`tel:+${FITEL_PHONE_NUMBER}`}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary-red hover:bg-primary-red-dark text-white rounded-lg font-medium transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Llamar</span>
              </a>
              <a
                href={FITEL_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
              <Link
                href="/contacto"
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-secondary-blue hover:bg-secondary-blue-dark text-white rounded-lg font-medium transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contacto</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Botón para volver atrás */}
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center space-x-2 text-neutral-gray hover:text-primary-red transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver atrás</span>
        </button>
      </div>
    </div>
  )
}
