# 152 Bar & Restaurant Web Application

A Next.js 15 application for 152 Bar & Restaurant, featuring event management, menu display, and an admin dashboard.

## Overview

This application serves as the website for 152 Bar & Restaurant, providing visitors with information about events, menus, and the establishment, while also offering admin functionality for staff to manage content.

The application uses Next.js 15 with a hybrid approach:
- Server-rendered pages for public content
- Client-side navigation for the admin interface
- Dynamic routing for event pages and other content

## Features

- **Public Pages**
  - Home page with overview and navigation
  - Events listing and individual event details
  - Menu display
  - About us information
  - One52 Stories section
  - TapPass information
  - Terms of Service and Privacy Policy
  
- **Admin Dashboard**
  - Secure login with Next-Auth
  - Event management (create, edit, delete)
  - Menu management
  - Facebook integration for events
  - Settings and configuration

- **Technical Features**
  - Dynamic routing
  - Server and client components
  - Facebook API integration
  - Responsive design
  - TypeScript for type safety

## Technology Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Authentication**: NextAuth.js
- **API Integration**: Facebook Graph API
- **Type Safety**: TypeScript
- **Package Management**: pnpm

## Project Structure

```
my_app/
├── src/
│   ├── app/                  # Next.js app directory
│   │   ├── api/              # API routes
│   │   ├── client-app/       # Client-side SPA
│   │   ├── admin/            # Admin pages
│   │   ├── events/           # Event pages
│   │   ├── menu/             # Menu page
│   │   └── ...               # Other pages
│   ├── components/           # Reusable React components
│   ├── lib/                  # Utility functions
│   └── services/             # External service integrations
├── public/                   # Static assets
├── next.config.mjs           # Next.js configuration
└── package.json              # Project dependencies
```

## Next.js 15 Specifics

This project uses Next.js 15, which has some important differences from earlier versions:

- Uses the App Router
- Server and Client Components
- Improved routing system
- Dynamic rendering with `dynamic = 'force-dynamic'`
- CSS handling improvements

## License

[MIT License](LICENSE)

## Contact

For questions or support, please contact [your-email@example.com](mailto:your-email@example.com)

## Facebook Integration

This app integrates with Facebook to display events from your Facebook page.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## TypeScript to Prisma Schema Generation

This project uses the [ts2prisma](https://www.npmjs.com/package/ts2prisma) package to automatically generate Prisma schema files from TypeScript type definitions.

### Usage

```bash
# Generate schema from TypeScript files
npm run generate-schema

# Run with watch mode (automatically regenerate on file changes)
npm run generate-schema:watch
```

### Configuration

We use a `.prisma-ts-generator.json` file in the project root to configure ts2prisma:

```json
{
  "rootDir": "./src/types",
  "outputPath": "./prisma/schema.prisma",
  "dbProvider": "sqlite",
  "watch": {
    "enabled": true,
    "usePolling": true,
    "pollInterval": 1000
  },
  "includeComments": true,
  "preserveDirectives": true,
  "excludePatterns": ["node_modules", ".next", "dist"],
  "verbose": true
}
```

### Known Issues

When running in watch mode, the tool may display:

```
Watched directories:
  No directories are being watched! Check your watch pattern.
```

Despite this message, the watch mode will still detect file changes and regenerate the schema. This is an issue in the underlying chokidar configuration.

### Workaround

If the watch mode isn't working as expected, you can use the following approach:

1. Make sure you have the correct `.prisma-ts-generator.json` configuration
2. Use the `--dir` flag to specify the exact directory
3. Use the `usePolling: true` option in the config for more reliable detection
4. Try running the watcher in a separate terminal window

### Contributing

We've submitted a feature request to improve the watch mode in ts2prisma. You can follow progress on the [GitHub repository](https://github.com/THE-AI-REAL-ESTATE-INVESTOR/ts2prisma).

## Testing

This project uses Jest for unit testing. The tests are organized by feature, with separate test files for each server action file.

### Running Tests

To run all tests:

```bash
pnpm test
```

To run specific test files:

```bash
pnpm test -- src/actions/tapPassMember.test.ts
```

To run tests in watch mode:

```bash
pnpm test -- --watch
```

### Setting Up Testing Environment

To set up the testing environment:

```bash
./scripts/setup-jest.sh
```

This script will:
1. Install all necessary dependencies
2. Update package.json with test scripts
3. Set up the testing environment

### Fixing Dependency Issues

If you encounter module not found errors during testing, run:

```bash
pnpm exec ts-node scripts/fix-dependencies.ts
```

This script will scan your project for missing dependencies and install them automatically.

### Testing Documentation

For more detailed information about testing, see:
- [Jest Testing Guide](./scripts/JEST-TESTING-GUIDE.md)
