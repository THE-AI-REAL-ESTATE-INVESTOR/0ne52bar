-- AlterTable
ALTER TABLE "Event" ADD COLUMN "isPublic" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Event" ADD COLUMN "showPastDate" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Event" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Event" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL; 