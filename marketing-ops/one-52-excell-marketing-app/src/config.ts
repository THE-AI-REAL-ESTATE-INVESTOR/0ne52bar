import fs from 'fs';
import path from 'path';
import { Style, Fill, Font, Alignment } from 'exceljs';
import { MarketingCampaignData } from '@/types/types';

// Project Configuration
interface ProjectConfig {
  name: string;
  version: string;
  filePrefix: string;
  outputDir: string;
  versionsDir: string;
}

const defaultConfig: ProjectConfig = {
  name: 'one-52-marketing',
  version: '1.0.0',
  filePrefix: 'one-52-marketing',
  outputDir: 'dist',
  versionsDir: 'src/versions'
};

// Excel Styles Configuration
const styles = {
  header: {
    font: { bold: true, color: { argb: 'FFFFFF' }, size: 20 },
    fill: { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: '2B579A' } },
    alignment: { horizontal: 'center' as const, vertical: 'middle' as const, wrapText: true }
  },
  input: {
    font: { size: 20 },
    fill: { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'E6F3FF' } },
    alignment: { horizontal: 'center' as const, vertical: 'middle' as const, wrapText: true }
  },
  result: {
    font: { bold: true, size: 20 },
    fill: { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'F2F2F2' } },
    alignment: { horizontal: 'center' as const, vertical: 'middle' as const, wrapText: true }
  },
  growth: {
    font: { bold: true, color: { argb: '006100' }, size: 20 },
    fill: { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'C6EFCE' } },
    alignment: { horizontal: 'center' as const, vertical: 'middle' as const, wrapText: true }
  },
  cost: {
    font: { bold: true, color: { argb: '9C0006' }, size: 20 },
    fill: { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FFC7CE' } },
    alignment: { horizontal: 'center' as const, vertical: 'middle' as const, wrapText: true }
  },
  warning: {
    font: { bold: true, color: { argb: 'FF0000' }, size: 20 },
    fill: { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FFFFCC' } },
    alignment: { horizontal: 'center' as const, vertical: 'middle' as const, wrapText: true }
  }
} as const;

// Campaign Parameters Configuration
const campaignData: MarketingCampaignData = {
  parameters: {
    availableStamps: 0,
    costPerStamp: 0,
    weeklyTargetRecipients: 0,
    conversionRate: 0,
    currentWeeklyRevenue: 0,
    averageCustomerValue: 0
  },
  weeklyCalculations: {
    recipients: 0,
    newCustomers: 0,
    weeklyRevenueFromNewCustomers: 0,
    totalWeeklyRevenueWithNewCustomers: 0,
    weeklyStampCost: 0,
    netWeeklyRevenue: 0
  },
  monthlyCalculations: {
    recipients: 0,
    newCustomers: 0,
    monthlyRevenueFromNewCustomers: 0,
    totalMonthlyRevenueWithNewCustomers: 0,
    monthlyStampCost: 0,
    netMonthlyRevenue: 0
  },
  annualCalculations: {
    recipients: 0,
    newCustomers: 0,
    annualRevenueFromNewCustomers: 0,
    totalAnnualRevenueWithNewCustomers: 0,
    annualStampCost: 0,
    netAnnualRevenue: 0
  },
  additionalRevenueConsiderations: {
    repeatCustomerRate: 0,
    repeatVisitsPerCustomer: 0,
    averageSpendIncrease: 0,
    wordOfMouthReferrals: 0,
    referralConversionRate: 0,
    socialMediaShares: 0,
    socialMediaConversionRate: 0,
    wordOfMouthEffect: 0,
    additionalAnnualRevenueFromRepeatCustomers: 0,
    netAnnualRevenueWithRepeatCustomers: 0,
    additionalAnnualRevenueFromWordOfMouth: 0
  },
  breakEvenAnalysis: {
    totalMarketingCost: 0,
    revenuePerCustomer: 0,
    customersNeededForBreakEven: 0,
    estimatedBreakEvenWeeks: 0,
    returnOnInvestment: 0,
    requiredNewCustomersToBreakEven: 0,
    requiredConversionRateToBreakEven: 0
  }
};

// App Parameters Configuration
const appParameters = {
  appName: 'ONE52 Bar App',
  appDescription: 'Mobile app for ONE52 Bar customers',
  appFeatures: [
    'Digital loyalty program',
    'Menu browsing',
    'Order ahead',
    'Event notifications',
    'Special offers'
  ],
  appMetrics: {
    downloadCost: 0,
    targetDownloads: 0,
    conversionRate: 0,
    averageOrderValue: 0,
    repeatOrderRate: 0,
    averageOrdersPerCustomer: 0
  }
};

export { defaultConfig, styles, campaignData, appParameters };

// Growth Metrics Configuration
export const growthMetrics = {
  'Weekly App Signups': 0,
  'Monthly Organic Signups': 0,
  'Opt-out Rate': 0,
  'Push Notification Cost': 0,
  'Average Order Value': 0,
  'Postmates Delivery Rate': 0,
  'Postmates Fee': 0,
  'Curbside Order Rate': 0,
  'Cook Hourly Rate': 0,
  'Cook Hours Per Day': 0,
  'Cook Days Per Week': 0
} as const;

// Configuration Management Functions
export function getConfig(): ProjectConfig {
  try {
    const configPath = path.join(process.cwd(), 'project.config.json');
    if (fs.existsSync(configPath)) {
      const userConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      return { ...defaultConfig, ...userConfig };
    }
  } catch (error) {
    console.warn('⚠️ Error reading project.config.json, using default configuration');
  }
  return defaultConfig;
}

export function saveConfig(config: ProjectConfig): void {
  const configPath = path.join(process.cwd(), 'project.config.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log('✅ Configuration saved to project.config.json');
} 