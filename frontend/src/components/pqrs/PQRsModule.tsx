'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { FileText, Send, Loader2, AlertCircle, CheckCircle, Info, Download, Upload, X, File as FileIcon, ShieldCheck, Copy, Check } from 'lucide-react'
import { PQRService } from '@/services/pqr/PQRService'
import type { PQRConstancy, PQRType } from '@/types/pqr.types'
import { FITEL_PHONE_DISPLAY } from '@/config/constants'

// Opciones de tipo de PQR
export const PQR_TYPE_OPTIONS = [
  { value: 'PETICION', label: 'Petición' },
  { value: 'QUEJA', label: 'Queja' },
  { value: 'RECLAMO', label: 'Reclamo' },
  { value: 'SUGERENCIA', label: 'Sugerencia' },
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
  customerName: z.string().optional(),
  customerEmail: z.string().optional(),
  customerPhone: z.string().optional(),
  customerDocumentType: z.string().optional(),
  customerDocumentNumber: z.string().optional(),
  customerAddress: z.string().optional(),
  subject: z.string().min(5, 'El asunto debe tener al menos 5 caracteres'),
  description: z.string().min(20, 'La descripción debe tener al menos 20 caracteres'),
  expectedResolution: z.string().optional(),
  resourceType: z.string().optional(),
  isAnonymous: z.boolean().optional(),
  privacyPolicyAccepted: z.boolean().refine(val => val === true, {
    message: 'Debes aceptar la política de privacidad y tratamiento de datos',
  }),
}).superRefine((data, ctx) => {
  // Privacy-by-Design: Minimización de datos
  // Validaciones condicionales basadas en si es anónimo o no
  const isAnonymous = data.isAnonymous === true;
  const isDocumentRequired = !isAnonymous && data.type !== 'SUGERENCIA' && data.type !== 'QUEJA';
  
  if (isDocumentRequired) {
    if (!data.customerDocumentType || data.customerDocumentType === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Por favor selecciona un tipo de documento',
        path: ['customerDocumentType'],
      })
    }
    if (!data.customerDocumentNumber || data.customerDocumentNumber.length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Ingresa tu número de documento',
        path: ['customerDocumentNumber'],
      })
    }
  }

  // Validaciones de contacto si NO es anónimo
  if (!isAnonymous) {
    if (!data.customerName || data.customerName.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El nombre debe tener al menos 2 caracteres',
        path: ['customerName'],
      })
    }
    if (!data.customerEmail || !z.string().email().safeParse(data.customerEmail).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Ingresa un email válido',
        path: ['customerEmail'],
      })
    }
     if (!data.customerPhone || data.customerPhone.length < 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Ingresa un teléfono válido',
        path: ['customerPhone'],
      })
    }
  } else {
    // Si ES anónimo, el email es opcional, pero si se ingresa debe ser válido
    if (data.customerEmail && data.customerEmail.length > 0 && !z.string().email().safeParse(data.customerEmail).success) {
       ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El email ingresado no es válido',
        path: ['customerEmail'],
      })
    }
  }
  // Validación: Para PETICION, QUEJA y RECLAMO, el campo resourceType es obligatorio (Circular SIC 005/2022, Art. 1.3.4)
  if (['PETICION', 'QUEJA', 'RECLAMO'].includes(data.type) && (!data.resourceType || data.resourceType === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Selecciona el tipo de recurso legal (reposición o apelación)',
      path: ['resourceType'],
    })
  }
})

type PQRFormData = z.infer<typeof pqrFormSchema>

export function PQRsModule() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCUNModal, setShowCUNModal] = useState(false)
  const [cunCopied, setCunCopied] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [constancy, setConstancy] = useState<PQRConstancy | null>(null)
  const [createdCUN, setCreatedCUN] = useState<string | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Create a FileList-like array or just use the files directly with our handler
      const fileList = e.dataTransfer.files;
      // We need a helper to process files
      const newFiles = Array.from(fileList);
      processFiles(newFiles);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      const newFiles = Array.from(e.target.files);
      processFiles(newFiles);
    }
  }
  
  const processFiles = (newFiles: File[]) => {
      // Validar tipo y tamaño
      // Aceptamos PDF, imagenes, ZIP
      const validTypes = [
          'application/pdf', 
          'image/jpeg', 
          'image/png', 
          'image/jpg', 
          'application/zip', 
          'application/x-zip-compressed',
          'application/x-zip'
      ];
      
      const validFiles = newFiles.filter(file => {
      const isValidType = validTypes.includes(file.type) || file.name.endsWith('.pdf') || file.name.endsWith('.zip') || file.name.endsWith('.png') || file.name.endsWith('.jpg') || file.name.endsWith('.jpeg');
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB limit
      
      // Simple alerts for now, could be better UI
      if (!isValidSize) {
        // En producción usaríamos un toast
        console.warn(`El archivo ${file.name} excede el tamaño máximo de 5MB`)
      }
      
      return isValidSize // Allow types loosely if extension matches
    })

    setFiles(prev => [...prev, ...validFiles])
  }

  const removeFile = (indexToRemove: number) => {
    setFiles(prev => prev.filter((_, index) => index !== indexToRemove))
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<PQRFormData>({
    resolver: zodResolver(pqrFormSchema),
    defaultValues: {
      isAnonymous: false
    }
  })

  const selectedType = watch('type')
  const selectedResourceType = watch('resourceType')
  const isAnonymous = watch('isAnonymous')
  const isDocumentOptional = selectedType === 'SUGERENCIA' || selectedType === 'QUEJA'
  
  // Efecto para animaciones al hacer scroll
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

  // Efecto para limpiar campos si se marca como anónimo
  useEffect(() => {
    if (isAnonymous) {
      setValue('customerName', 'Anónimo')
      setValue('customerPhone', '0000000000')
      setValue('customerDocumentType', '')
      setValue('customerDocumentNumber', '')
      setValue('customerAddress', '')
      // No limpiamos el email aquí porque puede ser opcionalmente provisto
    } else {
       // Si se desmarca, limpiamos los valores por defecto "Anónimo" para que el usuario ingrese los reales
       if (watch('customerName') === 'Anónimo') setValue('customerName', '')
       if (watch('customerPhone') === '0000000000') setValue('customerPhone', '')
    }
  }, [isAnonymous, setValue, watch])

  // ... (sigue igual)

  const onSubmit = async (data: PQRFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)
    setShowCUNModal(false)
    setConstancy(null)
    setCreatedCUN(null)

    // Si es anónimo y no se proveyó email, usamos uno dummy para pasar validación de backend si es necesario,
    // o el backend debería soportar nulls. Asumiremos que el backend requiere email, así que manejamos logicamente.
    
    // Fallback seguro para email: si es anónimo y no hay email, usar dummy. Si no es anónimo, el schema garantiza email válido.
    const finalEmail = (isAnonymous && !data.customerEmail) ? 'anonimo@fitel.com.co' : (data.customerEmail || '')

    try {
      const response = await PQRService.createPQR({
        type: data.type as PQRType,
        customerName: isAnonymous ? 'Anónimo' : (data.customerName || ''),
        customerEmail: finalEmail,
        customerPhone: isAnonymous ? '0000000000' : (data.customerPhone || ''),
        customerDocumentType: isAnonymous ? '' : (data.customerDocumentType || ''),
        customerDocumentNumber: isAnonymous ? '' : (data.customerDocumentNumber || ''),
        customerAddress: isAnonymous ? '' : (data.customerAddress || ''),
        subject: data.subject,
        description: data.description,
        expectedResolution: data.expectedResolution,
        files: files,
      })

      if (response.success && response.data) {
        setCreatedCUN(response.data.cun)
        setShowCUNModal(true)
        if (response.constancy) {
          setConstancy(response.constancy)
        }
        setFiles([])
        reset()
        // Scroll to top/success message
        if (sectionRef.current) {
            sectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
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
    <>
      {/* Modal CUN */}
      {showCUNModal && createdCUN && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            {/* Botón cerrar X */}
            <button
              onClick={() => setShowCUNModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-100 text-neutral-gray hover:text-neutral-dark transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icono éxito */}
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-9 h-9 text-green-600" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-neutral-dark text-center mb-2">
              ¡PQR enviada correctamente!
            </h3>
            <p className="text-sm text-neutral-gray text-center mb-6">
              Te responderemos en un plazo máximo de 15 días hábiles.
            </p>

            {/* CUN */}
            <div className="bg-neutral-50 border border-neutral-gray-light rounded-xl p-5 mb-5">
              <p className="text-xs font-semibold text-neutral-gray uppercase tracking-wider mb-2 text-center">
                Número de Radicación (CUN)
              </p>
              <p className="text-2xl font-bold text-primary-red text-center tracking-widest mb-4">
                {createdCUN}
              </p>
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(createdCUN)
                  setCunCopied(true)
                  setTimeout(() => setCunCopied(false), 2000)
                }}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 border border-primary-red/40 rounded-lg text-primary-red hover:bg-primary-red/5 transition-colors text-sm font-medium"
              >
                {cunCopied ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar número</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-neutral-gray text-center mb-6">
              Guarda este número para consultar el estado de tu PQR en cualquier momento.
            </p>

            <button
              onClick={() => setShowCUNModal(false)}
              className="w-full btn-primary"
            >
              Entendido, cerrar
            </button>
          </div>
        </div>
      )}

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
              {!isAnonymous && (
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
              )}

              {/* Email y Teléfono */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="customerEmail" className="block text-sm font-semibold text-neutral-dark mb-2 flex items-center">
                    Email {isAnonymous ? <span className="text-neutral-gray font-normal ml-1">(Opcional)</span> : '*'}
                    {isAnonymous && (
                      <div className="group relative ml-2">
                      <div className="cursor-help text-neutral-gray hover:text-primary-blue transition-colors">
                        <Info className="w-4 h-4" />
                      </div>
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-neutral-dark text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        Solo si deseas recibir actualizaciones automáticas. Si prefieres anonimato total, guarda tu código CUN para consultar manualmente.
                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-neutral-dark"></div>
                      </div>
                      </div>
                    )}
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

                {!isAnonymous && (
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
                )}
              </div>

              {/* Checkbox de Anonimato (Solo para Quejas y Sugerencias) */}
              {isDocumentOptional && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 animate-fade-in">
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center h-5 mt-0.5">
                      <input
                        id="isAnonymous"
                        type="checkbox"
                        {...register('isAnonymous')}
                        className="w-4 h-4 rounded border-gray-300 text-secondary-blue focus:ring-secondary-blue transition-all cursor-pointer"
                      />
                    </div>
                    <div>
                      <label htmlFor="isAnonymous" className="font-semibold text-neutral-dark cursor-pointer select-none">
                        {selectedType === 'QUEJA' ? 'Presentar Queja Anónima' : 'Presentar Sugerencia Anónima'}
                      </label>
                      <p className="text-sm text-neutral-gray mt-1">
                        Tus datos personales no serán registrados. La respuesta se deberá consultar manualmente con el número de radicado (CUN).
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tipo y Número de Documento */}
              {!isAnonymous && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                <div>
                  <label htmlFor="customerDocumentType" className="block text-sm font-semibold text-neutral-dark mb-2">
                    Tipo de Documento {isDocumentOptional ? <span className="text-neutral-gray font-normal">(Opcional)</span> : '*'}
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
                    Número de Documento {isDocumentOptional ? <span className="text-neutral-gray font-normal">(Opcional)</span> : '*'}
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
              )}

              {/* Dirección (Opcional) */}
              {!isAnonymous && (
              <div className="animate-fade-in">
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
              )}

              {/* Campo de recurso legal (para PETICION, QUEJA y RECLAMO — Circular SIC 005/2022, Art. 1.3.4) */}
              {selectedType && selectedType !== 'SUGERENCIA' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 animate-fade-in">
                  <label htmlFor="resourceType" className="block text-sm font-semibold text-neutral-dark mb-2">
                    Tipo de recurso legal que desea interponer *
                  </label>
                  <p className="text-xs text-neutral-gray mb-2">
                    De acuerdo con el artículo 2.1.24.1.3 de la Resolución CRC 5050 de 2016, indique si desea presentar únicamente recurso de reposición, o recurso de reposición y en subsidio de apelación.
                  </p>
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
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  {errors.resourceType && (
                    <p className="mt-1 text-sm text-red-600">{errors.resourceType.message}</p>
                  )}
                  {/* Aviso especial de 6 meses solo para RECLAMO de facturación */}
                  {selectedType === 'RECLAMO' && (
                    <div className="mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded text-yellow-900 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-700" />
                      <span>
                        Recuerda: Solo puedes presentar reclamaciones de facturación dentro de los 6 meses siguientes a la fecha de cobro, según la Circular SIC 005/2022.
                      </span>
                    </div>
                  )}
                </div>
              )}

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
                  placeholder="Describe detalladamente tu petición, queja, reclamo o sugerencia..."
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

              {/* Archivos Adjuntos */}
              <div>
                <label className="block text-sm font-semibold text-neutral-dark mb-2">
                  Archivos Adjuntos <span className="text-neutral-gray font-normal">(Opcional)</span>
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive
                      ? 'border-primary-red bg-red-50'
                      : 'border-neutral-gray-light hover:border-primary-red/50 hover:bg-neutral-50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    multiple
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                    <Upload className="w-8 h-8 text-neutral-gray" />
                    <p className="text-sm text-neutral-gray">
                      <span className="font-semibold text-primary-red">Haz clic para subir</span> o arrastra y suelta tus archivos aquí
                    </p>
                    <p className="text-xs text-neutral-gray-light">
                      Soporta documentos PDF, imágenes y archivos comprimidos
                    </p>
                  </div>
                </div>
                
                {/* Lista de archivos seleccionados */}
                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between p-3 bg-white border border-neutral-gray-light rounded-lg"
                      >
                        <div className="flex items-center space-x-3 overflow-hidden">
                           <FileIcon className="w-5 h-5 text-primary-red flex-shrink-0" />
                          <div className="truncate">
                            <p className="text-sm font-medium text-neutral-dark truncate">{file.name}</p>
                            <p className="text-xs text-neutral-gray">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="p-1 hover:bg-red-50 rounded-full text-neutral-gray hover:text-red-600 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Política de Privacidad */}
              <div className="flex items-start space-x-3 pt-6 border-t border-neutral-gray-light">
                <div className="flex items-center h-5">
                  <input
                    id="privacyPolicyAccepted"
                    type="checkbox"
                    {...register('privacyPolicyAccepted')}
                    className={`w-4 h-4 rounded border-gray-300 text-primary-red focus:ring-primary-red transition-all cursor-pointer ${
                      errors.privacyPolicyAccepted ? 'border-red-500 ring-1 ring-red-500' : ''
                    }`}
                  />
                </div>
                <div className="ml-2 text-sm">
                  <label htmlFor="privacyPolicyAccepted" className="font-medium text-neutral-dark cursor-pointer select-none">
                    Autorizo el tratamiento de mis datos personales
                  </label>
                  <p className="text-neutral-gray text-xs mt-1 leading-relaxed">
                    De conformidad con el principio de transparencia y la Ley 1581 de 2012. He leído y acepto la{' '}
                    <Link href="/politica-privacidad" className="text-primary-red hover:underline font-semibold" target="_blank">
                      Política de Privacidad
                    </Link>
                    {' '}y el tratamiento de mis datos para la gestión, respuesta y seguimiento de esta PQR.
                  </p>
                  {errors.privacyPolicyAccepted && (
                    <div className="flex items-center mt-1 text-red-600 text-xs animate-shake">
                       <AlertCircle className="w-3 h-3 mr-1" />
                       {errors.privacyPolicyAccepted.message}
                    </div>
                  )}
                </div>
              </div>

              {/* Mensaje de error */}
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
    </>
  )
}
