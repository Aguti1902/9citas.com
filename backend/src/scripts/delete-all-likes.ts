import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Eliminando TODOS los likes de la base de datos...\n');

  const count = await prisma.like.count();
  console.log(`📊 Total de likes en la base de datos: ${count}`);

  if (count === 0) {
    console.log('✅ No hay likes para eliminar');
    return;
  }

  const result = await prisma.like.deleteMany({});
  
  console.log(`\n✅ ${result.count} likes eliminados exitosamente`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

