/*
  Warnings:

  - You are about to drop the column `businessSettingsId` on the `BusinessHours` table. All the data in the column will be lost.
  - You are about to drop the column `amenities` on the `BusinessInfo` table. All the data in the column will be lost.
  - You are about to drop the column `guestCount` on the `EventAttendee` table. All the data in the column will be lost.
  - You are about to drop the column `registeredAt` on the `EventAttendee` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - The primary key for the `VerificationToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `VerificationToken` table. All the data in the column will be lost.
  - You are about to drop the `AdminCard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ApiResponse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BusinessAmenity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BusinessSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CreateMemberParams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmailResponse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventParams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FacebookEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FacebookEventsResponse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FacebookPage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FacebookSDK` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FindMemberParams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FormData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LoginData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Member` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RegisterResponse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reward` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SlugParams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestAddress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestAlert` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestNotification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestOrder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestOrderItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestPayment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestPost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestSubscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Visit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Window` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PermissionToRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RoleToUser` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[provider,providerAccountId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `BusinessInfo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `MerchandiseCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sessionToken]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[token]` on the table `VerificationToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[identifier,token]` on the table `VerificationToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `BusinessInfo` table without a default value. This is not possible if the table is not empty.
  - Made the column `color` on table `EventTag` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "BusinessAmenity" DROP CONSTRAINT "BusinessAmenity_businessInfoId_fkey";

-- DropForeignKey
ALTER TABLE "BusinessHours" DROP CONSTRAINT "BusinessHours_businessSettingsId_fkey";

-- DropForeignKey
ALTER TABLE "FacebookEvent" DROP CONSTRAINT "FacebookEvent_facebookEventsResponseId_fkey";

-- DropForeignKey
ALTER TABLE "Reward" DROP CONSTRAINT "Reward_memberId_fkey";

-- DropForeignKey
ALTER TABLE "TestAddress" DROP CONSTRAINT "TestAddress_testUserId_fkey";

-- DropForeignKey
ALTER TABLE "TestAlert" DROP CONSTRAINT "TestAlert_testUserId_fkey";

-- DropForeignKey
ALTER TABLE "TestComment" DROP CONSTRAINT "TestComment_testPostId_fkey";

-- DropForeignKey
ALTER TABLE "TestComment" DROP CONSTRAINT "TestComment_testUserId_fkey";

-- DropForeignKey
ALTER TABLE "TestNotification" DROP CONSTRAINT "TestNotification_testUserId_fkey";

-- DropForeignKey
ALTER TABLE "TestOrder" DROP CONSTRAINT "TestOrder_testUserId_fkey";

-- DropForeignKey
ALTER TABLE "TestOrderItem" DROP CONSTRAINT "TestOrderItem_testOrderId_fkey";

-- DropForeignKey
ALTER TABLE "TestOrderItem" DROP CONSTRAINT "TestOrderItem_testProductId_fkey";

-- DropForeignKey
ALTER TABLE "TestPayment" DROP CONSTRAINT "TestPayment_testOrderId_fkey";

-- DropForeignKey
ALTER TABLE "TestPost" DROP CONSTRAINT "TestPost_testCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "TestPost" DROP CONSTRAINT "TestPost_testUserId_fkey";

-- DropForeignKey
ALTER TABLE "TestReview" DROP CONSTRAINT "TestReview_testProductId_fkey";

-- DropForeignKey
ALTER TABLE "TestReview" DROP CONSTRAINT "TestReview_testUserId_fkey";

-- DropForeignKey
ALTER TABLE "TestSubscription" DROP CONSTRAINT "TestSubscription_testUserId_fkey";

-- DropForeignKey
ALTER TABLE "Visit" DROP CONSTRAINT "Visit_memberId_fkey";

-- DropForeignKey
ALTER TABLE "Window" DROP CONSTRAINT "Window_facebookSDKId_fkey";

-- DropForeignKey
ALTER TABLE "_PermissionToRole" DROP CONSTRAINT "_PermissionToRole_A_fkey";

-- DropForeignKey
ALTER TABLE "_PermissionToRole" DROP CONSTRAINT "_PermissionToRole_B_fkey";

-- DropForeignKey
ALTER TABLE "_RoleToUser" DROP CONSTRAINT "_RoleToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_RoleToUser" DROP CONSTRAINT "_RoleToUser_B_fkey";

-- DropIndex
DROP INDEX "EventAttendee_email_key";

-- AlterTable
ALTER TABLE "BusinessHours" DROP COLUMN "businessSettingsId";

-- AlterTable
ALTER TABLE "BusinessInfo" DROP COLUMN "amenities",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "EventAttendee" DROP COLUMN "guestCount",
DROP COLUMN "registeredAt";

-- AlterTable
ALTER TABLE "EventTag" ALTER COLUMN "color" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "VerificationToken" DROP CONSTRAINT "VerificationToken_pkey",
DROP COLUMN "id";

-- DropTable
DROP TABLE "AdminCard";

-- DropTable
DROP TABLE "ApiResponse";

-- DropTable
DROP TABLE "BusinessAmenity";

-- DropTable
DROP TABLE "BusinessSettings";

-- DropTable
DROP TABLE "CreateMemberParams";

-- DropTable
DROP TABLE "EmailResponse";

-- DropTable
DROP TABLE "EventParams";

-- DropTable
DROP TABLE "FacebookEvent";

-- DropTable
DROP TABLE "FacebookEventsResponse";

-- DropTable
DROP TABLE "FacebookPage";

-- DropTable
DROP TABLE "FacebookSDK";

-- DropTable
DROP TABLE "FindMemberParams";

-- DropTable
DROP TABLE "FormData";

-- DropTable
DROP TABLE "LoginData";

-- DropTable
DROP TABLE "Member";

-- DropTable
DROP TABLE "Permission";

-- DropTable
DROP TABLE "RegisterResponse";

-- DropTable
DROP TABLE "Reward";

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "SlugParams";

-- DropTable
DROP TABLE "TestAddress";

-- DropTable
DROP TABLE "TestAlert";

-- DropTable
DROP TABLE "TestCategory";

-- DropTable
DROP TABLE "TestComment";

-- DropTable
DROP TABLE "TestNotification";

-- DropTable
DROP TABLE "TestOrder";

-- DropTable
DROP TABLE "TestOrderItem";

-- DropTable
DROP TABLE "TestPayment";

-- DropTable
DROP TABLE "TestPost";

-- DropTable
DROP TABLE "TestProduct";

-- DropTable
DROP TABLE "TestReview";

-- DropTable
DROP TABLE "TestSubscription";

-- DropTable
DROP TABLE "TestTag";

-- DropTable
DROP TABLE "TestUser";

-- DropTable
DROP TABLE "UserData";

-- DropTable
DROP TABLE "Visit";

-- DropTable
DROP TABLE "Window";

-- DropTable
DROP TABLE "_PermissionToRole";

-- DropTable
DROP TABLE "_RoleToUser";

-- DropEnum
DROP TYPE "MembershipLevel";

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessInfo_email_key" ON "BusinessInfo"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MerchandiseCategory_name_key" ON "MerchandiseCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
