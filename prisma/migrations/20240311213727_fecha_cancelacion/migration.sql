-- AlterTable
ALTER TABLE "Reserva" ADD COLUMN     "estado" TEXT NOT NULL DEFAULT 'Reservado',
ADD COLUMN     "fechaCancelacion" TIMESTAMP(3);
