#!/bin/bash

# Create migrations directory if it doesn't exist
mkdir -p prisma/migrations

# Remove conflicting migrations
rm -rf prisma/migrations/20250316021046_add_tappass_member_models

# Keep the existing membership level migration
# Keep the existing merchandise models migration
# Add our new order model migration
mv prisma/migrations/20250327160000_add_order_model/migration.sql prisma/migrations/

# Update migration history
echo '{
  "version": "5",
  "dialect": "postgresql",
  "entries": [
    {
      "idx": 1,
      "version": "20240320000000",
      "applied": 1710892800000,
      "name": "add_membership_level"
    },
    {
      "idx": 2,
      "version": "20250316160229",
      "applied": 1710892800000,
      "name": "add_merchandise_models"
    },
    {
      "idx": 3,
      "version": "20250327160000",
      "applied": 1711555200000,
      "name": "add_order_model"
    }
  ]
}' > prisma/migrations/migration_lock.json 