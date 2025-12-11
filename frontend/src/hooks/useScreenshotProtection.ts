import { useState, useEffect } from 'react'

export function useScreenshotProtection() {
  const [showScreenshotBlocked, setShowScreenshotBlocked] = useState(false)

  useEffect(() => {
    // Detectar intentos de captura de pantalla
    const handleKeyDown = (e: KeyboardEvent) => {
      // Print Screen, F12 (DevTools), Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S, Ctrl+P
      if (
        e.key === 'PrintScreen' ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.key === 's') || // Guardar página
        (e.ctrlKey && e.key === 'p')    // Imprimir
      ) {
        e.preventDefault()
        setShowScreenshotBlocked(true)
        // Ocultar el contenido de la página
        document.body.style.overflow = 'hidden'
        return false
      }
    }
    
    // Detectar cambios de visibilidad (posible captura)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Si la página se oculta, podría ser una captura
        setShowScreenshotBlocked(true)
        document.body.style.overflow = 'hidden'
      }
    }
    
    // Detectar intentos de copiar
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault()
      setShowScreenshotBlocked(true)
      document.body.style.overflow = 'hidden'
      return false
    }
    
    // Detectar cuando se intenta hacer una captura con herramientas externas
    const handleBlur = () => {
      // Si la ventana pierde el foco, podría ser una captura
      setTimeout(() => {
        if (document.hidden) {
          setShowScreenshotBlocked(true)
          document.body.style.overflow = 'hidden'
        }
      }, 100)
    }
    
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    document.addEventListener('copy', handleCopy)
    window.addEventListener('blur', handleBlur)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.removeEventListener('copy', handleCopy)
      window.removeEventListener('blur', handleBlur)
      document.body.style.overflow = ''
    }
  }, [])

  const closeModal = () => {
    setShowScreenshotBlocked(false)
    document.body.style.overflow = ''
  }

  return { showScreenshotBlocked, closeModal }
}

