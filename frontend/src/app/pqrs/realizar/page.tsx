import { PQRsModule } from '@/components/pqrs/PQRsModule'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Realizar PQR - FITEL | Presenta tu Petición, Queja o Recurso',
  description: 'Presenta tus peticiones, quejas o recursos. Estamos comprometidos con la atención y resolución de tus solicitudes.',
}

export default function RealizarPQRPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-gray-light to-neutral-white pt-[116px]">
      <PQRsModule />
    </div>
  )
}
