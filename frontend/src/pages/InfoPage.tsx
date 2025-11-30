import Logo from '@/components/common/Logo'

export default function InfoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <Logo size="md" className="mb-4" />
      </div>

      <div className="space-y-8">
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
              <strong className="text-white">3. Explora perfiles:</strong> Con el plan gratuito puedes ver hasta 81 perfiles en tu ciudad y chatear con ellos.
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
                <li>Ver hasta 81 perfiles en tu ubicación actual</li>
                <li>Chatear solo con usuarios de tu ciudad</li>
                <li>Ver los últimos 5 "Me gusta" recibidos</li>
                <li>Funciones básicas de búsqueda</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-accent mb-2">Plan 9Plus - 5 €/mes</h3>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li>Perfiles ilimitados</li>
                <li>Chatear sin restricciones de ubicación</li>
                <li>Ver todos los "Me gusta" recibidos</li>
                <li>Filtros por edad y usuarios online</li>
                <li>Ver distancia a otros usuarios</li>
                <li>Prioridad en búsquedas</li>
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
            <a href="#" className="block text-primary hover:underline">
              Aviso legal
            </a>
            <a href="#" className="block text-primary hover:underline">
              Política de privacidad
            </a>
            <a href="#" className="block text-primary hover:underline">
              Política de cookies
            </a>
            <a href="#" className="block text-primary hover:underline">
              Términos y condiciones
            </a>
          </div>
        </section>

        {/* Contacto */}
        <section className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Contacto y soporte</h2>
          <div className="text-gray-300 space-y-2">
            <p>
              <strong className="text-white">Email:</strong> soporte@9citas.com
            </p>
            <p>
              <strong className="text-white">Horario:</strong> Lunes a Viernes, 9:00 - 18:00h
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

