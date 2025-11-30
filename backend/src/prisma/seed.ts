import { PrismaClient } from '@prisma/client';
import { generateFakeProfiles } from './seedHelpers';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seeding de la base de datos...');

  try {
    // Generar entre 200 y 400 perfiles falsos
    const count = Math.floor(Math.random() * 200) + 200;
    await generateFakeProfiles(count);

    console.log('✅ Seeding completado exitosamente');
  } catch (error) {
    console.error('❌ Error en seeding:', error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

