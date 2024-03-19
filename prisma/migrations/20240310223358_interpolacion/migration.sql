/*
  Warnings:

  - Added the required column `RouteId` to the `Vuelo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vuelo" ADD COLUMN     "RouteId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Vuelo" ADD CONSTRAINT "Vuelo_RouteId_fkey" FOREIGN KEY ("RouteId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
