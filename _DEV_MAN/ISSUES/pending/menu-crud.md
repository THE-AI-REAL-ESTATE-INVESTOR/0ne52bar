# Menu CRUD Implementation Plan

## Current State Analysis

### Existing Components and Files

1. **Menu Actions**
   - `src/actions/menu-actions.ts`: Server actions for menu operations
   - `src/actions/menuActions.ts`: Duplicate file with similar functionality (needs consolidation)

2. **Menu Components**
   - `src/components/menu/MenuDisplay.tsx`: Displays menu items
   - `src/components/menu/MenuSkeleton.tsx`: Loading state component
   - `src/components/MenuOrderSystem.tsx`: Order management system
   - `src/components/MenuStyles.tsx`: Global menu styles

3. **Menu Pages**
   - `src/app/menu/page.tsx`: Public menu page

### Current Issues

1. **Type Inconsistencies**
   - Missing `types/menu.ts` for shared types
   - Type mismatches between components and actions
   - Duplicate menu action files with different implementations

2. **Missing Admin Interface**
   - No admin CRUD interface for menu management
   - No category management interface
   - No proper separation between admin and public actions

3. **Order System Limitations**
   - No member tracking for orders
   - No guest checkout handling
   - No order persistence

## Implementation Plan

### Phase 1: Type System and Schema Cleanup

1. **Create Types**
   ```typescript
   // src/types/menu.ts
   export interface MenuItem {
     id: string;
     name: string;
     price: string;
     description?: string;
     categoryId: string;
     isActive: boolean;
     sortOrder: number;
     category?: Category;
   }

   export interface Category {
     id: string;
     name: string;
     description?: string;
     sortOrder: number;
   }

   export interface OrderItem {
     menuItem: MenuItem;
     quantity: number;
   }

   export interface Order {
     id: string;
     memberId?: string;
     items: OrderItem[];
     total: number;
     status: 'pending' | 'completed' | 'cancelled';
     createdAt: Date;
   }
   ```

2. **Consolidate Actions**
   - Merge `menu-actions.ts` and `menuActions.ts` into:
     - `src/actions/menu/public.ts`: Public menu actions
     - `src/actions/menu/admin.ts`: Admin menu actions
   - Ensure proper type usage and error handling

### Phase 2: Admin Interface

1. **Create Admin Menu Page**
   ```
   src/app/admin/menu/
   ├── page.tsx
   ├── loading.tsx
   ├── error.tsx
   ├── components/
   │   ├── MenuItemForm.tsx
   │   ├── CategoryForm.tsx
   │   ├── MenuItemTable.tsx
   │   └── CategoryTable.tsx
   ```

2. **Reuse Existing Components**
   - Copy and modify `MenuDisplay.tsx` for admin view
   - Adapt `MenuSkeleton.tsx` for admin loading states
   - Use shadcn/ui components for forms and tables

### Phase 3: Order System Enhancement

1. **Member Integration**
   - Add member tracking to `MenuOrderSystem.tsx`
   - Implement guest checkout flow
   - Add order persistence

2. **Order Management**
   - Create order history for members
   - Add order status tracking
   - Implement order notifications

## Best Practices Implementation

1. **Database Operations**
   - Use Prisma for all database operations
   - Create migrations before schema changes
   - Implement proper error handling
   - Use transactions for complex operations

2. **Type Safety**
   - Use TypeScript interfaces for all components
   - Implement Zod schemas for validation
   - Keep types in sync with Prisma schema

3. **Component Architecture**
   - Use Server Components by default
   - Add 'use client' only when needed
   - Implement proper loading states
   - Use error boundaries

4. **State Management**
   - Use React Server Components for data fetching
   - Implement optimistic updates
   - Use proper caching strategies

## Migration Strategy

1. **Schema Updates**
   ```prisma
   model Order {
     id        String   @id @default(cuid())
     memberId  String?
     member    Member?  @relation(fields: [memberId], references: [id])
     items     Json     // Store order items as JSON
     total     Float
     status    String   @default("pending")
     createdAt DateTime @default(now())
   }
   ```

2. **Data Migration**
   - Create migration script
   - Add rollback capability
   - Test in development environment

## Testing Strategy

1. **Unit Tests**
   - Test menu actions
   - Test form validation
   - Test order calculations

2. **Integration Tests**
   - Test admin CRUD operations
   - Test order flow
   - Test member integration

3. **E2E Tests**
   - Test complete order flow
   - Test admin operations
   - Test error scenarios

## Next Steps

1. Create types/menu.ts
2. Consolidate menu actions
3. Create admin interface
4. Implement order system enhancements
5. Add tests
6. Deploy and monitor

## Notes
- Keep existing components and modify rather than rewrite
- Follow established patterns from TapPass implementation
- Maintain separation of concerns between admin and public
- Use proper error handling and loading states
- Implement proper type safety throughout

## Progress Update - March 24, 2024 11:22 AM

### Completed Features ✅

1. **Admin Interface**
   - Full CRUD operations for menu items and categories
   - Protected admin routes with authentication
   - Form validation with Zod schemas
   - Optimistic updates for better UX
   - Loading and error states

2. **Database Schema**
   - MenuItem model with all necessary fields
   - Category model with proper relations
   - Integration with existing Member model

3. **API Routes**
   - Protected admin endpoints
   - Public menu endpoints
   - Proper error handling and validation

### Next Steps 🎯

1. **Public Menu Enhancement**
   - [ ] Implement member detection on menu page
   - [ ] Add member-specific features (points, rewards)
   - [ ] Create guest checkout flow
   - [ ] Integrate with TapPass member creation

2. **Testing Implementation**
   - [ ] Set up Jest and React Testing Library
   - [ ] Create test directory structure:
     ```
     __tests__/
     ├── components/
     │   └── menu/
     ├── actions/
     │   └── menu/
     └── pages/
         └── menu/
     ```
   - [ ] Write unit tests for:
     - Menu actions
     - Form validation
     - Component rendering
   - [ ] Add integration tests for:
     - CRUD operations
     - Authentication flow
     - Public/Admin access control

3. **Code Consolidation**
   - [ ] Review and merge duplicate menu action files
   - [ ] Clean up unused components
   - [ ] Standardize naming conventions
   - [ ] Update documentation

4. **Database Enhancements**
   - [ ] Add order tracking fields to MenuItem
   - [ ] Create Order model for transaction history
   - [ ] Add member-specific fields for menu interactions
   - [ ] Implement proper indexing for performance

5. **Member Integration**
   - [ ] Add member detection middleware
   - [ ] Implement points system for menu purchases
   - [ ] Create member-specific menu features
   - [ ] Add order history for members

### Testing Strategy Update

1. **Unit Tests**
   ```typescript
   // Example test structure
   describe('Menu Actions', () => {
     describe('getMenuItems', () => {
       it('should return all active menu items')
       it('should handle database errors')
       it('should respect category sorting')
     })
     
     describe('createMenuItem', () => {
       it('should create a new menu item')
       it('should validate input data')
       it('should handle duplicate names')
     })
   })
   ```

2. **Integration Tests**
   ```typescript
   // Example integration test
   describe('Menu Flow', () => {
     it('should allow admin to create and edit menu items')
     it('should display menu items to public users')
     it('should handle member-specific features')
   })
   ```

3. **E2E Tests**
   ```typescript
   // Example E2E test
   describe('Menu Order Flow', () => {
     it('should allow guest checkout')
     it('should create member account after purchase')
     it('should track member points')
   })
   ```

### Implementation Timeline

1. **Week 1 (March 24-31)**
   - Complete testing setup
   - Write core unit tests
   - Begin code consolidation

2. **Week 2 (April 1-7)**
   - Implement public menu enhancements
   - Add member detection
   - Begin guest checkout flow

3. **Week 3 (April 8-14)**
   - Complete member integration
   - Add order tracking
   - Implement points system

4. **Week 4 (April 15-21)**
   - Final testing and bug fixes
   - Documentation updates
   - Performance optimization

### Notes
- Keep existing components until new ones are fully tested
- Maintain backward compatibility during updates
- Follow established patterns from TapPass implementation
- Ensure proper error handling throughout
- Document all new features and changes 