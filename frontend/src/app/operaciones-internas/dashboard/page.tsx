'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { FileText, Users, BarChart3, TrendingUp } from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'

// Importar el gráfico dinámicamente para evitar problemas de SSR
const PQRChart = dynamic(() => import('@/components/admin/PQRChart').then(mod => ({ default: mod.PQRChart })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[300px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-red mx-auto mb-2"></div>
        <p className="text-neutral-gray text-sm">Cargando gráfico...</p>
      </div>
    </div>
  ),
})

interface DashboardStats {
  pendingPQRs: number
  activePlans: number
  activeUsers: number
  pqrTimeSeries: Array<{
    date: string
    count: number
  }>
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/dashboard/stats`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // Usar cookies HttpOnly
          }
        )

        if (response.status === 401 || response.status === 403) {
           router.push('/operaciones-internas/login')
           return
        }

        if (!response.ok) {
          throw new Error('Error al obtener estadísticas')
        }

        const data = await response.json()
        if (data.success && data.data) {
          // Formatear las fechas para el gráfico
          const formattedTimeSeries = data.data.pqrTimeSeries.map((item: { date: string; count: number }) => ({
            date: new Date(item.date).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' }),
            count: item.count,
          }))
          
          setStats({
            ...data.data,
            pqrTimeSeries: formattedTimeSeries,
          })
        } else {
          throw new Error(data.message || 'Error al obtener estadísticas')
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err)
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [router])

  if (isLoading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-red mx-auto mb-4"></div>
            <p className="text-neutral-gray">Cargando estadísticas...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout title="Dashboard">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      </AdminLayout>
    )
  }

  const statsCards = [
    {
      label: 'PQRs Pendientes',
      value: stats?.pendingPQRs?.toString() || '0',
      icon: FileText,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      label: 'Planes Activos',
      value: stats?.activePlans?.toString() || '0',
      icon: BarChart3,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Usuarios Activos',
      value: stats?.activeUsers?.toString() || '0',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
  ]

  return (
    <AdminLayout title="Dashboard">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-neutral-white rounded-xl shadow-lg p-6 border border-neutral-gray-light"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-neutral-dark mb-1">{stat.value}</h3>
              <p className="text-neutral-gray text-sm">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Gráfico de PQRs por tiempo */}
      <div className="bg-neutral-white rounded-xl shadow-lg p-6 border border-neutral-gray-light">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neutral-dark flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary-red" />
            <span>PQRs Recibidas (Últimos 30 días)</span>
          </h2>
        </div>
        <PQRChart data={stats?.pqrTimeSeries || []} />
      </div>
    </AdminLayout>
  )
}
