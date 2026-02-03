'use client'

import { useEffect, useRef, useState } from 'react'

// Coordenadas del Parque Gaitán Cortés, San Cristóbal, Bogotá
// Coordenadas exactas: 4°33'28.2"N 74°05'19.4"W
// Convertido a decimal: 4.5578, -74.0887
const CENTER_LAT = 4.5578
const CENTER_LNG = -74.0887

interface MapComponentProps {
  geocodedLocation?: {
    lat: number
    lng: number
    address: string
  } | null
}

// Función helper para cargar leaflet de forma segura
let leafletPromise: Promise<any> | null = null
let leafletLib: any = null

function loadLeaflet(): Promise<any> {
  if (typeof window === 'undefined') {
    return Promise.resolve(null)
  }
  
  // Si ya está cargado, devolver directamente
  if (leafletLib) {
    return Promise.resolve(leafletLib)
  }
  
  // Si hay una promesa en curso, devolverla
  if (leafletPromise) {
    return leafletPromise
  }
  
  // Usar import dinámico estándar
  // Next.js debería poder resolverlo con transpilePackages configurado
  leafletPromise = import('leaflet')
    .then((module: any) => {
      leafletLib = module.default || module
      return leafletLib
    })
    .catch((error) => {
      console.error('Error loading leaflet:', error)
      leafletPromise = null // Reset para permitir reintentos
      throw error
    })
  
  return leafletPromise
}

export default function MapComponent({ geocodedLocation }: MapComponentProps) {
  const mapRef = useRef<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const addressMarkerRef = useRef<any>(null)
  const [leafletLoaded, setLeafletLoaded] = useState(false)

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || typeof window === 'undefined') return

    // Verificar si el contenedor ya tiene un mapa inicializado
    if ((mapContainerRef.current as any)._leaflet_id) {
      return
    }

    let isMounted = true

    // Importar Leaflet dinámicamente solo en el cliente
    loadLeaflet().then((L) => {
      if (!L || !isMounted || !mapContainerRef.current) return
      
      setLeafletLoaded(true)
      
      // Verificar nuevamente si el contenedor ya tiene un mapa
      if ((mapContainerRef.current as any)._leaflet_id) {
        return
      }

      // Fix para los iconos de Leaflet en Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      // Crear el mapa con zoom inicial más bajo
      const map = L.map(mapContainerRef.current!, {
        center: [CENTER_LAT, CENTER_LNG],
        zoom: 12, // Zoom inicial reducido para ver más área
        zoomControl: true,
        minZoom: 11, // Zoom mínimo para evitar acercarse demasiado
      })

      // Agregar capa de OpenStreetMap con configuración mejorada
      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        minZoom: 11,
        tileSize: 256,
        zoomOffset: 0,
        noWrap: false,
        updateWhenZooming: true,
        updateWhenIdle: true,
        keepBuffer: 2,
        crossOrigin: true,
      })
      
      osmLayer.addTo(map)
      
      // Manejar errores de carga de tiles
      osmLayer.on('tileerror', (error: any, tile: any) => {
        console.warn('Error cargando tile:', error, tile)
        // Intentar recargar el tile
        if (tile && tile.el) {
          tile.el.style.display = 'none'
        }
      })
      
      // Manejar carga exitosa de tiles
      osmLayer.on('tileload', (event: any) => {
        if (event.tile && event.tile.el) {
          event.tile.el.style.display = 'block'
        }
      })
      
      // Asegurar que los tiles se carguen correctamente
      map.whenReady(() => {
        // Esperar un momento para que el contenedor tenga dimensiones
        setTimeout(() => {
          map.invalidateSize()
        }, 100)
      })

      // Crear icono personalizado para el marcador (rojo FITEL)
      const customIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41], // Punto donde el icono se ancla al marcador (centro inferior)
        popupAnchor: [0, -41], // Ajuste del popup para que aparezca arriba del marcador, centrado
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        shadowSize: [41, 41],
        shadowAnchor: [12, 41],
      })

      // Agregar marcador en el Parque Gaitán Cortés
      const marker = L.marker([CENTER_LAT, CENTER_LNG], { icon: customIcon })
        .addTo(map)
        .bindPopup(
          '<strong>FITEL - Zona de Cobertura</strong><br>Parque Gaitán Cortés<br>Localidad San Cristóbal, Bogotá D.C.',
          {
            offset: [0, -10], // Offset adicional para mejor posicionamiento
            className: 'fitel-popup', // Clase personalizada para estilos
          }
        )
        .openPopup()

      // Crear efecto de círculo difuminado para expansión de cobertura
      // Múltiples círculos concéntricos con opacidades decrecientes
      const centerPoint = [CENTER_LAT, CENTER_LNG]
      const maxRadius = 3000 // Radio máximo en metros (3 km) - aumentado para mayor cobertura
      
      // Crear círculos concéntricos con diferentes opacidades para efecto de difuminado
      const circles: any[] = []
      const numCircles = 8 // Número de círculos para el efecto de gradiente
      
      for (let i = numCircles; i >= 1; i--) {
        const radius = (maxRadius / numCircles) * i
        // Opacidad decreciente desde el centro hacia afuera
        const opacity = Math.max(0.05, (i / numCircles) * 0.4)
        const weight = i === numCircles ? 2 : 0 // Solo el círculo exterior tiene borde visible
        
        const circle = L.circle(centerPoint, {
          radius: radius,
          color: '#FF1744', // Rojo FITEL
          fillColor: '#FF1744',
          fillOpacity: opacity,
          weight: weight,
          opacity: opacity * 2, // Borde más visible
        }).addTo(map)
        
        circles.push(circle)
      }
      
      // Agregar popup al círculo más grande (exterior)
      if (circles.length > 0) {
        circles[circles.length - 1].bindPopup(
          '<strong>Área de Cobertura FITEL</strong><br>Localidad San Cristóbal<br>Internet y TV de alta velocidad disponible<br><small>Zona de cobertura en expansión</small>'
        )
      }

      // Ajustar el mapa para mostrar todo el área de cobertura con zoom limitado
      const bounds = circles[circles.length - 1].getBounds()
      map.fitBounds(bounds, { 
        padding: [100, 100], // Más padding para que no ocupe toda la pantalla
        maxZoom: 13, // Limitar el zoom máximo para evitar que se vea todo rojo
      })

      mapRef.current = map
    }).catch((error) => {
      console.error('Error loading Leaflet:', error)
    })

    return () => {
      isMounted = false
      if (mapRef.current) {
        try {
          mapRef.current.remove()
        } catch (error) {
          // Ignorar errores al remover el mapa
        }
        mapRef.current = null
      }
      // Limpiar el contenedor
      if (mapContainerRef.current) {
        (mapContainerRef.current as any)._leaflet_id = undefined
      }
    }
  }, [])

  // Actualizar marcador cuando cambie la ubicación geocodificada
  useEffect(() => {
    if (!mapRef.current || !geocodedLocation) {
      // Remover marcador si no hay ubicación
      if (addressMarkerRef.current && mapRef.current) {
        mapRef.current.removeLayer(addressMarkerRef.current)
        addressMarkerRef.current = null
      }
      return
    }

    if (!leafletLoaded || !mapRef.current) return

    loadLeaflet().then((L) => {
      if (!L) return

      // Remover marcador anterior si existe
      if (addressMarkerRef.current) {
        mapRef.current.removeLayer(addressMarkerRef.current)
      }

      // Crear icono azul para la dirección ingresada
      const addressIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [0, -41],
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        shadowSize: [41, 41],
        shadowAnchor: [12, 41],
      })

      // Agregar marcador para la dirección/ubicación ingresada (punto exacto, no perímetro)
      const addressMarker = L.marker([geocodedLocation.lat, geocodedLocation.lng], { 
        icon: addressIcon,
        // Asegurar que sea un punto exacto, no un círculo
        draggable: false,
      })
        .addTo(mapRef.current)
        .bindPopup(
          `<strong>Tu ubicación</strong><br>${geocodedLocation.address}`
        )
        .openPopup()

      addressMarkerRef.current = addressMarker

      // Ajustar el mapa para mostrar ambos marcadores (centro de cobertura y dirección)
      // Asegurar que ambos puntos sean visibles
      const allBounds = L.latLngBounds(
        [[CENTER_LAT, CENTER_LNG], [geocodedLocation.lat, geocodedLocation.lng]]
      )
      mapRef.current.fitBounds(allBounds, { padding: [100, 100] })
    })
  }, [geocodedLocation])

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-[600px] rounded-xl"
      style={{ zIndex: 0 }}
    />
  )
}
