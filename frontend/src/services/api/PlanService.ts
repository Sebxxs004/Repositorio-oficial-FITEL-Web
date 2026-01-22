/**
 * PlanService
 * 
 * Servicio para obtener planes desde la API del backend
 * Implementa el principio de Responsabilidad Única (SRP)
 */
import { Plan } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export interface PlanResponse {
  success: boolean
  message?: string
  data: PlanDTO[]
  timestamp?: string
}

interface PlanDTO {
  id: number
  name: string
  description?: string
  internetSpeedMbps: number
  tvChannels: number
  monthlyPrice: number | string // Backend puede enviar BigDecimal como string
  active: boolean
  popular: boolean
  planType: string
  createdAt?: string
  updatedAt?: string
}

export class PlanService {
  /**
   * Convierte un PlanDTO del backend a Plan del frontend
   */
  private static mapDTOToPlan(dto: PlanDTO): Plan {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      internetSpeedMbps: dto.internetSpeedMbps,
      tvChannels: dto.tvChannels,
      monthlyPrice: typeof dto.monthlyPrice === 'string' 
        ? parseFloat(dto.monthlyPrice) 
        : dto.monthlyPrice,
      active: dto.active,
      popular: dto.popular,
      planType: dto.planType as 'BASIC' | 'FAMILY' | 'BUSINESS',
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    }
  }

  /**
   * Obtiene todos los planes activos
   */
  static async getAllPlans(): Promise<Plan[]> {
    try {
      const response = await fetch(`${API_URL}/public/plans`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Para desarrollo, en producción usar 'force-cache'
      })

      if (!response.ok) {
        throw new Error(`Error al obtener planes: ${response.statusText}`)
      }

      const result: PlanResponse = await response.json()
      if (result.data && Array.isArray(result.data)) {
        return result.data.map((dto) => this.mapDTOToPlan(dto))
      }
      return []
    } catch (error) {
      console.error('Error fetching plans:', error)
      // Retornar planes por defecto en caso de error
      return PlanService.getDefaultPlans()
    }
  }

  /**
   * Obtiene los planes populares
   */
  static async getPopularPlans(): Promise<Plan[]> {
    try {
      const response = await fetch(`${API_URL}/public/plans/popular`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error(`Error al obtener planes populares: ${response.statusText}`)
      }

      const result: PlanResponse = await response.json()
      if (result.data && Array.isArray(result.data)) {
        return result.data.map((dto) => this.mapDTOToPlan(dto))
      }
      return []
    } catch (error) {
      console.error('Error fetching popular plans:', error)
      return []
    }
  }

  /**
   * Planes por defecto (fallback)
   */
  private static getDefaultPlans(): Plan[] {
    return [
      {
        id: 1,
        name: 'Básico',
        description: 'Plan básico de Internet y TV para uso familiar',
        internetSpeedMbps: 50,
        tvChannels: 80,
        monthlyPrice: 49900,
        active: true,
        popular: false,
        planType: 'BASIC',
      },
      {
        id: 2,
        name: 'Familiar',
        description: 'Plan familiar con más velocidad y canales premium',
        internetSpeedMbps: 100,
        tvChannels: 120,
        monthlyPrice: 79900,
        active: true,
        popular: true,
        planType: 'FAMILY',
      },
      {
        id: 3,
        name: 'Empresarial',
        description: 'Plan empresarial con velocidad dedicada e IP estática',
        internetSpeedMbps: 200,
        tvChannels: 150,
        monthlyPrice: 129900,
        active: true,
        popular: false,
        planType: 'BUSINESS',
      },
    ]
  }
}
