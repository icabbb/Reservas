import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./button";
import { signOut, useSession } from "next-auth/react";
import Image from 'next/image';

export default function NavbarCom() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white p-4 border-b-2">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="shrink-0">
          <Image src={"/logo.webp"} alt="Logo" width={150} height={125} />
        </div>

        <div className="md:hidden">
          <button onClick={toggleMenu}>
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12"></path>
              ) : (
                <path d="M4 6h16M4 12h16m-7 6h7"></path>
              )}
            </svg>
          </button>
        </div>

        <div className={`md:flex items-center ${isOpen ? 'flex' : 'hidden'} flex-col md:flex-row`}>
          <Link href="/" className="text-red-500 hover:text-red-300 px-3 py-2 font-medium">
            Reservas
          </Link>
          {session && session.user.role === "USER" && (
            <Link href="#" className="text-red-500 hover:text-red-300 px-3 py-2 font-medium">
              Mis Reservas
            </Link>
          )}

          {session && session.user.role === "ADMIN" && (
            <><Link href="/rutas" className="text-red-500 hover:text-red-300 px-3 py-2 font-medium">
              Rutas
            </Link><Link href="/vuelos" className="text-red-500 hover:text-red-300 px-3 py-2 font-medium">
                Vuelos
              </Link>
              <Link href="/pasajeros" className="text-red-500 hover:text-red-300 px-3 py-2 font-medium">
                Pasajeros
              </Link>
              <Link href="#" className="text-red-500 hover:text-red-300 px-3 py-2 font-medium">
                Reservas Vuelos
              </Link>
            </>
          )
          }
          {session && (
            <Link className="text-red-500 px-3 py-2 font-medium" href={""}>Hola {session.user.name}</Link>
          )}
          <Button
            onClick={handleSignOut}
            className="text-red-600 bg-white hover:bg-red-200 px-3 py-2"
          >
            Cerrar sesión
          </Button>
        </div>
      </div>
    </nav>
  );
}