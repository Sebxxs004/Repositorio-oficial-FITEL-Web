'use client'

import { useState } from 'react'
import { Phone, Image as ImageIcon } from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ContactConfig } from '@/components/admin/ContactConfig'
import { CarouselConfig } from '@/components/admin/CarouselConfig'

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState<'contact' | 'carousel'>('contact')

  return (
    <AdminLayout title="Configuración">
      {/* Tabs de navegación */}
      <div className="bg-neutral-white rounded-xl shadow-lg mb-6 border border-neutral-gray-light">
        <div className="flex border-b border-neutral-gray-light">
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
              activeTab === 'contact'
                ? 'text-primary-red border-b-2 border-primary-red bg-primary-red/5'
                : 'text-neutral-gray hover:text-neutral-dark hover:bg-neutral-gray-light'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>Información de Contacto</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('carousel')}
            className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
              activeTab === 'carousel'
                ? 'text-primary-red border-b-2 border-primary-red bg-primary-red/5'
                : 'text-neutral-gray hover:text-neutral-dark hover:bg-neutral-gray-light'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <ImageIcon className="w-5 h-5" />
              <span>Gestión del Carrusel</span>
            </div>
          </button>
        </div>

        {/* Contenido de las tabs */}
        <div className="p-6">
          {activeTab === 'contact' && <ContactConfig />}
          {activeTab === 'carousel' && <CarouselConfig />}
        </div>
      </div>
    </AdminLayout>
  )
}
