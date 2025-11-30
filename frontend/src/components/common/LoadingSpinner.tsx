interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  center?: boolean
}

export default function LoadingSpinner({ size = 'md', center = true }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  }

  const spinner = (
    <div className={`spinner ${sizes[size]}`} />
  )

  if (center) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        {spinner}
      </div>
    )
  }

  return spinner
}

