import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Este componente mantiene la posición del scroll cuando navegas entre páginas
// Solo hace scroll al inicio si cambias de ruta, no si estás en la misma página
export default function ScrollRestoration() {
  const location = useLocation()

  useEffect(() => {
    // Guardar la posición del scroll antes de navegar
    const saveScrollPosition = () => {
      sessionStorage.setItem(
        `scroll-${location.pathname}`,
        window.scrollY.toString()
      )
    }

    // Restaurar la posición del scroll al cargar la página
    const restoreScrollPosition = () => {
      const savedPosition = sessionStorage.getItem(`scroll-${location.pathname}`)
      if (savedPosition) {
        window.scrollTo(0, parseInt(savedPosition, 10))
      }
    }

    // Restaurar posición al montar
    restoreScrollPosition()

    // Guardar posición antes de desmontar
    window.addEventListener('beforeunload', saveScrollPosition)

    return () => {
      saveScrollPosition()
      window.removeEventListener('beforeunload', saveScrollPosition)
    }
  }, [location.pathname])

  return null
}

