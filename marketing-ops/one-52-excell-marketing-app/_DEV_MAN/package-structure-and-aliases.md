# Package Structure and Aliases Best Practices

## Project Structure Overview

```
marketing-ops/
├── packages/
│   └── analyzer/          # Standalone package for Excel analysis
│       ├── src/
│       ├── package.json   # Package-specific configuration
│       └── tsconfig.json  # Package-specific TypeScript config
├── one-52-excell-marketing-app/  # Main application
│   ├── src/
│   ├── package.json      # App-specific configuration
│   └── tsconfig.json     # App-specific TypeScript config
├── package.json          # Root package.json
├── pnpm-workspace.yaml   # Workspace configuration
└── tsconfig.base.json    # Base TypeScript configuration
```

## Package Organization Best Practices

### 1. Separation of Concerns 📦

#### Standalone Packages (`packages/*`)
- Should be independently publishable
- Have their own versioning
- Maintain their own dependencies
- Example: `exceljs-analyzer`

```json
// packages/analyzer/package.json
{
  "name": "exceljs-analyzer",
  "version": "1.1.0",
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  }
}
```

#### Main Application
- Consumes standalone packages
- App-specific logic
- Integration of packages

### 2. Path Aliases Configuration 🔄

#### Base Configuration (`tsconfig.base.json`)
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

#### Package-Specific Configuration
```json
// packages/analyzer/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "paths": {
      "@analyzer/*": ["src/*"],
      "@analyzer/types": ["src/types"],
      "@analyzer/utils": ["src/utils"]
    }
  }
}
```

### 3. Workspace Configuration 🏗️

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'one-52-excell-marketing-app'
```

## Usage Patterns

### 1. Internal Package Development 🛠️

```typescript
// Inside analyzer package
import { type WorksheetAnalysis } from '@analyzer/types';
import { validateWorksheet } from '@analyzer/utils';
```

### 2. Package Consumption 📥

```typescript
// In main application
import { ExcelAnalyzer } from 'exceljs-analyzer';
```

### 3. Package Publishing 📦

```bash
# Build and publish analyzer package
cd packages/analyzer
pnpm build
pnpm publish
```

## ESLint Configuration

### 1. Base ESLint Config (`.eslintrc.base.json`)
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "settings": {
    "import/resolver": {
      "typescript": true
    }
  }
}
```

### 2. Package-Specific ESLint
```json
// packages/analyzer/.eslintrc.json
{
  "extends": "../../.eslintrc.base.json",
  "rules": {
    "import/no-unresolved": "error",
    "import/order": [
      "error",
      {
        "groups": [
          ["builtin", "external"],
          "internal",
          ["parent", "sibling", "index"]
        ],
        "pathGroups": [
          {
            "pattern": "@analyzer/**",
            "group": "internal"
          }
        ]
      }
    ]
  }
}
```

## Scripts Organization

### 1. Root Scripts
```json
// Root package.json
{
  "scripts": {
    "build": "pnpm -r build",
    "test": "pnpm -r test",
    "lint": "pnpm -r lint"
  }
}
```

### 2. Package Scripts
```json
// packages/analyzer/package.json
{
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "lint": "eslint src --ext .ts,.tsx"
  }
}
```

## Best Practices for Package Consumers 🎯

1. **Installation**:
   ```bash
   # Install as a dependency
   pnpm add exceljs-analyzer
   ```

2. **TypeScript Configuration**:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "exceljs-analyzer": ["node_modules/exceljs-analyzer/dist"]
       }
     }
   }
   ```

3. **Usage**:
   ```typescript
   import { ExcelAnalyzer } from 'exceljs-analyzer';
   
   const analyzer = new ExcelAnalyzer();
   await analyzer.analyze('/path/to/project');
   ```

## Development Workflow 🔄

1. **Local Development**:
   ```bash
   # Link package locally
   pnpm link ./packages/analyzer
   
   # Watch mode for development
   pnpm --filter exceljs-analyzer build:watch
   ```

2. **Testing Changes**:
   ```bash
   # Run tests for specific package
   pnpm --filter exceljs-analyzer test
   
   # Run all tests
   pnpm test
   ```

3. **Publishing Updates**:
   ```bash
   # Version bump
   pnpm --filter exceljs-analyzer version patch
   
   # Build and publish
   pnpm --filter exceljs-analyzer publish
   ```

## Common Pitfalls to Avoid ⚠️

1. **Circular Dependencies**
   - Keep packages independent
   - Use clear dependency hierarchy

2. **Path Alias Conflicts**
   - Use unique prefixes for each package
   - Document alias patterns

3. **Version Management**
   - Use semantic versioning
   - Keep changelogs updated

4. **Package Boundaries**
   - Clear separation of concerns
   - Well-defined interfaces

## Maintenance and Updates 🔧

1. **Regular Updates**
   - Keep dependencies current
   - Monitor security advisories

2. **Documentation**
   - Update README files
   - Maintain changelogs
   - Document breaking changes

3. **Testing**
   - Unit tests for packages
   - Integration tests for app
   - E2E tests for workflows

## Next Steps 📋

1. [ ] Set up base configurations
2. [ ] Configure package aliases
3. [ ] Update ESLint rules
4. [ ] Document package interfaces
5. [ ] Set up CI/CD pipeline 