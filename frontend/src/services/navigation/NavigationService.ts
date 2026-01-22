/**
 * NavigationService
 * 
 * Servicio responsable de gestionar la navegación de la aplicación.
 * Implementa el principio de Responsabilidad Única (SRP) del SOLID.
 */
export interface NavigationItem {
  label: string
  href: string
}

export class NavigationService {
  private static readonly NAVIGATION_ITEMS: NavigationItem[] = [
    { label: 'Inicio', href: '/' },
    { label: 'Planes', href: '/planes' },
    { label: 'Cobertura', href: '/cobertura' },
    { label: 'Contacto', href: '/contacto' },
    { label: 'Soporte', href: '/soporte' },
  ]

  /**
   * Obtiene todos los elementos de navegación
   */
  static getNavigationItems(): NavigationItem[] {
    return [...this.NAVIGATION_ITEMS]
  }

  /**
   * Verifica si una ruta existe en la navegación
   */
  static isValidRoute(href: string): boolean {
    return this.NAVIGATION_ITEMS.some((item) => item.href === href)
  }

  /**
   * Obtiene un elemento de navegación por su href
   */
  static getNavigationItemByHref(href: string): NavigationItem | undefined {
    return this.NAVIGATION_ITEMS.find((item) => item.href === href)
  }
}
