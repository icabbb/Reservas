import { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import NavbarCom from '@/components/ui/navbar';
import { Calendar } from "@/components/ui/calendar"
import { JSX, SVGProps, SetStateAction, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, formatISO } from 'date-fns';


export default function HomePage({ dateString }: { dateString: string }) {
  const [fecha, setFecha] = useState<Date | null>(null);
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [vuelosDisponibles, setVuelosDisponibles] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);


  const handleOrigenChange = (value: SetStateAction<string>) => {
    setOrigen(value);
  };


  const handleDestinoChange = async (value: string) => {
    setDestino(value);


    if (origen && fecha && value) {
      await buscarVuelosDirectamente(origen, value, fecha);

    }
  };
  const buscarVuelosDirectamente = async (origen: string, destino: string, fecha: Date) => {
    // Formatea la fecha en el formato 'YYYY-MM-DD'
    const formattedDate = formatISO(fecha, { representation: 'date' });

    try {
      const query = new URLSearchParams({
        origen,
        destino,
        fecha: formattedDate,
      }).toString();
      const response = await fetch(`/api/vuelos/reservar?${query}`);

      if (!response.ok) {
        throw new Error('La solicitud a la API falló');
      }

      const data = await response.json();
      setVuelosDisponibles(data.vuelos);
    } catch (error) {
      console.error("Error al buscar vuelos:", error);
    }
  };

  // Manejador para actualizar el estado de la fecha cuando el usuario selecciona una fecha en el calendario
  const handleDateChange = (date: any) => {
    setFecha(date); // Suponiendo que tu componente de calendario pasa un objeto Date
  };


  const router = useRouter();

  const { data: session } = useSession();
  console.log(session?.user.isFirstLogin); // Esto debería funcionar sin errores


  useEffect(() => {
    if (session && session.user.isFirstLogin) {
      router.push('/changePass');
    }
  }, [session, router]);



  return (
    <>
      <NavbarCom />
      <div className="max-w-3xl mx-auto space-y-8 p-4">
        <div className="grid gap-4">
          <h1 className="text-3xl font-semibold tracking-tight text-center">Reserva tu vuelo</h1>
          <div className="grid gap-4">
            {/* Muestra primero el Input para la fecha */}
            <Input
              type="Date"
              value={fecha ? format(fecha, 'yyyy-MM-dd') : ''} // Este es el estado que se actualiza con la fecha seleccionada
              readOnly // Esto hace que el input sea solo de lectura
              className="bg-gray-200 cursor-not-allowed" // Agrega estilos para indicar que el input no es editable
              placeholder="DD/MM/AAAA" // Puedes cambiar el formato del placeholder si es necesario
            />
            {/* Luego el Popover para el calendario */}
            <Popover>
              <PopoverTrigger asChild>
                <Button className="w-auto justify-start text-left font-normal" id="calendar" variant="outline">
                  <CalendarDaysIcon className="mr-1 h-4 w-4 -translate-x-1" />
                  Selecciona una fecha
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <Calendar initialFocus mode="single" onSelect={handleDateChange} />
              </PopoverContent>
            </Popover>

            <form className="grid gap-4">
              <div className="grid gap-2">
                <div className="text-sm flex items-center gap-2">
                  <Label htmlFor="from">Origen</Label>
                </div>
                <Select onValueChange={handleOrigenChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el origen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Santiago">Santiago</SelectItem>
                    <SelectItem value="Coposa">Coposa</SelectItem>
                    <SelectItem value="Iquique">Iquique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <div className="text-sm flex items-center gap-2">
                  <Label htmlFor="class">Destino</Label>
                </div>
                <Select onValueChange={handleDestinoChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el destino" />
                  </SelectTrigger>
                  <SelectContent >
                    <SelectItem value="Santiago">Santiago</SelectItem>
                    <SelectItem value="Coposa">Coposa</SelectItem>
                    <SelectItem value="Iquique">Iquique</SelectItem>

                  </SelectContent>
                </Select>
              </div>

            </form>
            {vuelosDisponibles.length > 0 ? (
              <div className="max-w-3xl mx-auto space-y-8 p-4">
                <div className="grid gap-4">
                  <h2 className="text-2xl font-semibold tracking-tight">Vuelos Disponibles</h2>
                  <div className="grid gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex space-x-4">

                          <Table className="sm:max-w-[700px]">
                            <TableHeader>
                              <TableRow>
                                <TableCell>Origen</TableCell>
                                <TableCell>Destino</TableCell>
                                <TableCell>Fecha de salida</TableCell>
                                <TableCell>Matrícula del avión</TableCell>
                                <TableCell>Acciones</TableCell>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {vuelosDisponibles.map((vuelo: any) => (
                                <TableRow key={vuelo.id}>
                                  <TableCell>{vuelo.origen}</TableCell>
                                  <TableCell>{vuelo.destino}</TableCell>
                                  <TableCell>
                                    {new Date(vuelo.fechaHoraSalida).toLocaleString('es-CL', {
                                      timeZone: 'America/Santiago',
                                      year: 'numeric',
                                      month: '2-digit',
                                      day: '2-digit',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </TableCell>
                                  <TableCell>{vuelo.matriculaAvion}</TableCell>
                                  <TableCell> <Button variant="destructive" onClick={() => router.push(`/vuelos/${vuelo.id}`)}>Reservar</Button></TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>



              </div>
            ) : (
              <div className="grid gap-4">
                <h2 className="text-2xl font-semibold tracking-tight">Vuelos Disponibles</h2>
                <div className="grid gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="animate-pulse flex space-x-4">
                        <div className="flex-1 space-y-4 py-1">
                          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

    </>
  )
}

function CalendarDaysIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  } else if (session.user.isFirstLogin) {
    return {
      redirect: {
        destination: '/changePass',
        permanent: false,
      },
    };
  }

  const dateString = new Date().toISOString();

  return {
    props: { dateString },
  };
};