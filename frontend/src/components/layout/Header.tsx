'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X, Gauge, ChevronDown, Info } from 'lucide-react'
import { NavigationService } from '@/services/navigation/NavigationService'
import { PQRsDropdown } from './PQRsDropdown'
import { ServicesDropdown } from './ServicesDropdown'
import { FITEL_WHATSAPP_URL } from '@/config/constants'

const INFO_LINKS = [
  { label: 'Mapas de Cobertura', href: '/cobertura' },
  { label: 'Comparador de planes y tarifas', href: '/planes' },
  { label: 'Factores de limitación de la velocidad de Internet', href: '/informacion-usuarios#factores-limitacion' },
  { label: 'Indicadores de calidad del servicio de Internet', href: '/informacion-usuarios#indicadores-calidad' },
  { label: 'Prácticas de gestión de tráfico', href: '/informacion-usuarios#practicas-trafico' },
  { label: 'Parrilla de canales', href: '/malla-canales' },
  { label: 'Procedimiento y trámite de PQR', href: '/pqrs' },
]

export function Header({ whatsappUrl = FITEL_WHATSAPP_URL }: { whatsappUrl?: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const pathname = usePathname()
  const infoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Cerrar menú móvil cuando cambia la ruta
  useEffect(() => {
    setIsMenuOpen(false)
    setIsInfoOpen(false)
  }, [pathname])

  // Cerrar dropdown info al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (infoRef.current && !infoRef.current.contains(e.target as Node)) {
        setIsInfoOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navigationItems = NavigationService.getNavigationItems()

  const handleWhatsApp = () => {
    window.open(whatsappUrl, '_blank')
  }

  const handleSpeedTest = () => {
    window.open('https://fitelcolombia.speedtestcustom.com/', '_blank')
  }

  // Icono de WhatsApp
  const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-neutral-white shadow-lg'
          : 'bg-neutral-white/95 backdrop-blur-sm'
      }`}
    >
      {/* TOP BAR — Información importante para usuarios (Circular SIC 005/2022) */}
      <div className="bg-[#1a1a2e] text-white">
        <div className="container-custom flex items-center justify-end h-9">
          <div className="relative" ref={infoRef}>
            <button
              onClick={() => setIsInfoOpen(!isInfoOpen)}
              className="flex items-center space-x-1.5 text-xs text-white/85 hover:text-white py-2 px-2 transition-colors duration-200"
              aria-expanded={isInfoOpen}
              aria-label="Información importante para usuarios"
            >
              <Info className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="font-medium hidden sm:inline">Información importante para usuarios</span>
              <span className="font-medium sm:hidden">Info usuarios</span>
              <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${isInfoOpen ? 'rotate-180' : ''}`} />
            </button>

            {isInfoOpen && (
              <div className="absolute right-0 top-full bg-white shadow-xl border border-neutral-gray-light rounded-b-lg w-72 overflow-hidden z-50">
                {INFO_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-start px-4 py-2.5 text-sm text-neutral-dark hover:bg-red-50 hover:text-primary-red transition-colors border-b border-neutral-gray-light/50 last:border-0"
                    onClick={() => setIsInfoOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <nav className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-12 h-12">
              <Image
                src="/assets/logo-fitel.png"
                alt="FITEL Logo"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold text-gradient">FITEL</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => {
              // Manejar enlaces con hash para que siempre vayan a la página principal
              const href = item.href.startsWith('/#') ? item.href : item.href
              
              // Si es PQRS, mostrar dropdown
              if (item.label === 'PQRS') {
                return <PQRsDropdown key={item.href} />
              }
              
              // Si es Servicios, mostrar dropdown
              if (item.label === 'Servicios') {
                return <ServicesDropdown key={item.href} />
              }
              
              return (
                <Link
                  key={item.href}
                  href={href}
                  className="text-neutral-dark hover:text-primary-red transition-colors duration-200 font-medium"
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleWhatsApp}
              className="flex items-center space-x-2 bg-[#25D366] hover:bg-[#20BA5A] text-white px-4 py-2 rounded-lg transition-colors font-medium"
              aria-label="Contactar por WhatsApp"
            >
              <WhatsAppIcon className="w-5 h-5" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={handleSpeedTest}
              className="flex items-center space-x-2 bg-primary-red hover:bg-primary-red-dark text-white px-4 py-2 rounded-lg transition-colors font-medium"
              aria-label="Probar velocidad de internet"
            >
              <Gauge className="w-5 h-5" />
              <span>SpeedTest</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-neutral-dark"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-gray-light">
            <div className="flex flex-col space-y-4">
              {navigationItems.map((item) => {
                // Manejar enlaces con hash para que siempre vayan a la página principal
                const href = item.href.startsWith('/#') ? item.href : item.href
                
                // Si es PQRS, mostrar dropdown en mobile
                if (item.label === 'PQRS') {
                  return (
                    <PQRsDropdown
                      key={item.href}
                      isMobile
                    />
                  )
                }
                
                // Si es Servicios, mostrar dropdown en mobile
                if (item.label === 'Servicios') {
                  return (
                    <ServicesDropdown
                      key={item.href}
                      isMobile
                    />
                  )
                }
                
                return (
                  <Link
                    key={item.href}
                    href={href}
                    className="text-neutral-dark hover:text-primary-red transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              })}
              <div className="pt-4 border-t border-neutral-gray-light space-y-3">
                <button
                  onClick={() => {
                    handleWhatsApp()
                    setIsMenuOpen(false)
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#20BA5A] text-white px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={() => {
                    handleSpeedTest()
                    setIsMenuOpen(false)
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-primary-red hover:bg-primary-red-dark text-white px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  <Gauge className="w-5 h-5" />
                  <span>SpeedTest</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
