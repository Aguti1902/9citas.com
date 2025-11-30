import crypto from 'crypto';
import { Resend } from 'resend';

// Inicializar Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Generar token único
export const generateVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Enviar email de verificación
export const sendVerificationEmail = async (email: string, token: string): Promise<void> => {
  const verificationUrl = `${process.env.FRONTEND_URL || 'https://9citas-com-fyij.vercel.app'}/verify-email/${token}`;
  
  // Si no hay API key de Resend, usar modo desarrollo (logs)
  if (!process.env.RESEND_API_KEY) {
    console.log('\n============================================');
    console.log('📧 EMAIL DE VERIFICACIÓN (MODO DESARROLLO)');
    console.log('============================================');
    console.log(`Para: ${email}`);
    console.log(`Asunto: Verifica tu cuenta en 9citas`);
    console.log(`\nHola!`);
    console.log(`\nGracias por registrarte en 9citas.`);
    console.log(`\nPor favor verifica tu cuenta haciendo click en el siguiente enlace:`);
    console.log(`\n${verificationUrl}`);
    console.log(`\nEste enlace expira en 24 horas.`);
    console.log(`\nSi no creaste esta cuenta, ignora este email.`);
    console.log('============================================\n');
    return;
  }

  // Enviar email real con Resend
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@9citas.com',
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
              .header { background: #fc4d5c; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; background: #fc4d5c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>9citas.com</h1>
              </div>
              <div class="content">
                <h2>¡Hola!</h2>
                <p>Gracias por registrarte en <strong>9citas</strong>, la mejor app para conocer gente cerca de ti.</p>
                <p>Para completar tu registro y activar tu cuenta, haz clic en el siguiente botón:</p>
                <p style="text-align: center;">
                  <a href="${verificationUrl}" class="button">Verificar mi cuenta</a>
                </p>
                <p>O copia y pega este enlace en tu navegador:</p>
                <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
                <p><strong>Este enlace expira en 24 horas.</strong></p>
                <p>Si no creaste esta cuenta, puedes ignorar este email.</p>
              </div>
              <div class="footer">
                <p>© 2025 9citas.com - Todos los derechos reservados</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
    console.log(`✅ Email de verificación enviado a ${email}`);
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    // No lanzar error para no romper el flujo de registro
  }
};

// Enviar email de bienvenida
export const sendWelcomeEmail = async (email: string, name: string): Promise<void> => {
  if (!process.env.RESEND_API_KEY) {
    console.log('\n============================================');
    console.log('🎉 EMAIL DE BIENVENIDA (MODO DESARROLLO)');
    console.log('============================================');
    console.log(`Para: ${email}`);
    console.log(`\nHola ${name}!`);
    console.log(`\n¡Bienvenido a 9citas! Tu cuenta ha sido verificada exitosamente.`);
    console.log(`\nYa puedes empezar a conectar con personas cerca de ti.`);
    console.log('============================================\n');
    return;
  }

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@9citas.com',
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
              .header { background: #01cc00; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; background: #fc4d5c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 ¡Bienvenido a 9citas!</h1>
              </div>
              <div class="content">
                <h2>¡Hola ${name}!</h2>
                <p>Tu cuenta ha sido <strong>verificada exitosamente</strong>.</p>
                <p>Ya puedes empezar a:</p>
                <ul>
                  <li>✨ Descubrir personas cerca de ti</li>
                  <li>💬 Enviar mensajes y chatear</li>
                  <li>❤️ Dar likes y hacer match</li>
                  <li>📸 Compartir fotos</li>
                </ul>
                <p style="text-align: center;">
                  <a href="${process.env.FRONTEND_URL || 'https://9citas-com-fyij.vercel.app'}" class="button">Ir a 9citas</a>
                </p>
                <p>¡Buena suerte y disfruta conociendo gente nueva!</p>
              </div>
              <div class="footer">
                <p>© 2025 9citas.com - Todos los derechos reservados</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
    console.log(`✅ Email de bienvenida enviado a ${email}`);
  } catch (error) {
    console.error('❌ Error al enviar email de bienvenida:', error);
  }
};

