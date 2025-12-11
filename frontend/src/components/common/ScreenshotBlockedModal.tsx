import { CameraOff } from 'lucide-react'

interface ScreenshotBlockedModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ScreenshotBlockedModal({ isOpen, onClose }: ScreenshotBlockedModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[99999] bg-black flex items-center justify-center">
      <div className="text-center px-6 max-w-sm">
        {/* Icono de cámara bloqueada */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
              <CameraOff className="w-12 h-12 text-white" strokeWidth={2.5} />
            </div>
            {/* Línea diagonal de prohibición */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-1 bg-white rotate-45 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Título */}
        <h2 className="text-2xl font-bold text-white mb-4">
          Captura de pantalla bloqueada
        </h2>

        {/* Mensaje */}
        <p className="text-white text-base mb-8 leading-relaxed">
          Para proteger la privacidad de todos los usuarios en 9Citas, se bloqueó esta captura de pantalla.
        </p>

        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
        >
          Entendido
        </button>
      </div>
    </div>
  )
}

