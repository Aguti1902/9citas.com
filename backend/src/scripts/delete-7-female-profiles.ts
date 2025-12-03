import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function delete7FemaleProfiles() {
  try {
    console.log('🗑️  Eliminando los 7 perfiles de mujeres...\n');

    // Buscar los 7 perfiles de mujeres (sofía1, lucía2, maría3, paula4, elena5, carla6, natalia7)
    const emails = [
      'sofía1@9citas.com',
      'lucía2@9citas.com',
      'maría3@9citas.com',
      'paula4@9citas.com',
      'elena5@9citas.com',
      'carla6@9citas.com',
      'natalia7@9citas.com',
    ];

    const users = await prisma.user.findMany({
      where: {
        email: {
          in: emails,
        },
      },
      include: {
        profile: true,
      },
    });

    console.log(`📊 Encontrados ${users.length} usuarios a eliminar\n`);

    for (const user of users) {
      if (user.profile) {
        console.log(`🗑️  Eliminando perfil de ${user.email}...`);
        
        // Eliminar perfil (esto eliminará automáticamente fotos, likes, mensajes, etc. por cascada)
        await prisma.profile.delete({
          where: { id: user.profile.id },
        });
        
        console.log(`   ✅ Perfil eliminado`);
      }
      
      // Eliminar usuario
      console.log(`🗑️  Eliminando usuario ${user.email}...`);
      await prisma.user.delete({
        where: { id: user.id },
      });
      console.log(`   ✅ Usuario eliminado\n`);
    }

    console.log(`✅ Eliminados ${users.length} perfiles y usuarios`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

delete7FemaleProfiles();

