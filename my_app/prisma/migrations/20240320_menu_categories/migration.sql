-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- AddColumn
ALTER TABLE "MenuItem" ADD COLUMN "categoryId" TEXT;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Migrate existing categories
INSERT INTO "Category" ("id", "name", "description", "sortOrder", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid(),
    category,
    NULL,
    100,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "MenuItem"
WHERE category IS NOT NULL
GROUP BY category;

-- Update MenuItem records with new category IDs
UPDATE "MenuItem" m
SET "categoryId" = c.id
FROM "Category" c
WHERE m.category = c.name;

-- DropColumn
ALTER TABLE "MenuItem" DROP COLUMN "category"; 