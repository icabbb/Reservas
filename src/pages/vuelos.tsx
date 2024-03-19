import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { ChangeEvent, JSX, SVGProps, SetStateAction, useEffect, useState } from "react"
import NavbarCom from "@/components/ui/navbar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { IconPlus } from '@tabler/icons-react';
import { toast } from "@/components/ui/use-toast"
import { type } from "os"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator"
import { useSession } from "next-auth/react"


export default function Component() {
    const { data: session, status } = useSession();
    const [vuelos, setVuelos] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        fechaHoraSalida: '',
        numeroVuelo: '',
        matriculaAvion: '',
        origen: '',
        destino: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1); // Add this line to track the current page










    const handleSelectRowsPerPage = (valueAsString: string) => {
        setRowsPerPage(Number(valueAsString));
    };


    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Abre el diálogo de búsqueda si hay un término de búsqueda
        if (searchTerm.trim()) {
            setIsSearchDialogOpen(true);
        }
    };




    useEffect(() => {
        async function fetchVuelos() {
            const res = await fetch('/api/vuelos/vuelosAvion')
            const data = await res.json()
            setVuelos(data)
        }
        fetchVuelos()
    }, [])

    useEffect(() => {
        setTotalPages(Math.ceil(vuelos.length / rowsPerPage));
    }, [vuelos, rowsPerPage]);

    const goToNextPage = () => setCurrentPage((page) => Math.min(page + 1, totalPages));
    const goToPreviousPage = () => setCurrentPage((page) => Math.max(page - 1, 1));

    // Slicing the routes data for the current page
    const currentTableData = Array.isArray(vuelos) ? vuelos.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    ) : [];

    async function handleDelete(id: string) {

        const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar este vuelo?');
        if (!confirmDelete) {
            return;
        }

        console.log('Delete', id)
        const res = await fetch(`/api/vuelos/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (!res.ok) {
            console.error('Error al eliminar la ruta:', res)

        }

        const updatedVuelos = vuelos.filter((route: { id: string }) => route.id !== id);
        setVuelos(updatedVuelos);

    }

    const handleEdit = (route: { id: SetStateAction<null>; fechaHoraSalida: string; numeroVuelo: string; matriculaAvion: string; origen: string; destino: string }) => {
        setEditingId(route.id);
        setEditFormData(route);
    };

    const handleEditFormChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const fieldName = event.target.getAttribute('name') as string;
        setEditFormData({
            ...editFormData,
            [fieldName]: event.target.value,
        });
    };



    const handleSaveClick = async (id: any) => {
        const res = await fetch(`/api/vuelos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(editFormData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!res.ok) {
            console.error('Error al actualizar la ruta:', res)
            return
        }
        console.log('Saving', id, editFormData);
        setEditingId(null);
    };





    function handleInteractOutside(e: any) {
        e.preventDefault()
    }

    const handleClose = () => setIsOpen(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const fechaSalida = formData.get('fechaSalida') as string;
        const horaSalida = formData.get('horaSalida') as string;
        // Combinar fecha y hora para crear un objeto Date completo
        // Asegúrate de que la fecha y la hora tienen el formato correcto,
        // por ejemplo, fechaSalida: '2024-03-10', horaSalida: '01:30'
        const fechaHoraSalida = new Date(`${fechaSalida}T${horaSalida}:00.000Z`);

        // Verifica si la fechaHoraSalida es una fecha válida
        if (!isNaN(fechaHoraSalida.getTime())) {
            const data = {
                fechaHoraSalida: fechaHoraSalida.toISOString(), // Convertir a ISO-8601
                numeroVuelo: formData.get('numeroVuelo'),
                matriculaAvion: formData.get('matriculaAvion'),
                origen: formData.get('origen'),
                destino: formData.get('destino'),
            };

            const res = await fetch('/api/vuelos/vuelosAvion', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const result = await res.json();
            console.log(result);
            setIsOpen(false);
        } else {
            // Manejar fechas no válidas aquí
            console.error('Fecha u hora no válida.');
        }
    }

    const filteredVuelos = Array.isArray(vuelos) ? vuelos.filter((route: { fechaHoraSalida: string; numeroVuelo: string; matriculaAvion: string; origen: string; destino: string }) => {
        return (
            route.fechaHoraSalida.toLowerCase().includes(searchTerm.toLowerCase()) ||
            route.numeroVuelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            route.matriculaAvion.toLowerCase().includes(searchTerm.toLowerCase()) ||
            route.origen.toLowerCase().includes(searchTerm.toLowerCase()) ||
            route.destino.toLowerCase().includes(searchTerm.toLowerCase())
        );

    }
    ) : [];










    const handleCloseSearchDialog = () => setIsSearchDialogOpen(false);

    const renderSearchResults = () => {
        if (filteredVuelos.length === 0) {
            return <p className="text-center">No se encontraron resultados</p>;
        }
        return (
            <Table className="sm:max-w-[700px]">
                <TableHeader>
                    <TableRow>
                        <TableHead>Fecha y Hora de Salida</TableHead>
                        <TableHead>Número del Vuelo</TableHead>
                        <TableHead>Matricula del Avión</TableHead>
                        <TableHead>Origen</TableHead>
                        <TableHead>Destino</TableHead>
                        <TableHead>Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="sm:max-w-[700px]">
                    {filteredVuelos.map((route: { id: any; fechaHoraSalida: any; numeroVuelo: any; matriculaAvion: any; origen: any; destino: any; }) => (
                        <TableRow key={route.id}>
                            <TableCell>{route.fechaHoraSalida}</TableCell>
                            <TableCell>{route.numeroVuelo}</TableCell>
                            <TableCell>{route.matriculaAvion}</TableCell>
                            <TableCell>{route.origen}</TableCell>
                            <TableCell>{route.destino}</TableCell>
                            <TableCell>
                                <div className="flex justify-between gap-1">
                                    <TrashIcon className="text-red-500" onClick={() => handleDelete(route.id)} />
                                    {editingId === route.id ? (
                                        <CheckIcon className="text-green-500" onClick={() => handleSaveClick(route.id)} />
                                    ) : (
                                        <PencilIcon className="text-yellow-500" onClick={() => handleEdit(route)} />
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}

                </TableBody>
            </Table>
        );
    };

    // Asumiendo que quieres mostrar la fecha en horario local del cliente
    const formatDate = (dateString: string | number | Date) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };
        return new Date(dateString).toLocaleDateString('es-ES', options).replace(/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}:\d{2})/, '$3-$2-$1 $4');
    }





    return (
        <>
            <>
                <div>
                    <NavbarCom />
                </div>
                <div className="mx-auto max-w-4xl bg-white p-6">
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

                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-blue-500 text-white"><AddIcon />Crear Vuelo</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[700px]" onInteractOutside={handleInteractOutside} >
                                <DialogHeader>
                                    <DialogTitle>Crear Ruta</DialogTitle>
                                    <DialogDescription>Completa los detalles de la nueva ruta.</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit}>
                                    <div className="grid gap-4 py-4">

                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label className="text-right" htmlFor="fechaSalida">
                                                Fecha de Salida
                                            </Label>
                                            <Input
                                                className="col-span-3"
                                                id="fechaSalida"
                                                name="fechaSalida"
                                                placeholder="Fecha de salida"
                                                type="date"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label className="text-right" htmlFor="horaSalida">
                                                Hora de Salida
                                            </Label>
                                            <Input
                                                className="col-span-3"
                                                id="horaSalida"
                                                name="horaSalida"
                                                type="time"
                                                step="900"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label className="text-right" htmlFor="numeroVuelo">
                                                Numero de Vuelo
                                            </Label>
                                            <Input className="col-span-3" id="numeroVuelo" name="numeroVuelo" placeholder="Numero de vuelo" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label className="text-right" htmlFor="matriculaAvion">
                                                Matricula del Avión
                                            </Label>
                                            <Input className="col-span-3" id="matriculaAvion" name="matriculaAvion" placeholder="Matricula del Avion" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label className="text-right" htmlFor="origen">
                                                Origen
                                            </Label>
                                            <Input className="col-span-3" id="origen" name="origen" placeholder="Origen" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label className="text-right" htmlFor="destino">
                                                Destino
                                            </Label>
                                            <Input className="col-span-3" id="destino" name="destino" placeholder="Destino" />
                                        </div>
                                        <Button type="submit">Guardar Ruta</Button>
                                    </div>
                                </form>
                                <DialogFooter>
                                    <Button className="bg-red-500" onClick={handleClose}>Cerrar</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="mb-4 ">
                        <form onSubmit={handleSearchSubmit}>
                            <Input
                                className="border px-2"
                                placeholder="Buscar"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </form>
                    </div>
                    <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
                        <DialogContent className="sm:max-w-lg" onInteractOutside={handleInteractOutside}>
                            <DialogHeader>
                                <DialogTitle>Resultados de búsqueda</DialogTitle>
                                <DialogDescription>Mostrando resultados para "{searchTerm}"</DialogDescription>
                            </DialogHeader>
                            {renderSearchResults()}
                            <DialogFooter>
                                <Button className="bg-red-500" onClick={handleCloseSearchDialog}>Cerrar</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Table>
                        <TableHeader>
                            <TableRow >
                                <TableHead>Fecha y Hora de Salida</TableHead>
                                <TableHead>Número del Vuelo</TableHead>
                                <TableHead>Matricula del Avión</TableHead>
                                <TableHead>Origen</TableHead>
                                <TableHead>Destino</TableHead>
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentTableData.map((route: any) => (
                                <TableRow key={route.id}>
                                    {editingId === route.id ? (
                                        <>
                                            <TableCell>
                                                <Input
                                                    name="fechaHoraSalida"
                                                    value={formatDate(editFormData.fechaHoraSalida)}
                                                    onChange={handleEditFormChange}
                                                />

                                            </TableCell>


                                            <TableCell>
                                                <Input
                                                    name="NumeroVuelo"
                                                    value={editFormData.numeroVuelo}
                                                    onChange={handleEditFormChange}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    name="MatriculaAvion"
                                                    value={editFormData.matriculaAvion}
                                                    onChange={handleEditFormChange}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    name="origen"
                                                    value={editFormData.origen}
                                                    onChange={handleEditFormChange}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    name="destino"
                                                    value={editFormData.destino}
                                                    onChange={handleEditFormChange}
                                                />
                                            </TableCell>
                                        </>
                                    ) : (
                                        <>
                                            <TableCell>{format(new Date(route.fechaHoraSalida), 'yyyy-MM-dd HH:mm')}</TableCell>
                                            <TableCell>{route.numeroVuelo}</TableCell>
                                            <TableCell>{route.matriculaAvion}</TableCell>
                                            <TableCell>{route.origen}</TableCell>
                                            <TableCell>{route.destino}</TableCell>

                                        </>

                                    )}
                                    <TableCell>
                                        <div className="flex justify-between gap-1">
                                            <TrashIcon className="text-red-500" onClick={() => handleDelete(route.id)} />
                                            {editingId === route.id ? (
                                                <CheckIcon className="text-green-500" onClick={() => handleSaveClick(route.id)} />
                                            ) : (
                                                <PencilIcon className="text-yellow-500" onClick={() => handleEdit(route)} />
                                            )}

                                        </div>
                                    </TableCell>


                                </TableRow>
                            ))

                            }

                        </TableBody>
                    </Table>
                    <div className="flex justify-between items-center pt-4">

                        <Button onClick={goToPreviousPage} disabled={currentPage === 1}>Anterior</Button>


                        <span className="text-red-500 font-medium">Página {currentPage} de {totalPages}</span>


                        <Button onClick={goToNextPage} disabled={currentPage === totalPages}>Siguiente</Button>
                    </div>

                    <footer className="mt-6 flex justify-center text-xs text-gray-600 pt-20">
                        © 2024 - Mineral Airways - Reservas de vuelo Collahuasi
                    </footer>
                </div >
            </>
        </>
    )
}



function PencilIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
        </svg>
    )
}


function TrashIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
    )
}
function CheckIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (<svg
        {...props}
        xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-checkbox" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M9 11l3 3l8 -8" />
        <path d="M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9" />
    </svg>)
}

function AddIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-playlist-add" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M19 8h-14" />
            <path d="M5 12h9" />
            <path d="M11 16h-6" />
            <path d="M15 16h6" />
            <path d="M18 13v6" />
        </svg>
    )
}


