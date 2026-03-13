'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { PQRDetailModal } from '@/components/admin/PQRDetailModal'
import { PQRsModule } from '@/components/pqrs/PQRsModule'
import { FileText, Search, CheckCircle, Clock, XCircle, AlertCircle, AlertTriangle } from 'lucide-react'

interface PQR {
  id: number
  cun: string
  type: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerDocumentType: string
  customerDocumentNumber: string
  customerAddress?: string
  subject: string
  description: string
  status: string
  priority: string
  responsibleArea?: string
  realType?: string
  resourceType?: string
  internalNotes?: string
  response?: string
  appealReason?: string
  createdAt: string
  updatedAt?: string
  responseDate?: string
  resolutionDate?: string
  slaDeadline?: string
}

export default function PQRsManagementPage() {
  const searchParams = useSearchParams()
  const [pqrs, setPqrs] = useState<PQR[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeSubmenu, setActiveSubmenu] = useState<'manage' | 'create'>('manage')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedPQR, setSelectedPQR] = useState<PQR | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [alerts, setAlerts] = useState<{ nearDeadline: PQR[]; overdue: PQR[] }>({
    nearDeadline: [],
    overdue: [],
  })

  useEffect(() => {
    fetchPQRs()
    fetchAlerts()
  }, [])

  useEffect(() => {
    const view = searchParams?.get('view')
    if (view === 'create' || view === 'manage') {
      setActiveSubmenu(view)
    } else {
      setActiveSubmenu('manage')
    }
  }, [searchParams])

  const fetchAlerts = async () => {
    try {
      const [nearDeadlineRes, overdueRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/pqrs/alerts/near-deadline?days=3`, {
          credentials: 'include',
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/pqrs/alerts/overdue`, {
          credentials: 'include',
        }),
      ])

      if (nearDeadlineRes.ok) {
        const data = await nearDeadlineRes.json()
        setAlerts((prev) => ({ ...prev, nearDeadline: data.data || [] }))
      }

      if (overdueRes.ok) {
        const data = await overdueRes.json()
        setAlerts((prev) => ({ ...prev, overdue: data.data || [] }))
      }
    } catch (error) {
      console.error('Error fetching alerts:', error)
    }
  }

  const fetchPQRs = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/pqrs`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error('Error al obtener PQRs')
      }
      
      const data = await response.json()
      if (data.success && data.data) {
        setPqrs(data.data)
      } else {
        setPqrs([])
      }
    } catch (error) {
      console.error('Error fetching PQRs:', error)
      setPqrs([])
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'RESUELTA':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'EN_ANALISIS':
      case 'EN_RESPUESTA':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'CERRADA':
        return <XCircle className="w-4 h-4 text-gray-600" />
      case 'RECIBIDA':
        return <AlertCircle className="w-4 h-4 text-blue-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      RECIBIDA: 'Recibida',
      EN_ANALISIS: 'En Análisis',
      EN_RESPUESTA: 'En Respuesta',
      RESUELTA: 'Resuelta',
      CERRADA: 'Cerrada',
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      RECIBIDA: 'bg-blue-100 text-blue-800 border-blue-200',
      EN_ANALISIS: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      EN_RESPUESTA: 'bg-orange-100 text-orange-800 border-orange-200',
      RESUELTA: 'bg-green-100 text-green-800 border-green-200',
      CERRADA: 'bg-gray-100 text-gray-800 border-gray-200',
    }
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const filteredPQRs = pqrs.filter((pqr) => {
    const matchesSearch =
      pqr.cun.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pqr.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pqr.subject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || pqr.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handlePQRUpdate = () => {
    fetchPQRs()
    fetchAlerts()
  }

  return (
    <AdminLayout title="Gestión de PQRs">
      {activeSubmenu === 'manage' ? (
        <>
          {/* Alertas de SLA */}
          {(alerts.overdue.length > 0 || alerts.nearDeadline.length > 0) && (
            <div className="mb-6 space-y-3">
              {alerts.overdue.length > 0 && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-red-800">
                        {alerts.overdue.length} PQR{alerts.overdue.length > 1 ? 's' : ''} Vencida{alerts.overdue.length > 1 ? 's' : ''} (SLA)
                      </p>
                      <p className="text-sm text-red-700">
                        Hay PQRs que han excedido su fecha límite de respuesta
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {alerts.nearDeadline.length > 0 && (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-yellow-800">
                        {alerts.nearDeadline.length} PQR{alerts.nearDeadline.length > 1 ? 's' : ''} Próxima{alerts.nearDeadline.length > 1 ? 's' : ''} a Vencer
                      </p>
                      <p className="text-sm text-yellow-700">
                        Hay PQRs que vencen en los próximos 3 días
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Filtros y búsqueda */}
          <div className="bg-neutral-white rounded-xl shadow-lg p-6 mb-6 border border-neutral-gray-light">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Búsqueda */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-gray" />
                <input
                  type="text"
                  placeholder="Buscar por CUN, nombre o asunto..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent"
                />
              </div>

              {/* Filtro por estado */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent bg-white"
                >
                  <option value="all">Todos los estados</option>
                  <option value="RECIBIDA">Recibida</option>
                  <option value="EN_ANALISIS">En Análisis</option>
                  <option value="EN_RESPUESTA">En Respuesta</option>
                  <option value="RESUELTA">Resuelta</option>
                  <option value="CERRADA">Cerrada</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lista de PQRs */}
          <div className="bg-neutral-white rounded-xl shadow-lg border border-neutral-gray-light overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-red mx-auto mb-2"></div>
                  <p className="text-neutral-gray">Cargando PQRs...</p>
                </div>
              </div>
            ) : filteredPQRs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <FileText className="w-16 h-16 text-neutral-gray mb-4" />
                <p className="text-neutral-gray text-lg font-semibold mb-2">No hay PQRs</p>
                <p className="text-neutral-gray text-sm">
                  {searchQuery || statusFilter !== 'all'
                    ? 'No se encontraron PQRs con los filtros aplicados'
                    : 'Aún no hay PQRs registradas en el sistema'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-gray-light">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-dark uppercase tracking-wider">
                        CUN
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-dark uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-dark uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-dark uppercase tracking-wider">
                        Asunto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-dark uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-dark uppercase tracking-wider">
                        Prioridad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-dark uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-dark uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-gray-light">
                    {filteredPQRs.map((pqr) => (
                      <tr key={pqr.id} className="hover:bg-neutral-gray-light/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-mono text-sm font-semibold text-primary-red">{pqr.cun}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-neutral-dark">{pqr.type}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-semibold text-neutral-dark">{pqr.customerName}</p>
                            <p className="text-xs text-neutral-gray">{pqr.customerEmail}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-neutral-dark max-w-xs truncate" title={pqr.subject}>
                            {pqr.subject}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full border text-xs font-semibold ${getStatusColor(
                              pqr.status
                            )}`}
                          >
                            {getStatusIcon(pqr.status)}
                            <span>{getStatusLabel(pqr.status)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-neutral-dark">{pqr.priority}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm text-neutral-dark">
                            {new Date(pqr.createdAt).toLocaleDateString('es-CO', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            type="button"
                            className="text-primary-red hover:text-primary-red/80 font-semibold transition-colors"
                            onClick={() => {
                              setSelectedPQR(pqr)
                              setIsModalOpen(true)
                            }}
                          >
                            Ver detalles
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Estadísticas rápidas */}
          {!isLoading && filteredPQRs.length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-600 font-semibold mb-1">Recibidas</p>
                <p className="text-2xl font-bold text-blue-800">
                  {filteredPQRs.filter((p) => p.status === 'RECIBIDA').length}
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-600 font-semibold mb-1">En Proceso</p>
                <p className="text-2xl font-bold text-yellow-800">
                  {filteredPQRs.filter((p) => p.status === 'EN_ANALISIS' || p.status === 'EN_RESPUESTA').length}
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-600 font-semibold mb-1">Resueltas</p>
                <p className="text-2xl font-bold text-green-800">
                  {filteredPQRs.filter((p) => p.status === 'RESUELTA').length}
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 font-semibold mb-1">Cerradas</p>
                <p className="text-2xl font-bold text-gray-800">
                  {filteredPQRs.filter((p) => p.status === 'CERRADA').length}
                </p>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-neutral-white rounded-xl shadow-lg border border-neutral-gray-light overflow-hidden">
          <PQRsModule />
        </div>
      )}

      {/* Modal de Detalles */}
      <PQRDetailModal
        pqr={selectedPQR}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedPQR(null)
        }}
        onUpdate={handlePQRUpdate}
      />
    </AdminLayout>
  )
}
