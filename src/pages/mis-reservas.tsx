// pages/mis-reservas.js
import { useSession, getSession, GetSessionParams } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import NavbarCom from '@/components/ui/navbar';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default function MisReservas() {
    const { data: session } = useSession();
    const router = useRouter();
    const [reservas, setReservas] = useState([]);

    useEffect(() => {
        // Redirige al usuario si no está autenticado
        if (!session) {
            router.push('/login');
            return;
        }

        // Función para obtener las reservas del usuario
        const fetchReservas = async () => {
            const response = await fetch('/api/reservas/mis-reservas');
            if (response.ok) {
                const data = await response.json();
                setReservas(data);
            } else {
                // Manejo de errores, por ejemplo, mostrar un mensaje
                console.error('No se pudieron obtener las reservas');
            }
        };

        fetchReservas();
    }, [session, router]);

    async function cancelarReserva(reservaId: any) {
        try {
            const response = await fetch('/api/reservas/cancelar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reservaId }),
            });

            if (!response.ok) {
                throw new Error('La solicitud para cancelar la reserva falló');
            }

            alert('Reserva cancelada exitosamente. Revisa tu correo electrónico para más detalles.');
            // Aquí, actualiza el estado de la UI para reflejar que la reserva ha sido cancelada
        } catch (error) {
            console.error('Error al cancelar la reserva:', error);
            alert('Error al cancelar la reserva. Por favor, intenta de nuevo.');
        }
    }

    // Renderiza la tabla de reservas
    return (
        <><NavbarCom /><div className='mx-auto max-w-4xl bg-white p-6'>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableCell>Origen</TableCell>
                        <TableCell>Destino</TableCell>
                        <TableCell>Fecha</TableCell>
                        <TableCell>Estacionamiento</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Acciones</TableCell>

                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reservas.map((reserva: any) => (
                        <TableRow key={reserva.id}>
                            <TableCell>{reserva.vuelo.origen}</TableCell>
                            <TableCell>{reserva.vuelo.destino}</TableCell>
                            <TableCell>{new Date(reserva.vuelo.fechaHoraSalida).toLocaleDateString()}</TableCell>
                            <TableCell>{reserva.estacionamiento ? 'Sí' : 'No'}</TableCell>
                            <TableCell>
                                {reserva.estado === 'Cancelado' ? `Cancelada el ${format(new Date(reserva.fechaCancelacion), 'dd/MM/yyyy HH:mm')}` : `Reservado el ${format(new Date(reserva.fechaReserva), 'dd/MM/yyyy HH:mm')} `}
                            </TableCell>

                            <TableCell>
                                <Button onClick={() => cancelarReserva(reserva.id)} variant={'destructive'} disabled={reserva.estado === 'Cancelado'} >Cancelar</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div></>
    );
}

// Redirecciona al usuario si no está autenticado
export async function getServerSideProps(context: GetSessionParams | undefined) {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    return {
        props: { session },
    };
}
