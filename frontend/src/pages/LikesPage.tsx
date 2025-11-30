import { useState, useEffect } from 'react'
import { api } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import ProfileCard from '@/components/profile/ProfileCard'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/common/Button'

export default function LikesPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [sentLikes, setSentLikes] = useState<any[]>([])
  const [receivedLikes, setReceivedLikes] = useState<any[]>([])
  const [receivedLikesTotal, setReceivedLikesTotal] = useState(0)
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('received')
  const [isLoading, setIsLoading] = useState(true)

  const isPremium = user?.subscription?.isActive || false

  useEffect(() => {
    loadLikes()
  }, [])

  const loadLikes = async () => {
    setIsLoading(true)
    try {
      const [sentResponse, receivedResponse] = await Promise.all([
        api.get('/likes/sent'),
        api.get('/likes/received'),
      ])
      
      setSentLikes(sentResponse.data.likes.map((like: any) => ({
        ...like.toProfile,
        isLiked: true,
      })))
      
      // Guardar total de likes recibidos
      setReceivedLikesTotal(receivedResponse.data.total || 0)
      
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
    } catch (error) {
      console.error('Error al cargar likes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const currentProfiles = activeTab === 'sent' ? sentLikes : receivedLikes

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-white mb-6">Me gusta</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-800">
        <button
          onClick={() => setActiveTab('received')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'received'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Recibidos {receivedLikesTotal > 0 && `(${receivedLikesTotal})`}
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'sent'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Enviados {sentLikes.length > 0 && `(${sentLikes.length})`}
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
            {activeTab === 'sent'
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

