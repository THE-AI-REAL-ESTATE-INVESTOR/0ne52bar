import { FeatureFlagConfig } from './types';

/**
 * Feature flag configuration
 */
export const featureFlags: FeatureFlagConfig = {
  // Core marketing features
  enableWeeklyCalculations: {
    name: 'Weekly Calculations',
    description: 'Enable weekly marketing calculations',
    enabled: true,
    defaultValue: true,
  },
  enableMonthlyCalculations: {
    name: 'Monthly Calculations',
    description: 'Enable monthly marketing calculations',
    enabled: true,
    defaultValue: true,
  },
  enableAnnualCalculations: {
    name: 'Annual Calculations',
    description: 'Enable annual marketing calculations',
    enabled: true,
    defaultValue: true,
  },
  enableBreakEvenAnalysis: {
    name: 'Break-Even Analysis',
    description: 'Enable break-even analysis calculations',
    enabled: true,
    defaultValue: true,
  },
  enableAdditionalRevenue: {
    name: 'Additional Revenue',
    description: 'Enable additional revenue considerations',
    enabled: true,
    defaultValue: true,
  },

  // App-specific features
  enableAppMetrics: {
    name: 'App Metrics',
    description: 'Enable app-specific metrics calculations',
    enabled: true,
    defaultValue: true,
  },
  enableAppROI: {
    name: 'App ROI',
    description: 'Enable app ROI calculations',
    enabled: true,
    defaultValue: true,
  },
  enableEngagementScore: {
    name: 'Engagement Score',
    description: 'Enable app user engagement score calculations',
    enabled: true,
    defaultValue: true,
  },
  enableEfficiencyScore: {
    name: 'Efficiency Score',
    description: 'Enable app marketing efficiency score calculations',
    enabled: true,
    defaultValue: true,
  },

  // Excel generation features
  enableExcelReports: {
    name: 'Excel Reports',
    description: 'Enable Excel report generation',
    enabled: true,
    defaultValue: true,
  },
  enableCustomFormatting: {
    name: 'Custom Formatting',
    description: 'Enable custom number formatting in Excel reports',
    enabled: true,
    defaultValue: true,
  },
  enableWorksheetGeneration: {
    name: 'Worksheet Generation',
    description: 'Enable automatic worksheet generation',
    enabled: true,
    defaultValue: true,
  },

  // Experimental features
  enableExperimentalCalculations: {
    name: 'Experimental Calculations',
    description: 'Enable experimental calculation methods',
    enabled: false,
    defaultValue: false,
  },
  enableAdvancedAnalytics: {
    name: 'Advanced Analytics',
    description: 'Enable advanced analytics features',
    enabled: false,
    defaultValue: false,
  },
  enablePredictiveModeling: {
    name: 'Predictive Modeling',
    description: 'Enable predictive modeling features',
    enabled: false,
    defaultValue: false,
  },
}; 