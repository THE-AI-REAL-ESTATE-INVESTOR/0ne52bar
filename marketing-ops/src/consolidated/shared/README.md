# ONE52 Bar & Grill - Shared Components

This directory contains shared functionality used across all ONE52 Bar & Grill marketing operations implementations.

## Directory Structure

```mermaid
graph TD
    A[shared/] --> B[types/]
    A --> C[utils/]
    A --> D[config/]
    A --> E[excel/]
    
    B --> F[campaign.ts]
    B --> G[calculations.ts]
    B --> H[excel.ts]
    B --> I[index.ts]
    
    C --> J[validation.ts]
    C --> K[formatting.ts]
    C --> L[calculations.ts]
    
    D --> M[constants.ts]
    D --> N[styles.ts]
    
    E --> O[generator.ts]
    E --> P[styles.ts]
    E --> Q[worksheets.ts]
```

## Type System Overview

```mermaid
classDiagram
    class BaseParameters {
        +number budget
        +number timeframe
        +string campaignType
        +Date startDate
    }
    
    class BaseCalculations {
        +number revenue
        +number costs
        +number profit
        +number roi
    }
    
    class ExcelConfig {
        +string template
        +object styles
        +array worksheets
        +object validation
    }
    
    class ValidationRules {
        +array rules
        +object messages
        +function validate
    }
    
    BaseParameters --> BaseCalculations
    BaseCalculations --> ExcelConfig
    ValidationRules --> BaseParameters
```

## Data Flow

```mermaid
flowchart LR
    A[Base Types] --> B[Validation]
    A --> C[Calculations]
    A --> D[Excel Generation]
    
    B --> E[Shared Utils]
    C --> E
    D --> E
    
    E --> F[Output]
```

## Key Features

1. **Type Definitions**
   - Base parameter types
   - Calculation interfaces
   - Excel configuration types
   - Validation types

2. **Utility Functions**
   - Data validation
   - Number formatting
   - Date handling
   - Common calculations

3. **Configuration**
   - Global constants
   - Style definitions
   - Worksheet templates
   - Validation rules

4. **Excel Generation**
   - Base generator class
   - Common styles
   - Worksheet templates
   - Data validation

## Dependencies

- TypeScript
- ExcelJS
- Zod (validation)
- Date-fns

## Usage

1. Import shared types
2. Use utility functions
3. Apply configuration
4. Generate Excel reports

## Testing

- Type checking
- Unit tests for utilities
- Integration tests
- Performance benchmarks 