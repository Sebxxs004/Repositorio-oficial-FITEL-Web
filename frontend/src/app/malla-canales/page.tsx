'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, RefreshCcw } from 'lucide-react'

type Canal = {
  id: number
  name: string
  number: number
  category: string
  logoUrl?: string
  description?: string
  active: boolean
}

type GrupoCanales = {
  categoria: string
  canales: Canal[]
}

function CanalLogo({ canal }: { canal: Canal }) {
  const [imgError, setImgError] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <div className="w-16 h-16 rounded-full bg-neutral-gray-light flex items-center justify-center overflow-hidden mb-2 border border-neutral-gray-light relative">
      {canal.logoUrl && !imgError ? (
        <>
          {!imgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary-red/30 border-t-primary-red rounded-full animate-spin"></div>
            </div>
          )}
          <img
            src={canal.logoUrl}
            alt={canal.name}
            className={`object-contain w-full h-full ${imgLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}
            onError={() => setImgError(true)}
            onLoad={() => setImgLoaded(true)}
            loading="lazy"
          />
        </>
      ) : (
        <span className="text-[10px] font-semibold text-neutral-dark px-2 text-center">
          {canal.name}
        </span>
      )}
    </div>
  )
}

export default function MallaCanalesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [canales, setCanales] = useState<GrupoCanales[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchChannels()
  }, [])

  const fetchChannels = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/channels`)
      
      if (!response.ok) {
        throw new Error('Error al cargar canales')
      }

      const data = await response.json()
      const channelList: Canal[] = data.data || []
      
      // Agrupar canales por categoría
      const grouped = channelList.reduce((acc: Record<string, Canal[]>, channel) => {
        const category = formatCategoryName(channel.category)
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(channel)
        return acc
      }, {})

      // Convertir a array de grupos y ordenar
      const groupedArray: GrupoCanales[] = Object.entries(grouped).map(([categoria, canales]) => ({
        categoria,
        canales: canales.sort((a, b) => a.number - b.number)
      }))

      // Ordenar categorías (opcional, puedes definir un orden específico)
      // Por ahora ordenamos alfabéticamente
      groupedArray.sort((a, b) => {
        // Poner NACIONALES primero si existe
        if (a.categoria === 'Nacionales') return -1
        if (b.categoria === 'Nacionales') return 1
        return a.categoria.localeCompare(b.categoria)
      })

      setCanales(groupedArray)
    } catch (err) {
      console.error('Error fetching channels:', err)
      setError('No se pudieron cargar los canales. Por favor, intente más tarde.')
    } finally {
      setLoading(false)
    }
  }

  const formatCategoryName = (category: string) => {
    // Convertir de DB (ej: 'TELENOVELAS') a formato amigable (ej: 'Telenovelas')
    if (!category) return 'Otros';
    
    // Mapeo específico si es necesario, o title case genérico
    const mapping: Record<string, string> = {
      'TELENOVELAS': 'Telenovelas',
      'DEPORTES': 'Deportes',
      'NACIONALES': 'Nacionales',
      'PELICULAS': 'Películas',
      'PELÍCULAS': 'Películas',
      'ENTRETENIMIENTO': 'Entretenimiento',
      'SERIES': 'Series',
      'INFANTIL': 'Infantil',
      'DOCUMENTALES': 'Documentales',
      'CULTURA': 'Cultura',
      'RELIGIOSOS': 'Religiosos',
      'MUSICA': 'Música',
      'MÚSICA': 'Música',
      'INTERNACIONAL': 'Internacional'
    };

    return mapping[category.toUpperCase()] || 
           category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  }

  // Calcular el total de canales
  const totalChannels = useMemo(() => {
    return canales.reduce((total, grupo) => total + grupo.canales.length, 0)
  }, [canales])

  // Filtrar canales basado en la búsqueda
  const filteredCanales = useMemo(() => {
    if (!searchTerm) return canales

    return canales.map(grupo => ({
      ...grupo,
      canales: grupo.canales.filter(canal => 
        canal.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        canal.number.toString().includes(searchTerm)
      )
    })).filter(grupo => grupo.canales.length > 0)
  }, [canales, searchTerm])

  // Función para obtener el ID único de un canal
  const getChannelId = (grupo: GrupoCanales, canal: Canal) => {
    return `${grupo.categoria}-${canal.number}-${canal.name}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-gray-light flex items-center justify-center pt-[116px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-red mx-auto mb-4"></div>
          <p className="text-neutral-gray">Cargando canales...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-gray-light flex items-center justify-center pt-[116px]">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md mx-auto">
          <div className="text-red-500 mb-4 flex justify-center">
             <RefreshCcw className="w-12 h-12" />
          </div>
          <h2 className="text-xl font-bold text-neutral-dark mb-2">Error</h2>
          <p className="text-neutral-gray mb-6">{error}</p>
          <button 
            onClick={fetchChannels}
            className="px-6 py-2 bg-primary-red text-white rounded-lg hover:bg-primary-red/90 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-gray-light to-neutral-white pt-[116px]">
      <div className="container-custom py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-dark mb-4">
            Malla de Canales
          </h1>
          <p className="text-lg text-neutral-gray max-w-2xl mx-auto mb-6">
            Disfruta de una amplia variedad de canales en alta definición.
            Consulta todos los canales disponibles.
          </p>

          <div className="flex justify-center mb-8 px-4">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Buscar canal por nombre o número..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-full border border-neutral-gray-light shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-red/50 focus:border-primary-red transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-gray w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Grid de Canales por Categoría */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredCanales.length === 0 ? (
             <div className="col-span-full text-center py-12 text-neutral-gray">
               {searchTerm ? 'No se encontraron canales que coincidan con tu búsqueda.' : 'No hay canales disponibles en este momento.'}
             </div>
          ) : (
            filteredCanales.map((grupo, index) => (
              <div
                key={index}
                className="bg-neutral-white rounded-xl shadow-lg border border-neutral-gray-light p-4 sm:p-6 hover:shadow-xl transition-shadow"
              >
                <h2 className="text-xl font-bold text-primary-red mb-4 pb-2 border-b border-neutral-gray-light">
                  {grupo.categoria}
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
                  {grupo.canales.map((canal) => {
                    const channelId = getChannelId(grupo, canal)
                    return (
                      <div
                        key={channelId}
                        className="flex flex-col items-center text-center rounded-lg p-2 hover:bg-neutral-gray-light/50 transition-colors border border-transparent"
                      >
                        <div className="relative w-full flex justify-center">
                          <CanalLogo canal={canal} />
                        </div>
                        <span className="text-sm font-bold text-primary-red leading-none">
                          {canal.number}
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-neutral-dark mt-1 line-clamp-2">{canal.name}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Nota Informativa */}
        <div className="bg-primary-red/10 border-l-4 border-primary-red p-6 rounded-lg mb-8">
          <h3 className="font-bold text-neutral-dark mb-2">Información Importante</h3>
          <p className="text-neutral-gray text-sm">
            Algunos canales pueden estar sujetos a cambios sin previo aviso. 
            Para más información, contacta a nuestro servicio al cliente.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href="/contacto"
            className="inline-flex items-center space-x-2 btn-primary"
          >
            <span>Contáctanos para más información</span>
          </a>
        </div>
      </div>
    </div>
  )
}
