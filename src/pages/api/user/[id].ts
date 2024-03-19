import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (req.method === 'PUT') {
        try {
            const {
                rut,
                nombre,
                apellidoPaterno,
                apellidoMaterno,
                email,
                cargo,
                asientoAsignado,
                isExecutive,
                role,
                password, // Considera si necesitas actualizar la contraseña en cada actualización.
            } = req.body;

            // Actualiza el usuario en la base de datos
            const user = await prisma.user.update({
                where: { id: Number(id) },
                data: {
                    rut,
                    nombres: nombre,
                    apellidoPaterno,
                    apellidoMaterno,
                    cargo,
                    asientoAsignado,
                    isExecutive: isExecutive === 'true',
                    email,
                    // Considera cómo manejas la actualización de la contraseña aquí
                    role,
                },
            });

            // Responder con el usuario actualizado (excluyendo la contraseña)
            return res.status(200).json(user);
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            // Maneja los errores adecuadamente
            return res.status(500).json({ message: 'Error al actualizar el usuario' });
        }
    } else if (req.method === 'DELETE') {
        try {
            const pasajero = await prisma.user.delete({
                where: { id: Number(id) }, // Convierte a número si es necesario.
            });
            return res.status(200).json(pasajero);
        } catch (error) {
            // Asegúrate de manejar diferentes tipos de errores aquí.
            if ((error as { code: string }).code === 'P2025') {
                return res.status(404).json({ message: 'El pasajero a eliminar no existe.' });
            } else {
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
        }
    } else {
        // Si no es una solicitud DELETE, devuelve un error 405 Método No Permitido.
        return res.status(405).json({ message: 'Método no permitido' });
    }
}