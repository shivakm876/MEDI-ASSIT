/*
  Warnings:

  - You are about to drop the column `diets` on the `SymptomEntry` table. All the data in the column will be lost.
  - You are about to drop the column `medications` on the `SymptomEntry` table. All the data in the column will be lost.
  - You are about to drop the column `precautions` on the `SymptomEntry` table. All the data in the column will be lost.
  - You are about to drop the column `predictions` on the `SymptomEntry` table. All the data in the column will be lost.
  - You are about to drop the column `workouts` on the `SymptomEntry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SymptomEntry" DROP COLUMN "diets",
DROP COLUMN "medications",
DROP COLUMN "precautions",
DROP COLUMN "predictions",
DROP COLUMN "workouts";

-- CreateTable
CREATE TABLE "DiseasePrediction" (
    "id" TEXT NOT NULL,
    "symptomEntryId" TEXT NOT NULL,
    "diseaseName" TEXT NOT NULL,
    "probability" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "precautions" TEXT[],
    "medications" TEXT[],
    "workouts" TEXT[],
    "diets" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiseasePrediction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiseasePrediction_symptomEntryId_diseaseName_key" ON "DiseasePrediction"("symptomEntryId", "diseaseName");

-- AddForeignKey
ALTER TABLE "DiseasePrediction" ADD CONSTRAINT "DiseasePrediction_symptomEntryId_fkey" FOREIGN KEY ("symptomEntryId") REFERENCES "SymptomEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
