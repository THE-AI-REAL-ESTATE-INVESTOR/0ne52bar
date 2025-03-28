#!/bin/bash

# Create backup directory
BACKUP_DIR="prisma/migrations_backup_$(date +%Y%m%d_%H%M%S)"
echo "Creating backup in $BACKUP_DIR..."
mkdir -p "$BACKUP_DIR"
cp -r prisma/migrations/* "$BACKUP_DIR/"

# Clean up migrations directory
echo "Cleaning up migrations directory..."
cd prisma/migrations
rm -rf 20250316021046_add_tappass_member_models
rm -rf 20250316160229_add_merchandise_models
rm -rf 20250319141245_
rm -rf 20250319175030_update_tappass_models
rm -rf 20250327160000_add_order_model
rm -rf 20250327170000_add_order_model_clean
rm -rf 20250327180000_add_order_model_only
rm -rf 20250327190000_add_order_model

# Keep only essential migrations
echo "Keeping only essential migrations..."
mkdir -p 20250327200000_add_order_model
cat > 20250327200000_add_order_model/migration.sql << 'EOL'
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

echo "Migration cleanup complete. Now run:"
echo "1. npx prisma generate"
echo "2. npx prisma migrate deploy" 