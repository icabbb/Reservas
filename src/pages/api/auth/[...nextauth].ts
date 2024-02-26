import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        rut: { label: "RUT", type: "text", placeholder: "12345678-9" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req): Promise<any> {
        if (!credentials) return null;
        const { rut, password } = credentials;

        try {
          const user = await prisma.user.findUnique({
            where: { rut },
          });

          if (user) {
            const rutWithoutDV = rut.replace(/-\d$/, ''); // 
            const isInitialLogin = password === rutWithoutDV;
            const isCorrectPassword = isInitialLogin || await bcrypt.compare(password, user.password);

            if (isCorrectPassword) {
              
              return { id: user.id, rut: user.rut, role: user.role };
            }
          }
        } catch (error) {
          console.error('Error during authorization:', error);
        }
        return null;
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.role) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.role) { 
        session.user.role = token.role as string; 
      }
      return session;
    },
  },
});