import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminRut = '23995429-4';
  const plainAdminPassword = 'admin';
  const Role = 'ADMIN';

  // Generar un hash de la contraseña
  const hashedPassword = await bcrypt.hash(plainAdminPassword, 10);

  // Upsert del usuario administrador
  const adminUser = await prisma.user.upsert({
    where: { rut: adminRut },
    update: {},
    create: {
      rut: adminRut,
      password: hashedPassword,
      role: Role,

    },
  });

  console.log({ adminUser });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
