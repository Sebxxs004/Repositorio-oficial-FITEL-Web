'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Phone, Mail, MessageCircle, MapPin, ArrowRight } from 'lucide-react'
import { FITEL_PHONE_DISPLAY, FITEL_PHONE_NUMBER, FITEL_EMAIL } from '@/config/constants'

export interface ContactData {
  phone: string
  phoneDisplay: string
  email: string
  whatsapp: string
}

interface ContactPreviewProps {
  contact?: ContactData
}

export function ContactPreview({ contact }: ContactPreviewProps) {
  const sectionRef = useRef<HTMLElement>(null)

  const data: ContactData = contact ?? {
    phone: FITEL_PHONE_NUMBER,
    phoneDisplay: FITEL_PHONE_DISPLAY,
    email: FITEL_EMAIL,
    whatsapp: FITEL_PHONE_NUMBER,
  }

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
      value: data.phoneDisplay,
      link: `tel:+${data.phone}`,
      description: 'Llámanos de lunes a sábado',
      color: 'text-primary-red',
      bgColor: 'bg-primary-red/10',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      value: 'Escribir por WhatsApp',
      link: `https://wa.me/${data.whatsapp}`,
      description: 'Atención inmediata',
      color: 'text-secondary-blue',
      bgColor: 'bg-secondary-blue/10',
    },
    {
      icon: Mail,
      title: 'Email',
      value: data.email,
      link: `mailto:${data.email}`,
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
    <section ref={sectionRef} id="contacto-preview" className="section-padding bg-neutral-white">
      <div className="container-custom">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-gradient">Contáctanos</span>
          </h2>
          <p className="text-lg text-neutral-gray max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Elige el canal de comunicación que prefieras o envíanos un mensaje.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactMethods.map((method, index) => {
            const Icon = method.icon
            const isLink = method.link !== '#'
            
            if (isLink) {
              return (
                <a
                  key={index}
                  href={method.link}
                  target={method.link.startsWith('http') ? '_blank' : undefined}
                  rel={method.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="p-6 rounded-xl border-2 border-neutral-gray-light hover:border-primary-red transition-all duration-300 transform hover:-translate-y-2 cursor-pointer animate-on-scroll"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-16 h-16 rounded-full ${method.bgColor} flex items-center justify-center mb-4`}>
                    <Icon className={`w-8 h-8 ${method.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-dark mb-2">{method.title}</h3>
                  <p className="text-primary-red font-semibold mb-2">{method.value}</p>
                  <p className="text-neutral-gray text-sm">{method.description}</p>
                </a>
              )
            }
            
            return (
              <div
                key={index}
                className="p-6 rounded-xl border-2 border-neutral-gray-light hover:border-primary-red transition-all duration-300 transform hover:-translate-y-2 cursor-default animate-on-scroll"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 rounded-full ${method.bgColor} flex items-center justify-center mb-4`}>
                  <Icon className={`w-8 h-8 ${method.color}`} />
                </div>
                <h3 className="text-lg font-bold text-neutral-dark mb-2">{method.title}</h3>
                <p className="text-primary-red font-semibold mb-2">{method.value}</p>
                <p className="text-neutral-gray text-sm">{method.description}</p>
              </div>
            )
          })}
        </div>

        <div className="text-center animate-on-scroll">
          <div className="inline-block p-8 rounded-xl bg-gradient-to-r from-primary-red/10 to-secondary-blue/10 border border-primary-red/20">
            <p className="text-neutral-gray mb-6 text-lg">
              ¿Tienes alguna pregunta o necesitas más información? Completa nuestro formulario de contacto y te responderemos a la brevedad.
            </p>
            <Link 
              href="/contacto"
              className="inline-flex items-center space-x-2 btn-primary px-8 py-4 text-lg font-semibold"
            >
              <span>Ir al Formulario de Contacto</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
