import { PrismaClient } from '@prisma/client';



const prisma = new PrismaClient();

async function main() {
  const adminRut = '23995429-4'
  const adminPassword = 'admin'; 
  const Role = 'ADMIN';
  // Asegúrate de utilizar un RUT válido para tu administrador
   // Elige una contraseña segura

  

  const adminUser = await prisma.user.upsert({
    where: { rut: adminRut },
    update: {},
    create: {
      rut: adminRut,
      password: adminPassword,
      role: Role,
    

    
      
      // Agrega cualquier otro campo necesario para tu modelo de usuario
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