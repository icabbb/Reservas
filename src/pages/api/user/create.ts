// pages/api/users/create.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { rut, Nombre, Apellido, email, password, role } = req.body;

  try {
    // Validar los datos de entrada aquí si es necesario

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario en la base de datos
    const user = await prisma.user.create({
      data: {
        rut,
        nombre: Nombre,
        apellido: Apellido,
        email,
        password: hashedPassword,
        role,
      },
    });

    // Responder con el usuario creado (excluyendo la contraseña)
    return res.status(201).json({
      id: user.id,
      rut: user.rut,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Error creating user' });
  }
}
