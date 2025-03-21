# TapPass Data Migration Plan

## Overview
This document outlines the plan for migrating existing TapPass data from the old schema to the new schema.

## Current Schema
```prisma
model TapPassMember {
  id          String  @id @default(cuid())
  memberId    String
  memberSince String
  tier        String
  points      Int
  visits      Int
  lastVisit   String?
}

model TapPassFormData {
  id           String  @id @default(cuid())
  name         String
  email        String  @unique
  birthday     String
  phoneNumber  String
  agreeToTerms Boolean
}
```

## Target Schema
```prisma
model Member {
  id            String   @id @default(cuid())
  memberId      String   @unique
  name          String
  email         String   @unique
  phoneNumber   String
  birthday      DateTime
  agreeToTerms  Boolean
  membershipLevel String @default("BRONZE")
  joinDate      DateTime @default(now())
  points        Int      @default(0)
  visits        Int      @default(0)
  lastVisit     DateTime?
  visitHistory  Visit[]
}

model Visit {
  id        String   @id @default(cuid())
  memberId  String
  member    Member   @relation(fields: [memberId], references: [id])
  visitDate DateTime @default(now())
  points    Int      @default(0)
  amount    Float    @default(0)

  @@index([memberId])
}
```

## Migration Steps

### 1. Backup Current Data
```sql
-- Backup existing tables
CREATE TABLE tap_pass_member_backup AS SELECT * FROM "TapPassMember";
CREATE TABLE tap_pass_form_data_backup AS SELECT * FROM "TapPassFormData";
```

### 2. Create Migration Script
```typescript
// scripts/migrate-tappass-data.ts
import { PrismaClient } from '@prisma/client';
import { parse } from 'date-fns';

const prisma = new PrismaClient();

async function migrateData() {
  // Get all form data
  const formData = await prisma.tapPassFormData.findMany();
  
  for (const form of formData) {
    // Find corresponding member data
    const memberData = await prisma.tapPassMember.findFirst({
      where: { memberId: form.id }
    });

    // Create new member record
    const newMember = await prisma.member.create({
      data: {
        memberId: form.id,
        name: form.name,
        email: form.email,
        phoneNumber: form.phoneNumber,
        birthday: parse(form.birthday, 'yyyy-MM-dd', new Date()),
        agreeToTerms: form.agreeToTerms,
        membershipLevel: memberData?.tier || 'BRONZE',
        joinDate: parse(memberData?.memberSince || new Date().toISOString(), 'yyyy-MM-dd', new Date()),
        points: memberData?.points || 0,
        visits: memberData?.visits || 0,
        lastVisit: memberData?.lastVisit ? parse(memberData.lastVisit, 'yyyy-MM-dd', new Date()) : null
      }
    });

    // Create initial visit record if member has points
    if (memberData?.points > 0) {
      await prisma.visit.create({
        data: {
          memberId: newMember.id,
          visitDate: newMember.joinDate,
          points: memberData.points,
          amount: 0 // We don't have historical amount data
        }
      });
    }
  }
}

migrateData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### 3. Verification Steps
1. Count records before and after migration
2. Verify all required fields are populated
3. Check for any data inconsistencies
4. Verify relationships are maintained

### 4. Rollback Plan
```sql
-- Restore from backup if needed
DROP TABLE IF EXISTS "Member" CASCADE;
DROP TABLE IF EXISTS "Visit" CASCADE;
CREATE TABLE "TapPassMember" AS SELECT * FROM tap_pass_member_backup;
CREATE TABLE "TapPassFormData" AS SELECT * FROM tap_pass_form_data_backup;
```

## Implementation Order
1. Create backup tables
2. Run migration script in staging environment
3. Verify data integrity
4. Deploy schema changes
5. Run migration in production
6. Verify production data
7. Remove backup tables after successful verification

## Testing Plan
1. Test migration script with sample data
2. Verify all member data is preserved
3. Check visit history is correctly created
4. Test member lookup functionality
5. Verify admin interface works with new schema

## Rollout Strategy
1. Deploy to staging first
2. Run migration on staging
3. Verify staging functionality
4. Schedule production maintenance window
5. Deploy to production
6. Run migration
7. Verify production functionality
8. Monitor for any issues
9. Remove backup tables after 1 week

## Success Criteria
1. All existing member data is preserved
2. No data loss during migration
3. All relationships are maintained
4. Application functionality works as expected
5. No performance degradation
6. No errors in logs
7. All tests pass

## Monitoring
1. Monitor database performance
2. Watch for any errors in logs
3. Track application metrics
4. Monitor user-reported issues
5. Keep backup tables for 1 week 