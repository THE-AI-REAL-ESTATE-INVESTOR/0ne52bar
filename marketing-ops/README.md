# ONE52 Bar & Grill Marketing Operations

A comprehensive suite of marketing operations tools for ONE52 Bar & Grill, including campaign calculators, Excel generators, and analytics tools.

## Directory Structure

```mermaid
graph TD
    A[marketing-ops/] --> B[src/]
    A --> C[tests/]
    A --> D[docs/]
    
    B --> E[consolidated/]
    B --> F[exceljs/]
    B --> G[excel4node/]
    B --> H[legacy/]
    
    E --> I[one52bar-current/]
    E --> J[one52bar-direct-mail/]
    E --> K[one52bar-app/]
    E --> L[shared/]
    
    I --> M[src/]
    I --> N[tests/]
    I --> O[docs/]
    
    J --> P[src/]
    J --> Q[tests/]
    J --> R[docs/]
    
    K --> S[src/]
    K --> T[tests/]
    K --> U[docs/]
    
    L --> V[types/]
    L --> W[utils/]
    L --> X[config/]
    L --> Y[excel/]
```

## Implementation Comparison

| Implementation | Total Size | Main File Size | Lines of Code | File Organization |
|----------------|------------|----------------|---------------|-------------------|
| ExcelJS | 10KB | 3.1KB | 86 | Modern, modular |
| Excel4Node | 12KB | 279 lines | 279 | Legacy, monolithic |
| Legacy | 20KB | 480 lines | 480 | Legacy, monolithic |
| JavaScript | 289 lines | 289 lines | 289 | Legacy, monolithic |

## Project Evolution

```mermaid
timeline
    title ONE52 Bar & Grill Marketing Operations Evolution
    section Initial Implementation
        JavaScript Implementation : 2024-01-01
        Basic Excel Generation : 2024-01-15
        Campaign Calculations : 2024-02-01
    section TypeScript Migration
        Excel4Node Implementation : 2024-02-15
        Type Definitions : 2024-03-01
        Validation System : 2024-03-15
    section Modern Implementation
        ExcelJS Migration : 2024-04-01
        Modular Architecture : 2024-04-15
        Comprehensive Testing : 2024-05-01
    section Documentation
        API Documentation : 2024-05-15
        Usage Examples : 2024-06-01
        Architecture Diagrams : 2024-06-15
```

## Key Features

1. **Multiple Implementations**
   - ExcelJS (modern)
   - Excel4Node (legacy)
   - JavaScript (legacy)
   - Consolidated (new)

2. **Comprehensive Documentation**
   - Architecture diagrams
   - API documentation
   - Usage examples
   - Type definitions

3. **Type Safety**
   - TypeScript interfaces
   - Zod validation
   - Runtime type checking
   - Comprehensive error handling

4. **Excel Generation**
   - Multiple worksheet support
   - Custom styling
   - Formula support
   - Data validation

5. **Business Logic**
   - Campaign calculations
   - Revenue projections
   - Cost analysis
   - Break-even calculations

## Dependencies

- TypeScript
- ExcelJS
- Zod
- Jest
- ESLint
- Prettier

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Run tests:
   ```bash
   npm test
   ```

4. Generate documentation:
   ```bash
   npm run docs
   ```

## Development

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```

2. Make your changes

3. Run tests and linting:
   ```bash
   npm run test
   npm run lint
   ```

4. Commit your changes:
   ```bash
   git commit -m "feat: your feature description"
   ```

5. Push to your branch:
   ```bash
   git push origin feature/your-feature
   ```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

UNLICENSED - All rights reserved by ONE52 Bar & Grill 