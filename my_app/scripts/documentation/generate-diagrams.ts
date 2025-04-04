#!/usr/bin/env ts-node

/**
 * Script to generate Mermaid diagrams for the application
 * 
 * This script analyzes the code structure and generates Mermaid diagrams
 * for components, routes, and data flow.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import * as chokidar from 'chokidar';

// Get project directories
const __dirname = process.cwd();
const ROOT_DIR = path.resolve(__dirname);
const SRC_DIR = path.join(ROOT_DIR, 'src');
const DIAGRAMS_DIR = path.join(ROOT_DIR, '_DEV_MAN', 'diagrams');

// Define interfaces for the application
interface ComponentImport {
  component: string;
  path: string;
}

// Create diagrams directory if it doesn't exist
async function ensureDiagramsDir(): Promise<void> {
  try {
    await fs.mkdir(DIAGRAMS_DIR, { recursive: true });
    console.log(`Created diagrams directory: ${DIAGRAMS_DIR}`);
  } catch (err) {
    console.error('Error creating diagrams directory:', err);
  }
}

// Get all component files in the src directory
async function getComponentFiles(): Promise<string[]> {
  const componentFiles: string[] = [];
  
  async function scanDir(dir: string): Promise<void> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        await scanDir(fullPath);
      } else if (
        (entry.name.endsWith('.tsx') || entry.name.endsWith('.jsx')) &&
        !entry.name.startsWith('.')
      ) {
        componentFiles.push(fullPath);
      }
    }
  }
  
  await scanDir(SRC_DIR);
  return componentFiles;
}

// Extract component imports from a file
async function extractComponentImports(filePath: string): Promise<ComponentImport[]> {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const imports: ComponentImport[] = [];
    
    // Match import statements for components
    const importRegex = /import\s+{?\s*([^}]*)\s*}?\s+from\s+['"]([^'"]+)['"]/g;
    let match: RegExpExecArray | null;
    
    while ((match = importRegex.exec(content)) !== null) {
      const importedItems = match[1].split(',').map(item => item.trim());
      const importPath = match[2];
      
      for (const item of importedItems) {
        // Check if it looks like a component (PascalCase)
        if (/^[A-Z]/.test(item)) {
          imports.push({
            component: item,
            path: importPath
          });
        }
      }
    }
    
    return imports;
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err);
    return [];
  }
}

// Generate component dependency diagram
async function generateComponentDiagram(): Promise<void> {
  console.log('Generating component dependency diagram...');
  
  const componentFiles = await getComponentFiles();
  let mermaidContent = 'flowchart TD\n';
  const nodes = new Set<string>();
  const edges = new Set<string>();
  
  for (const file of componentFiles) {
    const componentName = path.basename(file, path.extname(file));
    const relativePath = path.relative(ROOT_DIR, file);
    
    // Add node for this component
    const nodeId = componentName.replace(/[^a-zA-Z0-9]/g, '_');
    nodes.add(`  ${nodeId}["${componentName} (${relativePath})"]`);
    
    // Find imported components
    const imports = await extractComponentImports(file);
    for (const imp of imports) {
      const importedComponent = imp.component;
      const importedNodeId = importedComponent.replace(/[^a-zA-Z0-9]/g, '_');
      
      // Add edge from this component to the imported component
      edges.add(`  ${nodeId} --> ${importedNodeId}`);
    }
  }
  
  // Combine nodes and edges
  mermaidContent += Array.from(nodes).join('\n') + '\n';
  mermaidContent += Array.from(edges).join('\n') + '\n';
  
  // Write diagram to file
  const diagramPath = path.join(DIAGRAMS_DIR, 'component-dependencies.md');
  await fs.writeFile(diagramPath, `# Component Dependency Diagram\n\n\`\`\`mermaid\n${mermaidContent}\`\`\``);
  
  console.log(`Component diagram generated at ${diagramPath}`);
}

// Generate route structure diagram
async function generateRouteDiagram(): Promise<void> {
  console.log('Generating route structure diagram...');
  
  const appDir = path.join(SRC_DIR, 'app');
  let mermaidContent = 'flowchart TD\n';
  const nodes = new Set<string>();
  const edges = new Set<string>();
  
  async function processRouteDir(dir: string, parentNodeId: string | null = null): Promise<void> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const relativePath = path.relative(appDir, dir);
    const routePath = relativePath ? `/${relativePath.replace(/\\/g, '/')}` : '/';
    const nodeId = `route_${routePath.replace(/[^\w\d]/g, '_')}`;
    
    nodes.add(`  ${nodeId}["${routePath}"]`);
    
    if (parentNodeId) {
      edges.add(`  ${parentNodeId} --> ${nodeId}`);
    }
    
    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('_') && !entry.name.startsWith('.')) {
        const fullPath = path.join(dir, entry.name);
        await processRouteDir(fullPath, nodeId);
      }
    }
  }
  
  await processRouteDir(appDir);
  
  // Combine nodes and edges
  mermaidContent += Array.from(nodes).join('\n') + '\n';
  mermaidContent += Array.from(edges).join('\n') + '\n';
  
  // Write diagram to file
  const diagramPath = path.join(DIAGRAMS_DIR, 'route-structure.md');
  await fs.writeFile(diagramPath, `# Route Structure Diagram\n\n\`\`\`mermaid\n${mermaidContent}\`\`\``);
  
  console.log(`Route diagram generated at ${diagramPath}`);
}

// Generate TapPass data flow diagram
async function generateTapPassDataFlow(): Promise<void> {
  console.log('Generating TapPass data flow diagram...');
  
  const mermaidContent = `flowchart TD
  subgraph Client
    A[Registration Form] -->|Zod Validate| B1[Client Validation]
    B1 -->|Submit Valid Form Data| B[Server Action]
    
    C[Lookup Form] -->|Zod Validate| D1[Client Validation]
    D1 -->|Submit Valid Lookup Data| D[Member Lookup]
  end
  
  subgraph Server
    B -->|Zod Validate| B2[Server Validation]
    B2 -->|Create Member| E[(Prisma Database)]
    
    D -->|Query Member| E
    E -->|Return Member| D
  end
  
  D -->|Return Member Data| C
  B -->|Return Membership ID| A`;
  
  // Write diagram to file
  const diagramPath = path.join(DIAGRAMS_DIR, 'tappass-data-flow.md');
  await fs.writeFile(diagramPath, `# TapPass Data Flow Diagram\n\n\`\`\`mermaid\n${mermaidContent}\`\`\``);
  
  console.log(`TapPass data flow diagram generated at ${diagramPath}`);
}

// Detect component changes and regenerate diagrams
function watchForChanges(): void {
  const watcher = chokidar.watch([
    path.join(SRC_DIR, '**/*.tsx'),
    path.join(SRC_DIR, '**/*.jsx'),
    path.join(SRC_DIR, '**/*.ts'),
    path.join(SRC_DIR, '**/*.js')
  ], {
    ignored: /(node_modules|\.git)/,
    persistent: true
  });

  console.log('Watching for file changes...');
  
  watcher.on('change', async (filePath: string) => {
    console.log(`File changed: ${filePath}`);
    await generateDiagrams();
  });
  
  watcher.on('add', async (filePath: string) => {
    console.log(`File added: ${filePath}`);
    await generateDiagrams();
  });
}

// Generate all diagrams
async function generateDiagrams(): Promise<void> {
  try {
    await ensureDiagramsDir();
    await generateComponentDiagram();
    await generateRouteDiagram();
    await generateTapPassDataFlow();
    console.log('All diagrams generated successfully!');
  } catch (err) {
    console.error('Error generating diagrams:', err);
  }
}

// Main function
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const watchMode = args.includes('--watch');
  
  await generateDiagrams();
  
  if (watchMode) {
    watchForChanges();
  }
}

main().catch(err => console.error(err)); 