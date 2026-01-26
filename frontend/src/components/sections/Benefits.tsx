'use client'

import { useEffect, useRef } from 'react'
import { 
  Zap, 
  Shield, 
  Clock, 
  Headphones, 
  Wrench, 
  CheckCircle, 
  TrendingUp, 
  Award,
  Wifi,
  Tv,
  Users,
  DollarSign
} from 'lucide-react'

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
      icon: Zap,
      title: 'Velocidades Excepcionales',
      description: 'Internet de hasta 500+ Mbps con tecnología de fibra óptica de última generación. Conexión simétrica para subida y descarga.',
      color: 'text-primary-red',
      bgColor: 'bg-primary-red/10',
    },
    {
      icon: Shield,
      title: 'Seguridad y Confiabilidad',
      description: 'Cumplimiento total con normativas CRC, protección de datos personales y garantía de servicio estable y seguro.',
      color: 'text-secondary-blue',
      bgColor: 'bg-secondary-blue/10',
    },
    {
      icon: Clock,
      title: 'Instalación Rápida',
      description: 'Instalación profesional en menos de 48 horas después de la solicitud. Sin complicaciones ni esperas prolongadas.',
      color: 'text-primary-red',
      bgColor: 'bg-primary-red/10',
    },
    {
      icon: Headphones,
      title: 'Soporte Técnico 24/7',
      description: 'Atención técnica especializada disponible todos los días del año, a cualquier hora. Resolución rápida de incidencias.',
      color: 'text-secondary-blue',
      bgColor: 'bg-secondary-blue/10',
    },
    {
      icon: Wrench,
      title: 'Mantenimiento Incluido',
      description: 'Servicio técnico y mantenimiento preventivo sin costo adicional. Equipos siempre en óptimas condiciones.',
      color: 'text-primary-red',
      bgColor: 'bg-primary-red/10',
    },
    {
      icon: CheckCircle,
      title: 'Planes Flexibles',
      description: 'Sin contratos forzosos. Planes que se adaptan a tus necesidades reales con opciones de actualización cuando lo requieras.',
      color: 'text-secondary-blue',
      bgColor: 'bg-secondary-blue/10',
    },
    {
      icon: Tv,
      title: 'TV de Alta Calidad',
      description: 'Más de 150 canales HD y Premium. Contenido variado para toda la familia con la mejor calidad de imagen y sonido.',
      color: 'text-primary-red',
      bgColor: 'bg-primary-red/10',
    },
    {
      icon: DollarSign,
      title: 'Precios Competitivos',
      description: 'Planes accesibles sin comprometer la calidad. Transparencia total en precios sin costos ocultos ni sorpresas.',
      color: 'text-secondary-blue',
      bgColor: 'bg-secondary-blue/10',
    },
  ]

  const highlights = [
    {
      icon: Wifi,
      text: 'Tecnología de fibra óptica',
    },
    {
      icon: Users,
      text: 'Atención personalizada',
    },
    {
      icon: Award,
      text: 'Certificaciones de calidad',
    },
    {
      icon: TrendingUp,
      text: 'Crecimiento continuo',
    },
  ]

  return (
    <section ref={sectionRef} className="section-padding bg-gradient-to-br from-neutral-white via-neutral-gray-light to-neutral-white">
      <div className="container-custom">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            ¿Por qué elegir <span className="text-gradient">FITEL</span>?
          </h2>
          <p className="text-xl text-neutral-gray max-w-3xl mx-auto leading-relaxed">
            Somos más que un proveedor de Internet y TV. Somos tu aliado tecnológico, 
            comprometidos con brindarte la mejor experiencia de conectividad y entretenimiento 
            para tu hogar o negocio en Bogotá.
          </p>
        </div>

        {/* Grid de beneficios principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div
                key={index}
                className="p-6 bg-neutral-white rounded-xl border-2 border-neutral-gray-light hover:border-primary-red shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-on-scroll"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-xl ${benefit.bgColor} flex items-center justify-center mb-4`}>
                  <Icon className={`w-7 h-7 ${benefit.color}`} />
                </div>
                <h3 className="text-lg font-bold text-neutral-dark mb-3">{benefit.title}</h3>
                <p className="text-neutral-gray text-sm leading-relaxed">{benefit.description}</p>
              </div>
            )
          })}
        </div>

        {/* Sección de highlights */}
        <div className="mt-16 bg-gradient-to-r from-primary-red/5 via-secondary-blue/5 to-primary-red/5 rounded-2xl p-8 border border-primary-red/20 animate-on-scroll">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8 text-neutral-dark">
              Lo que nos distingue
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {highlights.map((highlight, index) => {
                const Icon = highlight.icon
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center space-y-3"
                  >
                    <div className="w-16 h-16 rounded-full bg-primary-red/10 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-primary-red" />
                    </div>
                    <p className="text-sm font-semibold text-neutral-dark">{highlight.text}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
