# ExcelJS Analyzer

A comprehensive analysis and fix tool for ExcelJS workbooks, providing advanced validation, style standardization, and code quality improvements.

## Features

- **Type Analysis**: Validate and fix type inconsistencies in Excel workbooks
- **Style Standardization**: Ensure consistent styling across worksheets
- **Worksheet Validation**: Verify worksheet structure and content
- **Code Quality**: Improve workbook code quality and performance
- **CLI Interface**: Easy-to-use command line interface
- **TypeScript Support**: Full TypeScript support with type definitions
- **Flexible Configuration**: Runtime configuration and path handling
- **Project Analysis**: Analyze entire project directories

## Installation

```bash
# Using npm
npm install exceljs-analyzer

# Using yarn
yarn add exceljs-analyzer

# Using pnpm
pnpm add exceljs-analyzer
```

## Usage

### Command Line Interface

```bash
# Analyze a project directory
exceljs-analyzer analyze /path/to/project

# Fix issues in a project
exceljs-analyzer fix /path/to/project

# Verify fixes
exceljs-analyzer verify /path/to/project

# Specify custom configuration
exceljs-analyzer analyze /path/to/project --config ./custom-config.json
```

### Programmatic Usage

```typescript
import { ExcelJSAnalyzer, updateConfig } from 'exceljs-analyzer';

// Configure target path
updateConfig({
  targetPath: '/path/to/project',
  excelDir: 'src/consolidated/shared/excel',
  outputDir: 'output'
});

// Create analyzer instance
const analyzer = new ExcelJSAnalyzer();

// Analyze project
const analysis = await analyzer.analyze();

// Fix issues
const fixedWorkbook = await analyzer.fix();

// Verify fixes
const verification = await analyzer.verify();
```

## Configuration

### Runtime Configuration

```typescript
import { updateConfig } from 'exceljs-analyzer';

// Update configuration at runtime
updateConfig({
  targetPath: '/path/to/project',
  excelDir: 'src/consolidated/shared/excel',
  outputDir: 'output'
});
```

### Configuration File

Create a `.exceljs-analyzerrc` file in your project root:

```json
{
  "targetPath": "/path/to/project",
  "excelDir": "src/consolidated/shared/excel",
  "outputDir": "output",
  "typeValidation": {
    "strict": true,
    "ignorePatterns": ["^_"]
  },
  "styleValidation": {
    "enforceConsistency": true,
    "defaultFont": "Arial",
    "defaultFontSize": 11
  },
  "worksheetValidation": {
    "maxRows": 1000000,
    "maxColumns": 16384
  }
}
```

## Analysis Features

### Type Analysis
```typescript
// Analyze types in project
const typeAnalysis = await analyzer.analyzeTypes();

// Fix type issues
const fixedWorkbook = await analyzer.fixTypes();
```

### Style Analysis
```typescript
// Analyze styles in project
const styleAnalysis = await analyzer.analyzeStyles();

// Fix style issues
const fixedWorkbook = await analyzer.fixStyles();
```

### Worksheet Validation
```typescript
// Validate worksheet structure
const validation = await analyzer.validateWorksheet();

// Fix worksheet issues
const fixedWorksheet = await analyzer.fixWorksheet();
```

### Project Analysis
```typescript
// Analyze entire project
const projectAnalysis = await analyzer.analyzeProject();

// Fix project-wide issues
const fixedProject = await analyzer.fixProject();
```

## Development

### Building

```bash
# Build the project
pnpm build

# Watch mode
pnpm build --watch
```

### Testing

```bash
# Run tests
pnpm test

# Watch mode
pnpm test --watch
```

### Linting

```bash
# Run linter
pnpm lint

# Fix linting issues
pnpm lint --fix
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

UNLICENSED - All rights reserved by THE AI RE INVESTOR - AIREINVESTOR.COM

## Acknowledgments

- [ExcelJS](https://www.npmjs.com/package/exceljs) - The core Excel manipulation library
- [Zod](https://www.npmjs.com/package/zod) - TypeScript-first schema validation
- [Commander](https://www.npmjs.com/package/commander) - Command-line interface framework 