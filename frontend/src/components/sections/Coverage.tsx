'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { MapPin, Search, CheckCircle, ArrowRight } from 'lucide-react'

// Importar el mapa dinámicamente para evitar problemas de SSR
const MapComponent = dynamic(
  () => import('@/components/coverage/MapComponent').then((mod) => ({ default: mod.default })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] bg-neutral-white/10 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-red mx-auto mb-4"></div>
          <p className="text-neutral-gray-light">Cargando mapa...</p>
        </div>
      </div>
    ),
  }
)

export function Coverage() {
  const sectionRef = useRef<HTMLElement>(null)
  const [searchValue, setSearchValue] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      const elements = sectionRef.current.querySelectorAll('.animate-on-scroll')
      elements.forEach((el) => observer.observe(el))
    }

    return () => observer.disconnect()
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    // Simular búsqueda
    setTimeout(() => {
      setIsSearching(false)
      // Aquí se integraría con el backend para verificar cobertura
    }, 1500)
  }

  const zones = [
    'Chapinero',
    'Usaquén',
    'Suba',
    'Engativá',
    'Kennedy',
    'Fontibón',
    'Bosa',
    'Ciudad Bolívar',
    'San Cristóbal',
    'Rafael Uribe Uribe',
  ]

  return (
    <section ref={sectionRef} id="cobertura" className="section-padding bg-gradient-to-br from-neutral-dark to-neutral-dark-light text-neutral-white">
      <div className="container-custom">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Consulta nuestra <span className="text-gradient">Cobertura</span>
          </h2>
          <p className="text-lg text-neutral-gray-light max-w-2xl mx-auto">
            Verifica si tenemos cobertura en tu zona de Bogotá
          </p>
        </div>

        {/* Mapa de Cobertura */}
        <div className="mb-12 animate-on-scroll">
          <div className="bg-neutral-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-neutral-gray/20 p-4">
            <MapComponent geocodedLocation={null} />
          </div>
        </div>

        <div className="text-center animate-on-scroll">
          <div className="inline-block p-6 rounded-xl bg-neutral-white/10 backdrop-blur-sm border border-neutral-gray/20">
            <p className="text-neutral-gray-light mb-6">
              Consulta si tu dirección está dentro de nuestra zona de cobertura. Ingresa tu dirección en el módulo completo para verificar disponibilidad.
            </p>
            <Link 
              href="/cobertura"
              className="inline-flex items-center space-x-2 btn-primary px-8 py-4 text-lg font-semibold"
            >
              <span>Consultar si mi dirección está en cobertura</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
