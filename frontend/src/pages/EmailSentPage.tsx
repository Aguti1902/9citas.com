import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from '@/services/api'
import Logo from '@/components/common/Logo'
import Button from '@/components/common/Button'
import { Mail, RefreshCw } from 'lucide-react'

export default function EmailSentPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email || ''
  const orientation = location.state?.orientation || ''
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  // Guardar orientación en localStorage
  useEffect(() => {
    if (orientation) {
      localStorage.setItem('userOrientation', orientation)
    }
  }, [orientation])

  const handleResend = async () => {
    setIsResending(true)
    setResendSuccess(false)
    try {
      await api.post('/auth/resend-verification', { email })
      setResendSuccess(true)
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al reenviar email')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <Logo size="lg" />

        <div className="bg-gray-900 rounded-xl p-8 border-2 border-primary">
          <Mail className="w-20 h-20 text-primary mx-auto mb-4" />
          
          <h2 className="text-3xl font-bold text-white mb-4">
            ¡Revisa tu email!
          </h2>
          
          <p className="text-gray-300 mb-2">
            Hemos enviado un enlace de verificación a:
          </p>
          
          <p className="text-primary font-semibold text-lg mb-6">
            {email}
          </p>
          
          <div className="bg-gray-800 rounded-lg p-4 text-left text-sm text-gray-300 space-y-2 mb-6">
            <p>📧 <strong>Revisa tu bandeja de entrada</strong></p>
            <p>📂 Si no lo ves, <strong>revisa spam o correo no deseado</strong></p>
            <p>⏰ El enlace expira en <strong>24 horas</strong></p>
          </div>

          {resendSuccess && (
            <div className="bg-success bg-opacity-20 border border-success text-success rounded-lg p-3 mb-4">
              ✅ Email reenviado correctamente
            </div>
          )}

          <Button
            fullWidth
            variant="outline"
            onClick={handleResend}
            isLoading={isResending}
            className="mb-3"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Reenviar email
          </Button>

          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            Volver al inicio
          </button>
        </div>

        {/* Nota de desarrollo */}
        <div className="bg-warning bg-opacity-10 border border-warning text-warning rounded-lg p-4 text-sm">
          <p className="font-semibold mb-2">ℹ️ MODO DESARROLLO</p>
          <p>El enlace de verificación se muestra en la consola del backend.</p>
          <p className="mt-2">Revisa la terminal donde corre el servidor.</p>
        </div>
      </div>
    </div>
  )
}

