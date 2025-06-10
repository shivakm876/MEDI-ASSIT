/*
  Warnings:

  - You are about to drop the column `description` on the `SymptomEntry` table. All the data in the column will be lost.
  - You are about to drop the column `disease` on the `SymptomEntry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SymptomEntry" DROP COLUMN "description",
DROP COLUMN "disease",
ADD COLUMN     "predictions" JSONB;
