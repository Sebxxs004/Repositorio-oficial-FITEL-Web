'use client'

import { useEffect, useRef } from 'react'
import { Shield, Building2, Award, FileCheck, TrendingUp } from 'lucide-react'

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

  const credentials = [
    {
      icon: Shield,
      title: 'Cumplimiento Normativo',
      description: 'Registrados y autorizados por la CRC (Comisión de Regulación de Comunicaciones) y cumplimos con todas las normativas vigentes del sector de telecomunicaciones en Colombia.',
      color: 'text-primary-red',
      bgColor: 'bg-primary-red/5',
      borderColor: 'border-primary-red/20',
    },
    {
      icon: FileCheck,
      title: 'Certificaciones y Garantías',
      description: 'Contamos con certificaciones de calidad y garantizamos la protección de datos personales según la Ley 1581 de 2012. Todos nuestros procesos están documentados y auditados.',
      color: 'text-secondary-blue',
      bgColor: 'bg-secondary-blue/5',
      borderColor: 'border-secondary-blue/20',
    },
    {
      icon: Building2,
      title: 'Empresa Establecida',
      description: 'Somos una empresa legalmente constituida en Colombia, con presencia sólida en Bogotá y comprometida con el crecimiento sostenible del sector de telecomunicaciones.',
      color: 'text-primary-red',
      bgColor: 'bg-primary-red/5',
      borderColor: 'border-primary-red/20',
    },
    {
      icon: Award,
      title: 'Excelencia Operacional',
      description: 'Implementamos estándares internacionales de calidad en nuestros servicios, con procesos optimizados y personal técnico altamente capacitado y certificado.',
      color: 'text-secondary-blue',
      bgColor: 'bg-secondary-blue/5',
      borderColor: 'border-secondary-blue/20',
    },
  ]

  return (
    <section ref={sectionRef} className="section-padding bg-neutral-gray-light">
      <div className="container-custom">
        {/* Header más formal */}
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-neutral-dark">
            Sobre <span className="text-primary-red">FITEL</span>
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-neutral-dark font-medium mb-4 leading-relaxed">
              Empresa de telecomunicaciones legalmente constituida, especializada en servicios de Internet y Televisión de alta calidad para el mercado residencial y empresarial en Bogotá.
            </p>
            <p className="text-lg text-neutral-gray leading-relaxed">
              Operamos bajo estrictos estándares regulatorios, garantizando transparencia, seguridad y cumplimiento de todas las normativas vigentes en el sector de telecomunicaciones colombiano.
            </p>
          </div>
        </div>

        {/* Credenciales y Certificaciones */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-neutral-dark mb-8 text-center animate-on-scroll">
            Credenciales y Certificaciones
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {credentials.map((credential, index) => {
              const Icon = credential.icon
              return (
                <div
                  key={index}
                  className={`p-8 bg-neutral-white border-l-4 ${credential.borderColor} rounded-lg shadow-sm hover:shadow-md transition-all duration-300 animate-on-scroll`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-14 h-14 rounded-lg ${credential.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-7 h-7 ${credential.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold mb-3 text-neutral-dark">{credential.title}</h4>
                      <p className="text-neutral-gray leading-relaxed">{credential.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Misión y Visión más formales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-neutral-white p-8 rounded-lg border border-neutral-gray-light shadow-sm animate-on-scroll">
            <h3 className="text-2xl font-bold mb-4 text-neutral-dark flex items-center space-x-2">
              <Building2 className="w-6 h-6 text-primary-red" />
              <span>Nuestra Misión</span>
            </h3>
            <p className="text-neutral-gray leading-relaxed">
              Proporcionar servicios de telecomunicaciones de excelencia técnica y operacional, 
              cumpliendo estrictamente con las normativas regulatorias colombianas. Nos comprometemos 
              a ofrecer soluciones confiables, seguras y de alta calidad que satisfagan las necesidades 
              de comunicación de nuestros clientes en Bogotá.
            </p>
          </div>

          <div className="bg-neutral-white p-8 rounded-lg border border-neutral-gray-light shadow-sm animate-on-scroll">
            <h3 className="text-2xl font-bold mb-4 text-neutral-dark flex items-center space-x-2">
              <TrendingUp className="w-6 h-6 text-secondary-blue" />
              <span>Nuestro Compromiso</span>
            </h3>
            <p className="text-neutral-gray leading-relaxed">
              Mantener los más altos estándares de calidad, transparencia y cumplimiento legal. 
              Garantizamos la protección de datos personales, la continuidad del servicio y 
              la satisfacción de nuestros clientes mediante procesos documentados, personal 
              certificado y tecnología de vanguardia.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
