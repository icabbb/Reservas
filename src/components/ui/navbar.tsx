"use client"

import Link from "next/link";
import React from "react";
import { Button } from "./button";
import { signOut, useSession } from "next-auth/react";

export default function NavbarCom() {
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login"});
  };
  return <div className="flex flex-col">
  <nav className=" bg-red-600 text-white p-4">
    <div className="flex justify-between items-center">
      <span className="font-bold text-xl">Placeholder</span>
      <div className="space-x-4">
        <Link className="text-white hover:text-red-300" href="#">
          Reservar
        </Link>
        <Link className="text-white hover:text-red-300" href="#">
          Mis Reservas
        </Link>


              
            {session && <span>Hola {session.user.name}</span>}
            
            <Button onClick={handleSignOut} className="bg-white text-red-600 hover:bg-red-200">
              Cerrar sesión
            </Button>


    </div>
    </div>
  </nav>
  </div>

}


