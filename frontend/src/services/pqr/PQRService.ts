/**
 * PQRService
 * 
 * Servicio responsable de todas las operaciones relacionadas con PQRs.
 * Implementa el principio de Responsabilidad Única (SRP) y el principio
 * de Inversión de Dependencias (DIP) al abstraer las llamadas al API.
 */

import type { 
  PQRSearchRequest, 
  PQRSearchResponse, 
  CreatePQRRequest, 
  CreatePQRResponse,
  PQRConstancy 
} from '@/types/pqr.types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export class PQRService {
  /**
   * Crea una nueva PQR
   */
  static async createPQR(request: CreatePQRRequest): Promise<CreatePQRResponse> {
    try {
      // Separar archivos para procesarlos (extraer nombres por ahora)
      const { files, ...requestData } = request;
      
      const payload = {
        ...requestData,
        // attachments: files?.map(f => f.name) || [] // Ya no enviamos solo nombres, sino Form Data
      };

      const formData = new FormData()
      formData.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
      
      if (files && files.length > 0) {
        files.forEach(file => {
          formData.append('files', file)
        })
      }

      const response = await fetch(`${API_BASE_URL}/pqrs`, {
        method: 'POST',
        headers: {
          // 'Content-Type': 'multipart/form-data', // No establecer explícitamente, fetch lo hace con el boundary correcto
        },
        credentials: 'include',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error al crear PQR' }))
        return {
          success: false,
          error: errorData.message || 'Error al crear PQR',
        }
      }

      const data = await response.json()
      
      // Obtener constancia después de crear la PQR
      let constancy: PQRConstancy | undefined
      if (data.data?.cun) {
        try {
          const constancyResponse = await fetch(`${API_BASE_URL}/pqrs/constancia/${data.data.cun}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          })
          
          if (constancyResponse.ok) {
            const constancyData = await constancyResponse.json()
            constancy = constancyData.data
          }
        } catch (err) {
          console.warn('Error obteniendo constancia:', err)
        }
      }
      
      return {
        success: true,
        data: data.data,
        constancy,
        message: data.message,
      }
    } catch (error) {
      console.error('Error en PQRService.createPQR:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error de conexión al servidor',
      }
    }
  }

  /**
   * Busca una PQR por número de PQR (CUN) o documento de identidad
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

  /**
   * Solicita un reanálisis para una PQR
   */
  static async requestReanalysis(cun: string, reason: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/pqrs/${cun}/reanalisis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error al solicitar reanálisis' }))
        return {
          success: false,
          error: errorData.message || 'Error al solicitar reanálisis',
        }
      }

      return { success: true }
    } catch (error) {
      console.error('Error en PQRService.requestReanalysis:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error de conexión al servidor',
      }
    }
  }

  /**
   * Obtiene la constancia de radicación
   */
  static async getConstancy(cun: string): Promise<PQRConstancy | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/pqrs/constancia/${cun}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      return data.data
    } catch (error) {
      console.error('Error en PQRService.getConstancy:', error)
      return null
    }
  }
}
