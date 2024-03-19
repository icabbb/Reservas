/*
  Warnings:

  - You are about to drop the column `apellidoMaterno` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `apellidoPaterno` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "apellidoMaterno",
DROP COLUMN "apellidoPaterno",
ADD COLUMN     "apellido" TEXT;
