/*
  Warnings:

  - You are about to drop the column `additionalInfo` on the `SymptomEntry` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `SymptomEntry` table. All the data in the column will be lost.
  - You are about to drop the column `severity` on the `SymptomEntry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SymptomEntry" DROP COLUMN "additionalInfo",
DROP COLUMN "duration",
DROP COLUMN "severity";
