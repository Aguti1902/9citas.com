import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Logo from '../common/Logo'
import InstallPWA from '../common/InstallPWA'
import RoamSummaryModal from '../common/RoamSummaryModal'
import Toast from '../common/Toast'
import { useAuthStore } from '@/store/authStore'
import { useToastStore } from '@/store/toastStore'
import { useState, useEffect } from 'react'
import Modal from '../common/Modal'
import { api } from '@/services/api'
import { Search, MessageCircle, Heart, Star, Info, User, LogOut, Bell } from 'lucide-react'

export default function DashboardLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const { toasts, removeToast } = useToastStore()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [pendingRequests, setPendingRequests] = useState(0)
  const [showRoamSummary, setShowRoamSummary] = useState(false)
  const [roamSummary] = useState({ viewsExtra: 0, likesExtra: 0, duration: 0 })

  const isActive = (path: string) => location.pathname.includes(path)

  useEffect(() => {
    loadPendingRequests()
    loadRoamStatus()
    const interval = setInterval(() => {
      loadPendingRequests()
      loadRoamStatus()
    }, 30000) // Check every 30s
    return () => clearInterval(interval)
  }, [])

  const loadPendingRequests = async () => {
    try {
      const response = await api.get('/private-photos/requests/received')
      setPendingRequests(response.data.requests.length)
    } catch (error) {
      console.error('Error loading requests:', error)
    }
  }

  const loadRoamStatus = async () => {
    try {
      await api.get('/roam/status')
    } catch (error) {
      console.error('Error loading roam status:', error)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const navItems = [
    { path: '/app', label: 'Navegar', Icon: Search },
    { path: '/app/inbox', label: 'Buzón', Icon: MessageCircle },
    { path: '/app/likes', label: 'Me gusta', Icon: Heart },
    { path: '/app/plus', label: '9Plus', Icon: Star },
    { path: '/app/info', label: 'Info', Icon: Info },
  ]

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 py-1.5 flex items-center justify-between">
          <div className="flex-shrink-0">
            {/* Logo pequeño SOLO en el header interno */}
            <Logo size="sm" className="h-7 sm:h-8 w-auto object-contain" />
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notificaciones de fotos privadas */}
            <button
              onClick={() => navigate('/app/private-photo-requests')}
              className="relative text-gray-300 hover:text-white transition-colors"
              title="Solicitudes de fotos privadas"
            >
              <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
              {pendingRequests > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-accent text-black text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center">
                  {pendingRequests}
                </span>
              )}
            </button>
            
            <button
              onClick={() => navigate('/app/edit-profile')}
              className="text-gray-300 hover:text-white transition-colors"
              title="Editar perfil"
            >
              <User className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            
            <button
              onClick={() => setShowLogoutModal(true)}
              className="text-gray-300 hover:text-primary transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-40">
        <div className="max-w-7xl mx-auto px-2">
          <div className="flex justify-around">
            {navItems.map((item) => {
              const Icon = item.Icon
              const active = isActive(item.path) && location.pathname === item.path
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`nav-bottom-item ${active ? 'active' : ''}`}
                >
                  <Icon className={`w-6 h-6 mb-1 ${active ? 'text-primary' : ''}`} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Modal de logout */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Cerrar sesión"
        maxWidth="sm"
      >
        <p className="text-gray-300 mb-6">
          ¿Estás seguro de que quieres cerrar sesión?
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setShowLogoutModal(false)}
            className="flex-1 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 bg-primary text-white py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Cerrar sesión
          </button>
        </div>
      </Modal>

      {/* Componente PWA Install */}
      <InstallPWA />

      {/* Modal de resumen de Roam */}
      <RoamSummaryModal
        isOpen={showRoamSummary}
        onClose={() => setShowRoamSummary(false)}
        summary={roamSummary}
      />

      {/* Toasts/Notificaciones */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
          duration={toast.duration}
        />
      ))}
    </div>
  )
}

