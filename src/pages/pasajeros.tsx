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

export default function pasajeros() {
    const { data: session, status } = useSession();
    const [isPasajeros, setIsPasajeros] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [editingId, setEditingId] = useState(null);
    const [editPassengerFormData, setEditPassengerFormData] = useState({
        rut: '',
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        email: '',
        cargo: '',
        password: '',
        asientoAsignado: '',
        isExecutive: false,
        role: 'USER',
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1); // Add this line to track the current page
    const [role, setRole] = useState('');
    const [isExecutive, setIsExecutive] = useState('');



    // En lugar de recibir un evento, estas funciones ahora reciben directamente el valor seleccionado como un string
    const handleRoleChange = (value: string) => {
        setRole(value);
    };

    const handleIsExecutiveChange = (value: string) => {
        setIsExecutive(value);
    };








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
        async function fetchPasajeros() {
            const res = await fetch('/api/user/create')
            const data = await res.json()
            setIsPasajeros(data)
        }
        fetchPasajeros()
    }, [])

    useEffect(() => {
        setTotalPages(Math.ceil(isPasajeros.length / rowsPerPage));
    }, [isPasajeros, rowsPerPage]);

    const goToNextPage = () => setCurrentPage((page) => Math.min(page + 1, totalPages));
    const goToPreviousPage = () => setCurrentPage((page) => Math.max(page - 1, 1));

    // Slicing the routes data for the current page
    const currentTableData = isPasajeros.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    async function handleDelete(id: string) {

        const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar este Pasajero?');
        if (!confirmDelete) {
            return;
        }

        console.log('Delete', id)
        const res = await fetch(`/api/user/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (!res.ok) {
            console.error('Error al eliminar la ruta:', res)

        }

        const updatedPasajero = isPasajeros.filter((route: { id: string }) => route.id !== id);
        setIsPasajeros(updatedPasajero);

    }

    const handleEdit = (route: { id: any; rut: any; nombre: any; apellidoPaterno: any; apellidoMaterno: any; email: any; cargo: any; asientoAsignado: any; isExecutive: any; role: any; password: any; }) => {
        setEditingId(route.id);
        setEditPassengerFormData(route);
    };



    const handleEditFormChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEditPassengerFormData({
            ...editPassengerFormData,
            [event.target.name]: event.target.value,
        });
    };






    const handleSaveClick = async (id: any) => {
        const res = await fetch(`/api/user/${id}`, {
            method: 'PUT',
            body: JSON.stringify(editPassengerFormData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!res.ok) {
            console.error('Error al actualizar la ruta:', res)
            return
        }
        console.log('Saving', id, editPassengerFormData);
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

        // Extraer la información del pasajero del formulario
        const rut = formData.get('rut') as string;
        const nombres = formData.get('nombre') as string;
        const apellidoPaterno = formData.get('apellidoPaterno') as string;
        const apellidoMaterno = formData.get('apellidoMaterno') as string;
        const email = formData.get('email') as string;
        const cargo = formData.get('cargo') as string;
        const asientoAsignado = formData.get('asientoAsignado') as string;
        const password = formData.get('password') as string;
        const isExecutive = formData.get('isExecutive') as string;
        const role = formData.get('role') as string;

        const data = {
            rut,
            nombres,
            apellidoPaterno,
            apellidoMaterno,
            email,
            cargo,
            password,
            asientoAsignado,
            isExecutive,
            role,
        };




        const res = await fetch('/api/user/create', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await res.json();
        console.log(result);
        setIsOpen(false);
    }

    const filteredPasajero = isPasajeros.filter((route: { rut: string; nombre: string; apellidoPaterno: string; apellidoMaterno: string; email: string; cargo: string; asientoAsignado: string; isExecutive: boolean; role: string; }) => {
        return `${route.rut} ${route.nombre} ${route.apellidoPaterno} ${route.apellidoMaterno} ${route.email} ${route.cargo} ${route.asientoAsignado} ${route.isExecutive} ${route.role}`.toLowerCase().includes(searchTerm.toLowerCase());
    }
    );











    const handleCloseSearchDialog = () => setIsSearchDialogOpen(false);

    const renderSearchResults = () => {
        if (filteredPasajero.length === 0) {
            return <p className="text-center">No se encontraron resultados</p>;
        }
        return (
            <Table className="sm:max-w-[700px]">
                <TableHeader>
                    <TableRow>
                        <TableHead>RUT</TableHead>
                        <TableHead>Nombres</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Asiento Asignado</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="sm:max-w-[700px]">
                    {filteredPasajero.map((route: { id: any; rut: React.ReactNode; password: React.ReactNode; nombre: React.ReactNode; apellidoPaterno: React.ReactNode; apellidoMaterno: React.ReactNode; email: React.ReactNode; cargo: React.ReactNode; asientoAsignado: React.ReactNode; isExecutive: React.ReactNode; role: React.ReactNode; }) => (
                        <TableRow key={route.id}>
                            <TableCell>{route.rut}</TableCell>
                            <TableCell>{route.nombre ?? ''}  {route.apellidoPaterno ?? ''}  {route.apellidoMaterno ?? ''}</TableCell>
                            <TableCell>{route.email}</TableCell>
                            <TableCell>{route.asientoAsignado}</TableCell>
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
                                <Button className="bg-blue-500 text-white">
                                    <AddIcon /> Crear Pasajero
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[800px]" onInteractOutside={handleInteractOutside}>
                                <DialogHeader>
                                    <DialogTitle>Crear Pasajero</DialogTitle>
                                    <DialogDescription>Ingresa la información del pasajero.</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="flex flex-wrap -mx-4">
                                        <div className="w-full px-4 sm:w-1/2">
                                            <Label className="block pb-2" htmlFor="rut">RUT</Label>
                                            <Input id="rut" name="rut" placeholder="RUT del pasajero" className="mt-1" />
                                        </div>
                                        <div className="w-full px-4 sm:w-1/2">
                                            <Label className="block pb-2" htmlFor="nombre">Nombre</Label>
                                            <Input id="nombre" name="nombre" placeholder="Nombre del pasajero" className="mt-1" />
                                        </div>


                                    </div>
                                    <div className="flex flex-wrap -mx-4">
                                        <div className="w-full px-4 sm:w-1/2">
                                            <Label className="block pb-2" htmlFor="apellidoPaterno">Apellido Paterno</Label>
                                            <Input id="apellidoPaterno" name="apellidoPaterno" placeholder="Apellido Paterno del pasajero" className="mt-1" />
                                        </div>
                                        <div className="w-full px-4 sm:w-1/2">
                                            <Label className="block pb-2" htmlFor="apellidoMaterno">Apellido Materno</Label>
                                            <Input id="apellidoMaterno" name="apellidoMaterno" placeholder="Apellido Materno del pasajero" className="mt-1" />
                                        </div>

                                    </div>
                                    <div className="flex flex-wrap -mx-4">
                                        <div className="w-full px-4 sm:w-1/2">
                                            <Label className="block pb-2" htmlFor="cargo">Cargo</Label>
                                            <Input id="cargo" name="cargo" placeholder="Cargo del pasajero" className="mt-1" />
                                        </div>
                                        <div className="w-full px-4 sm:w-1/2">
                                            <Label className="block pb-2" htmlFor="asientoAsignado">Asiento Asignado</Label>
                                            <Input id="asientoAsignado" name="asientoAsignado" placeholder="Asiento Asignado" className="mt-1" />
                                        </div>

                                    </div>
                                    <div className="flex flex-wrap -mx-4">
                                        <div className="w-full px-4 sm:w-1/2">
                                            <Label className="block pb-2" htmlFor="role">Rol</Label>
                                            <Select name="role" value={role} onValueChange={handleRoleChange} >
                                                <SelectTrigger>
                                                    <SelectValue>{role || "Selecciona un rol"}</SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="USER">USER</SelectItem>
                                                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="w-full px-4 sm:w-1/2">
                                            <Label className="block pb-2" htmlFor="isExecutive">Ejecutivo</Label>
                                            <Select name="isExecutive" value={isExecutive} onValueChange={handleIsExecutiveChange}  >
                                                <SelectTrigger>
                                                    <SelectValue>{isExecutive || "Selecciona una opción"}</SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="true">Sí</SelectItem>
                                                    <SelectItem value="false">No</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>





                                    <div className="flex flex-wrap -mx-4">
                                        <div className="w-full px-4 sm:w-1/2">
                                            <Label className="block pb-2" htmlFor="email">Email</Label>
                                            <Input id="email" name="email" placeholder="Email del pasajero" className="mt-1" />
                                        </div>
                                        <div className="w-full px-4 sm:w-1/2">
                                            <Label className="block pb-2" htmlFor="password">Contraseña</Label>
                                            <Input id="password" name="password" placeholder="Contraseña" type="password" className="mt-1" />
                                        </div>



                                    </div>

                                    <div className="mt-6">
                                        <Button type="submit" className="bg-green-500 text-white">
                                            Guardar Pasajero
                                        </Button>
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
                                <TableHead>RUT</TableHead>
                                <TableHead>Nombres</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Asiento Asignado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentTableData.map((route: any) => (
                                <TableRow key={route.id}>
                                    {editingId === route.id ? (
                                        <>
                                            <TableCell>
                                                <Input
                                                    name="RUT"
                                                    value={editPassengerFormData.rut}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleEditFormChange(event)}
                                                />

                                            </TableCell>


                                            <TableCell>
                                                <Input
                                                    name="Nombres"
                                                    value={editPassengerFormData.nombre + ' ' + editPassengerFormData.apellidoPaterno + ' ' + editPassengerFormData.apellidoMaterno}
                                                    onChange={handleEditFormChange}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    name="email"
                                                    value={editPassengerFormData.email}
                                                    onChange={handleEditFormChange}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    name="asientoAsignado"
                                                    value={editPassengerFormData.asientoAsignado}
                                                    onChange={handleEditFormChange}
                                                />
                                            </TableCell>

                                        </>
                                    ) : (
                                        <>
                                            <TableCell>{route.rut}</TableCell>
                                            <TableCell>{route.nombre ?? ''}{route.apellidoPaterno ?? ''}{route.apellidoMaterno ?? ''}</TableCell>
                                            <TableCell>{route.email}</TableCell>
                                            <TableCell>{route.asientoAsignado}</TableCell>

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
                        {/* Disable the Previous button if on the first page */}
                        <Button onClick={goToPreviousPage} disabled={currentPage === 1}>Anterior</Button>

                        {/* Display the current page number */}
                        <span className="text-red-500 font-medium">Página {currentPage} de {totalPages}</span>

                        {/* Disable the Next button if on the last page */}
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


