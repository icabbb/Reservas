/*
  Warnings:

  - You are about to drop the column `apellido` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "apellido",
ADD COLUMN     "apellidoMaterno" TEXT,
ADD COLUMN     "apellidoPaterno" TEXT;
