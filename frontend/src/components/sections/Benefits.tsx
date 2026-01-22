'use client'

import { useEffect, useRef } from 'react'
import { CheckCircle, Clock, Headphones, Wrench } from 'lucide-react'

export function Benefits() {
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

  const benefits = [
    {
      icon: Clock,
      title: 'Instalación Rápida',
      description: 'Instalación en menos de 48 horas después de la solicitud.',
      color: 'text-primary-red',
    },
    {
      icon: CheckCircle,
      title: 'Sin Contratos Forzosos',
      description: 'Planes flexibles que se adaptan a tus necesidades.',
      color: 'text-secondary-blue',
    },
    {
      icon: Headphones,
      title: 'Atención 24/7',
      description: 'Soporte técnico disponible todos los días, a toda hora.',
      color: 'text-primary-red',
    },
    {
      icon: Wrench,
      title: 'Mantenimiento Incluido',
      description: 'Servicio técnico y mantenimiento preventivo sin costo adicional.',
      color: 'text-secondary-blue',
    },
  ]

  return (
    <section ref={sectionRef} className="section-padding bg-gradient-to-br from-neutral-gray-light to-neutral-white">
      <div className="container-custom">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            ¿Por qué elegir <span className="text-gradient">FITEL</span>?
          </h2>
          <p className="text-lg text-neutral-gray max-w-2xl mx-auto">
            Beneficios que hacen la diferencia para tu hogar o negocio
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div
                key={index}
                className="p-6 bg-neutral-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-on-scroll"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary-red/10 flex items-center justify-center">
                    <Icon className={`w-6 h-6 ${benefit.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-dark">{benefit.title}</h3>
                </div>
                <p className="text-neutral-gray text-sm leading-relaxed">{benefit.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
