-- CreateTable
CREATE TABLE "Reserva" (
    "id" SERIAL NOT NULL,
    "vueloId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "fechaReserva" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reserva_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_vueloId_fkey" FOREIGN KEY ("vueloId") REFERENCES "Vuelo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
