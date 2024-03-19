import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const session = await getServerSession(req, res, authOptions);
        if (!session || !session.user.id) {
            return res.status(401).json({ message: 'Debe iniciar sesión para reservar vuelos' });
        }

        const userId = Number(session.user.id);
        const vueloId = Number(req.body.vueloId);
        const estacionamiento = req.body.estacionamiento === true; // Asume un valor booleano enviado en la solicitud

        if (isNaN(userId) || isNaN(vueloId)) {
            return res.status(400).json({ message: "Datos de la solicitud inválidos." });
        }

        try {
            const reserva = await prisma.reserva.create({
                data: {
                    userId,
                    vueloId,
                    estacionamiento, // Agrega esto a la data de la reserva
                },
            });

            res.status(200).json(reserva);
        } catch (error) {
            console.error('Error al crear reserva:', error);
            res.status(500).json({ message: 'Error al crear la reserva' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
