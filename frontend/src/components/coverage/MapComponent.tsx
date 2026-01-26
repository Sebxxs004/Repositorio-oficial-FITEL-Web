'use client'

import { useEffect, useRef } from 'react'

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

export default function MapComponent({ geocodedLocation }: MapComponentProps) {
  const mapRef = useRef<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const addressMarkerRef = useRef<any>(null)

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || typeof window === 'undefined') return

    // Verificar si el contenedor ya tiene un mapa inicializado
    if ((mapContainerRef.current as any)._leaflet_id) {
      return
    }

    let isMounted = true

    // Importar Leaflet dinámicamente solo en el cliente
    import('leaflet').then((leafletModule) => {
      if (!isMounted || !mapContainerRef.current) return

      const L = leafletModule.default || leafletModule
      
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

      // Agregar capa de OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

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

    import('leaflet').then((leafletModule) => {
      const L = leafletModule.default || leafletModule

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
