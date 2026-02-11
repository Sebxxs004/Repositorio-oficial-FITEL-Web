/**
 * PQRsConsultarModule Component
 * 
 * Componente principal que orquesta el módulo de consulta de PQRs.
 * Implementa el principio de Responsabilidad Única (SRP) al actuar como
 * orquestador y delegar responsabilidades a componentes más específicos.
 * 
 * Arquitectura modular:
 * - usePQRSearch: Hook que maneja la lógica de búsqueda
 * - PQRSearchHeader: Header de la página
 * - PQRSearchForm: Formulario de búsqueda
 * - PQRSearchResults: Resultados de la búsqueda
 * - PQRSearchError: Mensajes de error
 * - PQRSearchInfo: Información adicional
 */

'use client'

import { usePQRSearch } from '@/hooks/usePQRSearch'
import { PQRSearchHeader } from './consultar/PQRSearchHeader'
import { PQRSearchForm } from './consultar/PQRSearchForm'
import { PQRSearchResults } from './consultar/PQRSearchResults'
import { PQRSearchError } from './consultar/PQRSearchError'
import { PQRSearchInfo } from './consultar/PQRSearchInfo'

export function PQRsConsultarModule() {
  const {
    searchValue,
    isSearching,
    pqrResults,
    error,
    setSearchValue,
    handleSearch,
    clearError,
  } = usePQRSearch()

  return (
    <section className="container-custom py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <PQRSearchHeader />
        
        {/* Formulario de búsqueda */}
        <PQRSearchForm
          searchValue={searchValue}
          isSearching={isSearching}
          onSearchValueChange={setSearchValue}
          onSearch={handleSearch}
        />
        
        {/* Mensaje de error */}
        {error && (
          <div className="mb-8">
            <PQRSearchError error={error} onDismiss={clearError} />
          </div>
        )}

        {/* Resultados de la búsqueda */}
        {pqrResults && pqrResults.length > 0 && (
          <div className="mb-8">
            <PQRSearchResults pqrs={pqrResults} />
          </div>
        )}

        {/* Información adicional */}
        <PQRSearchInfo />
      </div>
    </section>
  )
}
