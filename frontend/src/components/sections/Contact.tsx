'use client'

import { useEffect, useRef } from 'react'
import { Phone, Mail, MessageCircle, MapPin, Clock } from 'lucide-react'

export function Contact() {
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

  const contactMethods = [
    {
      icon: Phone,
      title: 'Teléfono',
      value: '+57 300 123 4567',
      link: 'tel:+573001234567',
      description: 'Llámanos de lunes a domingo',
      color: 'text-primary-red',
      bgColor: 'bg-primary-red/10',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      value: 'Escribir por WhatsApp',
      link: 'https://wa.me/573001234567',
      description: 'Atención inmediata',
      color: 'text-secondary-blue',
      bgColor: 'bg-secondary-blue/10',
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'contacto@fitel.com.co',
      link: 'mailto:contacto@fitel.com.co',
      description: 'Respuesta en 24 horas',
      color: 'text-primary-red',
      bgColor: 'bg-primary-red/10',
    },
    {
      icon: MapPin,
      title: 'Oficina',
      value: 'Bogotá, Colombia',
      link: '#',
      description: 'Visítanos en nuestras oficinas',
      color: 'text-secondary-blue',
      bgColor: 'bg-secondary-blue/10',
    },
  ]

  return (
    <section ref={sectionRef} id="contacto" className="section-padding bg-neutral-white">
      <div className="container-custom">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-gradient">Contáctanos</span>
          </h2>
          <p className="text-lg text-neutral-gray max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Elige el canal de comunicación que prefieras.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactMethods.map((method, index) => {
            const Icon = method.icon
            const isLink = method.link !== '#'
            const Component = isLink ? 'a' : 'div'
            
            return (
              <Component
                key={index}
                href={isLink ? method.link : undefined}
                target={method.link.startsWith('http') ? '_blank' : undefined}
                rel={method.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={`p-6 rounded-xl border-2 border-neutral-gray-light hover:border-primary-red transition-all duration-300 transform hover:-translate-y-2 cursor-pointer animate-on-scroll ${
                  !isLink ? 'cursor-default' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 rounded-full ${method.bgColor} flex items-center justify-center mb-4`}>
                  <Icon className={`w-8 h-8 ${method.color}`} />
                </div>
                <h3 className="text-lg font-bold text-neutral-dark mb-2">{method.title}</h3>
                <p className="text-primary-red font-semibold mb-2">{method.value}</p>
                <p className="text-neutral-gray text-sm">{method.description}</p>
              </Component>
            )
          })}
        </div>

        {/* Horarios de Atención */}
        <div className="max-w-3xl mx-auto p-8 rounded-xl bg-gradient-to-r from-primary-red/10 to-secondary-blue/10 border border-primary-red/20 animate-on-scroll">
          <div className="flex items-start space-x-4">
            <Clock className="w-8 h-8 text-primary-red flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-2xl font-bold text-neutral-dark mb-4">Horarios de Atención</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-neutral-dark mb-2">Atención al Cliente</p>
                  <p className="text-neutral-gray">Lunes a Viernes: 8:00 AM - 8:00 PM</p>
                  <p className="text-neutral-gray">Sábados: 9:00 AM - 6:00 PM</p>
                  <p className="text-neutral-gray">Domingos: 10:00 AM - 4:00 PM</p>
                </div>
                <div>
                  <p className="font-semibold text-neutral-dark mb-2">Soporte Técnico</p>
                  <p className="text-neutral-gray">24 horas, 7 días a la semana</p>
                  <p className="text-primary-red font-semibold">Emergencias: Línea directa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
