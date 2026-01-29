import { Metadata } from 'next'
import { InformacionUsuarios } from '@/components/informacion/InformacionUsuarios'

export const metadata: Metadata = {
  title: 'Información para Usuarios - FITEL | Internet y TV en Bogotá',
  description: 'Información útil para usuarios de FITEL: contratación, pagos, facturación, soporte técnico y más.',
}

export default function InformacionUsuariosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-gray-light to-neutral-white pt-20">
      <InformacionUsuarios />
    </div>
  )
}
