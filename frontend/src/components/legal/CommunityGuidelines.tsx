export default function CommunityGuidelines() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-3xl font-bold text-white mb-6">Normas de la Comunidad</h1>
      
      <p className="text-gray-400 text-sm mb-6">
        Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 mb-8">
        <p className="text-white text-lg font-semibold mb-2">
          🤝 Bienvenido a la comunidad de 9citas
        </p>
        <p className="text-white">
          Nuestra misión es crear un espacio seguro, respetuoso y auténtico donde las personas puedan conocerse 
          y establecer conexiones significativas. Para lograrlo, todos los miembros deben seguir estas normas.
        </p>
      </div>

      <div className="bg-red-900/20 border border-red-500 rounded-xl p-6 mb-8">
        <p className="text-red-400 font-bold text-lg mb-2">
          ⚠️ Advertencia Importante
        </p>
        <p className="text-gray-300">
          El incumplimiento de estas normas puede resultar en acciones que van desde advertencias hasta la 
          eliminación permanente de tu cuenta, sin posibilidad de reembolso si eres usuario 9Plus.
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">1. Comportamiento Respetuoso</h2>
        
        <h3 className="text-xl font-semibold text-primary mb-3">✅ SÍ permitido:</h3>
        <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
          <li>Ser educado y respetuoso en todas las interacciones</li>
          <li>Expresar tus intereses y preferencias de manera honesta</li>
          <li>Rechazar avances de manera cortés</li>
          <li>Reportar comportamientos inapropiados</li>
          <li>Ser comprensivo con diferentes perspectivas</li>
        </ul>

        <h3 className="text-xl font-semibold text-red-500 mb-3">❌ NO permitido:</h3>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Acoso de cualquier tipo (sexual, verbal, etc.)</li>
          <li>Insultos, lenguaje ofensivo o agresivo</li>
          <li>Discriminación por raza, religión, género, orientación sexual, edad, discapacidad o nacionalidad</li>
          <li>Mensajes xenófobos o racistas</li>
          <li>Incitación al odio o violencia</li>
          <li>Amenazas o intimidación</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">2. Contenido de Perfil y Fotos</h2>
        
        <h3 className="text-xl font-semibold text-white mb-3">2.1 Fotos de Perfil (Públicas)</h3>
        <h4 className="text-lg font-semibold text-primary mb-2">✅ SÍ permitido:</h4>
        <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
          <li>Fotos claras y recientes tuyas</li>
          <li>Selfies y fotos tomadas por otras personas</li>
          <li>Fotos en ropa de baño (sin desnudez explícita)</li>
          <li>Fotos en contextos sociales o actividades</li>
          <li>Múltiples fotos para mostrar diferentes facetas</li>
        </ul>

        <h4 className="text-lg font-semibold text-red-500 mb-2">❌ NO permitido:</h4>
        <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
          <li>Desnudez explícita (pechos, genitales o glúteos descubiertos)</li>
          <li>Fotos de otras personas sin su consentimiento</li>
          <li>Fotos de menores de edad</li>
          <li>Imágenes con contenido violento o perturbador</li>
          <li>Fotos con armas de fuego o armas</li>
          <li>Imágenes con símbolos de odio</li>
          <li>Fotos de animales sin incluir personas</li>
          <li>Imágenes de baja calidad o ilegibles</li>
        </ul>

        <h3 className="text-xl font-semibold text-white mb-3">2.2 Fotos Privadas</h3>
        <p className="text-gray-300 mb-4">
          Las fotos privadas tienen reglas más flexibles, pero aún así:
        </p>
        <h4 className="text-lg font-semibold text-red-500 mb-2">❌ NO permitido:</h4>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Contenido ilegal o que viole las leyes locales</li>
          <li>Fotos de menores de edad</li>
          <li>Compartir fotos privadas de otros usuarios sin su consentimiento</li>
          <li>Solicitar fotos de manera acosadora o insistente</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">3. Autenticidad e Identidad</h2>
        
        <h3 className="text-xl font-semibold text-primary mb-3">✅ SÍ permitido:</h3>
        <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
          <li>Usar tu nombre real o un apodo</li>
          <li>Describir tus intereses y personalidad honestamente</li>
          <li>Actualizar tu edad conforme pasa el tiempo</li>
        </ul>

        <h3 className="text-xl font-semibold text-red-500 mb-3">❌ NO permitido:</h3>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Perfiles falsos o cuentas bot</li>
          <li>Hacerse pasar por otra persona (suplantación de identidad)</li>
          <li>Usar fotos de modelos, celebridades o personas que no eres tú</li>
          <li>Mentir sobre tu edad (especialmente si eres menor de 18 años)</li>
          <li>Crear múltiples cuentas</li>
          <li>Registrarse en una orientación sexual que no te corresponde</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">4. Actividades Prohibidas</h2>
        
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold text-white mb-2">🚫 Prostitución y Servicios Sexuales</h3>
          <p className="text-gray-300">
            Está estrictamente prohibido solicitar, ofrecer o promover servicios sexuales a cambio de dinero 
            u otra compensación. Esto incluye "sugar dating", escorts, o cualquier transacción sexual.
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold text-white mb-2">🚫 Spam y Promociones</h3>
          <p className="text-gray-300">
            No está permitido usar el Servicio para enviar spam, publicidad no solicitada, promocionar otros 
            servicios o sitios web, o solicitar información de contacto fuera de la plataforma con fines comerciales.
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold text-white mb-2">🚫 Estafas y Fraude</h3>
          <p className="text-gray-300">
            Está prohibido solicitar dinero, tarjetas de regalo, información bancaria o cualquier forma de 
            beneficio económico a otros usuarios. También está prohibido engañar a otros usuarios con historias 
            falsas o identidades inventadas.
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold text-white mb-2">🚫 Tráfico y Explotación</h3>
          <p className="text-gray-300">
            Cualquier forma de tráfico humano, explotación sexual o abuso está estrictamente prohibida y será 
            reportada a las autoridades correspondientes.
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">🚫 Drogas y Sustancias Ilegales</h3>
          <p className="text-gray-300">
            No se permite promover, vender o facilitar la compra de drogas ilegales o sustancias controladas.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">5. Privacidad y Seguridad</h2>
        
        <h3 className="text-xl font-semibold text-primary mb-3">✅ Consejos de Seguridad:</h3>
        <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
          <li>No compartas información personal sensible (dirección, datos bancarios) por chat</li>
          <li>Si vas a conocer a alguien en persona, hazlo en un lugar público</li>
          <li>Informa a un amigo o familiar sobre tus planes</li>
          <li>Confía en tu instinto - si algo no se siente bien, aléjate</li>
          <li>Usa las herramientas de bloqueo y reporte si alguien te hace sentir incómodo</li>
        </ul>

        <h3 className="text-xl font-semibold text-red-500 mb-3">❌ NO hagas:</h3>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Compartir fotos privadas de otros usuarios sin su consentimiento</li>
          <li>Grabar o capturar pantallas de conversaciones para uso malicioso</li>
          <li>Acosar o perseguir a otros usuarios fuera de la plataforma</li>
          <li>Recopilar información personal de otros usuarios</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">6. Uso Apropiado del Servicio</h2>
        
        <h3 className="text-xl font-semibold text-red-500 mb-3">❌ Está prohibido:</h3>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Usar bots o scripts automatizados</li>
          <li>Intentar hackear o comprometer la seguridad del Servicio</li>
          <li>Extraer datos de otros usuarios mediante scraping</li>
          <li>Interferir con el funcionamiento normal del Servicio</li>
          <li>Compartir tu cuenta con otras personas</li>
          <li>Vender o transferir tu cuenta</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">7. Sistema de Reportes y Bloqueos</h2>
        
        <h3 className="text-xl font-semibold text-white mb-3">7.1 Cómo Reportar</h3>
        <p className="text-gray-300 mb-4">
          Si encuentras contenido o comportamiento que viola estas normas:
        </p>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 mb-4">
          <li>Ve al perfil del usuario en cuestión</li>
          <li>Toca el botón de opciones (tres puntos)</li>
          <li>Selecciona "Reportar usuario"</li>
          <li>Elige la razón del reporte</li>
          <li>Proporciona detalles adicionales si es necesario</li>
        </ol>
        <p className="text-gray-300 mb-4">
          Nuestro equipo de moderación revisará todos los reportes. Los reportes falsos o malintencionados 
          también pueden resultar en acciones contra el reportador.
        </p>

        <h3 className="text-xl font-semibold text-white mb-3">7.2 Cómo Bloquear</h3>
        <p className="text-gray-300">
          Puedes bloquear a cualquier usuario en cualquier momento. Los usuarios bloqueados no podrán ver 
          tu perfil, enviarte mensajes ni interactuar contigo de ninguna forma.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">8. Consecuencias por Violación</h2>
        <p className="text-gray-300 mb-4">
          Dependiendo de la gravedad y frecuencia de las violaciones, podemos tomar las siguientes acciones:
        </p>
        
        <div className="space-y-3">
          <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">1️⃣ Primera Advertencia</h3>
            <p className="text-gray-300 text-sm">
              Notificación sobre la violación con una explicación de la norma infringida
            </p>
          </div>

          <div className="bg-orange-900/20 border border-orange-500 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-orange-400 mb-2">2️⃣ Suspensión Temporal</h3>
            <p className="text-gray-300 text-sm">
              Tu cuenta será suspendida por un período determinado (24 horas - 30 días)
            </p>
          </div>

          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-400 mb-2">3️⃣ Eliminación Permanente</h3>
            <p className="text-gray-300 text-sm">
              Tu cuenta será eliminada permanentemente sin posibilidad de recuperación. Si eres usuario 9Plus, 
              no se ofrecerá reembolso. Las violaciones graves (prostitución, menores, etc.) resultarán en 
              eliminación inmediata.
            </p>
          </div>

          <div className="bg-purple-900/20 border border-purple-500 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-purple-400 mb-2">4️⃣ Reporte a Autoridades</h3>
            <p className="text-gray-300 text-sm">
              En casos de actividad criminal (menores, tráfico, amenazas graves), reportaremos el caso 
              a las autoridades competentes
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">9. Moderación de Contenido</h2>
        <p className="text-gray-300 mb-4">
          9citas.com se reserva el derecho de:
        </p>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Revisar y eliminar contenido que viole estas normas</li>
          <li>Suspender o eliminar cuentas sin previo aviso en casos graves</li>
          <li>Utilizar sistemas automatizados y moderadores humanos para detectar violaciones</li>
          <li>Actualizar estas normas en cualquier momento</li>
          <li>Tomar la decisión final sobre disputas</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">10. Apelaciones</h2>
        <p className="text-gray-300 mb-4">
          Si crees que tu cuenta fue suspendida o eliminada por error, puedes contactarnos en:
        </p>
        <div className="bg-gray-800 rounded-lg p-4 text-gray-300 mb-4">
          <p><strong className="text-white">Email de Apelaciones:</strong> appeals@9citas.com</p>
          <p className="text-sm mt-2">Incluye: tu correo electrónico registrado, razón de la apelación, y cualquier evidencia relevante</p>
        </div>
        <p className="text-gray-300">
          Revisaremos tu apelación en un plazo de 5-7 días hábiles. Las decisiones de apelación son finales.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">11. Agradecimiento</h2>
        <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6">
          <p className="text-white text-center">
            Gracias por ser parte de nuestra comunidad y ayudarnos a mantener 9citas como un lugar seguro, 
            respetuoso y divertido para todos. Juntos podemos crear un espacio donde las personas puedan 
            conectar de manera auténtica y significativa. 💕
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">12. Contacto</h2>
        <p className="text-gray-300 mb-4">
          Si tienes preguntas sobre estas Normas de la Comunidad:
        </p>
        <div className="bg-gray-800 rounded-lg p-4 text-gray-300">
          <p><strong className="text-white">Empresa:</strong> SMM4U LLC Social Media Marketing Four You</p>
          <p><strong className="text-white">Servicio:</strong> 9citas.com</p>
          <p><strong className="text-white">Soporte:</strong> soporte@9citas.com</p>
          <p><strong className="text-white">Seguridad:</strong> safety@9citas.com</p>
          <p><strong className="text-white">Apelaciones:</strong> appeals@9citas.com</p>
        </div>
      </section>
    </div>
  )
}

