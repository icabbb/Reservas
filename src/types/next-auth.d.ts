// types/next-auth.d.ts
import 'next-auth';



declare module "next-auth" {
  /**
   * Extiende los tipos para la sesión
   */
  interface Session {
    user: {
      lastName: string;
      email: string;
      id?: string;
      rut: string;
      role: string;
      name?: string;
      isFirstLogin?: boolean;
      cargo?: string;
      isExecutive?: boolean;
      asiento?: string;
    }
  }

  /**
   * Extiende los tipos para el JWT
   */
  interface JWT {
    userId?: string;
    rut: string;
    role: string;
    isFirstLogin?: boolean;
    name?: string;
    email?: string;
    lastName?: string;
    cargo?: string;
    isExecutive?: boolean;
    asiento?: string;

  }

  /**
   * Extiende los tipos para el usuario
   */
  interface User {
    id: string;
    rut: string;
    role: string;
    name: string;
    isFirstLogin: boolean;
    email: string;
    lastName: string;
    cargo: string;
    isExecutive: boolean;
    asientoAsignado: string;


  }
}