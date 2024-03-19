/* eslint-disable react/jsx-key */


import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import NavbarCom from '@/components/ui/navbar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import router from 'next/router';




const formSchema = z.object({
  rut: z.string().length(10, "El rut debe tener 10 caracteres"),
  email: z.string().email(),
  Nombre: z.string().min(1, "El nombre es obligatorio"),
  Apellido: z.string().min(1, "El apellido es obligatorio"),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'USER']),
});



const formJson = [
  { type: 'text', name: 'rut', label: 'Rut', placeholder: '12345678-9' },
  { type: 'text', name: 'Nombre', label: 'Name', placeholder: 'John Doe Dea' },
  { type: 'text', name: 'Apellido', label: 'Lastname', placeholder: 'Doe' },
  { type: 'email', name: 'email', label: 'Email', placeholder: 'email@example.com' },
  { type: 'select', name: 'role', label: 'Role', placeholder: 'Select a role', readonly: true },
  { type: 'password', name: 'password', label: 'Password', placeholder: '********' },

];



type FormValues = z.infer<typeof formSchema>;


export default function Dashboard() {
  const { data: session, status } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rut: '',
      email: '',
      Nombre: '',
      Apellido: '',
      password: '',
      role: 'USER',
    },
  });


  useEffect(() => {
    if (status === "authenticated") {

      if (session.user.role !== 'ADMIN') {
        router.push('/');
      }
    } else {
      // Redirect to login if not authenticated
      router.push('/login');
    }
  }, [session, status, router]);


  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);

    // Elimina confirmPassword del objeto de datos, ya que probablemente no quieras enviarlo al servidor
    const userData = { ...data };

    try {
      const response = await fetch('/api/user/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Error al crear el usuario');
      }

      // Procesa la respuesta de tu backend aquí.
      // Por ejemplo, puedes redireccionar al usuario o mostrar un mensaje de éxito.
      console.log('Usuario creado con éxito');
    } catch (error) {
      console.error('Error al crear el usuario:', error);
    }
  }
  return (
    <>
      <NavbarCom />
      <div className="min-h-screen bg-gray-100 p-0 sm:p-12 text-red-600">
        <div className="mx-auto max-w-md px-6 py-12 bg-white border-0 shadow-lg sm:rounded-3xl">
          <h1 className="text-2xl font-bold mb-8 text-center">Crear usuario nuevo</h1>
          <Form {...form}>

            <form onSubmit={form.handleSubmit(onSubmit)}>
              {formJson.map((fieldInfo, index) => (
                <FormField
                  key={index}
                  control={form.control}
                  name={fieldInfo.name as keyof FormValues}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fieldInfo.name.toUpperCase()}</FormLabel>
                      <FormControl>
                        <Input placeholder={fieldInfo.placeholder} {...field} readOnly={fieldInfo.name === 'role'} />
                      </FormControl>
                    </FormItem>
                  )} />
              ))}
              <div className='flex gap-3 pt-2 pb-2 '>
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ROL</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} >
                        <FormControl>
                          <SelectTrigger className='w-[180px]'>
                            <SelectValue placeholder="Selecciona un rol" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USER">USER</SelectItem>
                          <SelectItem value="ADMIN">ADMIN</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>

                  )}
                />
              </div>
              <Button type="submit" variant='destructive'>Submit</Button>
            </form>
          </Form>
        </div>

      </div>
      <footer className="text-center text-gray-500 text-xs p-10 ">
        &copy;2024 - Mineral Airways - Reserva de vuelos Collahuasi
      </footer>
    </>

  );






}






