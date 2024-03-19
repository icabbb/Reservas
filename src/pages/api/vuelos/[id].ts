import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            // Intenta encontrar un vuelo con el id proporcionado.
            const vuelo = await prisma.vuelo.findUnique({
                where: { id: Number(id) }, // Convierte el id a número para asegurar que coincida con el tipo esperado.
            });

            // Si no se encuentra el vuelo, devuelve un error 404.
            if (!vuelo) {
                return res.status(404).json({ message: 'El vuelo no existe.' });
            }

            // Si se encuentra el vuelo, devuelve el objeto vuelo.
            return res.status(200).json(vuelo);
        } catch (error) {
            console.error('Error al recuperar el vuelo:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
    else if (req.method === 'PUT') {
        const { id, fechaHoraSalida, numeroVuelo, matriculaAvion, origen, destino } = req.body;

        // Asegúrate de que el id esté presente
        if (!id) {
            return res.status(400).json({ message: 'El ID del vuelo es necesario para la actualización' });
        }

        try {
            const updateVuelo = await prisma.vuelo.update({
                where: {
                    id: id, // Asegúrate de que este sea el nombre correcto del campo identificador
                },
                data: {
                    fechaHoraSalida,
                    numeroVuelo,
                    matriculaAvion,
                    origen,
                    destino,
                },
            });
            return res.status(200).json(updateVuelo);
        } catch (error) {
            console.error('Error al actualizar la ruta:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }


    } else if (req.method === 'DELETE') {
        try {
            const vuelo = await prisma.vuelo.delete({
                where: { id: Number(id) }, // Convierte a número si es necesario.
            });
            return res.status(200).json(vuelo);
        } catch (error) {
            // Asegúrate de manejar diferentes tipos de errores aquí.
            if ((error as { code: string }).code === 'P2025') {
                return res.status(404).json({ message: 'El vuelo a eliminar no existe.' });
            } else {
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
        }
    } else {
        // Si no es una solicitud DELETE, devuelve un error 405 Método No Permitido.
        return res.status(405).json({ message: 'Método no permitido' });
    }
}