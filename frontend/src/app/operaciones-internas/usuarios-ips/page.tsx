'use client'

import { useState } from 'react'
import { Network, UserCog } from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { UserManagement } from '@/components/admin/UserManagement'
import { IPManagement } from '@/components/admin/IPManagement'

export default function UsuariosIPsPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'ips'>('users')

  return (
    <AdminLayout title="Gestión de Usuarios e IPs">
      {/* Tabs de navegación */}
      <div className="bg-neutral-white rounded-xl shadow-lg mb-6 border border-neutral-gray-light">
        <div className="flex border-b border-neutral-gray-light">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
              activeTab === 'users'
                ? 'text-primary-red border-b-2 border-primary-red bg-primary-red/5'
                : 'text-neutral-gray hover:text-neutral-dark hover:bg-neutral-gray-light'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <UserCog className="w-5 h-5" />
              <span>Gestión de Usuarios</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('ips')}
            className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
              activeTab === 'ips'
                ? 'text-primary-red border-b-2 border-primary-red bg-primary-red/5'
                : 'text-neutral-gray hover:text-neutral-dark hover:bg-neutral-gray-light'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Network className="w-5 h-5" />
              <span>Gestión de IPs</span>
            </div>
          </button>
        </div>

        {/* Contenido de las tabs */}
        <div className="p-6">
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'ips' && <IPManagement />}
        </div>
      </div>
    </AdminLayout>
  )
}
