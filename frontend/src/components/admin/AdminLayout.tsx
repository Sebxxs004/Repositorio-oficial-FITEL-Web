'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { BarChart3, Users, FileText, Settings, LogOut, Shield, User, LayoutDashboard, ChevronDown, ChevronRight, Package, Tv } from 'lucide-react'

interface UserInfo {
  username: string
  fullName: string
  role: string
}

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [isGestionOpen, setIsGestionOpen] = useState(false)

  // Mantener el menú de gestión abierto si estamos en alguna de sus páginas
  useEffect(() => {
    if (pathname?.startsWith('/operaciones-internas/planes') || 
        pathname?.startsWith('/operaciones-internas/canales')) {
      setIsGestionOpen(true)
    }
  }, [pathname])

  useEffect(() => {
    // Verificar autenticación y obtener información del usuario
    const checkAuth = async () => {
      try {
        const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/auth/admin/verify`, {
          method: 'GET',
          credentials: 'include',
        })

        if (!verifyResponse.ok) {
          throw new Error('No autenticado')
        }

        // Obtener información del usuario
        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/auth/admin/me`, {
          method: 'GET',
          credentials: 'include',
        })

        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUserInfo({
            username: userData.data.username,
            fullName: userData.data.fullName,
            role: userData.data.role,
          })
        }

        setIsAuthenticated(true)
      } catch (error) {
        router.push('/operaciones-internas/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/auth/admin/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    } finally {
      document.cookie = 'admin_token=; path=/; max-age=0'
      document.cookie = 'admin_session=; path=/; max-age=0'
      router.push('/operaciones-internas/login')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-gray-light">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-red mx-auto mb-4"></div>
          <p className="text-neutral-gray">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/operaciones-internas/dashboard',
      active: pathname === '/operaciones-internas/dashboard',
    },
    {
      icon: FileText,
      label: 'Gestión de PQRs',
      path: '/operaciones-internas/pqrs',
      active: pathname?.startsWith('/operaciones-internas/pqrs'),
    },
    {
      icon: Settings,
      label: 'Configuración',
      path: '/operaciones-internas/configuracion',
      active: pathname?.startsWith('/operaciones-internas/configuracion'),
    },
    {
      icon: Users,
      label: 'Usuarios e IPs',
      path: '/operaciones-internas/usuarios-ips',
      active: pathname?.startsWith('/operaciones-internas/usuarios-ips'),
    },
  ]

  const gestionSubmenuItems = [
    {
      icon: Package,
      label: 'Gestión de Planes',
      path: '/operaciones-internas/planes',
      active: pathname?.startsWith('/operaciones-internas/planes'),
    },
    {
      icon: Tv,
      label: 'Gestión de Canales',
      path: '/operaciones-internas/canales',
      active: pathname?.startsWith('/operaciones-internas/canales'),
    },
  ]

  return (
    <div className="min-h-screen bg-neutral-gray-light flex">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-dark text-neutral-white flex flex-col">
        {/* Header del Sidebar */}
        <div className="p-6 border-b border-neutral-gray/20">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-8 h-8 text-primary-red" />
            <h1 className="text-xl font-bold">FITEL Admin</h1>
          </div>
          
          {/* Información del Usuario */}
          <div className="flex items-center space-x-3 pt-4 border-t border-neutral-gray/20">
            <div className="w-12 h-12 rounded-full bg-primary-red/20 flex items-center justify-center">
              <User className="w-6 h-6 text-primary-red" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-neutral-white truncate">
                ¡Bienvenido, {userInfo?.fullName || userInfo?.username || 'Usuario'}!
              </p>
              <p className="text-xs text-neutral-gray-light truncate">
                {userInfo?.role || 'ADMIN'}
              </p>
            </div>
          </div>
        </div>

        {/* Menú de Navegación */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  item.active
                    ? 'bg-primary-red text-neutral-white'
                    : 'text-neutral-gray-light hover:bg-neutral-gray/20 hover:text-neutral-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}

          {/* Menú Desplegable de Gestión */}
          <div>
            <button
              onClick={() => setIsGestionOpen(!isGestionOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                pathname?.startsWith('/operaciones-internas/planes') || 
                pathname?.startsWith('/operaciones-internas/canales')
                  ? 'bg-primary-red text-neutral-white'
                  : 'text-neutral-gray-light hover:bg-neutral-gray/20 hover:text-neutral-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium">Gestión</span>
              </div>
              {isGestionOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>

            {/* Submenú */}
            {isGestionOpen && (
              <div className="mt-2 ml-4 space-y-1">
                {gestionSubmenuItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors text-sm ${
                        item.active
                          ? 'bg-primary-red/80 text-neutral-white'
                          : 'text-neutral-gray-light hover:bg-neutral-gray/20 hover:text-neutral-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Botón de Cerrar Sesión */}
        <div className="p-4 border-t border-neutral-gray/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-neutral-gray-light hover:bg-red-500/20 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header del Contenido */}
        <header className="bg-neutral-white shadow-sm border-b border-neutral-gray-light px-8 py-6">
          <h2 className="text-2xl font-bold text-neutral-dark">{title}</h2>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-8 pt-8 pb-8">
          <div className="pt-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
