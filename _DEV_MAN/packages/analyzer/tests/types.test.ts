import { Workbook } from 'exceljs';
import { analyzeTypes, fixTypes } from '../src/fixes/types.mjs';

describe('Type Analysis', () => {
  let workbook: Workbook;

  beforeEach(() => {
    workbook = new Workbook();
  });

  it('should detect type mismatches', async () => {
    const worksheet = workbook.addWorksheet('Test');
    worksheet.getCell('A1').value = '123'; // String that looks like a number
    worksheet.getCell('A2').value = 123;   // Actual number

    const result = await analyzeTypes(workbook);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].type).toBe('type_mismatch');
  });

  it('should fix type mismatches', async () => {
    const worksheet = workbook.addWorksheet('Test');
    worksheet.getCell('A1').value = '123'; // String that looks like a number

    await fixTypes(workbook);
    expect(typeof worksheet.getCell('A1').value).toBe('number');
    expect(worksheet.getCell('A1').value).toBe(123);
  });
}); 