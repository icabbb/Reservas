-- DropForeignKey
ALTER TABLE "Vuelo" DROP CONSTRAINT "Vuelo_RouteId_fkey";

-- AlterTable
ALTER TABLE "Vuelo" ALTER COLUMN "RouteId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Vuelo" ADD CONSTRAINT "Vuelo_RouteId_fkey" FOREIGN KEY ("RouteId") REFERENCES "Route"("id") ON DELETE SET NULL ON UPDATE CASCADE;
