/**
 * Excel cell style configuration
 */
export interface ExcelStyle {
  /** Font configuration */
  font?: {
    /** Font family */
    family?: string;
    /** Font size */
    size?: number;
    /** Font color (hex) */
    color?: string;
    /** Bold text */
    bold?: boolean;
    /** Italic text */
    italic?: boolean;
  };
  /** Fill configuration */
  fill?: {
    /** Fill type */
    type: 'pattern' | 'gradient';
    /** Fill color (hex) */
    color?: string;
    /** Pattern type */
    pattern?: 'solid' | 'none';
  };
  /** Alignment configuration */
  alignment?: {
    /** Horizontal alignment */
    horizontal?: 'left' | 'center' | 'right';
    /** Vertical alignment */
    vertical?: 'top' | 'middle' | 'bottom';
    /** Wrap text */
    wrapText?: boolean;
  };
  /** Border configuration */
  border?: {
    /** Border style */
    style?: 'thin' | 'medium' | 'thick';
    /** Border color (hex) */
    color?: string;
  };
  /** Number format */
  numFmt?: string;
}

/**
 * Excel cell configuration
 */
export interface ExcelCell {
  /** Cell value */
  value: string | number | Date;
  /** Cell style */
  style?: ExcelStyle;
  /** Cell formula */
  formula?: string;
  /** Cell comment */
  comment?: string;
  /** Cell merge configuration */
  merge?: {
    /** Number of rows to merge */
    rows: number;
    /** Number of columns to merge */
    columns: number;
  };
}

/**
 * Excel worksheet configuration
 */
export interface ExcelWorksheet {
  /** Worksheet name */
  name: string;
  /** Worksheet data */
  data: ExcelCell[][];
  /** Column widths */
  columnWidths?: number[];
  /** Row heights */
  rowHeights?: number[];
  /** Freeze panes configuration */
  freezePanes?: {
    /** Row to freeze at */
    row: number;
    /** Column to freeze at */
    column: number;
  };
  /** Auto filter configuration */
  autoFilter?: {
    /** Start row */
    startRow: number;
    /** End row */
    endRow: number;
    /** Start column */
    startColumn: number;
    /** End column */
    endColumn: number;
  };
}

/**
 * Excel workbook configuration
 */
export interface ExcelWorkbook {
  /** Workbook name */
  name: string;
  /** Worksheets */
  worksheets: ExcelWorksheet[];
  /** Default styles */
  defaultStyles?: {
    /** Default cell style */
    cell?: ExcelStyle;
    /** Default header style */
    header?: ExcelStyle;
  };
} 