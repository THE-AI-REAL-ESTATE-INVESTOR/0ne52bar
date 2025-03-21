# TapPass Prisma Implementation Issue

## Problem
The TapPass functionality was failing in production due to incorrect Prisma model implementation and client initialization. The main issues were:

1. Incorrect model names in schema (`TapPassMember` instead of `Member`)
2. Multiple Prisma client instances being created
3. Missing Visit model for tracking member visits
4. Type mismatches in admin interface

## Solution
1. Updated Prisma schema with correct models:
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

2. Implemented Prisma client singleton pattern in `src/lib/prisma.ts`:
   ```typescript
   import { PrismaClient } from '@prisma/client';

   const globalForPrisma = globalThis as unknown as {
     prisma: PrismaClient | undefined;
   };

   export const prisma = globalForPrisma.prisma ?? new PrismaClient();

   if (process.env.NODE_ENV !== 'production') {
     globalForPrisma.prisma = prisma;
   }
   ```

3. Created proper server actions in `src/app/actions/member-actions.ts`:
   - `listMembers`: Get paginated list of members with visit history
   - `getMemberById`: Get single member with visit history
   - `updateMember`: Update member details
   - `deleteMember`: Delete a member

4. Updated admin interface to use new models and actions

## Testing
1. Verified build succeeds with new implementation
2. Confirmed TapPass functionality works:
   - Member lookup by email
   - Member registration
   - Visit tracking
   - Admin interface

## Migration Steps
1. Run Prisma migration:
   ```bash
   npx prisma migrate dev --name update_tappass_models
   ```

2. Regenerate Prisma client:
   ```bash
   npx prisma generate
   ```

3. Rebuild application:
   ```bash
   npm run build
   ```

## Future Considerations
1. Add data migration script for existing TapPass members
2. Implement proper error handling for edge cases
3. Add validation for member data
4. Consider adding indexes for frequently queried fields
5. Add proper logging for production debugging

## Related Files
- `prisma/schema.prisma`
- `src/lib/prisma.ts`
- `src/app/actions/member-actions.ts`
- `src/app/admin/tappass/page.tsx`
- `src/app/tappass/page.tsx`
- `src/app/tappass/actions.ts` 