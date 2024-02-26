-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "rut" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_rut_key" ON "User"("rut");
