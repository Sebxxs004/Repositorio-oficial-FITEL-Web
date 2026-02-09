'use client'

import { AdminLayout } from '@/components/admin/AdminLayout'
import { PlanManagement } from '@/components/admin/PlanManagement'

export default function PlanesManagementPage() {
  return (
    <AdminLayout title="Gestión de Planes">
      <PlanManagement />
    </AdminLayout>
  )
}
