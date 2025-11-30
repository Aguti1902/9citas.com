import { useState } from 'react'
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

  const handleActivate = async () => {
    setIsActivating(true)
    try {
      await api.post('/subscriptions/activate')
      await refreshUserData()
      alert('¡Suscripción 9Plus activada exitosamente!')
    } catch (error) {
      console.error('Error al activar suscripción:', error)
      alert('Error al activar suscripción')
    } finally {
      setIsActivating(false)
    }
  }

  const handleCancel = async () => {
    setIsCanceling(true)
    try {
      await api.delete('/subscriptions/cancel')
      await refreshUserData()
      setShowCancelModal(false)
      alert('Suscripción cancelada. Puedes seguir disfrutando de 9Plus hasta el final del periodo de facturación.')
    } catch (error) {
      console.error('Error al cancelar suscripción:', error)
      alert('Error al cancelar suscripción')
    } finally {
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
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <span className="text-red-500 mr-2">✗</span>
              <span>Ver solo los primeros 50 perfiles de tu ubicación</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">✗</span>
              <span>Solo chatear en tu ciudad actual</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">✗</span>
              <span>Sin ver distancia a usuarios</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">✗</span>
              <span>Ver solo los últimos 5 "Me gusta" recibidos</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">✗</span>
              <span>Sin filtros por edad ni online</span>
            </li>
          </ul>
        </div>

        {/* Plan 9Plus */}
        <div className="bg-gradient-to-br from-primary to-secondary rounded-xl p-6 border-2 border-accent relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-accent text-black px-3 py-1 rounded-full text-xs font-bold">
            PREMIUM
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-4">Plan 9Plus</h3>
          <ul className="space-y-3 text-white">
            <li className="flex items-start">
              <span className="text-accent mr-2">✓</span>
              <span>Ver perfiles ilimitados cerca de ti</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-2">✓</span>
              <span>Chatear sin restricciones, incluso en otras ciudades</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-2">✓</span>
              <span>Ver la distancia exacta a los usuarios</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-2">✓</span>
              <span>Ver todos los "Me gusta" que recibes</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-2">✓</span>
              <span>Filtros por edad y usuarios online</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-2">✓</span>
              <span>Prioridad en listados</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-2">✓</span>
              <span>Acceso a todas las funciones premium</span>
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
            * En esta demo, la suscripción se activa automáticamente sin pago real
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
            Perderás acceso a:
          </p>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>• Perfiles ilimitados</li>
            <li>• Chatear desde cualquier ciudad</li>
            <li>• Ver distancia a usuarios</li>
            <li>• Ver todos los "Me gusta"</li>
            <li>• Filtros premium</li>
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

