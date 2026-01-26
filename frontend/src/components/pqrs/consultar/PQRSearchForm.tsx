/**
 * PQRSearchForm Component
 * 
 * Componente responsable del formulario de búsqueda de PQRs.
 * Implementa el principio de Responsabilidad Única (SRP) y el principio
 * de Inversión de Dependencias (DIP) al recibir callbacks como props.
 */

'use client'

import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'

interface PQRSearchFormProps {
  searchValue: string
  isSearching: boolean
  onSearchValueChange: (value: string) => void
  onSearch: (query: string) => Promise<void>
}

export function PQRSearchForm({
  searchValue,
  isSearching,
  onSearchValueChange,
  onSearch,
}: PQRSearchFormProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await onSearch(searchValue)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchValueChange(e.target.value)
  }

  return (
    <div className="bg-neutral-white rounded-xl shadow-lg p-8 mb-8">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="search" className="block text-sm font-semibold text-neutral-dark mb-2">
            Número de PQR o Documento de Identidad
          </label>
          <div className="flex gap-4">
            <input
              type="text"
              id="search"
              name="search"
              value={searchValue}
              onChange={handleInputChange}
              placeholder="Ej: PQR-12345 o 1234567890"
              className="flex-1 px-4 py-3 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent"
              disabled={mounted && isSearching}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={mounted && isSearching}
              className="btn-primary px-8 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
              aria-label={isSearching ? 'Buscando PQR' : 'Buscar PQR'}
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Buscando...</span>
                </>
              ) : (
                <>
                  {mounted ? (
                    <Search className="w-5 h-5" />
                  ) : (
                    <div className="w-5 h-5 bg-white/50 rounded" style={{ display: 'inline-block' }}></div>
                  )}
                  <span>Buscar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
