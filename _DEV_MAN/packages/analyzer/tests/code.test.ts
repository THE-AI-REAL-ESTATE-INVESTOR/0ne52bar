import { analyzeCode, fixCode } from '../src/fixes/code.mjs';
import { promises as fs } from 'fs';
import path from 'path';

describe('Code Analysis', () => {
  const testFile = path.join(process.cwd(), 'src', 'fixes', 'test.mts');
  
  beforeEach(async () => {
    // Create a test file with missing imports
    await fs.writeFile(testFile, `
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Test');
      worksheet.getCell('A1').style = { font: { name: 'Arial' } };
    `);
  });

  afterEach(async () => {
    // Clean up the test file
    try {
      await fs.unlink(testFile);
    } catch (error) {
      // Ignore error if file doesn't exist
    }
  });

  it('should detect missing imports', async () => {
    const result = await analyzeCode();
    expect(result.issues).toHaveLength(3);
    expect(result.issues[0].type).toBe('missing_import');
    expect(result.issues[0].message).toContain('Workbook');
  });

  it('should fix missing imports', async () => {
    await fixCode();
    const content = await fs.readFile(testFile, 'utf-8');
    expect(content).toContain('import { Workbook } from \'exceljs\'');
    expect(content).toContain('import { Worksheet } from \'exceljs\'');
    expect(content).toContain('import { Style } from \'exceljs\'');
  });
}); 