import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
        return res.status(400).json({ message: 'Token de restablecimiento y nueva contraseña son requeridos.' });
    }

    try {
        const passwordResetRecord = await prisma.passwordReset.findFirst({
            where: {
                resetToken: resetToken,
                expiry: {
                    gt: new Date(),
                },
            },
            include: {
                user: true,
            },
        });

        if (!passwordResetRecord) {
            return res.status(400).json({ message: 'Token de restablecimiento no encontrado o ya expirado.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: passwordResetRecord.userId },
            data: { password: hashedPassword },
        });

        await prisma.passwordReset.delete({
            where: { id: passwordResetRecord.id },
        });

        return res.status(200).json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}
