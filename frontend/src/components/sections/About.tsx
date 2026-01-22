'use client'

import { useEffect, useRef } from 'react'
import { Heart, Shield, Zap, Award } from 'lucide-react'

export function About() {
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

  const values = [
    {
      icon: Heart,
      title: 'Uniendo Familias',
      description: 'Nuestro compromiso es conectar a las familias bogotanas con servicios de calidad que fortalezcan sus lazos.',
      color: 'text-primary-red',
      bgColor: 'bg-primary-red/10',
    },
    {
      icon: Shield,
      title: 'Confianza y Seguridad',
      description: 'Cumplimos con todos los estándares regulatorios y garantizamos la protección de tus datos y privacidad.',
      color: 'text-secondary-blue',
      bgColor: 'bg-secondary-blue/10',
    },
    {
      icon: Zap,
      title: 'Tecnología Avanzada',
      description: 'Utilizamos la última tecnología en fibra óptica para ofrecerte velocidades excepcionales y estabilidad.',
      color: 'text-primary-red',
      bgColor: 'bg-primary-red/10',
    },
    {
      icon: Award,
      title: 'Excelencia en Servicio',
      description: 'Atención personalizada, soporte técnico especializado y compromiso con la satisfacción del cliente.',
      color: 'text-secondary-blue',
      bgColor: 'bg-secondary-blue/10',
    },
  ]

  return (
    <section ref={sectionRef} className="section-padding bg-neutral-white">
      <div className="container-custom">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-gradient">Sobre FITEL</span>
          </h2>
          <p className="text-lg text-neutral-gray max-w-2xl mx-auto">
            Somos una empresa comprometida con brindar servicios de Internet y Televisión de alta calidad
            en Bogotá, enfocada en hogares y pequeñas empresas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <div
                key={index}
                className="p-6 rounded-xl bg-neutral-white border-2 border-neutral-gray-light hover:border-primary-red transition-all duration-300 animate-on-scroll glow-effect"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 rounded-full ${value.bgColor} flex items-center justify-center mb-4`}>
                  <Icon className={`w-8 h-8 ${value.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-neutral-dark">{value.title}</h3>
                <p className="text-neutral-gray text-sm leading-relaxed">{value.description}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-16 p-8 rounded-xl bg-gradient-to-r from-primary-red/10 to-secondary-blue/10 border border-primary-red/20 animate-on-scroll">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4 text-neutral-dark">
              Nuestra Misión
            </h3>
            <p className="text-neutral-gray text-lg leading-relaxed">
              Proporcionar servicios de comunicación de excelencia que conecten a las familias y empresas
              de Bogotá, facilitando el acceso a la información, el entretenimiento y las oportunidades
              que ofrece el mundo digital, siempre con un enfoque humano y cercano.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
