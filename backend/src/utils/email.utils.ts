import crypto from 'crypto';

// Generar token único
export const generateVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Enviar email de verificación (modo desarrollo - logs en consola)
export const sendVerificationEmail = async (email: string, token: string): Promise<void> => {
  const verificationUrl = `${process.env.FRONTEND_URL || 'https://9citas-com-hev9.vercel.app'}/verify-email/${token}`;
  
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

