// pages/api/reservas/mis-reservas.js
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { getSession } from 'next-auth/react';
import { authOptions } from '../auth/[...nextauth]';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        // Obtén la sesión del usuario
        const session = await getServerSession(req, res, authOptions);
        if (!session || !session.user) {
            return res.status(401).json({ message: 'No autorizado' });
        }

        // Suponiendo que session.user.id guarda el ID del usuario
        const userId = Number(session.user.id);

        // Consulta las reservas del usuario
        try {
            const reservas = await prisma.reserva.findMany({
                where: { userId: userId },
                include: { vuelo: true }, // Asegúrate de incluir los detalles del vuelo
            });
            res.status(200).json(reservas);
        } catch (error) {
            console.error('Error al obtener reservas:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
