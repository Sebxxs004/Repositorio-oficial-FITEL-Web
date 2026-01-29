'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { MapPin, CheckCircle, XCircle, Info, MessageCircle, Navigation, X } from 'lucide-react'
import { CoverageResultModal } from './CoverageResultModal'
import { FITEL_WHATSAPP_URL } from '@/config/constants'

// Importar dinámicamente el mapa para evitar problemas de SSR
const MapComponent = dynamic(
  () => import('./MapComponent').then((mod) => ({ default: mod.default })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] bg-neutral-gray-light rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-red mx-auto mb-4"></div>
          <p className="text-neutral-gray">Cargando mapa...</p>
        </div>
      </div>
    ),
  }
)

interface CoverageZone {
  id: number
  name: string
  code: string
  locality: string
  available: boolean
  description?: string
}

export function CoverageMap() {
  const [searchAddress, setSearchAddress] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [checkResult, setCheckResult] = useState<{
    available: boolean
    message: string
    showContactOptions?: boolean
  } | null>(null)
  const [geocodedLocation, setGeocodedLocation] = useState<{
    lat: number
    lng: number
    address: string
  } | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalResult, setModalResult] = useState<{
    available: boolean
    message: string
    distance?: number
  } | null>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  const coverageZones: CoverageZone[] = [
    {
      id: 1,
      name: 'San Cristóbal',
      code: 'SANC',
      locality: 'San Cristóbal',
      available: true,
      description: 'Zona de cobertura principal: Localidad San Cristóbal, sector San Blas y alrededores',
    },
  ]

  // Sectores disponibles en San Cristóbal
  const sanCristobalSectors = [
    'san blas',
    '20 de julio',
    'la gloria',
    'sosiego',
    'san josé',
    'san jose',
    'diana turbay',
    'buenos aires',
    'la roca',
    'ciudad jardín',
    'ciudad jardin',
    'villa javier',
    'aguas claras',
    'laureles',
    'el triángulo',
    'el triangulo',
  ]

  // Localidades disponibles
  const availableLocalities = [
    'san cristóbal',
    'san cristobal',
  ]

  // Geocodificar dirección usando Nominatim (OpenStreetMap)
  const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number; displayName: string } | null> => {
    try {
      // Agregar "Bogotá, Colombia" si no está presente
      const fullAddress = address.toLowerCase().includes('bogotá') || address.toLowerCase().includes('bogota')
        ? address
        : `${address}, Bogotá, Colombia`

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1&countrycodes=co`,
        {
          headers: {
            'User-Agent': 'FITEL-Web-App',
          },
        }
      )

      if (!response.ok) {
        throw new Error('Error en la geocodificación')
      }

      const data = await response.json()
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          displayName: data[0].display_name,
        }
      }
      return null
    } catch (error) {
      console.error('Error geocodificando dirección:', error)
      return null
    }
  }

  // Geocodificación inversa: convertir coordenadas a dirección
  const reverseGeocode = async (lat: number, lng: number): Promise<string | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'FITEL-Web-App',
          },
        }
      )

      if (!response.ok) {
        throw new Error('Error en la geocodificación inversa')
      }

      const data = await response.json()
      if (data && data.address) {
        // Construir dirección legible
        const addr = data.address
        const parts: string[] = []
        
        if (addr.road) parts.push(addr.road)
        if (addr.house_number) parts.push(`#${addr.house_number}`)
        if (addr.suburb || addr.neighbourhood) parts.push(addr.suburb || addr.neighbourhood)
        if (addr.city || addr.town) parts.push(addr.city || addr.town)
        
        return parts.length > 0 ? parts.join(', ') : data.display_name
      }
      return data.display_name || null
    } catch (error) {
      console.error('Error en geocodificación inversa:', error)
      return null
    }
  }

  // Obtener ubicación actual del usuario
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Tu navegador no soporta geolocalización')
      return
    }

    setIsGettingLocation(true)
    setLocationError(null)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          
          // Geocodificar inversamente las coordenadas
          const address = await reverseGeocode(latitude, longitude)
          
          if (address) {
            // Agregar la dirección al input
            setSearchAddress(address)
            
            // Establecer la ubicación geocodificada para mostrar el punto exacto en el mapa
            setGeocodedLocation({
              lat: latitude,
              lng: longitude,
              address: address,
            })
            
            // Validar automáticamente después de un breve delay
            setTimeout(() => {
              handleCheckCoverage()
            }, 500)
          } else {
            // Aún así, mostrar el punto en el mapa con las coordenadas
            setGeocodedLocation({
              lat: latitude,
              lng: longitude,
              address: `Ubicación: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            })
            setLocationError('No se pudo obtener la dirección, pero se marcó tu ubicación en el mapa')
            setIsGettingLocation(false)
          }
        } catch (error) {
          console.error('Error obteniendo dirección:', error)
          setLocationError('Error al obtener tu dirección')
          setIsGettingLocation(false)
        }
      },
      (error) => {
        console.error('Error de geolocalización:', error)
        let errorMessage = 'Error al obtener tu ubicación'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permiso de ubicación denegado. Por favor permite el acceso a tu ubicación.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Ubicación no disponible'
            break
          case error.TIMEOUT:
            errorMessage = 'Tiempo de espera agotado'
            break
        }
        
        setLocationError(errorMessage)
        setIsGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }

  // Calcular distancia entre dos puntos en metros (fórmula de Haversine)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371000 // Radio de la Tierra en metros
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const handleCheckCoverage = async () => {
    if (!searchAddress.trim()) {
      setCheckResult({
        available: false,
        message: 'Por favor ingresa una dirección',
        showContactOptions: false,
      })
      setGeocodedLocation(null)
      return
    }

    setIsChecking(true)
    setCheckResult(null)
    setGeocodedLocation(null)

    try {
      // Geocodificar la dirección
      const location = await geocodeAddress(searchAddress)

      if (!location) {
        setCheckResult({
          available: false,
          message: 'No pudimos encontrar la ubicación de esa dirección. Por favor verifica que la dirección sea correcta.',
          showContactOptions: true,
        })
        setIsChecking(false)
        return
      }

      // Coordenadas del centro de cobertura (Parque Gaitán Cortés)
      const COVERAGE_CENTER_LAT = 4.5578
      const COVERAGE_CENTER_LNG = -74.0887
      const COVERAGE_RADIUS_METERS = 3000 // 3 km

      // Calcular distancia desde el punto geocodificado al centro de cobertura
      const distance = calculateDistance(
        COVERAGE_CENTER_LAT,
        COVERAGE_CENTER_LNG,
        location.lat,
        location.lng
      )

      // Guardar ubicación geocodificada para mostrarla en el mapa
      setGeocodedLocation({
        lat: location.lat,
        lng: location.lng,
        address: location.displayName,
      })

      // Validar si está dentro del radio de cobertura
      const distanceKm = distance / 1000
      
      if (distance <= COVERAGE_RADIUS_METERS) {
        // Está en cobertura - mostrar modal
        setModalResult({
          available: true,
          message: `¡Excelente! Tu dirección está en nuestra zona de cobertura (a ${distanceKm.toFixed(1)} km del centro). Podemos llegar a tu zona.`,
          distance: distanceKm,
        })
        setCheckResult({
          available: true,
          message: `¡Excelente! Tu dirección está en nuestra zona de cobertura (a ${distanceKm.toFixed(1)} km del centro). Podemos llegar a tu zona.`,
          showContactOptions: false,
        })
        setShowModal(true)
      } else {
        // No está en cobertura - mostrar modal
        setModalResult({
          available: false,
          message: `Tu dirección está a ${distanceKm.toFixed(1)} km de nuestra zona de cobertura actual. Estamos trabajando para expandir nuestros servicios.`,
          distance: distanceKm,
        })
        setCheckResult({
          available: false,
          message: `Tu dirección está a ${distanceKm.toFixed(1)} km de nuestra zona de cobertura actual. Estamos trabajando para expandir nuestros servicios.`,
          showContactOptions: true,
        })
        setShowModal(true)
      }
    } catch (error) {
      console.error('Error verificando cobertura:', error)
      setCheckResult({
        available: false,
        message: 'Ocurrió un error al verificar la cobertura. Por favor intenta de nuevo o contáctanos.',
        showContactOptions: true,
      })
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className="container-custom section-padding">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          <span className="text-gradient">Zonas de Cobertura</span>
        </h1>
        <p className="text-lg md:text-xl text-neutral-gray max-w-3xl mx-auto mb-8">
          Consulta si tu zona tiene disponibilidad de nuestros servicios de Internet y TV de alta velocidad.
        </p>
      </div>


      {/* Buscador de cobertura */}
      <div className="mb-8">
        <div className="bg-neutral-white rounded-xl shadow-lg p-6 border border-neutral-gray-light">
          <h2 className="text-2xl font-bold text-neutral-dark mb-4 flex items-center space-x-2">
            <MapPin className="w-6 h-6 text-primary-red" />
            <span>Verifica tu Dirección</span>
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCheckCoverage()}
                  placeholder="Ej: Calle 45 Sur # 12-34, San Blas"
                  className="w-full px-4 py-3 pr-12 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent"
                />
                <button
                  onClick={handleGetCurrentLocation}
                  disabled={isGettingLocation || isChecking}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-secondary-blue hover:text-secondary-blue-dark hover:bg-secondary-blue/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Usar mi ubicación actual"
                  aria-label="Usar mi ubicación actual"
                >
                  <Navigation className={`w-5 h-5 ${isGettingLocation ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <button
                onClick={handleCheckCoverage}
                disabled={isChecking || isGettingLocation}
                className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isChecking ? 'Verificando...' : 'Verificar Cobertura'}
              </button>
            </div>
            
            {/* Mensaje de error de geolocalización */}
            {locationError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{locationError}</p>
                <button
                  onClick={() => setLocationError(null)}
                  className="ml-auto text-red-600 hover:text-red-800"
                  aria-label="Cerrar mensaje"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            
            {/* Ayuda para geolocalización */}
            <p className="text-xs text-neutral-gray flex items-center space-x-2">
              <Navigation className="w-4 h-4 text-secondary-blue" />
              <span>Haz clic en el ícono de navegación para usar tu ubicación actual automáticamente</span>
            </p>
          </div>

          {/* Resultado de verificación */}
          {checkResult && (
            <div
              className={`mt-4 p-4 rounded-lg flex items-start space-x-3 ${
                checkResult.available
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-yellow-50 border border-yellow-200'
              }`}
            >
              {checkResult.available ? (
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <Info className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p
                  className={`font-semibold mb-2 ${
                    checkResult.available ? 'text-green-800' : 'text-yellow-800'
                  }`}
                >
                  {checkResult.message}
                </p>
                
                {checkResult.available ? null : checkResult.showContactOptions ? (
                  <div className="mt-4 space-y-3">
                    <p className="text-sm text-yellow-800 font-medium mb-3">
                      ¿Quieres verificar la disponibilidad en tu zona? Contáctanos y te ayudamos:
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a
                        href={`${FITEL_WHATSAPP_URL}?text=${encodeURIComponent('Hola, quiero saber si tienen cobertura en mi zona')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span>Consultar por WhatsApp</span>
                      </a>
                      <a
                        href="/contacto"
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-secondary-blue hover:bg-secondary-blue-dark text-white rounded-lg font-medium transition-colors"
                      >
                        <Info className="w-5 h-5" />
                        <span>Contactar Asesor</span>
                      </a>
                    </div>
                    <p className="text-xs text-yellow-700 mt-2">
                      Estamos expandiendo nuestra cobertura constantemente. Tu solicitud nos ayuda a priorizar nuevas zonas.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mapa */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-neutral-dark mb-4 text-center">
          Mapa de Cobertura
        </h2>
        <div className="bg-neutral-white rounded-xl shadow-lg overflow-hidden border border-neutral-gray-light">
          <MapComponent geocodedLocation={geocodedLocation} />
        </div>
      </div>


      {/* Tabla de Sectores - Localidad San Cristóbal */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-neutral-dark mb-6 text-center">
          <span className="text-gradient">Sectores de Cobertura</span>
        </h2>
        <div className="bg-neutral-white rounded-xl shadow-lg overflow-hidden border border-neutral-gray-light">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-primary-red/10 to-secondary-blue/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-neutral-dark">Sector</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-neutral-dark">Estado</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-neutral-dark">Localidad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-gray-light">
                <tr className="hover:bg-neutral-gray-light/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-dark">San Blas</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      Disponible
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-gray">San Cristóbal</td>
                </tr>
                <tr className="hover:bg-neutral-gray-light/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-dark">20 de Julio</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      Disponible
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-gray">San Cristóbal</td>
                </tr>
                <tr className="hover:bg-neutral-gray-light/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-dark">La Gloria</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      Disponible
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-gray">San Cristóbal</td>
                </tr>
                <tr className="hover:bg-neutral-gray-light/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-dark">Sosiego</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      Disponible
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-gray">San Cristóbal</td>
                </tr>
                <tr className="hover:bg-neutral-gray-light/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-dark">San José</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      Disponible
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-gray">San Cristóbal</td>
                </tr>
                <tr className="hover:bg-neutral-gray-light/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-dark">Diana Turbay</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      Disponible
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-gray">San Cristóbal</td>
                </tr>
                <tr className="hover:bg-neutral-gray-light/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-dark">Buenos Aires</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      Disponible
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-gray">San Cristóbal</td>
                </tr>
                <tr className="hover:bg-neutral-gray-light/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-dark">La Roca</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      Disponible
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-gray">San Cristóbal</td>
                </tr>
                <tr className="hover:bg-neutral-gray-light/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-dark">Ciudad Jardín</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      Disponible
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-gray">San Cristóbal</td>
                </tr>
                <tr className="hover:bg-neutral-gray-light/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-dark">Villa Javier</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      Disponible
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-gray">San Cristóbal</td>
                </tr>
                <tr className="hover:bg-neutral-gray-light/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-dark">Aguas Claras</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      Disponible
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-gray">San Cristóbal</td>
                </tr>
                <tr className="hover:bg-neutral-gray-light/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-dark">Laureles</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      Disponible
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-gray">San Cristóbal</td>
                </tr>
                <tr className="hover:bg-neutral-gray-light/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-dark">El Triángulo</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      Disponible
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-gray">San Cristóbal</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-neutral-white p-6 rounded-xl shadow-lg border border-neutral-gray-light">
          <h3 className="text-xl font-bold text-neutral-dark mb-3 flex items-center space-x-2">
            <CheckCircle className="w-6 h-6 text-primary-red" />
            <span>Zonas Disponibles</span>
          </h3>
          <p className="text-neutral-gray mb-3">
            Actualmente tenemos cobertura disponible en la Localidad de San Cristóbal con 13 sectores activos.
          </p>
          <ul className="space-y-2 text-neutral-gray text-sm">
            <li>• 13 sectores activos en San Cristóbal</li>
            <li>• Expansión continua en la zona</li>
            <li>• Cobertura de alta velocidad garantizada</li>
          </ul>
        </div>

        <div className="bg-neutral-white p-6 rounded-xl shadow-lg border border-neutral-gray-light">
          <h3 className="text-xl font-bold text-neutral-dark mb-3 flex items-center space-x-2">
            <Info className="w-6 h-6 text-secondary-blue" />
            <span>Próximamente</span>
          </h3>
          <p className="text-neutral-gray">
            Estamos trabajando para expandir nuestra cobertura a más localidades de Bogotá.
            Si tu zona no está disponible, puedes registrarte para recibir notificaciones
            cuando lleguemos a tu área.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <div className="inline-block p-8 rounded-xl bg-gradient-to-r from-primary-red/10 to-secondary-blue/10 border border-primary-red/20">
          <h3 className="text-2xl font-bold text-neutral-dark mb-4">
            ¿No estás seguro si tienes cobertura?
          </h3>
          <p className="text-neutral-gray mb-6 max-w-2xl mx-auto">
            Contáctanos y te ayudamos a verificar si tu dirección está en nuestra zona de cobertura.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/contacto" className="btn-primary">
              Contactar Asesor
            </a>
          </div>
        </div>
      </div>

      {/* Modal de Resultado */}
      <CoverageResultModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        result={modalResult}
        address={searchAddress}
      />
    </div>
  )
}
