import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Generar token único
export const generateVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Configurar el transporter de nodemailer
const getTransporter = () => {
  // Si no hay configuración SMTP, usar modo desarrollo (console.log)
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true para 465, false para otros puertos
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Enviar email de verificación
export const sendVerificationEmail = async (email: string, token: string): Promise<void> => {
  // Obtener URL del frontend desde variables de entorno
  const frontendUrl = process.env.FRONTEND_URL || process.env.VERIFICATION_URL || 'https://9citas.com';
  const verificationUrl = `${frontendUrl}/verify-email/${token}`;

  const transporter = getTransporter();

  // Si no hay transporter (modo desarrollo), usar console.log
  if (!transporter) {
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

  // Modo producción: enviar email real
  try {
    await transporter.sendMail({
      from: `"9citas" <${process.env.SMTP_USER}>`,
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
      text: `
        ¡Bienvenido a 9citas!

        Gracias por registrarte en 9citas.

        Por favor verifica tu cuenta haciendo click en el siguiente enlace:
        ${verificationUrl}

        Este enlace expira en 24 horas.

        Si no creaste esta cuenta, ignora este email.
      `,
    });

    console.log(`✅ Email de verificación enviado a: ${email}`);
  } catch (error) {
    console.error('❌ Error al enviar email de verificación:', error);
    // En caso de error, mostrar en consola para debugging
    console.log('\n============================================');
    console.log('📧 EMAIL DE VERIFICACIÓN (FALLBACK)');
    console.log('============================================');
    console.log(`Para: ${email}`);
    console.log(`URL: ${verificationUrl}`);
    console.log('============================================\n');
  }
};

// Enviar email de bienvenida
export const sendWelcomeEmail = async (email: string, name: string): Promise<void> => {
  const transporter = getTransporter();

  // Si no hay transporter (modo desarrollo), usar console.log
  if (!transporter) {
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

  // Modo producción: enviar email real
  try {
    await transporter.sendMail({
      from: `"9citas" <${process.env.SMTP_USER}>`,
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
      text: `
        ¡Bienvenido a 9citas!

        Hola ${name},

        ¡Tu cuenta ha sido verificada exitosamente!

        Ya puedes empezar a conectar con personas cerca de ti.

        Visita: ${process.env.FRONTEND_URL || 'https://9citas.com'}
      `,
    });

    console.log(`✅ Email de bienvenida enviado a: ${email}`);
  } catch (error) {
    console.error('❌ Error al enviar email de bienvenida:', error);
    // En caso de error, mostrar en consola para debugging
    console.log('\n============================================');
    console.log('🎉 EMAIL DE BIENVENIDA (FALLBACK)');
    console.log('============================================');
    console.log(`Para: ${email}`);
    console.log(`Nombre: ${name}`);
    console.log('============================================\n');
  }
};

// Enviar email de recuperación de contraseña
export const sendPasswordResetEmail = async (email: string, token: string): Promise<void> => {
  const frontendUrl = process.env.FRONTEND_URL || 'https://9citas.com';
  const resetUrl = `${frontendUrl}/reset-password/${token}`;

  const transporter = getTransporter();

  // Si no hay transporter (modo desarrollo), usar console.log
  if (!transporter) {
    console.log('\n============================================');
    console.log('🔑 EMAIL DE RECUPERACIÓN DE CONTRASEÑA (MODO DESARROLLO)');
    console.log('============================================');
    console.log(`Para: ${email}`);
    console.log(`Asunto: Recupera tu contraseña de 9citas`);
    console.log(`\nHola!`);
    console.log(`\nRecibimos una solicitud para restablecer tu contraseña en 9citas.`);
    console.log(`\nPara crear una nueva contraseña, haz click en el siguiente enlace:`);
    console.log(`\n${resetUrl}`);
    console.log(`\nEste enlace expira en 1 hora.`);
    console.log(`\nSi no solicitaste este cambio, ignora este email y tu contraseña permanecerá sin cambios.`);
    console.log('============================================\n');
    return;
  }

  // Modo producción: enviar email real
  try {
    await transporter.sendMail({
      from: `"9citas" <${process.env.SMTP_USER}>`,
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
      text: `
        Recuperación de contraseña - 9citas

        Hola,

        Recibimos una solicitud para restablecer tu contraseña en 9citas.

        Para crear una nueva contraseña, haz click en el siguiente enlace:
        ${resetUrl}

        Este enlace expira en 1 hora.

        Si no solicitaste este cambio, ignora este email y tu contraseña permanecerá sin cambios.
      `,
    });

    console.log(`✅ Email de recuperación de contraseña enviado a: ${email}`);
  } catch (error) {
    console.error('❌ Error al enviar email de recuperación:', error);
    // En caso de error, mostrar en consola para debugging
    console.log('\n============================================');
    console.log('🔑 EMAIL DE RECUPERACIÓN (FALLBACK)');
    console.log('============================================');
    console.log(`Para: ${email}`);
    console.log(`URL: ${resetUrl}`);
    console.log('============================================\n');
  }
};

