import Logo from '@/components/common/Logo'
import Button from '@/components/common/Button'
import { BookOpen, FileText, Shield, Cookie, Users } from 'lucide-react'
import { useState } from 'react'
import TermsAndConditions from '@/components/legal/TermsAndConditions'
import PrivacyPolicy from '@/components/legal/PrivacyPolicy'
import CookiePolicy from '@/components/legal/CookiePolicy'
import CommunityGuidelines from '@/components/legal/CommunityGuidelines'

type LegalTab = 'info' | 'terms' | 'privacy' | 'cookies' | 'community'

export default function InfoPage() {
  const [activeTab, setActiveTab] = useState<LegalTab>('info')

  const handleShowTutorial = () => {
    // Eliminar la marca de que ya vio el tutorial
    localStorage.removeItem('hasSeenOnboarding')
    // Establecer flag para mostrar el tutorial
    sessionStorage.setItem('showTutorial', 'true')
    // Redirigir a la página principal para que se muestre el tutorial
    // Usar window.location para forzar una recarga completa y asegurar que el flag se lea
    window.location.href = '/app'
  }

  const tabs = [
    { id: 'info' as LegalTab, label: 'Información', icon: BookOpen },
    { id: 'terms' as LegalTab, label: 'Términos', icon: FileText },
    { id: 'privacy' as LegalTab, label: 'Privacidad', icon: Shield },
    { id: 'cookies' as LegalTab, label: 'Cookies', icon: Cookie },
    { id: 'community' as LegalTab, label: 'Normas', icon: Users },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <Logo size="md" className="mb-4" />
      </div>

      {/* Tabs de navegación */}
      <div className="flex gap-2 mb-8 border-b border-gray-800 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors whitespace-nowrap rounded-t-lg ${
                activeTab === tab.id
                  ? 'text-primary bg-gray-900 border-b-2 border-primary'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Contenido según tab activo */}
      {activeTab === 'info' && (
        <div className="space-y-8">
        {/* Botón para ver tutorial */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <BookOpen className="w-6 h-6 text-white" />
            <h3 className="text-xl font-bold text-white">Tutorial interactivo</h3>
          </div>
          <p className="text-white mb-4">
            ¿Necesitas ayuda? Vuelve a ver el tutorial paso a paso de cómo funciona 9citas
          </p>
          <Button
            variant="accent"
            onClick={handleShowTutorial}
          >
            Ver tutorial de nuevo
          </Button>
        </div>

        {/* Cómo funciona */}
        <section className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">¿Cómo funciona 9citas?</h2>
          <div className="text-gray-300 space-y-3">
            <p>
              <strong className="text-white">1. Registro gratuito:</strong> Crea tu cuenta en menos de un minuto indicando tu orientación (hetero o gay).
            </p>
            <p>
              <strong className="text-white">2. Completa tu perfil:</strong> Añade tu información, fotos y preferencias.
            </p>
            <p>
              <strong className="text-white">3. Explora perfiles:</strong> Con el plan gratuito puedes ver hasta 50 perfiles y chatear con cualquiera.
            </p>
            <p>
              <strong className="text-white">4. Dale "Me gusta":</strong> Marca los perfiles que te interesan y empieza a chatear.
            </p>
            <p>
              <strong className="text-white">5. Mejora con 9Plus:</strong> Obtén acceso ilimitado, filtros avanzados, ver quién te dio like y más funciones premium.
            </p>
          </div>
        </section>

        {/* Planes */}
        <section className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Planes disponibles</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Plan Gratis</h3>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li>Ver hasta 50 perfiles en tu ubicación actual</li>
                <li>Chatear con cualquier usuario (sin restricciones)</li>
                <li>Ver los últimos 5 "Me gusta" recibidos</li>
                <li>Filtros básicos: TODOS, RECIENTES, NUEVOS</li>
                <li>Solicitar y compartir fotos privadas</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-accent mb-2">Plan 9Plus - 5 €/mes</h3>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li>Perfiles ilimitados (sin límite de 50)</li>
                <li>Filtros avanzados: distancia, edad, género, tipo de relación, ROL (gay)</li>
                <li>Ver distancia exacta en km a cada usuario</li>
                <li>Ver ciudad de todos los usuarios</li>
                <li>Ver todos los "Me gusta" recibidos (sin límite)</li>
                <li>Confirmación de lectura de mensajes (✓✓ leído)</li>
                <li>Función RoAM: boost de visibilidad 10x (6,49€/hora)</li>
                <li>Cambiar ubicación manualmente cuando quieras</li>
                <li>Prioridad en resultados de búsqueda</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Reglas y normas */}
        <section className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Reglas y normas de uso</h2>
          <div className="text-gray-300 space-y-3">
            <p className="text-red-400 font-semibold">
              ⚠️ El incumplimiento de estas reglas puede resultar en la eliminación de tu perfil
            </p>
            
            <div className="space-y-2">
              <p>
                <strong className="text-white">1. Contenido apropiado:</strong> No se permiten fotos de desnudos mostrando pechos, genitales o glúteos en las fotos públicas. Las fotos privadas pueden tener contenido más explícito pero solo deben compartirse por chat con consentimiento.
              </p>
              <p>
                <strong className="text-white">2. Prostitución:</strong> Está prohibido pedir dinero a cambio de servicios sexuales.
              </p>
              <p>
                <strong className="text-white">3. Respeto:</strong> Evita mensajes con insultos, xenofobia, racismo o cualquier tipo de discriminación.
              </p>
              <p>
                <strong className="text-white">4. Veracidad:</strong> No te registres en una categoría que no te corresponda (si eres hetero no te registres como gay y viceversa).
              </p>
              <p>
                <strong className="text-white">5. Edad:</strong> Debes tener al menos 18 años para usar esta plataforma.
              </p>
              <p>
                <strong className="text-white">6. Autenticidad:</strong> Usa fotos reales tuyas. Los perfiles falsos o suplantación de identidad serán eliminados.
              </p>
            </div>
          </div>
        </section>

        {/* Legal */}
        <section className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Información legal</h2>
          <div className="text-gray-300 space-y-2">
            <button
              onClick={() => setActiveTab('terms')}
              className="block text-primary hover:underline text-left"
            >
              Términos y condiciones
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className="block text-primary hover:underline text-left"
            >
              Política de privacidad
            </button>
            <button
              onClick={() => setActiveTab('cookies')}
              className="block text-primary hover:underline text-left"
            >
              Política de cookies
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className="block text-primary hover:underline text-left"
            >
              Normas de la comunidad
            </button>
          </div>
        </section>

        {/* Contacto */}
        <section className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Contacto y soporte</h2>
          <div className="text-gray-300 space-y-3">
            <div>
              <p className="font-semibold text-white mb-1">Soporte General</p>
              <p>📧 soporte@9citas.com</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Asuntos Legales</p>
              <p>⚖️ legal@9citas.com</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Privacidad y Datos</p>
              <p>🔒 privacy@9citas.com</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Seguridad y Reportes</p>
              <p>🛡️ safety@9citas.com</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Horario de Atención</p>
              <p>🕐 Lunes a Viernes, 9:00 - 18:00h (CET)</p>
            </div>
          </div>
        </section>

        {/* Empresa */}
        <section className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Información de la empresa</h2>
          <div className="text-gray-300 space-y-2">
            <p>
              <strong className="text-white">Empresa:</strong> SMM4U LLC Social Media Marketing Four You
            </p>
            <p>
              <strong className="text-white">Servicio:</strong> 9citas.com
            </p>
            <p className="text-sm text-gray-400 mt-4">
              © {new Date().getFullYear()} SMM4U LLC Social Media Marketing Four You. Todos los derechos reservados.
            </p>
          </div>
        </section>
        </div>
      )}

      {/* Términos y Condiciones */}
      {activeTab === 'terms' && (
        <div className="bg-gray-900 rounded-xl p-8">
          <TermsAndConditions />
        </div>
      )}

      {/* Política de Privacidad */}
      {activeTab === 'privacy' && (
        <div className="bg-gray-900 rounded-xl p-8">
          <PrivacyPolicy />
        </div>
      )}

      {/* Política de Cookies */}
      {activeTab === 'cookies' && (
        <div className="bg-gray-900 rounded-xl p-8">
          <CookiePolicy />
        </div>
      )}

      {/* Normas de la Comunidad */}
      {activeTab === 'community' && (
        <div className="bg-gray-900 rounded-xl p-8">
          <CommunityGuidelines />
        </div>
      )}
    </div>
  )
}

