import Modal from './Modal'
import Button from './Button'
import { Zap, Eye, Heart, Clock } from 'lucide-react'

interface RoamSummaryModalProps {
  isOpen: boolean
  onClose: () => void
  summary: {
    viewsExtra: number
    likesExtra: number
    duration: number
  }
}

export default function RoamSummaryModal({ isOpen, onClose, summary }: RoamSummaryModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" maxWidth="md">
      <div className="text-center py-4">
        {/* Icono y título */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-accent to-yellow-500 rounded-full mb-4 relative">
            <Zap className="w-10 h-10 text-gray-900" fill="currentColor" strokeWidth={0} />
            <div className="absolute -top-1 -right-1">
              <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center text-white text-xs font-bold">
                ✓
              </div>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            ¡Roam Finalizado!
          </h2>
          <p className="text-gray-400">
            Tu sesión de Roam ha terminado. Aquí está tu resumen:
          </p>
        </div>

        {/* Estadísticas */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-3 gap-4">
            {/* Duración */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-700 rounded-full mb-2">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <p className="text-2xl font-bold text-white mb-1">{summary.duration}</p>
              <p className="text-xs text-gray-400">Minutos activo</p>
            </div>

            {/* Visualizaciones */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-700 rounded-full mb-2">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-primary mb-1">+{summary.viewsExtra}</p>
              <p className="text-xs text-gray-400">Vistas extra</p>
            </div>

            {/* Likes */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-700 rounded-full mb-2">
                <Heart className="w-6 h-6 text-secondary" />
              </div>
              <p className="text-2xl font-bold text-secondary mb-1">+{summary.likesExtra}</p>
              <p className="text-xs text-gray-400">Likes extra</p>
            </div>
          </div>
        </div>

        {/* Mensaje motivacional */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-lg p-4 mb-6">
          <p className="text-white font-semibold mb-1">
            🎉 ¡Gran resultado!
          </p>
          <p className="text-gray-300 text-sm">
            {summary.viewsExtra > 0 || summary.likesExtra > 0
              ? 'Tu perfil ha recibido más atención durante el Roam. ¡Sigue así!'
              : 'Prueba activar Roam en horarios de mayor actividad para mejores resultados.'}
          </p>
        </div>

        {/* Botones */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cerrar
          </Button>
          <Button
            variant="accent"
            onClick={onClose}
            className="flex-1"
          >
            Ver mis likes
          </Button>
        </div>
      </div>
    </Modal>
  )
}

