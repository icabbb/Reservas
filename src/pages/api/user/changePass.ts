// pages/api/user/changePass.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

// Importa las opciones de autenticación
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user.rut) {

        return res.status(401).json({ message: 'No autorizado' });

    }



    const { newPassword } = req.body;

    // Asume que session.user.rut es válido y existe en la base de datos
    const rut = session.user.rut;

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const user = await prisma.user.update({

            where: { rut: rut },
            data: {
                password: hashedPassword,
                isFirstLogin: false,
            },


        });
        return res.status(200).json({ message: 'Contraseña actualizada correctamente' });


    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }

}


