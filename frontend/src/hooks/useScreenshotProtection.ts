import { useState, useEffect, useRef } from 'react'

export function useScreenshotProtection() {
  const [showScreenshotBlocked, setShowScreenshotBlocked] = useState(false)
  const lastVisibilityChange = useRef<number>(Date.now())
  const lastFocusChange = useRef<number>(Date.now())

  useEffect(() => {
    // Crear overlay de protección si no existe
    let protectionOverlay: HTMLDivElement | null = null
    const createOverlay = () => {
      if (!protectionOverlay) {
        protectionOverlay = document.createElement('div')
        protectionOverlay.className = 'screenshot-protection-overlay'
        protectionOverlay.id = 'screenshot-protection-overlay'
        document.body.appendChild(protectionOverlay)
      }
      return protectionOverlay
    }

    // Función para activar el bloqueo
    const triggerBlock = () => {
      setShowScreenshotBlocked(true)
      document.body.style.overflow = 'hidden'
      
      // Activar overlay de protección
      const overlay = createOverlay()
      overlay.classList.add('active')
      
      // Ocultar todo el contenido de forma más agresiva
      const allElements = document.querySelectorAll('body > *')
      allElements.forEach((el) => {
        if (el instanceof HTMLElement && 
            !el.classList.contains('screenshot-blocked-modal') &&
            el.id !== 'screenshot-protection-overlay') {
          el.style.display = 'none'
        }
      })
    }

    // Detectar intentos de captura de pantalla con teclas
    const handleKeyDown = (e: KeyboardEvent) => {
      // Print Screen, F12 (DevTools), Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S, Ctrl+P
      // También detectar Cmd en Mac
      if (
        e.key === 'PrintScreen' ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.metaKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'u') ||
        (e.metaKey && e.key === 'u') ||
        (e.ctrlKey && e.key === 's') ||
        (e.metaKey && e.key === 's') ||
        (e.ctrlKey && e.key === 'p') ||
        (e.metaKey && e.key === 'p') ||
        // Detectar atajos de captura en Mac
        (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5'))
      ) {
        e.preventDefault()
        e.stopPropagation()
        triggerBlock()
        return false
      }
    }
    
    // Detectar cambios de visibilidad (posible captura)
    const handleVisibilityChange = () => {
      const now = Date.now()
      if (document.hidden) {
        // Si la página se oculta, podría ser una captura
        lastVisibilityChange.current = now
        // Esperar un poco para ver si vuelve a ser visible
        setTimeout(() => {
          if (document.hidden) {
            triggerBlock()
          }
        }, 50)
      } else {
        // Si vuelve a ser visible muy rápido después de ocultarse, podría ser una captura
        const timeSinceHidden = now - lastVisibilityChange.current
        if (timeSinceHidden < 500 && timeSinceHidden > 0) {
          triggerBlock()
        }
      }
    }
    
    // Detectar intentos de copiar
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault()
      e.stopPropagation()
      triggerBlock()
      return false
    }
    
    // Detectar cuando se intenta hacer una captura con herramientas externas
    const handleBlur = () => {
      const now = Date.now()
      lastFocusChange.current = now
      // Si la ventana pierde el foco, podría ser una captura
      setTimeout(() => {
        if (document.hidden) {
          triggerBlock()
        }
      }, 100)
    }

    const handleFocus = () => {
      const now = Date.now()
      const timeSinceBlur = now - lastFocusChange.current
      // Si vuelve el foco muy rápido después de perderlo, podría ser una captura
      if (timeSinceBlur < 500 && timeSinceBlur > 0) {
        triggerBlock()
      }
    }
    
    // Detectar cuando se intenta hacer clic derecho
    const handleContextMenu = () => {
      // Permitir clic derecho pero detectar si se intenta copiar después
      // Esto es solo para detectar, no bloqueamos el menú contextual
    }

    // Detectar cuando se intenta arrastrar (drag)
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault()
      triggerBlock()
      return false
    }

    // Monitoreo continuo de cambios sospechosos
    let monitoringInterval: ReturnType<typeof setInterval> | null = null
    
    const startMonitoring = () => {
      monitoringInterval = setInterval(() => {
        // Verificar si hay cambios sospechosos en el estado de la ventana
        if (document.hidden) {
          triggerBlock()
        }
      }, 100) // Verificar cada 100ms
    }

    // Agregar event listeners con capture para interceptar antes
    document.addEventListener('keydown', handleKeyDown, true)
    document.addEventListener('visibilitychange', handleVisibilityChange, true)
    document.addEventListener('copy', handleCopy, true)
    document.addEventListener('cut', handleCopy, true)
    window.addEventListener('blur', handleBlur, true)
    window.addEventListener('focus', handleFocus, true)
    document.addEventListener('contextmenu', handleContextMenu, true)
    document.addEventListener('dragstart', handleDragStart, true)
    
    // Iniciar monitoreo continuo
    startMonitoring()
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true)
      document.removeEventListener('visibilitychange', handleVisibilityChange, true)
      document.removeEventListener('copy', handleCopy, true)
      document.removeEventListener('cut', handleCopy, true)
      window.removeEventListener('blur', handleBlur, true)
      window.removeEventListener('focus', handleFocus, true)
      document.removeEventListener('contextmenu', handleContextMenu, true)
      document.removeEventListener('dragstart', handleDragStart, true)
      if (monitoringInterval) {
        clearInterval(monitoringInterval)
      }
      document.body.style.overflow = ''
      
      // Eliminar overlay si existe
      const overlay = document.getElementById('screenshot-protection-overlay')
      if (overlay) {
        overlay.remove()
      }
      
      // Restaurar visibilidad de elementos
      const allElements = document.querySelectorAll('body > *')
      allElements.forEach((el) => {
        if (el instanceof HTMLElement && 
            !el.classList.contains('screenshot-blocked-modal') &&
            el.id !== 'screenshot-protection-overlay') {
          el.style.display = ''
        }
      })
    }
  }, [])

  const closeModal = () => {
    setShowScreenshotBlocked(false)
    document.body.style.overflow = ''
    
    // Desactivar overlay
    const overlay = document.getElementById('screenshot-protection-overlay')
    if (overlay) {
      overlay.classList.remove('active')
    }
    
    // Restaurar visibilidad de elementos
    const allElements = document.querySelectorAll('body > *')
    allElements.forEach((el) => {
      if (el instanceof HTMLElement && 
          !el.classList.contains('screenshot-blocked-modal') &&
          el.id !== 'screenshot-protection-overlay') {
        el.style.display = ''
      }
    })
  }

  return { showScreenshotBlocked, closeModal }
}

