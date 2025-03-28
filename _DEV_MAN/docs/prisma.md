- For Prisma integration details, see [PRISMA_INTEGRATION.md](./PRISMA_INTEGRATION.md)
- For issue tracking, refer to the [ISSUES](./ISSUES) directory

## Prisma CLI Commands

### Database Schema Synchronization

```mermaid
graph TD
    A[Prisma Schema File] -->|schema.prisma| B[Prisma Client]
    C[Database] -->|db pull| A
    A -->|db push| C
    A -->|generate| D[TypeScript Types]
    D -->|Used by| E[Application Code]
    
    subgraph "Development Flow"
        F[Developer] -->|Modifies| A
        F -->|Runs| G[CLI Commands]
        G -->|npx prisma db pull| C
        G -->|npx prisma generate| D
        G -->|npx prisma db push| C
    end
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style C fill:#bbf,stroke:#333,stroke-width:2px
    style D fill:#bfb,stroke:#333,stroke-width:2px
```

#### Key Commands Explained

1. **`npx prisma db pull`**
   - Reads the current database schema
   - Updates `schema.prisma` file to match the database
   - Useful when database changes are made outside Prisma
   - Helps maintain schema synchronization

2. **`npx prisma generate`**
   - Creates TypeScript types from schema
   - Updates Prisma Client with latest schema
   - Required after schema changes

3. **`npx prisma db push`**
   - Pushes schema changes to database
   - Updates database structure to match schema
   - Used for development and prototyping

4. **`npx prisma migrate dev`**
   - Creates migration files
   - Applies migrations to database
   - Regenerates Prisma Client
   - Used for production-ready changes

#### Common Use Cases

- **Schema Synchronization**: When database changes are made outside Prisma
- **Type Generation**: After schema modifications
- **Development**: Quick schema updates during development
- **Production**: Safe database schema changes with migrations 