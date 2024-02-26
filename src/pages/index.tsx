// pages/index.tsx
import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import NavbarCom from '@/components/ui/navbar';
import { Calendar } from "@/components/ui/calendar"



const HomePage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      
    }
  }, [session, status, router]);

  // Muestra un mensaje de carga mientras se verifica la sesión
  if (status === 'loading') {
    return <div>Cargando...</div>;
  }

  return (
    <><div>
      <NavbarCom></NavbarCom>
    </div><div>
        <h1>Bienvenido a la página principal</h1>
        {/* Contenido de tu página principal aquí */}
        <Calendar
           mode='single'
           selected={date}
           onSelect={setDate}
           className='rounded-md border shadow max-w-[300px] mx-auto p-4 bg-white'
        ></Calendar>
      </div></>
  );
};


export default HomePage;

