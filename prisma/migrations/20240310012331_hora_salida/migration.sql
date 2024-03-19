/*
  Warnings:

  - You are about to drop the column `fechaSalida` on the `Vuelo` table. All the data in the column will be lost.
  - You are about to drop the column `horaSalida` on the `Vuelo` table. All the data in the column will be lost.
  - Added the required column `fechaHoraSalida` to the `Vuelo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vuelo" DROP COLUMN "fechaSalida",
DROP COLUMN "horaSalida",
ADD COLUMN     "fechaHoraSalida" TIMESTAMP(3) NOT NULL;
