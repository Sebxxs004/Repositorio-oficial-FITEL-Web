'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Wifi, Tv, Check, ArrowRight, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { PlanService } from '@/services/api/PlanService'
import { Plan } from '@/types'

interface PlanDisplay {
  name: string
  internet: string
  tv: string
  price: string
  period: string
  features: string[]
  popular: boolean
  color: string
  buttonClass: string
}

// Función para convertir un Plan de la API al formato de visualización
const mapPlanToDisplay = (plan: Plan): PlanDisplay => {
    const formatPrice = (price: number): string => {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price)
    }

    // Generar features basadas en el tipo de plan
    const getFeatures = (plan: Plan): string[] => {
      const features: string[] = [
        `Internet ${plan.internetSpeedMbps} Mbps simétrico`,
        `${plan.tvChannels} canales HD - Malla completa`,
      ]

      if (plan.planType === 'BASIC') {
        features.push('Soporte técnico 24/7', 'Instalación gratuita')
      } else if (plan.planType === 'FAMILY') {
        features.push('Soporte técnico prioritario', 'Instalación gratuita', 'Router WiFi incluido')
      } else if (plan.planType === 'GAMING') {
        features.push(
          'Latencia ultra baja para gaming',
          'Soporte técnico prioritario',
          'Instalación gratuita',
          'Router Gaming incluido'
        )
      } else if (plan.planType === 'BUSINESS') {
        features.push(
          'Soporte técnico dedicado',
          'Instalación gratuita',
          'Equipos profesionales',
          'IP estática incluida'
        )
      } else {
        // Plan genérico
        features.push('Soporte técnico 24/7', 'Instalación gratuita')
      }

      return features
    }

    return {
      name: plan.name,
      internet: `${plan.internetSpeedMbps} Mbps`,
      tv: `${plan.tvChannels} canales`,
      price: plan.monthlyPrice && plan.monthlyPrice > 0 ? formatPrice(plan.monthlyPrice) : '',
      period: 'mes',
      features: getFeatures(plan),
      popular: plan.popular,
      color: plan.popular ? 'border-primary-red' : 'border-secondary-blue',
      buttonClass: plan.popular ? 'btn-primary' : 'btn-secondary',
    }
}

export function Plans() {
  const sectionRef = useRef<HTMLElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [plans, setPlans] = useState<PlanDisplay[]>([])
  const [loading, setLoading] = useState(true)

  // Obtener planes desde la API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true)
        const fetchedPlans = await PlanService.getAllPlans()
        
        // Filtrar solo planes activos y mapearlos al formato de visualización
        const activePlans = fetchedPlans
          .filter((plan) => plan.active)
          .map(mapPlanToDisplay)
        
        setPlans(activePlans)
      } catch (error) {
        console.error('Error fetching plans:', error)
        // En caso de error, el PlanService.getAllPlans() ya retorna planes por defecto
        // pero si aún falla, mostrar un array vacío
        setPlans([])
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [])


  // Calcular el número de planes visibles según el tamaño de pantalla
  const [plansPerView, setPlansPerView] = useState(1)

  useEffect(() => {
    const updatePlansPerView = () => {
      if (window.innerWidth >= 1024) {
        setPlansPerView(3) // Desktop: 3 planes
      } else if (window.innerWidth >= 768) {
        setPlansPerView(2) // Tablet: 2 planes
      } else {
        setPlansPerView(1) // Mobile: 1 plan
      }
    }

    updatePlansPerView()
    window.addEventListener('resize', updatePlansPerView)
    return () => window.removeEventListener('resize', updatePlansPerView)
  }, [])

  // Calcular el número máximo de grupos según planes visibles
  const maxGroups = plans.length > 0 ? Math.ceil(plans.length / plansPerView) : 1

  const nextPlan = () => {
    setCurrentIndex((prev) => (prev + 1) % maxGroups)
  }

  const prevPlan = () => {
    setCurrentIndex((prev) => (prev - 1 + maxGroups) % maxGroups)
  }

  // Auto-avanzar cada 5 segundos (solo si hay planes)
  useEffect(() => {
    if (plans.length === 0 || maxGroups <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % maxGroups)
    }, 5000)

    return () => clearInterval(interval)
  }, [maxGroups, plans.length])

  return (
    <section ref={sectionRef} id="planes" className="section-padding bg-neutral-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Nuestros <span className="text-gradient">Planes</span>
          </h2>
          <p className="text-lg text-neutral-gray max-w-2xl mx-auto">
            Elige el plan perfecto para tu hogar o negocio. Todos incluyen Internet y TV de alta calidad.
          </p>
        </div>

        {/* Carrusel de Planes */}
        <div className="relative">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-primary-red animate-spin" />
              <span className="ml-3 text-neutral-gray">Cargando planes...</span>
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-neutral-gray mb-4">No hay planes disponibles en este momento.</p>
              <p className="text-sm text-neutral-gray">Por favor, verifica la conexión con el servidor.</p>
            </div>
          ) : (
            <>
              {/* Contenedor del carrusel */}
              <div className="overflow-hidden pt-6 pb-4">
                <div
                  className="flex transition-transform duration-500 ease-in-out items-stretch"
                  style={{ transform: `translateX(-${currentIndex * (100 / plansPerView)}%)` }}
                >
                  {plans.map((plan, index) => (
                    <div
                      key={index}
                      className={`px-2 sm:px-4 flex ${
                        plansPerView === 1 ? 'min-w-full' : 
                        plansPerView === 2 ? 'min-w-[50%]' : 
                        'min-w-[33.333%]'
                      }`}
                    >
                      <div
                        className={`relative w-full p-6 sm:p-8 rounded-2xl border-2 ${plan.color} bg-neutral-white shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full ${
                          plan.popular ? 'scale-105' : ''
                        }`}
                      >
                        {plan.popular && (
                          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                            <span className="bg-primary-red text-neutral-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                              Más Popular
                            </span>
                          </div>
                        )}

                        <div className="text-center mb-4 sm:mb-6">
                          <h3 className="text-xl sm:text-2xl font-bold text-neutral-dark mb-2">{plan.name}</h3>
                          {plan.price && (
                            <div className="flex items-baseline justify-center space-x-1 mb-4">
                              <span className="text-3xl sm:text-4xl font-bold text-gradient">{plan.price}</span>
                              <span className="text-neutral-gray text-sm sm:text-base">/{plan.period}</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <Wifi className="w-4 h-4 sm:w-5 sm:h-5 text-primary-red flex-shrink-0" />
                            <span className="text-neutral-dark font-semibold text-sm sm:text-base">{plan.internet}</span>
                          </div>
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <Tv className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-blue flex-shrink-0" />
                            <span className="text-neutral-dark font-semibold text-sm sm:text-base">{plan.tv}</span>
                          </div>
                        </div>

                        <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 flex-grow">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start space-x-2 sm:space-x-3">
                              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary-red flex-shrink-0 mt-0.5" />
                              <span className="text-neutral-gray text-xs sm:text-sm leading-relaxed">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <Link
                          href="/planes"
                          className={`w-full mt-auto ${plan.buttonClass} flex items-center justify-center space-x-2`}
                        >
                          <span>Ver Detalles</span>
                          <ArrowRight className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botones de navegación */}
              {maxGroups > 1 && (
                <>
                  <button
                    onClick={prevPlan}
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-neutral-gray-light z-10"
                    aria-label="Plan anterior"
                  >
                    <ChevronLeft className="w-6 h-6 text-primary-red" />
                  </button>
                  <button
                    onClick={nextPlan}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-neutral-gray-light z-10"
                    aria-label="Siguiente plan"
                  >
                    <ChevronRight className="w-6 h-6 text-primary-red" />
                  </button>
                </>
              )}

              {/* Indicadores de posición */}
              {maxGroups > 1 && (
                <div className="flex justify-center space-x-2 mt-8">
                  {Array.from({ length: maxGroups }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? 'w-8 bg-primary-red'
                          : 'w-2 bg-neutral-gray-light hover:bg-neutral-gray'
                      }`}
                      aria-label={`Ir al grupo ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="mt-12 text-center">
          <p className="text-neutral-gray mb-4">
            ¿Necesitas un plan personalizado? Contáctanos y te ayudamos a encontrar la mejor opción.
          </p>
          <Link href="/contacto" className="btn-outline">
            Solicitar Plan Personalizado
          </Link>
        </div>
      </div>
    </section>
  )
}
