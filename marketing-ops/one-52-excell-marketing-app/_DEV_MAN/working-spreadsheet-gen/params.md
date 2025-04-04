# Direct Mail Growth Projection Parameters

## Parameter Connections

The Direct Mail Growth Projection calculations are based on the following parameters from the Direct Mail Parameters worksheet:

1. **Available Stamps** (default: 2000)
   - Total stamps available for the campaign
   - Used to calculate budget constraints

2. **Cost per Stamp** (default: $0.56)
   - Cost per stamp including printing
   - Used to calculate weekly, monthly, and annual stamp costs

3. **Weekly Target Recipients** (default: 500)
   - Number of recipients per week
   - Base for all calculations
   - Multiplied by conversion rate to get new customers

4. **Conversion Rate** (default: 0.05%)
   - Expected conversion rate (currently hardcoded to 0.0005)
   - Applied to weekly target recipients to calculate new customers
   - Should be editable in the spreadsheet

5. **Current Weekly Revenue** (default: $8000)
   - Current weekly revenue before campaign
   - Added to new customer revenue for total revenue calculations

6. **Average Customer Value** (default: $50)
   - Average revenue per customer
   - Multiplied by new customers to calculate revenue

## Calculation Flow

1. **Weekly Calculations**:
   ```
   recipients = weeklyTargetRecipients
   newCustomers = recipients * conversionRate
   weeklyRevenueFromNewCustomers = newCustomers * averageCustomerValue
   totalWeeklyRevenueWithNewCustomers = currentWeeklyRevenue + weeklyRevenueFromNewCustomers
   weeklyStampCost = recipients * costPerStamp
   netWeeklyRevenue = totalWeeklyRevenueWithNewCustomers - weeklyStampCost
   ```

2. **Monthly Calculations**:
   ```
   recipients = weeklyTargetRecipients * 4
   newCustomers = recipients * conversionRate
   monthlyRevenueFromNewCustomers = newCustomers * averageCustomerValue
   totalMonthlyRevenueWithNewCustomers = (currentWeeklyRevenue * 4) + monthlyRevenueFromNewCustomers
   monthlyStampCost = recipients * costPerStamp
   netMonthlyRevenue = totalMonthlyRevenueWithNewCustomers - monthlyStampCost
   ```

3. **Annual Calculations**:
   ```
   recipients = weeklyTargetRecipients * 52
   newCustomers = recipients * conversionRate
   annualRevenueFromNewCustomers = newCustomers * averageCustomerValue
   totalAnnualRevenueWithNewCustomers = (currentWeeklyRevenue * 52) + annualRevenueFromNewCustomers
   annualStampCost = recipients * costPerStamp
   netAnnualRevenue = totalAnnualRevenueWithNewCustomers - annualStampCost
   ```

## Current Issues

1. The conversion rate is currently hardcoded to 0.0005 (0.05%) in the code and not properly connected to the editable parameter in the spreadsheet.

2. The calculations are not automatically updating when the parameters are changed in the spreadsheet.

3. The connection between the Direct Mail Parameters worksheet and the Direct Mail Growth Projection worksheet needs to be established through formulas rather than static values.

## Required Changes

1. Make the conversion rate editable in the spreadsheet and properly connected to calculations
2. Implement proper Excel formulas in the Direct Mail Growth Projection worksheet to reference the parameters
3. Ensure all calculations update automatically when parameters change
4. Add validation to ensure parameters stay within reasonable ranges 