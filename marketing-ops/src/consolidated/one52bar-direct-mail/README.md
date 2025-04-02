# ONE52 Bar & Grill - Direct Mail Marketing Operations

This directory contains the direct mail marketing functionality for ONE52 Bar & Grill's postcard campaigns.

## Directory Structure

```mermaid
graph TD
    A[one52bar-direct-mail/] --> B[src/]
    A --> C[tests/]
    A --> D[docs/]
    
    B --> E[calculations/]
    B --> F[excel/]
    
    E --> G[postcard.ts]
    E --> H[mailing.ts]
    E --> I[response.ts]
    E --> J[roi.ts]
    
    F --> K[generator.ts]
    F --> L[styles.ts]
    F --> M[worksheets.ts]
```

## Component Overview

```mermaid
classDiagram
    class PostcardParameters {
        +number printCost
        +number designCost
        +number quantity
        +number size
    }
    
    class MailingParameters {
        +number stampCost
        +number listSize
        +number deliveryRate
        +number frequency
    }
    
    class ResponseMetrics {
        +number responseRate
        +number conversionRate
        +number averageOrder
        +number lifetimeValue
    }
    
    class ROIAnalysis {
        +number totalCost
        +number totalRevenue
        +number roi
        +number breakEvenPoint
    }
    
    PostcardParameters --> ROIAnalysis
    MailingParameters --> ROIAnalysis
    ResponseMetrics --> ROIAnalysis
```

## Data Flow

```mermaid
flowchart LR
    A[Postcard Parameters] --> D[ROI Analysis]
    B[Mailing Parameters] --> D
    C[Response Metrics] --> D
    
    D --> E[Cost Calculations]
    D --> F[Revenue Projections]
    
    E --> G[Excel Generation]
    F --> G
```

## Key Features

1. **Postcard Campaign Management**
   - Print cost calculations
   - Design cost tracking
   - Quantity optimization
   - Size and format options

2. **Mailing List Management**
   - List size tracking
   - Stamp cost calculations
   - Delivery rate monitoring
   - Mailing frequency optimization

3. **Response Tracking**
   - Response rate analysis
   - Conversion rate tracking
   - Average order value
   - Customer lifetime value

4. **ROI Analysis**
   - Total cost calculation
   - Revenue projection
   - ROI calculation
   - Break-even analysis

5. **Excel Generation**
   - Campaign summary
   - Cost breakdown
   - Response analysis
   - ROI projections

## Dependencies

- TypeScript
- ExcelJS
- Shared types and utilities
- Testing framework

## Usage

1. Configure postcard parameters
2. Set up mailing list
3. Track responses
4. Generate ROI report

## Testing

- Unit tests for calculations
- Integration tests for Excel generation
- Validation tests for parameters
- Performance benchmarks 