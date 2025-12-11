import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/services/api'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import ProtectedImage from '@/components/common/ProtectedImage'

export default function InboxPage() {
  const navigate = useNavigate()
  const [conversations, setConversations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      const response = await api.get('/messages/conversations')
      setConversations(response.data.conversations)
    } catch (error) {
      console.error('Error al cargar conversaciones:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="px-4 py-6">
        <h1 className="text-3xl font-bold text-white mb-6">Buzón</h1>
      </div>

      {conversations.length === 0 ? (
        <div className="text-center py-12 px-4">
          <p className="text-gray-400 text-lg">
            Aún no tienes conversaciones
          </p>
          <p className="text-gray-500 mt-2">
            Empieza a chatear con los perfiles que te gusten
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-800">
          {conversations.map((conv) => {
            const coverPhoto = conv.profile.photos?.find((p: any) => p.type === 'cover')
            const timeAgo = formatDistanceToNow(new Date(conv.lastMessage.createdAt), {
              addSuffix: true,
              locale: es,
            })

            return (
              <button
                key={conv.profile.id}
                onClick={() => navigate(`/app/chat/${conv.profile.id}`)}
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-900 transition-colors"
              >
                {/* Foto de perfil */}
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-800">
                    {coverPhoto ? (
                      <ProtectedImage
                        src={coverPhoto.url}
                        alt={conv.profile.title}
                        className="w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        ?
                      </div>
                    )}
                  </div>
                  {conv.profile.isOnline && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-success rounded-full border-2 border-black"></div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-white truncate">
                      {conv.profile.title}
                    </h3>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {timeAgo}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 truncate">
                    {conv.lastMessage.text || '📷 Foto'}
                  </p>
                </div>

                {/* Badge de no leídos */}
                {conv.unreadCount > 0 && (
                  <div className="flex-shrink-0 bg-primary text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {conv.unreadCount}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

