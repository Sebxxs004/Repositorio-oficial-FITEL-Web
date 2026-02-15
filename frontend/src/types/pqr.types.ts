/**
 * Tipos e interfaces para el módulo de PQRs
 * 
 * Este archivo centraliza todas las definiciones de tipos relacionadas con PQRs,
 * siguiendo el principio de Responsabilidad Única (SRP).
 */

export type PQRStatus = 'RECIBIDA' | 'EN_ANALISIS' | 'EN_RESPUESTA' | 'RESUELTA' | 'CERRADA'

export type PQRType = 'PETICION' | 'QUEJA' | 'RECLAMO' | 'SUGERENCIA'

export type DocumentType = 'CC' | 'NIT' | 'CE' | 'PASAPORTE' | 'OTRO'

export interface PQRResponse {
  id: number
  cun: string
  type: PQRType
  customerName: string
  customerEmail: string
  customerPhone: string
  customerDocumentType: string
  customerDocumentNumber: string
  customerAddress?: string
  subject: string
  description: string
  status: PQRStatus
  priority: string
  responsibleArea?: string
  realType?: string
  resourceType?: string
  response?: string
  createdAt: string
  updatedAt: string
  responseDate?: string
  resolutionDate?: string
  slaDeadline?: string
}

export interface PQRConstancy {
  cun: string
  customerName: string
  type: PQRType
  subject: string
  radicationDate: string
  maxResponseDate: string
  silenceAdministrativeText: string
}

export interface CreatePQRRequest {
  type: PQRType
  // ... existing fields ...
  // Added below
  files?: File[]

  customerName: string
  customerEmail: string
  customerPhone: string
  customerDocumentType?: string
  customerDocumentNumber?: string
  customerAddress?: string
  subject: string
  description: string
  resourceType?: string
  expectedResolution?: string
}

export interface PQRSearchRequest {
  query: string // Puede ser número de PQR (CUN) o documento de identidad
}

export interface PQRSearchResponse {
  success: boolean
  data?: PQRResponse[]
  message?: string
  error?: string
}

export interface CreatePQRResponse {
  success: boolean
  data?: PQRResponse
  constancy?: PQRConstancy
  message?: string
  error?: string
}
