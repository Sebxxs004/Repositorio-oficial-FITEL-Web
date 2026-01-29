'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FileText, Send, Loader2, AlertCircle, CheckCircle, Info, Download } from 'lucide-react'
import { PQRService } from '@/services/pqr/PQRService'
import type { PQRConstancy } from '@/types/pqr.types'
import { FITEL_PHONE_DISPLAY } from '@/config/constants'

// Opciones de tipo de PQR
export const PQR_TYPE_OPTIONS = [
  { value: 'PETICION', label: 'Petición' },
  { value: 'QUEJA', label: 'Queja' },
  { value: 'RECURSO', label: 'Recurso' },
] as const

// Opciones de tipo de documento
export const DOCUMENT_TYPE_OPTIONS = [
  { value: 'CC', label: 'Cédula de Ciudadanía (CC)' },
  { value: 'NIT', label: 'NIT' },
  { value: 'CE', label: 'Cédula de Extranjería (CE)' },
  { value: 'PASAPORTE', label: 'Pasaporte' },
  { value: 'OTRO', label: 'Otro' },
] as const

// Opciones de tipo de recurso (solo si es RECURSO)
export const RESOURCE_TYPE_OPTIONS = [
  { value: 'REPOSICION', label: 'Reposición' },
  { value: 'APELACION', label: 'Apelación' },
] as const

// Esquema de validación con Zod
const pqrFormSchema = z.object({
  type: z.enum(PQR_TYPE_OPTIONS.map(opt => opt.value) as [string, ...string[]], {
    errorMap: () => ({ message: 'Por favor selecciona un tipo de PQR' }),
  }),
  customerName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  customerEmail: z.string().email('Ingresa un email válido'),
  customerPhone: z.string().min(10, 'Ingresa un teléfono válido'),
  customerDocumentType: z.enum(DOCUMENT_TYPE_OPTIONS.map(opt => opt.value) as [string, ...string[]], {
    errorMap: () => ({ message: 'Por favor selecciona un tipo de documento' }),
  }),
  customerDocumentNumber: z.string().min(5, 'Ingresa tu número de documento'),
  customerAddress: z.string().min(10, 'Ingresa tu dirección completa').optional(),
  subject: z.string().min(5, 'El asunto debe tener al menos 5 caracteres'),
  description: z.string().min(20, 'La descripción debe tener al menos 20 caracteres'),
  resourceType: z.string().optional(),
  expectedResolution: z.string().optional(),
}).refine((data) => {
  // Si es RECURSO, el tipo de recurso es requerido
  if (data.type === 'RECURSO' && !data.resourceType) {
    return false
  }
  return true
}, {
  message: 'El tipo de recurso es requerido cuando el tipo de PQR es Recurso',
  path: ['resourceType'],
})

type PQRFormData = z.infer<typeof pqrFormSchema>

export function PQRsModule() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [constancy, setConstancy] = useState<PQRConstancy | null>(null)
  const [createdCUN, setCreatedCUN] = useState<string | null>(null)

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
    setConstancy(null)
    setCreatedCUN(null)

    try {
      const response = await PQRService.createPQR({
        type: data.type,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        customerDocumentType: data.customerDocumentType,
        customerDocumentNumber: data.customerDocumentNumber,
        customerAddress: data.customerAddress,
        subject: data.subject,
        description: data.description,
        resourceType: data.resourceType,
        expectedResolution: data.expectedResolution,
      })

      if (response.success && response.data) {
        setSubmitSuccess(true)
        setCreatedCUN(response.data.cun)
        if (response.constancy) {
          setConstancy(response.constancy)
        }
        reset()
      } else {
        setSubmitError(response.error || 'Ocurrió un error al enviar tu PQR. Por favor intenta de nuevo.')
      }
    } catch (error) {
      console.error('Error creating PQR:', error)
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

              {/* Nombre Completo */}
              <div>
                <label htmlFor="customerName" className="block text-sm font-semibold text-neutral-dark mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  id="customerName"
                  {...register('customerName')}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.customerName
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-neutral-gray-light focus:ring-primary-red focus:border-transparent'
                  }`}
                  placeholder="Ej: Juan Pérez"
                />
                {errors.customerName && (
                  <p className="mt-1 text-sm text-red-600">{errors.customerName.message}</p>
                )}
              </div>

              {/* Email y Teléfono */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="customerEmail" className="block text-sm font-semibold text-neutral-dark mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="customerEmail"
                    {...register('customerEmail')}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors.customerEmail
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-neutral-gray-light focus:ring-primary-red focus:border-transparent'
                    }`}
                    placeholder="ejemplo@correo.com"
                  />
                  {errors.customerEmail && (
                    <p className="mt-1 text-sm text-red-600">{errors.customerEmail.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="customerPhone" className="block text-sm font-semibold text-neutral-dark mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    id="customerPhone"
                    {...register('customerPhone')}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors.customerPhone
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-neutral-gray-light focus:ring-primary-red focus:border-transparent'
                    }`}
                    placeholder={FITEL_PHONE_DISPLAY}
                  />
                  {errors.customerPhone && (
                    <p className="mt-1 text-sm text-red-600">{errors.customerPhone.message}</p>
                  )}
                </div>
              </div>

              {/* Tipo y Número de Documento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="customerDocumentType" className="block text-sm font-semibold text-neutral-dark mb-2">
                    Tipo de Documento *
                  </label>
                  <select
                    id="customerDocumentType"
                    {...register('customerDocumentType')}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white ${
                      errors.customerDocumentType
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-neutral-gray-light focus:ring-primary-red focus:border-transparent'
                    }`}
                  >
                    <option value="">Selecciona el tipo...</option>
                    {DOCUMENT_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.customerDocumentType && (
                    <p className="mt-1 text-sm text-red-600">{errors.customerDocumentType.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="customerDocumentNumber" className="block text-sm font-semibold text-neutral-dark mb-2">
                    Número de Documento *
                  </label>
                  <input
                    type="text"
                    id="customerDocumentNumber"
                    {...register('customerDocumentNumber')}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors.customerDocumentNumber
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-neutral-gray-light focus:ring-primary-red focus:border-transparent'
                    }`}
                    placeholder="1234567890"
                  />
                  {errors.customerDocumentNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.customerDocumentNumber.message}</p>
                  )}
                </div>
              </div>

              {/* Dirección (Opcional) */}
              <div>
                <label htmlFor="customerAddress" className="block text-sm font-semibold text-neutral-dark mb-2">
                  Dirección <span className="text-neutral-gray font-normal">(Opcional)</span>
                </label>
                <input
                  type="text"
                  id="customerAddress"
                  {...register('customerAddress')}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.customerAddress
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-neutral-gray-light focus:ring-primary-red focus:border-transparent'
                  }`}
                  placeholder="Dirección completa (opcional)"
                />
                {errors.customerAddress && (
                  <p className="mt-1 text-sm text-red-600">{errors.customerAddress.message}</p>
                )}
              </div>

              {/* Asunto */}
              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-neutral-dark mb-2">
                  Asunto *
                </label>
                <input
                  type="text"
                  id="subject"
                  {...register('subject')}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.subject
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-neutral-gray-light focus:ring-primary-red focus:border-transparent'
                  }`}
                  placeholder="Resumen breve de tu solicitud"
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                )}
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

              {/* Tipo de Recurso (solo si es RECURSO) */}
              {selectedType === 'RECURSO' && (
                <div>
                  <label htmlFor="resourceType" className="block text-sm font-semibold text-neutral-dark mb-2">
                    Tipo de Recurso *
                  </label>
                  <select
                    id="resourceType"
                    {...register('resourceType')}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white ${
                      errors.resourceType
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-neutral-gray-light focus:ring-primary-red focus:border-transparent'
                    }`}
                  >
                    <option value="">Selecciona el tipo de recurso...</option>
                    {RESOURCE_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.resourceType && (
                    <p className="mt-1 text-sm text-red-600">{errors.resourceType.message}</p>
                  )}
                </div>
              )}

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
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start space-x-3 mb-4">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-green-800 font-semibold mb-1">PQR enviada correctamente</p>
                      <p className="text-green-700 text-sm">
                        Hemos recibido tu PQR. Te responderemos en un plazo máximo de 15 días hábiles.
                      </p>
                    </div>
                  </div>
                  {createdCUN && (
                    <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
                      <p className="text-sm font-semibold text-neutral-dark mb-1">Número de Radicación (CUN):</p>
                      <p className="text-lg font-bold text-primary-red">{createdCUN}</p>
                      <p className="text-xs text-neutral-gray mt-2">
                        Guarda este número para consultar el estado de tu PQR
                      </p>
                    </div>
                  )}
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

        {/* Constancia de Radicación */}
        {constancy && (
          <div className="max-w-4xl mx-auto mb-16 animate-on-scroll">
            <div className="bg-gradient-to-br from-primary-red/5 to-secondary-blue/5 rounded-xl shadow-lg p-8 border-2 border-primary-red/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-neutral-dark flex items-center space-x-2">
                  <FileText className="w-7 h-7 text-primary-red" />
                  <span>Constancia de Radicación</span>
                </h3>
                <button
                  onClick={() => window.print()}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-red text-white rounded-lg hover:bg-primary-red/90 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar</span>
                </button>
              </div>
              
              <div className="bg-white rounded-lg p-6 space-y-4">
                <div className="border-b border-neutral-gray-light pb-4">
                  <p className="text-sm text-neutral-gray mb-1">Código Único Numérico (CUN)</p>
                  <p className="text-2xl font-bold text-primary-red">{constancy.cun}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neutral-gray mb-1">Nombre del Solicitante</p>
                    <p className="font-semibold text-neutral-dark">{constancy.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-gray mb-1">Tipo de PQR</p>
                    <p className="font-semibold text-neutral-dark">{constancy.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-gray mb-1">Asunto</p>
                    <p className="font-semibold text-neutral-dark">{constancy.subject}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-gray mb-1">Fecha de Radicación</p>
                    <p className="font-semibold text-neutral-dark">
                      {new Date(constancy.radicationDate).toLocaleDateString('es-CO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-gray mb-1">Fecha Máxima de Respuesta</p>
                    <p className="font-semibold text-primary-red">
                      {new Date(constancy.maxResponseDate).toLocaleDateString('es-CO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-semibold text-yellow-800 mb-2">Silencio Administrativo Positivo</p>
                  <p className="text-sm text-yellow-700">{constancy.silenceAdministrativeText}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Información adicional */}
        {!constancy && (
          <div className="max-w-4xl mx-auto animate-on-scroll">
            <div className="bg-neutral-white rounded-xl shadow-lg p-8 border border-neutral-gray-light">
              <h3 className="text-xl font-bold text-neutral-dark mb-4 flex items-center space-x-2">
                <FileText className="w-6 h-6 text-primary-red" />
                <span>Información Importante</span>
              </h3>
              <div className="space-y-3 text-neutral-gray">
                <p>
                  • Todas las PQRs son registradas y tienen un número de seguimiento único (CUN).
                </p>
                <p>
                  • Te enviaremos un acuse de recibo por email con el número de tu PQR.
                </p>
                <p>
                  • Puedes consultar el estado de tu PQR en cualquier momento usando tu CUN o número de documento.
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
        )}
      </div>
    </section>
  )
}
