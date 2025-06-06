/*
  Warnings:

  - You are about to drop the column `address` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `allergies` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `bloodType` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `emergencyContact` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastLogin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `medicalHistory` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `twoFactorEnabled` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `twoFactorSecret` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `autoLogout` on the `UserPreferences` table. All the data in the column will be lost.
  - You are about to drop the column `dataRetentionPeriod` on the `UserPreferences` table. All the data in the column will be lost.
  - You are about to drop the column `dateFormat` on the `UserPreferences` table. All the data in the column will be lost.
  - You are about to drop the column `measurementSystem` on the `UserPreferences` table. All the data in the column will be lost.
  - You are about to drop the column `passwordChangeReminder` on the `UserPreferences` table. All the data in the column will be lost.
  - You are about to drop the column `privacyLevel` on the `UserPreferences` table. All the data in the column will be lost.
  - You are about to drop the column `sessionTimeout` on the `UserPreferences` table. All the data in the column will be lost.
  - You are about to drop the column `timeFormat` on the `UserPreferences` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `UserPreferences` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "address",
DROP COLUMN "allergies",
DROP COLUMN "bloodType",
DROP COLUMN "emergencyContact",
DROP COLUMN "height",
DROP COLUMN "isActive",
DROP COLUMN "lastLogin",
DROP COLUMN "medicalHistory",
DROP COLUMN "phoneNumber",
DROP COLUMN "twoFactorEnabled",
DROP COLUMN "twoFactorSecret",
DROP COLUMN "weight";

-- AlterTable
ALTER TABLE "UserPreferences" DROP COLUMN "autoLogout",
DROP COLUMN "dataRetentionPeriod",
DROP COLUMN "dateFormat",
DROP COLUMN "measurementSystem",
DROP COLUMN "passwordChangeReminder",
DROP COLUMN "privacyLevel",
DROP COLUMN "sessionTimeout",
DROP COLUMN "timeFormat",
DROP COLUMN "timezone";
