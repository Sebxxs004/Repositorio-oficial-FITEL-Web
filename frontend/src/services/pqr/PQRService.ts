/**
 * PQRService
 * 
 * Servicio responsable de todas las operaciones relacionadas con PQRs.
 * Implementa el principio de Responsabilidad Única (SRP) y el principio
 * de Inversión de Dependencias (DIP) al abstraer las llamadas al API.
 */

import type { PQRSearchRequest, PQRSearchResponse } from '@/types/pqr.types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export class PQRService {
  /**
   * Busca una PQR por número de PQR o documento de identidad
   * 
   * @param request - Objeto con el query de búsqueda
   * @returns Promise con la respuesta de la búsqueda
   */
  static async searchPQR(request: PQRSearchRequest): Promise<PQRSearchResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/pqrs/consultar?query=${encodeURIComponent(request.query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error al consultar PQR' }))
        return {
          success: false,
          error: errorData.message || 'Error al consultar PQR',
        }
      }

      const data = await response.json()
      return {
        success: true,
        data: data.data,
        message: data.message,
      }
    } catch (error) {
      console.error('Error en PQRService.searchPQR:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error de conexión al servidor',
      }
    }
  }
}
