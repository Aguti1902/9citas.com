import { useState, useEffect } from 'react'
import { api } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import Logo from '@/components/common/Logo'

export default function PlusPage() {
  const { user, refreshUserData } = useAuthStore()
  const [isActivating, setIsActivating] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [isCanceling, setIsCanceling] = useState(false)
  const isPremium = user?.subscription?.isActive || false

  // Manejar redirección desde Stripe
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const success = params.get('success')
    const canceled = params.get('canceled')
    
    if (success === 'true') {
      // Recargar datos del usuario para actualizar estado de suscripción
      refreshUserData()
      // Limpiar parámetro de URL
      window.history.replaceState({}, '', window.location.pathname)
    } else if (canceled === 'true') {
      // Limpiar parámetro de URL
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [refreshUserData])

  const handleActivate = async () => {
    setIsActivating(true)
    try {
      // Crear sesión de checkout de Stripe
      const response = await api.post('/payments/subscription/checkout')
      const { url } = response.data
      
      // Redirigir a Stripe Checkout
      if (url) {
        window.location.href = url
      } else {
        throw new Error('No se recibió URL de checkout')
      }
    } catch (error: any) {
      console.error('Error al crear sesión de checkout:', error)
      alert(error.response?.data?.error || 'Error al iniciar el proceso de pago')
      setIsActivating(false)
    }
  }

  const handleCancel = async () => {
    setIsCanceling(true)
    try {
      // Crear sesión del portal de cliente de Stripe
      const response = await api.post('/payments/customer-portal')
      const { url } = response.data
      
      // Redirigir al portal de Stripe donde puede cancelar
      if (url) {
        window.location.href = url
      } else {
        throw new Error('No se recibió URL del portal')
      }
    } catch (error: any) {
      console.error('Error al crear sesión del portal:', error)
      alert(error.response?.data?.error || 'Error al acceder al portal de gestión')
      setIsCanceling(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Logo size="md" />
          <span className="text-4xl font-bold text-accent">Plus</span>
        </div>
        {isPremium && (
          <div className="inline-block bg-gradient-to-r from-accent to-warning text-black px-6 py-2 rounded-full font-bold">
            ⭐ Ya eres usuario 9Plus
          </div>
        )}
      </div>

      {/* Comparación de planes */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Plan Gratis */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-2xl font-bold text-white mb-4">Plan Gratis</h3>
          <ul className="space-y-2.5 text-gray-300 text-sm">
            <li className="flex items-start">
              <span className="text-red-500 mr-2 mt-0.5">✗</span>
              <span>Ver solo los primeros 50 perfiles de tu ubicación</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2 mt-0.5">✗</span>
              <span>Chatear con cualquiera (sin restricciones de ciudad)</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2 mt-0.5">✗</span>
              <span>Sin ver distancia exacta a usuarios</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2 mt-0.5">✗</span>
              <span>Sin ver ciudad de los usuarios</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2 mt-0.5">✗</span>
              <span>Ver solo los últimos 5 "Me gusta" recibidos</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2 mt-0.5">✗</span>
              <span>Sin filtros por distancia</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2 mt-0.5">✗</span>
              <span>Sin filtros por edad</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2 mt-0.5">✗</span>
              <span>Sin filtro de usuarios online</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2 mt-0.5">✗</span>
              <span>Sin filtro por género (hetero)</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2 mt-0.5">✗</span>
              <span>Sin filtro por tipo de relación</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2 mt-0.5">✗</span>
              <span>Sin filtro por ROL (gay)</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2 mt-0.5">✗</span>
              <span>Sin confirmación de lectura de mensajes</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2 mt-0.5">✗</span>
              <span>Sin función RoAM (boost de visibilidad)</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2 mt-0.5">✗</span>
              <span>Sin cambiar ubicación manualmente</span>
            </li>
          </ul>
        </div>

        {/* Plan 9Plus */}
        <div className="bg-gradient-to-br from-primary to-secondary rounded-xl p-6 border-2 border-accent relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-accent text-black px-3 py-1 rounded-full text-xs font-bold">
            PREMIUM
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-4">Plan 9Plus</h3>
          <ul className="space-y-2.5 text-white text-sm">
            <li className="flex items-start">
              <span className="text-accent mr-2 mt-0.5 font-bold">✓</span>
              <span><strong>Perfiles ilimitados</strong> - Ver todos los perfiles sin límite</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-2 mt-0.5 font-bold">✓</span>
              <span><strong>Chat sin restricciones</strong> - Chatear con cualquiera desde cualquier ciudad</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-2 mt-0.5 font-bold">✓</span>
              <span><strong>Distancia exacta</strong> - Ver la distancia en km a cada usuario</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-2 mt-0.5 font-bold">✓</span>
              <span><strong>Ver ciudad</strong> - Ver la ciudad de todos los usuarios</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-2 mt-0.5 font-bold">✓</span>
              <span><strong>Todos los "Me gusta"</strong> - Ver todos los likes que recibes, sin límite</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-2 mt-0.5 font-bold">✓</span>
              <span><strong>Filtro por distancia</strong> - Filtrar perfiles por rango de distancia</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-2 mt-0.5 font-bold">✓</span>
              <span><strong>Filtro por edad</strong> - Filtrar por rango de edad personalizado</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-2 mt-0.5 font-bold">✓</span>
              <span><strong>Filtro de usuarios online</strong> - Ver solo usuarios conectados ahora</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-2 mt-0.5 font-bold">✓</span>
              <span><strong>Filtro por género</strong> - Filtrar por género (solo hetero)</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-2 mt-0.5 font-bold">✓</span>
              <span><strong>Filtro por tipo de relación</strong> - Amistad, Relación seria, Solo sexo</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-2 mt-0.5 font-bold">✓</span>
              <span><strong>Filtro por ROL</strong> - Activo, Pasivo, Versátil (solo gay)</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-2 mt-0.5 font-bold">✓</span>
              <span><strong>Confirmación de lectura</strong> - Ver si tus mensajes fueron leídos (✓✓ leído)</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-2 mt-0.5 font-bold">✓</span>
              <span><strong>Función RoAM</strong> - Boost de visibilidad 10x durante 1 hora (6,49€)</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-2 mt-0.5 font-bold">✓</span>
              <span><strong>Cambiar ubicación</strong> - Cambiar tu ciudad manualmente cuando quieras</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-2 mt-0.5 font-bold">✓</span>
              <span><strong>Prioridad en resultados</strong> - Apareces primero en las búsquedas</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Precio y CTA */}
      {!isPremium ? (
        <div className="bg-gray-900 rounded-xl p-8 text-center">
          <div className="mb-6">
            <p className="text-gray-400 text-lg mb-2">Precio normal:</p>
            <p className="text-gray-500 line-through text-3xl mb-2">6,50 €/mes</p>
            <p className="text-accent text-5xl font-bold mb-2">5 €/mes</p>
            <p className="text-accent font-semibold text-xl">¡OFERTA DE LANZAMIENTO!</p>
          </div>

          <Button
            fullWidth
            variant="accent"
            isLoading={isActivating}
            onClick={handleActivate}
            className="text-xl py-4"
          >
            ⭐ Contratar 9Plus por solo 5 € al mes
          </Button>

          <p className="text-gray-500 text-sm mt-4">
            * Pago seguro con Stripe • Sin permanencia • Cancela cuando quieras
          </p>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-xl p-8 text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white mb-4">Ya eres usuario 9Plus</h3>
            <p className="text-gray-300">
              Disfruta de todas las funciones premium
            </p>
          </div>

          <Button
            fullWidth
            variant="danger"
            onClick={() => setShowCancelModal(true)}
          >
            Cancelar suscripción
          </Button>

          <p className="text-gray-500 text-sm mt-4">
            Si cancelas, seguirás teniendo acceso hasta el final de tu periodo de facturación
          </p>
        </div>
      )}

      {/* Información adicional */}
      <div className="mt-8 text-center text-gray-400 space-y-2">
        <p>Sin permanencia • Cancela cuando quieras</p>
        <p>Pago seguro • Protección de datos</p>
      </div>

      {/* Modal de cancelación */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancelar suscripción 9Plus"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            ¿Estás seguro de que quieres cancelar tu suscripción 9Plus?
          </p>
          <p className="text-gray-400 text-sm">
            Perderás acceso a todas las funciones premium:
          </p>
          <ul className="text-gray-400 text-sm space-y-1.5 max-h-60 overflow-y-auto">
            <li>• Perfiles ilimitados</li>
            <li>• Ver distancia y ciudad exacta</li>
            <li>• Ver todos los "Me gusta"</li>
            <li>• Filtros por distancia, edad, online</li>
            <li>• Filtros por género, tipo de relación, ROL</li>
            <li>• Confirmación de lectura de mensajes</li>
            <li>• Función RoAM (boost de visibilidad)</li>
            <li>• Cambiar ubicación manualmente</li>
          </ul>
          <div className="flex gap-3 pt-4">
            <Button
              fullWidth
              variant="outline"
              onClick={() => setShowCancelModal(false)}
            >
              No, mantener 9Plus
            </Button>
            <Button
              fullWidth
              variant="danger"
              isLoading={isCanceling}
              onClick={handleCancel}
            >
              Sí, cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

