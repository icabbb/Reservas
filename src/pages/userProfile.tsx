

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NavbarCom from "@/components/ui/navbar";
import Link from "next/link";


interface UserInfo {
    rut?: string;
    nombres?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    cargo?: string;
    email?: string;
    asientoAsignado?: string;
}


export default function Component() {
    const { data: session } = useSession();
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();




    useEffect(() => {
        if (router.isReady) {
            const id = session?.user?.id;
            if (id && !Array.isArray(id)) {
                fetchUserInfo(id);
            }
        }
    }, [router.isReady, router.query]);


    async function fetchUserInfo(id: string) {

        setLoading(true);
        try {
            const response = await fetch(`/api/user/${id}`);
            if (!response.ok) throw new Error('No se pudo obtener la información del usuario');
            const data = await response.json();
            setUserInfo(data);
        } catch (error) {
            console.error("Error al obtener la información del usuario:", error);
        } finally {
            setLoading(false);
        }
    }

    const onSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        router.push("/changePass");
    }


    return (
        <div className="bg-white min-h-screen">
            <NavbarCom />
            <main className="max-w-4xl mx-auto my-10 p-8 border-t-8 border-red-500">
                <h2 className="text-3xl font-semibold mb-6 text-center">Información Personal</h2>
                <div className="grid grid-cols-2 gap-4">
                    {/* Comprobar si userInfo no es nulo antes de intentar acceder a sus propiedades */}
                    {userInfo ? (
                        <>
                            <div className="flex flex-col">
                                <label className="mb-2">RUT</label>
                                <Input placeholder="RUT" className="bg-gray-200 cursor-not-allowed font-bold" value={userInfo.rut || ''} readOnly />
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-2">Nombres</label>
                                <Input placeholder="Nombres" className="bg-gray-200 cursor-not-allowed font-bold" value={userInfo.nombres || ''} readOnly />
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-2">Apellido Paterno</label>
                                <Input placeholder="Apellido Paterno" className="bg-gray-200 cursor-not-allowed font-bold" value={userInfo.apellidoPaterno || ''} readOnly />
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-2">Apellido Materno</label>
                                <Input placeholder="Apellido Materno" className="bg-gray-200 cursor-not-allowed font-bold" value={userInfo.apellidoMaterno || ''} readOnly />
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-2">Cargo</label>
                                <Input placeholder="Cargo" className="bg-gray-200 cursor-not-allowed font-bold" value={userInfo.cargo || ''} readOnly />
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-2">E-Mail</label>
                                <Input placeholder="E-Mail" className="bg-gray-200 cursor-not-allowed font-bold" value={userInfo.email || ''} readOnly />
                            </div>

                            <div className="flex flex-col col-span-2">
                                <label className="mb-2">Asiento Asignado</label>
                                <Input placeholder="Asiento Asignado" className="bg-gray-200 cursor-not-allowed font-bold" value={userInfo.asientoAsignado || ''} readOnly />
                            </div>
                        </>
                    ) : (
                        <div className="col-span-2">
                            <p>No se ha encontrado la información del usuario.</p>
                        </div>
                    )}
                </div>



                <div className="flex justify-end col-span-2 p-2">

                    <Link href="/changePass" className="text-white hover:underline bg-blue-800 border rounded-lg p-4">
                        Cambiar Contraseña
                    </Link>
                </div>


            </main >

            <footer className="bg-gray-100 p-4 text-center">
                <p>© 2024 - Mineral Airways - Reservas de vuelo Collahuasi</p>
            </footer>
        </div >
    );
}
