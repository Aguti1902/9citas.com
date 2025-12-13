#!/usr/bin/env node

/**
 * Script para verificar la configuración SMTP
 * Ejecutar en Railway con: node check-smtp-config.js
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('\n========================================');
console.log('🔍 VERIFICANDO CONFIGURACIÓN SMTP');
console.log('========================================\n');

// 1. Verificar variables de entorno
console.log('📋 Variables de entorno:');
console.log('------------------------');

const smtpConfig = {
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  FRONTEND_URL: process.env.FRONTEND_URL,
};

let hasErrors = false;

for (const [key, value] of Object.entries(smtpConfig)) {
  if (!value) {
    console.error(`❌ ${key}: NO CONFIGURADO`);
    hasErrors = true;
  } else {
    // Ocultar contraseña
    const displayValue = key === 'SMTP_PASS' ? '***' : value;
    console.log(`✅ ${key}: ${displayValue}`);
  }
}

if (hasErrors) {
  console.error('\n❌ ========================================');
  console.error('❌ FALTAN VARIABLES DE ENTORNO SMTP');
  console.error('❌ ========================================');
  console.error('\nConfigura estas variables en Railway:');
  console.error('- SMTP_HOST (ejemplo: smtp.hostinger.com)');
  console.error('- SMTP_PORT (ejemplo: 587)');
  console.error('- SMTP_USER (ejemplo: support@9citas.com)');
  console.error('- SMTP_PASS (la contraseña del email)');
  console.error('- FRONTEND_URL (ejemplo: https://9citas.com)');
  process.exit(1);
}

console.log('\n✅ Todas las variables SMTP están configuradas\n');

// 2. Intentar crear conexión SMTP
console.log('========================================');
console.log('🔌 PROBANDO CONEXIÓN SMTP');
console.log('========================================\n');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

console.log(`📡 Conectando a ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}...\n`);

// 3. Verificar conexión
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ ========================================');
    console.error('❌ ERROR DE CONEXIÓN SMTP');
    console.error('❌ ========================================\n');
    console.error('Error:', error.message);
    console.error('\n🔍 Posibles causas:\n');
    
    if (error.message.includes('Invalid login') || error.message.includes('authentication')) {
      console.error('1. ❌ Usuario o contraseña incorrectos');
      console.error('   - Verifica SMTP_USER y SMTP_PASS');
      console.error('   - Prueba acceder al webmail con estas credenciales');
    }
    
    if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
      console.error('2. ❌ Timeout de conexión');
      console.error('   - Verifica SMTP_HOST');
      console.error('   - Prueba con smtp.titan.email si usas Hostinger');
      console.error('   - Verifica que el puerto no esté bloqueado');
    }
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('3. ❌ Conexión rechazada');
      console.error('   - El servidor SMTP no está disponible');
      console.error('   - Verifica SMTP_HOST y SMTP_PORT');
    }
    
    console.error('\n💡 Soluciones sugeridas:\n');
    console.error('Para Hostinger:');
    console.error('  - Prueba SMTP_HOST=smtp.hostinger.com');
    console.error('  - O SMTP_HOST=smtp.titan.email');
    console.error('  - Puerto 587 (TLS) o 465 (SSL)');
    console.error('\nPara Gmail:');
    console.error('  - SMTP_HOST=smtp.gmail.com');
    console.error('  - SMTP_PORT=587');
    console.error('  - Usa App Password (no contraseña normal)');
    
    process.exit(1);
  } else {
    console.log('✅ ========================================');
    console.log('✅ CONEXIÓN SMTP EXITOSA');
    console.log('✅ ========================================\n');
    console.log('🎉 El servidor SMTP está configurado correctamente');
    console.log('📧 Los emails deberían enviarse sin problemas\n');
    
    // 4. Intentar enviar email de prueba (opcional)
    const testEmail = process.argv[2];
    
    if (testEmail) {
      console.log('========================================');
      console.log('📨 ENVIANDO EMAIL DE PRUEBA');
      console.log('========================================\n');
      console.log(`Destinatario: ${testEmail}\n`);
      
      transporter.sendMail({
        from: `"9citas Test" <${process.env.SMTP_USER}>`,
        to: testEmail,
        subject: '✅ Prueba de configuración SMTP - 9citas',
        html: `
          <h1>✅ Configuración SMTP Exitosa</h1>
          <p>Este email confirma que el servidor SMTP de <strong>9citas.com</strong> está configurado correctamente.</p>
          <p><strong>Detalles:</strong></p>
          <ul>
            <li>Servidor: ${process.env.SMTP_HOST}</li>
            <li>Puerto: ${process.env.SMTP_PORT}</li>
            <li>Usuario: ${process.env.SMTP_USER}</li>
          </ul>
          <p>Los emails de verificación y notificaciones funcionarán correctamente.</p>
        `,
        text: `Configuración SMTP Exitosa - 9citas.com`,
      }, (error, info) => {
        if (error) {
          console.error('❌ Error al enviar email de prueba:', error.message);
        } else {
          console.log('✅ Email de prueba enviado exitosamente!');
          console.log('📧 Message ID:', info.messageId);
          console.log('\n🎉 Todo funciona correctamente!\n');
        }
        process.exit(error ? 1 : 0);
      });
    } else {
      console.log('💡 Para enviar un email de prueba, ejecuta:');
      console.log(`   node check-smtp-config.js tu@email.com\n`);
      process.exit(0);
    }
  }
});

