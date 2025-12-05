import { useState, useEffect } from 'react'
import { api } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import { useNotificationStore } from '@/store/notificationStore'
import ProfileCard from '@/components/profile/ProfileCard'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/common/Button'

export default function LikesPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { setLikesCount } = useNotificationStore()
  const [sentLikes, setSentLikes] = useState<any[]>([])
  const [receivedLikes, setReceivedLikes] = useState<any[]>([])
  const [matches, setMatches] = useState<any[]>([])
  const [receivedLikesTotal, setReceivedLikesTotal] = useState(0)
  const [activeTab, setActiveTab] = useState<'matches' | 'sent' | 'received'>('matches')
  const [isLoading, setIsLoading] = useState(true)
  // Trackear qué tabs han sido vistos para ocultar sus contadores
  const [viewedTabs, setViewedTabs] = useState<Set<string>>(new Set(['matches'])) // matches se marca como visto al cargar

  const isPremium = user?.subscription?.isActive || false

  // Limpiar badge INMEDIATAMENTE al montar (incluso antes del useEffect)
  // Esto previene que aparezca al recargar la página
  setLikesCount(0)

  useEffect(() => {
    // Limpiar badge múltiples veces al inicio para asegurar que se borre
    setLikesCount(0)
    setTimeout(() => setLikesCount(0), 50)
    setTimeout(() => setLikesCount(0), 100)
    setTimeout(() => setLikesCount(0), 200)
    setTimeout(() => setLikesCount(0), 500)
    
    loadLikes()

    // Mantener el badge en 0 mientras estemos en esta página
    // Verificar cada 500ms por si el polling lo vuelve a incrementar
    const keepBadgeClear = setInterval(() => {
      setLikesCount(0)
    }, 500)

    return () => {
      clearInterval(keepBadgeClear)
    }
  }, [])

  const loadLikes = async () => {
    setIsLoading(true)
    try {
      const [sentResponse, receivedResponse, matchesResponse] = await Promise.all([
        api.get('/likes/sent'),
        api.get('/likes/received'),
        api.get('/likes/matches'),
      ])
      
      setSentLikes(sentResponse.data.likes.map((like: any) => ({
        ...like.toProfile,
        isLiked: true,
      })))
      
      // Guardar total de likes recibidos
      const total = receivedResponse.data.total || 0
      setReceivedLikesTotal(total)
      // NO actualizar el contador aquí - ya se limpió al entrar a la página
      // El contador solo debe incrementarse cuando llega un nuevo like por Socket.IO
      
      // Si es Premium, mostrar perfiles. Si es Free, array vacío (bloqueado)
      if (isPremium) {
        setReceivedLikes(receivedResponse.data.likes.map((like: any) => ({
          ...like.fromProfile,
        })))
      } else {
        // Para FREE: crear cards "bloqueadas" basadas en el total
        const blockedCount = Math.min(receivedResponse.data.total || 0, receivedResponse.data.freeLimit || 5)
        setReceivedLikes(Array(blockedCount).fill(null).map((_, i) => ({
          id: `blocked-${i}`,
          isBlocked: true,
        })))
      }
      
      // Cargar matches (likes mutuos) - disponible para todos los usuarios
      setMatches(matchesResponse.data.matches.map((match: any) => ({
        ...match.fromProfile,
        matchDate: match.createdAt,
      })))
    } catch (error) {
      console.error('Error al cargar likes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const currentProfiles = 
    activeTab === 'matches' ? matches :
    activeTab === 'sent' ? sentLikes : 
    receivedLikes

  // Función para cambiar de tab y marcar como visto
  const handleTabChange = (tab: 'matches' | 'sent' | 'received') => {
    setActiveTab(tab)
    setViewedTabs(prev => new Set([...prev, tab]))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-white mb-6">Me gusta</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-800 overflow-x-auto">
        <button
          onClick={() => handleTabChange('matches')}
          className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'matches'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          💕 Matches {matches.length > 0 && !viewedTabs.has('matches') && `(${matches.length})`}
        </button>
        <button
          onClick={() => handleTabChange('received')}
          className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'received'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Recibidos {receivedLikesTotal > 0 && !viewedTabs.has('received') && `(${receivedLikesTotal})`}
        </button>
        <button
          onClick={() => handleTabChange('sent')}
          className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'sent'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Enviados {sentLikes.length > 0 && !viewedTabs.has('sent') && `(${sentLikes.length})`}
        </button>
      </div>

      {/* Aviso para usuarios gratis */}
      {!isPremium && activeTab === 'received' && receivedLikesTotal > 0 && (
        <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 mb-6">
          <h3 className="text-white font-bold text-lg mb-2">
            🔒 {receivedLikesTotal} {receivedLikesTotal === 1 ? 'persona te ha dado' : 'personas te han dado'} "Me gusta"
          </h3>
          <p className="text-white mb-4">
            Suscríbete a 9Plus para ver quién te ha dado "Me gusta" y conectar con ellos
          </p>
          <Button
            variant="accent"
            onClick={() => navigate('/app/plus')}
          >
            Ver planes 9Plus
          </Button>
        </div>
      )}

      {/* Contenido */}
      {isLoading ? (
        <LoadingSpinner />
      ) : currentProfiles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            {activeTab === 'matches'
              ? 'Aún no tienes matches. ¡Da "Me gusta" a alguien para hacer match!'
              : activeTab === 'sent'
              ? 'Aún no has dado "Me gusta" a nadie'
              : 'Aún no has recibido ningún "Me gusta"'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {currentProfiles.map((profile: any) => {
            // Si es FREE y está bloqueado, mostrar card bloqueada
            if (!isPremium && activeTab === 'received' && profile.isBlocked) {
              return (
                <div
                  key={profile.id}
                  className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-800 border-2 border-gray-700 relative flex items-center justify-center"
                >
                  <div className="text-center p-4">
                    <div className="text-4xl mb-3">🔒</div>
                    <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-3"></div>
                    <div className="w-24 h-3 bg-gray-700 rounded mx-auto mb-2"></div>
                    <div className="w-20 h-3 bg-gray-700 rounded mx-auto"></div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-4">
                    <div className="bg-primary/20 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/50">
                      <span className="text-white text-xs font-semibold">9Plus para ver</span>
                    </div>
                  </div>
                </div>
              )
            }
            
            // Perfil normal
            return (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onLikeToggle={loadLikes}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

