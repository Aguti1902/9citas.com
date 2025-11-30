import { useState, useEffect } from 'react'
import { Zap } from 'lucide-react'
import Button from './Button'

interface RoamStatusContentProps {
  roamingUntil: Date
  onClose: () => void
}

export default function RoamStatusContent({ roamingUntil, onClose }: RoamStatusContentProps) {
  const [timeRemaining, setTimeRemaining] = useState('')
  const [multiplier, setMultiplier] = useState(8.0)

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime()
      const endTime = new Date(roamingUntil).getTime()
      const distance = endTime - now

      if (distance < 0) {
        setTimeRemaining('00:00:00')
        return
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeRemaining(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      )
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [roamingUntil])

  // Actualizar multiplicador entre 8.0 y 10.0 cada 2-5 segundos
  useEffect(() => {
    const updateMultiplier = () => {
      const newMultiplier = (Math.random() * 2 + 8).toFixed(1)
      setMultiplier(parseFloat(newMultiplier))
    }

    updateMultiplier()
    const interval = setInterval(() => {
      updateMultiplier()
    }, Math.random() * 3000 + 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="text-center py-6">
      {/* Header con título */}
      <h2 className="text-2xl font-bold text-white mb-6">
        Roam Activo ⚡
      </h2>

      {/* Rayo con tiempo */}
      <div className="relative mb-6">
        <div className="w-48 h-48 mx-auto bg-gradient-to-br from-accent via-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/50 to-transparent animate-pulse"></div>
          <div className="relative z-10">
            <Zap className="w-20 h-20 text-gray-900" fill="currentColor" strokeWidth={0} />
          </div>
          <div className="absolute inset-0 border-4 border-yellow-300 rounded-full animate-ping opacity-20"></div>
        </div>
        
        {/* Tiempo debajo */}
        <div className="mt-4 text-5xl font-mono font-bold text-white">
          {timeRemaining}
        </div>
      </div>

      {/* Multiplicador dinámico */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-accent to-yellow-500 px-6 py-3 rounded-full shadow-lg">
          <span className="text-gray-900 font-semibold text-lg">Multiplicador:</span>
          <span className="text-gray-900 font-bold text-3xl transition-all duration-300">
            x{multiplier}
          </span>
        </div>
        <p className="text-gray-400 text-sm mt-2">
          Tu perfil está llegando a {multiplier}x más personas
        </p>
      </div>

      {/* Mensaje motivacional */}
      <div className="bg-gradient-to-r from-accent/10 to-yellow-500/10 border border-accent/30 rounded-lg p-4 mb-6">
        <p className="text-white font-semibold mb-1">
          🚀 Estás siendo visto por más personas
        </p>
        <p className="text-gray-300 text-sm">
          ¡Sigue activo para mejores resultados!
        </p>
      </div>

      {/* Botón */}
      <Button
        fullWidth
        variant="accent"
        onClick={onClose}
        className="font-bold"
      >
        CONTINUAR
      </Button>
    </div>
  )
}

