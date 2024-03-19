/*
  Warnings:

  - You are about to drop the column `apellido` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "apellido",
DROP COLUMN "nombre",
ADD COLUMN     "apellidoMaterno" TEXT,
ADD COLUMN     "apellidoPaterno" TEXT,
ADD COLUMN     "asientoAsignado" TEXT,
ADD COLUMN     "cargo" TEXT,
ADD COLUMN     "isExecutive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "nombres" TEXT;
