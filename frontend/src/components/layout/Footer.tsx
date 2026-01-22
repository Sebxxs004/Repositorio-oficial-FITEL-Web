import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

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
                href="https://facebook.com/fitel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-gray-light hover:text-primary-red transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/fitel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-gray-light hover:text-primary-red transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/company/fitel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-gray-light hover:text-primary-red transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
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
                <Link href="/solicitar-instalacion" className="text-neutral-gray-light hover:text-primary-red transition-colors text-sm">
                  Solicitar Instalación
                </Link>
              </li>
              <li>
                <Link href="/soporte" className="text-neutral-gray-light hover:text-primary-red transition-colors text-sm">
                  Soporte Técnico
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
                <Link href="/pqr" className="text-neutral-gray-light hover:text-primary-red transition-colors text-sm">
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
                <a href="tel:+573001234567" className="text-neutral-gray-light hover:text-primary-red transition-colors text-sm">
                  +57 300 123 4567
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-primary-red flex-shrink-0 mt-0.5" />
                <a href="mailto:contacto@fitel.com.co" className="text-neutral-gray-light hover:text-primary-red transition-colors text-sm">
                  contacto@fitel.com.co
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
