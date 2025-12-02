import { useState, useEffect } from 'react'
import { api } from '@/services/api'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { Lock, Check, X } from 'lucide-react'

export default function PrivatePhotoRequestsPage() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      const response = await api.get('/private-photos/requests/received')
      setRequests(response.data.requests)
    } catch (error) {
      console.error('Error al cargar solicitudes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRespond = async (requestId: string, action: 'grant' | 'reject') => {
    setProcessingId(requestId)
    try {
      await api.put(`/private-photos/requests/${requestId}/${action}`)
      await loadRequests()
      alert(action === 'grant' ? '✅ Acceso concedido' : '❌ Acceso rechazado')
    } catch (error) {
      alert('Error al procesar solicitud')
    } finally {
      setProcessingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white transition-colors mb-4 flex items-center gap-2"
        >
          ← Volver
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
          <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
          Solicitudes de Fotos Privadas
        </h1>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">
          Gestiona quién puede ver tus fotos privadas
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-12">
          <Lock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No tienes solicitudes pendientes</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-gray-900 rounded-xl p-4 border border-gray-800"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Foto del usuario */}
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden flex-shrink-0 cursor-pointer"
                  onClick={() => navigate(`/app/profile/${request.viewerProfile.id}`)}
                >
                  {request.viewerProfile.photos?.[0] ? (
                    <img
                      src={request.viewerProfile.photos[0].url}
                      alt={request.viewerProfile.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-600">
                      👤
                    </div>
                  )}
                </div>

                {/* Información */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-semibold text-white truncate">
                    {request.viewerProfile.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {request.viewerProfile.age} años • {request.viewerProfile.city}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Solicitud enviada {new Date(request.createdAt).toLocaleDateString('es-ES', { 
                      day: 'numeric', 
                      month: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>

                {/* Botones - Ahora en fila horizontal compacta */}
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleRespond(request.id, 'grant')}
                    disabled={processingId !== null}
                    className="flex-1 sm:flex-initial bg-accent hover:bg-accent/90 text-black font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[100px]"
                  >
                    {processingId === request.id ? (
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span className="text-sm">Aprobar</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleRespond(request.id, 'reject')}
                    disabled={processingId !== null}
                    className="flex-1 sm:flex-initial bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[100px]"
                  >
                    {processingId === request.id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <X className="w-4 h-4" />
                        <span className="text-sm">Rechazar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

