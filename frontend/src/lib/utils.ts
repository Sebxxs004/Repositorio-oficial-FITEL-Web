import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utilidad para combinar clases de Tailwind
 * 
 * Implementa el principio DRY (Don't Repeat Yourself)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
