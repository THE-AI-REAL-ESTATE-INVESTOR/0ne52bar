#!/usr/bin/env ts-node

/**
 * Prisma Integration Verification and Fix Script
 * 
 * This script analyzes the codebase to:
 * 1. Identify files that should be using Prisma
 * 2. Verify they're correctly using Prisma
 * 3. Fix any issues found
 * 4. Ensure proper connections for TapPass, Menu, and Events components
 */

import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);
const prisma = new PrismaClient();

// Configuration
const APP_ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(APP_ROOT, 'src');
const ACTIONS_DIR = path.join(SRC_DIR, 'actions');
const APP_DIR = path.join(SRC_DIR, 'app');

// Critical paths that should be using Prisma
const CRITICAL_PATHS = [
  {
    name: 'TapPass Actions',
    path: path.join(APP_DIR, 'tappass/actions.ts'),
    newPath: path.join(APP_DIR, 'tappass/actions.ts'),
    pattern: /JSON|tap-pass-members\.json/,
    shouldUsePrisma: true,
    componentType: 'tappass'
  },
  {
    name: 'TapPass Actions (Legacy Prisma)',
    path: path.join(APP_DIR, 'tappass/actions-prisma.ts'),
    pattern: null, // We'll check if this file exists and is used
    shouldUsePrisma: true,
    componentType: 'tappass'
  },
  {
    name: 'Menu Actions',
    path: path.join(ACTIONS_DIR, 'menuActions.ts'),
    pattern: /JSON|menu-items\.json/,
    shouldUsePrisma: true,
    componentType: 'menu'
  },
  {
    name: 'Event Actions',
    path: path.join(ACTIONS_DIR, 'eventActions.ts'),
    pattern: /JSON|events\.json/,
    shouldUsePrisma: true,
    componentType: 'events'
  }
];

// Issues tracking
interface Issue {
  file: string;
  type: 'missing' | 'using_json' | 'wrong_import' | 'unused';
  description: string;
  autoFixable: boolean;
}

const issues: Issue[] = [];

// Track what's been fixed
const fixes: { file: string; description: string }[] = [];

// Log utility
function log(message: string, type: 'info' | 'warn' | 'error' | 'success' = 'info'): void {
  const colors = {
    info: '\x1b[36m%s\x1b[0m', // Cyan
    warn: '\x1b[33m%s\x1b[0m', // Yellow
    error: '\x1b[31m%s\x1b[0m', // Red
    success: '\x1b[32m%s\x1b[0m' // Green
  };
  
  console.log(colors[type], message);
}

// Check if file exists
function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

// Read file content
function readFile(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    issues.push({
      file: filePath,
      type: 'missing',
      description: `File doesn't exist: ${filePath}`,
      autoFixable: false
    });
    return null;
  }
}

// Write file content
function writeFile(filePath: string, content: string): void {
  try {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    log(`Updated file: ${filePath}`, 'success');
  } catch (error) {
    log(`Failed to write to file: ${filePath}. Error: ${error}`, 'error');
  }
}

// Check for Prisma imports in a file
function checkPrismaImports(content: string): boolean {
  return /import.*PrismaClient.*from.*@prisma\/client/.test(content) || 
         /import.*prisma.*from.*lib\/prisma/.test(content);
}

// Check if a component file is using the right action file for Prisma
function checkComponentActionImports(filePath: string, componentType: string): void {
  const content = readFile(filePath);
  if (!content) return;
  
  const expectedImport = componentType === 'tappass' 
    ? 'actions-prisma' 
    : `${componentType}Actions`;
  
  if (!content.includes(expectedImport)) {
    issues.push({
      file: filePath,
      type: 'wrong_import',
      description: `Component is not importing the correct Prisma actions file`,
      autoFixable: true
    });
  }
}

// Find all component files that need to import actions
function findComponentFiles(): void {
  // Common component paths to check
  const componentPaths = [
    { dir: path.join(APP_DIR, 'tappass'), type: 'tappass' },
    { dir: path.join(APP_DIR, 'menu'), type: 'menu' },
    { dir: path.join(APP_DIR, 'events'), type: 'events' },
    { dir: path.join(APP_DIR, 'admin'), type: 'admin' }
  ];
  
  for (const { dir, type } of componentPaths) {
    if (fileExists(dir)) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
          const filePath = path.join(dir, file);
          checkComponentActionImports(filePath, type);
        }
      }
    }
  }
}

// Fix TapPass actions to use Prisma
function fixTapPassActions(): void {
  // Check if actions-prisma.ts exists
  const prismaTapPassPath = path.join(APP_DIR, 'tappass/actions-prisma.ts');
  const tapPassActionsPath = path.join(APP_DIR, 'tappass/actions.ts');
  
  if (fileExists(prismaTapPassPath)) {
    // If both files exist, update actions.ts to use actions-prisma.ts
    if (fileExists(tapPassActionsPath)) {
      const content = `/**
 * TapPass Actions
 * This file re-exports all functionality from actions-prisma.ts
 * to ensure all components use Prisma for data operations.
 */

export * from './actions-prisma';
`;
      writeFile(tapPassActionsPath, content);
      fixes.push({
        file: tapPassActionsPath,
        description: 'Updated to re-export from actions-prisma.ts'
      });
    }
  } else {
    // If actions-prisma.ts doesn't exist but actions.ts does, update actions.ts directly
    if (fileExists(tapPassActionsPath)) {
      const content = readFile(tapPassActionsPath);
      if (content) {
        // If it's not using Prisma, convert it
        if (!checkPrismaImports(content)) {
          // This is a simplified transformation that would need to be
          // tailored to the specific code in actions.ts
          const transformedContent = content
            .replace(/import.*tap-pass-members\.json.*/, `import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();`)
            .replace(/const TAP_PASS_DB_PATH.*/, '// Using Prisma instead of JSON file')
            .replace(/readMembersFromDB\(\).*{[\s\S]*?}/, `readMembersFromDB() {
  return prisma.member.findMany();
}`)
            .replace(/saveMembersToDB\(.*\).*{[\s\S]*?}/, `saveMembersToDB(members) {
  // With Prisma, we don't need to save the entire DB
  // Instead, individual operations will be performed
  return true;
}`)
            .replace(/getMemberByEmail\(.*\).*{[\s\S]*?}/, `getMemberByEmail(email) {
  return prisma.member.findUnique({
    where: { email }
  });
}`)
            .replace(/registerTapPassMember\(.*\).*{[\s\S]*?}/, `registerTapPassMember(formData) {
  // Extract form data
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const birthday = formData.get('birthday') as string;
  const phoneNumber = formData.get('phoneNumber') as string;
  const agreeToTerms = formData.get('agreeToTerms') === 'true';
  
  // Generate a member ID
  const randomPart = Math.floor(1000 + Math.random() * 9000).toString();
  
  // Get the last member to determine sequential ID
  return prisma.member.create({
    data: {
      name,
      email,
      birthday: new Date(birthday),
      phoneNumber,
      agreeToTerms,
      memberId: \`ONE52-\${randomPart}-0001\`, // This logic might need to be improved
      membershipLevel: 'BRONZE',
      joinDate: new Date(),
      points: 0,
      visits: 0
    }
  })
  .then(member => ({
    success: true,
    memberId: member.memberId,
  }))
  .catch(error => ({
    success: false,
    error: error.message,
  }));
}`);
          
          writeFile(tapPassActionsPath, transformedContent);
          fixes.push({
            file: tapPassActionsPath,
            description: 'Updated to use Prisma instead of JSON'
          });
        }
      }
    } else {
      // If neither file exists, create a new actions.ts with Prisma
      const content = `/**
 * TapPass Actions
 * Server actions for TapPass membership functionality
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get a member by email
 */
export async function getMemberByEmail(email: string) {
  try {
    const member = await prisma.member.findUnique({
      where: { email }
    });
    
    return {
      success: true,
      member
    };
  } catch (error: any) {
    console.error('Error getting member by email:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Register a new TapPass member
 */
export async function registerTapPassMember(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const birthday = formData.get('birthday') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const agreeToTerms = formData.get('agreeToTerms') === 'true';
    
    // Check for required fields
    if (!name || !email || !birthday || !phoneNumber) {
      return {
        success: false,
        error: 'Missing required fields'
      };
    }
    
    // Check if member already exists
    const existingMember = await prisma.member.findUnique({
      where: { email }
    });
    
    if (existingMember) {
      return {
        success: true,
        memberId: existingMember.memberId
      };
    }
    
    // Generate member ID parts
    const randomPart = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Get count for sequential ID
    const memberCount = await prisma.member.count();
    const sequentialId = (memberCount + 1).toString().padStart(4, '0');
    
    const memberId = \`ONE52-\${randomPart}-\${sequentialId}\`;
    
    // Create the new member
    const newMember = await prisma.member.create({
      data: {
        memberId,
        name,
        email,
        phoneNumber,
        birthday: new Date(birthday),
        agreeToTerms,
        membershipLevel: 'BRONZE',
        joinDate: new Date(),
        points: 0,
        visits: 0
      }
    });
    
    return {
      success: true,
      memberId: newMember.memberId
    };
  } catch (error: any) {
    console.error('Error registering member:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Email a membership card to a member
 */
export async function emailMembershipCard(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const memberId = formData.get('memberId') as string;
    
    // In a real implementation, you would send an email here
    // For now, we'll just log it
    console.log(\`Sending membership card to \${email} for member \${memberId}\`);
    
    // TODO: Implement actual email sending logic
    
    return {
      success: true
    };
  } catch (error: any) {
    console.error('Error emailing membership card:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
`;
      writeFile(tapPassActionsPath, content);
      fixes.push({
        file: tapPassActionsPath,
        description: 'Created new TapPass actions file with Prisma integration'
      });
    }
  }
}

// Fix Menu actions to use Prisma
function fixMenuActions(): void {
  const menuActionsPath = path.join(ACTIONS_DIR, 'menuActions.ts');
  
  if (!fileExists(menuActionsPath)) {
    // Create a new menu actions file
    const content = `/**
 * Menu Actions
 * Server actions for menu functionality
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get all menu items
 */
export async function getMenuItems() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      orderBy: { category: 'asc' }
    });
    
    return {
      success: true,
      menuItems
    };
  } catch (error: any) {
    console.error('Error getting menu items:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get menu items by category
 */
export async function getMenuItemsByCategory(category: string) {
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: { category },
      orderBy: { name: 'asc' }
    });
    
    return {
      success: true,
      menuItems
    };
  } catch (error: any) {
    console.error('Error getting menu items by category:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get all categories
 */
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    
    return {
      success: true,
      categories
    };
  } catch (error: any) {
    console.error('Error getting categories:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Add a menu item
 */
export async function addMenuItem(name: string, price: string, category: string, description?: string) {
  try {
    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        price,
        category,
        description
      }
    });
    
    return {
      success: true,
      menuItem
    };
  } catch (error: any) {
    console.error('Error adding menu item:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Update a menu item
 */
export async function updateMenuItem(id: string, data: { name?: string, price?: string, category?: string, description?: string }) {
  try {
    const menuItem = await prisma.menuItem.update({
      where: { id },
      data
    });
    
    return {
      success: true,
      menuItem
    };
  } catch (error: any) {
    console.error('Error updating menu item:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Delete a menu item
 */
export async function deleteMenuItem(id: string) {
  try {
    await prisma.menuItem.delete({
      where: { id }
    });
    
    return {
      success: true
    };
  } catch (error: any) {
    console.error('Error deleting menu item:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
`;
    writeFile(menuActionsPath, content);
    fixes.push({
      file: menuActionsPath,
      description: 'Created new Menu actions file with Prisma integration'
    });
  } else {
    // Update existing menu actions file if needed
    const content = readFile(menuActionsPath);
    if (content && !checkPrismaImports(content)) {
      // This would need to be tailored to the specific content
      const transformedContent = content
        .replace(/import.*menu-items\.json.*/, `import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();`)
        .replace(/readMenuFromFile\(\).*{[\s\S]*?}/, `async function getMenuItems() {
  return prisma.menuItem.findMany();
}`)
        // Add more replacements as needed
      
      writeFile(menuActionsPath, transformedContent);
      fixes.push({
        file: menuActionsPath,
        description: 'Updated to use Prisma instead of JSON'
      });
    }
  }
}

// Fix Event actions to use Prisma
function fixEventActions(): void {
  const eventActionsPath = path.join(ACTIONS_DIR, 'eventActions.ts');
  
  if (!fileExists(eventActionsPath)) {
    // Create a new event actions file
    const content = `/**
 * Event Actions
 * Server actions for event functionality
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get all events
 */
export async function getEvents() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' },
      include: { EventTag: true }
    });
    
    return {
      success: true,
      events
    };
  } catch (error: any) {
    console.error('Error getting events:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get event by ID
 */
export async function getEventById(id: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: { EventTag: true }
    });
    
    return {
      success: true,
      event
    };
  } catch (error: any) {
    console.error('Error getting event:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Add a new event
 */
export async function addEvent(data: {
  title: string;
  date: string;
  time: string;
  description: string;
  image: string;
  facebookEventUrl?: string;
  eventTagId?: string;
}) {
  try {
    const event = await prisma.event.create({
      data
    });
    
    return {
      success: true,
      event
    };
  } catch (error: any) {
    console.error('Error adding event:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Update an event
 */
export async function updateEvent(id: string, data: {
  title?: string;
  date?: string;
  time?: string;
  description?: string;
  image?: string;
  facebookEventUrl?: string;
  eventTagId?: string;
}) {
  try {
    const event = await prisma.event.update({
      where: { id },
      data
    });
    
    return {
      success: true,
      event
    };
  } catch (error: any) {
    console.error('Error updating event:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Delete an event
 */
export async function deleteEvent(id: string) {
  try {
    await prisma.event.delete({
      where: { id }
    });
    
    return {
      success: true
    };
  } catch (error: any) {
    console.error('Error deleting event:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get all event tags
 */
export async function getEventTags() {
  try {
    const tags = await prisma.eventTag.findMany();
    
    return {
      success: true,
      tags
    };
  } catch (error: any) {
    console.error('Error getting event tags:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Register attendance for an event
 */
export async function registerEventAttendance(eventId: string, data: {
  name: string;
  email: string;
  guestCount: number;
}) {
  try {
    const { name, email, guestCount } = data;
    
    const attendance = await prisma.eventAttendee.create({
      data: {
        name,
        email,
        guestCount,
        eventId,
        registeredAt: new Date()
      }
    });
    
    return {
      success: true,
      attendance
    };
  } catch (error: any) {
    console.error('Error registering event attendance:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
`;
    writeFile(eventActionsPath, content);
    fixes.push({
      file: eventActionsPath,
      description: 'Created new Event actions file with Prisma integration'
    });
  } else {
    // Update existing event actions file if needed
    const content = readFile(eventActionsPath);
    if (content && !checkPrismaImports(content)) {
      // This would need to be tailored to the specific content
      const transformedContent = content
        .replace(/import.*events\.json.*/, `import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();`)
        .replace(/readEventsFromFile\(\).*{[\s\S]*?}/, `async function getEvents() {
  return prisma.event.findMany();
}`)
        // Add more replacements as needed
      
      writeFile(eventActionsPath, transformedContent);
      fixes.push({
        file: eventActionsPath,
        description: 'Updated to use Prisma instead of JSON'
      });
    }
  }
}

// Update import statements in component files
function fixComponentImports(): void {
  // TapPass page
  const tapPassPagePath = path.join(APP_DIR, 'tappass/page.tsx');
  if (fileExists(tapPassPagePath)) {
    const content = readFile(tapPassPagePath);
    if (content) {
      // If it's importing actions-prisma, rename to just actions
      // If it's not importing any actions, add the import
      let transformedContent = content;
      
      if (content.includes('import') && content.includes('actions-prisma')) {
        transformedContent = content.replace(
          /import.*from.*['"](\.\/actions-prisma)['"]/,
          `import { registerTapPassMember, emailMembershipCard, getMemberByEmail } from './actions'`
        );
      } else if (!content.includes('import') || !content.includes('./actions')) {
        // Find the last import statement
        const lastImportIndex = content.lastIndexOf('import');
        if (lastImportIndex !== -1) {
          const endOfImportIndex = content.indexOf('\n', lastImportIndex);
          if (endOfImportIndex !== -1) {
            transformedContent = 
              content.substring(0, endOfImportIndex + 1) +
              `import { registerTapPassMember, emailMembershipCard, getMemberByEmail } from './actions';\n` +
              content.substring(endOfImportIndex + 1);
          }
        }
      }
      
      writeFile(tapPassPagePath, transformedContent);
      fixes.push({
        file: tapPassPagePath,
        description: 'Updated imports to use actions instead of actions-prisma'
      });
    }
  }
  
  // Similar updates could be done for menu and events pages
}

// Check if any models need to be created in Prisma
async function checkPrismaMigration(): Promise<void> {
  // Check if tables exist in the database
  try {
    log('Checking database tables...', 'info');
    
    // Check if members table exists by trying to count
    try {
      await prisma.$queryRaw`SELECT COUNT(*) FROM "Member"`;
      log('Members table exists', 'success');
    } catch {
      log('Members table might not exist, need to run migration', 'warn');
      issues.push({
        file: 'prisma/schema.prisma',
        type: 'missing',
        description: 'Members table does not exist in database. Need to run migration.',
        autoFixable: true
      });
    }
    
    // Check for menu items
    try {
      await prisma.$queryRaw`SELECT COUNT(*) FROM "MenuItem"`;
      log('Menu items table exists', 'success');
    } catch {
      log('Menu items table might not exist, need to run migration', 'warn');
      issues.push({
        file: 'prisma/schema.prisma',
        type: 'missing',
        description: 'MenuItem table does not exist in database. Need to run migration.',
        autoFixable: true
      });
    }
    
    // Check for events
    try {
      await prisma.$queryRaw`SELECT COUNT(*) FROM "Event"`;
      log('Events table exists', 'success');
    } catch {
      log('Events table might not exist, need to run migration', 'warn');
      issues.push({
        file: 'prisma/schema.prisma',
        type: 'missing',
        description: 'Event table does not exist in database. Need to run migration.',
        autoFixable: true
      });
    }
  } catch (error) {
    log(`Error checking database tables: ${error}`, 'error');
  }
}

// Run Prisma migration if needed
async function runPrismaMigration(): Promise<void> {
  try {
    log('Running Prisma migration...', 'info');
    
    // Generate Prisma client
    await execPromise('npx prisma generate');
    log('Prisma client generated', 'success');
    
    // Run migration
    await execPromise('npx prisma migrate dev --name initialize_db');
    log('Prisma migration completed', 'success');
  } catch (error) {
    log(`Error running Prisma migration: ${error}`, 'error');
  }
}

// Seed the database with initial data if empty
async function seedDatabaseIfEmpty(): Promise<void> {
  try {
    // Check if we have menu items
    const menuItemCount = await prisma.menuItem.count();
    if (menuItemCount === 0) {
      log('No menu items found, seeding sample data...', 'info');
      
      // Create categories
      await prisma.category.createMany({
        data: [
          { name: 'Appetizers' },
          { name: 'Main Courses' },
          { name: 'Desserts' },
          { name: 'Drinks' }
        ],
        skipDuplicates: true
      });
      
      // Create sample menu items
      await prisma.menuItem.createMany({
        data: [
          { name: 'Buffalo Wings', price: '12.99', category: 'Appetizers', description: 'Spicy buffalo wings with blue cheese dip' },
          { name: 'Nachos', price: '9.99', category: 'Appetizers', description: 'Loaded nachos with cheese, jalapeños, and salsa' },
          { name: 'Burger', price: '14.99', category: 'Main Courses', description: 'Classic burger with fries' },
          { name: 'Steak', price: '24.99', category: 'Main Courses', description: '8oz ribeye steak with vegetables' },
          { name: 'Cheesecake', price: '7.99', category: 'Desserts', description: 'New York style cheesecake' },
          { name: 'Beer (Pint)', price: '5.99', category: 'Drinks', description: 'House draft beer' },
          { name: 'Cocktail', price: '8.99', category: 'Drinks', description: 'Signature cocktail' }
        ]
      });
      
      log('Sample menu items seeded', 'success');
    }
    
    // Check if we have events
    const eventCount = await prisma.event.count();
    if (eventCount === 0) {
      log('No events found, seeding sample data...', 'info');
      
      // Create event tags
      await prisma.eventTag.createMany({
        data: [
          { name: 'Live Music', color: '#3b82f6' },
          { name: 'Sports', color: '#10b981' },
          { name: 'Special', color: '#f59e0b' }
        ],
        skipDuplicates: true
      });
      
      // Get tags
      const tags = await prisma.eventTag.findMany();
      
      // Create sample events
      await prisma.event.createMany({
        data: [
          { 
            title: 'Saturday Night Live Music', 
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
            time: '8:00 PM',
            description: 'Join us for live music every Saturday night!',
            image: '/images/events/live-music.jpg',
            eventTagId: tags.find(t => t.name === 'Live Music')?.id
          },
          { 
            title: 'Sunday Football', 
            date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
            time: '1:00 PM',
            description: 'Watch the game on our big screens with special drink deals!',
            image: '/images/events/football.jpg',
            eventTagId: tags.find(t => t.name === 'Sports')?.id
          },
          { 
            title: 'Anniversary Party', 
            date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
            time: '7:00 PM',
            description: 'Celebrating our 5th anniversary with special offers and live entertainment!',
            image: '/images/events/anniversary.jpg',
            eventTagId: tags.find(t => t.name === 'Special')?.id
          }
        ]
      });
      
      log('Sample events seeded', 'success');
    }
  } catch (error) {
    log(`Error seeding database: ${error}`, 'error');
  }
}

// Fix all issues
async function fixAllIssues(): Promise<void> {
  log('Starting fixes...', 'info');
  
  // Fix TapPass actions
  fixTapPassActions();
  
  // Fix Menu actions
  fixMenuActions();
  
  // Fix Event actions
  fixEventActions();
  
  // Fix component imports
  fixComponentImports();
  
  // Check if migration is needed
  await checkPrismaMigration();
  
  // Run migration if needed
  const needsMigration = issues.some(issue => 
    issue.file === 'prisma/schema.prisma' && issue.type === 'missing');
  
  if (needsMigration) {
    await runPrismaMigration();
  }
  
  // Seed database with initial data if empty
  await seedDatabaseIfEmpty();
  
  log('Fixes completed!', 'success');
}

// Main function
async function main(): Promise<void> {
  log('Prisma Integration Verification and Fix Script', 'info');
  log('Checking codebase for Prisma integration issues...', 'info');
  
  // First, check critical paths
  for (const path of CRITICAL_PATHS) {
    if (fileExists(path.path)) {
      log(`Checking ${path.name}...`, 'info');
      const content = readFile(path.path);
      
      if (content && path.pattern && path.pattern.test(content)) {
        issues.push({
          file: path.path,
          type: 'using_json',
          description: `${path.name} is still using JSON instead of Prisma`,
          autoFixable: true
        });
      } else if (content && path.shouldUsePrisma && !checkPrismaImports(content)) {
        issues.push({
          file: path.path,
          type: 'wrong_import',
          description: `${path.name} is not importing Prisma correctly`,
          autoFixable: true
        });
      }
    } else if (path.shouldUsePrisma) {
      issues.push({
        file: path.path,
        type: 'missing',
        description: `${path.name} file is missing`,
        autoFixable: true
      });
    }
  }
  
  // Find component files and check their imports
  findComponentFiles();
  
  // Report issues
  if (issues.length === 0) {
    log('No Prisma integration issues found!', 'success');
  } else {
    log(`Found ${issues.length} issues:`, 'warn');
    issues.forEach((issue, index) => {
      log(`${index + 1}. ${issue.file}: ${issue.description} (${issue.autoFixable ? 'Auto-fixable' : 'Manual fix required'})`, 'warn');
    });
    
    // Fix issues
    await fixAllIssues();
    
    // Report fixes
    log(`Applied ${fixes.length} fixes:`, 'success');
    fixes.forEach((fix, index) => {
      log(`${index + 1}. ${fix.file}: ${fix.description}`, 'success');
    });
  }
  
  log('Disconnecting from the database...', 'info');
  await prisma.$disconnect();
  log('Script completed!', 'success');
}

// Run the script
main()
  .catch(error => {
    log(`Unhandled error: ${error}`, 'error');
    return prisma.$disconnect().then(() => {
      process.exit(1);
    });
  }); 