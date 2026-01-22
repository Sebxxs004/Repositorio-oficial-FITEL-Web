'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin, Search, CheckCircle } from 'lucide-react'

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

        <div className="max-w-2xl mx-auto mb-12 animate-on-scroll">
          <form onSubmit={handleSearch} className="relative">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-gray" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Ingresa tu dirección o localidad"
                  className="w-full pl-12 pr-4 py-4 rounded-lg bg-neutral-white/10 backdrop-blur-sm border-2 border-neutral-gray/30 text-neutral-white placeholder-neutral-gray-light focus:outline-none focus:border-primary-red transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="btn-primary px-8 py-4 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Search className="w-5 h-5" />
                <span>{isSearching ? 'Buscando...' : 'Buscar'}</span>
              </button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12 animate-on-scroll">
          {zones.map((zone, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-neutral-white/5 backdrop-blur-sm border border-neutral-gray/20 hover:border-primary-red transition-all duration-300 flex items-center space-x-3"
            >
              <CheckCircle className="w-5 h-5 text-primary-red flex-shrink-0" />
              <span className="text-neutral-white font-medium">{zone}</span>
            </div>
          ))}
        </div>

        <div className="text-center animate-on-scroll">
          <div className="inline-block p-6 rounded-xl bg-neutral-white/10 backdrop-blur-sm border border-neutral-gray/20">
            <p className="text-neutral-gray-light mb-4">
              ¿No encuentras tu zona? Contáctanos y evaluamos la posibilidad de expandir nuestra cobertura.
            </p>
            <a href="mailto:cobertura@fitel.com.co" className="text-primary-red hover:text-primary-red-light font-semibold">
              Solicitar evaluación de cobertura →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
