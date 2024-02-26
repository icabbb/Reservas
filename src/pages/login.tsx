/* eslint-disable @next/next/no-img-element */
import { signIn, useSession } from 'next-auth/react';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';

const PlaneIcon = () => (
  <svg
    fill="none"
    height="24"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
  </svg>
);

const LoginPage: NextPage = () => {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      if (session.user.role === 'ADMIN') {
        router.push('/dashboard');
      } else if (session.user.role === 'USER') {
        router.push('/');
      }
    }
  }, [session, router]);

  const validateRut = (rut: string) => /^\d{7,8}-\d{1}$/.test(rut);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateRut(rut)) {
      toast({
        title: 'Error',
        description: 'El RUT ingresado no es válido.',
        variant: 'destructive'
      });
      return;
    }

    const result = await signIn('credentials', {
      redirect: false,
      rut,
      password: rut.replace(/-\d$/, '')
    });

    if (result?.error) {
      toast({
        title: 'Error',
        description: 'Usuario o contraseña incorrectos.',
        variant: 'destructive'
      });
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="grid min-h-[600px] items-center gap-6 py-12 lg:grid-cols-2 lg:gap-0 xl:min-h-[800px]">
      <div className="fixed inset-0 z-0 overflow-hidden">
        <img
          alt="Image"
          src="/avion.jpg"
          className="min-w-full min-h-full object-cover"
        />
      </div>
      <Toaster />
      <div className="flex items-center justify-center w-[550px] lg:px-12 xl:px-24 z-10 border border-lg p-10 m-20 backdrop-blur-lg bg-white/30 rounded-lg">
        <div className="w-full max-w-md space-y-4">
          <div className="flex flex-col items-center space-y-2">
            <PlaneIcon />
            <h1 className="text-3xl font-bold">Bienvenidos</h1>
            <p className="text-gray-700 dark:text-gray-700">
              Ingrese su RUT y contraseña para iniciar sesión.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="rut">RUT</label>
              <input
                className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                id="rut"
                placeholder="11111111-1"
                type="text"
                value={rut}
                onChange={(e) => setRut(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                placeholder="11111111"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <button type="submit" className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-900">
                Iniciar sesión
              </button>
              <a href="/forgotPassword" className="text-blue-600 hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
