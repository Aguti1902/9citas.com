import { useState } from 'react'
import { X, ChevronRight, ChevronLeft, Heart, Search, MessageCircle, Star, Camera, Filter, Sparkles } from 'lucide-react'
import Button from './Button'

interface OnboardingTutorialProps {
  onComplete: () => void
}

const tutorialSteps = [
  {
    id: 1,
    title: 'Bienvenido a 9citas',
    description: 'Te vamos a enseñar cómo funciona la app en unos pocos pasos. Es muy fácil.',
    icon: null,
    iconComponent: Heart,
  },
  {
    id: 2,
    title: 'Navega y descubre perfiles',
    description: 'En la sección Navegar puedes ver perfiles de personas cerca de ti. Desliza las tarjetas o usa los botones para dar like o pasar.',
    icon: null,
    iconComponent: Search,
    highlight: 'swipe',
  },
  {
    id: 3,
    title: 'Haz Match y conecta',
    description: 'Cuando das like a alguien que también te ha dado like, haces Match. Verás una notificación y podrás chatear directamente.',
    icon: null,
    iconComponent: Heart,
    highlight: 'likes',
  },
  {
    id: 4,
    title: 'Chatea con tus matches',
    description: 'En la sección Buzón puedes chatear con tus matches. Envía mensajes, fotos y empieza a conocer gente nueva.',
    icon: null,
    iconComponent: MessageCircle,
    highlight: 'chat',
  },
  {
    id: 5,
    title: 'Filtros inteligentes',
    description: 'Usa los filtros para encontrar personas por edad, distancia, género y más. Encuentra exactamente lo que buscas.',
    icon: null,
    iconComponent: Filter,
    highlight: 'filters',
  },
  {
    id: 6,
    title: 'Fotos privadas',
    description: 'Puedes subir fotos privadas y decidir a quién darles acceso. También puedes solicitar ver las fotos privadas de otros usuarios.',
    icon: null,
    iconComponent: Camera,
    highlight: 'private',
  },
  {
    id: 7,
    title: 'Sube de nivel con 9Plus',
    description: 'Con 9Plus obtienes filtros avanzados, mensajes ilimitados, ver quién te da like, y mucho más. Aprovecha al máximo la app.',
    icon: null,
    iconComponent: Star,
    highlight: 'premium',
  },
  {
    id: 8,
    title: 'Listo para empezar',
    description: 'Ya conoces lo básico. Ahora es tu turno: completa tu perfil, sube fotos y empieza a conocer gente increíble. Mucha suerte.',
    icon: null,
    iconComponent: Sparkles,
  },
]

export default function OnboardingTutorial({ onComplete }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const step = tutorialSteps[currentStep]
  const isLastStep = currentStep === tutorialSteps.length - 1
  const isFirstStep = currentStep === 0

  const handleNext = () => {
    if (isLastStep) {
      onComplete()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        {/* Header con botón de cerrar */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700"
            aria-label="Saltar tutorial"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido principal */}
        <div className="px-8 py-12 text-center">
          {/* Icono */}
          <div className="mb-6 flex justify-center">
            {step.iconComponent && (
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center animate-pulse">
                <step.iconComponent className="w-10 h-10 text-white" />
              </div>
            )}
          </div>

          {/* Título */}
          <h2 className="text-2xl font-bold text-white mb-4">
            {step.title}
          </h2>

          {/* Descripción */}
          <p className="text-gray-300 text-base leading-relaxed mb-8">
            {step.description}
          </p>

          {/* Indicadores de progreso */}
          <div className="flex justify-center gap-2 mb-8">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-8 bg-primary'
                    : index < currentStep
                    ? 'w-2 bg-primary/50'
                    : 'w-2 bg-gray-700'
                }`}
              />
            ))}
          </div>

          {/* Botones de navegación */}
          <div className="flex gap-3">
            {!isFirstStep && (
              <Button
                variant="outline"
                onClick={handlePrev}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Anterior</span>
              </Button>
            )}
            <Button
              variant="primary"
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <span>{isLastStep ? '¡Empezar!' : 'Siguiente'}</span>
              {!isLastStep && <ChevronRight className="w-5 h-5" />}
            </Button>
          </div>

          {/* Botón de saltar */}
          {!isLastStep && (
            <button
              onClick={handleSkip}
              className="mt-4 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Saltar tutorial
            </button>
          )}
        </div>

        {/* Decoración de fondo */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent"></div>
      </div>
    </div>
  )
}

