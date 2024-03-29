// pages/mis-reservas.js
import { useSession, getSession, GetSessionParams } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Table, TableBody, TableCell, TableFooter, TableHeader, TableRow } from '@/components/ui/table';
import NavbarCom from '@/components/ui/navbar';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function MisReservas() {
    const { data: session } = useSession();
    const router = useRouter();
    const [reservas, setReservas] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);


    useEffect(() => {
        setTotalPages(Math.ceil(reservas.length / rowsPerPage));
    }, [reservas, rowsPerPage]);

    const goToNextPage = () => setCurrentPage((page) => Math.min(page + 1, totalPages));
    const goToPreviousPage = () => setCurrentPage((page) => Math.max(page - 1, 1));

    // Slicing the routes data for the current page
    const currentTableData = reservas.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage

    );

    const handleSelectRowsPerPage = (valueAsString: string) => {
        setRowsPerPage(Number(valueAsString));
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };




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
        <><NavbarCom />
            <main className="max-w-4xl mx-auto my-10 p-8 border-t-8 border-red-500">
                <div className='mx-auto max-w-4xl bg-white p-6'>
                    <div className="mb-4 flex justify-between">
                        <Select value={rowsPerPage.toString()} onValueChange={handleSelectRowsPerPage}>
                            <SelectTrigger id="show" className="w-[200px]">
                                <SelectValue>{rowsPerPage}</SelectValue>
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectItem value="5" onSelect={() => handleSelectRowsPerPage('5')}>5</SelectItem>
                                <SelectItem value="10" onSelect={() => handleSelectRowsPerPage('10')}>10</SelectItem>
                                <SelectItem value="15" onSelect={() => handleSelectRowsPerPage('15')}>15</SelectItem>

                            </SelectContent>
                        </Select>



                    </div>
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
                            {currentTableData.map((reserva: any) => (
                                <TableRow key={reserva.id}>
                                    <TableCell>{reserva.vuelo.origen}</TableCell>
                                    <TableCell>{reserva.vuelo.destino}</TableCell>
                                    <TableCell>{new Date(reserva.vuelo.fechaHoraSalida).toLocaleDateString()}</TableCell>
                                    <TableCell>{reserva.estacionamiento ? 'Si' : 'No'}</TableCell>

                                    <TableCell>
                                        {reserva.estado === 'Cancelado' ? `Cancelada el ${format(new Date(reserva.fechaCancelacion), 'dd/MM/yyyy HH:mm')}` : `Reservado el ${format(new Date(reserva.fechaReserva), 'dd/MM/yyyy HH:mm')} `}
                                    </TableCell>

                                    <TableCell>
                                        <Button onClick={() => cancelarReserva(reserva.id)} variant={'destructive'} disabled={reserva.estado === 'Cancelado'} >Cancelar</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={6} align='center' className='text-red-500' >
                                    Página {currentPage} de {totalPages}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                    <div className="flex justify-between items-center pt-4">
                        <Button onClick={goToPreviousPage} disabled={currentPage === 1}>Anterior</Button>
                        <Button onClick={goToNextPage} disabled={currentPage === totalPages}>Siguiente</Button>
                    </div>

                </div>
            </main>
        </>
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
