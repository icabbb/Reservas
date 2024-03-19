// use client
import { useEffect, useState, FormEvent } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';
import type { NextPage } from 'next';
import Image from 'next/image';

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
    const { data: session, status } = useSession({
        required: false, // No requerir sesión activa para acceder a esta página
    });


    const handleRutChange = (event: { target: { value: string; }; }) => {
        let value = event.target.value.replace(/\D/g, ''); // Remueve cualquier cosa que no sea un número
        if (value.length > 8) {
            value = value.slice(0, value.length - 1) + '-' + value.slice(value.length - 1);
        }
        setRut(value);
    };

    useEffect(() => {
        // Revisa si el usuario está autenticado y si debe cambiar su contraseña
        if (status === 'authenticated' && session.user.isFirstLogin) {
            router.push('/changePass'); // Asume que tienes una ruta /change-password para este propósito
        } else if (status === 'authenticated') {
            // Redirecciona basado en el rol del usuario
            if (session.user.role === 'ADMIN') {
                router.push('/');
            } else {
                router.push('/');
            }
        }
    }, [session, status, router]);
    const validateRut = (rut: string) => /^\d{7,8}-\d{1}$/.test(rut);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateRut(rut)) {
            toast({
                title: 'Error',
                description: 'El RUT ingresado no es válido.',
                variant: 'destructive',
            });
            return;
        }

        const result = await signIn('credentials', {
            redirect: false,
            rut,
            password,
        });

        if (result?.error) {
            toast({
                title: 'Error',
                description: result.error,
                variant: 'destructive',
            });
        } else {
            // Si el inicio de sesión es exitoso y no hay errores, el efecto de uso manejará la redirección.


        }
    };

    if (status === 'loading') {
        return <p>Cargando...</p>;
    }

    return (
        <>
            <div className="relative min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <Toaster />
                <div className="absolute top-0 left-0 w-full h-full bg-cover" style={{ backgroundImage: 'url(/avion.jpg)' }}></div>
                <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-md shadow-lg z-10">
                    <div className="text-center">

                        <Image src={'/logo.webp'} alt={''} width={500} height={500} />

                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Bienvenidos</h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Ingrese su RUT y contraseña para iniciar sesión.
                        </p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <input type="hidden" name="remember" defaultValue="true" />
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="rut" className="sr-only">RUT</label>
                                <input
                                    id="rut"
                                    name="rut"
                                    type="text"
                                    autoComplete="rut"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                    placeholder="11111111-1"
                                    value={rut}
                                    onChange={handleRutChange}
                                    maxLength={10}
                                />
                                <span className="text-gray-500 text-xs">El formato del rut es 12345678-9, el guion se asigna automatico.</span>
                            </div>
                            <div className='pt-2'>
                                <label htmlFor="password" className="sr-only">Contraseña</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                    placeholder="Contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-700 hover:bg-orange-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Iniciar sesión
                            </button>
                        </div>
                        <div className="text-center">
                            <a href="/forgotPassword" className="text-orange-600 hover:text-orange-700">¿Olvidó su contraseña?</a>
                        </div>
                    </form>
                    <footer className="text-center text-gray-500 text-xs border rounded-lg p-4 font-bold ">
                        &copy;2024 - Mineral Airways - Reserva de vuelos Collahuasi
                    </footer>
                </div>
            </div>

        </>


    );
};

export default LoginPage;
