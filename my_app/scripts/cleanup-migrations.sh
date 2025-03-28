#!/bin/bash

# Backup migrations first
echo "Backing up migrations..."
cp -r prisma/migrations prisma/migrations_backup_$(date +%Y%m%d_%H%M%S)

# Remove problematic migrations
echo "Removing problematic migrations..."
rm -rf prisma/migrations/20250316021046_add_tappass_member_models
rm -rf prisma/migrations/20250327160000_add_order_model
rm -rf prisma/migrations/20250327170000_add_order_model_clean
rm -rf prisma/migrations/20250327180000_add_order_model_only

# Keep only the clean order model migration
echo "Creating clean order model migration..."
mkdir -p prisma/migrations/20250327190000_add_order_model
cat > prisma/migrations/20250327190000_add_order_model/migration.sql << 'EOL'
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "items" JSONB NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "memberId" TEXT,
    "phoneNumber" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "marketingConsent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Order_memberId_idx" ON "Order"("memberId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EOL

echo "Migration cleanup complete. You can now run 'npx prisma migrate deploy'" 