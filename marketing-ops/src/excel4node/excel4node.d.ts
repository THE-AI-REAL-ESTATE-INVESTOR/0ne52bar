declare module 'excel4node' {
  export class Workbook {
    constructor();
    createStyle(style: {
      font?: {
        bold?: boolean;
        italic?: boolean;
        color?: string;
      };
      fill?: {
        type: string;
        pattern: string;
        fgColor: string;
      };
      alignment?: {
        horizontal?: string;
        vertical?: string;
        wrapText?: boolean;
      };
    }): any;
    addWorksheet(name: string): Worksheet;
    write(filePath: string): void;
  }

  export class Worksheet {
    cell(row: number, col: number, rowSpan?: number, colSpan?: number, merge?: boolean): Cell;
    column(col: number): Column;
  }

  export class Cell {
    string(value: string): Cell;
    number(value: number): Cell;
    style(style: any): Cell;
  }

  export class Column {
    setWidth(width: number): void;
  }

  const excel: {
    Workbook: typeof Workbook;
  };
  export default excel;
} 