/*
  Warnings:

  - A unique constraint covering the columns `[passwordResetId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordResetId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_passwordResetId_key" ON "User"("passwordResetId");
