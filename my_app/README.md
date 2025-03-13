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

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/152bar.git
   cd 152bar/my_app
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with the following variables:
   ```
   FACEBOOK_APP_ID=your_facebook_app_id
   FACEBOOK_APP_SECRET=your_facebook_app_secret
   FACEBOOK_PAGE_ID=your_facebook_page_id
   FACEBOOK_PAGE_TOKEN=your_long_lived_page_token
   
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your_password
   ```

### Development

Start the development server:
```bash
pnpm dev
```

### Building for Production

Build the application:
```bash
pnpm build
```

To start the production server (from the my_app directory):
```bash
pnpm start
```

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

## Troubleshooting

### Build Issues

If you encounter CSS-related errors during build:
- Make sure your CSS imports are correctly set up
- Use the dynamic export for pages with CSS imports: `export const dynamic = 'force-dynamic'`

### Type Errors

Run with TypeScript checking disabled if needed:
```bash
pnpm build -- --no-typecheck
```

## License

[MIT License](LICENSE)

## Contact

For questions or support, please contact [your-email@example.com](mailto:your-email@example.com)

## Facebook Integration

This app integrates with Facebook to display events from your Facebook page. Follow these steps to set up:

### Development Mode
During development, the app uses mock data. You can preview this by running:

```bash
npm run use-mock-events
```

### Production Mode with Real Facebook Data

1. **Generate a secure Facebook API URL with appsecret_proof**:
   ```bash
   npm run generate-proof
   ```
   - Enter your User Access Token from the [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
   - Follow the instructions to obtain your Page Access Token

2. **Save your Page Access Token**:
   ```bash
   npm run save-page-token
   ```
   - This will save the token to your `.env.local` file

3. **Test your token**:
   ```bash
   npm run test-page-token
   ```
   - Confirms your token has the right permissions and can access your page data

4. **Start the app with real data**:
   ```bash
   npm run dev
   ```
   - Visit the events page and toggle "Using API data" to use real Facebook data

### Troubleshooting

- If you encounter a "`appsecret_proof` required" error:
  - Use the `npm run generate-proof` script to generate a secure URL
  - Make sure both your App Secret and Page Access Token are in `.env.local`

- If no events are showing:
  - Verify your Facebook page has public events created
  - Check your Page ID is correct in `.env.local`
  - Ensure your token has the `pages_read_engagement` permission

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
