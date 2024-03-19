import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.status(405).json({ message: 'Método no permitido' });
        return;
    }

    const { origen, destino, fecha } = req.query;

    if (typeof origen !== 'string' || typeof destino !== 'string' || typeof fecha !== 'string') {
        res.status(400).json({ message: 'Parámetros de consulta inválidos' });
        return;
    }

    try {
        const fechaInicio = new Date(`${fecha}T00:00:00.000Z`);
        const fechaFin = new Date(`${fecha}T23:59:59.999Z`);
        const vuelos = await prisma.vuelo.findMany({
            where: {
                AND: [
                    { fechaHoraSalida: { gte: fechaInicio } },
                    { fechaHoraSalida: { lte: fechaFin } },
                    { origen },
                    { destino },
                ],
            },
            include: {
                Route: true,
            },
        });

        res.status(200).json({ vuelos });
    } catch (error) {
        console.error('Error al buscar vuelos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}
