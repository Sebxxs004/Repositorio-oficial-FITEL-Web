'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Wifi, Tv, Users } from 'lucide-react'
import { ImageCarousel } from './ImageCarousel'

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
      className="relative min-h-screen flex items-center overflow-hidden pt-36 md:pt-[116px]"
    >
      {/* Carrusel de imágenes como fondo */}
      <div className="absolute inset-0 z-0">
        <ImageCarousel />
      </div>

      {/* Degradado desde la izquierda que se difumina hacia la derecha */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black via-black/80 via-black/40 to-transparent" />

      {/* Degradado vertical adicional para mejor legibilidad */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 via-transparent to-black/30" />

      <div className="container-custom relative z-20 w-full">
        <div className="max-w-2xl lg:max-w-3xl text-left px-4 sm:px-6 lg:px-8">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 animate-on-scroll">
            <span className="text-neutral-white">Uniendo </span>
            <span className="text-gradient">Familias</span>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl text-neutral-white mb-6 animate-on-scroll delay-200 drop-shadow-lg font-medium">
            Internet y Televisión de alta calidad para tu hogar y negocio en Bogotá
          </p>

          <p className="text-base md:text-lg text-neutral-200 mb-8 max-w-xl animate-on-scroll delay-300 drop-shadow-md leading-relaxed">
            Conectamos tu familia con el mundo. Planes flexibles, instalación rápida y atención personalizada.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-start gap-4 mb-12 animate-on-scroll delay-400">
            <Link href="/contacto" className="btn-primary text-lg px-8 py-4 flex items-center space-x-2">
              <span>Contactar Asesor</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/planes" className="btn-outline text-lg px-8 py-4 border-neutral-white text-neutral-white hover:bg-neutral-white hover:text-neutral-dark">
              Ver Planes
            </Link>
          </div>

          {/* Features Icons - Layout horizontal más compacto */}
          <div className="flex flex-wrap gap-6 mt-12 animate-on-scroll delay-500">
            <div className="flex items-center space-x-3 p-4 rounded-lg bg-neutral-white/10 backdrop-blur-sm border border-neutral-white/20">
              <div className="w-12 h-12 rounded-full bg-primary-red/20 flex items-center justify-center flex-shrink-0">
                <Wifi className="w-6 h-6 text-primary-red" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-neutral-white">Internet Rápido</h3>
                <p className="text-neutral-gray-light text-xs">500+ Mbps</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 rounded-lg bg-neutral-white/10 backdrop-blur-sm border border-neutral-white/20">
              <div className="w-12 h-12 rounded-full bg-secondary-blue/20 flex items-center justify-center flex-shrink-0">
                <Tv className="w-6 h-6 text-secondary-blue" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-neutral-white">TV de Calidad</h3>
                <p className="text-neutral-gray-light text-xs">100+ canales HD</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 rounded-lg bg-neutral-white/10 backdrop-blur-sm border border-neutral-white/20">
              <div className="w-12 h-12 rounded-full bg-primary-red/20 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-primary-red" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-neutral-white">Atención 24/7</h3>
                <p className="text-neutral-gray-light text-xs">Soporte técnico</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <div className="w-6 h-10 border-2 border-neutral-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-neutral-white rounded-full mt-2" />
        </div>
      </div>
    </section>
  )
}
