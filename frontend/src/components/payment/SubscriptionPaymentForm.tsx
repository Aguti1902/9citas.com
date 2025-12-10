import { useState, useEffect } from 'react'
import { PaymentElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { api } from '@/services/api'
import Button from '@/components/common/Button'
import { useAuthStore } from '@/store/authStore'

// Cargar Stripe con la clave pública
let stripePromise: Promise<any> | null = null

const getStripe = async () => {
  if (!stripePromise) {
    try {
      const response = await api.get('/payments/publishable-key')
      const { publishableKey } = response.data
      stripePromise = loadStripe(publishableKey)
    } catch (error) {
      console.error('Error al cargar clave pública de Stripe:', error)
      throw error
    }
  }
  return stripePromise
}

interface SubscriptionPaymentFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export default function SubscriptionPaymentForm({
  onSuccess,
  onCancel,
}: SubscriptionPaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [stripe, setStripe] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Crear Setup Intent y cargar Stripe al montar el componente
  useEffect(() => {
    const initialize = async () => {
      try {
        // Cargar Stripe
        const stripeInstance = await getStripe()
        setStripe(stripeInstance)

        // Crear Setup Intent
        const setupResponse = await api.post('/payments/subscription/setup-intent')
        setClientSecret(setupResponse.data.clientSecret)
      } catch (err: any) {
        setError(err.response?.data?.error || 'Error al crear sesión de pago')
      }
    }

    initialize()
  }, [])

  if (error) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  if (!clientSecret || !stripe) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-gray-400">Preparando pago...</div>
      </div>
    )
  }

  return (
    <Elements stripe={stripe} options={{ clientSecret }}>
      <PaymentFormContent
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </Elements>
  )
}

function PaymentFormContent({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void
  onCancel: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const { refreshUserData } = useAuthStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Confirmar el setup intent para guardar el método de pago
      const { error: confirmError, setupIntent } = await stripe.confirmSetup({
        elements,
        redirect: 'if_required',
      })

      if (confirmError) {
        setError(confirmError.message || 'Error al procesar el pago')
        setIsProcessing(false)
        return
      }

      // Obtener el payment method ID
      const paymentMethodId = setupIntent?.payment_method
        ? (typeof setupIntent.payment_method === 'string'
            ? setupIntent.payment_method
            : setupIntent.payment_method.id)
        : null

      if (!paymentMethodId) {
        setError('No se pudo obtener el método de pago')
        setIsProcessing(false)
        return
      }

      // Confirmar la suscripción con el método de pago guardado
      await api.post('/payments/subscription/confirm', {
        paymentMethodId,
      })

      // Recargar datos del usuario
      await refreshUserData()

      onSuccess()
    } catch (err: any) {
      console.error('Error al procesar suscripción:', err)
      setError(err.response?.data?.error || err.message || 'Error al procesar el pago')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-900 rounded-lg p-4">
        <PaymentElement
          options={{
            layout: 'tabs',
            appearance: {
              theme: 'night',
              variables: {
                colorPrimary: '#FCD34D',
                colorBackground: '#111827',
                colorText: '#FFFFFF',
                colorDanger: '#EF4444',
                fontFamily: 'system-ui, sans-serif',
                spacingUnit: '4px',
                borderRadius: '8px',
              },
            },
          }}
        />
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 rounded-lg p-3 text-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          fullWidth
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="accent"
          isLoading={isProcessing}
          disabled={!stripe || isProcessing}
          fullWidth
        >
          Suscribirme por 5€/mes
        </Button>
      </div>

      <p className="text-gray-500 text-xs text-center">
        Pago seguro procesado por Stripe. Se te cobrará 5€ al mes. Puedes cancelar en cualquier momento.
      </p>
    </form>
  )
}

