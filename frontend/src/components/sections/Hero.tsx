'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Wifi, Tv, Users } from 'lucide-react'

export function Hero() {
  const heroRef = useRef<HTMLElement>(null)

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

    if (heroRef.current) {
      const elements = heroRef.current.querySelectorAll('.animate-on-scroll')
      elements.forEach((el) => observer.observe(el))
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-dark via-neutral-dark-light to-neutral-dark overflow-hidden pt-20"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-red/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-blue/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-on-scroll">
            <span className="text-neutral-white">Uniendo </span>
            <span className="text-gradient">Familias</span>
          </h1>

          <p className="text-xl md:text-2xl text-neutral-gray-light mb-8 animate-on-scroll delay-200">
            Internet y Televisión de alta calidad para tu hogar y negocio en Bogotá
          </p>

          <p className="text-lg text-neutral-gray-light mb-12 max-w-2xl mx-auto animate-on-scroll delay-300">
            Conectamos tu familia con el mundo. Planes flexibles, instalación rápida y atención personalizada.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-on-scroll delay-400">
            <Link href="/solicitar-instalacion" className="btn-primary text-lg px-8 py-4 flex items-center space-x-2">
              <span>Solicitar Instalación</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/planes" className="btn-outline text-lg px-8 py-4 border-neutral-white text-neutral-white hover:bg-neutral-white hover:text-neutral-dark">
              Ver Planes
            </Link>
          </div>

          {/* Features Icons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-on-scroll delay-500">
            <div className="flex flex-col items-center space-y-3 p-6 rounded-lg bg-neutral-white/5 backdrop-blur-sm border border-neutral-gray/20">
              <div className="w-16 h-16 rounded-full bg-primary-red/20 flex items-center justify-center">
                <Wifi className="w-8 h-8 text-primary-red" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-white">Internet Rápido</h3>
              <p className="text-neutral-gray-light text-sm">Velocidades de hasta 200 Mbps</p>
            </div>

            <div className="flex flex-col items-center space-y-3 p-6 rounded-lg bg-neutral-white/5 backdrop-blur-sm border border-neutral-gray/20">
              <div className="w-16 h-16 rounded-full bg-secondary-blue/20 flex items-center justify-center">
                <Tv className="w-8 h-8 text-secondary-blue" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-white">TV de Calidad</h3>
              <p className="text-neutral-gray-light text-sm">Más de 100 canales HD</p>
            </div>

            <div className="flex flex-col items-center space-y-3 p-6 rounded-lg bg-neutral-white/5 backdrop-blur-sm border border-neutral-gray/20">
              <div className="w-16 h-16 rounded-full bg-primary-red/20 flex items-center justify-center">
                <Users className="w-8 h-8 text-primary-red" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-white">Atención Personal</h3>
              <p className="text-neutral-gray-light text-sm">Soporte técnico 24/7</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-neutral-gray-light rounded-full flex justify-center">
          <div className="w-1 h-3 bg-neutral-gray-light rounded-full mt-2" />
        </div>
      </div>
    </section>
  )
}
