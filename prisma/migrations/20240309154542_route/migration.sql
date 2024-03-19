-- CreateTable
CREATE TABLE "Route" (
    "id" SERIAL NOT NULL,
    "city" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "flightCode" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Route_flightCode_key" ON "Route"("flightCode");
