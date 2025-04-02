import excel from 'excel4node';
import path from 'path';

interface AppMarketingData {
  parameters: {
    // Base parameters from original calculator
    availableStamps: number;
    costPerStamp: number;
    weeklyTargetRecipients: number;
    conversionRate: number;
    currentWeeklyRevenue: number;
    averageCustomerValue: number;
    
    // App-specific parameters
    weeklyAppSignups: number; // 5 new signups per week from engagement
    monthlyOrganicSignups: number; // 5 new people per month from TapPass
    optOutRate: number; // 3% opt-out rate
    pushNotificationCost: number; // Cost per push notification
    averageOrderValue: number; // Average order through app
    postmatesDeliveryRate: number; // % of orders through Postmates
    postmatesFee: number; // Postmates fee percentage
  };
  weeklyCalculations: {
    // Original metrics
    recipients: number;
    newCustomers: number;
    weeklyRevenueFromNewCustomers: number;
    totalWeeklyRevenueWithNewCustomers: number;
    weeklyStampCost: number;
    netWeeklyRevenue: number;
    
    // App-specific metrics
    activeAppUsers: number;
    pushNotificationRecipients: number;
    appOrderRevenue: number;
    deliveryRevenue: number;
    totalAppRevenue: number;
  };
  monthlyCalculations: {
    // Original metrics
    recipients: number;
    newCustomers: number;
    monthlyRevenueFromNewCustomers: number;
    totalMonthlyRevenueWithNewCustomers: number;
    monthlyStampCost: number;
    netMonthlyRevenue: number;
    
    // App-specific metrics
    activeAppUsers: number;
    pushNotificationRecipients: number;
    appOrderRevenue: number;
    deliveryRevenue: number;
    totalAppRevenue: number;
    organicSignups: number;
  };
  annualCalculations: {
    // Original metrics
    recipients: number;
    newCustomers: number;
    annualRevenueFromNewCustomers: number;
    totalAnnualRevenueWithNewCustomers: number;
    annualStampCost: number;
    netAnnualRevenue: number;
    
    // App-specific metrics
    activeAppUsers: number;
    pushNotificationRecipients: number;
    appOrderRevenue: number;
    deliveryRevenue: number;
    totalAppRevenue: number;
    organicSignups: number;
  };
  appMetrics: {
    pushNotificationEngagementRate: number;
    averageOrdersPerUser: number;
    deliveryOrderPercentage: number;
    customerRetentionRate: number;
    averagePointsPerVisit: number;
    pointRedemptionRate: number;
  };
  revenueProjections: {
    inAppOrderRevenue: number;
    deliveryOrderRevenue: number;
    pointsRedemptionValue: number;
    totalAppDrivenRevenue: number;
    costSavingsFromDigitalMarketing: number;
    netAppImpact: number;
  };
}

// Initialize default values
const appMarketingData: AppMarketingData = {
  parameters: {
    // Keep original parameters the same
    availableStamps: 2000,
    costPerStamp: 0.56,
    weeklyTargetRecipients: 500,
    conversionRate: 0.0005,
    currentWeeklyRevenue: 8000,
    averageCustomerValue: 50,
    
    // Add app-specific parameters
    weeklyAppSignups: 5,
    monthlyOrganicSignups: 5,
    optOutRate: 0.03,
    pushNotificationCost: 0.001,
    averageOrderValue: 45,
    postmatesDeliveryRate: 0.15,
    postmatesFee: 0.30
  },
  weeklyCalculations: {
    recipients: 0,
    newCustomers: 0,
    weeklyRevenueFromNewCustomers: 0,
    totalWeeklyRevenueWithNewCustomers: 0,
    weeklyStampCost: 0,
    netWeeklyRevenue: 0,
    
    activeAppUsers: 0,
    pushNotificationRecipients: 0,
    appOrderRevenue: 0,
    deliveryRevenue: 0,
    totalAppRevenue: 0
  },
  monthlyCalculations: {
    recipients: 0,
    newCustomers: 0,
    monthlyRevenueFromNewCustomers: 0,
    totalMonthlyRevenueWithNewCustomers: 0,
    monthlyStampCost: 0,
    netMonthlyRevenue: 0,
    
    activeAppUsers: 0,
    pushNotificationRecipients: 0,
    appOrderRevenue: 0,
    deliveryRevenue: 0,
    totalAppRevenue: 0,
    organicSignups: 0
  },
  annualCalculations: {
    recipients: 0,
    newCustomers: 0,
    annualRevenueFromNewCustomers: 0,
    totalAnnualRevenueWithNewCustomers: 0,
    annualStampCost: 0,
    netAnnualRevenue: 0,
    
    activeAppUsers: 0,
    pushNotificationRecipients: 0,
    appOrderRevenue: 0,
    deliveryRevenue: 0,
    totalAppRevenue: 0,
    organicSignups: 0
  },
  appMetrics: {
    pushNotificationEngagementRate: 0.25,
    averageOrdersPerUser: 2,
    deliveryOrderPercentage: 0.15,
    customerRetentionRate: 0.85,
    averagePointsPerVisit: 50,
    pointRedemptionRate: 0.20
  },
  revenueProjections: {
    inAppOrderRevenue: 0,
    deliveryOrderRevenue: 0,
    pointsRedemptionValue: 0,
    totalAppDrivenRevenue: 0,
    costSavingsFromDigitalMarketing: 0,
    netAppImpact: 0
  }
};

function calculateAppMarketingData(data: AppMarketingData): AppMarketingData {
  // Calculate weekly metrics
  data.weeklyCalculations.recipients = data.parameters.weeklyTargetRecipients;
  data.weeklyCalculations.newCustomers = data.weeklyCalculations.recipients * data.parameters.conversionRate;
  data.weeklyCalculations.weeklyRevenueFromNewCustomers = data.weeklyCalculations.newCustomers * data.parameters.averageCustomerValue;
  data.weeklyCalculations.totalWeeklyRevenueWithNewCustomers = data.parameters.currentWeeklyRevenue + data.weeklyCalculations.weeklyRevenueFromNewCustomers;
  data.weeklyCalculations.weeklyStampCost = data.weeklyCalculations.recipients * data.parameters.costPerStamp;
  data.weeklyCalculations.netWeeklyRevenue = data.weeklyCalculations.totalWeeklyRevenueWithNewCustomers - data.weeklyCalculations.weeklyStampCost;
  
  // Calculate app-specific weekly metrics
  data.weeklyCalculations.activeAppUsers = data.parameters.weeklyAppSignups * (1 - data.parameters.optOutRate);
  data.weeklyCalculations.pushNotificationRecipients = data.weeklyCalculations.activeAppUsers;
  data.weeklyCalculations.appOrderRevenue = data.weeklyCalculations.activeAppUsers * data.parameters.averageOrderValue * data.appMetrics.averageOrdersPerUser;
  data.weeklyCalculations.deliveryRevenue = data.weeklyCalculations.appOrderRevenue * data.parameters.postmatesDeliveryRate * (1 - data.parameters.postmatesFee);
  data.weeklyCalculations.totalAppRevenue = data.weeklyCalculations.appOrderRevenue + data.weeklyCalculations.deliveryRevenue;

  // Calculate monthly metrics
  data.monthlyCalculations.recipients = data.weeklyCalculations.recipients * 4;
  data.monthlyCalculations.newCustomers = data.monthlyCalculations.recipients * data.parameters.conversionRate;
  data.monthlyCalculations.monthlyRevenueFromNewCustomers = data.monthlyCalculations.newCustomers * data.parameters.averageCustomerValue;
  data.monthlyCalculations.totalMonthlyRevenueWithNewCustomers = data.parameters.currentWeeklyRevenue * 4 + data.monthlyCalculations.monthlyRevenueFromNewCustomers;
  data.monthlyCalculations.monthlyStampCost = data.monthlyCalculations.recipients * data.parameters.costPerStamp;
  data.monthlyCalculations.netMonthlyRevenue = data.monthlyCalculations.totalMonthlyRevenueWithNewCustomers - data.monthlyCalculations.monthlyStampCost;
  
  // Calculate app-specific monthly metrics
  data.monthlyCalculations.organicSignups = data.parameters.monthlyOrganicSignups;
  data.monthlyCalculations.activeAppUsers = (data.weeklyCalculations.activeAppUsers * 4) + data.monthlyCalculations.organicSignups;
  data.monthlyCalculations.pushNotificationRecipients = data.monthlyCalculations.activeAppUsers;
  data.monthlyCalculations.appOrderRevenue = data.monthlyCalculations.activeAppUsers * data.parameters.averageOrderValue * data.appMetrics.averageOrdersPerUser;
  data.monthlyCalculations.deliveryRevenue = data.monthlyCalculations.appOrderRevenue * data.parameters.postmatesDeliveryRate * (1 - data.parameters.postmatesFee);
  data.monthlyCalculations.totalAppRevenue = data.monthlyCalculations.appOrderRevenue + data.monthlyCalculations.deliveryRevenue;

  // Calculate annual metrics
  data.annualCalculations.recipients = data.weeklyCalculations.recipients * 52;
  data.annualCalculations.newCustomers = data.annualCalculations.recipients * data.parameters.conversionRate;
  data.annualCalculations.annualRevenueFromNewCustomers = data.annualCalculations.newCustomers * data.parameters.averageCustomerValue;
  data.annualCalculations.totalAnnualRevenueWithNewCustomers = data.parameters.currentWeeklyRevenue * 52 + data.annualCalculations.annualRevenueFromNewCustomers;
  data.annualCalculations.annualStampCost = data.annualCalculations.recipients * data.parameters.costPerStamp;
  data.annualCalculations.netAnnualRevenue = data.annualCalculations.totalAnnualRevenueWithNewCustomers - data.annualCalculations.annualStampCost;
  
  // Calculate app-specific annual metrics
  data.annualCalculations.organicSignups = data.monthlyCalculations.organicSignups * 12;
  data.annualCalculations.activeAppUsers = (data.weeklyCalculations.activeAppUsers * 52) + data.annualCalculations.organicSignups;
  data.annualCalculations.pushNotificationRecipients = data.annualCalculations.activeAppUsers;
  data.annualCalculations.appOrderRevenue = data.annualCalculations.activeAppUsers * data.parameters.averageOrderValue * data.appMetrics.averageOrdersPerUser;
  data.annualCalculations.deliveryRevenue = data.annualCalculations.appOrderRevenue * data.parameters.postmatesDeliveryRate * (1 - data.parameters.postmatesFee);
  data.annualCalculations.totalAppRevenue = data.annualCalculations.appOrderRevenue + data.annualCalculations.deliveryRevenue;

  // Calculate revenue projections
  data.revenueProjections.inAppOrderRevenue = data.annualCalculations.appOrderRevenue;
  data.revenueProjections.deliveryOrderRevenue = data.annualCalculations.deliveryRevenue;
  data.revenueProjections.pointsRedemptionValue = data.annualCalculations.activeAppUsers * data.appMetrics.averagePointsPerVisit * data.appMetrics.pointRedemptionRate;
  data.revenueProjections.totalAppDrivenRevenue = data.revenueProjections.inAppOrderRevenue + data.revenueProjections.deliveryOrderRevenue;
  data.revenueProjections.costSavingsFromDigitalMarketing = data.annualCalculations.annualStampCost * 0.25; // Assume 25% reduction in direct mail costs
  data.revenueProjections.netAppImpact = data.revenueProjections.totalAppDrivenRevenue + data.revenueProjections.costSavingsFromDigitalMarketing;

  return data;
}

function generateAppMarketingSpreadsheet(data: AppMarketingData): void {
  const wb = new excel.Workbook();

  // Add ONE52 Bar App worksheet
  const appWs = wb.addWorksheet('ONE52 Bar App');

  // Define styles
  const headerStyle = wb.createStyle({
    font: {
      bold: true,
      color: '#FFFFFF',
    },
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: '#4F81BD',
    },
    alignment: {
      horizontal: 'center',
      vertical: 'center',
    },
  });

  const inputStyle = wb.createStyle({
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: '#E6F3FF',
    },
    alignment: {
      horizontal: 'center',
      vertical: 'center',
    },
  });

  const resultStyle = wb.createStyle({
    font: {
      bold: true,
    },
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: '#F2F2F2',
    },
    alignment: {
      horizontal: 'center',
      vertical: 'center',
    },
  });

  // Set column widths
  appWs.column(1).setWidth(40);
  appWs.column(2).setWidth(20);
  appWs.column(3).setWidth(20);
  appWs.column(4).setWidth(40);

  // Add title
  appWs.cell(1, 1, 1, 4, true).string('ONE52 Bar & Grill App Marketing Impact Calculator').style(headerStyle);

  // Add section headers
  appWs.cell(3, 1, 3, 4, true).string('App Parameters').style(headerStyle);
  appWs.cell(12, 1, 12, 4, true).string('Weekly App Metrics').style(headerStyle);
  appWs.cell(20, 1, 20, 4, true).string('Monthly App Metrics').style(headerStyle);
  appWs.cell(28, 1, 28, 4, true).string('Annual App Metrics').style(headerStyle);
  appWs.cell(36, 1, 36, 4, true).string('App Performance Metrics').style(headerStyle);
  appWs.cell(44, 1, 44, 4, true).string('Revenue Impact Analysis').style(headerStyle);

  // Add app parameters
  appWs.cell(4, 1).string('Parameter').style(headerStyle);
  appWs.cell(4, 2).string('Value').style(headerStyle);
  appWs.cell(4, 3).string('Unit').style(headerStyle);
  appWs.cell(4, 4).string('Notes').style(headerStyle);

  // App parameters
  let row = 5;
  const parameters = [
    ['Weekly App Signups', data.parameters.weeklyAppSignups, 'users', 'New app signups per week'],
    ['Monthly Organic Signups', data.parameters.monthlyOrganicSignups, 'users', 'Additional TapPass signups per month'],
    ['Opt-out Rate', data.parameters.optOutRate, '%', 'Percentage of users who opt out'],
    ['Push Notification Cost', data.parameters.pushNotificationCost, '$ per push', 'Cost per push notification sent'],
    ['Average Order Value', data.parameters.averageOrderValue, '$', 'Average order value through app'],
    ['Postmates Delivery Rate', data.parameters.postmatesDeliveryRate, '%', 'Percentage of orders through Postmates'],
    ['Postmates Fee', data.parameters.postmatesFee, '%', 'Postmates fee percentage']
  ];

  parameters.forEach(([name, value, unit, note]) => {
    appWs.cell(row, 1).string(name as string).style(inputStyle);
    appWs.cell(row, 2).number(value as number).style(inputStyle);
    appWs.cell(row, 3).string(unit as string).style(inputStyle);
    appWs.cell(row, 4).string(note as string).style(inputStyle);
    row++;
  });

  // Add weekly metrics
  row = 13;
  appWs.cell(row, 1).string('Metric').style(headerStyle);
  appWs.cell(row, 2).string('Value').style(headerStyle);
  appWs.cell(row, 3).string('Formula').style(headerStyle);
  appWs.cell(row, 4).string('Notes').style(headerStyle);

  const weeklyMetrics = [
    ['Active App Users', '=B5*(1-B7)', 'Weekly signups × (1 - opt-out rate)', 'Active users from weekly signups'],
    ['Push Notification Recipients', '=B14', 'Same as active users', 'Users receiving push notifications'],
    ['App Order Revenue', '=B14*B8*2', 'Active users × avg order value × 2 orders', 'Revenue from app orders'],
    ['Delivery Revenue', '=B16*B9*(1-B10)', 'App orders × delivery rate × (1 - fee)', 'Revenue from deliveries'],
    ['Total App Revenue', '=B16+B17', 'App revenue + delivery revenue', 'Total revenue from app usage']
  ];

  row++;
  weeklyMetrics.forEach(([name, formula, calculation, note]) => {
    appWs.cell(row, 1).string(name as string).style(resultStyle);
    appWs.cell(row, 2).string(formula as string).style(resultStyle);
    appWs.cell(row, 3).string(calculation as string).style(resultStyle);
    appWs.cell(row, 4).string(note as string).style(resultStyle);
    row++;
  });

  // Add monthly metrics
  row = 21;
  appWs.cell(row, 1).string('Metric').style(headerStyle);
  appWs.cell(row, 2).string('Value').style(headerStyle);
  appWs.cell(row, 3).string('Formula').style(headerStyle);
  appWs.cell(row, 4).string('Notes').style(headerStyle);

  const monthlyMetrics = [
    ['Active App Users', '=(B14*4)+B6', '(Weekly active × 4) + organic signups', 'Monthly active app users'],
    ['Push Notification Recipients', '=B22', 'Same as active users', 'Users receiving push notifications'],
    ['App Order Revenue', '=B22*B8*2', 'Active users × avg order value × 2 orders', 'Revenue from app orders'],
    ['Delivery Revenue', '=B24*B9*(1-B10)', 'App orders × delivery rate × (1 - fee)', 'Revenue from deliveries'],
    ['Total App Revenue', '=B24+B25', 'App revenue + delivery revenue', 'Total revenue from app usage']
  ];

  row++;
  monthlyMetrics.forEach(([name, formula, calculation, note]) => {
    appWs.cell(row, 1).string(name as string).style(resultStyle);
    appWs.cell(row, 2).string(formula as string).style(resultStyle);
    appWs.cell(row, 3).string(calculation as string).style(resultStyle);
    appWs.cell(row, 4).string(note as string).style(resultStyle);
    row++;
  });

  // Add annual metrics
  row = 29;
  appWs.cell(row, 1).string('Metric').style(headerStyle);
  appWs.cell(row, 2).string('Value').style(headerStyle);
  appWs.cell(row, 3).string('Formula').style(headerStyle);
  appWs.cell(row, 4).string('Notes').style(headerStyle);

  const annualMetrics = [
    ['Active App Users', '=(B14*52)+(B6*12)', '(Weekly active × 52) + (organic × 12)', 'Annual active app users'],
    ['Push Notification Recipients', '=B30', 'Same as active users', 'Users receiving push notifications'],
    ['App Order Revenue', '=B30*B8*2', 'Active users × avg order value × 2 orders', 'Revenue from app orders'],
    ['Delivery Revenue', '=B32*B9*(1-B10)', 'App orders × delivery rate × (1 - fee)', 'Revenue from deliveries'],
    ['Total App Revenue', '=B32+B33', 'App revenue + delivery revenue', 'Total revenue from app usage']
  ];

  row++;
  annualMetrics.forEach(([name, formula, calculation, note]) => {
    appWs.cell(row, 1).string(name as string).style(resultStyle);
    appWs.cell(row, 2).string(formula as string).style(resultStyle);
    appWs.cell(row, 3).string(calculation as string).style(resultStyle);
    appWs.cell(row, 4).string(note as string).style(resultStyle);
    row++;
  });

  // Add app performance metrics
  row = 37;
  appWs.cell(row, 1).string('Metric').style(headerStyle);
  appWs.cell(row, 2).string('Value').style(headerStyle);
  appWs.cell(row, 3).string('Target').style(headerStyle);
  appWs.cell(row, 4).string('Notes').style(headerStyle);

  const performanceMetrics = [
    ['Push Notification Engagement', '25%', '30%', 'Percentage of users engaging with push notifications'],
    ['Average Orders per User', '2', '3', 'Average number of orders per user per month'],
    ['Delivery Order Percentage', '15%', '20%', 'Percentage of orders requesting delivery'],
    ['Customer Retention Rate', '85%', '90%', 'Percentage of users retained month over month'],
    ['Average Points per Visit', '50', '50', 'TapPass points earned per visit'],
    ['Point Redemption Rate', '20%', '25%', 'Percentage of points redeemed']
  ];

  row++;
  performanceMetrics.forEach(([name, value, target, note]) => {
    appWs.cell(row, 1).string(name as string).style(resultStyle);
    appWs.cell(row, 2).string(value as string).style(resultStyle);
    appWs.cell(row, 3).string(target as string).style(resultStyle);
    appWs.cell(row, 4).string(note as string).style(resultStyle);
    row++;
  });

  // Add revenue impact analysis
  row = 45;
  appWs.cell(row, 1).string('Metric').style(headerStyle);
  appWs.cell(row, 2).string('Value').style(headerStyle);
  appWs.cell(row, 3).string('Formula').style(headerStyle);
  appWs.cell(row, 4).string('Notes').style(headerStyle);

  const revenueImpact = [
    ['In-App Order Revenue', '=B32', 'From annual metrics', 'Annual revenue from app orders'],
    ['Delivery Order Revenue', '=B33', 'From annual metrics', 'Annual revenue from deliveries'],
    ['Points Redemption Value', '=B30*50*0.2', 'Active users × points × redemption rate', 'Value of redeemed points'],
    ['Total App-Driven Revenue', '=B46+B47', 'Order revenue + delivery revenue', 'Total revenue from app usage'],
    ['Marketing Cost Savings', '=B34*0.25', '25% of annual marketing costs', 'Savings from reduced direct mail'],
    ['Net App Impact', '=B49+B50', 'Revenue + cost savings', 'Total financial impact of app']
  ];

  row++;
  revenueImpact.forEach(([name, formula, calculation, note]) => {
    appWs.cell(row, 1).string(name as string).style(resultStyle);
    appWs.cell(row, 2).string(formula as string).style(resultStyle);
    appWs.cell(row, 3).string(calculation as string).style(resultStyle);
    appWs.cell(row, 4).string(note as string).style(resultStyle);
    row++;
  });

  // Add warning header
  const warningStyle = wb.createStyle({
    font: {
      bold: true,
      color: '#FF0000',
    },
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: '#FFFFCC',
    },
    alignment: {
      horizontal: 'center',
      vertical: 'center',
    },
  });

  appWs.cell(1, 1).string('ONE52 Bar App Marketing Impact Calculator - DO NOT MODIFY FORMULAS').style(warningStyle);

  // Save the workbook
  const filePath = path.join(__dirname, 'ONE52-Bar-App-Marketing-Calculator.xlsx');
  wb.write(filePath);

  console.log(`App marketing calculator spreadsheet created at: ${filePath}`);
}

// Main function
function main(): void {
  const calculatedData = calculateAppMarketingData(appMarketingData);
  generateAppMarketingSpreadsheet(calculatedData);
}

// Run the main function
main(); 