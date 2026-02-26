import { Metadata } from 'next'
import { PoliticaPrivacidad } from '@/components/informacion/PoliticaPrivacidad'

export const metadata: Metadata = {
  title: 'Política de Privacidad - FITEL | Internet y TV en Bogotá',
  description: 'Política de privacidad y protección de datos personales de FITEL. Conoce cómo protegemos y tratamos tu información personal.',
}

export default function PoliticaPrivacidadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-gray-light to-neutral-white pt-[116px]">
      <PoliticaPrivacidad />
    </div>
  )
}
