import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const rutas = await prisma.route.findMany();
            return res.status(200).json(rutas);
        } catch (error) {
            console.error("Error al obtener las rutas:", error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    } else if (req.method === "POST") {
        // Extrae los datos de la solicitud
        const { city, region, flightCode, description } = req.body;

        try {
            // Utiliza prisma para crear la nueva ruta en la base de datos
            const newRoute = await prisma.route.create({
                data: {
                    city,
                    region,
                    flightCode,
                    description,
                },
            });

            return res.status(201).json(newRoute);
        } catch (error) {
            console.error("Error al crear la ruta:", error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    } else {
        // Método HTTP no soportado
        return res.status(405).json({ message: "Método no permitido" });
    }
}
