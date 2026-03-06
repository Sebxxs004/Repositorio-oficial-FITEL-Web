'use client'

import { useState, useEffect } from 'react'
import { Phone, Image as ImageIcon, Lock } from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ContactConfig } from '@/components/admin/ContactConfig'
import { CarouselConfig } from '@/components/admin/CarouselConfig'
import { ChangePassword } from '@/components/admin/ChangePassword'

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState<'contact' | 'carousel' | 'password'>('password')
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkRole = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/auth/admin/me`, {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          const isAdminRole = data.data.role === 'ADMIN'
          setIsAdmin(isAdminRole)
          if (isAdminRole) {
            setActiveTab('contact')
          } else {
             setActiveTab('password')
          }
        }
      } catch (error) {
        console.error('Error fetching role', error)
      } finally {
        setLoading(false)
      }
    }
    checkRole()
  }, [])

  if (loading) return (
     <AdminLayout title="Configuración">
        <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-red"></div>
        </div>
     </AdminLayout>
  )

  return (
    <AdminLayout title="Configuración">
      <div className="bg-neutral-white rounded-xl shadow-lg mb-6 border border-neutral-gray-light">
        <div className="flex border-b border-neutral-gray-light overflow-x-auto">
          {isAdmin && (
            <>
              <button
                onClick={() => setActiveTab('contact')}
                className={`flex-1 min-w-[200px] px-6 py-4 text-center font-semibold transition-colors ${
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
                className={`flex-1 min-w-[200px] px-6 py-4 text-center font-semibold transition-colors ${
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
            </>
          )}

          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 min-w-[200px] px-6 py-4 text-center font-semibold transition-colors ${
              activeTab === 'password'
                ? 'text-primary-red border-b-2 border-primary-red bg-primary-red/5'
                : 'text-neutral-gray hover:text-neutral-dark hover:bg-neutral-gray-light'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Lock className="w-5 h-5" />
              <span>Cambiar Contraseña</span>
            </div>
          </button>
        </div>

        {/* Contenido de las tabs */}
        <div className="p-6">
          {isAdmin && activeTab === 'contact' && <ContactConfig />}
          {isAdmin && activeTab === 'carousel' && <CarouselConfig />}
          {activeTab === 'password' && <ChangePassword />}
        </div>
      </div>
    </AdminLayout>
  )
}

