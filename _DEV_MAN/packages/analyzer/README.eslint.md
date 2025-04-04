# ESLint Configuration Documentation

## Analyzer Package ESLint Configuration

This configuration file defines the ESLint rules and settings for the ExcelJS analyzer package.

### Configuration Overview

```json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "plugins": [
    "@typescript-eslint",
    "import"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "settings": {
    "import/resolver": {
      "typescript": {
        "project": "./tsconfig.json"
      }
    }
  },
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "error",
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index"
        ],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }
    ]
  }
}
```

### Key Settings and Their Purposes

1. **Parser Configuration**
   - `"parser": "@typescript-eslint/parser"` - Uses TypeScript parser for ESLint
   - `"project": "./tsconfig.json"` - References TypeScript configuration

2. **Plugins**
   - `"@typescript-eslint"` - Adds TypeScript-specific rules
   - `"import"` - Adds import/export rules

3. **Extended Configurations**
   - `"eslint:recommended"` - Base ESLint recommended rules
   - `"plugin:@typescript-eslint/recommended"` - TypeScript recommended rules

4. **Import Resolver**
   - Configures TypeScript path aliases for import resolution
   - Ensures proper handling of `@/*` style imports

5. **Rules**
   - `"@typescript-eslint/no-unused-vars"` - Flags unused variables
   - `"@typescript-eslint/explicit-function-return-type"` - Requires explicit return types
   - `"import/order"` - Enforces consistent import ordering

### Important Rules and Their Purposes

1. **TypeScript Rules**
   - `no-unused-vars`: Prevents unused variables
   - `explicit-function-return-type`: Ensures type safety in functions

2. **Import Rules**
   - Groups imports by type (builtin, external, internal, etc.)
   - Enforces alphabetical ordering
   - Requires newlines between groups

### When to Modify
- When adding new TypeScript features
- When changing import patterns
- When updating ESLint plugins
- When adding new rules

### Best Practices
1. Keep rules consistent with TypeScript configuration
2. Use path aliases for imports
3. Maintain strict type checking
4. Follow import ordering conventions

### References
- [ESLint Documentation](https://eslint.org/docs/)
- [TypeScript ESLint Plugin](https://github.com/typescript-eslint/typescript-eslint)
- [ESLint Import Plugin](https://github.com/import-js/eslint-plugin-import) 