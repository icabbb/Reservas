import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials';

import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'; // Asegúrate de usar bcryptjs que es la versión en JavaScript puro
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = ({

  providers: [
    CredentialsProvider({
      name: 'Credenciales',
      credentials: {
        rut: { label: "RUT", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials, req): Promise<any> {
        if (!credentials || !credentials.rut || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { rut: credentials.rut },
        });

        if (!user) {
          return null;
        }

        const isFirstLogin = user.isFirstLogin && credentials.password === credentials.rut.replace(/-\d$/, '');
        const isPasswordValid = !isFirstLogin && await bcrypt.compare(credentials.password, user.password);


        if (isFirstLogin || isPasswordValid) {

          return {
            id: user.id,
            name: user.nombres,
            lastName: user.apellidoPaterno + ' ' + user.apellidoMaterno,
            email: user.email,
            rut: user.rut,
            role: user.role,
            cargo: user.cargo,
            isExecutive: user.isExecutive,
            isFirstLogin,
            asiento: user.asientoAsignado,



          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,


  callbacks: {
    async jwt({ token, user }) {

      if (user) {
        token.userId = user.id;
        token.rut = user.rut;
        token.role = user.role;
        token.isFirstLogin = user.isFirstLogin;
        token.name = user.name;
        token.email = user.email;
        token.lastName = user.lastName;
        token.cargo = user.cargo;
        token.isExecutive = user.isExecutive;
        token.asiento = user.asientoAsignado;






      }
      return token;
    },
    async session({ session, token }) {

      session.user.id = token.userId as string;
      session.user.rut = token.rut as string;
      session.user.role = token.role as string;
      session.user.isFirstLogin = token.isFirstLogin as boolean;
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      session.user.lastName = token.lastName as string;
      session.user.cargo = token.cargo as string;
      session.user.isExecutive = token.isExecutive as boolean;
      session.user.asiento = token.asiento as string;

      return session;
    },
  },
  pages: {
    signIn: '/login',

  },

});

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, authOptions)





