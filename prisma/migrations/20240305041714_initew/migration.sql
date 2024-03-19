-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "rut" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT,
    "apellido" TEXT,
    "email" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "isFirstLogin" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_rut_key" ON "User"("rut");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
