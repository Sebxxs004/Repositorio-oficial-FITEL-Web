import { Contact } from '@/components/sections/Contact'
import { Metadata } from 'next'
import { FITEL_PHONE_NUMBER, FITEL_PHONE_DISPLAY, FITEL_EMAIL } from '@/config/constants'

export const metadata: Metadata = {
  title: 'Contacto - FITEL | Internet y TV en Bogotá',
  description: 'Contáctanos para consultas, soporte técnico o solicitar nuestros servicios de Internet y TV en Bogotá.',
}

async function getContactConfig() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
    const res = await fetch(`${apiUrl}/config/contact`, { next: { revalidate: 60 } })
    if (!res.ok) return null
    const json = await res.json()
    return json?.data ?? null
  } catch {
    return null
  }
}

export default async function ContactoPage() {
  const contact = await getContactConfig() ?? {
    phone: FITEL_PHONE_NUMBER,
    phoneDisplay: FITEL_PHONE_DISPLAY,
    email: FITEL_EMAIL,
    whatsapp: FITEL_PHONE_NUMBER,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-gray-light to-neutral-white pt-[116px]">
      <Contact contact={contact} />
    </div>
  )
}
