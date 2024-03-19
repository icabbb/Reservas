// pages/admin/reservations.js
import { useEffect, useState } from 'react';
import { useSession, getSession, GetSessionParams } from 'next-auth/react';
import NavbarCom from '@/components/ui/navbar';
import { Table, TableBody, TableCell, TableFooter, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export default function AdminReservations() {
    const [reservations, setReservations] = useState([]);
    const { data: session } = useSession();
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);


    useEffect(() => {
        setTotalPages(Math.ceil(reservations.length / rowsPerPage));
    }, [reservations, rowsPerPage]);

    const goToNextPage = () => setCurrentPage((page) => Math.min(page + 1, totalPages));
    const goToPreviousPage = () => setCurrentPage((page) => Math.max(page - 1, 1));

    // Slicing the routes data for the current page
    const currentTableData = reservations.slice(
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
        const fetchReservations = async () => {
            const response = await fetch('/api/reservas/mis-reservas');
            if (response.ok) {
                const data = await response.json();
                setReservations(data);
            }
        };

        if (session && session.user.role === 'ADMIN') {
            fetchReservations();
        }
    }, [session]);

    if (!session || session.user.role !== 'ADMIN') {
        return <p>Cargando...</p>;
    }

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
                                <TableCell>RUT</TableCell>
                                <TableCell>Nombres</TableCell>
                                <TableCell>Origen</TableCell>
                                <TableCell>Destino</TableCell>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Estacionamiento</TableCell>
                                <TableCell>Estado</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentTableData.map((reserva: any) => (
                                <TableRow key={reserva.id}>
                                    <TableCell>{reserva.usuario.rut}</TableCell>
                                    <TableCell>{reserva.usuario.nombres} {reserva.usuario.apellidoPaterno} {reserva.usuario.apellidoMaterno}</TableCell>

                                    <TableCell>{reserva.vuelo.origen}</TableCell>
                                    <TableCell>{reserva.vuelo.destino}</TableCell>
                                    <TableCell>{new Date(reserva.vuelo.fechaHoraSalida).toLocaleDateString()}</TableCell>
                                    <TableCell>{reserva.estacionamiento ? 'Sí' : 'No'}</TableCell>
                                    <TableCell>
                                        {reserva.estado === 'Cancelado' ? `Cancelada el ${format(new Date(reserva.fechaCancelacion), 'dd/MM/yyyy HH:mm')}` : `Reservado el ${format(new Date(reserva.fechaReserva), 'dd/MM/yyyy HH:mm')} `}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={7} align='center' className='text-red-500' >
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

// Esta función asegura que solo los administradores accedan a esta página
export async function getServerSideProps(context: GetSessionParams | undefined) {
    const session = await getSession(context);

    if (!session || session.user.role !== 'ADMIN') {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    return {
        props: { session },
    };
}
