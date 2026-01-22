import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Plans } from '@/components/sections/Plans'
import { Coverage } from '@/components/sections/Coverage'
import { Benefits } from '@/components/sections/Benefits'
import { ContactPreview } from '@/components/sections/ContactPreview'

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Benefits />
      <Plans />
      <Coverage />
      <ContactPreview />
    </>
  )
}
