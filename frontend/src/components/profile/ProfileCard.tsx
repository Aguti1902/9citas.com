import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { api } from '@/services/api'
import { Heart, MapPin, Clock } from 'lucide-react'
import { formatLastSeen } from '@/utils/timeUtils'

interface ProfileCardProps {
  profile: any
  onLikeToggle?: () => void
  isPremium?: boolean // Para verificar si puede ver ubicación
}

export default function ProfileCard({ profile, onLikeToggle, isPremium = false }: ProfileCardProps) {
  const navigate = useNavigate()
  const [isLiked, setIsLiked] = useState(profile.isLiked || false)
  const [isLiking, setIsLiking] = useState(false)

  const coverPhoto = profile.photos?.find((p: any) => p.type === 'cover')

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    
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

  const handleCardClick = (e: React.MouseEvent) => {
    // Solo navegar si el click no viene del botón de like
    const clickedButton = (e.target as HTMLElement).closest('button')
    if (clickedButton) {
      return
    }
    
    e.preventDefault()
    e.stopPropagation()
    
    navigate(`/app/profile/${profile.id}`, { replace: false })
  }

  return (
    <div
      className="profile-card group cursor-pointer"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          navigate(`/app/profile/${profile.id}`)
        }
      }}
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
          
          {/* Última conexión - SIEMPRE VISIBLE */}
          <div className="flex items-center gap-1.5 text-gray-300 text-xs mb-1">
            <Clock className="w-3 h-3" />
            <span className={profile.isOnline ? 'text-green-400 font-semibold' : ''}>
              {profile.isOnline ? '🟢 En línea' : formatLastSeen(profile.lastSeenAt)}
            </span>
          </div>

          {/* Mostrar ubicación SOLO si es usuario PREMIUM (9Plus) */}
          {isPremium && profile.showExactLocation !== false && (
            <>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <MapPin className="w-3.5 h-3.5" />
                <span>{profile.city}</span>
              </div>
              {profile.distance !== null && profile.distance !== undefined && (
                <p className="text-accent text-sm font-semibold mt-1">
                  📍 A {profile.distance} km
                </p>
              )}
            </>
          )}
          
          {/* Mensaje para usuarios gratis */}
          {!isPremium && (
            <div className="flex items-center gap-1.5 text-gray-400 text-xs">
              <MapPin className="w-3 h-3" />
              <span>🔒 Oculta (9Plus)</span>
            </div>
          )}

          {/* Género - SIEMPRE VISIBLE */}
          {profile.gender && (
            <div className="text-gray-300 text-xs mt-1">
              {formatGender(profile.gender)}
            </div>
          )}

          {/* Tipo de relación - SIEMPRE VISIBLE */}
          {profile.relationshipGoal && (
            <div className="text-gray-300 text-xs mt-1">
              {formatRelationshipGoal(profile.relationshipGoal)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

