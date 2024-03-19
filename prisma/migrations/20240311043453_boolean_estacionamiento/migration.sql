/*
  Warnings:

  - The `estacionamiento` column on the `Reserva` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Reserva" DROP COLUMN "estacionamiento",
ADD COLUMN     "estacionamiento" BOOLEAN NOT NULL DEFAULT false;
