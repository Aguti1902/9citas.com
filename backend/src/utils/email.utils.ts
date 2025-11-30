import crypto from 'crypto';

// Generar token único
export const generateVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Enviar email de verificación (simulado para desarrollo)
export const sendVerificationEmail = async (email: string, token: string): Promise<void> => {
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${token}`;
  
  // En desarrollo, solo log en consola
  console.log('\n============================================');
  console.log('📧 EMAIL DE VERIFICACIÓN');
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

  // TODO: En producción, usar un servicio real de email
  // Opciones: SendGrid, AWS SES, Mailgun, Postmark, etc.
  // 
  // Ejemplo con SendGrid:
  // const sgMail = require('@sendgrid/mail');
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  // await sgMail.send({
  //   to: email,
  //   from: 'noreply@9citas.com',
  //   subject: 'Verifica tu cuenta en 9citas',
  //   html: `...`
  // });
};

// Enviar email de bienvenida
export const sendWelcomeEmail = async (email: string, name: string): Promise<void> => {
  console.log('\n============================================');
  console.log('🎉 EMAIL DE BIENVENIDA');
  console.log('============================================');
  console.log(`Para: ${email}`);
  console.log(`\nHola ${name}!`);
  console.log(`\n¡Bienvenido a 9citas! Tu cuenta ha sido verificada exitosamente.`);
  console.log(`\nYa puedes empezar a conectar con personas cerca de ti.`);
  console.log('============================================\n');
};

