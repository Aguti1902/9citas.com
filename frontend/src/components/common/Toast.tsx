import { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  onClose: () => void
  duration?: number
}

export default function Toast({ message, type = 'info', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-success" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-accent" />,
    info: <Info className="w-5 h-5 text-primary" />,
  }

  const bgColors = {
    success: 'bg-success/10 border-success/30',
    error: 'bg-red-500/10 border-red-500/30',
    warning: 'bg-accent/10 border-accent/30',
    info: 'bg-primary/10 border-primary/30',
  }

  return (
    <div className="fixed top-4 right-4 z-[10000] animate-fade-in">
      <div className={`${bgColors[type]} border rounded-lg shadow-2xl p-4 pr-12 min-w-[300px] max-w-[500px] backdrop-blur-sm`}>
        <div className="flex items-start gap-3">
          {icons[type]}
          <p className="text-white text-sm flex-1">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

