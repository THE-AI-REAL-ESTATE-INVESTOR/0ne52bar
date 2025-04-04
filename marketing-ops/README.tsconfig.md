# TypeScript Configuration Documentation

## Root Configuration (`tsconfig.json`)

This configuration file defines the TypeScript compiler settings for the entire marketing-ops project.

### Key Settings and Their Purposes

#### Compiler Options

1. **Target and Module Settings**
   - `"target": "ES2020"` - Compiles to ECMAScript 2020, providing modern JavaScript features
   - `"module": "ES2020"` - Uses ES2020 module system for better tree-shaking
   - `"lib": ["ES2020", "DOM"]` - Includes DOM types for browser environment

2. **Output Configuration**
   - `"outDir": "./dist"` - Output directory for compiled files
   - `"rootDir": "./src"` - Source directory for TypeScript files
   - `"declaration": true` - Generates .d.ts files for type definitions
   - `"declarationMap": true` - Generates source maps for .d.ts files
   - `"sourceMap": true` - Generates source maps for debugging

3. **Type Checking**
   - `"strict": true` - Enables all strict type checking options
   - `"noImplicitAny": true` - Prevents implicit any types
   - `"strictNullChecks": true` - Ensures null/undefined safety
   - `"strictFunctionTypes": true` - Enables strict function type checking
   - `"strictBindCallApply": true` - Enables strict bind/call/apply checking
   - `"strictPropertyInitialization": true` - Ensures class properties are initialized
   - `"noImplicitThis": true` - Prevents implicit this usage
   - `"alwaysStrict": true` - Enforces strict mode

4. **Module Resolution**
   - `"moduleResolution": "node"` - Uses Node.js-style module resolution
   - `"esModuleInterop": true` - Enables better CommonJS/ES6 module interop
   - `"resolveJsonModule": true` - Allows importing JSON files
   - `"isolatedModules": true` - Ensures each file can be safely transpiled

5. **Code Quality**
   - `"noUnusedLocals": true` - Flags unused local variables
   - `"noUnusedParameters": true` - Flags unused parameters
   - `"noImplicitReturns": true` - Ensures all code paths return a value
   - `"noFallthroughCasesInSwitch": true` - Prevents switch case fallthrough

6. **Path Aliases**
   ```json
   "paths": {
     "@/*": ["src/*"],
     "@types/*": ["types/*"],
     "@legacy/*": ["legacy_backup_20250402_181635/*"],
     "@consolidated/*": ["src/consolidated/*"],
     "@analyzer/*": ["src/analyzer/*"],
     "@exceljs/*": ["src/exceljs/*"]
   }
   ```
   - Provides clean import paths
   - Improves code maintainability
   - Reduces relative path complexity

### File Inclusion/Exclusion
- `"include": ["src/**/*"]` - Includes all TypeScript files in src directory
- `"exclude": ["node_modules", "dist", "**/*.test.ts"]` - Excludes test files and build artifacts

### Important Notes
1. This configuration is designed for a monorepo structure
2. Path aliases are configured for easy imports
3. Strict type checking is enforced for better code quality
4. Source maps are enabled for better debugging experience

### When to Modify
- When adding new path aliases
- When updating TypeScript version
- When changing module system
- When adding new type checking rules

### References
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [tsconfig.json Reference](https://www.typescriptlang.org/tsconfig) 