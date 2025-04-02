# Legacy Marketing Operations Implementation

This directory contains the legacy implementation of the ONE52 Bar & Grill marketing operations spreadsheet generator.

## Directory Structure

```mermaid
graph TD
    A[legacy/] --> B[README.md<br/>3.1KB<br/>2025-04-02 14:46:25]
    A --> C[excel4node/]
    C --> D[excel4node.d.ts<br/>928B<br/>2025-04-02 14:39:06]
    C --> E[generate-marketing-spreadsheet.ts<br/>12KB<br/>2025-04-02 13:45:30]
```

## File Size Comparison

| File | Size | Lines | Last Modified | Description |
|------|------|-------|---------------|-------------|
| README.md | 3.1KB | 123 | 2025-04-02 14:46:25 | Documentation and diagrams |
| excel4node/excel4node.d.ts | 928B | 44 | 2025-04-02 14:39:06 | TypeScript type definitions |
| excel4node/generate-marketing-spreadsheet.ts | 12KB | 279 | 2025-04-02 13:45:30 | Main implementation file |
| **Total** | **16KB** | **446** | 2025-04-02 14:46:25 | Complete legacy implementation |

## Implementation Comparison

| Metric | Legacy | Modern |
|--------|---------|--------|
| Total Size | 16KB | 10KB |
| Main File Size | 12KB | 3.1KB |
| Lines of Code | 446 | 303 |
| Files | 3 | 6 |
| Type Definitions | 1 file | 2 files |
| Configuration | Inline | Separated |
| Styling | Inline | Modular |
| Last Modified | 2025-04-02 14:46:25 | 2025-04-02 14:53:24 |

## Type System

```mermaid
classDiagram
    class MarketingCampaignData {
        +CampaignParameters parameters
        +WeeklyCalculations weeklyCalculations
        +MonthlyCalculations monthlyCalculations
        +AnnualCalculations annualCalculations
        +AdditionalRevenueConsiderations additionalRevenueConsiderations
        +BreakEvenAnalysis breakEvenAnalysis
    }

    class CampaignParameters {
        +number availableStamps
        +number costPerStamp
        +number weeklyTargetRecipients
        +number conversionRate
        +number currentWeeklyRevenue
        +number averageCustomerValue
    }

    class WeeklyCalculations {
        +number recipients
        +number newCustomers
        +number weeklyRevenueFromNewCustomers
        +number totalWeeklyRevenueWithNewCustomers
        +number weeklyStampCost
        +number netWeeklyRevenue
    }

    class MonthlyCalculations {
        +number recipients
        +number newCustomers
        +number monthlyRevenueFromNewCustomers
        +number totalMonthlyRevenueWithNewCustomers
        +number monthlyStampCost
        +number netMonthlyRevenue
    }

    class AnnualCalculations {
        +number recipients
        +number newCustomers
        +number annualRevenueFromNewCustomers
        +number totalAnnualRevenueWithNewCustomers
        +number annualStampCost
        +number netAnnualRevenue
    }

    class AdditionalRevenueConsiderations {
        +number repeatCustomerRate
        +number repeatVisitsPerCustomer
        +number additionalAnnualRevenueFromRepeatCustomers
        +number netAnnualRevenueWithRepeatCustomers
        +number wordOfMouthEffect
        +number additionalAnnualRevenueFromWordOfMouth
    }

    class BreakEvenAnalysis {
        +number requiredNewCustomersToBreakEven
        +number requiredConversionRateToBreakEven
    }

    MarketingCampaignData --> CampaignParameters
    MarketingCampaignData --> WeeklyCalculations
    MarketingCampaignData --> MonthlyCalculations
    MarketingCampaignData --> AnnualCalculations
    MarketingCampaignData --> AdditionalRevenueConsiderations
    MarketingCampaignData --> BreakEvenAnalysis
```

## Excel4Node API

```mermaid
classDiagram
    class Workbook {
        +constructor()
        +createStyle(style: StyleOptions)
        +addWorksheet(name: string)
        +write(filePath: string)
    }

    class Worksheet {
        +cell(row: number, col: number)
        +column(col: number)
    }

    class Cell {
        +string(value: string)
        +number(value: number)
        +style(style: any)
    }

    class Column {
        +setWidth(width: number)
    }

    Workbook --> Worksheet
    Worksheet --> Cell
    Worksheet --> Column
```

## Data Flow

```mermaid
flowchart LR
    A[Input Parameters] --> B[Weekly Calculations]
    B --> C[Monthly Calculations]
    C --> D[Annual Calculations]
    D --> E[Additional Revenue]
    E --> F[Break-even Analysis]
    
    subgraph Calculations
        B
        C
        D
        E
        F
    end
    
    subgraph Excel Generation
        G[Workbook Creation]
        H[Worksheet Setup]
        I[Style Application]
        J[Data Population]
        K[File Writing]
    end
    
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
```

## Styling System

```mermaid
graph TD
    A[ExcelStyles] --> B[header]
    A --> C[input]
    A --> D[result]
    A --> E[growth]
    A --> F[cost]
    A --> G[warning]
    
    B --> H[font: bold, white]
    B --> I[fill: blue]
    B --> J[alignment: center]
    
    C --> K[fill: light blue]
    C --> L[alignment: center]
    
    D --> M[font: bold]
    D --> N[fill: gray]
    D --> O[alignment: center]
    
    E --> P[font: bold, green]
    E --> Q[fill: light green]
    E --> R[alignment: center]
    
    F --> S[font: bold, red]
    F --> T[fill: light red]
    F --> U[alignment: center]
    
    G --> V[font: bold, red]
    G --> W[fill: yellow]
    G --> X[alignment: center, wrap]
```

## Key Features

1. **Legacy Implementation**
   - Uses Excel4Node library
   - TypeScript type definitions
   - Comprehensive calculations
   - Total codebase size: 16KB (3 files)

2. **Campaign Data Structure**
   - Weekly, monthly, and annual metrics
   - Revenue projections
   - Cost analysis
   - Break-even calculations

3. **Excel Generation**
   - Multiple worksheets
   - Custom styling
   - Formula support
   - Data validation

4. **Business Logic**
   - Marketing campaign calculations
   - Revenue projections
   - Customer acquisition costs
   - ROI analysis

5. **App Parameters**
   - Weekly signups
   - Organic growth
   - Push notification costs
   - Order values
   - Delivery metrics

## Dependencies
- excel4node: Latest version
- TypeScript: ^5.3.3 