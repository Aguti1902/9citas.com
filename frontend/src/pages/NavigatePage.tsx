import { useState, useEffect } from 'react'
import { api } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import { showToast } from '@/store/toastStore'
import SwipeCard from '@/components/profile/SwipeCard'
import PremiumPromoCard from '@/components/profile/PremiumPromoCard'
import ProfileCard from '@/components/profile/ProfileCard'
import FilterBar from '@/components/common/FilterBar'
import LocationSelector from '@/components/common/LocationSelector'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'
import RoamStatusContent from '@/components/common/RoamStatusContent'
import { useNavigate } from 'react-router-dom'
import { LayoutGrid, Layers, Zap, Share2 } from 'lucide-react'

export default function NavigatePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [profiles, setProfiles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showRoamModal, setShowRoamModal] = useState(false)
  const [showRoamSuccessModal, setShowRoamSuccessModal] = useState(false)
  const [showRoamStatusModal, setShowRoamStatusModal] = useState(false)
  const [roamStatus, setRoamStatus] = useState<any>(null)
  const [viewMode, setViewMode] = useState<'swipe' | 'grid'>('swipe')
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0)
  const [swipeCount, setSwipeCount] = useState(0)
  const [showPromoCard, setShowPromoCard] = useState(false)
  const [currentCity, setCurrentCity] = useState(user?.profile?.city || 'Madrid')
  const [ageRange, setAgeRange] = useState({ min: 18, max: 99 })
  const [distanceRange, setDistanceRange] = useState({ min: 1, max: 50 })
  const [filterParams, setFilterParams] = useState<any>({})

  const isPremium = user?.subscription?.isActive || false

  const loadProfiles = async (filter: string = 'all', params: any = {}) => {
    setIsLoading(true)
    try {
      const queryParams: any = { filter }
      
      // Añadir parámetros de filtros si existen
      if (params.ageMin || params.ageMax) {
        queryParams.ageMin = params.ageMin
        queryParams.ageMax = params.ageMax
      }
      
      if (params.distanceMin || params.distanceMax) {
        queryParams.distanceMin = params.distanceMin
        queryParams.distanceMax = params.distanceMax
      }

      const response = await api.get('/profile/search', {
        params: queryParams,
      })
      setProfiles(response.data.profiles)
    } catch (error: any) {
      if (error.response?.data?.requiresPremium) {
        setShowPremiumModal(true)
      } else {
        console.error('Error al cargar perfiles:', error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProfiles(activeFilter, filterParams)
    loadRoamStatus()
    const interval = setInterval(loadRoamStatus, 30000) // Check every 30s
    return () => clearInterval(interval)
  }, [activeFilter, filterParams])

  const loadRoamStatus = async () => {
    try {
      const response = await api.get('/roam/status')
      setRoamStatus(response.data)
    } catch (error) {
      console.error('Error loading roam status:', error)
    }
  }

  const handleFilterChange = (filter: string, params?: any) => {
    setActiveFilter(filter)
    if (params) {
      setFilterParams(params)
    } else {
      setFilterParams({})
    }
  }

  const handlePremiumRequired = () => {
    setShowPremiumModal(true)
  }

  const handleLocationChange = async (city: string, lat: number, lng: number) => {
    setCurrentCity(city)
    // Actualizar ubicación en el backend
    try {
      await api.put('/profile', {
        city,
        latitude: lat,
        longitude: lng,
      })
      // Recargar perfiles con la nueva ubicación
      loadProfiles(activeFilter)
    } catch (error) {
      console.error('Error al actualizar ubicación:', error)
    }
  }

  const handleShare = () => {
    const shareData = {
      title: '9citas.com',
      text: '¡Únete a 9citas! La mejor forma de conocer gente cerca de ti',
      url: window.location.origin,
    }

    if (navigator.share) {
      navigator.share(shareData).catch((err) => console.log('Error al compartir:', err))
    } else {
      setShowShareModal(true)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const handleSwipeLeft = async () => {
    // Incrementar contador de swipes
    const newCount = swipeCount + 1
    setSwipeCount(newCount)
    
    // Mostrar card promocional cada 10 swipes (solo usuarios free)
    if (!isPremium && newCount % 10 === 0) {
      setShowPromoCard(true)
      return
    }
    
    // Pasar al siguiente perfil
    if (currentProfileIndex < profiles.length - 1) {
      setCurrentProfileIndex(prev => prev + 1)
    } else {
      // Cargar más perfiles
      await loadProfiles(activeFilter)
      setCurrentProfileIndex(0)
    }
  }

  const handleSwipeRight = async () => {
    const currentProfile = profiles[currentProfileIndex]
    
    // Dar like
    try {
      await api.post(`/likes/${currentProfile.id}`)
    } catch (error) {
      console.error('Error al dar like:', error)
    }
    
    // Siguiente perfil
    handleSwipeLeft()
  }

  const handleClosePromoCard = () => {
    setShowPromoCard(false)
    
    // Continuar con el siguiente perfil
    if (currentProfileIndex < profiles.length - 1) {
      setCurrentProfileIndex(prev => prev + 1)
    } else {
      loadProfiles(activeFilter)
      setCurrentProfileIndex(0)
    }
  }

  const currentProfile = profiles[currentProfileIndex]

  return (
    <div className="pb-4 overflow-hidden">
      {/* Ubicación + Botones especiales - OPTIMIZADO MÓVIL */}
      <div className="bg-gray-900 sticky top-[56px] z-30 -mt-[56px]">
        {/* Fila 1: Ubicación y botones */}
        <div className="flex items-center justify-between px-3 py-2 gap-2">
          {/* Selector de ubicación */}
          <LocationSelector
            currentCity={currentCity}
            onLocationChange={handleLocationChange}
          />
          
          {/* Botones especiales - Más pequeños en móvil */}
          <div className="flex items-center gap-1.5">
            {/* Botón Roam - cambia según estado */}
            <button
              onClick={() => {
                if (roamStatus?.isActive) {
                  setShowRoamStatusModal(true)
                } else if (!isPremium) {
                  setShowPremiumModal(true)
                } else {
                  setShowRoamModal(true)
                }
              }}
              className={`${
                roamStatus?.isActive
                  ? 'bg-gradient-to-r from-accent to-yellow-500 px-4 py-2 rounded-full'
                  : 'w-10 h-10 bg-accent rounded-full'
              } flex items-center justify-center gap-2 hover:scale-105 transition-transform border-2 border-yellow-300 shadow-lg flex-shrink-0 relative`}
              title={roamStatus?.isActive ? 'Roam activado - Ver estado' : 'Activar Roam'}
            >
              <Zap className="w-5 h-5 text-gray-900" fill="currentColor" strokeWidth={0} />
              {roamStatus?.isActive && (
                <>
                  <span className="text-gray-900 font-bold text-sm whitespace-nowrap hidden sm:inline">
                    Roam activado
                  </span>
                  <div className="absolute -top-1 -right-1">
                    <div className="relative">
                      <div className="w-3 h-3 bg-success rounded-full animate-ping absolute"></div>
                      <div className="w-3 h-3 bg-success rounded-full"></div>
                    </div>
                  </div>
                </>
              )}
            </button>

            {/* Botón Compartir */}
            <button
              onClick={handleShare}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-success rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg flex-shrink-0"
              title="Compartir"
            >
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>

            {/* Toggle vista - Visible siempre */}
            <button
              onClick={() => setViewMode(viewMode === 'swipe' ? 'grid' : 'swipe')}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-700 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg flex-shrink-0"
              title={viewMode === 'swipe' ? 'Vista cuadrícula' : 'Vista swipe'}
            >
              {viewMode === 'swipe' ? (
                <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              ) : (
                <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Fila 2: Filtros */}
        <div className="px-2 pb-2">
          <FilterBar
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            isPremium={isPremium}
            onPremiumRequired={handlePremiumRequired}
            ageRange={ageRange}
            distanceRange={distanceRange}
            onAgeRangeChange={(min, max) => {
              setAgeRange({ min, max })
            }}
            onDistanceRangeChange={(min, max) => {
              setDistanceRange({ min, max })
            }}
          />
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 pt-4 h-full">
        {isLoading ? (
          <LoadingSpinner />
        ) : profiles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No hay perfiles disponibles en este momento
            </p>
          </div>
        ) : viewMode === 'swipe' ? (
          // Vista Swipe tipo Tinder
          <div className="relative max-w-md mx-auto h-[calc(100vh-250px)]">
            {showPromoCard ? (
              // Card promocional de 9Plus
              <PremiumPromoCard onClose={handleClosePromoCard} />
            ) : currentProfile ? (
              <>
                <SwipeCard
                  key={currentProfile.id}
                  profile={currentProfile}
                  onSwipeLeft={handleSwipeLeft}
                  onSwipeRight={handleSwipeRight}
                  onProfileClick={() => navigate(`/app/profile/${currentProfile.id}`)}
                />
                
                {/* Contador */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold z-10">
                  {currentProfileIndex + 1} / {profiles.length}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  ¡Has visto todos los perfiles!
                </h3>
                <p className="text-gray-400 mb-6">
                  Cambia los filtros o vuelve más tarde para ver nuevos perfiles
                </p>
                <Button
                  variant="primary"
                  onClick={() => {
                    setCurrentProfileIndex(0)
                    loadProfiles(activeFilter)
                  }}
                >
                  Recargar perfiles
                </Button>
              </div>
            )}
          </div>
        ) : (
          // Vista Grid (original)
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onLikeToggle={() => loadProfiles(activeFilter)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de Premium requerido */}
      <Modal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        title="9Plus Requerido"
        maxWidth="sm"
      >
        <div className="text-center space-y-4">
          <p className="text-gray-300">
            Esta función está disponible solo para usuarios 9Plus
          </p>
          <Button
            fullWidth
            variant="accent"
            onClick={() => {
              setShowPremiumModal(false)
              navigate('/app/plus')
            }}
          >
            Ver planes 9Plus
          </Button>
          <button
            onClick={() => setShowPremiumModal(false)}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </Modal>

      {/* Modal de Cerrar sesión */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Cerrar sesión"
        maxWidth="sm"
      >
        <div className="text-center space-y-4">
          <p className="text-gray-300">
            ¿Estás seguro de que quieres cerrar sesión?
          </p>
          <div className="flex gap-3">
            <Button
              fullWidth
              variant="outline"
              onClick={() => setShowLogoutModal(false)}
            >
              Cancelar
            </Button>
            <Button
              fullWidth
              variant="danger"
              onClick={handleLogout}
            >
              Salir
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de Compartir */}
      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Compartir 9citas"
        maxWidth="sm"
      >
        <div className="space-y-3">
          <p className="text-gray-300 text-center mb-4">
            ¡Comparte 9citas con tus amigos!
          </p>
          <Button
            fullWidth
            onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('¡Únete a 9citas! ' + window.location.origin)}`, '_blank')}
          >
            WhatsApp
          </Button>
          <Button
            fullWidth
            onClick={() => window.open(`https://telegram.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent('¡Únete a 9citas!')}`, '_blank')}
          >
            Telegram
          </Button>
          <Button
            fullWidth
            onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`, '_blank')}
          >
            Facebook
          </Button>
          <Button
            fullWidth
            onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('¡Únete a 9citas!')}&url=${encodeURIComponent(window.location.origin)}`, '_blank')}
          >
            X (Twitter)
          </Button>
        </div>
      </Modal>

      {/* Modal de Roam */}
      <Modal
        isOpen={showRoamModal}
        onClose={() => setShowRoamModal(false)}
        title="Función Roam ⚡"
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            <strong className="text-accent">Aumenta tu visibilidad 10x</strong> durante 1 hora y aparece en los primeros resultados para todos los usuarios.
          </p>
          
          <div className="bg-gradient-to-r from-accent/10 to-yellow-500/10 border border-accent/30 rounded-lg p-4">
            <h4 className="text-white font-bold mb-3">Beneficios del Roam:</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-success">✓</span>
                <span>10x más visualizaciones de perfil</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-success">✓</span>
                <span>Apareces primero en los resultados</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-success">✓</span>
                <span>Más likes y matches</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-success">✓</span>
                <span>Resumen de métricas al finalizar</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold">Duración:</span>
              <span className="text-accent font-bold">1 hora</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">Precio:</span>
              <span className="text-accent font-bold text-2xl">6,49€</span>
            </div>
          </div>

          <Button
            fullWidth
            variant="accent"
            onClick={async () => {
              try {
                await api.post('/roam/activate', { duration: 60 })
                setShowRoamModal(false)
                setShowRoamSuccessModal(true)
                setTimeout(() => {
                  window.location.reload() // Recargar para mostrar el widget
                }, 2000)
              } catch (error: any) {
                if (error.response?.data?.requiresPremium) {
                  setShowRoamModal(false)
                  setShowPremiumModal(true)
                } else {
                  showToast(error.response?.data?.error || 'Error al activar Roam', 'error')
                }
              }
            }}
          >
            Activar Roam - 6,49€
          </Button>
        </div>
      </Modal>

      {/* Modal de éxito de Roam */}
      <Modal
        isOpen={showRoamSuccessModal}
        onClose={() => setShowRoamSuccessModal(false)}
        title=""
        maxWidth="sm"
      >
        <div className="text-center py-6">
          <div className="mb-4 inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-accent to-yellow-500 rounded-full">
            <Zap className="w-10 h-10 text-gray-900" fill="currentColor" strokeWidth={0} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">
            ¡Roam Activado!
          </h3>
          <p className="text-gray-300 mb-4">
            Tu perfil tendrá <strong className="text-accent">10x más visibilidad</strong> durante la próxima hora.
          </p>
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-lg p-4">
            <p className="text-white font-semibold mb-2">🚀 Beneficios activos:</p>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>✓ Apareces 10 veces más en búsquedas</li>
              <li>✓ Prioridad en resultados</li>
              <li>✓ Resumen de métricas al finalizar</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* Modal de estado de Roam (cuando está activo y hace click en el botón) */}
      {roamStatus?.isActive && roamStatus?.roamingUntil && showRoamStatusModal && (
        <Modal
          isOpen={showRoamStatusModal}
          onClose={() => setShowRoamStatusModal(false)}
          title=""
          maxWidth="md"
        >
          <RoamStatusContent
            roamingUntil={new Date(roamStatus.roamingUntil)}
            onClose={() => setShowRoamStatusModal(false)}
          />
        </Modal>
      )}
    </div>
  )
}

