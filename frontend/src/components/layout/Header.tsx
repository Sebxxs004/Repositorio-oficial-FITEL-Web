'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { NavigationService } from '@/services/navigation/NavigationService'
import { PQRsDropdown } from './PQRsDropdown'
import { ServicesDropdown } from './ServicesDropdown'
import { FITEL_WHATSAPP_URL } from '@/config/constants'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

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
  }, [pathname])

  const navigationItems = NavigationService.getNavigationItems()

  const handleWhatsApp = () => {
    window.open(FITEL_WHATSAPP_URL, '_blank')
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
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
