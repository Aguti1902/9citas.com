import { useState } from 'react'
import { api } from '@/services/api'
import Logo from '@/components/common/Logo'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await api.post('/admin/stats', { password })
      setStats(response.data)
      setIsAuthenticated(true)
    } catch (error) {
      alert('Contraseña incorrecta')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegenerateFakes = async () => {
    if (!confirm('¿Regenerar perfiles falsos? Esto eliminará los existentes.')) return

    setIsLoading(true)
    try {
      const response = await api.post('/admin/regenerate-fakes', { password })
      alert(response.data.message)
      
      // Recargar stats
      const statsResponse = await api.post('/admin/stats', { password })
      setStats(statsResponse.data)
    } catch (error) {
      alert('Error al regenerar perfiles')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteFakes = async () => {
    if (!confirm('¿Eliminar todos los perfiles falsos?')) return

    setIsLoading(true)
    try {
      const response = await api.post('/admin/delete-fakes', { password })
      alert(response.data.message)
      
      // Recargar stats
      const statsResponse = await api.post('/admin/stats', { password })
      setStats(statsResponse.data)
    } catch (error) {
      alert('Error al eliminar perfiles')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <Logo size="md" className="mb-4" />
            <h1 className="text-2xl font-bold text-white">Panel de Admin</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Contraseña de admin"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Contraseña"
            />

            <Button
              type="submit"
              fullWidth
              variant="primary"
              isLoading={isLoading}
            >
              Acceder
            </Button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Logo size="md" />
            <h1 className="text-2xl font-bold text-white mt-2">Panel de Admin</h1>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Estadísticas */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-gray-400 text-sm mb-2">Total Usuarios</h3>
              <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-gray-400 text-sm mb-2">Total Perfiles</h3>
              <p className="text-3xl font-bold text-white">{stats.totalProfiles}</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-gray-400 text-sm mb-2">Perfiles Reales</h3>
              <p className="text-3xl font-bold text-success">{stats.realProfiles}</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-gray-400 text-sm mb-2">Perfiles Falsos</h3>
              <p className="text-3xl font-bold text-warning">{stats.fakeProfiles}</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-gray-400 text-sm mb-2">Heteros</h3>
              <p className="text-3xl font-bold text-primary">{stats.heteroProfiles}</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-gray-400 text-sm mb-2">Gays</h3>
              <p className="text-3xl font-bold text-secondary">{stats.gayProfiles}</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-gray-400 text-sm mb-2">Total Mensajes</h3>
              <p className="text-3xl font-bold text-white">{stats.totalMessages}</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-gray-400 text-sm mb-2">Suscripciones 9Plus</h3>
              <p className="text-3xl font-bold text-accent">{stats.activeSubscriptions}</p>
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="bg-gray-900 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Acciones</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Button
              fullWidth
              variant="secondary"
              onClick={handleRegenerateFakes}
              isLoading={isLoading}
            >
              🔄 Regenerar perfiles falsos
            </Button>
            
            <Button
              fullWidth
              variant="outline"
              onClick={handleDeleteFakes}
              isLoading={isLoading}
            >
              🗑️ Eliminar perfiles falsos
            </Button>
          </div>

          <p className="text-gray-400 text-sm mt-4">
            * Regenerar perfiles falsos creará entre 200-400 nuevos perfiles de prueba
          </p>
        </div>
      </div>
    </div>
  )
}

