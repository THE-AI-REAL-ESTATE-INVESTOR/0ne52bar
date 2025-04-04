# Spreadsheet Generator Documentation

## File Overview

### 1. `generate-marketing-spreadsheet.legacy.ts`
**Purpose**: Original comprehensive spreadsheet generator with both direct mail and app marketing calculations
**Location**: `src/generate-marketing-spreadsheet.legacy.ts`

#### Key Functions:
1. `calculateMarketingCampaignData(data: MarketingCampaignData)`
   - Calculates weekly, monthly, and annual metrics
   - Handles direct mail campaign calculations
   - Computes break-even analysis
   - Calculates additional revenue considerations

2. `generateMarketingSpreadsheet()`
   - Creates Excel workbook with multiple worksheets
   - Sets up column structures and styles
   - Generates formulas for projections
   - Adds validation checks

#### Worksheets:
1. Direct Mail Parameters
   - Stamp costs
   - Recipient targets
   - Conversion rates
   - Revenue projections

2. Direct Mail Growth Projection
   - Monthly growth calculations
   - Revenue projections
   - Cost analysis
   - Net revenue calculations

3. Direct Mail Validation
   - Parameter validation
   - Formula checks
   - Data consistency verification

4. ONE52 Bar App
   - App-specific parameters
   - User metrics
   - Cost structures
   - Revenue projections

5. App Growth Projection
   - Monthly user growth
   - Revenue projections
   - Cost analysis
   - Net revenue calculations

6. App Validation
   - Parameter validation
   - Formula checks
   - Data consistency verification

7. Combined Growth Projection
   - Integrated direct mail and app growth
   - Combined revenue projections
   - Total cost analysis
   - Overall net revenue

8. Combined Validation
   - Cross-campaign validation
   - Overall formula checks
   - Comprehensive data verification

### 2. `generate-marketing-spreadsheet.ts 14-16-35-346.ts`
**Purpose**: Focused spreadsheet generator for app marketing only
**Location**: `src/generate-marketing-spreadsheet.ts 14-16-35-346.ts`

#### Key Functions:
1. `generateMarketingSpreadsheet()`
   - Creates Excel workbook with app-specific worksheets
   - Sets up column structures and styles
   - Generates app-specific formulas
   - Adds validation checks

#### Worksheets:
1. ONE52 Bar App
   - App parameters
   - User metrics
   - Cost structures
   - Revenue projections

2. App Growth Projection
   - Monthly growth calculations
   - Revenue projections
   - Cost analysis
   - Net revenue calculations

3. App Validation
   - Parameter validation
   - Formula checks
   - Data consistency verification

### 3. `generate-marketing-spreadsheet.new.ts`
**Purpose**: Refactored version with improved TypeScript types and ExcelJS integration
**Location**: `src/exceljs/generate-marketing-spreadsheet.new.ts`

#### Key Functions:
1. `generateMarketingSpreadsheet()`
   - Creates Excel workbook with improved type safety
   - Uses proper ExcelJS type definitions
   - Implements consistent styling
   - Adds comprehensive validation

#### Worksheets:
1. ONE52 Bar App
   - App parameters with type-safe definitions
   - User metrics with validation
   - Cost structures with proper types
   - Revenue projections with formulas

2. App Growth Projection
   - Monthly growth calculations with type safety
   - Revenue projections with validation
   - Cost analysis with proper types
   - Net revenue calculations with formulas

3. App Validation
   - Type-safe parameter validation
   - Formula checks with proper types
   - Data consistency verification

### 4. Configuration Files

#### `constants.ts`
**Purpose**: Defines constants and configuration values
**Location**: `src/exceljs/config/constants.ts`

#### Key Components:
1. Style Definitions
   - Color schemes
   - Font settings
   - Alignment rules
   - Border configurations

2. Parameter Defaults
   - Default values for calculations
   - Configuration thresholds
   - Validation rules

#### `styles.ts`
**Purpose**: Defines Excel styling configurations
**Location**: `src/exceljs/config/styles.ts`

#### Key Components:
1. Cell Styles
   - Header styles
   - Input styles
   - Result styles
   - Warning styles

2. Format Definitions
   - Number formats
   - Date formats
   - Currency formats
   - Percentage formats

## Usage Recommendations

1. For comprehensive marketing analysis:
   - Use `generate-marketing-spreadsheet.legacy.ts`
   - Includes both direct mail and app marketing
   - Provides complete validation

2. For app-only analysis:
   - Use `generate-marketing-spreadsheet.ts 14-16-35-346.ts`
   - Focused on app metrics
   - Simplified validation

3. For type-safe development:
   - Use `generate-marketing-spreadsheet.new.ts`
   - Improved TypeScript integration
   - Better ExcelJS type support

4. For configuration:
   - Use `constants.ts` for parameter definitions
   - Use `styles.ts` for styling configurations 