import { useState, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import Logo from '@/components/common/Logo'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import { Eye, EyeOff } from 'lucide-react'

// Verificar si hay una clave de reCAPTCHA real configurada
const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY
const hasRealRecaptchaKey = recaptchaSiteKey && recaptchaSiteKey !== '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'

export default function RegisterPage() {
  const { orientation } = useParams<{ orientation: 'hetero' | 'gay' }>()
  const navigate = useNavigate()
  const { register } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [captchaToken] = useState<string | null>(null) // Solo se usa si hay clave real
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

    // Solo requerir CAPTCHA si hay una clave real configurada
    if (hasRealRecaptchaKey && !captchaToken) {
      setError('Por favor, completa el CAPTCHA para verificar que no eres un robot')
      return
    }

    setIsLoading(true)

    try {
      const result = await register(email, password, orientation!, captchaToken || undefined)
      
      // Guardar orientación en localStorage para usarla al crear el perfil
      localStorage.setItem('userOrientation', orientation!)
      
      // Determinar género basado en orientación para hetero
      // Hetero: el usuario elige si es hombre o mujer (por defecto hombre)
      // Gay: tanto hombres como mujeres pueden ser gay
      // Se guardará el género seleccionado más adelante
      
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
                placeholder="Mínimo 6 caracteres"
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

          {/* Campo de confirmar contraseña con icono para mostrar/ocultar */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirmar contraseña
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Repite tu contraseña"
                className="input-field pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* CAPTCHA - Verificación anti-robots (solo si hay clave real configurada) */}
          {/* No renderizar nada si no hay clave - evita cargar el script de reCAPTCHA */}

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

