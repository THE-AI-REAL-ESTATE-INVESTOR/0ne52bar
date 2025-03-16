# TapPass Migration Steps

This document provides a detailed step-by-step guide for migrating the TapPass module from in-memory storage to Prisma database.

## Step 1: Set Up Git Branch

```bash
# Create and checkout new feature branch
git checkout -b feature/tappass-prisma

# Verify current branch
git branch
```

## Step 2: Initialize Prisma

```bash
# Generate Prisma client based on schema
npx prisma generate

# Push schema to the database
npx prisma db push

# Seed the database with test data (if needed)
npx prisma db seed
```

## Step 3: Migrate Server Actions

```bash
# Rename the current in-memory implementation for reference
mv ./src/app/tappass/actions.ts ./src/app/tappass/actions-memory.ts

# Rename the Prisma implementation to be the primary one
mv ./src/app/tappass/actions-prisma.ts ./src/app/tappass/actions.ts
```

## Step 4: Test the Migration

1. Start the development server:
   ```bash
   pnpm run dev
   ```

2. Test member registration:
   - Access the TapPass registration form
   - Register a new member
   - Verify success message and member ID

3. Test member lookup:
   - Look up existing member by email
   - Look up existing member by phone number

4. Verify data persistence:
   - Stop the development server
   - Restart the server
   - Verify that member data is still accessible

5. Test error handling:
   - Try registering with existing email/phone
   - Try registering with invalid data
   - Verify proper error messages

## Step 5: Update Components (if needed)

If the components are expecting specific data formats, update them to work with the Prisma-backed implementation:

1. Review all components using TapPass actions
2. Update any components that might need adjustments
3. Test each component for proper functionality

## Step 6: Database Administration

Set up administrative tools for database management:

```bash
# Launch Prisma Studio for database administration
npx prisma studio
```

## Step 7: Implement Enhanced Features

With the database backend in place, implement enhanced features:

1. Visit Tracking:
   - Create UI for recording member visits
   - Use `memberService.recordVisit()` to save visits

2. Reward Management:
   - Create UI for generating rewards
   - Implement reward redemption

3. Admin Dashboard:
   - Create admin interface for member management
   - Implement member search and filtering

## Step 8: Production Preparation

Before deploying to production:

1. Review schema for optimization opportunities
2. Add proper database indexes for performance
3. Implement appropriate caching strategies
4. Test with production-like data volumes

## Step 9: Documentation

Update documentation to reflect the new implementation:

1. Update API documentation
2. Document database schema
3. Document admin procedures
4. Update developer guides

## Step 10: Code Cleanup

Remove any unnecessary code:

1. Delete temporary reference files (actions-memory.ts)
2. Remove commented-out code
3. Clean up console.log statements
4. Run linter to identify any issues

## Step 11: Commit Changes

```bash
# Add all changes
git add .

# Commit with descriptive message
git commit -m "feat(tappass): migrate to Prisma database"

# Push to remote repository
git push -u origin feature/tappass-prisma
```

## Troubleshooting

- **Database Connection Issues**: Verify DATABASE_URL in .env.local
- **Schema Errors**: Check Prisma schema for any inconsistencies
- **Migration Failures**: Review Prisma migration logs
- **Type Errors**: Ensure types are properly defined and used

## Rollback Plan

If issues are encountered during the migration:

1. Revert to the in-memory implementation:
   ```bash
   mv ./src/app/tappass/actions.ts ./src/app/tappass/actions-prisma.ts
   mv ./src/app/tappass/actions-memory.ts ./src/app/tappass/actions.ts
   ```

2. Switch back to the main branch:
   ```bash
   git checkout main
   ```

3. Discard changes:
   ```bash
   git branch -D feature/tappass-prisma
   ``` 