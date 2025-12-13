import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import Logo from '@/components/common/Logo'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const { orientation } = useParams<{ orientation: 'hetero' | 'gay' }>()
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [requiresVerification, setRequiresVerification] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setRequiresVerification(false)
    setIsLoading(true)

    try {
      await login(email, password)
      navigate('/app')
    } catch (err: any) {
      const errorMessage = err.message || 'Error al iniciar sesión'
      setError(errorMessage)
      
      // Verificar si el error es por email no verificado
      if (err.response?.data?.requiresEmailVerification) {
        setRequiresVerification(true)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendVerification = async () => {
    setIsResending(true)
    try {
      const { api } = await import('@/services/api')
      await api.post('/auth/resend-verification', { email })
      setError('Email de verificación reenviado. Por favor, revisa tu bandeja de entrada.')
      setRequiresVerification(false)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al reenviar el email de verificación')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4 animate-fade-in">
        {/* Logo */}
        <div className="text-center">
          <Logo size="md" className="mb-2" />
          <h2 className="text-2xl font-bold text-white">
            Iniciar sesión como {orientation === 'hetero' ? 'Hetero' : 'Gay'}
          </h2>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className={`${requiresVerification ? 'bg-yellow-500 bg-opacity-10 border-yellow-500 text-yellow-500' : 'bg-red-500 bg-opacity-10 border-red-500 text-red-500'} border px-4 py-3 rounded-lg`}>
              <p className="mb-2">{error}</p>
              {requiresVerification && (
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="text-yellow-400 hover:text-yellow-300 underline text-sm font-semibold"
                >
                  {isResending ? 'Reenviando...' : '¿No recibiste el email? Haz clic aquí para reenviarlo'}
                </button>
              )}
            </div>
          )}

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="tu@email.com"
          />

          {/* Campo de contraseña con icono para mostrar/ocultar */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="input-field pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            fullWidth
            variant={orientation === 'hetero' ? 'primary' : 'secondary'}
            isLoading={isLoading}
            className="mt-6"
          >
            ENTRAR COMO {orientation?.toUpperCase()}
          </Button>
        </form>

        {/* Olvidé mi contraseña */}
        <div className="text-center">
          <Link
            to="/forgot-password"
            className="text-gray-400 hover:text-primary transition-colors text-sm"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {/* Registro */}
        <div className="text-center text-gray-400">
          <p>
            ¿No tienes cuenta?{' '}
            <Link
              to={`/register/${orientation}`}
              className="text-primary hover:underline font-semibold"
            >
              Regístrate gratis y empieza la aventura
            </Link>
          </p>
        </div>

        {/* Volver */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            ← Volver
          </button>
        </div>
      </div>
    </div>
  )
}

