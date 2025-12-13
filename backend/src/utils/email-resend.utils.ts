import crypto from 'crypto';
import { Resend } from 'resend';

// Generar token único
export const generateVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Inicializar Resend
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    const errorMsg = '❌ ERROR CRÍTICO: RESEND_API_KEY no está configurado. Los emails NO se enviarán.';
    console.error(errorMsg);
    console.error('Configura RESEND_API_KEY en las variables de entorno');
    console.error('Obtén tu API key en: https://resend.com/api-keys');
    throw new Error(errorMsg);
  }

  console.log('📧 Resend configurado correctamente');
  return new Resend(apiKey);
};

// Enviar email de verificación
export const sendVerificationEmail = async (email: string, token: string): Promise<void> => {
  console.log(`\n📧 ========================================`);
  console.log(`📧 ENVIANDO EMAIL DE VERIFICACIÓN`);
  console.log(`📧 Destinatario: ${email}`);
  console.log(`📧 ========================================`);

  const frontendUrl = process.env.FRONTEND_URL || process.env.VERIFICATION_URL || 'https://9citas.com';
  const verificationUrl = `${frontendUrl}/verify-email/${token}`;
  const fromEmail = process.env.RESEND_FROM_EMAIL || '9citas <onboarding@resend.dev>';

  console.log(`📧 URL de verificación: ${verificationUrl}`);
  console.log(`📧 From: ${fromEmail}`);

  const resend = getResendClient();

  const result = await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: 'Verifica tu cuenta en 9citas',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #fc4d5c 0%, #ff6b7a 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #fc4d5c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Bienvenido a 9citas!</h1>
          </div>
          <div class="content">
            <p>Hola,</p>
            <p>Gracias por registrarte en <strong>9citas</strong>.</p>
            <p>Para completar tu registro y empezar a conectar con personas cerca de ti, por favor verifica tu cuenta haciendo click en el siguiente botón:</p>
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verificar mi cuenta</a>
            </div>
            <p>O copia y pega este enlace en tu navegador:</p>
            <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
            <p><strong>Este enlace expira en 24 horas.</strong></p>
            <p>Si no creaste esta cuenta, puedes ignorar este email de forma segura.</p>
          </div>
          <div class="footer">
            <p>© 2024 9citas.com - Conoce chicas y chicos cerca de ti</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });

  console.log(`✅ ========================================`);
  console.log(`✅ EMAIL DE VERIFICACIÓN ENVIADO EXITOSAMENTE`);
  console.log(`✅ Destinatario: ${email}`);
  console.log(`✅ Message ID: ${result.data?.id}`);
  console.log(`✅ ========================================\n`);
};

// Enviar email de bienvenida
export const sendWelcomeEmail = async (email: string, name: string): Promise<void> => {
  console.log(`\n🎉 Enviando email de bienvenida a: ${email}`);
  
  const resend = getResendClient();
  const fromEmail = process.env.RESEND_FROM_EMAIL || '9citas <onboarding@resend.dev>';

  const result = await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: '¡Bienvenido a 9citas!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #fc4d5c 0%, #ff6b7a 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Bienvenido a 9citas!</h1>
          </div>
          <div class="content">
            <p>Hola <strong>${name}</strong>,</p>
            <p>¡Tu cuenta ha sido verificada exitosamente!</p>
            <p>Ya puedes empezar a:</p>
            <ul>
              <li>📸 Subir tus fotos</li>
              <li>👥 Explorar perfiles cerca de ti</li>
              <li>💬 Chatear con otros usuarios</li>
              <li>❤️ Dar me gusta y hacer match</li>
            </ul>
            <p style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL || 'https://9citas.com'}" style="display: inline-block; background: #fc4d5c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px;">Empezar a conectar</a>
            </p>
          </div>
          <div class="footer">
            <p>© 2024 9citas.com - Conoce chicas y chicos cerca de ti</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });

  console.log(`✅ Email de bienvenida enviado exitosamente a: ${email} (ID: ${result.data?.id})\n`);
};

// Enviar email de recuperación de contraseña
export const sendPasswordResetEmail = async (email: string, token: string): Promise<void> => {
  console.log(`\n🔑 Enviando email de recuperación de contraseña a: ${email}`);

  const frontendUrl = process.env.FRONTEND_URL || 'https://9citas.com';
  const resetUrl = `${frontendUrl}/reset-password/${token}`;
  const fromEmail = process.env.RESEND_FROM_EMAIL || '9citas <onboarding@resend.dev>';

  const resend = getResendClient();

  const result = await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: 'Recupera tu contraseña de 9citas',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #fc4d5c 0%, #ff6b7a 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #fc4d5c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔑 Recuperación de contraseña</h1>
          </div>
          <div class="content">
            <p>Hola,</p>
            <p>Recibimos una solicitud para restablecer tu contraseña en <strong>9citas</strong>.</p>
            <p>Para crear una nueva contraseña, haz click en el siguiente botón:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Restablecer mi contraseña</a>
            </div>
            <p>O copia y pega este enlace en tu navegador:</p>
            <p style="word-break: break-all; color: #666;">${resetUrl}</p>
            <div class="warning">
              <p><strong>⏰ Este enlace expira en 1 hora.</strong></p>
            </div>
            <p>Si no solicitaste este cambio, puedes ignorar este email de forma segura. Tu contraseña permanecerá sin cambios.</p>
          </div>
          <div class="footer">
            <p>© 2024 9citas.com - Conoce chicas y chicos cerca de ti</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });

  console.log(`✅ Email de recuperación enviado exitosamente a: ${email} (ID: ${result.data?.id})\n`);
};

