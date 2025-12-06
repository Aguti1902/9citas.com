import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Logo from '../common/Logo'
import InstallPWA from '../common/InstallPWA'
import RoamSummaryModal from '../common/RoamSummaryModal'
import Toast from '../common/Toast'
import MatchNotification from '../common/MatchNotification'
import OnboardingTutorial from '../common/OnboardingTutorial'
import { useAuthStore } from '@/store/authStore'
import { useToastStore } from '@/store/toastStore'
import { useNotificationStore } from '@/store/notificationStore'
import { useState, useEffect } from 'react'
import Modal from '../common/Modal'
import { api } from '@/services/api'
import { connectSocket, disconnectSocket, getSocket } from '@/services/socket'
import { Search, MessageCircle, Heart, Star, Info, User, LogOut, Lock } from 'lucide-react'

export default function DashboardLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, accessToken, user } = useAuthStore()
  const { toasts, removeToast, addToast } = useToastStore()
  const { likesCount, unreadMessagesCount, setLikesCount, setUnreadMessagesCount, incrementLikesCount, incrementUnreadMessagesCount } = useNotificationStore()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [pendingRequests, setPendingRequests] = useState(0)
  const [showRoamSummary, setShowRoamSummary] = useState(false)
  const [roamSummary] = useState({ viewsExtra: 0, likesExtra: 0, duration: 0 })
  const [showOnboarding, setShowOnboarding] = useState(false)

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
    
    // Cargar notificaciones con un pequeño delay para que la página se monte primero
    // Esto evita que el badge aparezca al recargar si estamos en /app/likes
    setTimeout(() => {
      loadNotifications()
    }, 100)
    
    // Verificar si es la primera vez del usuario (mostrar tutorial)
    // SOLO mostrar si es REALMENTE la primera vez (justo después del registro)
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding')
    const isJustRegistered = sessionStorage.getItem('justRegistered') === 'true'
    
    if (!hasSeenOnboarding && isJustRegistered && user?.id) {
      // Limpiar el flag de registro
      sessionStorage.removeItem('justRegistered')
      // Esperar 1 segundo para que cargue todo antes de mostrar el tutorial
      setTimeout(() => {
        setShowOnboarding(true)
      }, 1000)
    }
    
    const interval = setInterval(() => {
      loadPendingRequests()
      loadRoamStatus()
      loadNotifications()
    }, 30000) // Check every 30s
    return () => clearInterval(interval)
  }, [user?.id])

  // Escuchar eventos de Socket.IO para notificaciones en tiempo real
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    // Escuchar nuevos likes
    const handleNewLike = (data: any) => {
      // Solo incrementar si NO estamos en la página de likes
      const currentPath = window.location.pathname
      if (!currentPath.includes('/app/likes')) {
        incrementLikesCount()
        addToast(`¡${data.fromProfile.title} te ha dado like! 💕`, 'success', 5000)
        
        // Actualizar el conteo en localStorage
        const currentCount = parseInt(localStorage.getItem('lastViewedLikesCount') || '0')
        localStorage.setItem('lastViewedLikesCount', (currentCount + 1).toString())
      }
    }

    // Escuchar nuevos mensajes
    const handleNewMessage = (message: any) => {
      // Solo incrementar si no estamos en la página de chat con ese usuario
      const currentPath = window.location.pathname
      const isInChat = currentPath.includes(`/app/chat/${message.fromProfileId}`)
      if (!isInChat) {
        incrementUnreadMessagesCount()
        addToast(`Nuevo mensaje de ${message.fromProfile.title}`, 'info', 4000)
      }
    }

    socket.on('new_like', handleNewLike)
    socket.on('new_message', handleNewMessage)

    return () => {
      socket.off('new_like', handleNewLike)
      socket.off('new_message', handleNewMessage)
    }
  }, [location.pathname, incrementLikesCount, incrementUnreadMessagesCount, addToast])

  const loadNotifications = async () => {
    try {
      // Cargar likes recibidos - SOLO si NO estamos en la página de likes
      // Si estamos en /app/likes, el contador ya se limpió y no debe actualizarse
      // Usar window.location.pathname para obtener la ruta actual en tiempo real
      const currentPath = window.location.pathname
      if (!currentPath.includes('/app/likes')) {
        const likesResponse = await api.get('/likes/received')
        const likesTotal = likesResponse.data.total || 0
        
        // Verificar si el usuario ya vio la página de likes
        const lastViewedLikesPage = localStorage.getItem('lastViewedLikesPage')
        const lastViewedLikesCount = localStorage.getItem('lastViewedLikesCount')
        
        if (lastViewedLikesPage) {
          // Si ya vio la página, solo mostrar badge si hay NUEVOS likes
          const previousCount = parseInt(lastViewedLikesCount || '0')
          const newLikesCount = Math.max(0, likesTotal - previousCount)
          setLikesCount(newLikesCount)
        } else {
          // Primera vez, mostrar todos los likes
          setLikesCount(likesTotal)
        }
        
        // Guardar el conteo actual para futuras comparaciones
        localStorage.setItem('lastViewedLikesCount', likesTotal.toString())
      }

      // Cargar mensajes no leídos
      const conversationsResponse = await api.get('/messages/conversations')
      const conversations = conversationsResponse.data.conversations || []
      const totalUnread = conversations.reduce((sum: number, conv: any) => sum + (conv.unreadCount || 0), 0)
      setUnreadMessagesCount(totalUnread)
    } catch (error) {
      console.error('Error loading notifications:', error)
    }
  }

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
      {/* Header - CONTROLADO POR CSS - SIN CLASES DE TAILWIND QUE INTERFIERAN */}
      <header 
        className="dashboard-header bg-gray-900" 
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9998,
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
              <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
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

      {/* Bottom navigation - CONTROLADO POR CSS - SIN CLASES DE TAILWIND QUE INTERFIERAN */}
      <nav 
        id="bottom-nav-fixed"
        className="dashboard-footer bg-gray-900 border-t border-gray-800"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
        }}
      >
        <div className="max-w-7xl mx-auto px-2">
          <div className="flex justify-around">
            {navItems.map((item) => {
              const Icon = item.Icon
              // Solo activo si es exactamente la ruta (no incluye subrutas como /app/profile/:id)
              const active = location.pathname === item.path || (item.path === '/app' && location.pathname === '/app')
              
              // Determinar si mostrar badge
              let badgeCount = 0
              // NO mostrar badge de likes si estamos actualmente en la página de likes
              if (item.path === '/app/likes' && likesCount > 0 && !location.pathname.includes('/app/likes')) {
                badgeCount = likesCount
              } else if (item.path === '/app/inbox' && unreadMessagesCount > 0) {
                badgeCount = unreadMessagesCount
              }
              
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`nav-bottom-item relative ${active ? 'active' : ''}`}
                >
                  <div className="relative inline-block">
                    <Icon className={`w-6 h-6 mb-1 ${active ? 'text-primary' : ''}`} />
                    {badgeCount > 0 && (
                      <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center transform translate-x-1/2 -translate-y-1/2 border-2 border-gray-900">
                        {badgeCount > 9 ? '9+' : badgeCount}
                      </span>
                    )}
                  </div>
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

      {/* Tutorial de bienvenida (solo primera vez) */}
      {showOnboarding && (
        <OnboardingTutorial
          onComplete={() => {
            setShowOnboarding(false)
            localStorage.setItem('hasSeenOnboarding', 'true')
          }}
        />
      )}
    </div>
  )
}

