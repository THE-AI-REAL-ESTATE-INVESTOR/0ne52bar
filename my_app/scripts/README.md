# Scripts Directory

This directory contains various scripts used for development, testing, and production of the ONE-52 Bar & Grill application. The scripts are organized into categories to make it easier to understand their purpose and when they should be used.

## Directory Structure

- **`database/`** - Scripts for database management and data migration
- **`dev-only/`** - Development-only scripts that should NOT be included in production
- **`documentation/`** - Scripts for generating documentation and guides
- **`production/`** - Scripts that may be needed in production
- **`schema-management/`** - Scripts for Prisma schema management
- **`testing/`** - Scripts for test setup and execution

## Database Scripts

Scripts for database operations, migrations, and seeding:

| Script | Description | Production? |
|--------|-------------|-------------|
| `migrate-members.js` | Migrates members from JSON to Prisma database | No |
| `migrate-members-to-prisma.ts` | TypeScript version of migration script | No |
| `seed-merchandise.js` | Seeds the database with merchandise data | Yes (modified) |
| `test-db-connection.ts` | Tests database connection | No |
| `test-database-connections.ts` | Tests various database connections | No |
| `analyze-database-needs.ts` | Analyzes application for database requirements | No |

## Development-Only Scripts

These scripts are for development purposes only and should NOT be deployed to production:

| Script | Description | Production? |
|--------|-------------|-------------|
| `clean-git.ts` | Cleans up Git repository |
| `clean-git.sh` | Shell script for Git cleanup |
| `fix-css-build.js` | Fixes CSS build issues |
| `fix-dependencies.ts` | Fixes dependency issues |
| `update-package-json.js` | Updates package.json |
| `install-all-dependencies.sh` | Installs all dependencies |
| `migrate-tappass.sh` | Script for TapPass migration |
| `prisma-integration.ts` | Script for Prisma integration |
| `prisma-fix.js` | Fixes Prisma-related issues |
| `dev-only/find-duplicate-scripts.js` | Analyzes the scripts directory to find duplicate or similar scripts. Helps maintain a clean codebase by identifying redundant code. | No |

## Documentation Scripts

Scripts for generating documentation and guides:

| Script | Description | Production? |
|--------|-------------|-------------|
| `generate-diagrams.ts` | Generates Mermaid diagrams from code | No |
| `generate-diagrams.mjs` | ESM version of diagram generator | No |
| `CRUD-GUIDE.md` | Guide for implementing CRUD operations | No |
| `JEST-TESTING-GUIDE.md` | Guide for setting up and running Jest tests | No |

## Production Scripts

Scripts that may be needed in production:

| Script | Description | Production? |
|--------|-------------|-------------|
| `generate-model-actions.ts` | Generates server actions for models | Yes (during build) |
| `implementation-plan.md` | Plan for feature implementation | No |

## Schema Management Scripts

Scripts for managing the Prisma schema:

| Script | Description | Production? |
|--------|-------------|-------------|
| `generate-prisma-schema.ts` | Generates Prisma schema from TypeScript | Yes (during build) |
| `verify-schema.ts` | Verifies Prisma schema validity | No |
| `validate-prisma-schema.js` | Validates Prisma schema and identifies unused models | No |

## Testing Scripts

Scripts for testing setup and execution:

| Script | Description | Production? |
|--------|-------------|-------------|
| `setup-jest.sh` | Sets up Jest for testing | No |
| `test-watcher.js` | Watches files for changes and runs tests | No |
| `validate-tappass-types.ts` | Validates TapPass TypeScript types | No |

## Usage Guidelines

1. **Development Scripts**: Use these during development to automate common tasks.
2. **Production Scripts**: Scripts marked as "Yes" for Production may be needed during build or deployment.
3. **Schema Management**: Run these when making changes to data models to keep schema in sync.
4. **Testing**: Use these scripts to set up and run tests.

### Using the Duplicate Script Finder

The duplicate script finder helps identify redundant or similar scripts in the codebase:

```bash
# Run with default similarity threshold (0.7)
node dev-only/find-duplicate-scripts.js

# Run with custom similarity threshold
node dev-only/find-duplicate-scripts.js --threshold=0.8

# Show help
node dev-only/find-duplicate-scripts.js --help
```

This tool is useful for:
- Identifying exact duplicates (100% match)
- Finding similar scripts that might be consolidated
- Maintaining a clean and efficient scripts directory

## Production Deployment

When preparing for production deployment:

1. Only copy scripts marked as "Yes" in the "Production?" column
2. Make sure all development-only scripts are excluded from the production build
3. For seeding scripts, create production-specific versions with appropriate data

## Maintenance

When adding new scripts:

1. Place them in the appropriate category directory
2. Update this README.md file with a description
3. Indicate whether they are needed in production
4. Add appropriate documentation and usage examples 