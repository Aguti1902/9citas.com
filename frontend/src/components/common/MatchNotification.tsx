import { useEffect, useState } from 'react'
import { Heart, X } from 'lucide-react'
import { getSocket } from '@/services/socket'
import { useNavigate } from 'react-router-dom'

interface MatchProfile {
  id: string
  title: string
  age?: number
  photos?: { url: string }[]
}

interface MatchNotificationData {
  matchProfile: MatchProfile
  myProfile: {
    id: string
    title: string
  }
}

export default function MatchNotification() {
  const [match, setMatch] = useState<MatchNotificationData | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const handleNewMatch = (data: MatchNotificationData) => {
      setMatch(data)
      setIsVisible(true)

      // Auto-ocultar después de 10 segundos
      setTimeout(() => {
        setIsVisible(false)
      }, 10000)
    }

    socket.on('new_match', handleNewMatch)

    return () => {
      socket.off('new_match', handleNewMatch)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
  }

  const handleViewMatch = () => {
    if (match) {
      setIsVisible(false)
      navigate('/app/likes')
    }
  }

  if (!isVisible || !match) return null

  const coverPhoto = match.matchProfile.photos?.[0]?.url || '/logo.png'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-fade-in">
      <div className="bg-gray-900 rounded-2xl p-6 max-w-sm w-full border-2 border-primary shadow-2xl animate-scale-in">
        {/* Header con corazón */}
        <div className="flex items-center justify-center mb-4">
          <div className="bg-primary/20 rounded-full p-4">
            <Heart className="w-12 h-12 text-primary fill-primary animate-pulse" />
          </div>
        </div>

        {/* Título */}
        <h2 className="text-2xl font-bold text-white text-center mb-2">
          ¡MATCH! 💕
        </h2>
        <p className="text-gray-400 text-center mb-6">
          Tú y {match.matchProfile.title} se han gustado
        </p>

        {/* Foto del match */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <img
              src={coverPhoto}
              alt={match.matchProfile.title}
              className="w-32 h-32 rounded-full object-cover border-4 border-primary"
            />
            <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-2">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
          </div>
        </div>

        {/* Información */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white mb-1">
            {match.matchProfile.title}
            {match.matchProfile.age && (
              <span className="text-gray-400 font-normal">, {match.matchProfile.age}</span>
            )}
          </h3>
        </div>

        {/* Botones */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" />
            Cerrar
          </button>
          <button
            onClick={handleViewMatch}
            className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-xl font-semibold transition-colors"
          >
            Ver Match
          </button>
        </div>
      </div>
    </div>
  )
}

