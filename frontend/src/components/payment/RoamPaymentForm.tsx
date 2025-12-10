import { useState, useEffect } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { api } from '@/services/api'
import Button from '@/components/common/Button'

interface RoamPaymentFormProps {
  duration: number // minutos
  price: number // euros
  onSuccess: () => void
  onCancel: () => void
}

export default function RoamPaymentForm({
  duration,
  price,
  onSuccess,
  onCancel,
}: RoamPaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Crear Payment Intent al montar el componente
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await api.post('/payments/roam/payment-intent', {
          duration,
        })
        setClientSecret(response.data.clientSecret)
      } catch (err: any) {
        setError(err.response?.data?.error || 'Error al crear sesión de pago')
      }
    }

    createPaymentIntent()
  }, [duration])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements || !clientSecret) {
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        redirect: 'if_required',
      })

      if (confirmError) {
        setError(confirmError.message || 'Error al procesar el pago')
        setIsProcessing(false)
        return
      }

      // Si llegamos aquí, el pago fue exitoso
      // El webhook actualizará el estado en el backend
      // Esperar un momento para que el webhook se procese
      setTimeout(() => {
        onSuccess()
      }, 1000)
    } catch (err: any) {
      console.error('Error al procesar pago:', err)
      setError(err.response?.data?.error || 'Error al procesar el pago')
      setIsProcessing(false)
    }
  }

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-gray-400">Preparando pago...</div>
      </div>
    )
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
          disabled={!stripe || isProcessing || !clientSecret}
          fullWidth
        >
          Pagar {price.toFixed(2)}€
        </Button>
      </div>

      <p className="text-gray-500 text-xs text-center">
        Pago seguro procesado por Stripe. Se te cobrará {price.toFixed(2)}€ una sola vez.
      </p>
    </form>
  )
}

