'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FileText, Send, Loader2, AlertCircle, CheckCircle, Info } from 'lucide-react'

// Opciones de tipo de PQR
export const PQR_TYPE_OPTIONS = [
  { value: 'peticion', label: 'Petición' },
  { value: 'queja', label: 'Queja' },
  { value: 'recurso', label: 'Recurso' },
] as const

// Opciones de categoría
export const PQR_CATEGORY_OPTIONS = [
  { value: 'servicio', label: 'Servicio Técnico' },
  { value: 'facturacion', label: 'Facturación' },
  { value: 'atencion', label: 'Atención al Cliente' },
  { value: 'cobertura', label: 'Cobertura' },
  { value: 'instalacion', label: 'Instalación' },
  { value: 'cancelacion', label: 'Cancelación de Servicio' },
  { value: 'otro', label: 'Otro' },
] as const

// Esquema de validación con Zod
const pqrFormSchema = z.object({
  type: z.enum(PQR_TYPE_OPTIONS.map(opt => opt.value) as [string, ...string[]], {
    errorMap: () => ({ message: 'Por favor selecciona un tipo de PQR' }),
  }),
  category: z.enum(PQR_CATEGORY_OPTIONS.map(opt => opt.value) as [string, ...string[]], {
    errorMap: () => ({ message: 'Por favor selecciona una categoría' }),
  }),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Ingresa un email válido'),
  phone: z.string().min(10, 'Ingresa un teléfono válido'),
  documentNumber: z.string().min(5, 'Ingresa tu número de documento'),
  address: z.string().min(10, 'Ingresa tu dirección completa'),
  description: z.string().min(20, 'La descripción debe tener al menos 20 caracteres'),
  expectedResolution: z.string().optional(),
})

type PQRFormData = z.infer<typeof pqrFormSchema>

export function PQRsModule() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<PQRFormData>({
    resolver: zodResolver(pqrFormSchema),
  })

  const selectedType = watch('type')

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

  const onSubmit = async (data: PQRFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      // Aquí se enviará al backend cuando esté listo
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      setSubmitSuccess(true)
      reset()
      
      // Ocultar mensaje de éxito después de 5 segundos
      setTimeout(() => setSubmitSuccess(false), 5000)
    } catch (error) {
      setSubmitError('Ocurrió un error al enviar tu PQR. Por favor intenta de nuevo o contáctanos directamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section ref={sectionRef} id="pqrs" className="section-padding bg-transparent">
      <div className="container-custom">
        <div className="text-center mb-16 animate-on-scroll">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-gradient">PQRs</span>
          </h1>
          <p className="text-lg text-neutral-gray max-w-3xl mx-auto mb-6">
            Presenta tus <strong>Peticiones, Quejas o Recursos</strong>. Estamos comprometidos con la atención y resolución oportuna de tus solicitudes.
          </p>
          
          {/* Información sobre PQRs */}
          <div className="max-w-4xl mx-auto mt-8 p-6 bg-gradient-to-r from-primary-red/10 to-secondary-blue/10 border border-primary-red/20 rounded-xl">
            <div className="flex items-start space-x-4">
              <Info className="w-6 h-6 text-secondary-blue flex-shrink-0 mt-1" />
              <div className="text-left">
                <h3 className="text-lg font-bold text-neutral-dark mb-3">¿Qué es una PQR?</h3>
                <div className="space-y-2 text-sm text-neutral-gray">
                  <p><strong>Petición:</strong> Solicitud de información, documentos o servicios.</p>
                  <p><strong>Queja:</strong> Manifestación de insatisfacción con el servicio recibido.</p>
                  <p><strong>Recurso:</strong> Impugnación de decisiones o actuaciones de la empresa.</p>
                </div>
                <p className="text-xs text-neutral-gray mt-4">
                  De acuerdo con la normativa vigente, nos comprometemos a responder tu PQR en un plazo máximo de 15 días hábiles.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de PQRs */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-neutral-white rounded-xl shadow-lg p-8 border border-neutral-gray-light animate-on-scroll">
            <h2 className="text-2xl font-bold text-neutral-dark mb-6 text-center">
              <span className="text-gradient">Formulario de PQR</span>
            </h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Tipo de PQR */}
              <div>
                <label htmlFor="type" className="block text-sm font-semibold text-neutral-dark mb-2">
                  Tipo de PQR *
                </label>
                <select
                  id="type"
                  {...register('type')}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white ${
                    errors.type
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-neutral-gray-light focus:ring-primary-red focus:border-transparent'
                  }`}
                >
                  <option value="">Selecciona el tipo de PQR...</option>
                  {PQR_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                )}
              </div>

              {/* Categoría */}
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-neutral-dark mb-2">
                  Categoría *
                </label>
                <select
                  id="category"
                  {...register('category')}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white ${
                    errors.category
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-neutral-gray-light focus:ring-primary-red focus:border-transparent'
                  }`}
                >
                  <option value="">Selecciona una categoría...</option>
                  {PQR_CATEGORY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

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
                    placeholder="+57 300 123 4567"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Número de Documento y Dirección */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="documentNumber" className="block text-sm font-semibold text-neutral-dark mb-2">
                    Número de Documento *
                  </label>
                  <input
                    type="text"
                    id="documentNumber"
                    {...register('documentNumber')}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors.documentNumber
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-neutral-gray-light focus:ring-primary-red focus:border-transparent'
                    }`}
                    placeholder="CC, NIT, etc."
                  />
                  {errors.documentNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.documentNumber.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-semibold text-neutral-dark mb-2">
                    Dirección *
                  </label>
                  <input
                    type="text"
                    id="address"
                    {...register('address')}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors.address
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-neutral-gray-light focus:ring-primary-red focus:border-transparent'
                    }`}
                    placeholder="Dirección completa"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                  )}
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-neutral-dark mb-2">
                  Descripción Detallada *
                </label>
                <textarea
                  id="description"
                  {...register('description')}
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors resize-none ${
                    errors.description
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-neutral-gray-light focus:ring-primary-red focus:border-transparent'
                  }`}
                  placeholder="Describe detalladamente tu petición, queja o recurso..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* Resolución Esperada (opcional) */}
              <div>
                <label htmlFor="expectedResolution" className="block text-sm font-semibold text-neutral-dark mb-2">
                  Resolución Esperada <span className="text-neutral-gray font-normal">(Opcional)</span>
                </label>
                <textarea
                  id="expectedResolution"
                  {...register('expectedResolution')}
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent resize-none"
                  placeholder="¿Cómo te gustaría que resolvamos tu solicitud? (Opcional)"
                />
              </div>

              {/* Mensajes de éxito/error */}
              {submitSuccess && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-800 font-semibold mb-1">PQR enviada correctamente</p>
                    <p className="text-green-700 text-sm">
                      Hemos recibido tu PQR. Te responderemos en un plazo máximo de 15 días hábiles. 
                      Recibirás un número de seguimiento por email.
                    </p>
                  </div>
                </div>
              )}

              {submitError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-800 text-sm">{submitError}</p>
                </div>
              )}

              {/* Botón de envío */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Enviando PQR...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Enviar PQR</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Información adicional */}
        <div className="max-w-4xl mx-auto animate-on-scroll">
          <div className="bg-neutral-white rounded-xl shadow-lg p-8 border border-neutral-gray-light">
            <h3 className="text-xl font-bold text-neutral-dark mb-4 flex items-center space-x-2">
              <FileText className="w-6 h-6 text-primary-red" />
              <span>Información Importante</span>
            </h3>
            <div className="space-y-3 text-neutral-gray">
              <p>
                • Todas las PQRs son registradas y tienen un número de seguimiento único.
              </p>
              <p>
                • Te enviaremos un acuse de recibo por email con el número de tu PQR.
              </p>
              <p>
                • Puedes consultar el estado de tu PQR en cualquier momento.
              </p>
              <p>
                • Nos comprometemos a responder en un plazo máximo de 15 días hábiles según la normativa vigente.
              </p>
              <p>
                • Para consultas urgentes, puedes contactarnos directamente por WhatsApp o teléfono.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
