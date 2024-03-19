// pages/api/users/create.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {


  if (req.method === "GET") {
    try {
      const rutas = await prisma.user.findMany();
      return res.status(200).json(rutas);
    } catch (error) {
      console.error("Error al obtener los pasajeros:", error);
      return res.status(500).json({ message: "Error interno del servidor" });

    }
  }


  else if (req.method === 'POST') {
    const usuarios = req.body; // Asumimos que `usuarios` es un array de objetos usuario

    // Procesar cada usuario individualmente
    const resultados = [];
    for (const usuario of usuarios) {
      const { rut, nombres, apellidoPaterno, apellidoMaterno, cargo, asientoAsignado, isExecutive, email, password, role } = usuario;

      try {
        // Verificar si el usuario ya existe
        const existingUser = await prisma.user.findUnique({ where: { rut } });
        if (existingUser) {
          // Si el usuario ya existe, saltar a la siguiente iteración
          continue;
        }

        // Si el usuario no existe, crearlo
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
          data: {
            rut,
            nombres,
            apellidoPaterno,
            apellidoMaterno,
            cargo,
            asientoAsignado,
            isExecutive: isExecutive === "true",
            email,
            password: hashedPassword,
            role,
          },
        });

        // Agregar el usuario creado a los resultados
        resultados.push({
          id: newUser.id,
          rut: newUser.rut,
          nombres: newUser.nombres,
          apellidoPaterno: newUser.apellidoPaterno,
          apellidoMaterno: newUser.apellidoMaterno,
          cargo: newUser.cargo,
          asientoAsignado: newUser.asientoAsignado,
          isExecutive: newUser.isExecutive,
          email: newUser.email,
          role: newUser.role,
        });
      } catch (error) {
        console.error('Error creating user:', error);
        // Manejar errores como sea apropiado
      }
    }

    // Devolver los resultados
    return res.status(201).json(resultados);
  } else {
    // Si no es un POST, devolver error de método no permitido
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}