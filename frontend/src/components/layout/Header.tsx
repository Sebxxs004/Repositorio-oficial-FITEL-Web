'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X, Phone, MessageCircle } from 'lucide-react'
import { NavigationService } from '@/services/navigation/NavigationService'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigationItems = NavigationService.getNavigationItems()

  const handleWhatsApp = () => {
    window.open('https://wa.me/573001234567', '_blank')
  }

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
              className="flex items-center space-x-2 text-secondary-blue hover:text-secondary-blue-dark transition-colors"
              aria-label="Contactar por WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">WhatsApp</span>
            </button>
            <a
              href="tel:+573001234567"
              className="flex items-center space-x-2 text-primary-red hover:text-primary-red-dark transition-colors"
              aria-label="Llamar"
            >
              <Phone className="w-5 h-5" />
              <span className="font-medium">Llamar</span>
            </a>
            <Link href="/solicitar-instalacion" className="btn-primary">
              Solicitar Instalación
            </Link>
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
                  className="w-full flex items-center justify-center space-x-2 btn-secondary"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp</span>
                </button>
                <a
                  href="tel:+573001234567"
                  className="w-full flex items-center justify-center space-x-2 btn-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Phone className="w-5 h-5" />
                  <span>Llamar</span>
                </a>
                <Link
                  href="/solicitar-instalacion"
                  className="w-full btn-outline text-center block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Solicitar Instalación
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
