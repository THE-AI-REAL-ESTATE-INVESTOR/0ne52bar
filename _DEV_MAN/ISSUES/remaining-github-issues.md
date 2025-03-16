# Remaining GitHub Issues

## TapPass Feature Completion

### ✅ Issue 1: Migrate TapPass Server Actions to Prisma - COMPLETED

**Description:**
The TapPass feature currently uses in-memory storage for member data, causing all data to be lost on server restart. This issue tracks the migration of server actions to use the Prisma database for persistent storage.

**Current Status:**
- ✅ Database schema is in place
- ✅ Models are defined in Prisma
- ✅ Implementation uses Prisma for all operations

**Completed Tasks:**
- ✅ Update `registerTapPassMember` to use Prisma
- ✅ Update `getMemberByEmail` to use Prisma
- ✅ Update `getMemberByPhone` to use Prisma
- ✅ Update `emailMembershipCard` to use Prisma
- ✅ Test data persistence across server restarts
- ✅ Implement proper error handling

**Documentation:**
- ✅ Completion report: `_DEV_MAN/ISSUES/completed/tappass-prisma-migration-complete.md`
- ✅ Verification tests: `_tests/tappass/tappass-prisma-verification.test.ts`

**Priority:** ~~High~~ COMPLETED

---

### Issue 2: Integrate Zod Validation with Prisma

**Description:**
The current implementation has separate Zod validation and database access layers. This issue tracks the integration of these layers to ensure consistent validation and type safety.

**Current Status:**
- ✅ Zod schemas defined for form validation
- ✅ Prisma models defined for database access
- 🔄 Partial integration between the two

**Tasks:**
- [ ] Create Zod schemas that align with Prisma models
- [ ] Implement validation middleware for server actions
- [ ] Add Zod validation to Prisma inputs
- [ ] Update client-side validation to match

**Priority:** Medium

---

### ✅ Issue 3: Enhance TapPass with Visit Tracking - COMPLETED

**Description:**
Now that we have a persistent database, we should implement visit tracking functionality for TapPass members.

**Current Status:**
- ✅ Basic member data is stored
- ✅ Visit tracking implemented

**Completed Tasks:**
- ✅ Create Visit model in TypeScript/Prisma
- ✅ Implement UI for recording visits
- ✅ Create server action for adding visits
- ✅ Add visit history display to member profile
- ✅ Implement points calculation based on visits

**Documentation:**
- ✅ Functionality documented in `_DEV_MAN/ISSUES/completed/tappass-prisma-implementation-complete.md`

**Priority:** ~~Medium~~ COMPLETED

---

### ✅ Issue 4: Implement Merchandise Management System - COMPLETED

**Description:**
Create a full CRUD system for managing merchandise items and categories, with a customer-facing display that shows items as "Coming Soon".

**Current Status:**
- ✅ Database schema is in place
- ✅ Models are defined in Prisma
- ✅ Full CRUD operations implemented
- ✅ Admin interface created
- ✅ Customer-facing display implemented

**Completed Tasks:**
- ✅ Create Merchandise and MerchandiseCategory models
- ✅ Implement CRUD operations for categories
- ✅ Implement CRUD operations for items
- ✅ Create admin interface with tabs for categories and items
- ✅ Add form validation with Zod
- ✅ Implement image upload support
- ✅ Create customer-facing display with "Coming Soon" status
- ✅ Add data seeding script

**Documentation:**
- ✅ Completion report: `_DEV_MAN/ISSUES/completed/merchandise-implementation-complete.md`
- ✅ Server actions: `src/actions/merchandiseActions.ts`
- ✅ Admin UI: `src/app/admin/merchandise/`
- ✅ Customer UI: `src/app/merch/page.tsx` and `src/components/Merch.tsx`

**Priority:** ~~High~~ COMPLETED

---

## Developer Experience Improvements

### Issue 5: Consolidate Development Documentation

**Description:**
Development documentation is currently spread across multiple files and locations. This issue tracks the consolidation and organization of this documentation.

**Current Status:**
- ✅ Documentation in both `/my_app/_DEV_MAN` and `/_DEV_MAN`
- 🔄 Some duplicate information
- 🔄 Structure being improved

**Tasks:**
- ✅ Move completed documentation to `completed` folder
- ✅ Create verification tests for completed features
- [ ] Organize by feature/component
- [ ] Create an index/README for navigation
- [ ] Remove duplicate or outdated information
- [ ] Add missing documentation for recent features

**Priority:** Low

---

### Issue 6: Improve Error Handling and Reporting

**Description:**
The current error handling is inconsistent across the application. This issue tracks the implementation of a comprehensive error handling strategy.

**Current Status:**
- 🔄 Basic try/catch blocks in server actions
- 🔄 Inconsistent error formats
- 🔄 Limited client-side error handling

**Tasks:**
- [ ] Create standardized error types and formats
- [ ] Implement consistent error handling in server actions
- [ ] Add client-side error handling components
- [ ] Improve error messages for better user experience
- [ ] Add error logging for debugging

**Priority:** Medium

---

## Production Readiness

### Issue 7: Clean Up Prisma Schema - NEW

**Description:**
The current Prisma schema contains many test models generated by the TypeScript-to-Prisma generator. These models need to be removed and the schema organized for production.

**Current Status:**
- ✅ Core application models are defined
- ❌ Test models still present
- ❌ Documentation inconsistent

**Tasks:**
- [ ] Remove all models with `Test` prefix
- [ ] Organize models by feature
- [ ] Add proper documentation to models and fields
- [ ] Add appropriate indexes for performance
- [ ] Ensure consistent naming conventions

**Documentation:**
- ✅ Cleanup plan: `my_app/PRISMA_CLEANUP_PLAN.md`

**Priority:** High

---

### Issue 8: Implement Events System - NEW

**Description:**
Complete the Events system which currently has models but lacks UI and server actions.

**Current Status:**
- ✅ Database models created
- ❌ Server actions not implemented
- ❌ Admin UI not created
- ❌ Customer-facing calendar not implemented
- ❌ RSVP functionality not implemented

**Tasks:**
- [ ] Create server actions for event management
- [ ] Implement admin interface for events
- [ ] Create event calendar for customer view
- [ ] Add RSVP functionality
- [ ] Implement attendee management

**Documentation:**
- ✅ Implementation plan: `my_app/EVENTS_IMPLEMENTATION_PLAN.md`

**Priority:** High

---

### Issue 9: Implement Caching Strategy

**Description:**
The application currently has no caching strategy, which could lead to performance issues in production. This issue tracks the implementation of a proper caching strategy.

**Current Status:**
- ❌ No caching implemented
- ❌ Potential for redundant database queries
- ❌ No CDN integration for static assets

**Tasks:**
- [ ] Identify cacheable data and operations
- [ ] Implement React Query for client-side caching
- [ ] Add server-side caching for frequent queries
- [ ] Configure CDN for static assets
- [ ] Add cache invalidation strategies

**Priority:** Medium

---

### Issue 10: Security Audit and Enhancements

**Description:**
Before going to production, we need to conduct a comprehensive security audit and implement any necessary enhancements.

**Current Status:**
- ❌ Basic authentication not in place
- ❌ No CSRF protection
- ❌ Limited input validation
- ❌ No rate limiting

**Tasks:**
- [ ] Conduct security audit
- [ ] Implement CSRF protection
- [ ] Add rate limiting for sensitive endpoints
- [ ] Review and enhance input validation
- [ ] Secure environment variables and secrets
- [ ] Implement proper authentication flows

**Priority:** High

---

### Issue 11: Performance Optimization

**Description:**
The application needs performance optimization before going to production. This issue tracks the identification and implementation of performance improvements.

**Current Status:**
- ❌ No performance testing done
- ❌ Potential inefficient database queries
- ❌ Large bundle sizes
- ❌ No code splitting

**Tasks:**
- [ ] Conduct performance testing
- [ ] Optimize database queries and add indexes
- [ ] Implement code splitting
- [ ] Optimize bundle sizes
- [ ] Add image optimization
- [ ] Implement lazy loading for non-critical components

**Priority:** Medium 