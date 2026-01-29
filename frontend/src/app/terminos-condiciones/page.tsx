import { Metadata } from 'next'
import { TerminosCondiciones } from '@/components/informacion/TerminosCondiciones'

export const metadata: Metadata = {
  title: 'Términos y Condiciones - FITEL | Internet y TV en Bogotá',
  description: 'Términos y condiciones de uso de los servicios de FITEL. Conoce nuestros términos de servicio, políticas y condiciones contractuales.',
}

export default function TerminosCondicionesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-gray-light to-neutral-white pt-20">
      <TerminosCondiciones />
    </div>
  )
}
