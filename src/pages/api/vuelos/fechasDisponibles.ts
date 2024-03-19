import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const fechas = await prisma.vuelo.findMany({
                select: {
                    fechaHoraSalida: true,
                },
                orderBy: {
                    fechaHoraSalida: 'asc',
                }
            });

            // Using a Set to ensure uniqueness
            const fechasDisponibles = [...new Set(fechas.map(vuelo =>
                vuelo.fechaHoraSalida.toISOString().split('T')[0]))];

            return res.status(200).json(fechasDisponibles);
        } catch (error) {
            console.error('Error al obtener las fechas:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    } else {
        return res.status(405).end('Method Not Allowed');
    }
}
