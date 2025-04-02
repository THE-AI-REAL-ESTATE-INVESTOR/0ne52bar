# ONE52 Bar & Grill - Current Marketing Operations

This directory contains the core marketing operations functionality for ONE52 Bar & Grill's current marketing campaigns.

## Directory Structure

```mermaid
graph TD
    A[one52bar-current/] --> B[src/]
    A --> C[tests/]
    A --> D[docs/]
    
    B --> E[calculations/]
    B --> F[excel/]
    
    E --> G[campaign.ts]
    E --> H[revenue.ts]
    E --> I[costs.ts]
    E --> J[break-even.ts]
    
    F --> K[generator.ts]
    F --> L[styles.ts]
    F --> M[worksheets.ts]
```

## Component Overview

```mermaid
classDiagram
    class CampaignParameters {
        +number weeklyBudget
        +number customerValue
        +number conversionRate
        +number repeatRate
    }
    
    class WeeklyCalculations {
        +number revenue
        +number costs
        +number profit
        +number customers
    }
    
    class MonthlyCalculations {
        +number revenue
        +number costs
        +number profit
        +number customers
    }
    
    class AnnualCalculations {
        +number revenue
        +number costs
        +number profit
        +number customers
    }
    
    class BreakEvenAnalysis {
        +number breakEvenCustomers
        +number breakEvenRevenue
        +number breakEvenTime
    }
    
    CampaignParameters --> WeeklyCalculations
    CampaignParameters --> MonthlyCalculations
    CampaignParameters --> AnnualCalculations
    CampaignParameters --> BreakEvenAnalysis
```

## Data Flow

```mermaid
flowchart LR
    A[Campaign Parameters] --> B[Weekly Calculations]
    A --> C[Monthly Calculations]
    A --> D[Annual Calculations]
    A --> E[Break-even Analysis]
    
    B --> F[Revenue Projections]
    C --> F
    D --> F
    
    B --> G[Cost Analysis]
    C --> G
    D --> G
    
    F --> H[Excel Generation]
    G --> H
    E --> H
```

## Key Features

1. **Campaign Parameters**
   - Weekly budget allocation
   - Customer value estimation
   - Conversion rate tracking
   - Repeat customer rate

2. **Revenue Calculations**
   - Weekly revenue projections
   - Monthly revenue tracking
   - Annual revenue forecasting
   - Additional revenue streams

3. **Cost Analysis**
   - Marketing costs
   - Operational costs
   - Customer acquisition costs
   - Cost per conversion

4. **Break-even Analysis**
   - Customer break-even point
   - Revenue break-even point
   - Time to break-even
   - Profit margins

5. **Excel Generation**
   - Professional formatting
   - Multiple worksheets
   - Data validation
   - Automated calculations

## Dependencies

- TypeScript
- ExcelJS
- Shared types and utilities
- Testing framework

## Usage

1. Import campaign parameters
2. Run calculations
3. Generate Excel report
4. Analyze results

## Testing

- Unit tests for all calculations
- Integration tests for Excel generation
- Validation tests for parameters
- Performance benchmarks 