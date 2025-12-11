import { useState, useEffect } from 'react'
import { api } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import ProfileCard from '@/components/profile/ProfileCard'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/common/Button'
import { Bookmark, Star } from 'lucide-react'

export default function FavoritesPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [favorites, setFavorites] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const isPremium = user?.subscription?.isActive || false

  useEffect(() => {
    if (isPremium) {
      loadFavorites()
    } else {
      setIsLoading(false)
    }
  }, [isPremium, user?.subscription])

  const loadFavorites = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/favorites')
      setFavorites(response.data.favorites.map((fav: any) => ({
        ...fav.targetProfile,
        favoriteId: fav.id,
      })))
    } catch (error: any) {
      console.error('Error al cargar favoritos:', error)
      if (error.response?.status === 403 && error.response?.data?.requiresPremium) {
        // No es premium, mostrar mensaje
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFavorite = async (profileId: string) => {
    try {
      await api.delete(`/favorites/${profileId}`)
      // Recargar favoritos
      loadFavorites()
    } catch (error) {
      console.error('Error al quitar de favoritos:', error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
        <Bookmark className="text-primary" size={32} />
        Favoritos
      </h1>
      <p className="text-gray-400 mb-6">
        Perfiles con los que estás chateando activamente
      </p>

      {/* Aviso para usuarios no premium */}
      {!isPremium && (
        <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 mb-6">
          <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
            <Bookmark className="text-white" size={24} />
            Esta función es exclusiva de 9Plus
          </h3>
          <p className="text-white mb-4">
            Guarda tus perfiles favoritos con los que chateas para acceder a ellos rápidamente. 
            Solo verás perfiles con los que tienes conversaciones activas.
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
      {!isPremium ? null : isLoading ? (
        <LoadingSpinner />
      ) : favorites.length === 0 ? (
        <div className="text-center py-12">
          <Bookmark className="text-gray-600 mx-auto mb-4" size={64} />
          <p className="text-gray-400 text-lg mb-2">
            Aún no tienes favoritos
          </p>
          <p className="text-gray-500 text-sm">
            Los perfiles con los que chateas aparecerán aquí cuando los agregues a favoritos
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {favorites.map((profile: any) => (
            <div key={profile.id} className="relative">
              <ProfileCard
                profile={profile}
                onLikeToggle={loadFavorites}
                isPremium={isPremium}
              />
              <button
                onClick={() => handleRemoveFavorite(profile.id)}
                className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white rounded-full p-2 transition-colors z-10"
                title="Quitar de favoritos"
              >
                <Bookmark className="fill-current" size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

