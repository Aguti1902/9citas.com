import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import { showToast } from '@/store/toastStore'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import MatchModal from '@/components/common/MatchModal'
import { Lock, Eye } from 'lucide-react'

export default function ProfileDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [hasMatch, setHasMatch] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  
  // Resetear índice cuando cambia el perfil o las fotos públicas
  useEffect(() => {
    setCurrentPhotoIndex(0)
  }, [id, profile?.photos])
  const [privatePhotoAccess, setPrivatePhotoAccess] = useState<any>(null)
  const [showPrivatePhotosModal, setShowPrivatePhotosModal] = useState(false)
  const [isRequestingAccess, setIsRequestingAccess] = useState(false)
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [showMatchModal, setShowMatchModal] = useState(false)

  const isPremium = user?.subscription?.isActive || false

  useEffect(() => {
    loadProfile()
    checkPrivatePhotoAccess()
    checkMatch()
  }, [id])

  const loadProfile = async () => {
    if (!id) {
      console.error('❌ No hay ID de perfil')
      navigate('/app')
      return
    }
    
    try {
      const response = await api.get(`/profile/${id}`)
      console.log('📸 Perfil cargado:', {
        totalPhotos: response.data.photos?.length || 0,
        coverPhotos: response.data.photos?.filter((p: any) => p.type === 'cover').length || 0,
        privatePhotos: response.data.photos?.filter((p: any) => p.type === 'private').length || 0,
        privatePhotoAccess: response.data.privatePhotoAccess,
      })
      setProfile(response.data)
      setIsLiked(response.data.isLiked || false)
    } catch (error: any) {
      console.error('❌ Error al cargar perfil:', error)
      if (error.response?.status === 404) {
        showToast('Perfil no encontrado', 'error')
        navigate('/app')
      } else {
        showToast('Error al cargar el perfil', 'error')
        // No redirigir automáticamente para otros errores
      }
    } finally {
      setIsLoading(false)
    }
  }

  const checkMatch = async () => {
    try {
      // Verificar si ambos se han dado like
      const response = await api.get(`/likes/check/${id}`)
      setHasMatch(response.data.hasMatch || false)
    } catch (error) {
      console.error('Error al verificar match:', error)
    }
  }

  const checkPrivatePhotoAccess = async () => {
    try {
      const response = await api.get(`/private-photos/check/${id}`)
      setPrivatePhotoAccess(response.data)
    } catch (error) {
      console.error('Error al verificar acceso:', error)
    }
  }

  const handleRequestPrivatePhotoAccess = async () => {
    setIsRequestingAccess(true)
    try {
      await api.post(`/private-photos/request/${id}`)
      showToast('Solicitud enviada. El usuario recibirá una notificación.', 'success')
      await checkPrivatePhotoAccess()
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Error al solicitar acceso', 'error')
    } finally {
      setIsRequestingAccess(false)
    }
  }

  const handleLike = async () => {
    try {
      if (isLiked) {
        await api.delete(`/likes/${id}`)
        setIsLiked(false)
        setHasMatch(false)
      } else {
        // Dar like - el backend ahora retorna si hay match
        const response = await api.post(`/likes/${id}`)
        console.log('💚 Like dado, respuesta:', response.data)
        setIsLiked(true)
        
        // Si hay match → ¡MATCH! 💕
        if (response.data.isMatch) {
          console.log('🎉 MATCH detectado en handleLike!')
          setHasMatch(true)
          setShowMatchModal(true)
          // La notificación de Socket.IO también debería aparecer
        }
      }
      
      // Actualizar estado de match después de dar/quitar like
      await checkMatch()
    } catch (error: any) {
      console.error('❌ Error al dar like:', error)
      showToast(error.response?.data?.error || 'Error al dar like', 'error')
    }
  }

  const handleChat = () => {
    // Todos pueden chatear directamente (gratis y premium)
    // La única limitación es que usuarios gratis solo pueden ver/chatear con 50 usuarios máximo
    navigate(`/app/chat/${id}`)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Perfil no encontrado</p>
      </div>
    )
  }

  // IMPORTANTE: En el carrusel SOLO se muestran fotos públicas (no privadas)
  const publicPhotos = profile.photos?.filter((p: any) => p.type === 'cover') || []
  const photos = publicPhotos
  const currentPhoto = photos[currentPhotoIndex]
  
  // Separar fotos privadas para la sección de fotos privadas
  const privatePhotos = profile.photos?.filter((p: any) => p.type === 'private') || []
  
  // Todas las fotos (para el modal de fotos privadas)
  const allPhotos = profile.photos || []
  
  console.log('🖼️ Fotos procesadas:', {
    publicPhotos: photos.length,
    privatePhotos: privatePhotos.length,
    currentIndex: currentPhotoIndex,
  })

  return (
    <div className="max-w-4xl mx-auto pb-8">
      {/* Carrusel de fotos - Solo fotos públicas */}
      <div className="relative aspect-[3/4] bg-gray-900">
        {photos.length > 0 && currentPhoto ? (
          <>
            <img
              src={currentPhoto.url}
              alt={profile.title}
              className="w-full h-full object-cover"
            />

            {/* Navegación de fotos - Flechas mejoradas */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentPhotoIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentPhotoIndex === 0}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-full p-3 shadow-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 z-10 border-2 border-white/30 hover:border-white/50 hover:scale-110 disabled:hover:scale-100"
                  aria-label="Foto anterior"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentPhotoIndex((prev) => Math.min(photos.length - 1, prev + 1))}
                  disabled={currentPhotoIndex === photos.length - 1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-full p-3 shadow-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 z-10 border-2 border-white/30 hover:border-white/50 hover:scale-110 disabled:hover:scale-100"
                  aria-label="Foto siguiente"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Indicadores mejorados */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {photos.map((_: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPhotoIndex(index)}
                      className={`transition-all duration-200 rounded-full ${
                        index === currentPhotoIndex 
                          ? 'bg-white w-8 h-2 shadow-lg' 
                          : 'bg-white/50 w-2 h-2 hover:bg-white/70 hover:w-3'
                      }`}
                      aria-label={`Ir a foto ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            Sin fotos
          </div>
        )}
      </div>

      {/* Información */}
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              {profile.title}, {profile.age}
              {profile.isOnline && <span className="online-indicator"></span>}
            </h1>
            <p className="text-gray-400 mt-1">{profile.city}</p>
            {profile.distance && (
              <p className="text-gray-500 text-sm">A {profile.distance} km de ti</p>
            )}
          </div>
        </div>

        {/* Descripción */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Sobre mí</h2>
          <p className="text-gray-300">{profile.aboutMe}</p>
        </div>

        {/* Lo que busca */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Lo que busco</h2>
          <p className="text-gray-300">{profile.lookingFor}</p>
        </div>

        {/* Información detallada */}
        <div className="grid grid-cols-2 gap-4">
          {profile.height && (
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-gray-400 text-sm">Altura</p>
              <p className="text-white font-semibold">{profile.height} cm</p>
            </div>
          )}
          
          {profile.bodyType && (
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-gray-400 text-sm">Tipo de cuerpo</p>
              <p className="text-white font-semibold capitalize">{profile.bodyType}</p>
            </div>
          )}
          
          {profile.occupation && (
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-gray-400 text-sm">Profesión</p>
              <p className="text-white font-semibold">{profile.occupation}</p>
            </div>
          )}
          
          {profile.education && (
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-gray-400 text-sm">Estudios</p>
              <p className="text-white font-semibold capitalize">{profile.education}</p>
            </div>
          )}
          
          {profile.relationshipStatus && (
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-gray-400 text-sm">Estado civil</p>
              <p className="text-white font-semibold capitalize">{profile.relationshipStatus}</p>
            </div>
          )}
          
          {profile.children && (
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-gray-400 text-sm">Hijos</p>
              <p className="text-white font-semibold capitalize">{profile.children.replace('_', ' ')}</p>
            </div>
          )}
          
          {profile.pets && (
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-gray-400 text-sm">Mascotas</p>
              <p className="text-white font-semibold">{profile.pets}</p>
            </div>
          )}
          
          {profile.zodiacSign && (
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-gray-400 text-sm">Signo</p>
              <p className="text-white font-semibold capitalize">{profile.zodiacSign}</p>
            </div>
          )}
          
          {profile.smoking && (
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-gray-400 text-sm">Fumar</p>
              <p className="text-white font-semibold capitalize">{profile.smoking}</p>
            </div>
          )}
          
          {profile.drinking && (
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-gray-400 text-sm">Beber</p>
              <p className="text-white font-semibold capitalize">{profile.drinking}</p>
            </div>
          )}
        </div>

        {/* Hobbies */}
        {profile.hobbies && profile.hobbies.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">🎯 Intereses</h2>
            <div className="flex flex-wrap gap-2">
              {profile.hobbies.map((hobby: string) => (
                <span
                  key={hobby}
                  className="bg-primary bg-opacity-20 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary"
                >
                  {hobby}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Idiomas */}
        {profile.languages && profile.languages.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">🌍 Idiomas</h2>
            <div className="flex flex-wrap gap-2">
              {profile.languages.map((language: string) => (
                <span
                  key={language}
                  className="bg-secondary bg-opacity-20 text-secondary px-4 py-2 rounded-full text-sm font-medium border border-secondary"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Fotos Privadas - SIEMPRE mostrar si hay fotos privadas */}
        {privatePhotos.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-6 border-2 border-accent">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-accent" />
                Fotos Privadas ({privatePhotos.length})
              </h2>
            </div>
            
            {privatePhotoAccess?.hasAccess ? (
              // Tiene acceso - mostrar fotos
              <div className="grid grid-cols-2 gap-3">
                {privatePhotos.map((photo: any, index: number) => (
                    <div
                      key={photo.id}
                      className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => {
                        const photoIndex = allPhotos.findIndex((p: any) => p.id === photo.id)
                        setCurrentPhotoIndex(photoIndex >= 0 ? photoIndex : 0)
                        setShowPrivatePhotosModal(true)
                      }}
                    >
                      <img
                        src={photo.url}
                        alt={`Privada ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
              </div>
            ) : privatePhotoAccess?.status === 'pending' ? (
              // Solicitud pendiente - mostrar fotos borrosas
              <div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {privatePhotos.map((photo: any, index: number) => (
                      <div key={photo.id} className="aspect-square rounded-lg overflow-hidden relative">
                        <img
                          src={photo.url}
                          alt={`Privada ${index + 1}`}
                          className="w-full h-full object-cover filter blur-md"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                          <Lock className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    ))}
                </div>
                <div className="text-center">
                  <p className="text-white font-semibold mb-2">Solicitud Pendiente</p>
                  <p className="text-gray-400 text-sm">
                    Este usuario revisará tu solicitud pronto
                  </p>
                </div>
              </div>
            ) : privatePhotoAccess?.status === 'rejected' ? (
              // Solicitud rechazada - mostrar fotos borrosas
              <div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {privatePhotos.map((photo: any, index: number) => (
                      <div key={photo.id} className="aspect-square rounded-lg overflow-hidden relative">
                        <img
                          src={photo.url}
                          alt={`Privada ${index + 1}`}
                          className="w-full h-full object-cover filter blur-md"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                          <Lock className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    ))}
                </div>
                <div className="text-center">
                  <p className="text-white font-semibold mb-2">Solicitud Rechazada</p>
                  <p className="text-gray-400 text-sm">
                    El usuario no ha concedido acceso a sus fotos privadas
                  </p>
                </div>
              </div>
            ) : (
              // Sin solicitud - mostrar fotos borrosas y botón SOLO SI HAY MATCH
              <div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {privatePhotos.map((photo: any, index: number) => (
                      <div key={photo.id} className="aspect-square rounded-lg overflow-hidden relative">
                        <img
                          src={photo.url}
                          alt={`Privada ${index + 1}`}
                          className="w-full h-full object-cover filter blur-md"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                          <Lock className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    ))}
                </div>
                {hasMatch ? (
                  <div className="text-center">
                    <p className="text-white font-semibold mb-3">Fotos Privadas Bloqueadas</p>
                    <p className="text-gray-400 text-sm mb-4">
                      Tienes match con este usuario. Solicita acceso para ver sus fotos privadas.
                    </p>
                    <Button
                      variant="accent"
                      onClick={handleRequestPrivatePhotoAccess}
                      isLoading={isRequestingAccess}
                      className="flex items-center gap-2 mx-auto"
                    >
                      <Eye className="w-5 h-5" />
                      Solicitar Acceso
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-white font-semibold mb-2">Fotos Privadas</p>
                    <p className="text-gray-400 text-sm">
                      Necesitas hacer match con este usuario para solicitar acceso a sus fotos privadas
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-3">
          <Button
            fullWidth
            variant={isLiked ? 'outline' : 'primary'}
            onClick={handleLike}
            className="flex items-center justify-center gap-2"
          >
            {isLiked ? '❤️ Te gusta' : '🤍 Me gusta'}
          </Button>
          <Button
            fullWidth
            variant="secondary"
            onClick={handleChat}
            className="flex items-center justify-center gap-2"
          >
            💬 Chatear
          </Button>
        </div>

        {/* Botón volver */}
        <div className="text-center pt-4">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            ← Volver
          </button>
        </div>
      </div>

      {/* Modal fotos privadas */}
      <Modal
        isOpen={showPrivatePhotosModal}
        onClose={() => setShowPrivatePhotosModal(false)}
        title="Fotos Privadas"
        maxWidth="lg"
      >
        <div className="relative aspect-[3/4] max-h-[70vh]">
          <img
            src={photos[currentPhotoIndex]?.url}
            alt="Foto privada"
            className="w-full h-full object-contain"
          />
          
          {/* Navegación */}
          {photos.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between px-4">
              <button
                onClick={() => setCurrentPhotoIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentPhotoIndex === 0}
                className="bg-black bg-opacity-50 text-white rounded-full p-3 disabled:opacity-30 hover:bg-opacity-70"
              >
                ←
              </button>
              <button
                onClick={() => setCurrentPhotoIndex((prev) => Math.min(photos.length - 1, prev + 1))}
                disabled={currentPhotoIndex === photos.length - 1}
                className="bg-black bg-opacity-50 text-white rounded-full p-3 disabled:opacity-30 hover:bg-opacity-70"
              >
                →
              </button>
            </div>
          )}
          
          {/* Indicador */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full text-sm">
            {currentPhotoIndex + 1} / {photos.length}
          </div>
        </div>
      </Modal>

      {/* Modal Premium - Match requerido */}
      <Modal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        title="Match requerido"
        maxWidth="sm"
      >
        <div className="text-center py-4">
          <div className="text-6xl mb-4">💔</div>
          <h3 className="text-xl font-bold text-white mb-3">
            Necesitas un match para chatear
          </h3>
          <p className="text-gray-400 mb-6">
            Los usuarios Free solo pueden chatear cuando <strong>AMBOS</strong> se han dado "Me gusta".
          </p>
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <p className="text-white font-semibold mb-2">Con 9Plus puedes:</p>
            <ul className="text-left text-gray-300 text-sm space-y-2">
              <li>✅ Chatear con solo dar like</li>
              <li>✅ Ver quién te ha dado like</li>
              <li>✅ Filtrar por edad y online</li>
              <li>✅ Chatear en cualquier ciudad</li>
            </ul>
          </div>
          <div className="flex gap-3">
            <Button
              fullWidth
              variant="outline"
              onClick={() => setShowPremiumModal(false)}
            >
              Volver
            </Button>
            <Button
              fullWidth
              variant="accent"
              onClick={() => navigate('/app/plus')}
            >
              Ver 9Plus
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de Match - Estilo Tinder */}
      <MatchModal
        isOpen={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        matchedProfile={profile}
      />
    </div>
  )
}

