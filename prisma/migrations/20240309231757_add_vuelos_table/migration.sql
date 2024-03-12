-- CreateTable
CREATE TABLE "Vuelo" (
    "id" SERIAL NOT NULL,
    "fechaHoraSalida" TIMESTAMP(3) NOT NULL,
    "numeroVuelo" TEXT NOT NULL,
    "matriculaAvion" TEXT NOT NULL,
    "origen" TEXT NOT NULL,
    "destino" TEXT NOT NULL,

    CONSTRAINT "Vuelo_pkey" PRIMARY KEY ("id")
);
