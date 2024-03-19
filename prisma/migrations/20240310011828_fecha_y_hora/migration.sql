/*
  Warnings:

  - You are about to drop the column `fechaHoraSalida` on the `Vuelo` table. All the data in the column will be lost.
  - Added the required column `fechaSalida` to the `Vuelo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `horaSalida` to the `Vuelo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vuelo" DROP COLUMN "fechaHoraSalida",
ADD COLUMN     "fechaSalida" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "horaSalida" TIMESTAMP(3) NOT NULL;
