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


  else if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { rut, Nombre, apellidoPaterno, apellidoMaterno, cargo, asientoAsignado, isExecutive, email, password, role } = req.body;

  try {
    // Verificar si ya existe un usuario con el mismo RUT
    const existingUser = await prisma.user.findUnique({
      where: {
        rut,
      },
    });

    if (existingUser) {
      // Usuario ya existe, manejar según la lógica de negocio
      return res.status(409).json({ message: 'El RUT ya está registrado.' });
    }
  } catch (error) {
    console.error('Error finding user:', error);
    return res.status(500).json({ message: 'Error finding user' });
  }



  try {

    const hashedPassword = await bcrypt.hash(password, 10);

    const isExecutiveBoolean = isExecutive === "true";

    // Crear el usuario en la base de datos
    const user = await prisma.user.create({
      data: {
        rut,
        nombres: Nombre,
        apellidoPaterno: apellidoPaterno,
        apellidoMaterno: apellidoMaterno,
        cargo,
        asientoAsignado,
        isExecutive: isExecutiveBoolean,
        email,
        password: hashedPassword,
        role,
      },
    });

    // Responder con el usuario creado (excluyendo la contraseña)
    return res.status(201).json({
      id: user.id,
      rut: user.rut,
      nombre: user.nombres,
      apellidoPaterno: user.apellidoPaterno,
      apellidoMaterno: user.apellidoMaterno,
      cargo: user.cargo,
      asientoAsignado: user.asientoAsignado,
      isExecutive: user.isExecutive,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Error creating user' });
  }
}
