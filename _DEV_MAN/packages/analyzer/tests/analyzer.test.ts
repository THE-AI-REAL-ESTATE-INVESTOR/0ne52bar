import { Workbook } from 'exceljs';
import { analyzeStyles, fixStyles } from '../src/fixes/styles.mjs';
import { analyzeCleanup, fixCleanup } from '../src/fixes/cleanup.mjs';
import { analyze, fix, verify } from '../src/index.mjs';

describe('Marketing Analyzer', () => {
  let workbook: Workbook;

  beforeEach(() => {
    workbook = new Workbook();
  });

  describe('Style Analysis', () => {
    it('should detect inconsistent fonts', async () => {
      const worksheet = workbook.addWorksheet('Test');
      worksheet.getCell('A1').value = 'Test';
      worksheet.getCell('A1').font = { name: 'Times New Roman' };

      const result = await analyzeStyles(workbook);
      expect(result.issues).toHaveLength(1);
      expect(result.issues[0].type).toBe('font');
    });

    it('should fix inconsistent fonts', async () => {
      const worksheet = workbook.addWorksheet('Test');
      worksheet.getCell('A1').value = 'Test';
      worksheet.getCell('A1').font = { name: 'Times New Roman' };

      await fixStyles(workbook);
      expect(worksheet.getCell('A1').font?.name).toBe('Arial');
    });
  });

  describe('Cleanup Analysis', () => {
    it('should detect empty rows', async () => {
      const worksheet = workbook.addWorksheet('Test');
      worksheet.addRow([]);

      const result = await analyzeCleanup(workbook);
      expect(result.issues).toHaveLength(1);
      expect(result.issues[0].type).toBe('empty_row');
    });

    it('should remove empty rows', async () => {
      const worksheet = workbook.addWorksheet('Test');
      worksheet.addRow(['Test']);
      worksheet.addRow([]);

      await fixCleanup(workbook);
      expect(worksheet.rowCount).toBe(1);
    });
  });
});

describe('Main Analyzer', () => {
  let workbook: Workbook;

  beforeEach(() => {
    workbook = new Workbook();
  });

  it('should analyze all aspects of the workbook', async () => {
    const worksheet = workbook.addWorksheet('Test');
    worksheet.getCell('A1').value = '123'; // String number
    worksheet.getCell('A2').value = 'Test';
    worksheet.getCell('A2').font = { name: 'Times New Roman' };
    worksheet.addRow([]); // Empty row

    const result = await analyze(workbook);
    expect(result.types.issues).toHaveLength(1);
    expect(result.styles.issues).toHaveLength(1);
    expect(result.cleanup.issues).toHaveLength(1);
  });

  it('should fix all issues in the workbook', async () => {
    const worksheet = workbook.addWorksheet('Test');
    worksheet.getCell('A1').value = '123'; // String number
    worksheet.getCell('A2').value = 'Test';
    worksheet.getCell('A2').font = { name: 'Times New Roman' };
    worksheet.addRow([]); // Empty row

    await fix(workbook);
    const result = await analyze(workbook);
    expect(result.types.issues).toHaveLength(0);
    expect(result.styles.issues).toHaveLength(0);
    expect(result.cleanup.issues).toHaveLength(0);
  });

  it('should verify the workbook is clean', async () => {
    const worksheet = workbook.addWorksheet('Test');
    worksheet.getCell('A1').value = 123; // Number
    worksheet.getCell('A2').value = 'Test';
    worksheet.getCell('A2').font = { name: 'Arial' };

    const isClean = await verify(workbook);
    expect(isClean).toBe(true);
  });
}); 