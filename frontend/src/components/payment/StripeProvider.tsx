import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { useEffect, useState } from 'react'
import { api } from '@/services/api'

interface StripeProviderProps {
  children: React.ReactNode
  clientSecret?: string
}

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

export default function StripeProvider({ children, clientSecret }: StripeProviderProps) {
  const [stripe, setStripe] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStripe()
      .then((stripeInstance) => {
        setStripe(stripeInstance)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-gray-400">Cargando...</div>
      </div>
    )
  }

  if (!stripe) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-red-500">Error al cargar Stripe</div>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-gray-400">Preparando pago...</div>
      </div>
    )
  }

  return (
    <Elements stripe={stripe} options={{ clientSecret }}>
      {children}
    </Elements>
  )
}

