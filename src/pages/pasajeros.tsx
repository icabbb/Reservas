import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { ChangeEvent, JSX, SVGProps, SetStateAction, useEffect, useState } from "react"
import NavbarCom from "@/components/ui/navbar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { IconPlus } from '@tabler/icons-react';
import { type } from "os"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator"
import { useSession } from "next-auth/react"
import { Toast, ToastAction } from "@/components/ui/toast"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import * as XLSX from 'xlsx';


interface Passenger {
    id?: number;
    rut: string;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    email: string;
    cargo: string;
    password: string;
    asientoAsignado: string;
    isExecutive: boolean;
    role: string;
}


export default function pasajeros() {
    const { data: session, status } = useSession();
    const [isPasajeros, setIsPasajeros] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [editingId, setEditingId] = useState(null);
    const [editPassengerFormData, setEditPassengerFormData] = useState<Passenger>({
        // Initial state without id
        rut: '',
        nombres: '',
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
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);




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
            console.error('Error al eliminar el pasajero:', res)

        }

        const updatedPasajero = isPasajeros.filter((route: { id: string }) => route.id !== id);
        setIsPasajeros(updatedPasajero);

    }



    const handleEditClick = (isPasajeros: any) => {
        setEditPassengerFormData({ ...isPasajeros });
        setIsEditModalOpen(true);
    };


    const handleEditFormChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEditPassengerFormData({
            ...editPassengerFormData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSaveClick = async (id: number) => {

        try {
            const res = await fetch(`/api/user/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editPassengerFormData),
            });




            if (res.ok) {
                toast({
                    title: 'Pasajero actualizado',
                    description: `El pasajero ${editPassengerFormData.nombres} ${editPassengerFormData.apellidoPaterno} ha sido actualizado correctamente.`,
                })
            }



            setIsEditModalOpen(false);


        } catch (error) {
            console.error('Error al actualizar el pasajero:', error);
            toast({
                title: 'Error',
                description: 'Ocurrió un error al actualizar el pasajero. Por favor, intenta de nuevo.',
                variant: 'destructive',
            });


        }
    };

    const handleExportExcel = () => {
        console.log(isPasajeros)
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(isPasajeros);

        XLSX.utils.book_append_sheet(wb, ws, "Pasajeros");
        XLSX.writeFile(wb, "ListaDePasajeros.xlsx");
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
        const nombres = formData.get('nombres') as string;
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

    const filteredPasajero = isPasajeros.filter((route: { rut: string; nombres: string; apellidoPaterno: string; apellidoMaterno: string; email: string; cargo: string; asientoAsignado: string; isExecutive: boolean; role: string; }) => {
        return `${route.rut} ${route.nombres} ${route.apellidoPaterno} ${route.apellidoMaterno} ${route.email} ${route.cargo} ${route.asientoAsignado} ${route.isExecutive} ${route.role}`.toLowerCase().includes(searchTerm.toLowerCase());
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
                    {filteredPasajero.map((route: { id: any; rut: React.ReactNode; password: React.ReactNode; nombres: React.ReactNode; apellidoPaterno: React.ReactNode; apellidoMaterno: React.ReactNode; email: React.ReactNode; cargo: React.ReactNode; asientoAsignado: React.ReactNode; isExecutive: React.ReactNode; role: React.ReactNode; }) => (
                        <TableRow key={route.id}>
                            <TableCell>{route.rut}</TableCell>
                            <TableCell>{route.nombres ?? ''}  {route.apellidoPaterno ?? ''}  {route.apellidoMaterno ?? ''}</TableCell>
                            <TableCell>{route.email}</TableCell>
                            <TableCell>{route.asientoAsignado}</TableCell>
                            <TableCell>
                                <div className="flex justify-between gap-1">
                                    <TrashIcon className="text-red-500" onClick={() => handleDelete(route.id)} />
                                    {editingId === route.id ? (
                                        <CheckIcon className="text-green-500" onClick={() => handleSaveClick(route.id)} />
                                    ) : (
                                        <PencilIcon className="text-yellow-500" onClick={() => handleEditClick(route.id)} />
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}

                </TableBody>
            </Table>
        );
    };


    const handleFormSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault(); // Previene la recarga de la página
        await handleSaveClick(editPassengerFormData.id ?? 0);
        // Aquí puedes mostrar tu mensaje de éxito o error basado en la respuesta
        toast({
            title: 'Éxito',
            description: 'Pasajero editado correctamente.',
            className: 'bg-green-500',
            variant: 'default',
        });
    };

    const importFromExcel = async (event: any) => {
        const file = event.target.files[0];
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        try {
            const response = await fetch('/api/user/bulk-create', { // Asume /api/users/bulk-create como tu endpoint para la creación masiva
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jsonData),
            });
            if (response.ok) {
                toast({
                    title: 'Importación exitosa',
                    description: 'Los pasajeros han sido importados correctamente.',
                });
                window.location.reload();




            } else {
                throw new Error('Falló la importación de pasajeros');
            }
        } catch (error) {
            console.error('Error al importar pasajeros:', error);
            toast({
                title: 'Error',
                description: 'Ocurrió un error al importar los pasajeros. Por favor, intenta de nuevo.',
                variant: 'destructive',
            });
        }

        event.target.value = ''; // Resetea el input file
    };








    return (

        <>

            <div>
                <NavbarCom />
            </div>
            <div>
                <Toaster />
            </div>
            <main className="max-w-4xl mx-auto my-10 p-8 border-t-8 border-red-500">
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

                        <div className="flex gap-4">
                            <Button onClick={handleExportExcel} className="bg-green-500 text-white">Exportar a Excel</Button>
                        </div>

                        <div className="flex gap-4">

                            <input className="flex h-10 w-full hover:bg-slate-200  rounded-md border border-input bg-background px-4 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-foreground file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer" type="file" accept=".xlsx, .xls" onChange={importFromExcel} placeholder="Selecciona un archivo" />

                        </div>



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
                                            <Label className="block pb-2" htmlFor="nombres">nombres</Label>
                                            <Input id="nombres" name="nombres" placeholder="nombres del pasajero" className="mt-1" />
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
                                        <Button type="submit" className="bg-green-500 text-white" onClick={() => window.location.reload()}>
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
                                <TableHead className="text-black font-bold">RUT</TableHead>
                                <TableHead className="text-black font-bold">Nombres</TableHead>
                                <TableHead className="text-black font-bold">Email</TableHead>
                                <TableHead className="text-black font-bold">Asiento Asignado</TableHead>
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
                                                    name="nombres"
                                                    placeholder={editPassengerFormData.nombres}
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
                                            <TableCell>{route.nombres ?? ''}  {route.apellidoPaterno ?? ''}  {route.apellidoMaterno ?? ''}</TableCell>
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
                                                <PencilIcon className="text-yellow-500" onClick={() => handleEditClick(route)} />
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                            }
                        </TableBody>
                    </Table>


                    {/* Modal para editar el pasajero */}
                    {isEditModalOpen && (
                        <div className="fixed inset-0 z-10 overflow-y-auto">
                            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen} >
                                <div className="flex items-center justify-center min-h-screen">
                                    <DialogContent className=" mx-auto w-full max-w-xl rounded-lg bg-white p-6 shadow-lg">
                                        <DialogHeader>
                                            <DialogTitle className="text-lg font-semibold text-gray-900">Editar Pasajero</DialogTitle>
                                        </DialogHeader>

                                        <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
                                            {/* Example of input, repeat this structure for each one */}
                                            <Label className="block" htmlFor="rut">RUT</Label>
                                            <Input
                                                className="w-full rounded-md border-gray-300 shadow-sm"
                                                type="text"
                                                name="rut"
                                                value={editPassengerFormData.rut}
                                                onChange={handleEditFormChange}
                                            />

                                            <Label className="block" htmlFor="nombres">Nombres</Label>
                                            <Input
                                                className="w-full rounded-md border-gray-300 shadow-sm"
                                                type="text"
                                                name="nombres"
                                                value={editPassengerFormData.nombres}
                                                onChange={handleEditFormChange}
                                            />

                                            <Label className="block" htmlFor="apellidoPaterno">Apellido Paterno</Label>
                                            <Input
                                                className="w-full rounded-md border-gray-300 shadow-sm"
                                                type="text"
                                                name="apellidoPaterno"
                                                value={editPassengerFormData.apellidoPaterno}
                                                onChange={handleEditFormChange}
                                            />

                                            <Label className="block" htmlFor="apellidoMaterno">Apellido Materno</Label>
                                            <Input
                                                className="w-full rounded-md border-gray-300 shadow-sm"
                                                type="text"
                                                name="apellidoMaterno"
                                                value={editPassengerFormData.apellidoMaterno}
                                                onChange={handleEditFormChange}
                                            />

                                            <Label className="block" htmlFor="cargo">Cargo</Label>
                                            <Input
                                                className="w-full rounded-md border-gray-300 shadow-sm"
                                                type="text"
                                                name="cargo"
                                                value={editPassengerFormData.cargo}
                                                onChange={handleEditFormChange}
                                            />

                                            <Label className="block" htmlFor="asientoAsignado">Asiento Asignado</Label>
                                            <Input
                                                className="w-full rounded-md border-gray-300 shadow-sm"
                                                type="text"
                                                name="asientoAsignado"
                                                value={editPassengerFormData.asientoAsignado}
                                                onChange={handleEditFormChange}
                                            />

                                            <Label className="block" htmlFor="email">Email</Label>
                                            <Input
                                                className="w-full rounded-md border-gray-300 shadow-sm"
                                                type="text"
                                                name="email"
                                                value={editPassengerFormData.email}
                                                onChange={handleEditFormChange}
                                            />






                                            <div className="flex gap-4">
                                                <div className="w-1/2">
                                                    <Label className="block" htmlFor="role">Rol</Label>
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
                                                <div className="w-1/2">
                                                    <Label className="block" htmlFor="isExecutive">Ejecutivo</Label>
                                                    <Select name="isExecutive" value={isExecutive} onValueChange={handleIsExecutiveChange} >
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

                                            <div className="flex justify-end mt-6">
                                                <Button onClick={() => setIsEditModalOpen(false)} className="mr-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                                    Cancelar
                                                </Button>
                                                <Button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                    <CheckIcon className="m-2" />Guardar
                                                </Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </div>
                            </Dialog>
                        </div>

                    )}

                    <div>
                        <p>Pasajeros mostrados: {currentTableData.length}</p>
                    </div>
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
            </main >

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


