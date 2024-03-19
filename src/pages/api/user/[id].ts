//pages/api/user/[id].ts
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            // Asegúrate de que el ID sea un número antes de pasarlo a la consulta
            const user = await prisma.user.findUnique({
                where: { id: Number(id) },
            });

            if (user) {
                return res.status(200).json(user);
            } else {
                return res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            console.error("Error al obtener el usuario:", error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    }



    else if (req.method === 'PUT') {
        // Extract the user ID from the request query parameters
        const { id } = req.query;

        // Ensure that an ID has been provided
        if (!id) {
            return res.status(400).json({ message: "Missing user ID." });
        }

        try {
            // Proceed with extracting other fields from the request body
            const {
                rut,
                nombres,
                apellidoPaterno,
                apellidoMaterno,
                email,
                cargo,
                asientoAsignado,
                isExecutive,
                role,
                password, // Consider whether you need to update the password on every update.
            } = req.body;

            // Update the user in the database
            const user = await prisma.user.update({
                where: { id: Number(id) }, // Convert to number if necessary and use it here
                data: {
                    rut,
                    nombres,
                    apellidoPaterno,
                    apellidoMaterno,
                    cargo,
                    asientoAsignado,
                    isExecutive: isExecutive === 'true',
                    email,
                    // Consider how you handle password updates here
                    role,
                },
            });

            // Respond with the updated user (excluding the password)
            return res.status(200).json(user);
        } catch (error) {
            console.error('Error updating user:', error);
            // Appropriately handle errors
            return res.status(500).json({ message: 'Error updating user' });
        }
    }

    else if (req.method === 'DELETE') {
        try {
            // Eliminar los cambios de contraseña asociados al usuario
            const { id } = req.query;

            await prisma.passwordReset.deleteMany({
                where: {
                    userId: Number(id),
                },
            });

            // Eliminar las reservas asociadas al usuario
            await prisma.reserva.deleteMany({
                where: {
                    userId: Number(id),
                },
            });

            // Eliminar el usuario
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