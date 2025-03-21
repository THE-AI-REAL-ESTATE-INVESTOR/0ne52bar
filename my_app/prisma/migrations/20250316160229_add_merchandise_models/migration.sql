/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber]` on the table `FindMemberParams` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `FormData` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "MerchandiseCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MerchandiseCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Merchandise" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "imagePath" TEXT,
    "inStock" BOOLEAN NOT NULL DEFAULT false,
    "comingSoon" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 100,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Merchandise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FindMemberParams_phoneNumber_key" ON "FindMemberParams"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "FormData_phoneNumber_key" ON "FormData"("phoneNumber");

-- AddForeignKey
ALTER TABLE "Merchandise" ADD CONSTRAINT "Merchandise_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "MerchandiseCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
