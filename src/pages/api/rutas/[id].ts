import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (req.method === 'PUT') {
        const { city, region, flightCode, description } = req.body;
        try {
            const updatedRoute = await prisma.route.update({
                where: {
                    id: Number(id),
                },
                data: {
                    city,
                    region,
                    flightCode,
                    description,
                },
            });
            return res.status(200).json(updatedRoute);
        }
        catch (error) {
            console.error('Error al actualizar la ruta:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    } else if (req.method === 'DELETE') {
        try {
            const deletedRoute = await prisma.route.delete({
                where: {
                    id: Number(id),
                },
            });
            return res.status(200).json(deletedRoute);
        }
        catch (error) {
            console.error('Error al eliminar la ruta:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

}


