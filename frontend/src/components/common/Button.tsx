import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'danger'
  fullWidth?: boolean
  isLoading?: boolean
  children: ReactNode
}

export default function Button({
  variant = 'primary',
  fullWidth = false,
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-semibold py-3 px-6 rounded-lg transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-primary text-white hover:opacity-90',
    secondary: 'bg-secondary text-white hover:opacity-90',
    accent: 'bg-accent text-black hover:opacity-90',
    danger: 'bg-danger text-white hover:opacity-90',
    outline: 'border-2 border-white text-white hover:bg-white hover:text-black',
  }

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <span className="spinner border-2 w-5 h-5 mr-2"></span>
          Cargando...
        </span>
      ) : (
        children
      )}
    </button>
  )
}

