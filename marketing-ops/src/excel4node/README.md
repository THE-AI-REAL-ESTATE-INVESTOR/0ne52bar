# Excel4Node Marketing Operations Implementation

This directory contains the legacy implementation of the ONE52 Bar & Grill marketing operations spreadsheet generator using Excel4Node.

## Directory Structure

```mermaid
graph TD
    A[excel4node/] --> B[generate-marketing-spreadsheet.ts<br/>12KB]
    A --> C[excel4node.d.ts<br/>928B]
```

## File Size Comparison

| File | Size | Lines | Description |
|------|------|-------|-------------|
| generate-marketing-spreadsheet.ts | 12KB | 279 | Main implementation file containing campaign calculations and Excel generation |
| excel4node.d.ts | 928B | 44 | TypeScript type definitions for Excel4Node library |

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
   - Total codebase size: 13KB (12KB + 928B)

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