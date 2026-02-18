'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CarouselImage {
  id: number
  filename: string
  url: string
  order: number
  isActive: boolean
}

// Imágenes por defecto en caso de que la API falle
const defaultCarouselImages = [
  '/assets/carrousel1.png',
  '/assets/carrousel2.png',
  '/assets/carrousel3.png',
  '/assets/carrousel4.png',
  '/assets/carrousel5.png',
]

export function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [carouselImages, setCarouselImages] = useState<string[]>(defaultCarouselImages)
  const [isLoading, setIsLoading] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Asegurar que solo se renderice en el cliente
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Cargar imágenes del carrousel desde la API
  useEffect(() => {
    const fetchCarouselImages = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
        const response = await fetch(`${apiUrl}/config/carousel`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const result = await response.json()
          // La API retorna { success: true, message: "...", data: [...] }
          const images: CarouselImage[] = result.data || []
          // Filtrar solo imágenes activas y mapear a URLs
          const activeImages = images
            .filter(img => img.isActive)
            .sort((a, b) => a.order - b.order)
            .map(img => img.url)

          if (activeImages.length > 0) {
            setCarouselImages(activeImages)
            setCurrentIndex(0) // Resetear el índice cuando cambien las imágenes
          }
        } else {
          console.warn('No se pudieron cargar las imágenes del carrousel, usando imágenes por defecto')
        }
      } catch (error) {
        console.error('Error al cargar las imágenes del carrousel:', error)
        // Mantiene las imágenes por defecto
      } finally {
        setIsLoading(false)
      }
    }

    fetchCarouselImages()
  }, [])

  // Validar que currentIndex no exceda el número de imágenes
  useEffect(() => {
    if (currentIndex >= carouselImages.length && carouselImages.length > 0) {
      setCurrentIndex(0)
    }
  }, [carouselImages.length, currentIndex])

  // Auto-play del carrusel
  useEffect(() => {
    if (!isMounted) return

    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length)
      }, 5000) // Cambia cada 5 segundos
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAutoPlaying, isMounted, carouselImages.length])

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length)
  }

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentIndex(index)
  }

  // Siempre renderizar la misma estructura para evitar errores de hidratación
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="relative w-full h-full">
        {carouselImages.map((image, index) => {
          const isActive = !isMounted ? index === 0 : index === currentIndex
          return (
            <div
              key={`carousel-img-${index}`}
              className="absolute inset-0"
              style={{
                opacity: isActive ? 1 : 0,
                transition: isMounted ? 'opacity 1s ease-in-out' : 'none',
                zIndex: isActive ? 1 : 0,
                pointerEvents: isActive ? 'auto' : 'none',
              }}
            >
              <Image
                src={image}
                alt={`Carrusel ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
            </div>
          )
        })}
      </div>

      {/* Botones de navegación */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 hover:scale-110"
        aria-label="Imagen anterior"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 hover:scale-110"
        aria-label="Imagen siguiente"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Indicadores de puntos */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? 'w-8 h-2 bg-white'
                : 'w-2 h-2 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Ir a imagen ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
