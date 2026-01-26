/**
 * Tipos e interfaces para el módulo de PQRs
 * 
 * Este archivo centraliza todas las definiciones de tipos relacionadas con PQRs,
 * siguiendo el principio de Responsabilidad Única (SRP).
 */

export type PQRStatus = 'pendiente' | 'en_proceso' | 'resuelta' | 'rechazada'

export type PQRType = 'peticion' | 'queja' | 'recurso' | 'sugerencia'

export interface PQRStatusResponse {
  id: string
  type: PQRType
  category: string
  description: string
  status: PQRStatus
  createdAt: string
  updatedAt: string
  resolutionDate?: string
  resolutionNotes?: string
}

export interface PQRSearchRequest {
  query: string // Puede ser número de PQR o documento de identidad
}

export interface PQRSearchResponse {
  success: boolean
  data?: PQRStatusResponse
  message?: string
  error?: string
}
