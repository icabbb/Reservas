-- CreateTable
CREATE TABLE "airplane" (
    "id" SERIAL NOT NULL,
    "registration" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "capacity" JSONB NOT NULL,
    "tripulation" INTEGER NOT NULL,
    "seasonCapacity" JSONB NOT NULL,
    "msn" INTEGER NOT NULL,
    "yom" INTEGER NOT NULL,

    CONSTRAINT "airplane_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "airplane_registration_key" ON "airplane"("registration");
