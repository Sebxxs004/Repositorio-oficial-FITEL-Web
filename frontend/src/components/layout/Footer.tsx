import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react'
import { FITEL_PHONE_NUMBER, FITEL_PHONE_DISPLAY, FITEL_PHONE_TEL, FITEL_EMAIL } from '@/config/constants'

async function getContactConfig() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
    const res = await fetch(`${apiUrl}/config/contact`, { next: { revalidate: 60 } })
    if (!res.ok) return null
    const json = await res.json()
    return json?.data ?? null
  } catch {
    return null
  }
}

export async function Footer() {
  const currentYear = new Date().getFullYear()
  const contact = await getContactConfig() ?? {
    phone: FITEL_PHONE_NUMBER,
    phoneDisplay: FITEL_PHONE_DISPLAY,
    email: FITEL_EMAIL,
    whatsapp: FITEL_PHONE_NUMBER,
  }

  return (
    <footer className="bg-neutral-dark text-neutral-white">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/assets/logo-fitel.png"
                  alt="FITEL Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold">FITEL</span>
            </div>
            <p className="text-neutral-gray-light text-sm">
              Uniendo Familias con servicios de Internet y Televisión de alta calidad en Bogotá.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/share/17yswmM6JY/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-gray-light hover:text-primary-red transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/fibraytelecomunicaciones?igsh=M2JxdG52bGJuMnA5"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-gray-light hover:text-primary-red transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@fibratelecomunicaciones?_r=1&_t=ZS-94aWqhyJjpw"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-gray-light hover:text-primary-red transition-colors"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.83a8.25 8.25 0 0 0 4.83 1.54V6.9a4.85 4.85 0 0 1-1.06-.21z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-neutral-gray-light hover:text-primary-red transition-colors text-sm">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/planes" className="text-neutral-gray-light hover:text-primary-red transition-colors text-sm">
                  Planes
                </Link>
              </li>
              <li>
                <Link href="/cobertura" className="text-neutral-gray-light hover:text-primary-red transition-colors text-sm">
                  Cobertura
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-neutral-gray-light hover:text-primary-red transition-colors text-sm">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Información</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/informacion-usuarios" className="text-neutral-gray-light hover:text-primary-red transition-colors text-sm">
                  Información para Usuarios
                </Link>
              </li>
              <li>
                <Link href="/pqrs" className="text-neutral-gray-light hover:text-primary-red transition-colors text-sm">
                  PQR
                </Link>
              </li>
              <li>
                <Link href="/terminos-condiciones" className="text-neutral-gray-light hover:text-primary-red transition-colors text-sm">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/politica-privacidad" className="text-neutral-gray-light hover:text-primary-red transition-colors text-sm">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-primary-red flex-shrink-0 mt-0.5" />
                <a href={`tel:+${contact.phone}`} className="text-neutral-gray-light hover:text-primary-red transition-colors text-sm">
                  {contact.phoneDisplay}
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-primary-red flex-shrink-0 mt-0.5" />
                <a href={`mailto:${contact.email}`} className="text-neutral-gray-light hover:text-primary-red transition-colors text-sm">
                  {contact.email}
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-red flex-shrink-0 mt-0.5" />
                <span className="text-neutral-gray-light text-sm">
                  Bogotá, Colombia
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-gray text-center">
          <p className="text-neutral-gray-light text-sm">
            © {currentYear} FITEL. Todos los derechos reservados. | Uniendo Familias
          </p>
        </div>
      </div>
    </footer>
  )
}
