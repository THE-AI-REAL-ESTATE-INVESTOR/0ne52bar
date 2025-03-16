#!/bin/bash

# Script to automate the migration of TapPass from in-memory to Prisma

# Exit on error
set -e

# Print each command before executing
set -x

# Variables
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BRANCH_NAME="feature/tappass-prisma"
MIGRATION_DATE=$(date +"%Y%m%d%H%M%S")

echo -e "${GREEN}Starting TapPass migration to Prisma...${NC}"

# Step 1: Create Git Branch
echo -e "\n${GREEN}Creating Git branch for the migration...${NC}"
git checkout -b $BRANCH_NAME || { echo -e "${RED}Failed to create branch.${NC}"; exit 1; }

# Step 2: Generate Prisma client
echo -e "\n${GREEN}Generating Prisma client...${NC}"
npx prisma generate || { echo -e "${RED}Failed to generate Prisma client.${NC}"; exit 1; }

# Step 3: Push schema to database
echo -e "\n${GREEN}Pushing schema to database...${NC}"
npx prisma db push || { echo -e "${RED}Failed to push schema to database.${NC}"; exit 1; }

# Step 4: Seed the database (optional)
read -p "Do you want to seed the database with test data? (y/n) " -n 1 -r
echo    # New line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo -e "\n${GREEN}Seeding database...${NC}"
    npx prisma db seed || { echo -e "${RED}Failed to seed database.${NC}"; exit 1; }
fi

# Step 5: Migrate Server Actions
echo -e "\n${GREEN}Backing up and replacing server actions...${NC}"
# Create a backup directory
mkdir -p ./src/app/tappass/backup_$MIGRATION_DATE

# Copy original files to backup
cp ./src/app/tappass/actions.ts ./src/app/tappass/backup_$MIGRATION_DATE/actions-memory.ts || { echo -e "${RED}Failed to backup actions.ts.${NC}"; exit 1; }

# Rename files
mv ./src/app/tappass/actions.ts ./src/app/tappass/actions-memory.ts || { echo -e "${RED}Failed to rename actions.ts.${NC}"; exit 1; }
mv ./src/app/tappass/actions-prisma.ts ./src/app/tappass/actions.ts || { echo -e "${RED}Failed to rename actions-prisma.ts.${NC}"; exit 1; }

# Step 6: Commit changes
echo -e "\n${GREEN}Committing changes...${NC}"
git add .
git commit -m "feat(tappass): migrate to Prisma database" || { echo -e "${RED}Failed to commit changes.${NC}"; exit 1; }

# Step 7: Provide next steps
echo -e "\n${GREEN}Migration completed successfully!${NC}"
echo -e "\nNext steps:"
echo "1. Start the development server: pnpm run dev"
echo "2. Test the TapPass feature to ensure it works correctly"
echo "3. Run Prisma Studio to manage the database: npx prisma studio"
echo -e "\nIf you encounter any issues, a backup of the original files is in ./src/app/tappass/backup_$MIGRATION_DATE/"
echo -e "\nTo revert the migration:"
echo "1. mv ./src/app/tappass/actions.ts ./src/app/tappass/actions-prisma.ts"
echo "2. mv ./src/app/tappass/actions-memory.ts ./src/app/tappass/actions.ts"
echo "3. git checkout main"
echo "4. git branch -D $BRANCH_NAME"

echo -e "\n${GREEN}Migration script completed.${NC}" 