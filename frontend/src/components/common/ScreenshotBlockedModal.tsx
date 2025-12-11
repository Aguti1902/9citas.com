import { CameraOff } from 'lucide-react'

interface ScreenshotBlockedModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ScreenshotBlockedModal({ isOpen, onClose }: ScreenshotBlockedModalProps) {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-[99999] bg-black flex items-center justify-center"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
      }}
    >
      <div className="text-center px-6 max-w-sm w-full">
        {/* Icono de cámara bloqueada */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-28 h-28 bg-green-500 rounded-full flex items-center justify-center shadow-2xl">
              <CameraOff className="w-14 h-14 text-white" strokeWidth={2.5} />
            </div>
            {/* Línea diagonal de prohibición */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-24 h-1.5 bg-white rotate-45 rounded-full shadow-lg"></div>
            </div>
          </div>
        </div>

        {/* Título */}
        <h2 className="text-3xl font-bold text-white mb-6">
          Captura de pantalla bloqueada
        </h2>

        {/* Mensaje */}
        <p className="text-white text-lg mb-10 leading-relaxed px-4">
          Para proteger la privacidad de todos los usuarios en 9Citas, se bloqueó esta captura de pantalla.
        </p>

        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-10 rounded-full transition-colors text-lg shadow-lg"
        >
          Entendido
        </button>
      </div>
    </div>
  )
}

