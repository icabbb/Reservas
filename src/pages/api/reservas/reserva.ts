import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const estacionamientosDisponibles = await calcularEstacionamientosDisponibles(prisma);
            return res.status(200).json({ disponibles: estacionamientosDisponibles });
        } catch (error) {
            console.error('Error al obtener estacionamientos disponibles:', error);
            return res.status(500).json({ message: 'Error al obtener estacionamientos disponibles' });
        }
    } else
        if (req.method !== 'POST') {
            return res.status(405).json({ message: 'Method Not Allowed' });
        }

    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { userId, vueloId, requiereEstacionamiento } = req.body;


    try {
        const reserva = await prisma.$transaction(async (prisma) => {
            const prismaClient = new PrismaClient(); // Create a new instance of PrismaClient
            const estacionamientosDisponibles = await calcularEstacionamientosDisponibles(prismaClient); // Pass the new instance to the function
            if (requiereEstacionamiento && estacionamientosDisponibles <= 0) {
                throw new Error('No hay estacionamientos disponibles');
            }

            if (requiereEstacionamiento) {
                await decrementarEstacionamiento(prismaClient); // Pass the new instance to the function
            }

            return prisma.reserva.create({
                data: {
                    userId: parseInt(userId),
                    vueloId: parseInt(vueloId),
                    estacionamiento: requiereEstacionamiento,
                },
            });
        });

        return res.status(201).json(reserva);
    } catch (error) {
        console.error('Error al crear reserva:', error);
        return res.status(500).json({ message: 'Error al crear la reserva' });
    }
}
async function calcularEstacionamientosDisponibles(prisma: PrismaClient): Promise<number> {
    const estacionamientoInfo = await prisma.estacionamientos.findUnique({
        where: {
            id: 1, // Asumiendo que hay un solo registro que controla los estacionamientos.
        },
    });

    if (!estacionamientoInfo) throw new Error('Información de estacionamientos no encontrada');

    const disponibles = estacionamientoInfo.total - estacionamientoInfo.ocupados - estacionamientoInfo.reservadoRoles - estacionamientoInfo.reservadoEmergencia;
    return disponibles;
}

async function decrementarEstacionamiento(prisma: PrismaClient): Promise<void> {
    await prisma.estacionamientos.update({
        where: {
            id: 1, // Asumiendo que hay un solo registro que controla los estacionamientos.
        },
        data: {
            ocupados: {
                increment: 1,
            },
        },
    });
}

