import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Logo from '../common/Logo'
import InstallPWA from '../common/InstallPWA'
import RoamSummaryModal from '../common/RoamSummaryModal'
import Toast from '../common/Toast'
import MatchNotification from '../common/MatchNotification'
import { useAuthStore } from '@/store/authStore'
import { useToastStore } from '@/store/toastStore'
import { useState, useEffect } from 'react'
import Modal from '../common/Modal'
import { api } from '@/services/api'
import { connectSocket, disconnectSocket } from '@/services/socket'
import { Search, MessageCircle, Heart, Star, Info, User, LogOut, Bell } from 'lucide-react'

export default function DashboardLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, accessToken } = useAuthStore()
  const { toasts, removeToast } = useToastStore()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [pendingRequests, setPendingRequests] = useState(0)
  const [showRoamSummary, setShowRoamSummary] = useState(false)
  const [roamSummary] = useState({ viewsExtra: 0, likesExtra: 0, duration: 0 })

  // Conectar Socket.IO cuando hay token
  useEffect(() => {
    if (accessToken) {
      try {
        connectSocket(accessToken)
      } catch (error) {
        // No bloquear la app si Socket.IO falla
        console.error('Error al conectar Socket.IO:', error)
      }
    }

    return () => {
      try {
        disconnectSocket()
      } catch (error) {
        console.error('Error al desconectar Socket.IO:', error)
      }
    }
  }, [accessToken])

  useEffect(() => {
    loadPendingRequests()
    loadRoamStatus()
    const interval = setInterval(() => {
      loadPendingRequests()
      loadRoamStatus()
    }, 30000) // Check every 30s
    return () => clearInterval(interval)
  }, [])

  // Forzar que el menú inferior siempre esté fijo - ABSOLUTAMENTE FIJO
  useEffect(() => {
    const nav = document.getElementById('bottom-nav-fixed') || document.querySelector('nav[class*="fixed bottom-0"]') as HTMLElement
    if (nav) {
      // Forzar estilos inline con !important usando setProperty
      nav.style.setProperty('position', 'fixed', 'important')
      nav.style.setProperty('bottom', '0', 'important')
      nav.style.setProperty('left', '0', 'important')
      nav.style.setProperty('right', '0', 'important')
      nav.style.setProperty('top', 'auto', 'important')
      nav.style.setProperty('z-index', '9999', 'important')
      nav.style.setProperty('transform', 'translateZ(0)', 'important')
      nav.style.setProperty('will-change', 'transform', 'important')
      nav.style.setProperty('margin-top', '0', 'important')
      nav.style.setProperty('margin-bottom', '0', 'important')
      nav.style.setProperty('margin-left', '0', 'important')
      nav.style.setProperty('margin-right', '0', 'important')
      
      // Prevenir cualquier movimiento
      const observer = new MutationObserver(() => {
        if (nav.style.position !== 'fixed') {
          nav.style.setProperty('position', 'fixed', 'important')
        }
        if (nav.style.bottom !== '0px') {
          nav.style.setProperty('bottom', '0', 'important')
        }
      })
      
      observer.observe(nav, {
        attributes: true,
        attributeFilter: ['style', 'class'],
      })
      
      return () => observer.disconnect()
    }
  }, [location.pathname])

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
      {/* Header - SIEMPRE FIJO */}
      <header 
        className="bg-gray-900 z-40"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      >
        <div className="max-w-7xl mx-auto px-3 flex items-center justify-between h-14">
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

      {/* Main content - Con padding para header y footer fijos */}
      <main className="flex-1 pb-20 pt-14">
        <Outlet />
      </main>

      {/* Bottom navigation - SIEMPRE FIJO - NO SE MUEVE */}
      <nav 
        id="bottom-nav-fixed"
        className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50"
        style={{ 
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          top: 'auto',
          zIndex: 9999,
          transform: 'translateZ(0)',
          willChange: 'transform',
          marginTop: 0,
          marginBottom: 0,
          marginLeft: 0,
          marginRight: 0,
        } as React.CSSProperties}
      >
        <div className="max-w-7xl mx-auto px-2">
          <div className="flex justify-around">
            {navItems.map((item) => {
              const Icon = item.Icon
              // Solo activo si es exactamente la ruta (no incluye subrutas como /app/profile/:id)
              const active = location.pathname === item.path || (item.path === '/app' && location.pathname === '/app')
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

      {/* Notificación de Match */}
      <MatchNotification />
    </div>
  )
}

