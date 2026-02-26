'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { Wifi, Tv, Check, ArrowRight, Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { PlanService } from '@/services/api/PlanService'
import { Plan } from '@/types'
import { resolveAssetUrl } from '@/lib/utils'

// Planes por defecto para mostrar mientras carga o en caso de error
const DEFAULT_PLANS: Plan[] = [
  {
    id: 1,
    name: 'Básico',
    description: 'Plan básico de Internet y TV para uso familiar',
    internetSpeedMbps: 50,
    tvChannels: 84,
    monthlyPrice: 49900,
    active: true,
    popular: false,
    planType: 'BASIC',
  },
  {
    id: 2,
    name: 'Familiar',
    description: 'Plan familiar con más velocidad y canales premium',
    internetSpeedMbps: 100,
    tvChannels: 84,
    monthlyPrice: 79900,
    active: true,
    popular: true,
    planType: 'FAMILY',
  },
  {
    id: 3,
    name: 'Gaming',
    description: 'Plan gaming con latencia ultra baja para videojuegos',
    internetSpeedMbps: 200,
    tvChannels: 84,
    monthlyPrice: 99900,
    active: true,
    popular: false,
    planType: 'GAMING',
  },
  {
    id: 4,
    name: 'Empresarial',
    description: 'Plan empresarial con velocidad dedicada e IP estática',
    internetSpeedMbps: 500,
    tvChannels: 84,
    monthlyPrice: 129900,
    active: true,
    popular: false,
    planType: 'BUSINESS',
  },
]

export function PlanComparator() {
  const [plans, setPlans] = useState<Plan[]>(DEFAULT_PLANS) // Iniciar con planes por defecto
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Navegación del carrusel
  const nextPlan = () => {
    setCurrentIndex((prev) => (prev + 1) % plans.length)
  }

  const prevPlan = () => {
    setCurrentIndex((prev) => (prev - 1 + plans.length) % plans.length)
  }

  // Auto-avanzar cada 8 segundos
  useEffect(() => {
    if (plans.length === 0 || plans.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % plans.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [plans.length])

  // Función para obtener todas las características posibles de un plan
  const getPlanFeatures = (plan: Plan): Set<string> => {
    const features = new Set<string>()
    
    // Características base que todos tienen
    features.add('Internet simétrico')
    features.add('Canales HD')
    features.add('Malla completa de canales')
    features.add('Instalación gratuita')
    features.add('Soporte técnico')
    
    // Características específicas por tipo (si existe planType)
    if (plan.planType) {
      if (plan.planType === 'BASIC') {
        features.add('Soporte técnico 24/7')
      } else if (plan.planType === 'FAMILY') {
        features.add('Soporte técnico prioritario')
        features.add('Router WiFi incluido')
      } else if (plan.planType === 'GAMING') {
        features.add('Latencia ultra baja para gaming')
        features.add('Soporte técnico prioritario')
        features.add('Router Gaming incluido')
      } else if (plan.planType === 'BUSINESS') {
        features.add('Soporte técnico dedicado')
        features.add('Equipos profesionales')
        features.add('IP estática incluida')
      }
    }
    
    return features
  }

  // Obtener todas las características únicas de todos los planes
  const getAllFeatures = (): string[] => {
    const allFeaturesSet = new Set<string>()
    plans.forEach((plan) => {
      const planFeatures = getPlanFeatures(plan)
      planFeatures.forEach((feature) => allFeaturesSet.add(feature))
    })
    return Array.from(allFeaturesSet).sort()
  }

  // Verificar si un plan tiene una característica específica
  const hasFeature = (plan: Plan, feature: string): boolean => {
    const planFeatures = getPlanFeatures(plan)
    return planFeatures.has(feature)
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true)
        setError(null)
        const fetchedPlans = await PlanService.getAllPlans()
        if (fetchedPlans && fetchedPlans.length > 0) {
          setPlans(fetchedPlans)
        } else {
          // Si no hay planes, usar los por defecto del servicio
          setPlans([])
          setError('No hay planes disponibles en este momento.')
        }
      } catch (err) {
        console.error('Error fetching plans:', err)
        // En caso de error, el servicio retorna planes por defecto
        try {
          const defaultPlans = await PlanService.getAllPlans()
          setPlans(defaultPlans)
          setError('No se pudieron cargar los planes desde el servidor. Mostrando planes de ejemplo.')
        } catch (fallbackErr) {
          console.error('Error en fallback:', fallbackErr)
          setError('Error al cargar los planes. Por favor recarga la página.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [])

  // IntersectionObserver para animaciones al hacer scroll
  useEffect(() => {
    // Pequeño delay para asegurar que el DOM esté completamente renderizado
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible')
            }
          })
        },
        { threshold: 0.1 }
      )

      if (containerRef.current) {
        const elements = containerRef.current.querySelectorAll('.animate-on-scroll')
        elements.forEach((el) => {
          // Si el elemento ya está en el viewport, hacerlo visible inmediatamente
          const rect = el.getBoundingClientRect()
          const isInViewport = rect.top < window.innerHeight && rect.bottom > 0
          if (isInViewport) {
            el.classList.add('visible')
          } else {
            observer.observe(el)
          }
        })
      }

      return () => observer.disconnect()
    }, 100)

    return () => {
      clearTimeout(timer)
    }
  }, [plans, loading]) // Re-observar cuando cambien los planes o el estado de carga



  if (loading) {
    return (
      <div className="container-custom section-padding">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-primary-red animate-spin mb-4" />
          <p className="text-neutral-gray text-lg">Cargando planes...</p>
        </div>
      </div>
    )
  }

  // Si hay error pero tenemos planes (planes por defecto), mostrar ambos
  if (error && plans.length === 0) {
    return (
      <div className="container-custom section-padding">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <AlertCircle className="w-12 h-12 text-primary-red mb-4" />
          <p className="text-neutral-gray text-lg">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="container-custom section-padding">
      {/* Header */}
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
          <span className="text-gradient">Nuestros Planes</span>
        </h1>
        <p className="text-base md:text-xl text-neutral-gray max-w-3xl mx-auto">
          Explora nuestros planes de Internet y TV. Navega entre ellos para encontrar el perfecto para ti.
        </p>
      </div>

      {/* Mensaje de error si existe pero hay planes */}
      {error && plans.length > 0 && (
        <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">{error}</p>
          </div>
        </div>
      )}

      {/* Carrusel de Planes (Visualización Uno por Uno) */}
      {plans.length > 0 && (
        <div className="relative">
          {/* Contenedor del plan activo */}
          <div className="overflow-hidden rounded-2xl shadow-2xl bg-neutral-dark">
            {/* Renderizamos solo el plan actual con una animación key para remontar al cambiar */}
            <div key={plans[currentIndex].id} className="animate-fade-in">
              {(() => {
                const plan = plans[currentIndex]
                
                const formatPricePlan = (price: number): string => {
                  return new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(price)
                }

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
                    features.push('Soporte técnico 24/7', 'Instalación gratuita')
                  }

                  return features
                }

                return (
                  <section
                    className={`relative min-h-[600px] md:min-h-[650px] overflow-hidden ${
                      plan.popular ? 'border-4 border-primary-red' : ''
                    } rounded-2xl`}
                  >
                    {/* Imagen de fondo */}
                    {plan.backgroundImage && (
                      <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
                        style={{
                          backgroundImage: `url(${resolveAssetUrl(plan.backgroundImage)})`,
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-neutral-dark/95 via-neutral-dark/80 to-neutral-dark/60" />
                      </div>
                    )}
                    {!plan.backgroundImage && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-red/20 via-secondary-blue/20 to-primary-red/20 bg-neutral-dark" />
                    )}

                    {/* Contenido */}
                    <div className="relative z-10 p-6 sm:p-8 md:p-12 lg:p-16 h-full flex items-center">
                      <div className="max-w-6xl mx-auto w-full">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                          {/* Información del plan */}
                          <div className="text-white pb-16 lg:pb-0"> {/* Padding bottom extra para móvil (chatbot) */}
                            {plan.popular && (
                              <div className="mb-4 animate-slide-in-left">
                                <span className="bg-primary-red text-neutral-white px-4 py-1.5 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-lg">
                                  Más Popular
                                </span>
                              </div>
                            )}
                            
                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 leading-tight">
                              {plan.name}
                            </h2>
                            
                            {plan.description && (
                              <p className="text-base md:text-xl text-neutral-200 mb-6 font-light max-w-lg">
                                {plan.description}
                              </p>
                            )}
                            
                            {!!plan.monthlyPrice && plan.monthlyPrice > 0 && (
                              <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-2 mb-6 md:mb-8">
                                <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">
                                  {formatPricePlan(plan.monthlyPrice)}
                                </span>
                                <span className="text-lg md:text-2xl text-neutral-300 font-medium">/mes</span>
                              </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                              <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-lg backdrop-blur-sm">
                                <Wifi className="w-6 h-6 md:w-8 md:h-8 text-primary-red" />
                                <span className="text-lg md:text-xl font-semibold text-white">
                                  {plan.internetSpeedMbps} Mbps
                                </span>
                              </div>
                              <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-lg backdrop-blur-sm">
                                <Tv className="w-6 h-6 md:w-8 md:h-8 text-secondary-blue" />
                                <span className="text-lg md:text-xl font-semibold text-white">
                                  {plan.tvChannels} canales HD
                                </span>
                              </div>
                            </div>

                            <ul className="space-y-3 mb-8 md:mb-10">
                              {getFeatures(plan).map((feature, featureIndex) => (
                                <li key={featureIndex} className="flex items-start space-x-3">
                                  <div className="bg-primary-red/20 p-1 rounded-full mt-0.5">
                                    <Check className="w-4 h-4 md:w-5 md:h-5 text-primary-red flex-shrink-0" />
                                  </div>
                                  <span className="text-base md:text-lg text-neutral-100 font-light">{feature}</span>
                                </li>
                              ))}
                            </ul>

                            <Link
                              href="/contacto"
                              className="w-full sm:w-auto inline-flex justify-center items-center space-x-2 bg-primary-red hover:bg-primary-red-dark text-neutral-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-primary-red/30 transition-all duration-300 transform hover:-translate-y-1"
                            >
                              <span>Lo quiero ahora</span>
                              <ArrowRight className="w-5 h-5" />
                            </Link>
                          </div>

                          {/* Card de resumen (Solo escritorio) */}
                          <div className="hidden lg:block bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
                            <h3 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">
                              Detalles del Servicio
                            </h3>
                            <div className="space-y-6">
                              <div className="flex justify-between items-center group">
                                <div className="flex items-center space-x-3">
                                  <div className="p-2 bg-white/5 rounded-lg group-hover:bg-primary-red/20 transition-colors">
                                    <Wifi className="w-5 h-5 text-neutral-200" />
                                  </div>
                                  <span className="text-neutral-200 text-lg">Internet Fibra</span>
                                </div>
                                <span className="text-white font-bold text-xl">{plan.internetSpeedMbps} Mbps</span>
                              </div>
                              
                              <div className="flex justify-between items-center group">
                                <div className="flex items-center space-x-3">
                                  <div className="p-2 bg-white/5 rounded-lg group-hover:bg-secondary-blue/20 transition-colors">
                                    <Tv className="w-5 h-5 text-neutral-200" />
                                  </div>
                                  <span className="text-neutral-200 text-lg">Televisión</span>
                                </div>
                                <span className="text-white font-bold text-xl">{plan.tvChannels} Canales</span>
                              </div>
                              
                              {!!plan.monthlyPrice && plan.monthlyPrice > 0 && (
                                <div className="pt-6 border-t border-white/10 mt-2">
                                  <div className="flex justify-between items-end">
                                    <span className="text-neutral-200 text-lg mb-1">Total a pagar</span>
                                    <span className="text-white font-bold text-3xl text-primary-red-light">{formatPricePlan(plan.monthlyPrice)}</span>
                                  </div>
                                  <p className="text-right text-xs text-neutral-400 mt-1">*Impuestos incluidos</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                )
              })()}
            </div>
          </div>

          {/* Botones de navegación (Flotantes y mejor posicionados) */}
          {plans.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.currentTarget.blur(); // Quitar foco para evitar estilos raros
                  prevPlan();
                }}
                className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/10 rounded-full p-3 md:p-4 shadow-lg transition-all duration-200 z-20 group"
                aria-label="Plan anterior"
              >
                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 group-hover:-translate-x-1 transition-transform" />
              </button>
              <button
                onClick={(e) => {
                  e.currentTarget.blur();
                  nextPlan();
                }}
                className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/10 rounded-full p-3 md:p-4 shadow-lg transition-all duration-200 z-20 group"
                aria-label="Siguiente plan"
              >
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-1 transition-transform" />
              </button>
            </>
          )}


          {/* Indicadores de posición */}
          {plans.length > 1 && (
            <div className="flex justify-center space-x-2 mt-8">
              {plans.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-8 bg-primary-red'
                      : 'w-2 bg-neutral-gray-light hover:bg-neutral-gray'
                  }`}
                  aria-label={`Ir al plan ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tabla Comparativa */}
      {plans.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8">
            <span className="text-gradient">Comparación de Planes</span>
          </h2>
          <div className="overflow-x-auto bg-neutral-white rounded-xl shadow-lg border border-neutral-gray-light">
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-neutral-dark sticky left-0 z-30 bg-neutral-white border-b border-r border-neutral-gray-light shadow-[4px_0_10px_-4px_rgba(0,0,0,0.1)]">
                    Característica
                  </th>
                  {plans.map((plan) => (
                    <th
                      key={plan.id}
                      className={`px-6 py-4 text-center text-sm font-bold text-neutral-dark border-b border-neutral-gray-light bg-neutral-white ${
                        plan.popular ? 'bg-primary-red/5' : ''
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <span>{plan.name}</span>
                        {plan.popular && (
                          <span className="text-xs text-primary-red font-semibold mt-1">Más Popular</span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-gray-light">
                {/* Precio Mensual */}
                <tr>
                  <td className="px-6 py-4 font-semibold text-neutral-dark sticky left-0 z-20 bg-neutral-white border-r border-neutral-gray-light shadow-[4px_0_10px_-4px_rgba(0,0,0,0.1)]">
                    Precio Mensual
                  </td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="px-6 py-4 text-center bg-neutral-white">
                      <span className="text-lg font-bold text-primary-red">{formatPrice(plan.monthlyPrice)}</span>
                    </td>
                  ))}
                </tr>
                {/* Velocidad de Internet */}
                <tr className="bg-neutral-gray-light/30">
                  <td className="px-6 py-4 font-semibold text-neutral-dark sticky left-0 z-20 bg-[#f5f5f5] border-r border-neutral-gray-light shadow-[4px_0_10px_-4px_rgba(0,0,0,0.1)]">
                    Velocidad de Internet
                  </td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="px-6 py-4 text-center bg-neutral-gray-light/30">
                      <span className="text-neutral-dark font-semibold">{plan.internetSpeedMbps} Mbps</span>
                    </td>
                  ))}
                </tr>
                {/* Canales de TV */}
                <tr>
                  <td className="px-6 py-4 font-semibold text-neutral-dark sticky left-0 z-20 bg-neutral-white border-r border-neutral-gray-light shadow-[4px_0_10px_-4px_rgba(0,0,0,0.1)]">
                    Canales de TV
                  </td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="px-6 py-4 text-center bg-neutral-white">
                      <span className="text-neutral-dark font-semibold">{plan.tvChannels} canales</span>
                    </td>
                  ))}
                </tr>
                {/* Características */}
                {getAllFeatures().map((feature, index) => (
                  <tr
                    key={feature}
                    className={index % 2 === 0 ? 'bg-neutral-gray-light/30' : 'bg-neutral-white'}
                  >
                    <td className={`px-6 py-4 font-semibold text-neutral-dark sticky left-0 z-20 border-r border-neutral-gray-light shadow-[4px_0_10px_-4px_rgba(0,0,0,0.1)] ${
                      index % 2 === 0 ? 'bg-[#f5f5f5]' : 'bg-neutral-white'
                    }`}>
                      {feature}
                    </td>
                    {plans.map((plan) => (
                      <td key={plan.id} className={`px-6 py-4 text-center ${
                        index % 2 === 0 ? 'bg-neutral-gray-light/30' : 'bg-neutral-white'
                      }`}>
                        {hasFeature(plan, feature) ? (
                          <Check className="w-5 h-5 text-primary-red mx-auto" />
                        ) : (
                          <span className="text-neutral-gray">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>
      )}

      {/* Botón Solicitar Plan Personalizado */}
      <div className="mt-12 text-center">
        <Link 
          href="/contacto" 
          className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary-red to-primary-red-dark text-white rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          <span>Solicitar Plan Personalizado</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      {/* CTA Final */}
      <div className="mt-16 text-center">
        <div className="inline-block p-8 rounded-xl bg-gradient-to-r from-primary-red/10 to-secondary-blue/10 border border-primary-red/20">
          <h3 className="text-2xl font-bold text-neutral-dark mb-4">
            ¿No encuentras el plan ideal?
          </h3>
          <p className="text-neutral-gray mb-6 max-w-2xl mx-auto">
            Contáctanos y te ayudamos a encontrar el plan perfecto para tus necesidades.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contacto" className="btn-primary">
              Contactar Asesor
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
