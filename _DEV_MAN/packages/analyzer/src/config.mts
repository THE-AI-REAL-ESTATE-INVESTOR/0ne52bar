import path from 'path';

export interface AnalyzerConfig {
  targetPath: string;
  excelDir: string;
  outputDir: string;
}

// Default configuration
export const defaultConfig: AnalyzerConfig = {
  targetPath: '/Users/markcarpenter/Desktop/152bar/marketing-ops/one-52-excell-marketing-app',
  excelDir: 'src/consolidated/shared/excel',
  outputDir: 'output'
};

// Current configuration (can be updated at runtime)
export let currentConfig: AnalyzerConfig = { ...defaultConfig };

/**
 * Updates the analyzer configuration
 * @param config Partial configuration to update
 */
export function updateConfig(config: Partial<AnalyzerConfig>): void {
  currentConfig = {
    ...currentConfig,
    ...config
  };
}

/**
 * Gets the full path for a given relative path
 * @param relativePath Path relative to targetPath
 * @returns Full absolute path
 */
export function getFullPath(relativePath: string): string {
  return path.join(currentConfig.targetPath, relativePath);
}

/**
 * Gets the full path for the excel directory
 */
export function getExcelDir(): string {
  return getFullPath(currentConfig.excelDir);
}

/**
 * Gets the full path for the output directory
 */
export function getOutputDir(): string {
  return getFullPath(currentConfig.outputDir);
} 