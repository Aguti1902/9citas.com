import { useState } from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const [imageError, setImageError] = useState(false)
  
  // Tamaños por defecto (para páginas públicas)
  const imageSizes = {
    sm: 'h-12',      // 48px - Para el header interno (cuando se pasa className desde DashboardLayout)
    md: 'h-16',      // 64px - Para páginas de login/registro
    lg: 'h-24',      // 96px - Para página principal
  }

  const textSizes = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-5xl',
  }

  // Si hay error, mostrar texto de fallback
  if (imageError) {
    return (
      <div className={`${textSizes[size]} font-black tracking-tight ${className}`}>
        <span className="text-white">9</span>
        <span className="text-primary">citas</span>
        <span className="text-white">.com</span>
      </div>
    )
  }

  // Mostrar imagen directamente
  // Si hay className personalizado, lo usa; sino usa el tamaño por defecto
  return (
    <img 
      src="/logo4.png" 
      alt="9citas.com" 
      className={className || `${imageSizes[size]} w-auto object-contain`}
      style={{ maxWidth: '100%', maxHeight: '100%' }}
      onError={() => setImageError(true)}
    />
  )
}

