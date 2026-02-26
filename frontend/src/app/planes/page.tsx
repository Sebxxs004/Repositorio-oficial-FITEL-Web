import { PlanComparator } from '@/components/plans/PlanComparator'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Comparador de Planes - FITEL | Internet y TV en Bogotá',
  description: 'Compara nuestros planes de Internet y TV. Encuentra el plan perfecto para tu hogar o negocio en Bogotá.',
}

export default function PlanesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-gray-light to-neutral-white pt-[116px]">
      <PlanComparator />
    </div>
  )
}
