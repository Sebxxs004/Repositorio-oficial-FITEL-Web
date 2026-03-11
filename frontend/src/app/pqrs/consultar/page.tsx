import { PQRsConsultarModule } from '@/components/pqrs/PQRsConsultarModule'
import { FITEL_PHONE_DISPLAY, FITEL_PHONE_TEL, FITEL_WHATSAPP_URL, FITEL_PHONE_NUMBER } from '@/config/constants'

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

export default async function ConsultarPQRsPage() {
  const contact = await getContactConfig() ?? {
    phone: FITEL_PHONE_NUMBER,
    phoneDisplay: FITEL_PHONE_DISPLAY,
    whatsapp: FITEL_PHONE_NUMBER,
  }

  const phoneDisplay = contact.phoneDisplay ?? FITEL_PHONE_DISPLAY
  const phoneTel = `tel:+${contact.phone ?? FITEL_PHONE_NUMBER}`
  const whatsappUrl = `https://wa.me/${contact.whatsapp ?? contact.phone ?? FITEL_PHONE_NUMBER}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-gray-light to-neutral-white pt-[116px]">
      <PQRsConsultarModule
        phoneDisplay={phoneDisplay}
        phoneTel={phoneTel}
        whatsappUrl={whatsappUrl}
      />
    </div>
  )
}
