-- Add back the category column to MenuItem
ALTER TABLE "MenuItem" ADD COLUMN "category" TEXT;

-- Restore category values from Category table
UPDATE "MenuItem" m
SET "category" = c.name
FROM "Category" c
WHERE m.categoryId = c.id;

-- Drop foreign key
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_categoryId_fkey";

-- Drop categoryId column
ALTER TABLE "MenuItem" DROP COLUMN "categoryId";

-- Drop Category table
DROP TABLE "Category"; 