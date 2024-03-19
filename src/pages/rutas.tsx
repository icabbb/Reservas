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

export default function Component() {
    const [routes, setRoutes] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({ city: '', region: '', flightCode: '', description: '' });
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
        async function fetchRoutes() {
            const res = await fetch('/api/rutas/ruta')
            const data = await res.json()
            setRoutes(data)
        }
        fetchRoutes()
    }, [])

    useEffect(() => {
        setTotalPages(Math.ceil(routes.length / rowsPerPage));
    }, [routes, rowsPerPage]);

    const goToNextPage = () => setCurrentPage((page) => Math.min(page + 1, totalPages));
    const goToPreviousPage = () => setCurrentPage((page) => Math.max(page - 1, 1));

    // Slicing the routes data for the current page
    const currentTableData = routes.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    async function handleDelete(id: string) {

        console.log('Delete', id)
        const res = await fetch(`/api/rutas/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (!res.ok) {
            console.error('Error al eliminar la ruta:', res)

        } else {
            const updatedRoutes = routes.filter((route: { id: string }) => route.id !== id);
            setRoutes(updatedRoutes);
        }
    }

    function handleEdit(route: { id: SetStateAction<null>; city: any; region: any; flightCode: any; description: any }) {
        setEditingId(route.id);
        setEditFormData({ city: route.city, region: route.region, flightCode: route.flightCode, description: route.description });
    };
    const handleEditFormChange = (event: { target: { name: any; value: any } }) => {
        const { name, value } = event.target;
        setEditFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handleSaveClick = async (id: any) => {
        const res = await fetch(`/api/rutas/${id}`, {
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

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        const form = e.target
        const formData = new FormData(form)
        const data = {
            city: formData.get('ciudad'),
            region: formData.get('region'),
            flightCode: formData.get('codigo'),
            description: formData.get('descripcion'),
        };
        const res = await fetch('/api/rutas/ruta', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        console.log(res)
        setIsOpen(false)
    }

    const filteredRoutes = searchTerm
        ? routes.filter((route: { city: string; region: string; flightCode: string; description: string }) =>
            route.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
            route.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
            route.flightCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            route.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : routes;

    const handleCloseSearchDialog = () => setIsSearchDialogOpen(false);

    const renderSearchResults = () => {
        if (filteredRoutes.length === 0) {
            return <p className="text-center">No se encontraron resultados</p>;
        }
        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Ciudad</TableHead>
                        <TableHead>Región</TableHead>
                        <TableHead>Código de Vuelo</TableHead>
                        <TableHead>Descripción</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredRoutes.map((route: { id: any; city: any; region: any; flightCode: any; description: any }) => (
                        <TableRow key={route.id}>
                            <TableCell>{route.city}</TableCell>
                            <TableCell>{route.region}</TableCell>
                            <TableCell>{route.flightCode}</TableCell>
                            <TableCell>{route.description}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    };





    return (
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
                            <Button className="bg-blue-500 text-white"><AddIcon />Crear Ruta</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]" onInteractOutside={handleInteractOutside}>
                            <DialogHeader>
                                <DialogTitle>Crear Ruta</DialogTitle>
                                <DialogDescription>Completa los detalles de la nueva ruta.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit}>
                                <div className="grid gap-4 py-4">

                                    <div className="grid grid-cols-4 items-center gap-4">

                                        <Label className="text-right" htmlFor="ciudad">
                                            Ciudad
                                        </Label>
                                        <Input className="col-span-3" id="ciudad" name="ciudad" placeholder="Ciudad" />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right" htmlFor="region">
                                            Región
                                        </Label>
                                        <Input className="col-span-3" id="region" name="region" placeholder="Región" />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right" htmlFor="codigo">
                                            Código de Vuelo
                                        </Label>
                                        <Input className="col-span-3" id="codigo" name="codigo" placeholder="Código de Vuelo" />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right" htmlFor="descripcion">
                                            Descripción
                                        </Label>
                                        <Input className="col-span-3" id="descripcion" name="descripcion" placeholder="Descripción" />
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
                            <TableHead className="font-bold text-black">Ciudad</TableHead>
                            <TableHead className="font-bold text-black">Región</TableHead>
                            <TableHead className="font-bold text-black">Código de Vuelo</TableHead>
                            <TableHead className="font-bold text-black">Descripción</TableHead>
                            <TableHead className="font-bold text-black  ">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentTableData.map((route: any) => (
                            <TableRow key={route.id}>
                                {editingId === route.id ? (
                                    <>
                                        <TableCell>
                                            <Input
                                                name="city"
                                                value={editFormData.city}
                                                onChange={handleEditFormChange}
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <Input
                                                name="region"
                                                value={editFormData.region}
                                                onChange={handleEditFormChange}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                name="flightCode"
                                                value={editFormData.flightCode}
                                                onChange={handleEditFormChange}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                name="description"
                                                value={editFormData.description}
                                                onChange={handleEditFormChange}
                                            />
                                        </TableCell>
                                    </>
                                ) : (
                                    <>
                                        <TableCell>{route.city}</TableCell>
                                        <TableCell>{route.region}</TableCell>
                                        <TableCell>{route.flightCode}</TableCell>
                                        <TableCell>{route.description}</TableCell>
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
                <div className="flex justify-between items-center">
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
    )
}

function EyeIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
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


