#!/usr/bin/env ts-node

/**
 * Prisma Schema Generator
 * 
 * This script automatically analyzes TypeScript files to extract type definitions
 * and generates a corresponding Prisma schema.
 */

import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import * as chokidar from 'chokidar';

// Define colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Configuration
const config = {
  rootDir: './src',
  outputPath: './prisma/schema.prisma',
  preserveDirectives: true,
  includeComments: true,
  dbProvider: 'sqlite',
  excludePatterns: ['**/node_modules/**', '**/.next/**', '**/dist/**'],
  watchMode: false,
};

// TypeScript to Prisma type mapping
const typeMapping: Record<string, string> = {
  'string': 'String',
  'number': 'Int',
  'boolean': 'Boolean',
  'Date': 'DateTime',
  'Date | string': 'DateTime',
  'BigInt': 'BigInt',
  'Buffer': 'Bytes',
  'any': 'Json',
  'object': 'Json',
  'Record<string, any>': 'Json',
  'unknown': 'String',
};

// Models to always include (these are the TapPass models)
const includeModels = ['Member', 'Visit', 'Reward'];

// Interface definitions
interface TypeDefinition {
  name: string;
  properties: PropertyDefinition[];
  sourceFile: string;
  docComment: string;
}

interface PropertyDefinition {
  name: string;
  type: string;
  isOptional: boolean;
  isId: boolean;
  relationshipType: string;
  relatesTo: string;
  relationshipField: string;
  docComment: string;
}

// Main class for schema generation
class PrismaSchemaGenerator {
  private typeDefinitions: Map<string, TypeDefinition> = new Map();
  private existingSchema: string = '';
  private existingDirectives: string = '';
  private watcher: chokidar.FSWatcher | null = null;
  
  constructor() {
    this.loadExistingSchema();
  }
  
  // Helper to log with color
  private log(color: keyof typeof colors, message: string): void {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }
  
  // Load the existing schema if it exists
  private loadExistingSchema(): void {
    try {
      if (fs.existsSync(config.outputPath)) {
        this.existingSchema = fs.readFileSync(config.outputPath, 'utf-8');
        
        // Extract directives (generator and datasource blocks)
        const directivePattern = '(generator|datasource)\\s+\\w+\\s+{[^}]*}';
        const directiveRegex = new RegExp(directivePattern, 'gs');
        const directiveMatches = this.existingSchema.match(directiveRegex);
        if (directiveMatches) {
          this.existingDirectives = directiveMatches.join('\n\n') + '\n\n';
        } else {
          this.setDefaultDirectives();
        }
      } else {
        this.setDefaultDirectives();
      }
    } catch (error) {
      this.log('red', `Error loading existing schema: ${error}`);
      this.setDefaultDirectives();
    }
  }
  
  // Set default directives if none exist
  private setDefaultDirectives(): void {
    this.existingDirectives = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "${config.dbProvider}"
  url      = env("DATABASE_URL")
}

`;
  }
  
  // Find TypeScript files recursively
  public findTypeScriptFiles(dir: string = config.rootDir): string[] {
    const files: string[] = [];
    
    // Skip excluded directories
    for (const pattern of config.excludePatterns) {
      // Simple string inclusion check
      const simplePattern = pattern.replace('**/', '').replace('/**', '');
      if (dir.includes(simplePattern)) {
        return [];
      }
    }
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        files.push(...this.findTypeScriptFiles(fullPath));
      } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name) && !/\.d\.ts$/.test(entry.name)) {
        files.push(fullPath);
      }
    }
    
    return files;
  }
  
  // Starts watching TypeScript files for changes
  public watchTypeScriptFiles(): void {
    if (this.watcher) {
      this.watcher.close();
    }
    
    this.log('cyan', '👀 Starting watch mode...');
    
    // Create arrays of patterns to watch and directories to exclude
    const typesPath = path.join(process.cwd(), 'src', 'types');
    const absoluteRootDir = path.resolve(config.rootDir);
    
    // Create explicit patterns to watch
    const watchPatterns = [
      // Main glob pattern
      path.join(absoluteRootDir, '**', '*.ts'),
      path.join(absoluteRootDir, '**', '*.tsx'),
      // Explicit path to test-model.ts
      path.join(absoluteRootDir, 'types', 'test-model.ts')
    ];
    
    this.log('yellow', `Absolute root dir: ${absoluteRootDir}`);
    this.log('yellow', `Watch patterns: ${watchPatterns.join(', ')}`);
    this.log('yellow', `Excluded patterns: ${config.excludePatterns.join(', ')}`);
    this.log('yellow', `Types path: ${typesPath}`);
    
    // Check file existence
    this.log('cyan', 'Testing specific file existence:');
    const testModelPath = path.join(absoluteRootDir, 'types', 'test-model.ts');
    this.log('cyan', `  ${testModelPath}: ${fs.existsSync(testModelPath) ? 'exists' : 'not found'}`);
    
    // Create watcher with explicit file patterns
    this.watcher = chokidar.watch(watchPatterns, {
      ignored: config.excludePatterns,
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 300,
        pollInterval: 100
      },
      alwaysStat: true,
      usePolling: true,
      interval: 1000,
      binaryInterval: 3000
    });
    
    // Also explicitly watch the types directory
    this.log('cyan', `Explicitly adding types directory to watcher: ${typesPath}`);
    if (fs.existsSync(typesPath) && this.watcher) {
      this.watcher.add(typesPath);
      this.log('green', `✅ Types directory exists and was added to watcher`);
      
      // List files in the types directory
      const typesFiles = fs.readdirSync(typesPath);
      this.log('cyan', `Files in types directory:`);
      typesFiles.forEach(file => {
        this.log('cyan', `  - ${file}`);
        // Explicitly add each .ts file
        if (file.endsWith('.ts') && this.watcher) {
          const fullPath = path.join(typesPath, file);
          this.watcher.add(fullPath);
          this.log('cyan', `    Added to watcher: ${fullPath}`);
        }
      });
    } else {
      this.log('red', `❌ Types directory does not exist or watcher not initialized`);
    }
    
    // Log when watching starts
    this.watcher.on('ready', () => {
      this.log('green', `✅ Watching for changes in TypeScript files`);
      this.log('yellow', `💡 Press Ctrl+C to stop watching`);
      
      // Log the paths being watched
      const watchedPaths = this.watcher?.getWatched();
      this.log('cyan', 'Watched directories:');
      if (watchedPaths) {
        if (Object.keys(watchedPaths).length === 0) {
          this.log('red', '  No directories are being watched! Check your watch pattern.');
        } else {
          Object.keys(watchedPaths).sort().forEach(dir => {
            this.log('cyan', `  - ${dir}: ${watchedPaths[dir].length} files`);
            // Log the first 5 files in each directory
            if (watchedPaths[dir].length > 0) {
              watchedPaths[dir].slice(0, 5).forEach(file => {
                this.log('cyan', `      - ${file}`);
              });
              if (watchedPaths[dir].length > 5) {
                this.log('cyan', `      - ... and ${watchedPaths[dir].length - 5} more files`);
              }
            }
          });
        }
      }
    });
    
    // Generate schema when files change
    this.watcher.on('add', (filePath) => {
      this.log('blue', `File added: ${filePath}`);
      this.regenerateSchema();
    });
    
    this.watcher.on('change', (filePath) => {
      this.log('blue', `File changed: ${filePath}`);
      this.regenerateSchema();
    });
    
    this.watcher.on('unlink', (filePath) => {
      this.log('blue', `File deleted: ${filePath}`);
      this.regenerateSchema();
    });
    
    // Handle errors
    this.watcher.on('error', (error) => {
      this.log('red', `Watcher error: ${error}`);
    });
  }
  
  // Regenerate schema (for watch mode)
  private regenerateSchema(): void {
    this.log('cyan', '🔄 Regenerating schema...');
    
    // Reset type definitions
    this.typeDefinitions.clear();
    
    // Reload existing schema for directives
    this.loadExistingSchema();
    
    // Find and process files
    const files = this.findTypeScriptFiles();
    files.forEach(file => {
      this.processFile(file);
    });
    
    // Analyze relationships and generate schema
    this.analyzeRelationships();
    const schema = this.generatePrismaSchema();
    this.saveSchema(schema);
    
    this.log('green', '✅ Schema regenerated');
    this.log('cyan', `📊 Generated models: ${this.typeDefinitions.size}`);
  }
  
  // Process a TypeScript file to extract types
  public processFile(filePath: string): void {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const sourceFile = ts.createSourceFile(
        filePath,
        fileContent,
        ts.ScriptTarget.Latest,
        true
      );
      
      this.extractTypeDefinitions(sourceFile, filePath);
    } catch (error) {
      this.log('red', `Error processing ${filePath}: ${error}`);
    }
  }
  
  // Extract type definitions from a source file
  private extractTypeDefinitions(sourceFile: ts.SourceFile, filePath: string): void {
    const visit = (node: ts.Node): void => {
      // Look for interfaces
      if (ts.isInterfaceDeclaration(node)) {
        this.processInterfaceDeclaration(node, sourceFile, filePath);
      }
      // Look for type aliases with object structure
      else if (ts.isTypeAliasDeclaration(node) && 
               node.type && 
               (ts.isTypeLiteralNode(node.type) || 
                this.isObjectType(node.type))) {
        this.processTypeAliasDeclaration(node, sourceFile, filePath);
      }
      
      ts.forEachChild(node, visit);
    };
    
    visit(sourceFile);
  }
  
  // Check if a type is an object type
  private isObjectType(typeNode: ts.TypeNode): boolean {
    // Handle type references
    if (ts.isTypeReferenceNode(typeNode)) {
      const name = typeNode.typeName.getText();
      // Skip array and utility types
      if (['Array', 'Record', 'Partial', 'Pick', 'Omit'].includes(name)) {
        return false;
      }
      return true;
    }
    return false;
  }
  
  // Extract doc comments from comment ranges
  private extractDocComment(sourceFile: ts.SourceFile, node: ts.Node): string {
    const commentRanges = ts.getLeadingCommentRanges(sourceFile.text, node.getFullStart());
    if (!commentRanges || commentRanges.length === 0) return '';
    
    const commentTexts = commentRanges.map((range: ts.CommentRange) => {
      const text = sourceFile.text.substring(range.pos, range.end);
      // Clean up comment markers
      return text.replace(/\/\*\*|\*\/|^\/\/|\s*\*\s*/g, '').trim();
    });
    
    return commentTexts.join('\n');
  }
  
  // Process an interface declaration
  private processInterfaceDeclaration(
    node: ts.InterfaceDeclaration, 
    sourceFile: ts.SourceFile, 
    filePath: string
  ): void {
    const typeName = node.name.text;
    
    // Skip if the interface doesn't look like a model
    if (!this.shouldProcessType(typeName)) {
      return;
    }
    
    this.log('blue', `Found interface: ${typeName}`);
    
    const properties: PropertyDefinition[] = [];
    const docComment = this.extractDocComment(sourceFile, node);
    
    // Process interface members
    node.members.forEach((member: ts.TypeElement) => {
      if (ts.isPropertySignature(member) && member.name) {
        const propertyName = member.name.getText(sourceFile);
        const typeNode = member.type;
        const isOptional = member.questionToken !== undefined;
        const memberDocComment = this.extractDocComment(sourceFile, member);
        
        if (typeNode) {
          const property = this.createPropertyDefinition(
            propertyName,
            typeNode,
            isOptional,
            sourceFile,
            memberDocComment
          );
          properties.push(property);
        }
      }
    });
    
    this.typeDefinitions.set(typeName, {
      name: typeName,
      properties,
      sourceFile: filePath,
      docComment
    });
  }
  
  // Process a type alias declaration
  private processTypeAliasDeclaration(
    node: ts.TypeAliasDeclaration, 
    sourceFile: ts.SourceFile, 
    filePath: string
  ): void {
    const typeName = node.name.text;
    
    // Skip if the type doesn't look like a model
    if (!this.shouldProcessType(typeName)) {
      return;
    }
    
    this.log('blue', `Found type: ${typeName}`);
    
    const properties: PropertyDefinition[] = [];
    const docComment = this.extractDocComment(sourceFile, node);
    
    // Process type members based on type structure
    if (ts.isTypeLiteralNode(node.type)) {
      // Direct object type like { prop: type }
      node.type.members.forEach((member: ts.TypeElement) => {
        if (ts.isPropertySignature(member) && member.name) {
          const propertyName = member.name.getText(sourceFile);
          const typeNode = member.type;
          const isOptional = member.questionToken !== undefined;
          const memberDocComment = this.extractDocComment(sourceFile, member);
          
          if (typeNode) {
            const property = this.createPropertyDefinition(
              propertyName,
              typeNode,
              isOptional,
              sourceFile,
              memberDocComment
            );
            properties.push(property);
          }
        }
      });
    } else if (ts.isTypeReferenceNode(node.type)) {
      // Referenced type like 'type User = BaseUser'
      // We could theoretically follow these references but that's complex
      // Just add a placeholder for now
      properties.push({
        name: 'id',
        type: 'String',
        isOptional: false,
        isId: true,
        relationshipType: '',
        relatesTo: '',
        relationshipField: '',
        docComment: 'Automatically added ID field'
      });
    }
    
    this.typeDefinitions.set(typeName, {
      name: typeName,
      properties,
      sourceFile: filePath,
      docComment
    });
  }
  
  // Determine if a type should be processed as a Prisma model
  private shouldProcessType(typeName: string): boolean {
    // Always include specific models
    if (includeModels.includes(typeName)) {
      return true;
    }
    
    // Only process types that look like models (capital first letter, not utility types)
    const isUtilityType = typeName.startsWith('I') || 
                          typeName.endsWith('Props') || 
                          typeName.endsWith('State') ||
                          typeName.endsWith('Config') ||
                          typeName.endsWith('Options');
    
    return /^[A-Z]/.test(typeName) && !isUtilityType;
  }
  
  // Create a property definition from a TypeScript type node
  private createPropertyDefinition(
    name: string,
    typeNode: ts.TypeNode,
    isOptional: boolean,
    sourceFile: ts.SourceFile,
    docComment: string
  ): PropertyDefinition {
    const typeText = typeNode.getText(sourceFile);
    let relatesTo = '';
    let relationshipType = '';
    
    // Check for array types (one-to-many relationship)
    const arrayMatch = typeText.match(/Array<(\w+)>|(\w+)\[\]/);
    if (arrayMatch) {
      const relatedTypeName = arrayMatch[1] || arrayMatch[2];
      // Only mark as relationship if it looks like a model name
      if (/^[A-Z]/.test(relatedTypeName) && !relatedTypeName.endsWith('Props')) {
        relatesTo = relatedTypeName;
        relationshipType = 'oneToMany';
      }
    }
    // Check for entity references (one-to-one relationship)
    else if (/^[A-Z]/.test(typeText) && 
            !typeText.includes('|') && 
            !typeText.includes('&') && 
            !['String', 'Number', 'Boolean', 'Date'].includes(typeText)) {
      relatesTo = typeText;
      relationshipType = 'oneToOne';
    }
    
    return {
      name,
      type: this.mapTypeToPrisma(typeText),
      isOptional,
      isId: name === 'id',
      relationshipType,
      relatesTo,
      relationshipField: '',
      docComment
    };
  }
  
  // Map TypeScript types to Prisma types
  private mapTypeToPrisma(typeText: string): string {
    // Handle simple types
    if (typeMapping[typeText]) {
      return typeMapping[typeText];
    }
    
    // Handle special cases for common types
    if (typeText === 'string[]') return 'String[]';
    if (typeText === 'number[]') return 'Int[]';
    
    // Handle union types (use more specific type if possible)
    if (typeText.includes('|')) {
      const types = typeText.split('|').map(t => t.trim());
      // If string is one of the options, use String
      if (types.includes('string')) return 'String';
      // If number is one of the options, use Int
      if (types.includes('number')) return 'Int';
      // Default to Json for complex unions
      return 'Json';
    }
    
    // Handle array types not caught earlier
    if (typeText.includes('[]') || typeText.includes('Array<')) {
      return 'Json';
    }
    
    // Default fallback
    return 'String';
  }
  
  // Analyze relationships between all collected types
  public analyzeRelationships(): void {
    const allTypes = Array.from(this.typeDefinitions.values());
    
    allTypes.forEach(type => {
      type.properties.forEach(prop => {
        if (prop.relationshipType && prop.relatesTo && this.typeDefinitions.has(prop.relatesTo)) {
          // This is a valid relationship to another model
          
          // Find opposite side properties
          const relatedType = this.typeDefinitions.get(prop.relatesTo)!;
          
          // Look for matching back-references
          if (prop.relationshipType === 'oneToMany') {
            // For one-to-many, look for a property in the related type that might 
            // reference back to this type with a matching name
            const possibleBackRefNames = [
              type.name.toLowerCase(),
              `${type.name.toLowerCase()}Id`
            ];
            
            for (const backRefName of possibleBackRefNames) {
              const backRef = relatedType.properties.find(p => p.name.toLowerCase() === backRefName.toLowerCase());
              if (backRef) {
                backRef.relationshipType = 'manyToOne';
                backRef.relatesTo = type.name;
                prop.relationshipField = backRef.name;
                break;
              }
            }
          }
        }
      });
    });
  }
  
  // Generate the Prisma schema as a string
  public generatePrismaSchema(): string {
    let schema = '';
    
    // Add directives (generator and datasource)
    if (config.preserveDirectives) {
      schema += this.existingDirectives;
    } else {
      schema += this.getDefaultDirectives();
    }
    
    // Add file header
    schema += `// This schema was automatically generated from TypeScript types
// Generated on ${new Date().toISOString()}
// DO NOT EDIT THIS FILE DIRECTLY

`;
    
    // Generate model definitions
    const allTypes = Array.from(this.typeDefinitions.values());
    
    allTypes.forEach(type => {
      // Add doc comment if exists
      if (config.includeComments && type.docComment) {
        schema += `/// ${type.docComment.replace(/\n/g, '\n/// ')}\n`;
      }
      
      schema += `model ${type.name} {\n`;
      
      // Add ID field if not present
      if (!type.properties.some(p => p.isId)) {
        schema += `  id String @id @default(cuid())\n`;
      }
      
      // Add all properties
      type.properties.forEach(prop => {
        // Skip relation fields that will be handled with @relation
        if (prop.relationshipType === 'manyToOne') {
          return;
        }
        
        // Add doc comment if exists
        if (config.includeComments && prop.docComment) {
          schema += `  /// ${prop.docComment.replace(/\n/g, '\n  /// ')}\n`;
        }
        
        let line = `  ${prop.name} `;
        
        // Handle relationships
        if (prop.relationshipType === 'oneToMany' && this.typeDefinitions.has(prop.relatesTo)) {
          line += `${prop.relatesTo}[]`;
        } else if (prop.relationshipType === 'oneToOne' && this.typeDefinitions.has(prop.relatesTo)) {
          line += prop.relatesTo;
        } else {
          // Use Prisma scalar type
          line += prop.type;
          
          // Add optional modifier
          if (prop.isOptional) {
            line += '?';
          }
          
          // Add ID decorator
          if (prop.isId) {
            line += ' @id @default(cuid())';
          }
          
          // Add other common decorators
          if (prop.name === 'createdAt') {
            line += ' @default(now())';
          }
          if (prop.name === 'updatedAt') {
            line += ' @updatedAt';
          }
          if (prop.name === 'email' && prop.type === 'String') {
            line += ' @unique';
          }
          if (prop.name === 'memberId' && prop.type === 'String') {
            line += ' @unique';
          }
          if (prop.name === 'phoneNumber' && prop.type === 'String') {
            line += ' @unique';
          }
        }
        
        schema += `  ${line}\n`;
      });
      
      // Add relation fields for many-to-one relationships
      type.properties.forEach(prop => {
        if (prop.relationshipType === 'manyToOne' && prop.relatesTo && this.typeDefinitions.has(prop.relatesTo)) {
          // Add the relation field
          const referenceField = prop.name.endsWith('Id') ? prop.name : `${prop.name}Id`;
          
          // Check if we already have the ID field
          if (!type.properties.some(p => p.name === referenceField)) {
            schema += `  ${referenceField} String\n`;
          }
          
          schema += `  ${prop.relatesTo.toLowerCase()} ${prop.relatesTo} @relation(fields: [${referenceField}], references: [id])\n`;
        }
      });
      
      // Add indexes for many-to-one relation fields
      const relationFields = type.properties
        .filter(p => p.relationshipType === 'manyToOne' && p.relatesTo)
        .map(p => p.name.endsWith('Id') ? p.name : `${p.name}Id`);
      
      if (relationFields.length > 0) {
        // Add index for each relation field
        relationFields.forEach(field => {
          schema += `  @@index([${field}])\n`;
        });
      }
      
      schema += `}\n\n`;
    });
    
    // Trim trailing whitespace
    return schema.trim() + '\n';
  }
  
  // Get default directives for a new schema
  private getDefaultDirectives(): string {
    return `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "${config.dbProvider}"
  url      = env("DATABASE_URL")
}

`;
  }
  
  // Save the generated schema to a file
  public saveSchema(schema: string): void {
    try {
      // Ensure directory exists
      const dir = path.dirname(config.outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(config.outputPath, schema);
      this.log('green', `✅ Prisma schema successfully generated at ${config.outputPath}`);
    } catch (error) {
      this.log('red', `Error saving schema: ${error}`);
    }
  }
  
  // Run the entire schema generation process
  public run(): void {
    this.log('cyan', '🔍 Starting TypeScript to Prisma schema generation...');
    
    // If in watch mode, start watching files
    if (config.watchMode) {
      // Generate once initially
      this.regenerateSchema();
      
      // Then watch for changes
      this.watchTypeScriptFiles();
    } else {
      // One-time generation
      const files = this.findTypeScriptFiles();
      this.log('blue', `Found ${files.length} TypeScript files to analyze`);
      
      files.forEach(file => {
        this.processFile(file);
      });
      
      this.log('blue', `Extracted ${this.typeDefinitions.size} potential models`);
      
      this.analyzeRelationships();
      this.log('blue', 'Analyzed relationships between models');
      
      const schema = this.generatePrismaSchema();
      this.saveSchema(schema);
      
      this.log('green', 'Schema generation complete!');
      this.log('cyan', '📊 Generated models:');
      Array.from(this.typeDefinitions.keys()).sort().forEach(model => {
        this.log('cyan', `  - ${model}`);
      });
    }
  }
}

// Process command-line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
  Prisma Schema Generator
  
  Usage:
    ts-node scripts/generate-prisma-schema.ts [options]
    
  Options:
    --help, -h        Show this help message
    --dir=<path>      Set root directory to scan (default: ./src)
    --output=<path>   Set output file path (default: ./prisma/schema.prisma)
    --db=<provider>   Set database provider (default: sqlite)
    --watch           Watch for file changes and regenerate schema
    
  Examples:
    ts-node scripts/generate-prisma-schema.ts
    ts-node scripts/generate-prisma-schema.ts --dir=./models --output=./schema.prisma
    ts-node scripts/generate-prisma-schema.ts --db=postgresql
    ts-node scripts/generate-prisma-schema.ts --watch
  `);
  process.exit(0);
}

// Parse arguments
args.forEach(arg => {
  if (arg.startsWith('--dir=')) {
    config.rootDir = arg.substring(6);
  } else if (arg.startsWith('--output=')) {
    config.outputPath = arg.substring(9);
  } else if (arg.startsWith('--db=')) {
    config.dbProvider = arg.substring(5);
  } else if (arg === '--watch') {
    config.watchMode = true;
  }
});

// Run the generator
const generator = new PrismaSchemaGenerator();
generator.run(); 