'use client'

import { useState, useEffect } from 'react'
import { User, Edit, Trash2, Lock, Save, X, Loader2, Eye, EyeOff } from 'lucide-react'

interface AdminUser {
  id: number
  username: string
  fullName: string
  role: string
  active: boolean
  lastLogin: string | null
  createdAt: string
}

interface EditUserForm {
  id: number | null
  fullName: string
  password: string
  confirmPassword: string
}

export function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editingUser, setEditingUser] = useState<EditUserForm | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/users`, {
        method: 'GET',
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data.data || [])
      } else {
        setMessage({ type: 'error', text: 'Error al cargar los usuarios' })
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
      setMessage({ type: 'error', text: 'Error al cargar los usuarios' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (user: AdminUser) => {
    setEditingUser({
      id: user.id,
      fullName: user.fullName,
      password: '',
      confirmPassword: '',
    })
    setMessage(null)
  }

  const handleCancelEdit = () => {
    setEditingUser(null)
    setShowPassword(false)
  }

  const handleSave = async () => {
    if (!editingUser) return

    // Validar que las contraseñas coincidan si se está cambiando
    if (editingUser.password && editingUser.password !== editingUser.confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden' })
      return
    }

    // Validar longitud mínima de contraseña
    if (editingUser.password && editingUser.password.length < 6) {
      setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres' })
      return
    }

    setIsSaving(true)
    setMessage(null)

    try {
      const updateData: any = {
        fullName: editingUser.fullName,
      }

      // Solo incluir contraseña si se está cambiando
      if (editingUser.password) {
        updateData.password = editingUser.password
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Usuario actualizado correctamente' })
        setEditingUser(null)
        setShowPassword(false)
        loadUsers()
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.message || 'Error al actualizar el usuario' })
      }
    } catch (error) {
      console.error('Error al guardar:', error)
      setMessage({ type: 'error', text: 'Error al guardar los cambios' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleActive = async (userId: number, currentStatus: boolean) => {
    if (!confirm(`¿Estás seguro de que deseas ${currentStatus ? 'inactivar' : 'activar'} este usuario?`)) {
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/users/${userId}/toggle-active`, {
        method: 'PUT',
        credentials: 'include',
      })

      if (response.ok) {
        setMessage({ type: 'success', text: `Usuario ${currentStatus ? 'inactivado' : 'activado'} correctamente` })
        loadUsers()
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.message || 'Error al cambiar el estado del usuario' })
      }
    } catch (error) {
      console.error('Error al cambiar estado:', error)
      setMessage({ type: 'error', text: 'Error al cambiar el estado del usuario' })
    }
  }

  const handleDelete = async (userId: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Usuario eliminado correctamente' })
        loadUsers()
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.message || 'Error al eliminar el usuario' })
      }
    } catch (error) {
      console.error('Error al eliminar:', error)
      setMessage({ type: 'error', text: 'Error al eliminar el usuario' })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-red mx-auto mb-4" />
          <p className="text-neutral-gray">Cargando usuarios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-dark mb-2">Gestión de Usuarios Administradores</h2>
        <p className="text-neutral-gray">Administra los usuarios del panel de administración.</p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Lista de usuarios */}
      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-neutral-white rounded-lg border border-neutral-gray-light p-6 shadow-sm"
          >
            {editingUser && editingUser.id === user.id ? (
              // Formulario de edición
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-dark mb-2">
                      Nombre de Usuario
                    </label>
                    <input
                      type="text"
                      value={user.username}
                      disabled
                      className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg bg-neutral-gray-light text-neutral-gray"
                    />
                    <p className="text-xs text-neutral-gray mt-1">El nombre de usuario no se puede cambiar</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-dark mb-2">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      value={editingUser.fullName}
                      onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-dark mb-2">
                      Nueva Contraseña (opcional)
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={editingUser.password}
                        onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                        placeholder="Dejar vacío para no cambiar"
                        className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-gray hover:text-neutral-dark"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-neutral-gray mt-1">Mínimo 6 caracteres</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-dark mb-2">
                      Confirmar Contraseña
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={editingUser.confirmPassword}
                      onChange={(e) => setEditingUser({ ...editingUser, confirmPassword: e.target.value })}
                      placeholder="Confirmar nueva contraseña"
                      className="w-full px-4 py-2 border border-neutral-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-gray-light">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-neutral-gray-light rounded-lg text-neutral-gray hover:bg-neutral-gray-light transition-colors flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancelar</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn-primary flex items-center space-x-2 px-4 py-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Guardar Cambios</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              // Vista de usuario
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <User className="w-5 h-5 text-primary-red" />
                    <h3 className="text-lg font-bold text-neutral-dark">{user.fullName}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-neutral-gray">
                    <div>
                      <span className="font-semibold">Usuario:</span> {user.username}
                    </div>
                    <div>
                      <span className="font-semibold">Rol:</span> {user.role}
                    </div>
                    <div>
                      <span className="font-semibold">Último acceso:</span>{' '}
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('es-CO') : 'Nunca'}
                    </div>
                    <div>
                      <span className="font-semibold">Creado:</span>{' '}
                      {new Date(user.createdAt).toLocaleDateString('es-CO')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(user)}
                    className="p-2 rounded hover:bg-primary-red/10 text-primary-red"
                    title="Editar usuario"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleToggleActive(user.id, user.active)}
                    className={`p-2 rounded ${
                      user.active
                        ? 'hover:bg-yellow-50 text-yellow-600'
                        : 'hover:bg-green-50 text-green-600'
                    }`}
                    title={user.active ? 'Inactivar usuario' : 'Activar usuario'}
                  >
                    <Lock className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="p-2 rounded hover:bg-red-50 text-red-600"
                    title="Eliminar usuario"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {users.length === 0 && (
          <div className="text-center py-12 bg-neutral-gray-light rounded-lg border border-neutral-gray-light">
            <p className="text-neutral-gray">No hay usuarios registrados.</p>
          </div>
        )}
      </div>
    </div>
  )
}
