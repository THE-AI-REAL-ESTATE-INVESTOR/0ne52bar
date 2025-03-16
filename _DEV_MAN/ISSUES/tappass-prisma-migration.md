# GitHub Issue: Implement Prisma Database for TapPass

## Description

The current TapPass implementation uses an in-memory Map for data storage, causing data persistence issues during server restarts. This issue proposes migrating to a Prisma-based database solution to provide proper data persistence and query capabilities.

## Current Problems

1. In-memory storage causes data loss on server restart
2. Duplicate action implementations causing confusion (app/actions.ts vs app/tappass/actions.ts)
3. No schema validation at the database level
4. No relationships between data entities

## Proposed Changes

- Implement Prisma ORM with SQLite for development (PostgreSQL for production)
- Create proper database schema for TapPass members
- Migrate existing in-memory operations to Prisma client operations
- Consolidate duplicate action implementations
- Maintain Zod validation for form inputs
- Add database seeding for testing

## Technical Details

### Database Schema

```prisma
model Member {
  id            String   @id @default(cuid())
  memberId      String   @unique // ONE52-XXXX-YYYY format
  name          String
  email         String   @unique
  phoneNumber   String   @unique
  birthday      DateTime
  joinDate      DateTime @default(now())
  membershipLevel String  // BRONZE, SILVER, GOLD, PLATINUM
  agreeToTerms  Boolean
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### Implementation Plan

1. Install Prisma dependencies
2. Initialize Prisma with SQLite for development
3. Create database schema
4. Generate Prisma client
5. Create database service files
6. Update server actions to use Prisma
7. Add seeding script for development
8. Update tests

## Acceptance Criteria

- [ ] Prisma successfully installed and configured
- [ ] Database schema created and migrations applied
- [ ] Member registration works with database persistence
- [ ] Member lookup works after server restart
- [ ] Zod validation integrated with Prisma
- [ ] Duplicate action implementations consolidated
- [ ] Documentation updated with new data flow

## Resources

- [Prisma with Next.js](https://www.prisma.io/nextjs)
- [Zod integration with Prisma](https://www.prisma.io/blog/zod-x-prisma-MvPD3clXxzX9) 