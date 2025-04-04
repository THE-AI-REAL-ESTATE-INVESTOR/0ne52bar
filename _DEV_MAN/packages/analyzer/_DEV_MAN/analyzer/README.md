# ExcelJS Consolidation Analyzer

This analyzer tool helps identify and fix issues in the ExcelJS consolidation project.

## Features

### Type Analysis
- Analyzes type definitions and usage
- Identifies missing or incorrect types
- Generates type fixes when needed

### Feature Analysis
- Analyzes worksheet features
- Checks for missing or invalid formulas
- Validates styles and formatting
- Verifies calculations

### Worksheet Analysis
- Analyzes worksheet structure
- Validates column definitions
- Checks for missing or invalid data
- Verifies worksheet relationships

### Campaign Data Analysis (NEW!)
- Analyzes campaign data structure
- Validates required properties
- Checks type usage
- Verifies data validation
- Ensures formula references are correct

## Usage

Run the analyzer:
```bash
npm run analyze
```

Run the analyzer with fixes:
```bash
npm run analyze -- --fix
```

## Output

The analyzer generates the following output files:
- `type-analysis.json`: Results of type analysis
- `feature-analysis.json`: Results of feature analysis
- `worksheet-analysis.json`: Results of worksheet analysis
- `campaign-data-analysis.json`: Results of campaign data analysis

When running with `--fix`, additional files are generated:
- `type-fixes.json`: Applied type fixes
- `feature-fixes.json`: Applied feature fixes
- `worksheet-fixes.json`: Applied worksheet fixes
- `campaign-data-fixes.json`: Applied campaign data fixes

## Version Updates

The analyzer maintains a version history of fixes in `version-updates.json`. Each fix includes:
- Description of the change
- Timestamp
- Files affected
- Changes made

## Implementation Details

### Type Analysis
The type analyzer checks for:
- Missing type definitions
- Incorrect type usage
- Type compatibility issues
- Unused types

### Feature Analysis
The feature analyzer validates:
- Worksheet features
- Formula syntax
- Style definitions
- Calculation logic

### Worksheet Analysis
The worksheet analyzer verifies:
- Worksheet structure
- Column definitions
- Data validation
- Worksheet relationships

### Campaign Data Analysis
The campaign data analyzer checks:
- Required properties
- Type usage
- Data validation
- Formula references
- Structure consistency 