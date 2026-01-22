'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Wifi, Tv, Check, ArrowRight } from 'lucide-react'

export function Plans() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
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

    if (sectionRef.current) {
      const elements = sectionRef.current.querySelectorAll('.animate-on-scroll')
      elements.forEach((el) => observer.observe(el))
    }

    return () => observer.disconnect()
  }, [])

  const plans = [
    {
      name: 'Básico',
      internet: '50 Mbps',
      tv: '80 canales',
      price: '$49.900',
      period: 'mes',
      features: [
        'Internet 50 Mbps simétrico',
        '80 canales HD',
        'Soporte técnico 24/7',
        'Instalación gratuita',
      ],
      popular: false,
      color: 'border-secondary-blue',
      buttonClass: 'btn-secondary',
    },
    {
      name: 'Familiar',
      internet: '100 Mbps',
      tv: '120 canales',
      price: '$79.900',
      period: 'mes',
      features: [
        'Internet 100 Mbps simétrico',
        '120 canales HD + Premium',
        'Soporte técnico prioritario',
        'Instalación gratuita',
        'Router WiFi incluido',
      ],
      popular: true,
      color: 'border-primary-red',
      buttonClass: 'btn-primary',
    },
    {
      name: 'Empresarial',
      internet: '200 Mbps',
      tv: '150 canales',
      price: '$129.900',
      period: 'mes',
      features: [
        'Internet 200 Mbps simétrico',
        '150 canales HD + Premium',
        'Soporte técnico dedicado',
        'Instalación gratuita',
        'Equipos profesionales',
        'IP estática incluida',
      ],
      popular: false,
      color: 'border-secondary-blue',
      buttonClass: 'btn-secondary',
    },
  ]

  return (
    <section ref={sectionRef} id="planes" className="section-padding bg-neutral-white">
      <div className="container-custom">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Nuestros <span className="text-gradient">Planes</span>
          </h2>
          <p className="text-lg text-neutral-gray max-w-2xl mx-auto">
            Elige el plan perfecto para tu hogar o negocio. Todos incluyen Internet y TV de alta calidad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-2xl border-2 ${plan.color} bg-neutral-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-on-scroll ${
                plan.popular ? 'scale-105 md:scale-110' : ''
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-red text-neutral-white px-4 py-1 rounded-full text-sm font-bold">
                    Más Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-neutral-dark mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center space-x-1 mb-4">
                  <span className="text-4xl font-bold text-gradient">{plan.price}</span>
                  <span className="text-neutral-gray">/{plan.period}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Wifi className="w-5 h-5 text-primary-red" />
                  <span className="text-neutral-dark font-semibold">{plan.internet}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Tv className="w-5 h-5 text-secondary-blue" />
                  <span className="text-neutral-dark font-semibold">{plan.tv}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-primary-red flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-gray text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/planes"
                className={`w-full ${plan.buttonClass} flex items-center justify-center space-x-2`}
              >
                <span>Ver Detalles</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center animate-on-scroll">
          <p className="text-neutral-gray mb-4">
            ¿Necesitas un plan personalizado? Contáctanos y te ayudamos a encontrar la mejor opción.
          </p>
          <Link href="/contacto" className="btn-outline">
            Consultar Plan Personalizado
          </Link>
        </div>
      </div>
    </section>
  )
}
