import { Contact } from '@/components/sections/Contact'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contacto - FITEL | Internet y TV en Bogotá',
  description: 'Contáctanos para consultas, soporte técnico o solicitar nuestros servicios de Internet y TV en Bogotá.',
}

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-gray-light to-neutral-white pt-[116px]">
      <Contact />
    </div>
  )
}
