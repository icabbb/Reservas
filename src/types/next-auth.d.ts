// types/next-auth.d.ts
import 'next-auth';

declare module 'next-auth' {
  
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    }
  }
  interface User {
    role: string;
  }
  interface JWT {
    role: string;
  }
}
