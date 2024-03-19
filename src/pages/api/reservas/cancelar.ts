import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';


const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        return res.status(401).json({ message: 'No autorizado' });
    }

    const { reservaId } = req.body;
    try {
        const reserva = await prisma.reserva.findUnique({
            where: { id: reservaId, },
            include: {
                usuario: true,
                vuelo: true,

            },
        });

        if (!reserva) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }

        // Verifica que el usuario actual es el dueño de la reserva o un administrador
        if (reserva.usuario.email !== session.user.email && session.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'No autorizado para cancelar esta reserva' });
        }

        // Marca la reserva como cancelada
        await prisma.reserva.update({
            where: { id: reservaId },
            data: { estado: 'Cancelado', fechaCancelacion: new Date() },
        });

        // Configuración de nodemailer
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            service: 'gmail',
            port: 465,
            secure: true,

            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        const emailTemplate = `
  <div style="font-family: 'Arial', sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
    <header style="text-align: center; margin-bottom: 20px;"> 
      <h1>Sistema Mineral Airways</h1>
    </header>
    <section>
        <h2>Estimado: ESTO ES UNA PRUEBA</h2>
        <p>Le informamos que la reserva para el vuelo ${reserva.vuelo.origen} - ${reserva.vuelo.destino} ha sido cancelada.</p>
        <p>Detalles de la reserva:</p>
        <ul>
          <li>Origen: ${reserva.vuelo.origen}</li>
          <li>Destino: ${reserva.vuelo.destino}</li>
          <li>Fecha: ${new Date(reserva.vuelo.fechaHoraSalida).toLocaleDateString()}</li>
          <li>Estado: Cancelado</li>
        </ul>
    </section>
    <footer style="text-align: center; margin-top: 20px;">
        <p>Gracias por volar con Mineral Airways</p>
    </footer>  
  </div>
`;

        const mailOptions = {
            html: emailTemplate,
            attachments: [{
                filename: 'logom.png',
                path: '/public', // Make sure this path is correct
                cid: 'unique@nodemailer.com' // should be as unique as possible
            }]
        };

        // Envío de correo electrónico
        await transporter.sendMail({
            from: '"Soporte TEST" <spprttestcollahuasi@gmail.com>',
            to: ' Galvarezm2004@gmail.com',
            subject: "Confirmación de cancelación de vuelo ESTO ES UNA PRUEBA",
            html: mailOptions.html,


        });

        res.status(200).json({ message: 'Reserva cancelada y correo enviado' });
    } catch (error) {
        console.error('Error al cancelar la reserva:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}
