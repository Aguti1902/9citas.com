import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import Logo from '@/components/common/Logo'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'

export default function RegisterPage() {
  const { orientation } = useParams<{ orientation: 'hetero' | 'gay' }>()
  const navigate = useNavigate()
  const { register } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setIsLoading(true)

    try {
      const result = await register(email, password, orientation!)
      
      // Guardar orientación en localStorage para usarla al crear el perfil
      localStorage.setItem('userOrientation', orientation!)
      
      // Si requiere verificación, redirigir a página de confirmación
      if (result.requiresVerification) {
        navigate('/email-sent', {
          state: {
            email: result.email,
            orientation: result.orientation,
          },
        })
      } else {
        // Flujo legacy (sin verificación)
        navigate('/create-profile')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4 animate-fade-in">
        {/* Logo */}
        <div className="text-center">
          <Logo size="md" className="mb-2" />
          <h2 className="text-2xl font-bold text-white">
            Registro como {orientation === 'hetero' ? 'Hetero' : 'Gay'}
          </h2>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
              {error}
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

          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Mínimo 6 caracteres"
          />

          <Input
            label="Confirmar contraseña"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Repite tu contraseña"
          />

          <div className="bg-gray-900 rounded-lg p-4 text-sm text-gray-400">
            <p className="mb-2">
              ℹ️ Al registrarte, se enviará un email de confirmación a tu correo.
            </p>
            <p>
              Asegúrate de verificar tu cuenta para acceder a todas las funciones.
            </p>
          </div>

          <Button
            type="submit"
            fullWidth
            variant={orientation === 'hetero' ? 'primary' : 'secondary'}
            isLoading={isLoading}
            className="mt-6"
          >
            REGISTRAR COMO {orientation?.toUpperCase()}
          </Button>
        </form>

        {/* Login */}
        <div className="text-center text-gray-400">
          <p>
            ¿Ya tienes cuenta?{' '}
            <Link
              to={`/login/${orientation}`}
              className="text-primary hover:underline font-semibold"
            >
              Inicia sesión
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

