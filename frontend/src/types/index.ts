/**
 * Tipos globales de la aplicación
 * 
 * Centraliza las definiciones de tipos para mantener consistencia
 */

export interface Plan {
  id: number
  name: string
  description?: string
  internetSpeedMbps: number
  tvChannels: number
  monthlyPrice: number
  active: boolean
  popular: boolean
  planType: 'BASIC' | 'FAMILY' | 'BUSINESS'
  createdAt?: string
  updatedAt?: string
}

export interface CoverageZone {
  id: number
  name: string
  code: string
  locality: string
  available: boolean
  description?: string
}

export interface ContactForm {
  name: string
  email: string
  phone: string
  message: string
  subject: string
}
