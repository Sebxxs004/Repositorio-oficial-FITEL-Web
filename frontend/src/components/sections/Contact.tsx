'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Phone, Mail, MessageCircle, MapPin, Clock, Send, Loader2, Copy, Check } from 'lucide-react'
import { ContactForm } from '@/types'
import { FITEL_PHONE_NUMBER, FITEL_PHONE_DISPLAY, FITEL_EMAIL, FITEL_WHATSAPP_URL, FITEL_PHONE_TEL } from '@/config/constants'

// Opciones de asunto para el formulario de contacto
export const CONTACT_SUBJECT_OPTIONS = [
  { value: 'plan-informacion', label: 'Información sobre Planes' },
  { value: 'plan-contratacion', label: 'Contratar un Plan' },
  { value: 'cobertura', label: 'Consulta de Cobertura' },
  { value: 'soporte-tecnico', label: 'Soporte Técnico' },
  { value: 'facturacion', label: 'Facturación y Pagos' },
  { value: 'cambio-plan', label: 'Cambio o Actualización de Plan' },
  { value: 'servicios-adicionales', label: 'Servicios Adicionales' },
  { value: 'promociones', label: 'Promociones y Ofertas' },
  { value: 'otro', label: 'Otro' },
] as const

// Esquema de validación con Zod
const contactFormSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Ingresa un email válido'),
  phone: z.string().min(10, 'Ingresa un teléfono válido'),
  subject: z.enum(CONTACT_SUBJECT_OPTIONS.map(opt => opt.value) as [string, ...string[]], {
    errorMap: () => ({ message: 'Por favor selecciona un asunto' }),
  }),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
})

type ContactFormData = z.infer<typeof contactFormSchema>

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [phoneCopied, setPhoneCopied] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  })

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

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      // Enviar los datos al backend
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
      const response = await fetch(`${apiUrl}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          subject: data.subject,
          message: data.message,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Error al enviar el mensaje')
      }

      const result = await response.json()
      
      // Obtener el label del asunto seleccionado
      const selectedSubject = CONTACT_SUBJECT_OPTIONS.find(opt => opt.value === data.subject)
      const subjectLabel = selectedSubject ? selectedSubject.label : data.subject
      
      // También abrir WhatsApp con el mensaje prellenado (opcional)
      const whatsappMessage = `Hola, mi nombre es ${data.name}.\n\nAsunto: ${subjectLabel}\n\nMensaje: ${data.message}\n\nContacto: ${data.email} - ${data.phone}`
      const whatsappUrl = `${FITEL_WHATSAPP_URL}?text=${encodeURIComponent(whatsappMessage)}`
      window.open(whatsappUrl, '_blank')
      
      setSubmitSuccess(true)
      reset()
      
      // Ocultar mensaje de éxito después de 5 segundos
      setTimeout(() => setSubmitSuccess(false), 5000)
    } catch (error) {
      console.error('Error enviando formulario de contacto:', error)
      setSubmitError(error instanceof Error ? error.message : 'Ocurrió un error al enviar el mensaje. Por favor intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCall = () => {
    window.location.href = FITEL_PHONE_TEL
  }

  const handleWhatsApp = () => {
    window.open(FITEL_WHATSAPP_URL, '_blank')
  }

  const handleCopyPhone = async () => {
    const phoneNumber = `+${FITEL_PHONE_NUMBER}`
    try {
      await navigator.clipboard.writeText(phoneNumber)
      setPhoneCopied(true)
      setTimeout(() => {
        setPhoneCopied(false)
      }, 2000)
    } catch (error) {
      console.error('Error al copiar el teléfono:', error)
      // Fallback para navegadores que no soportan clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = phoneNumber
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        setPhoneCopied(true)
        setTimeout(() => {
          setPhoneCopied(false)
        }, 2000)
      } catch (err) {
        console.error('Error al copiar:', err)
      }
      document.body.removeChild(textArea)
    }
  }

  const contactMethods = [
    {
      icon: Phone,
      title: 'Teléfono',
      value: FITEL_PHONE_DISPLAY,
      link: FITEL_PHONE_TEL,
      description: 'Llámanos de lunes a domingo',
      color: 'text-primary-red',
      bgColor: 'bg-primary-red/10',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      value: 'Escribir por WhatsApp',
      link: FITEL_WHATSAPP_URL,
      description: 'Atención inmediata',
      color: 'text-secondary-blue',
      bgColor: 'bg-secondary-blue/10',
    },
    {
      icon: Mail,
      title: 'Email',
      value: FITEL_EMAIL,
      link: `mailto:${FITEL_EMAIL}`,
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
    <section ref={sectionRef} id="contacto" className="section-padding bg-transparent">
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
            const isPhone = method.title === 'Teléfono'
            
            // Para el teléfono, usar un div con onClick en lugar de un enlace
            if (isPhone) {
              return (
                <div
                  key={`phone-${index}`}
                  onClick={handleCopyPhone}
                  className="p-6 rounded-xl border-2 border-neutral-gray-light hover:border-primary-red transition-all duration-300 transform hover:-translate-y-2 cursor-pointer animate-on-scroll"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-16 h-16 rounded-full ${method.bgColor} flex items-center justify-center mb-4`}>
                    <Icon className={`w-8 h-8 ${method.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-dark mb-2">{method.title}</h3>
                  <p className="text-primary-red font-semibold mb-2">{method.value}</p>
                  <div className="flex items-center space-x-2 text-secondary-blue hover:text-secondary-blue-dark transition-colors mt-3 min-h-[20px]">
                    {phoneCopied ? (
                      <span className="flex items-center space-x-2">
                        <Check className="w-4 h-4" />
                        <span className="text-sm font-medium">¡Copiado!</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-2">
                        <Copy className="w-4 h-4" />
                        <span className="text-sm font-medium">Dar click aquí para copiar el teléfono</span>
                      </span>
                    )}
                  </div>
                  <p className="text-neutral-gray text-sm mt-2">{method.description}</p>
                </div>
              )
            }
            
            // Para los demás métodos, usar renderizado condicional explícito
            if (isLink) {
              return (
                <a
                  key={`method-${index}`}
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
                key={`method-${index}`}
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

        {/* Formulario de Contacto */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-neutral-white rounded-xl shadow-lg p-8 border border-neutral-gray-light animate-on-scroll">
            <h3 className="text-2xl font-bold text-neutral-dark mb-6 text-center">
              <span className="text-gradient">Envíanos un Mensaje</span>
            </h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Nombre */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-neutral-dark mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name')}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.name
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-neutral-gray-light focus:ring-primary-red focus:border-transparent'
                  }`}
                  placeholder="Ej: Juan Pérez"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Email y Teléfono */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-neutral-dark mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors.email
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-neutral-gray-light focus:ring-primary-red focus:border-transparent'
                    }`}
                    placeholder="ejemplo@correo.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-neutral-dark mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    {...register('phone')}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors.phone
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-neutral-gray-light focus:ring-primary-red focus:border-transparent'
                    }`}
                    placeholder={FITEL_PHONE_DISPLAY}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Asunto */}
              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-neutral-dark mb-2">
                  Asunto * <span className="text-neutral-gray font-normal text-xs">(Selecciona el motivo de tu consulta)</span>
                </label>
                <select
                  id="subject"
                  {...register('subject')}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white ${
                    errors.subject
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-neutral-gray-light focus:ring-primary-red focus:border-transparent'
                  }`}
                >
                  <option value="">Selecciona un asunto...</option>
                  {CONTACT_SUBJECT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                )}
              </div>

              {/* Mensaje */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-neutral-dark mb-2">
                  Mensaje *
                </label>
                <textarea
                  id="message"
                  {...register('message')}
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors resize-none ${
                    errors.message
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-neutral-gray-light focus:ring-primary-red focus:border-transparent'
                  }`}
                  placeholder="Escribe aquí tu mensaje, consulta o razón de contacto..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                )}
              </div>

              {/* Mensajes de éxito/error */}
              {submitSuccess && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm">
                    ✓ Mensaje enviado correctamente. Hemos recibido tu consulta y nos pondremos en contacto pronto. También puedes continuar la conversación por WhatsApp.
                  </p>
                </div>
              )}

              {submitError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{submitError}</p>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center space-x-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Enviar Mensaje</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleCall}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-primary-red hover:bg-primary-red-dark text-white rounded-lg font-medium transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span>Llamar</span>
                </button>
              </div>
            </form>
          </div>
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
