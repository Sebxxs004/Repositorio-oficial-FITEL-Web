import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Plans } from '@/components/sections/Plans'
import { Coverage } from '@/components/sections/Coverage'
import { Contact } from '@/components/sections/Contact'
import { Benefits } from '@/components/sections/Benefits'

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Benefits />
      <Plans />
      <Coverage />
      <Contact />
    </>
  )
}
