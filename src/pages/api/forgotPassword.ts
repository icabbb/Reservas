// pages/api/forgot-password.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { rut, email } = req.body;
    // Generate a random password or token here
    const tempPassword = Math.random().toString(36).slice(-8);

    // Create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "6881ee4ce8fa67",
    pass: "9016ed182eda3c"
  }
});

        const emailBody = `
        Sistema Mineral Airways
        
        Estimado Usuario,
        
        Informamos que usted ha solicitado la recuperación de su contraseña a través del sistema.
        
        Su contraseña temporal es: ${tempPassword}
        
        Se recomienda ingresar al sistema y cambiar su contraseña por motivos de seguridad.
        
        En caso de tener observaciones, por favor comuníquese con el Administrador del sitio SMA.
        
        © 2024 - Mineral Airways - Reservas de vuelo Collahuasi
        `;

    // Send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Support" <ecm6193@gmail.com>', // Sender address
      to: email, // Receiver, pulled from request body
      subject: 'Password Reset', // Subject line
      text: `${emailBody}`, // Plain text body
      html: `<b>${emailBody}</b>` // HTML body content
    });

    console.log('Message sent: %', info.messageId);

    // You'd also need to hash the tempPassword and store it in your database
    // associated with the user's account

    // Return a response to the client
    res.status(200).json({ message: 'Email sent' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
