import { Hero } from '@/components/sections/Hero'
import { Plans } from '@/components/sections/Plans'
import { Benefits } from '@/components/sections/Benefits'
import { Coverage } from '@/components/sections/Coverage'
import { About } from '@/components/sections/About'
import { ContactPreview } from '@/components/sections/ContactPreview'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Plans />
      <Benefits />
      <Coverage />
      <About />
      <ContactPreview />
    </>
  )
}
