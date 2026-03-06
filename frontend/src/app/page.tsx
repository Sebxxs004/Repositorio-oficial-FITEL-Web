import { Hero } from '@/components/sections/Hero'
import { Plans } from '@/components/sections/Plans'
import { Benefits } from '@/components/sections/Benefits'
import { Coverage } from '@/components/sections/Coverage'
import { About } from '@/components/sections/About'
import { ContactPreview } from '@/components/sections/ContactPreview'
import { FITEL_PHONE_NUMBER, FITEL_PHONE_DISPLAY, FITEL_EMAIL } from '@/config/constants'

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

export default async function HomePage() {
  const contact = await getContactConfig() ?? {
    phone: FITEL_PHONE_NUMBER,
    phoneDisplay: FITEL_PHONE_DISPLAY,
    email: FITEL_EMAIL,
    whatsapp: FITEL_PHONE_NUMBER,
  }

  return (
    <>
      <Hero />
      <Plans />
      <Benefits />
      <Coverage />
      <About />
      <ContactPreview contact={contact} />
    </>
  )
}
