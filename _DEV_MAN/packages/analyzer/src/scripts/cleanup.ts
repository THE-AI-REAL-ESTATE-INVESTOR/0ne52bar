import * as fs from 'fs';
import * as path from 'path';

const filesToMove = [
  'src/legacy/excel4node/generate-marketing-spreadsheet.ts 14-16-55-638.ts',
  'src/legacy/README.md',
  'src/legacy/excel4node/excel4node.d.ts',
  'src/generate-marketing-spreadsheet.ts',
  'src/generate-marketing-spreadsheet.js',
  'src/generate-marketing-spreadsheet.new.ts'
];

function moveFile(sourcePath: string): void {
  try {
    // Clean up the filename by removing spaces and special characters
    const fileName = path.basename(sourcePath)
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9.-]/g, '');
    
    const targetPath = path.join(process.cwd(), 'src/need_to_delete', fileName);
    
    if (fs.existsSync(sourcePath)) {
      // If target file exists, append timestamp
      if (fs.existsSync(targetPath)) {
        const timestamp = new Date().getTime();
        const newFileName = `${path.parse(fileName).name}-${timestamp}${path.parse(fileName).ext}`;
        const newTargetPath = path.join(process.cwd(), 'src/need_to_delete', newFileName);
        fs.renameSync(sourcePath, newTargetPath);
        console.log(`Moved: ${sourcePath} -> ${newTargetPath}`);
      } else {
        fs.renameSync(sourcePath, targetPath);
        console.log(`Moved: ${sourcePath} -> ${targetPath}`);
      }
    } else {
      console.log(`File not found: ${sourcePath}`);
    }
  } catch (error) {
    console.error(`Error moving ${sourcePath}:`, error);
  }
}

function main(): void {
  console.log('Starting file move...');
  
  // Create need_to_delete directory if it doesn't exist
  const needToDeleteDir = path.join(process.cwd(), 'src/need_to_delete');
  if (!fs.existsSync(needToDeleteDir)) {
    fs.mkdirSync(needToDeleteDir, { recursive: true });
  }
  
  filesToMove.forEach(filePath => {
    moveFile(path.join(process.cwd(), filePath));
  });

  console.log('File move complete!');
}

main(); 