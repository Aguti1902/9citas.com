import { useNavigate } from 'react-router-dom'
import Logo from '@/components/common/Logo'
import Button from '@/components/common/Button'

export default function IndexPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 animate-fade-in">
        {/* Logo */}
        <div className="text-center">
          <Logo size="md" className="mb-2" />
          <p className="text-gray-400 text-lg">
            Encuentra tu conexión perfecta
          </p>
        </div>

        {/* Opciones */}
        <div className="space-y-4">
          <Button
            fullWidth
            variant="primary"
            onClick={() => navigate('/login/hetero')}
            className="text-lg py-4"
          >
            Tengo 18 años y busco citas con heteros
          </Button>

          <Button
            fullWidth
            variant="secondary"
            onClick={() => navigate('/login/gay')}
            className="text-lg py-4"
          >
            Tengo 18 años y busco citas con gays
          </Button>

          <Button
            fullWidth
            variant="outline"
            disabled
            className="text-lg py-4"
          >
            No tengo 18 años
          </Button>
        </div>

        {/* Aviso legal */}
        <div className="text-center text-sm text-gray-500 space-y-2 pt-4">
          <p>
            Al continuar, confirmas que tienes al menos 18 años y aceptas nuestros{' '}
            <a href="/info" className="text-primary hover:underline">
              Términos y Condiciones
            </a>
            {' '}y{' '}
            <a href="/info" className="text-primary hover:underline">
              Política de Privacidad
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

