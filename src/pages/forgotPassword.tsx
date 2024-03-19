// pages/forgot-password.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';

const ForgotPasswordPage: React.FC = () => {
  const [rut, setRut] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/user/forgotPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rut, email }),
      });



      if (!response.ok) {
        throw new Error('Error al solicitar nueva contraseña');
      }

      if (response.ok) {
        // Asumiendo que quieres mostrar un mensaje y redirigir
        alert('Solicitud de contraseña enviada con éxito. Revisa tu correo electrónico.');
        router.push('/login');
      }



      // Handle success (e.g., show a message or redirect)
      console.log('Solicitud de contraseña enviada con éxito');
      // Redirect or update UI
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <form onSubmit={handleForgotPassword}>
          <h2 className="text-xl font-bold mb-4 text-center">
            ¿Olvidó la contraseña?
          </h2>
          <div className="mb-4">
            <label htmlFor="rut" className="block text-sm font-medium text-gray-700">
              Rut
            </label>
            <input
              id="rut"
              type="text"
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
              placeholder="12345678-9"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Obtener contraseña
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <a
            href="#"
            className="font-medium text-red-600 hover:text-red-500"
            onClick={() => router.back()}
          >
            Volver
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
