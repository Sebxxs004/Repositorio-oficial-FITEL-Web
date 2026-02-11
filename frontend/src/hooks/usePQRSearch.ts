/**
 * usePQRSearch Hook
 * 
 * Hook personalizado que encapsula la lógica de búsqueda de PQRs.
 * Implementa el principio de Responsabilidad Única (SRP) al separar
 * la lógica de negocio de los componentes UI.
 */

import { useState, useCallback } from 'react'
import { PQRService } from '@/services/pqr/PQRService'
import type { PQRResponse, PQRSearchResponse } from '@/types/pqr.types'

interface UsePQRSearchReturn {
  searchValue: string
  isSearching: boolean
  pqrResults: PQRResponse[]
  error: string | null
  setSearchValue: (value: string) => void
  handleSearch: (query: string) => Promise<void>
  clearResults: () => void
  clearError: () => void
}

export function usePQRSearch(): UsePQRSearchReturn {
  const [searchValue, setSearchValue] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [pqrResults, setPqrResults] = useState<PQRResponse[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setError('Por favor ingresa un número de PQR o documento')
      return
    }

    setIsSearching(true)
    setError(null)
    setPqrResults([])

    try {
      const response: PQRSearchResponse = await PQRService.searchPQR({ query: query.trim() })

      if (response.success && response.data && response.data.length > 0) {
        setPqrResults(response.data)
      } else {
        setError(response.error || response.message || 'No se encontró ninguna PQR con los datos proporcionados')
      }
    } catch (err) {
      console.error('Error en usePQRSearch.handleSearch:', err)
      setError('Error al consultar. Por favor intenta de nuevo.')
    } finally {
      setIsSearching(false)
    }
  }, [])

  const clearResults = useCallback(() => {
    setPqrResults([])
    setError(null)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    searchValue,
    isSearching,
    pqrResults,
    error,
    setSearchValue,
    handleSearch,
    clearResults,
    clearError,
  }
}
