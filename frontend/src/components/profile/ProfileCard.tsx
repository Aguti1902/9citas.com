import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { api } from '@/services/api'
import { Heart, MapPin } from 'lucide-react'

interface ProfileCardProps {
  profile: any
  onLikeToggle?: () => void
}

export default function ProfileCard({ profile, onLikeToggle }: ProfileCardProps) {
  const navigate = useNavigate()
  const [isLiked, setIsLiked] = useState(profile.isLiked || false)
  const [isLiking, setIsLiking] = useState(false)

  const coverPhoto = profile.photos?.find((p: any) => p.type === 'cover')

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (isLiking) return
    setIsLiking(true)

    try {
      if (isLiked) {
        await api.delete(`/likes/${profile.id}`)
      } else {
        await api.post(`/likes/${profile.id}`)
      }
      setIsLiked(!isLiked)
      onLikeToggle?.()
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al dar like')
    } finally {
      setIsLiking(false)
    }
  }

  return (
    <div
      className="profile-card group"
      onClick={() => navigate(`/app/profile/${profile.id}`)}
    >
      {/* Imagen */}
      <div className="relative aspect-[3/4] bg-gray-800 overflow-hidden">
        {coverPhoto ? (
          <img
            src={coverPhoto.url}
            alt={profile.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <div className="text-center">
              <div className="text-6xl mb-2">👤</div>
              <p className="text-sm">Sin foto</p>
            </div>
          </div>
        )}

        {/* Overlay oscuro sutil en hover */}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

        {/* Botón de like */}
        <button
          onClick={handleLike}
          disabled={isLiking}
          className="absolute top-3 right-3 bg-black bg-opacity-60 backdrop-blur-sm rounded-full p-2.5 hover:bg-opacity-80 hover:scale-110 transition-all shadow-lg z-10"
        >
          <Heart
            className={`w-5 h-5 ${isLiked ? 'fill-primary text-primary' : 'text-white'}`}
            strokeWidth={2}
          />
        </button>

        {/* Indicador online */}
        {profile.isOnline && (
          <div className="absolute top-3 left-3 flex items-center bg-success bg-opacity-90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            <span className="text-xs text-white font-semibold">Online</span>
          </div>
        )}

        {/* Info con gradiente mejorado */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 pt-8">
          <h3 className="text-white font-bold text-lg leading-tight mb-1">
            {profile.title}, {profile.age}
          </h3>
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <MapPin className="w-3.5 h-3.5" />
            <span>{profile.city}</span>
          </div>
          {profile.distance !== null && profile.distance !== undefined && (
            <p className="text-accent text-sm font-semibold mt-1">
              📍 A {profile.distance} km
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

