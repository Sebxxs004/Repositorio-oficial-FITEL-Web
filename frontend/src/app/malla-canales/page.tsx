'use client'

import { useState, useMemo } from 'react'
import { Check, CheckSquare, Square } from 'lucide-react'

type Canal = {
  nombre: string
  numero: number
  logo?: string
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
      {canal.logo && !imgError ? (
        <>
          {!imgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary-red/30 border-t-primary-red rounded-full animate-spin"></div>
            </div>
          )}
          <img
            src={canal.logo}
            alt={canal.nombre}
            className={`object-contain w-full h-full ${imgLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}
            onError={() => setImgError(true)}
            onLoad={() => setImgLoaded(true)}
            loading="lazy"
          />
        </>
      ) : (
        <span className="text-[10px] font-semibold text-neutral-dark px-2 text-center">
          {canal.nombre}
        </span>
      )}
    </div>
  )
}

export default function MallaCanalesPage() {
  const [selectedChannels, setSelectedChannels] = useState<Set<string>>(new Set())

  const canales: GrupoCanales[] = [
    {
      categoria: 'Telenovelas',
      canales: [
        { nombre: 'Tlnovelas', numero: 3, logo: '/assets/canales/tlnovelas.png' },
        { nombre: 'Univisión', numero: 4, logo: '/assets/canales/univision.png' },
        { nombre: 'Las Estrellas', numero: 5, logo: '/assets/canales/las-estrellas.png' },
        { nombre: 'CNN', numero: 6, logo: '/assets/canales/cnn.png' },
      ],
    },
    {
      categoria: 'Deportes',
      canales: [
        { nombre: 'Fox Sports', numero: 14, logo: '/assets/canales/fox-sports.png' },
        { nombre: 'Fox Sports 2', numero: 15, logo: '/assets/canales/fox-sports-2.png' },
        { nombre: 'Fox Sports 3', numero: 16, logo: '/assets/canales/fox-sports-3.png' },
        { nombre: 'ESPN', numero: 17, logo: '/assets/canales/espn.png' },
        { nombre: 'ESPN 2', numero: 18, logo: '/assets/canales/espn2.png' },
        { nombre: 'ESPN 3', numero: 19, logo: '/assets/canales/espn3.png' },
        { nombre: 'America Sports', numero: 20, logo: '/assets/canales/america-sports.png' },
      ],
    },
    {
      categoria: 'Nacionales',
      canales: [
        { nombre: 'Canal Capital', numero: 2, logo: '/assets/canales/capital.png' },
        { nombre: 'Canal Uno', numero: 7, logo: '/assets/canales/canal-1.png' },
        { nombre: 'Canal Institucional', numero: 8, logo: '/assets/canales/canal-institucional.png' },
        { nombre: 'Canal RCN', numero: 9, logo: '/assets/canales/rcn.png' },
        { nombre: 'Canal Caracol', numero: 10, logo: '/assets/canales/caracol.png' },
        { nombre: 'Señal Colombia', numero: 11, logo: '/assets/canales/senal-colombia.png' },
        { nombre: 'Citytv', numero: 12, logo: '/assets/canales/citytv.png' },
        { nombre: 'Canal 13', numero: 13, logo: '/assets/canales/canal-13.png' },
        { nombre: 'SURAM', numero: 64, logo: '/assets/canales/suram.png' },
        { nombre: 'Cable Noticias', numero: 77, logo: '/assets/canales/cablenoticias.png' },
        { nombre: 'NTN24', numero: 79, logo: '/assets/canales/ntn24.png' },
        { nombre: 'Canal TRO', numero: 80, logo: '/assets/canales/canal-tro.png' },
        { nombre: 'Telepacífico', numero: 81, logo: '/assets/canales/telepacifico.png' },
        { nombre: 'Telecafé', numero: 82, logo: '/assets/canales/telecafe.png' },
        { nombre: 'Telecaribe', numero: 83, logo: '/assets/canales/telecaribe.png' },
        { nombre: 'Telemedellín', numero: 84, logo: '/assets/canales/telemedellin.png' },
        { nombre: 'Teleantioquia', numero: 85, logo: '/assets/canales/teleantioquia.png' },
        { nombre: 'Teleislas', numero: 86, logo: '/assets/canales/teleislas.png' },
        { nombre: 'Caracol HD', numero: 89, logo: '/assets/canales/caracol-hd.png' },
        { nombre: 'RCN HD', numero: 90, logo: '/assets/canales/rcn-hd.png' },
        { nombre: 'Red+', numero: 91, logo: '/assets/canales/red-plus.png' },
        { nombre: 'Teleamazonas', numero: 92, logo: '/assets/canales/teleamazonas.png' },
        { nombre: 'TVAgro', numero: 94, logo: '/assets/canales/tvagro.png' },
      ],
    },
    {
      categoria: 'Infantiles',
      canales: [
        { nombre: 'Cartoon Network', numero: 49, logo: '/assets/canales/cartoon-network.png' },
        { nombre: 'Nat Geo Kids', numero: 50, logo: '/assets/canales/nat-geo-kids.png' },
        { nombre: 'Baby TV', numero: 51, logo: '/assets/canales/baby-tv.png' },
        { nombre: 'Discovery Kids', numero: 52, logo: '/assets/canales/discovery-kids.png' },
        { nombre: 'Boomerang', numero: 53, logo: '/assets/canales/boomerang.png' },
        { nombre: 'Disney XD', numero: 54, logo: '/assets/canales/disney-xd.png' },
        { nombre: 'Disney Channel', numero: 55, logo: '/assets/canales/disney-channel.png' },
        { nombre: 'Disney Junior', numero: 56, logo: '/assets/canales/disney-junior.png' },
        { nombre: 'Tooncast', numero: 57, logo: '/assets/canales/tooncast.png' },
        { nombre: 'Canal Infantil', numero: 58, logo: '/assets/canales/canal_infantil.png' },
        { nombre: 'ZooMoo', numero: 93, logo: '/assets/canales/zoomoo.png' },
      ],
    },
    {
      categoria: 'Series y Películas',
      canales: [
        { nombre: 'TNT', numero: 29, logo: '/assets/canales/tnt.png' },
        { nombre: 'TNT Series', numero: 30, logo: '/assets/canales/tnt-series.png' },
        { nombre: 'SPACE', numero: 31, logo: '/assets/canales/space.png' },
        { nombre: 'CINECANAL', numero: 32, logo: '/assets/canales/cine-canal.png' },
        { nombre: 'FXM', numero: 33, logo: '/assets/canales/fxm.png' },
        { nombre: 'FX', numero: 34, logo: '/assets/canales/fx.png' },
        { nombre: 'Cine Latino', numero: 35, logo: '/assets/canales/cine-latino.png' },
        { nombre: 'FOX life', numero: 36, logo: '/assets/canales/fox-life.png' },
        { nombre: 'FOX CHANNEL', numero: 37, logo: '/assets/canales/fox-channel.png' },
        { nombre: 'De Película', numero: 38, logo: '/assets/canales/de-pelicula.png' },
        { nombre: 'Cinema +', numero: 39, logo: '/assets/canales/cinema-plus.png' },
        { nombre: 'GOLDEN', numero: 40, logo: '/assets/canales/golden.png' },
        { nombre: 'GOLDEN EDGE', numero: 41, logo: '/assets/canales/golden-edge.png' },
        { nombre: 'CINE PREMIUM', numero: 42, logo: '/assets/canales/cine-premium.png' },
        { nombre: 'TCM', numero: 43, logo: '/assets/canales/tcm.png' },
        { nombre: 'MP MULTIPREMIER', numero: 44, logo: '/assets/canales/mp-multipremier.png' },
        { nombre: 'DHE', numero: 45, logo: '/assets/canales/dhe.png' },
        { nombre: 'AMC', numero: 46, logo: '/assets/canales/amc.png' },
        { nombre: 'CINE FAMILIAR', numero: 47, logo: '/assets/canales/cine-familiar.png' },
        { nombre: 'CINE HISPANO', numero: 48, logo: '/assets/canales/cine-hispano.png' },
        { nombre: 'Ve PLUS TV', numero: 59, logo: '/assets/canales/ve-plus-tv.png' },
      ],
    },
    {
      categoria: 'Investigación / Documentales',
      canales: [
        { nombre: 'Animal Planet', numero: 21, logo: '/assets/canales/animal-planet.png' },
        { nombre: 'Discovery H&H', numero: 22, logo: '/assets/canales/discovery-hh.png' },
        { nombre: 'Discovery Turbo', numero: 23, logo: '/assets/canales/discovery-turbo.png' },
        { nombre: 'TLC', numero: 24, logo: '/assets/canales/tlc.png' },
        { nombre: 'ID', numero: 25, logo: '/assets/canales/id.png' },
        { nombre: 'Nat Geo Wild', numero: 26, logo: '/assets/canales/nat-geo-wild.png' },
        { nombre: 'National Geographic', numero: 27, logo: '/assets/canales/nat-geo.png' },
        { nombre: 'Discovery Channel', numero: 28, logo: '/assets/canales/discovery-channel.png' },
      ],
    },
    {
      categoria: 'Música',
      canales: [
        { nombre: 'Rumba TV', numero: 62, logo: '/assets/canales/rumba.png' },
        { nombre: 'HTV', numero: 65, logo: '/assets/canales/htv.png' },
        { nombre: 'La Kalle', numero: 66, logo: '/assets/canales/la-kalle.png' },
        { nombre: 'Mi Gente TV', numero: 68, logo: '/assets/canales/mi-gente-tv.png' },
        { nombre: 'MIMUSICA REGGAETON', numero: 69, logo: '/assets/canales/mimusica-reggaeton.png' },
        { nombre: 'MIMUSICA HITS', numero: 70, logo: '/assets/canales/mimusica-hits.png' },
        { nombre: 'MIMUSICA POPULAR', numero: 71, logo: '/assets/canales/mimusica-popular.png' },
        { nombre: 'MIMUSICA SALSA', numero: 72, logo: '/assets/canales/mimusica-salsa.png' },
      ],
    },
    {
      categoria: 'Religiosos',
      canales: [
        { nombre: 'Hogar TV', numero: 61, logo: '/assets/canales/hogar-tv.png' },
        { nombre: 'ABN', numero: 73, logo: '/assets/canales/abn.png' },
        { nombre: 'Tele Amiga', numero: 74, logo: '/assets/canales/teleamiga.png' },
        { nombre: 'Cristovisión', numero: 75, logo: '/assets/canales/cristovision.png' },
        { nombre: 'Enlace', numero: 76, logo: '/assets/canales/enlace.png' },
      ],
    },
  ]

  // Calcular el total de canales
  const totalChannels = useMemo(() => {
    return canales.reduce((total, grupo) => total + grupo.canales.length, 0)
  }, [canales])

  // Función para obtener el ID único de un canal
  const getChannelId = (grupo: GrupoCanales, canal: Canal) => {
    return `${grupo.categoria}-${canal.numero}-${canal.nombre}`
  }

  // Función para alternar selección de un canal
  const toggleChannel = (grupo: GrupoCanales, canal: Canal) => {
    const channelId = getChannelId(grupo, canal)
    setSelectedChannels((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(channelId)) {
        newSet.delete(channelId)
      } else {
        newSet.add(channelId)
      }
      return newSet
    })
  }

  // Función para seleccionar/deseleccionar todos los canales
  const toggleAllChannels = () => {
    if (selectedChannels.size === totalChannels) {
      // Si todos están seleccionados, deseleccionar todos
      setSelectedChannels(new Set())
    } else {
      // Seleccionar todos
      const allChannelIds = new Set<string>()
      canales.forEach((grupo) => {
        grupo.canales.forEach((canal) => {
          allChannelIds.add(getChannelId(grupo, canal))
        })
      })
      setSelectedChannels(allChannelIds)
    }
  }

  const allSelected = selectedChannels.size === totalChannels

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-gray-light to-neutral-white pt-20">
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
          
          {/* Contador y Selector */}
          <div className="bg-neutral-white rounded-xl shadow-lg border border-neutral-gray-light p-6 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
              <div className="text-center sm:text-left">
                <p className="text-2xl font-bold text-primary-red">
                  {totalChannels} <span className="text-lg font-normal text-neutral-dark">canales disponibles</span>
                </p>
                {selectedChannels.size > 0 && (
                  <p className="text-sm text-neutral-gray mt-1">
                    {selectedChannels.size} canal{selectedChannels.size !== 1 ? 'es' : ''} seleccionado{selectedChannels.size !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
              <button
                onClick={toggleAllChannels}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  allSelected
                    ? 'bg-primary-red text-white hover:bg-primary-red/90'
                    : 'bg-neutral-gray-light text-neutral-dark hover:bg-neutral-gray/80'
                }`}
              >
                {allSelected ? (
                  <>
                    <CheckSquare className="w-5 h-5" />
                    <span>Deseleccionar Todos</span>
                  </>
                ) : (
                  <>
                    <Square className="w-5 h-5" />
                    <span>Seleccionar Todos</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Grid de Canales por Categoría */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {canales.map((grupo, index) => (
            <div
              key={index}
              className="bg-neutral-white rounded-xl shadow-lg border border-neutral-gray-light p-6 hover:shadow-xl transition-shadow"
            >
              <h2 className="text-xl font-bold text-primary-red mb-4 pb-2 border-b border-neutral-gray-light">
                {grupo.categoria}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {grupo.canales.map((canal) => {
                  const channelId = getChannelId(grupo, canal)
                  const isSelected = selectedChannels.has(channelId)
                  return (
                    <div
                      key={channelId}
                      onClick={() => toggleChannel(grupo, canal)}
                      className={`flex flex-col items-center text-center cursor-pointer transition-all rounded-lg p-2 ${
                        isSelected
                          ? 'bg-primary-red/10 border-2 border-primary-red'
                          : 'hover:bg-neutral-gray-light/50 border-2 border-transparent'
                      }`}
                    >
                      <div className="relative w-full">
                        <CanalLogo canal={canal} />
                        {isSelected && (
                          <div className="absolute top-0 right-0 bg-primary-red rounded-full p-1">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-bold text-primary-red leading-none">
                        {canal.numero}
                      </span>
                      <span className="text-[11px] text-neutral-dark mt-1">{canal.nombre}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
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
