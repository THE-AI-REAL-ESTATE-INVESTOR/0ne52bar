# ONE52 Bar & Grill - App Marketing Operations

This directory contains the app-specific marketing functionality for ONE52 Bar & Grill's mobile application.

## Directory Structure

```mermaid
graph TD
    A[one52bar-app/] --> B[src/]
    A --> C[tests/]
    A --> D[docs/]
    
    B --> E[calculations/]
    B --> F[excel/]
    
    E --> G[signups.ts]
    E --> H[notifications.ts]
    E --> I[growth.ts]
    E --> J[revenue.ts]
    
    F --> K[generator.ts]
    F --> L[styles.ts]
    F --> M[worksheets.ts]
```

## Component Overview

```mermaid
classDiagram
    class AppParameters {
        +number weeklySignups
        +number monthlyOrganic
        +number pushCost
        +number retentionRate
    }
    
    class GrowthMetrics {
        +number userGrowth
        +number activeUsers
        +number churnRate
        +number viralityCoefficient
    }
    
    class NotificationMetrics {
        +number pushSent
        +number openRate
        +number clickRate
        +number conversionRate
    }
    
    class AppRevenue {
        +number inAppPurchases
        +number adRevenue
        +number subscriptionRevenue
        +number totalRevenue
    }
    
    AppParameters --> GrowthMetrics
    AppParameters --> NotificationMetrics
    AppParameters --> AppRevenue
```

## Data Flow

```mermaid
flowchart LR
    A[App Parameters] --> B[Growth Metrics]
    A --> C[Notification Metrics]
    A --> D[App Revenue]
    
    B --> E[User Analytics]
    C --> E
    D --> E
    
    E --> F[Excel Generation]
```

## Key Features

1. **App Signup Analytics**
   - Weekly signup tracking
   - Monthly organic growth
   - User acquisition costs
   - Signup source analysis

2. **Push Notification Management**
   - Notification cost tracking
   - Open rate analysis
   - Click-through rates
   - Conversion tracking

3. **Growth Metrics**
   - User growth rate
   - Active user tracking
   - Churn rate analysis
   - Virality coefficient

4. **Revenue Analysis**
   - In-app purchase tracking
   - Ad revenue monitoring
   - Subscription revenue
   - Total revenue projections

5. **Excel Generation**
   - User analytics dashboard
   - Revenue projections
   - Growth metrics
   - ROI analysis

## Dependencies

- TypeScript
- ExcelJS
- Shared types and utilities
- Testing framework

## Usage

1. Configure app parameters
2. Track user metrics
3. Monitor notifications
4. Generate analytics report

## Testing

- Unit tests for calculations
- Integration tests for Excel generation
- Validation tests for parameters
- Performance benchmarks 