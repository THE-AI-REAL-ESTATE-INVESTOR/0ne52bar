# Prisma Database Troubleshooting Guide

## Current Situation
- We had a working database with menu items
- Recent changes have caused data loss
- Seeding attempts aren't persisting data

## How Prisma Works
1. **Schema Definition** (`schema.prisma`)
   - Defines our database structure
   - Contains models (tables) and their relationships
   - Located in `my_app/prisma/schema.prisma`

2. **Database URL** (`.env`)
   - Tells Prisma where our database is
   - Currently using Prisma Accelerate: `DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=..."`

3. **Migrations**
   - Track database structure changes
   - Located in `my_app/prisma/migrations`
   - Created with `npx prisma migrate dev`

4. **Seeding** (`seed.ts`)
   - Populates database with initial data
   - Run with `npx prisma db seed`
   - Must be in `my_app` directory to run

## Common Issues
1. **Wrong Directory**
   - Always run Prisma commands from `my_app` directory
   - Not from `152bar` or `prisma` directories

2. **Data Loss Scenarios**
   - `prisma migrate reset` - Wipes database and reapplies migrations
   - `prisma db push` - Can cause data loss if schema changes
   - Our seed script has `deleteMany()` which clears existing data

3. **Connection Issues**
   - Prisma Accelerate vs direct connection
   - Need proper API key in .env
   - Need to be in correct directory

## Recovery Steps
1. Check Current State:
   ```bash
   cd my_app
   npx prisma studio
   ```

2. If No Data:
   ```bash
   cd my_app
   npx prisma db seed
   ```

3. If Still No Data:
   ```bash
   cd my_app
   npx prisma migrate reset --skip-seed
   npx prisma db seed
   ```

## Prevention
1. Always run commands from `my_app` directory
2. Backup data before schema changes
3. Remove `deleteMany()` from seed script if you want to preserve data
4. Use `upsert` instead of `create` to update existing records

## Next Steps
1. Review git history to find last working state
2. Consider restoring from backup if available
3. Modify seed script to preserve existing data

## Database Recovery Workflow

```mermaid
graph TB
    A[Current State<br/>Missing Menu Items] -->|1. Find Working Commit| B[Git History]
    B -->|2. Checkout| C[Last Working State]
    C -->|3. Reset DB| D[Clean Database]
    D -->|4. Run Migrations| E[DB Structure]
    E -->|5. Seed Data| F[Working Data]
    F -->|6. Create New Branch| G[Feature Branch]
    G -->|7. Add New Features| H[New Changes]
    H -->|8. Test| I{Working?}
    I -->|Yes| J[Merge to Main]
    I -->|No| G
    
    subgraph "Recovery Process"
        B
        C
        D
        E
        F
    end

    subgraph "New Feature Process"
        G
        H
        I
        J
    end
```

## Step-by-Step Recovery Process

1. **Find Last Working Commit**
   ```bash
   git log --oneline
   # Find commit where menu items were working
   ```

2. **Checkout Working State**
   ```bash
   git checkout <commit-hash>
   ```

3. **Reset Database**
   ```bash
   cd my_app
   npx prisma migrate reset
   ```

4. **Verify Data**
   ```bash
   npx prisma studio
   ```

5. **Create New Branch**
   ```bash
   git checkout -b feature/menu-status
   ```

## Database Operations Flow

```mermaid
sequenceDiagram
    participant G as Git
    participant P as Prisma
    participant DB as Database
    
    G->>P: 1. Checkout Working Commit
    P->>DB: 2. Reset Database
    P->>DB: 3. Run Migrations
    P->>DB: 4. Seed Initial Data
    Note over G,DB: Database Now in Known Good State
    
    G->>P: 5. Create Feature Branch
    P->>DB: 6. Make Schema Changes
    P->>DB: 7. Update Seed Data
    P->>DB: 8. Test Changes
    
    alt Success
        P->>G: Commit Changes
        G->>G: Merge to Main
    else Failure
        G->>G: Reset to Working State
        P->>DB: Reset Database
    end
```

## Current Recovery Plan

1. **Find Last Working State**
   - Look for commit where menu items were working
   - This was before we added the `status` field

2. **Reset to Working State**
   ```bash
   git checkout <working-commit>
   cd my_app
   npx prisma migrate reset
   npx prisma db seed
   ```

3. **Verify Data**
   - Check Prisma Studio
   - Verify menu items exist

4. **Create Feature Branch**
   ```bash
   git checkout -b feature/add-menu-status
   ```

5. **Implement Changes**
   - Add status field
   - Update seed script
   - Test changes

## Prevention
1. Always create feature branches for schema changes
2. Test migrations on development database first
3. Backup data before schema changes
4. Use `upsert` instead of `create` to preserve data

## CRUD Operations
```mermaid
graph LR
    A[Schema Change] -->|1. Create Migration| B[Migration File]
    B -->|2. Apply| C[Database]
    C -->|3. Generate| D[Prisma Client]
    D -->|4. Use In| E[Seed Script]
    E -->|5. Creates| F[Menu Items]
    
    subgraph "Data Operations"
        G[Create] -->|upsert| H[Existing Data]
        I[Read] -->|findMany| H
        J[Update] -->|update| H
        K[Delete] -->|soft delete| H
    end
```

Remember:
- Each schema change needs a migration
- Migrations should be reversible
- Always test on development first
- Keep backup of production data 

## Current Issue: Schema and Data Mismatch
The error indicates a schema mismatch between our code and database. Here's what happened:

```mermaid
sequenceDiagram
    participant WB as Working Branch (59ffc95)
    participant DB as Database
    participant CB as Current Branch (menu-crud)
    
    Note over WB,DB: Step 1: Restored Working State
    WB->>DB: Seeded menu items successfully
    DB-->>WB: Data stored without imageUrl & status fields
    
    Note over CB,DB: Step 2: Switched to menu-crud Branch
    CB->>DB: Tries to query with new schema
    DB-->>CB: Error: imageUrl column doesn't exist!
    
    Note over WB,CB: The Problem
    WB->>CB: Schema evolved (added imageUrl, status)
    CB->>DB: Code expects new fields
    DB-->>CB: But DB has old schema
```

### What's Happening
```mermaid
graph TD
    A[Database State] -->|Has| B[Menu Items]
    B -->|Without| C[imageUrl field]
    B -->|Without| D[status field]
    
    E[Code State] -->|Expects| F[Menu Items]
    F -->|With| G[imageUrl field]
    F -->|With| H[status field]
    
    I[The Mismatch] -->|Causes| J[Prisma Error]
```

### Potential Solutions
```mermaid
graph LR
    A[Current State] -->|Option 1| B[Push Schema Changes]
    A -->|Option 2| C[Modify Queries]
    
    B -->|Safe Method| D[Add Nullable Fields]
    B -->|Risk| E[Data Loss if Wrong]
    
    C -->|Temporary| F[Remove New Fields]
    C -->|Then| G[Gradual Migration]
```

### Recommended Recovery Plan
```mermaid
sequenceDiagram
    participant DB as Database
    participant SC as Schema
    participant CD as Code
    
    Note over DB,CD: Phase 1: Safe Query
    CD->>SC: Modify queries to use only existing fields
    SC->>DB: Query works, menu items visible
    
    Note over DB,CD: Phase 2: Schema Update
    SC->>DB: Add new columns as nullable
    DB-->>SC: Schema updated safely
    
    Note over DB,CD: Phase 3: Data Migration
    CD->>DB: Update existing records
    DB-->>CD: Data preserved with new fields
```

### Key Points
1. Your menu data is safe in the database
2. The error is because the code expects fields that don't exist yet
3. We need to align the schema without losing data
4. The solution needs to be incremental to preserve existing data

Would you like me to propose a specific solution based on these analyses? 