import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { use } from 'react';
// Add the missing import statement

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { rut, email } = req.body;
    const resetToken = uuidv4(); // Genera un token seguro

    // Aquí debes verificar que el email y rut corresponden a un usuario existente
    const user = await prisma.user.findUnique({
      where: { email: email, rut: rut },

    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    await prisma.passwordReset.create({
      data: {
        resetToken: resetToken,
        userId: user.id,
        expiry: new Date(Date.now() + 1000 * 60 * 60), // Expira en 1 hora
      },
    })




    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: 'gmail',
      port: 465,
      secure: true,

      auth: {
        user: 'spprttestcollahuasi@gmail.com',
        pass: 'abbvznuspxhssjdq',
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-pass?token=${resetToken}`; // Construye la URL de restablecimiento de contraseña

    // Envía el correo electrónico al usuario
    await transporter.sendMail({
      from: '"Support" <support@example.com>',
      to: email,
      subject: 'Restablecimiento de contraseña',
      html: `Por favor, use el siguiente enlace para restablecer su contraseña: <a href="${resetUrl}">${resetUrl}</a>`,
    });

    return res.status(200).json({ message: 'Se ha enviado un enlace de restablecimiento de contraseña.' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

