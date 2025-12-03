import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import { useNotificationStore } from '@/store/notificationStore'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import Modal from '@/components/common/Modal'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Image, MapPin, Lock } from 'lucide-react'
import { getSocket } from '@/services/socket'

export default function ChatPage() {
  const { profileId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { decrementUnreadMessagesCount } = useNotificationStore()
  const [profile, setProfile] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [myPhotos, setMyPhotos] = useState<any[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Scroll al inicio de la página
    window.scrollTo(0, 0)
    document.body.scrollTop = 0
    
    loadProfile()
    loadMessages()
    loadMyPhotos()
  }, [profileId])

  // Polling cada segundo para recibir mensajes nuevos (respaldo de Socket.IO)
  useEffect(() => {
    if (!profileId) return

    // Esperar 1 segundo antes de empezar el polling para no sobrecargar
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        loadMessages(true) // Carga silenciosa (no muestra loading, no marca como leídos automáticamente)
      }, 1000) // Cada 1 segundo

      return () => {
        clearInterval(interval)
      }
    }, 1000)

    return () => {
      clearTimeout(timeout)
    }
  }, [profileId])

  // Escuchar mensajes en tiempo real con Socket.IO
  useEffect(() => {
    const socket = getSocket()
    if (!socket || !profileId) return

    console.log('💬 ChatPage: Escuchando mensajes en tiempo real para:', profileId)

    const handleNewMessage = (message: any) => {
      console.log('📨 Nuevo mensaje recibido:', message)
      
      // Solo añadir si el mensaje es de este chat
      if (message.fromProfileId === profileId || message.toProfileId === profileId) {
        setMessages((prev) => {
          // Evitar duplicados
          const exists = prev.some((m) => m.id === message.id)
          if (exists) return prev
          
          return [...prev, message]
        })
        
        // Marcar como leído si es un mensaje recibido
        if (message.fromProfileId === profileId && !message.isRead) {
          api.put(`/messages/${profileId}/read`).then(() => {
            decrementUnreadMessagesCount()
          }).catch(console.error)
        }
      }
    }

    const handleMessageSent = (message: any) => {
      console.log('✅ Mensaje enviado confirmado:', message)
      // El mensaje ya se añadió al enviar, pero actualizamos por si acaso
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === message.id)
        if (exists) {
          return prev.map((m) => m.id === message.id ? message : m)
        }
        return [...prev, message]
      })
    }

    socket.on('new_message', handleNewMessage)
    socket.on('message_sent', handleMessageSent)

    return () => {
      socket.off('new_message', handleNewMessage)
      socket.off('message_sent', handleMessageSent)
    }
  }, [profileId, decrementUnreadMessagesCount])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadProfile = async () => {
    try {
      const response = await api.get(`/profile/${profileId}`)
      setProfile(response.data)
    } catch (error) {
      console.error('Error al cargar perfil:', error)
      navigate('/app/inbox')
    }
  }

  const loadMyPhotos = async () => {
    try {
      const response = await api.get('/profile/me')
      setMyPhotos(response.data.photos || [])
    } catch (error) {
      console.error('Error al cargar mis fotos:', error)
    }
  }

  const loadMessages = async (silent = false) => {
    try {
      const response = await api.get(`/messages/${profileId}`)
      const newMessages = response.data.messages
      
      // Solo actualizar si hay cambios para evitar re-renders innecesarios
      setMessages((prev) => {
        // Comparar por IDs para evitar actualizar si no hay cambios
        if (prev.length === newMessages.length && 
            prev.every((msg, idx) => msg.id === newMessages[idx]?.id && msg.isRead === newMessages[idx]?.isRead)) {
          return prev // No hay cambios, mantener estado anterior
        }
        return newMessages
      })
      
      // Contar mensajes no leídos antes de marcarlos
      const unreadCount = newMessages.filter((msg: any) => 
        !msg.isRead && msg.fromProfileId === profileId
      ).length
      
      // Marcar como leídos (solo si no es una carga silenciosa o si hay no leídos)
      if (!silent && unreadCount > 0) {
        await api.put(`/messages/${profileId}/read`)
        // Actualizar el contador
        for (let i = 0; i < unreadCount; i++) {
          decrementUnreadMessagesCount()
        }
      }
    } catch (error) {
      if (!silent) {
        console.error('Error al cargar mensajes:', error)
      }
    } finally {
      if (!silent) {
        setIsLoading(false)
      }
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim() || isSending) return

    setIsSending(true)
    try {
      const response = await api.post('/messages', {
        toProfileId: profileId,
        text: newMessage,
      })

      setMessages([...messages, response.data.data])
      setNewMessage('')
    } catch (error: any) {
      if (error.response?.data?.requiresPremium) {
        alert('Solo puedes chatear con usuarios de tu ciudad. Suscríbete a 9Plus para chatear con cualquiera.')
      } else {
        alert(error.response?.data?.error || 'Error al enviar mensaje')
      }
    } finally {
      setIsSending(false)
    }
  }

  const handleSendPhoto = async (photoId: string) => {
    setIsSending(true)
    try {
      const response = await api.post('/messages', {
        toProfileId: profileId,
        photoId: photoId,
      })

      setMessages([...messages, response.data.data])
      setShowPhotoModal(false)
    } catch (error: any) {
      if (error.response?.data?.requiresPremium) {
        alert('Solo puedes chatear con usuarios de tu ciudad. Suscríbete a 9Plus para chatear con cualquiera.')
      } else {
        alert(error.response?.data?.error || 'Error al enviar foto')
      }
    } finally {
      setIsSending(false)
    }
  }

  const handleSendLocation = async () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización')
      return
    }

    setIsSending(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {
          const response = await api.post('/messages', {
            toProfileId: profileId,
            location: { latitude, longitude },
          })
          setMessages([...messages, response.data.data])
        } catch (error: any) {
          alert(error.response?.data?.error || 'Error al enviar ubicación')
        } finally {
          setIsSending(false)
        }
      },
      () => {
        alert('No se pudo obtener tu ubicación')
        setIsSending(false)
      },
      {
        enableHighAccuracy: true, // Máxima precisión usando GPS
        timeout: 30000, // 30 segundos para obtener ubicación precisa
        maximumAge: 0, // No usar ubicación en caché, siempre obtener nueva
      }
    )
  }

  const handleDeleteConversation = async () => {
    try {
      await api.delete(`/messages/${profileId}`)
      navigate('/app/inbox')
    } catch (error) {
      console.error('Error al eliminar conversación:', error)
    }
  }

  if (isLoading || !profile) {
    return <LoadingSpinner />
  }

  const coverPhoto = profile.photos?.find((p: any) => p.type === 'cover')

  return (
    <>
      {/* Ocultar menú inferior cuando estemos en el chat */}
      <style>{`
        nav[class*="fixed bottom-0"] {
          display: none;
        }
        body, html {
          overflow: hidden !important;
          position: fixed !important;
          width: 100% !important;
        }
        main {
          padding: 0 !important;
          overflow: hidden !important;
          height: 100vh !important;
        }
      `}</style>
      
      <div className="flex flex-col bg-dark h-screen overflow-hidden relative" style={{ height: '100dvh' }}>
      {/* Header del Chat - FIJO EN LA PARTE SUPERIOR - DEBAJO DEL HEADER GLOBAL */}
      <div 
        className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between flex-shrink-0"
        style={{
          position: 'fixed',
          top: '56px', // Debajo del header global (56px de altura)
          left: 0,
          right: 0,
          zIndex: 45,
          height: '64px',
        }}
      >
        <button
          onClick={() => navigate('/app/inbox')}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ← Volver
        </button>

        <button
          onClick={() => navigate(`/app/profile/${profileId}`)}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800">
              {coverPhoto ? (
                <img
                  src={coverPhoto.url}
                  alt={profile.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600">
                  ?
                </div>
              )}
            </div>
            {profile.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-gray-900"></div>
            )}
          </div>
          <div className="text-left">
            <h2 className="font-semibold text-white">{profile.title}</h2>
            {profile.isOnline && (
              <p className="text-xs text-success">Online</p>
            )}
          </div>
        </button>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="text-gray-400 hover:text-red-500 transition-colors"
          title="Eliminar conversación"
        >
          🗑️
        </button>
      </div>

      {/* Mensajes - Con padding para header global + header del chat + input */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ paddingTop: '140px', paddingBottom: '120px' }}>
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No hay mensajes aún</p>
            <p className="text-gray-500 text-sm mt-2">Envía el primer mensaje</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.fromProfileId === user?.profile?.id
            const time = formatDistanceToNow(new Date(message.createdAt), {
              addSuffix: true,
              locale: es,
            })

            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    isOwn
                      ? 'bg-primary text-white'
                      : 'bg-gray-800 text-white'
                  }`}
                >
                  {message.text && <p>{message.text}</p>}
                  {message.photo && (
                    <img
                      src={message.photo.url}
                      alt="Foto"
                      className="rounded-lg mt-1 max-w-full cursor-pointer hover:opacity-90"
                      onClick={() => window.open(message.photo.url, '_blank')}
                    />
                  )}
                  {message.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>Ubicación compartida</span>
                      <a
                        href={`https://www.google.com/maps?q=${message.location.latitude},${message.location.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        Ver en mapa
                      </a>
                    </div>
                  )}
                  <p className="text-xs opacity-70 mt-1">{time}</p>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input de mensaje - FIJO EN LA PARTE INFERIOR */}
      <form 
        onSubmit={handleSendMessage} 
        className="bg-gray-900 border-t border-gray-800 flex-shrink-0"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 45,
          padding: '12px 16px',
          paddingBottom: `max(12px, calc(12px + env(safe-area-inset-bottom)))`, // Safe area para iOS
        }}
      >
        <div className="flex gap-2 items-center max-w-full">
          {/* Botón de fotos */}
          <button
            type="button"
            onClick={() => setShowPhotoModal(true)}
            className="bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700 transition-colors"
            title="Enviar foto"
            disabled={isSending}
          >
            <Image className="w-5 h-5" />
          </button>

          {/* Botón de ubicación */}
          <button
            type="button"
            onClick={handleSendLocation}
            className="bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700 transition-colors"
            title="Compartir ubicación"
            disabled={isSending}
          >
            <MapPin className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="bg-primary text-white rounded-full px-6 py-2 font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar
          </button>
        </div>
      </form>

      {/* Modal de selección de fotos */}
      <Modal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        title="Selecciona una foto para enviar"
        maxWidth="lg"
      >
        {myPhotos.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            No tienes fotos en tu perfil
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {myPhotos.map((photo) => (
              <div
                key={photo.id}
                className="relative aspect-square cursor-pointer group"
                onClick={() => handleSendPhoto(photo.id)}
              >
                <img
                  src={photo.url}
                  alt="Foto"
                  className="w-full h-full object-cover rounded-lg group-hover:opacity-80 transition-opacity"
                />
                {photo.type === 'private' && (
                  <div className="absolute top-2 right-2 bg-accent text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Privada
                  </div>
                )}
                {photo.type === 'cover' && (
                  <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-full text-xs font-bold">
                    Portada
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all flex items-center justify-center">
                  <span className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Enviar
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Modal de eliminar conversación */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Eliminar conversación"
        maxWidth="sm"
      >
        <p className="text-gray-300 mb-6">
          ¿Estás seguro de que quieres eliminar esta conversación? Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="flex-1 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleDeleteConversation}
            className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Eliminar
          </button>
        </div>
      </Modal>
      </div>
    </>
  )
}

