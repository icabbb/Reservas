import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "GET") {
        try {
            const rutas = await prisma.vuelo.findMany();
            return res.status(200).json(rutas);
        } catch (error) {
            console.error("Error al obtener las rutas:", error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }

    }

    else if (req.method === "POST") {
        // Extrae los datos de la solicitud
        const { fechaHoraSalida, numeroVuelo, matriculaAvion, origen, destino } = req.body;



        try {
            const nuevoVuelo = await prisma.vuelo.create({
                data: {
                    fechaHoraSalida,
                    numeroVuelo,
                    matriculaAvion,
                    origen,
                    destino,
                },
            });

            return res.status(201).json(nuevoVuelo);
        } catch (error) {
            console.error("Error al crear la ruta:", error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    } else {
        // Método HTTP no soportado
        return res.status(405).json({ message: "Método no permitido" });
    }
}
