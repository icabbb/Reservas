import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getSession, useSession } from 'next-auth/react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'path';
import { Button } from '@/components/ui/button';
import { getServerSession } from 'next-auth';
import { IncomingMessage } from 'http';
import { NextApiRequest } from 'next';
import { authOptions } from '../api/auth/[...nextauth]';
import { Switch } from '@/components/ui/switch';


export default function VueloReservation() {
    const router = useRouter();
    const { vueloId } = router.query;
    const [vuelo, setVuelo] = useState(null);
    const { data: session } = useSession();
    const [requiereEstacionamiento, setRequiereEstacionamiento] = useState(false);
    const [parkingAvailable, setParkingAvailable] = useState(true);

    useEffect(() => {
        if (vueloId) {
            fetch(`/api/vuelos/${vueloId}`)
                .then(res => res.json())
                .then(setVuelo)
                .catch(error => console.error('Error fetching flight details:', error));
            checkParkingAvailability();
        }
    }, [vueloId]);

    const checkParkingAvailability = async () => {
        try {
            const response = await fetch(`/api/reservas/reserva`);
            if (response.ok) {
                const data = await response.json();
                setParkingAvailable(data.disponibles > 0);
            } else {
                console.error('Error fetching parking availability:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching parking availability:', error);
        }
    };





    const handleReserve = async () => {
        if (vueloId && session?.user?.id && (!requiereEstacionamiento || (requiereEstacionamiento && parkingAvailable))) {
            const body = JSON.stringify({ vueloId, userId: session.user.id, requiereEstacionamiento });
            try {
                const response = await fetch(`/api/reservas/reserva`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: body,
                });
                if (response.ok) {
                    alert('Reservation confirmed.');
                    router.push('/mis-reservas');
                } else {
                    alert('Error making reservation. Please try again.');
                }
            } catch (error) {
                console.error('Failed to reserve:', error);
                alert('Error making reservation. Please try again.');
            }
        } else {
            alert('Please ensure all required details are filled in correctly.');
        }
    };

    const handleChangeEstacionamiento = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRequiereEstacionamiento(event.target.checked);
    };



    if (!vuelo) return <div>Loading...</div>;


    return (
        <>

            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="absolute top-0 right-0 p-4">
                    <Button onClick={() => router.back()}>Volver</Button>
                </div>
                <Card className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold text-center mb-4">Confirmar Reserva</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p>
                                <span className="font-medium">Origen:</span>{(vuelo as any)?.origen}
                            </p>
                            <p>
                                <span className="font-medium">Destino:</span>{(vuelo as any)?.destino}
                            </p>
                            <p>
                                <span className="font-medium">Fecha y hora de salida:</span>
                                {(vuelo as any)?.fechaHoraSalida}
                            </p>
                            <p>
                                <span className="font-medium">Número de vuelo:</span> {(vuelo as any)?.numeroVuelo}
                            </p>
                            <p>
                                <span className="font-medium">Matrícula del avión:</span> {(vuelo as any)?.matriculaAvion}
                            </p>

                        </div>
                        <div className="mt-4">
                            {parkingAvailable ? (
                                <label htmlFor="requiereEstacionamiento" className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        id="requiereEstacionamiento"
                                        checked={requiereEstacionamiento}
                                        onChange={handleChangeEstacionamiento}
                                    />
                                    <span className="ml-2">Requiero estacionamiento</span>
                                </label>
                            ) : (
                                <div>No hay estacionamientos disponibles.</div>
                            )}
                        </div>

                    </CardContent>
                    <CardFooter className="flex justify-center mt-4">
                        <Button className="w-full" onClick={handleReserve} variant={'destructive'}>Reservar</Button>
                    </CardFooter>
                </Card>
            </div>

        </>


    );
}




export async function getServerSideProps(context: { req: any; res: any; }) {
    const { req, res } = context;
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    return { props: {} };
}





