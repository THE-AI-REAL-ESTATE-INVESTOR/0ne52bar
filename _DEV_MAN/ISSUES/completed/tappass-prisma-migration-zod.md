# GitHub Issue: Implement Prisma Database for TapPass

## Description

The current TapPass implementation uses an in-memory Map for data storage, causing data persistence issues during server restarts. This issue proposes migrating to a Prisma-based database solution to provide proper data persistence and query capabilities.

## Current Problems

1. ✅ In-memory storage causes data loss on server restart - FIXED with Prisma implementation
2. ✅ Duplicate action implementations causing confusion - FIXED with consolidated admin-member-actions.ts
3. ✅ No schema validation at the database level - FIXED with Prisma schema
4. ✅ No relationships between data entities - FIXED with proper Prisma relations

## Proposed Changes

- ✅ Implement Prisma ORM with SQLite for development (PostgreSQL for production)
- ✅ Create proper database schema for TapPass members
- ✅ Migrate existing in-memory operations to Prisma client operations
- ✅ Consolidate duplicate action implementations
- ✅ Maintain Zod validation for form inputs
- ✅ Add database seeding for testing

## Technical Details

### Database Schema

```prisma
model Member {
  id             String         @id @default(cuid())
  memberId       String         @unique // ONE52-XXXX-YYYY format
  name           String
  email          String         @unique
  phoneNumber    String?        @unique
  birthday       DateTime
  joinDate       DateTime       @default(now())
  membershipLevel MembershipLevel @default(BRONZE)
  points         Int            @default(0)
  lastVisit      DateTime?
  agreeToTerms   Boolean
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt
  visits         Visit[]        // Relation to visit history
}

model Visit {
  id        String   @id @default(cuid())
  memberId  String
  member    Member   @relation(fields: [memberId], references: [id])
  visitDate DateTime @default(now())
  points    Int     @default(0)
  createdAt DateTime @default(now())
}

enum MembershipLevel {
  BRONZE
  SILVER
  GOLD
}
```

### Implementation Status

#### Completed
1. ✅ Prisma setup and configuration
2. ✅ Database schema creation and migrations
3. ✅ Member registration with database persistence
4. ✅ Member lookup and retrieval
5. ✅ Admin CRUD operations
   - ✅ List all members
   - ✅ Edit member details
   - ✅ Delete members
6. ✅ Points system basic structure
7. ✅ Visit tracking structure

#### In Progress
1. 🟡 Points calculation rules
2. 🟡 Membership level upgrade logic
3. 🟡 Visit history display

#### Pending
1. ⭕ Rewards system implementation
2. ⭕ Member statistics and reporting
3. ⭕ Advanced filtering and search

## Acceptance Criteria

- [x] Prisma successfully installed and configured
- [x] Database schema created and migrations applied
- [x] Member registration works with database persistence
- [x] Member lookup works after server restart
- [x] Zod validation integrated with Prisma
- [x] Duplicate action implementations consolidated
- [x] Documentation updated with new data flow
- [x] Admin CRUD operations implemented
- [ ] Points system fully implemented
- [ ] Membership upgrade rules implemented

## Resources

- [Prisma with Next.js](https://www.prisma.io/nextjs)
- [Zod integration with Prisma](https://www.prisma.io/blog/zod-x-prisma-MvPD3clXxzX9)

## Next Steps

1. Implement points calculation rules
2. Add membership level upgrade logic
3. Create visit history display
4. Implement rewards system
5. Add member statistics and reporting
6. Enhance search and filtering capabilities 