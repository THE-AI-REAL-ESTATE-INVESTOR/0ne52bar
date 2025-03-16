# Prisma Schema Cleanup Plan

## Overview
This document outlines the plan for cleaning up the Prisma schema to remove test models that were automatically generated and organize the remaining models for better maintainability. The goal is to have a clean, well-documented schema that includes only the models actually used in the application.

## Current Status
The current schema includes:
- Core application models (Member, Visit, Reward, etc.)
- Menu-related models (MenuItem, MenuCategory)
- Merchandise models (Merchandise, MerchandiseCategory)
- Event models (Event, EventTag, EventAttendee)
- Test models (TestUser, TestPost, TestProduct, etc.) that were auto-generated

## Cleanup Steps

### 1. Identify Test Models for Removal
The schema contains numerous test models with the `Test` prefix that were generated for testing the schema generator tool. These should be removed as they are not part of the application.

Models to remove:
- `TestTag`
- `TestCategory`
- `TestUser`
- `TestPost`
- `TestComment`
- `TestProduct`
- `TestOrder`
- `TestOrderItem`
- `TestReview`
- `TestAddress`
- `TestPayment`
- `TestSubscription`
- `TestNotification`
- `TestAlert`
- `TestAnalytics`
- `TestSetting`
- And any other models with the `Test` prefix

### 2. Organize Models by Feature

Group related models together in the schema file for better readability:

1. **Core Models**
   - User (future)
   - SiteSettings (future)

2. **TapPass Models**
   - Member
   - Visit
   - Reward
   - MembershipLevel (enum)

3. **Menu Models**
   - MenuCategory
   - MenuItem

4. **Merchandise Models**
   - MerchandiseCategory
   - Merchandise

5. **Event Models**
   - Event
   - EventTag
   - EventAttendee

### 3. Add Documentation

Add clear documentation to each model and relationship:

```prisma
/// Member model for TapPass membership system
/// Stores the core information of each member and their membership details
model Member {
  // Fields with documentation...
}
```

### 4. Review and Optimize Relationships

Ensure all relationships are properly defined:
- One-to-many relationships
- Many-to-many relationships
- Cascading deletes where appropriate

### 5. Add Proper Indexes

Add indexes for fields that are frequently queried:

```prisma
model Member {
  email String @unique @index
  phoneNumber String @unique @index
  // Other fields...
}
```

## Implementation Plan

### Step 1: Create a Backup
```bash
cp prisma/schema.prisma prisma/schema.prisma.backup
```

### Step 2: Remove Test Models
Create a clean version of the schema without test models.

### Step 3: Reorganize Models
Arrange the remaining models by feature group with clear section headers.

### Step 4: Add Documentation
Add comprehensive documentation to each model and field.

### Step 5: Test the Schema
```bash
npx prisma validate
```

### Step 6: Apply Changes
```bash
npx prisma generate
```

## Schema Migration Considerations

Since we are only removing models that are not used in the application, we don't need to create a migration that affects the actual database tables. We can simply:

1. Update the Prisma schema file
2. Regenerate the Prisma client
3. Verify the application still works correctly

## Future Maintenance Guidelines

1. Keep models organized by feature
2. Document all new models thoroughly
3. Consider the impact of schema changes on existing data
4. Add proper indexes for performance optimization
5. Use consistent naming conventions

## Conclusion
Cleaning up the Prisma schema will make the codebase more maintainable and improve the developer experience. By removing unused test models and organizing the remaining models, we ensure that the schema accurately represents the application's data needs and is easier to understand for all developers working on the project. 