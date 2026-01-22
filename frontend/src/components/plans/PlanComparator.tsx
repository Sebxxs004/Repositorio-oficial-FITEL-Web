'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { Wifi, Tv, Check, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import { PlanService } from '@/services/api/PlanService'
import { Plan } from '@/types'

// Planes por defecto para mostrar mientras carga o en caso de error
const DEFAULT_PLANS: Plan[] = [
  {
    id: 1,
    name: 'Básico',
    description: 'Plan básico de Internet y TV para uso familiar',
    internetSpeedMbps: 50,
    tvChannels: 80,
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
    tvChannels: 120,
    monthlyPrice: 79900,
    active: true,
    popular: true,
    planType: 'FAMILY',
  },
  {
    id: 3,
    name: 'Empresarial',
    description: 'Plan empresarial con velocidad dedicada e IP estática',
    internetSpeedMbps: 200,
    tvChannels: 150,
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
  const [selectedPlans, setSelectedPlans] = useState<Set<number>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)

  // IntersectionObserver para animaciones al hacer scroll
  useEffect(() => {
    let observer: IntersectionObserver | null = null
    
    // Pequeño delay para asegurar que el DOM esté listo
    const timer = setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible')
              // Una vez visible, dejar de observar para mejor rendimiento
              observer?.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.05, rootMargin: '50px' } // Más permisivo para que aparezcan antes
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
            observer?.observe(el)
          }
        })
      }
    }, 100)

    return () => {
      clearTimeout(timer)
      if (observer) {
        observer.disconnect()
      }
    }
  }, [plans, loading]) // Re-ejecutar cuando cambien los planes o termine la carga

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

  const togglePlanSelection = (planId: number) => {
    const newSelected = new Set(selectedPlans)
    if (newSelected.has(planId)) {
      newSelected.delete(planId)
    } else {
      newSelected.add(planId)
    }
    setSelectedPlans(newSelected)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getPlanFeatures = (plan: Plan) => {
    const baseFeatures = [
      'Soporte técnico 24/7',
      'Instalación gratuita',
      'Router WiFi incluido',
    ]

    if (plan.planType === 'FAMILY') {
      return [
        ...baseFeatures,
        'Canales Premium',
        'Soporte técnico prioritario',
      ]
    }

    if (plan.planType === 'BUSINESS') {
      return [
        ...baseFeatures,
        'IP estática incluida',
        'Equipos profesionales',
        'Soporte técnico dedicado',
      ]
    }

    return baseFeatures
  }

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
      {/* Header - Siempre visible sin animación */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          <span className="text-gradient">Comparador de Planes</span>
        </h1>
        <p className="text-lg md:text-xl text-neutral-gray max-w-3xl mx-auto">
          Compara nuestros planes de Internet y TV. Selecciona hasta 3 planes para compararlos lado a lado.
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

      {/* Instrucciones */}
      {selectedPlans.size > 0 && (
        <div className="mb-8 p-4 bg-secondary-blue/10 border border-secondary-blue/20 rounded-lg animate-on-scroll">
          <p className="text-sm text-neutral-dark">
            <strong>Planes seleccionados:</strong> {selectedPlans.size} de 3 máximo. 
            Haz clic en las tarjetas para seleccionar/deseleccionar planes.
          </p>
        </div>
      )}

      {/* Grid de Planes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {plans.map((plan, index) => {
          const isSelected = selectedPlans.has(plan.id)
          const canSelect = selectedPlans.size < 3 || isSelected

          return (
            <div
              key={plan.id}
              onClick={() => canSelect && togglePlanSelection(plan.id)}
              className={`relative p-6 rounded-2xl border-2 transition-all duration-300 transform cursor-pointer animate-on-scroll ${
                isSelected
                  ? 'border-primary-red scale-105 shadow-2xl bg-primary-red/5'
                  : 'border-neutral-gray-light hover:border-primary-red hover:shadow-xl bg-neutral-white'
              } ${!canSelect ? 'opacity-50 cursor-not-allowed' : ''} ${
                plan.popular ? 'md:scale-110' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-red text-neutral-white px-4 py-1 rounded-full text-sm font-bold">
                    Más Popular
                  </span>
                </div>
              )}

              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 bg-primary-red rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-neutral-white" />
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-neutral-dark mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center space-x-1 mb-4">
                  <span className="text-4xl font-bold text-gradient">{formatPrice(plan.monthlyPrice)}</span>
                  <span className="text-neutral-gray">/mes</span>
                </div>
                {plan.description && (
                  <p className="text-sm text-neutral-gray mb-4">{plan.description}</p>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3 p-3 bg-neutral-gray-light/50 rounded-lg">
                  <Wifi className="w-5 h-5 text-primary-red" />
                  <div>
                    <span className="text-neutral-dark font-semibold">{plan.internetSpeedMbps} Mbps</span>
                    <p className="text-xs text-neutral-gray">Velocidad de Internet</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-neutral-gray-light/50 rounded-lg">
                  <Tv className="w-5 h-5 text-secondary-blue" />
                  <div>
                    <span className="text-neutral-dark font-semibold">{plan.tvChannels} Canales</span>
                    <p className="text-xs text-neutral-gray">Canales de TV</p>
                  </div>
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                {getPlanFeatures(plan).map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-2">
                    <Check className="w-4 h-4 text-primary-red flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-gray">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/solicitar-instalacion"
                className={`w-full btn-primary flex items-center justify-center space-x-2 ${
                  isSelected ? 'opacity-100' : ''
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <span>Contratar Ahora</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )
        })}
      </div>

      {/* Tabla Comparativa */}
      {selectedPlans.size > 1 && (
        <div className="mt-16 animate-on-scroll">
          <h2 className="text-3xl font-bold text-center mb-8">
            <span className="text-gradient">Comparación Detallada</span>
          </h2>
          <div className="overflow-x-auto bg-neutral-white rounded-xl shadow-lg border border-neutral-gray-light">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-primary-red/10 to-secondary-blue/10">
                  <th className="px-6 py-4 text-left text-sm font-bold text-neutral-dark">Característica</th>
                  {plans
                    .filter((p) => selectedPlans.has(p.id))
                    .map((plan) => (
                      <th key={plan.id} className="px-6 py-4 text-center text-sm font-bold text-neutral-dark">
                        {plan.name}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-gray-light">
                <tr>
                  <td className="px-6 py-4 font-semibold text-neutral-dark">Precio Mensual</td>
                  {plans
                    .filter((p) => selectedPlans.has(p.id))
                    .map((plan) => (
                      <td key={plan.id} className="px-6 py-4 text-center">
                        <span className="text-lg font-bold text-primary-red">{formatPrice(plan.monthlyPrice)}</span>
                      </td>
                    ))}
                </tr>
                <tr className="bg-neutral-gray-light/30">
                  <td className="px-6 py-4 font-semibold text-neutral-dark">Velocidad de Internet</td>
                  {plans
                    .filter((p) => selectedPlans.has(p.id))
                    .map((plan) => (
                      <td key={plan.id} className="px-6 py-4 text-center">
                        <span className="text-neutral-dark font-semibold">{plan.internetSpeedMbps} Mbps</span>
                      </td>
                    ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 font-semibold text-neutral-dark">Canales de TV</td>
                  {plans
                    .filter((p) => selectedPlans.has(p.id))
                    .map((plan) => (
                      <td key={plan.id} className="px-6 py-4 text-center">
                        <span className="text-neutral-dark font-semibold">{plan.tvChannels}</span>
                      </td>
                    ))}
                </tr>
                <tr className="bg-neutral-gray-light/30">
                  <td className="px-6 py-4 font-semibold text-neutral-dark">Tipo de Plan</td>
                  {plans
                    .filter((p) => selectedPlans.has(p.id))
                    .map((plan) => (
                      <td key={plan.id} className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-primary-red/10 text-primary-red rounded-full text-sm font-medium">
                          {plan.planType}
                        </span>
                      </td>
                    ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 font-semibold text-neutral-dark">Soporte Técnico</td>
                  {plans
                    .filter((p) => selectedPlans.has(p.id))
                    .map((plan) => (
                      <td key={plan.id} className="px-6 py-4 text-center">
                        <Check className="w-5 h-5 text-primary-red mx-auto" />
                      </td>
                    ))}
                </tr>
                <tr className="bg-neutral-gray-light/30">
                  <td className="px-6 py-4 font-semibold text-neutral-dark">Instalación Gratuita</td>
                  {plans
                    .filter((p) => selectedPlans.has(p.id))
                    .map((plan) => (
                      <td key={plan.id} className="px-6 py-4 text-center">
                        <Check className="w-5 h-5 text-primary-red mx-auto" />
                      </td>
                    ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CTA Final */}
      <div className="mt-16 text-center animate-on-scroll">
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
            <Link href="/solicitar-instalacion" className="btn-outline">
              Solicitar Instalación
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
