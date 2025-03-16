#!/usr/bin/env ts-node
/**
 * Model Actions Generator
 * 
 * This script analyzes your Prisma schema and generates server actions
 * for models using the action-factory utility.
 * 
 * Usage:
 * pnpm exec ts-node scripts/generate-model-actions.ts [model-name]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const PRISMA_SCHEMA_PATH = path.join(process.cwd(), 'prisma/schema.prisma');
const SRC_DIR = path.join(process.cwd(), 'src');
const SERVER_ACTIONS_DIR = path.join(SRC_DIR, 'app/actions');
const SERVER_MODELS_DIR = path.join(SRC_DIR, 'app/models');
const OUTPUT_DIR = path.join(process.cwd(), 'generated');

// Create necessary directories
for (const dir of [SERVER_ACTIONS_DIR, SERVER_MODELS_DIR, OUTPUT_DIR]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Types
interface Field {
  name: string;
  type: string;
  isRequired: boolean;
  isId: boolean;
  isArray: boolean;
  isRelation: boolean;
  isEnum: boolean;
  defaultValue?: string;
}

interface Model {
  name: string;
  fields: Field[];
}

// Logging with colors (simple version without chalk dependency)
const log = {
  info: (msg: string) => console.log(`\x1b[34m${msg}\x1b[0m`),
  success: (msg: string) => console.log(`\x1b[32m${msg}\x1b[0m`),
  warn: (msg: string) => console.log(`\x1b[33m${msg}\x1b[0m`),
  error: (msg: string) => console.log(`\x1b[31m${msg}\x1b[0m`),
};

/**
 * Extract models from Prisma schema
 */
function extractModelsFromSchema(): Model[] {
  log.info('Extracting models from Prisma schema...');
  
  const schemaContent = fs.readFileSync(PRISMA_SCHEMA_PATH, 'utf8');
  const modelRegex = /model\s+(\w+)\s+\{([^}]+)\}/g;
  
  const models: Model[] = [];
  let match;
  
  while ((match = modelRegex.exec(schemaContent)) !== null) {
    const modelName = match[1];
    const modelBody = match[2];
    
    // Skip test models
    if (modelName.startsWith('Test') || modelBody.includes('/// TEST MODEL')) {
      continue;
    }
    
    // Extract fields
    const fields: Field[] = [];
    const fieldLines = modelBody.split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => line && !line.startsWith('//') && !line.startsWith('@@'));
    
    for (const line of fieldLines) {
      const [name, ...rest] = line.split(/\s+/);
      if (!name) continue;
      
      const typeInfo = rest.join(' ').replace(/\s*\/\/.*$/, ''); // Remove inline comments
      
      // Skip relations in schema definitions (@relation)
      if (typeInfo.includes('@relation')) {
        continue;
      }
      
      const isRequired = !typeInfo.includes('?');
      const isId = typeInfo.includes('@id');
      const isArray = typeInfo.includes('[]');
      const isRelation = false; // We'll skip relations for now
      const isEnum = false; // For simplicity, we're not detecting enums
      
      // Extract the basic type
      const type = typeInfo.split(/\s+/)[0].replace('?', '').replace('[]', '');
      
      fields.push({
        name,
        type,
        isRequired,
        isId,
        isArray,
        isRelation,
        isEnum
      });
    }
    
    models.push({
      name: modelName,
      fields
    });
  }
  
  log.success(`Found ${models.length} models in schema`);
  return models;
}

/**
 * Map Prisma types to Zod schema types
 */
function mapToZodType(field: Field): string {
  const baseType = field.type.toLowerCase();
  
  // Handle arrays
  if (field.isArray) {
    return `z.array(${mapToZodType({...field, isArray: false})})`;
  }
  
  // Map types
  switch (baseType) {
    case 'string':
      return 'z.string()';
    case 'int':
    case 'float':
    case 'decimal':
      return 'z.number()';
    case 'boolean':
      return 'z.boolean()';
    case 'datetime':
      return 'z.date()';
    case 'json':
      return 'z.record(z.string(), z.any())';
    case 'bytes':
      return 'z.instanceof(Buffer)';
    default:
      // For custom types like enums, use string as fallback
      return 'z.string()';
  }
}

/**
 * Generate Zod schema for a model
 */
function generateZodSchema(model: Model): string {
  const fields = model.fields.map(field => {
    let schema = mapToZodType(field);
    
    // Add validation
    if (field.isRequired && !field.isId) {
      if (field.type === 'String') {
        schema += '.min(1, { message: "Field cannot be empty" })';
      }
    }
    
    if (!field.isRequired) {
      schema += '.optional()';
    }
    
    return `  ${field.name}: ${schema},`;
  });
  
  return `const ${model.name}Schema = z.object({\n${fields.join('\n')}\n});

const ${model.name}CreateSchema = ${model.name}Schema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

const ${model.name}UpdateSchema = ${model.name}Schema.partial().extend({
  id: z.string().min(1, { message: "ID is required" })
});`;
}

/**
 * Generate a model file
 */
function generateModelFile(model: Model): string {
  const zodSchema = generateZodSchema(model);
  
  return `import { z } from "zod";

/**
 * Schema for ${model.name}
 */
${zodSchema}

export type ${model.name} = z.infer<typeof ${model.name}Schema>;
export type ${model.name}Create = z.infer<typeof ${model.name}CreateSchema>;
export type ${model.name}Update = z.infer<typeof ${model.name}UpdateSchema>;

export {
  ${model.name}Schema,
  ${model.name}CreateSchema,
  ${model.name}UpdateSchema
};`;
}

/**
 * Generate a server action file
 */
function generateServerActionFile(model: Model): string {
  return `"use server";

import { ${model.name}Schema, ${model.name}CreateSchema, ${model.name}UpdateSchema } from "@/app/models/${model.name.toLowerCase()}";
import { createModelActions } from "@/lib/server/action-factory";

/**
 * Server actions for ${model.name}
 */
const ${model.name}Actions = createModelActions(
  "${model.name.charAt(0).toLowerCase() + model.name.slice(1)}", // Prisma model name (camelCase)
  ${model.name}CreateSchema,
  ${model.name}UpdateSchema,
  {
    defaultSortField: "updatedAt", // Change as needed
    relations: [] // Add relation names here
  }
);

export const create${model.name} = ${model.name}Actions.create;
export const get${model.name} = ${model.name}Actions.getById;
export const update${model.name} = ${model.name}Actions.update;
export const delete${model.name} = ${model.name}Actions.remove;
export const list${model.name}s = ${model.name}Actions.list;`;
}

/**
 * Write a file if it doesn't exist
 */
function writeFileIfNotExists(filePath: string, content: string, force = false): boolean {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  if (!fs.existsSync(filePath) || force) {
    fs.writeFileSync(filePath, content);
    return true;
  }
  
  return false;
}

/**
 * Generate files for a specific model
 */
function generateFilesForModel(model: Model, force = false): void {
  log.info(`Generating files for ${model.name}...`);
  
  // Generate model file
  const modelFileName = path.join(SERVER_MODELS_DIR, `${model.name.toLowerCase()}.ts`);
  const modelContent = generateModelFile(model);
  
  if (writeFileIfNotExists(modelFileName, modelContent, force)) {
    log.success(`Generated model schema at ${modelFileName}`);
  } else {
    log.warn(`Model schema already exists at ${modelFileName}`);
  }
  
  // Generate server action file
  const actionFileName = path.join(SERVER_ACTIONS_DIR, `${model.name.toLowerCase()}-actions.ts`);
  const actionContent = generateServerActionFile(model);
  
  if (writeFileIfNotExists(actionFileName, actionContent, force)) {
    log.success(`Generated server actions at ${actionFileName}`);
  } else {
    log.warn(`Server actions already exist at ${actionFileName}`);
  }
  
  // Generate index file for exports if it doesn't exist
  const modelIndexPath = path.join(SERVER_MODELS_DIR, 'index.ts');
  const exportLine = `export * from "./${model.name.toLowerCase()}";`;
  
  if (!fs.existsSync(modelIndexPath)) {
    fs.writeFileSync(modelIndexPath, `// Generated model exports\n${exportLine}\n`);
  } else {
    const indexContent = fs.readFileSync(modelIndexPath, 'utf8');
    if (!indexContent.includes(exportLine)) {
      fs.appendFileSync(modelIndexPath, `${exportLine}\n`);
    }
  }
  
  log.success(`Completed generation for ${model.name}`);
}

/**
 * Main function
 */
async function main() {
  log.info('Starting model actions generator...');
  
  // Check args for specific model
  const targetModel = process.argv[2];
  
  // Extract models
  const models = extractModelsFromSchema();
  
  if (targetModel) {
    // Generate files for specific model
    const model = models.find(m => m.name.toLowerCase() === targetModel.toLowerCase());
    if (model) {
      generateFilesForModel(model, true);
    } else {
      log.error(`Model "${targetModel}" not found in schema`);
      process.exit(1);
    }
  } else {
    // Generate files for all models
    for (const model of models) {
      generateFilesForModel(model);
    }
  }
  
  log.success('Generation complete!');
}

// Run the script
main().catch(err => {
  log.error(`Error: ${err.message}`);
  process.exit(1);
}); 