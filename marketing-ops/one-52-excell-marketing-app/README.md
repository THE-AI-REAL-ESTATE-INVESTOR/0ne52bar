# ONE52 Bar & Grill Marketing Spreadsheet Generator

A TypeScript-based tool for generating marketing campaign spreadsheets with version control and CLI management.

## 🚀 Features

- Generate marketing campaign spreadsheets with detailed calculations
- Version control for spreadsheet templates
- Command-line interface for easy management
- Automatic versioning and documentation
- Type-safe implementation with TypeScript

## 📁 Project Structure

```
one-52-excell-marketing-app/
├── src/
│   ├── versions/                 # Versioned spreadsheet generators
│   ├── utils/                    # Utility functions
│   ├── cli.ts                    # Command-line interface
│   └── generate-marketing-spreadsheet.current.ts  # Current working version
├── dist/                         # Compiled JavaScript files
├── _DEV_MAN/                     # Development documentation
├── pnpm-workspace.yaml           # PNPM workspace configuration
├── .npmrc                        # NPM/PNPM configuration
└── package.json                  # Project configuration
```

## 🛠️ Prerequisites

- Node.js >= 16.0.0
- PNPM >= 8.0.0

To install PNPM:
```bash
npm install -g pnpm
```

## 📦 Installation

1. Clone the repository
2. Install dependencies:
```bash
pnpm install
```

Note: This project enforces the use of PNPM. Using npm or yarn will result in an error.

## 💻 Usage

### Command Line Interface

The project includes a CLI for managing spreadsheet versions:

```bash
# List all available versions
pnpm cli list

# Run a specific version
pnpm cli run 1.0

# Create a new version
pnpm cli create

# Show information about a version
pnpm cli info 1.0
```

### Version Management

Each version of the spreadsheet generator is stored in the `src/versions` directory with the naming convention:
```
generate-marketing-spreadsheet.vX.Y.ts
```

Where:
- X = Major version number
- Y = Minor version number

### Version Information

Each version file includes a header with:
- Version number
- Last update date
- List of changes

Example:
```typescript
/**
 * Version: 1.0
 * Last Updated: 2024-04-03
 * Changes:
 * - Initial release
 * - Basic spreadsheet generation
 * - Parameter configuration
 */
```

## 🔧 Development

### Creating a New Version

1. Make changes to `generate-marketing-spreadsheet.current.ts`
2. Run `pnpm cli create` to create a new version
3. The CLI will automatically:
   - Determine the next version number
   - Create a copy in the versions directory
   - Update the version information

### Building and Running

```bash
# Build the project
pnpm build

# Run a specific version
pnpm cli run <version>
```

## 📊 Spreadsheet Structure

Each generated spreadsheet includes:

1. Parameters Worksheet
   - Campaign configuration
   - Cost parameters
   - Conversion rates

2. Growth Projections
   - Weekly calculations
   - Monthly projections
   - Annual forecasts

3. Validation Checks
   - Data validation
   - Error checking
   - Warning indicators

## 🎨 Styling

The spreadsheet uses consistent styling:
- Headers: Bold with background color
- Input cells: Light background
- Results: Formatted numbers
- Warnings: Red text for negative values
- Growth: Green text for positive values

## 🔍 Version Control

The project uses a simple version control system:
- Current working version in `src/generate-marketing-spreadsheet.current.ts`
- Versioned copies in `src/versions/`
- CLI for managing versions
- Automatic version numbering

## 📝 Documentation

- Development documentation in `_DEV_MAN/`
- Version history in file headers
- CLI help with `pnpm cli`

## 🤝 Contributing

1. Make changes to the current version
2. Create a new version using the CLI
3. Update documentation
4. Test the changes
5. Submit a pull request

## 📄 License

This project is proprietary software owned by ONE52 Bar & Grill.

## 🔗 Dependencies

- Node.js: >= 16.0.0
- PNPM: >= 8.0.0
- ExcelJS: ^4.4.0
- TypeScript: ^5.3.3

## 📝 Development Notes

### Package Management

This project uses PNPM for dependency management. Key points:

- Always use `pnpm` instead of `npm` or `yarn`
- The project includes a preinstall script that prevents using other package managers
- Workspace configuration is in `pnpm-workspace.yaml`
- Package manager settings are in `.npmrc`

### Common Commands

```bash
# Install dependencies
pnpm install

# Add a new dependency
pnpm add <package-name>

# Add a dev dependency
pnpm add -D <package-name>

# Run scripts
pnpm cli
pnpm build
pnpm test
``` 