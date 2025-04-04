import { AppParameter, GrowthMetric, ValidationCheck } from '@/types/types';

export const appParameters: AppParameter[] = [
  { name: 'Weekly App Signups', value: 100, unit: 'number' },
  { name: 'Monthly Organic Signups', value: 50, unit: 'number' },
  { name: 'Opt-out Rate', value: 0.15, unit: 'percentage' },
  { name: 'Push Notification Cost', value: 0.02, unit: 'currency' },
  { name: 'Average Order Value', value: 25, unit: 'currency' },
  { name: 'Postmates Delivery Rate', value: 0.30, unit: 'percentage' },
  { name: 'Postmates Fee', value: 0.15, unit: 'percentage' },
  { name: 'Monthly Growth', value: 0.10, unit: 'percentage' },
  { name: 'Total Marketing Cost', value: 5000, unit: 'currency' },
  { name: 'Revenue per Customer', value: 75, unit: 'currency' },
  { name: 'Curbside Order Rate', value: 0.25, unit: 'percentage' },
  { name: 'Cook Hourly Rate', value: 15, unit: 'currency' },
  { name: 'Cook Hours Per Day', value: 8, unit: 'number' },
  { name: 'Cook Days Per Week', value: 5, unit: 'number' },
  { name: 'Cook Start Time', value: '10:00', unit: 'time' },
  { name: 'Cook End Time', value: '18:00', unit: 'time' }
];

export const growthMetrics: GrowthMetric[] = [
  { name: 'Recipients', formula: '=B5+B7' },
  { name: 'New Customers', formula: '=B8*(1-B9)' },
  { name: 'New Revenue', formula: '=B10*B11' },
  { name: 'Marketing Cost', formula: '=B4' },
  { name: 'Curbside Revenue', formula: '=B12*B13*B14' },
  { name: 'Cook Cost', formula: '=B15*B16*B17*4' },
  { name: 'Net Revenue', formula: '=B12+B18-B19-B20' }
];

export const validationChecks: ValidationCheck[] = [
  { name: 'Weekly App Signups', expected: 100, formula: '=B5' },
  { name: 'Monthly Organic Signups', expected: 50, formula: '=B7' },
  { name: 'Opt-out Rate', expected: 0.15, formula: '=B9' },
  { name: 'Push Notification Cost', expected: 0.02, formula: '=B10' },
  { name: 'Average Order Value', expected: 25, formula: '=B11' },
  { name: 'Postmates Delivery Rate', expected: 0.30, formula: '=B12' },
  { name: 'Postmates Fee', expected: 0.15, formula: '=B13' },
  { name: 'Monthly Growth', expected: 0.10, formula: '=B14' },
  { name: 'Total Marketing Cost', expected: 5000, formula: '=B15' },
  { name: 'Revenue per Customer', expected: 75, formula: '=B16' },
  { name: 'Curbside Order Rate', expected: 0.25, formula: '=B17' },
  { name: 'Cook Hourly Rate', expected: 15, formula: '=B18' },
  { name: 'Cook Hours Per Day', expected: 8, formula: '=B19' },
  { name: 'Cook Days Per Week', expected: 5, formula: '=B20' }
]; 