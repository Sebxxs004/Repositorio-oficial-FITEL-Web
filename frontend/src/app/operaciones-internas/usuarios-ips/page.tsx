'use client'

import { AdminLayout } from '@/components/admin/AdminLayout'
import { UserManagement } from '@/components/admin/UserManagement'

export default function UsuariosIPsPage() {
  return (
    <AdminLayout title="Gestión de Usuarios">
      <div className="bg-neutral-white rounded-xl shadow-lg mb-6 border border-neutral-gray-light">
        <div className="p-6">
          <UserManagement />
        </div>
      </div>
    </AdminLayout>
  )
}
