import { ExcelComponent } from '../base';
import { ChartOptions } from '@/types/types';

/**
 * Component for managing Excel charts
 */
export class ChartComponent extends ExcelComponent {
  /**
   * Create a bar chart
   */
  async createBarChart(options: ChartOptions): Promise<void> {
    const sheet = this.workbook.getWorksheet(options.dataRange.sheet);
    if (!sheet) {
      throw new Error(`Worksheet ${options.dataRange.sheet} not found`);
    }

    const chart = sheet.addChart({
      type: 'bar',
      title: options.title,
      plotArea: {
        dataLabels: {
          showValue: true,
          showPercent: false,
        },
      },
    });

    // Add data series
    chart.addSeries({
      data: sheet.getCell(options.dataRange.startCell).value,
      xAxis: options.xAxisLabel,
      yAxis: options.yAxisLabel,
    });

    // Apply chart style
    if (options.style) {
      if (options.style.colors) {
        chart.style.colors = options.style.colors;
      }
      if (options.style.fontSize) {
        chart.style.fontSize = options.style.fontSize;
      }
      if (options.style.titleSize) {
        chart.style.titleSize = options.style.titleSize;
      }
    }

    // Add legend if specified
    if (options.legend) {
      chart.legend = {
        position: 'right',
      };
    }
  }

  /**
   * Create a line chart
   */
  async createLineChart(options: ChartOptions): Promise<void> {
    const sheet = this.workbook.getWorksheet(options.dataRange.sheet);
    if (!sheet) {
      throw new Error(`Worksheet ${options.dataRange.sheet} not found`);
    }

    const chart = sheet.addChart({
      type: 'line',
      title: options.title,
      plotArea: {
        dataLabels: {
          showValue: true,
          showPercent: false,
        },
      },
    });

    // Add data series
    chart.addSeries({
      data: sheet.getCell(options.dataRange.startCell).value,
      xAxis: options.xAxisLabel,
      yAxis: options.yAxisLabel,
    });

    // Apply chart style
    if (options.style) {
      if (options.style.colors) {
        chart.style.colors = options.style.colors;
      }
      if (options.style.fontSize) {
        chart.style.fontSize = options.style.fontSize;
      }
      if (options.style.titleSize) {
        chart.style.titleSize = options.style.titleSize;
      }
    }

    // Add legend if specified
    if (options.legend) {
      chart.legend = {
        position: 'right',
      };
    }
  }

  /**
   * Create a pie chart
   */
  async createPieChart(options: ChartOptions): Promise<void> {
    const sheet = this.workbook.getWorksheet(options.dataRange.sheet);
    if (!sheet) {
      throw new Error(`Worksheet ${options.dataRange.sheet} not found`);
    }

    const chart = sheet.addChart({
      type: 'pie',
      title: options.title,
      plotArea: {
        dataLabels: {
          showValue: true,
          showPercent: true,
        },
      },
    });

    // Add data series
    chart.addSeries({
      data: sheet.getCell(options.dataRange.startCell).value,
      xAxis: options.xAxisLabel,
      yAxis: options.yAxisLabel,
    });

    // Apply chart style
    if (options.style) {
      if (options.style.colors) {
        chart.style.colors = options.style.colors;
      }
      if (options.style.fontSize) {
        chart.style.fontSize = options.style.fontSize;
      }
      if (options.style.titleSize) {
        chart.style.titleSize = options.style.titleSize;
      }
    }

    // Add legend if specified
    if (options.legend) {
      chart.legend = {
        position: 'right',
      };
    }
  }

  /**
   * Apply chart style
   */
  async applyChartStyle(chart: any, style: ChartOptions['style']): Promise<void> {
    if (!style) return;

    if (style.colors) {
      chart.style.colors = style.colors;
    }
    if (style.fontSize) {
      chart.style.fontSize = style.fontSize;
    }
    if (style.titleSize) {
      chart.style.titleSize = style.titleSize;
    }
  }
} 