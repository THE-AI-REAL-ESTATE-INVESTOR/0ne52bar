# Analyzer Package TypeScript Configuration

## Package Configuration (`tsconfig.json`)

This configuration file defines the TypeScript compiler settings specifically for the ExcelJS analyzer package.

### Key Settings and Their Purposes

#### Compiler Options

1. **Target and Module Settings**
   - `"target": "ES2022"` - Uses latest ECMAScript features for analyzer package
   - `"module": "ESNext"` - Uses latest module system for maximum compatibility
   - `"lib": ["ES2022"]` - Includes latest ECMAScript features

2. **Output Configuration**
   - `"outDir": "dist"` - Output directory for compiled files
   - `"rootDir": "src"` - Source directory for TypeScript files
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
   - `"skipLibCheck": true` - Skips type checking of declaration files
   - `"forceConsistentCasingInFileNames": true` - Ensures consistent file casing

5. **Path Aliases**
   ```json
   "paths": {
     "@/*": ["./src/*"],
     "@fixes/*": ["src/fixes/*"],
     "@types/*": ["src/types/*"],
     "@utils/*": ["src/utils/*"],
     "@config/*": ["src/config/*"],
     "@scripts/*": ["src/scripts/*"],
     "@test/*": ["src/test/*"],
     "exceljs-analyzer/*": ["./node_modules/exceljs-analyzer/*"]
   }
   ```
   - Provides clean import paths for package internals
   - Includes ExcelJS analyzer module resolution
   - Supports modular code organization

### File Inclusion/Exclusion
- `"include": ["src/**/*"]` - Includes all TypeScript files in src directory
- `"exclude": ["node_modules", "dist", "**/*.test.ts"]` - Excludes test files and build artifacts

### Important Notes
1. This configuration is optimized for the ExcelJS analyzer package
2. Uses ES2022 target for modern JavaScript features
3. Includes specific path aliases for package organization
4. Maintains strict type checking for reliability

### When to Modify
- When adding new package-specific path aliases
- When updating ExcelJS analyzer dependencies
- When changing module system requirements
- When adding new type checking rules

### References
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [tsconfig.json Reference](https://www.typescriptlang.org/tsconfig)
- [ExcelJS Documentation](https://github.com/exceljs/exceljs) 