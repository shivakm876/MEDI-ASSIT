-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "allergies" TEXT,
ADD COLUMN     "bloodType" TEXT,
ADD COLUMN     "emergencyContact" TEXT,
ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastLogin" TIMESTAMP(3),
ADD COLUMN     "medicalHistory" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFactorSecret" TEXT,
ADD COLUMN     "weight" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "UserPreferences" ADD COLUMN     "autoLogout" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "dataRetentionPeriod" INTEGER NOT NULL DEFAULT 365,
ADD COLUMN     "dateFormat" TEXT NOT NULL DEFAULT 'MM/DD/YYYY',
ADD COLUMN     "measurementSystem" TEXT NOT NULL DEFAULT 'metric',
ADD COLUMN     "passwordChangeReminder" INTEGER NOT NULL DEFAULT 90,
ADD COLUMN     "privacyLevel" TEXT NOT NULL DEFAULT 'standard',
ADD COLUMN     "sessionTimeout" INTEGER NOT NULL DEFAULT 60,
ADD COLUMN     "timeFormat" TEXT NOT NULL DEFAULT '12h',
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'UTC';
