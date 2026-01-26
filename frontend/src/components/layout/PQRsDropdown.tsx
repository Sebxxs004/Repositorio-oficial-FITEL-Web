'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Search, FileText } from 'lucide-react'

interface PQRsDropdownProps {
  isMobile?: boolean
}

export function PQRsDropdown({ isMobile = false }: PQRsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Cerrar dropdown cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Cerrar dropdown cuando cambia la ruta (navegación)
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  if (isMobile) {
    return (
      <div className="flex flex-col space-y-2">
        <button
          onClick={handleToggle}
          className="flex items-center justify-between text-neutral-dark hover:text-primary-red transition-colors font-medium"
        >
          <span>PQRS</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="pl-4 space-y-2 border-l-2 border-primary-red/20">
            <Link
              href="/pqrs/consultar"
              className="flex items-center space-x-3 text-neutral-gray hover:text-primary-red transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>Consultar PQRs</span>
            </Link>
            <Link
              href="/pqrs/realizar"
              className="flex items-center space-x-3 text-neutral-gray hover:text-primary-red transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Realizar una PQR</span>
            </Link>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="flex items-center space-x-1 text-neutral-dark hover:text-primary-red transition-colors duration-200 font-medium"
      >
        <span>PQRS</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-neutral-white rounded-lg shadow-lg border border-neutral-gray-light py-2 z-50">
          <Link
            href="/pqrs/consultar"
            className="flex items-center space-x-3 px-4 py-2 text-neutral-dark hover:bg-primary-red/10 hover:text-primary-red transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Consultar PQRs</span>
          </Link>
          <Link
            href="/pqrs/realizar"
            className="flex items-center space-x-3 px-4 py-2 text-neutral-dark hover:bg-primary-red/10 hover:text-primary-red transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Realizar una PQR</span>
          </Link>
        </div>
      )}
    </div>
  )
}
