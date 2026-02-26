import dynamic from 'next/dynamic'
import { Metadata } from 'next'

// Importar CoverageMap dinámicamente sin SSR para evitar problemas de hidratación
const CoverageMap = dynamic(() => import('@/components/coverage/CoverageMap').then(mod => ({ default: mod.CoverageMap })), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-neutral-gray-light to-neutral-white pt-[116px] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-red mx-auto mb-4"></div>
        <p className="text-neutral-gray">Cargando mapa de cobertura...</p>
      </div>
    </div>
  ),
})

export const metadata: Metadata = {
  title: 'Zonas de Cobertura - FITEL | Internet y TV en Bogotá',
  description: 'Consulta nuestras zonas de cobertura en Bogotá. Verifica si tu zona tiene disponibilidad de nuestros servicios de Internet y TV.',
}

export default function CoberturaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-gray-light to-neutral-white pt-[116px]">
      <CoverageMap />
    </div>
  )
}
