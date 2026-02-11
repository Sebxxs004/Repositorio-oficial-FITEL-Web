'use client'

import { AdminLayout } from '@/components/admin/AdminLayout'
import { ChannelManagement } from '@/components/admin/ChannelManagement'

export default function CanalesPage() {
  return (
    <AdminLayout title="Gestión de Canales">
      <ChannelManagement />
    </AdminLayout>
  )
}
