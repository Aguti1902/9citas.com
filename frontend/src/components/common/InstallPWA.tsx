import { useState, useEffect } from 'react'
import { X, Download } from 'lucide-react'

export default function InstallPWA() {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Detectar si la app puede ser instalada
    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('PWA instalada')
    }
    
    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    // Guardar que el usuario cerró el banner
    localStorage.setItem('pwa-prompt-dismissed', 'true')
  }

  // No mostrar si ya fue cerrado antes
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-prompt-dismissed')
    if (dismissed) {
      setShowInstallPrompt(false)
    }
  }, [])

  if (!showInstallPrompt || !deferredPrompt) return null

  return (
    <div className="fixed bottom-20 left-0 right-0 z-50 px-4 animate-fade-in">
      <div className="max-w-md mx-auto bg-gradient-to-r from-primary to-pink-600 rounded-2xl shadow-2xl p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">📱</span>
              <h3 className="text-white font-bold text-lg">Instalar 9citas</h3>
            </div>
            <p className="text-white/90 text-sm mb-3">
              Añade 9citas a tu pantalla de inicio para una experiencia completa como app nativa
            </p>
            <button
              onClick={handleInstall}
              className="w-full bg-white text-primary font-bold py-2.5 px-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Instalar Ahora
            </button>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white/80 hover:text-white transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

