#!/usr/bin/env ts-node
/**
 * Database Needs Analysis Script
 * 
 * This script analyzes your Prisma schema and codebase to:
 * 1. Extract all models from the Prisma schema
 * 2. Scan the codebase for components/pages that might need database access
 * 3. Generate a report of which server actions or API routes need to be created
 * 4. Optionally generate starter templates for server actions
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';

// Configuration
const PRISMA_SCHEMA_PATH = path.join(process.cwd(), 'prisma/schema.prisma');
const SRC_DIR = path.join(process.cwd(), 'src');
const ADMIN_DIR = path.join(SRC_DIR, 'app/admin');
const SERVER_ACTIONS_DIR = path.join(SRC_DIR, 'app/actions');
const TEMPLATE_DIR = path.join(process.cwd(), 'scripts/templates');
const OUTPUT_REPORT = path.join(process.cwd(), 'scripts/database-needs-report.md');

// Make sure the necessary directories exist
if (!fs.existsSync(SERVER_ACTIONS_DIR)) {
  fs.mkdirSync(SERVER_ACTIONS_DIR, { recursive: true });
}

if (!fs.existsSync(TEMPLATE_DIR)) {
  fs.mkdirSync(TEMPLATE_DIR, { recursive: true });
}

// Types
interface PrismaModel {
  name: string;
  fields: string[];
  isTestModel: boolean;
  usedInPages: string[];
  needsServerActions: boolean;
  adminPage?: string;
}

// Extract models from Prisma schema
function extractModelsFromSchema(): PrismaModel[] {
  console.log(chalk.blue('📊 Extracting models from Prisma schema...'));
  
  const schemaContent = fs.readFileSync(PRISMA_SCHEMA_PATH, 'utf8');
  const modelRegex = /model\s+(\w+)\s+\{([^}]+)\}/g;
  const fieldRegex = /\s+(\w+)\s+/g;
  
  const models: PrismaModel[] = [];
  let match;
  
  while ((match = modelRegex.exec(schemaContent)) !== null) {
    const modelName = match[1];
    const modelContent = match[2];
    
    // Extract fields
    const fields: string[] = [];
    let fieldMatch;
    const fieldContent = modelContent.replace(/\/\/.*$/gm, ''); // Remove comments
    
    while ((fieldMatch = fieldRegex.exec(fieldContent)) !== null) {
      fields.push(fieldMatch[1]);
    }
    
    // Check if this is a test model
    const isTestModel = modelName.startsWith('Test') || 
                       modelContent.includes('/// TEST MODEL') ||
                       schemaContent.includes(`/// ${modelName} is a test model`);
    
    models.push({
      name: modelName,
      fields,
      isTestModel,
      usedInPages: [],
      needsServerActions: false
    });
  }
  
  console.log(chalk.green(`✅ Found ${models.length} models in Prisma schema`));
  return models;
}

// Scan codebase for usage of models
function scanCodebaseForUsage(models: PrismaModel[]): PrismaModel[] {
  console.log(chalk.blue('🔍 Scanning codebase for model usage...'));
  
  // Create a map for quick lookup
  const modelMap = new Map<string, PrismaModel>();
  models.forEach(model => modelMap.set(model.name, model));
  
  // Find all TypeScript/React files in the src directory
  const findCmd = `find ${SRC_DIR} -type f -name "*.tsx" -o -name "*.ts" | grep -v "node_modules" | grep -v ".next"`;
  const files = execSync(findCmd).toString().split('\n').filter(Boolean);
  
  console.log(chalk.blue(`🔍 Scanning ${files.length} files...`));
  
  files.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(process.cwd(), filePath);
      
      // Check for each model in the file
      models.forEach(model => {
        // Skip test models for usage scanning
        if (model.isTestModel) return;
        
        // Different patterns to check for model usage
        const patterns = [
          `interface ${model.name}`,
          `type ${model.name}`,
          `import { ${model.name} }`,
          `const ${model.name.toLowerCase()}:`,
          `function ${model.name}`,
          `class ${model.name}`,
          `${model.name}\\[\\]`,
          `${model.name}\\s+\\|`,
          `${model.name}\\s+&`
        ];
        
        // Check all patterns
        for (const pattern of patterns) {
          if (new RegExp(pattern).test(content)) {
            model.usedInPages.push(relativePath);
            
            // Check if this is an admin page
            if (filePath.includes('/admin/') && filePath.includes('page.tsx')) {
              model.adminPage = relativePath;
              model.needsServerActions = true;
            }
            
            // If used in a form component, likely needs server actions
            if (content.includes('form') && 
                (content.includes('onSubmit') || content.includes('handleSubmit'))) {
              model.needsServerActions = true;
            }
            
            break;
          }
        }
      });
    } catch (err) {
      console.error(chalk.red(`Error reading file ${filePath}:`), err);
    }
  });
  
  // Check for existing server actions
  console.log(chalk.blue('🔍 Checking for existing server actions...'));
  
  if (fs.existsSync(SERVER_ACTIONS_DIR)) {
    const actionFiles = fs.readdirSync(SERVER_ACTIONS_DIR);
    
    models.forEach(model => {
      const modelNameLower = model.name.toLowerCase();
      const hasServerAction = actionFiles.some(file => 
        file.toLowerCase().includes(modelNameLower)
      );
      
      if (hasServerAction) {
        console.log(chalk.yellow(`ℹ️ Found existing server actions for ${model.name}`));
      } else if (model.needsServerActions) {
        console.log(chalk.yellow(`⚠️ No server actions found for ${model.name}, but they seem to be needed`));
      }
    });
  }
  
  return models;
}

// Generate a report
function generateReport(models: PrismaModel[]): void {
  console.log(chalk.blue('📝 Generating report...'));
  
  const standardModels = models.filter(m => !m.isTestModel);
  const testModels = models.filter(m => m.isTestModel);
  const modelsNeedingActions = standardModels.filter(m => m.needsServerActions);
  
  let report = `# Database Implementation Needs Report
Generated on: ${new Date().toISOString()}

## Summary

- Total Prisma Models: ${models.length}
- Standard Models: ${standardModels.length}
- Test Models: ${testModels.length}
- Models Needing Server Actions: ${modelsNeedingActions.length}

## Models Needing Server Actions

${modelsNeedingActions.map(model => `
### ${model.name}

- Fields: ${model.fields.join(', ')}
- Used in Pages: ${model.usedInPages.length > 0 ? model.usedInPages.join(', ') : 'None found'}
- Admin Page: ${model.adminPage || 'None found'}
- Server Actions Needed: CREATE, READ, UPDATE, DELETE

\`\`\`typescript
// Sample server action for ${model.name}
export async function create${model.name}(data: ${model.name}CreateInput): Promise<${model.name}> {
  // Implementation
}

export async function get${model.name}(id: string): Promise<${model.name} | null> {
  // Implementation
}

export async function update${model.name}(id: string, data: ${model.name}UpdateInput): Promise<${model.name}> {
  // Implementation
}

export async function delete${model.name}(id: string): Promise<${model.name}> {
  // Implementation
}
\`\`\`
`).join('')}

## All Models

${standardModels.map((model, index) => `
${index + 1}. **${model.name}**
   - Needs Server Actions: ${model.needsServerActions ? '✅' : '❌'}
   - Used in Pages: ${model.usedInPages.length}
`).join('')}

## Test Models

${testModels.length > 0 ? testModels.map((model, index) => `
${index + 1}. **${model.name}**
`).join('') : 'No test models found.'}

## Next Steps

1. Create server action files for each model needing actions
2. Implement basic CRUD operations
3. Connect admin UI to server actions
4. Test each implementation
5. Create migrations as needed

`;

  fs.writeFileSync(OUTPUT_REPORT, report);
  console.log(chalk.green(`✅ Report generated: ${OUTPUT_REPORT}`));
}

// Generate template for server actions
function generateServerActionTemplate(model: PrismaModel): void {
  if (!model.needsServerActions || model.isTestModel) return;
  
  const actionFileName = `${model.name.toLowerCase()}-actions.ts`;
  const actionFilePath = path.join(SERVER_ACTIONS_DIR, actionFileName);
  
  // Check if file already exists
  if (fs.existsSync(actionFilePath)) {
    console.log(chalk.yellow(`⚠️ Server action file already exists: ${actionFilePath}`));
    return;
  }
  
  const template = `"use server";

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Validation schemas
const ${model.name}Schema = z.object({
  // TODO: Define validation schema based on model fields
  ${model.fields.map(field => `// ${field}: z.string(),`).join('\n  ')}
});

type ${model.name}Input = z.infer<typeof ${model.name}Schema>;

/**
 * Create a new ${model.name}
 */
export async function create${model.name}(data: ${model.name}Input) {
  // Validate input
  const validated = ${model.name}Schema.parse(data);
  
  try {
    // Create record
    const result = await prisma.${model.name.toLowerCase()}.create({
      data: validated,
    });
    
    // Revalidate related paths
    revalidatePath('/admin/${model.name.toLowerCase()}');
    
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error creating ${model.name}:", error);
    return { 
      success: false, 
      error: error.message || "Failed to create ${model.name}" 
    };
  }
}

/**
 * Get a ${model.name} by ID
 */
export async function get${model.name}(id: string) {
  try {
    const result = await prisma.${model.name.toLowerCase()}.findUnique({
      where: { id },
    });
    
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error fetching ${model.name}:", error);
    return { 
      success: false, 
      error: error.message || "Failed to fetch ${model.name}" 
    };
  }
}

/**
 * Get all ${model.name} records
 */
export async function getAll${model.name}s(options?: { 
  page?: number; 
  limit?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}) {
  const { page = 1, limit = 10, orderBy = 'createdAt', orderDirection = 'desc' } = options || {};
  const skip = (page - 1) * limit;
  
  try {
    const [results, total] = await Promise.all([
      prisma.${model.name.toLowerCase()}.findMany({
        skip,
        take: limit,
        orderBy: { [orderBy]: orderDirection },
      }),
      prisma.${model.name.toLowerCase()}.count(),
    ]);
    
    return { 
      success: true, 
      data: results,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    };
  } catch (error: any) {
    console.error("Error fetching ${model.name}s:", error);
    return { 
      success: false, 
      error: error.message || "Failed to fetch ${model.name}s" 
    };
  }
}

/**
 * Update a ${model.name}
 */
export async function update${model.name}(id: string, data: Partial<${model.name}Input>) {
  try {
    // Validate input (partial validation)
    const validated = ${model.name}Schema.partial().parse(data);
    
    const result = await prisma.${model.name.toLowerCase()}.update({
      where: { id },
      data: validated,
    });
    
    // Revalidate related paths
    revalidatePath('/admin/${model.name.toLowerCase()}');
    
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error updating ${model.name}:", error);
    return { 
      success: false, 
      error: error.message || "Failed to update ${model.name}" 
    };
  }
}

/**
 * Delete a ${model.name}
 */
export async function delete${model.name}(id: string) {
  try {
    const result = await prisma.${model.name.toLowerCase()}.delete({
      where: { id },
    });
    
    // Revalidate related paths
    revalidatePath('/admin/${model.name.toLowerCase()}');
    
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error deleting ${model.name}:", error);
    return { 
      success: false, 
      error: error.message || "Failed to delete ${model.name}" 
    };
  }
}
`;

  fs.writeFileSync(actionFilePath, template);
  console.log(chalk.green(`✅ Generated server action template: ${actionFilePath}`));
}

// Generate all templates
function generateAllTemplates(models: PrismaModel[]): void {
  console.log(chalk.blue('🔧 Generating server action templates...'));
  
  // Create template directory if it doesn't exist
  if (!fs.existsSync(TEMPLATE_DIR)) {
    fs.mkdirSync(TEMPLATE_DIR, { recursive: true });
  }
  
  // Generate prisma client helper if it doesn't exist
  const prismaHelperPath = path.join(SRC_DIR, 'lib/prisma.ts');
  if (!fs.existsSync(prismaHelperPath)) {
    const prismaHelperDir = path.dirname(prismaHelperPath);
    if (!fs.existsSync(prismaHelperDir)) {
      fs.mkdirSync(prismaHelperDir, { recursive: true });
    }
    
    const prismaHelperContent = `import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the \`global\` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
`;
    
    fs.writeFileSync(prismaHelperPath, prismaHelperContent);
    console.log(chalk.green(`✅ Generated Prisma helper: ${prismaHelperPath}`));
  }
  
  // Generate server action templates for models that need them
  const modelsNeedingActions = models.filter(m => m.needsServerActions && !m.isTestModel);
  
  modelsNeedingActions.forEach(model => {
    generateServerActionTemplate(model);
  });
  
  console.log(chalk.green(`✅ Generated ${modelsNeedingActions.length} server action templates`));
  
  // Create a master template file
  const masterTemplatePath = path.join(TEMPLATE_DIR, 'server-action-template.ts');
  const masterTemplate = `"use server";

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

/**
 * Template for server actions
 * Replace MODEL_NAME with your model name
 * Replace fields with your model fields
 */

// Validation schema
const ModelSchema = z.object({
  // Define validation schema based on model fields
  // name: z.string().min(1),
  // email: z.string().email(),
  // etc.
});

type ModelInput = z.infer<typeof ModelSchema>;

/**
 * Create a new record
 */
export async function createModel(data: ModelInput) {
  // Validate input
  const validated = ModelSchema.parse(data);
  
  try {
    // Create record
    const result = await prisma.model.create({
      data: validated,
    });
    
    // Revalidate related paths
    revalidatePath('/admin/model');
    
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error creating model:", error);
    return { 
      success: false, 
      error: error.message || "Failed to create model" 
    };
  }
}

/**
 * Get a record by ID
 */
export async function getModel(id: string) {
  try {
    const result = await prisma.model.findUnique({
      where: { id },
    });
    
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error fetching model:", error);
    return { 
      success: false, 
      error: error.message || "Failed to fetch model" 
    };
  }
}

/**
 * Get all records with pagination
 */
export async function getAllModels(options?: { 
  page?: number; 
  limit?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}) {
  const { page = 1, limit = 10, orderBy = 'createdAt', orderDirection = 'desc' } = options || {};
  const skip = (page - 1) * limit;
  
  try {
    const [results, total] = await Promise.all([
      prisma.model.findMany({
        skip,
        take: limit,
        orderBy: { [orderBy]: orderDirection },
      }),
      prisma.model.count(),
    ]);
    
    return { 
      success: true, 
      data: results,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    };
  } catch (error: any) {
    console.error("Error fetching models:", error);
    return { 
      success: false, 
      error: error.message || "Failed to fetch models" 
    };
  }
}

/**
 * Update a record
 */
export async function updateModel(id: string, data: Partial<ModelInput>) {
  try {
    // Validate input (partial validation)
    const validated = ModelSchema.partial().parse(data);
    
    const result = await prisma.model.update({
      where: { id },
      data: validated,
    });
    
    // Revalidate related paths
    revalidatePath('/admin/model');
    
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error updating model:", error);
    return { 
      success: false, 
      error: error.message || "Failed to update model" 
    };
  }
}

/**
 * Delete a record
 */
export async function deleteModel(id: string) {
  try {
    const result = await prisma.model.delete({
      where: { id },
    });
    
    // Revalidate related paths
    revalidatePath('/admin/model');
    
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error deleting model:", error);
    return { 
      success: false, 
      error: error.message || "Failed to delete model" 
    };
  }
}
`;

  fs.writeFileSync(masterTemplatePath, masterTemplate);
  console.log(chalk.green(`✅ Generated master template: ${masterTemplatePath}`));
}

// Main function
async function main() {
  console.log(chalk.blue.bold('📊 Starting Database Needs Analysis...'));
  
  const models = extractModelsFromSchema();
  const analyzedModels = scanCodebaseForUsage(models);
  generateReport(analyzedModels);
  generateAllTemplates(analyzedModels);
  
  console.log(chalk.green.bold('✅ Analysis complete!'));
  console.log(chalk.blue(`📝 See the report at: ${OUTPUT_REPORT}`));
  console.log(chalk.blue(`🔧 Server action templates have been generated for models that need them.`));
}

// Run the script
main().catch(err => {
  console.error(chalk.red('Error running script:'), err);
  process.exit(1);
}); 