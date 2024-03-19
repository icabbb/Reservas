import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Método no permitido" });
    }

    const users: Array<{
        rut: string;
        nombres: string;
        apellidoPaterno: string;
        apellidoMaterno: string;
        cargo: string;
        email: string;
        asientoAsignado?: string;
        isExecutive: boolean;
        password?: string;
        role: string;
    }> = req.body;

    try {
        await prisma.$transaction(
            users.map(user =>
                prisma.user.upsert({
                    where: { rut: user.rut },
                    update: {},
                    create: {
                        rut: user.rut,
                        nombres: user.nombres,
                        apellidoPaterno: user.apellidoPaterno,
                        apellidoMaterno: user.apellidoMaterno,
                        cargo: user.cargo,
                        email: user.email,
                        asientoAsignado: user.asientoAsignado?.toString() || null,
                        isExecutive: Boolean(user.isExecutive),
                        role: user.role as UserRole,
                        password: user.password || "default-password",
                    }
                })
            )
        );
        return res.status(201).json({ message: "Usuarios creados exitosamente" });

    } catch (error) {
        console.error("Error al crear los usuarios:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }

}