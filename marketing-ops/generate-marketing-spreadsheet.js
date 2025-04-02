const Excel = require('excel4node');
const path = require('path');

// Create a new workbook and a worksheet
const wb = new Excel.Workbook();
const ws = wb.addWorksheet('Marketing Campaign Calculator');

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
ws.column(1).setWidth(30);
ws.column(2).setWidth(20);
ws.column(3).setWidth(20);
ws.column(4).setWidth(20);
ws.column(5).setWidth(20);

// Add title
ws.cell(1, 1, 1, 5, true).string('ONE-52 Bar & Grill Marketing Campaign Calculator').style(headerStyle);

// Add section headers
ws.cell(3, 1, 3, 5, true).string('Campaign Parameters').style(headerStyle);
ws.cell(12, 1, 12, 5, true).string('Weekly Calculations').style(headerStyle);
ws.cell(20, 1, 20, 5, true).string('Monthly Calculations').style(headerStyle);
ws.cell(28, 1, 28, 5, true).string('Annual Calculations').style(headerStyle);
ws.cell(36, 1, 36, 5, true).string('Additional Revenue Considerations').style(headerStyle);
ws.cell(44, 1, 44, 5, true).string('Break-Even Analysis').style(headerStyle);

// Add campaign parameters
ws.cell(4, 1).string('Parameter').style(headerStyle);
ws.cell(4, 2).string('Value').style(headerStyle);
ws.cell(4, 3).string('Unit').style(headerStyle);
ws.cell(4, 4).string('Notes').style(headerStyle);

// Initial campaign parameters
ws.cell(5, 1).string('Available Stamps').style(inputStyle);
ws.cell(5, 2).number(2000).style(inputStyle);
ws.cell(5, 3).string('stamps').style(inputStyle);
ws.cell(5, 4).string('Current inventory').style(inputStyle);

ws.cell(6, 1).string('Cost per Stamp').style(inputStyle);
ws.cell(6, 2).number(0.56).style(inputStyle);
ws.cell(6, 3).string('$').style(inputStyle);
ws.cell(6, 4).string('Current USPS postcard rate').style(inputStyle);

ws.cell(7, 1).string('Weekly Target Recipients').style(inputStyle);
ws.cell(7, 2).number(500).style(inputStyle);
ws.cell(7, 3).string('households').style(inputStyle);
ws.cell(7, 4).string('Number of mailers sent per week').style(inputStyle);

ws.cell(8, 1).string('Conversion Rate').style(inputStyle);
ws.cell(8, 2).number(0.05).style(inputStyle);
ws.cell(8, 3).string('%').style(inputStyle);
ws.cell(8, 4).string('Percentage of recipients who become customers').style(inputStyle);

ws.cell(9, 1).string('Current Weekly Revenue').style(inputStyle);
ws.cell(9, 2).number(8000).style(inputStyle);
ws.cell(9, 3).string('$').style(inputStyle);
ws.cell(9, 4).string('Current baseline revenue').style(inputStyle);

ws.cell(10, 1).string('Average Customer Value').style(inputStyle);
ws.cell(10, 2).number(50).style(inputStyle);
ws.cell(10, 3).string('$').style(inputStyle);
ws.cell(10, 4).string('Average spend per customer').style(inputStyle);

// Weekly calculations
ws.cell(13, 1).string('Metric').style(headerStyle);
ws.cell(13, 2).string('Value').style(headerStyle);
ws.cell(13, 3).string('Formula').style(headerStyle);
ws.cell(13, 4).string('Notes').style(headerStyle);

ws.cell(14, 1).string('Recipients').style(resultStyle);
ws.cell(14, 2).string('=B7').style(resultStyle);
ws.cell(14, 3).string('Weekly target recipients').style(resultStyle);
ws.cell(14, 4).string('Number of mailers sent per week').style(resultStyle);

ws.cell(15, 1).string('New Customers').style(resultStyle);
ws.cell(15, 2).string('=B14*B8').style(resultStyle);
ws.cell(15, 3).string('Recipients × Conversion Rate').style(resultStyle);
ws.cell(15, 4).string('Expected new customers per week').style(resultStyle);

ws.cell(16, 1).string('Weekly Revenue from New Customers').style(resultStyle);
ws.cell(16, 2).string('=B15*B10').style(resultStyle);
ws.cell(16, 3).string('New Customers × Average Customer Value').style(resultStyle);
ws.cell(16, 4).string('Additional revenue from new customers').style(resultStyle);

ws.cell(17, 1).string('Total Weekly Revenue with New Customers').style(resultStyle);
ws.cell(17, 2).string('=B9+B16').style(resultStyle);
ws.cell(17, 3).string('Current Weekly Revenue + Weekly Revenue from New Customers').style(resultStyle);
ws.cell(17, 4).string('Total expected weekly revenue').style(resultStyle);

ws.cell(18, 1).string('Weekly Stamp Cost').style(resultStyle);
ws.cell(18, 2).string('=B14*B6').style(resultStyle);
ws.cell(18, 3).string('Recipients × Cost per Stamp').style(resultStyle);
ws.cell(18, 4).string('Cost of stamps for weekly campaign').style(resultStyle);

ws.cell(19, 1).string('Net Weekly Revenue (after stamp cost)').style(resultStyle);
ws.cell(19, 2).string('=B17-B18').style(resultStyle);
ws.cell(19, 3).string('Total Weekly Revenue - Weekly Stamp Cost').style(resultStyle);
ws.cell(19, 4).string('Net revenue after campaign costs').style(resultStyle);

// Monthly calculations
ws.cell(21, 1).string('Metric').style(headerStyle);
ws.cell(21, 2).string('Value').style(headerStyle);
ws.cell(21, 3).string('Formula').style(headerStyle);
ws.cell(21, 4).string('Notes').style(headerStyle);

ws.cell(22, 1).string('Recipients').style(resultStyle);
ws.cell(22, 2).string('=B7*4').style(resultStyle);
ws.cell(22, 3).string('Weekly Recipients × 4').style(resultStyle);
ws.cell(22, 4).string('Number of mailers sent per month').style(resultStyle);

ws.cell(23, 1).string('New Customers').style(resultStyle);
ws.cell(23, 2).string('=B22*B8').style(resultStyle);
ws.cell(23, 3).string('Recipients × Conversion Rate').style(resultStyle);
ws.cell(23, 4).string('Expected new customers per month').style(resultStyle);

ws.cell(24, 1).string('Monthly Revenue from New Customers').style(resultStyle);
ws.cell(24, 2).string('=B23*B10').style(resultStyle);
ws.cell(24, 3).string('New Customers × Average Customer Value').style(resultStyle);
ws.cell(24, 4).string('Additional revenue from new customers').style(resultStyle);

ws.cell(25, 1).string('Total Monthly Revenue with New Customers').style(resultStyle);
ws.cell(25, 2).string('=B9*4+B24').style(resultStyle);
ws.cell(25, 3).string('(Current Weekly Revenue × 4) + Monthly Revenue from New Customers').style(resultStyle);
ws.cell(25, 4).string('Total expected monthly revenue').style(resultStyle);

ws.cell(26, 1).string('Monthly Stamp Cost').style(resultStyle);
ws.cell(26, 2).string('=B22*B6').style(resultStyle);
ws.cell(26, 3).string('Recipients × Cost per Stamp').style(resultStyle);
ws.cell(26, 4).string('Cost of stamps for monthly campaign').style(resultStyle);

ws.cell(27, 1).string('Net Monthly Revenue (after stamp cost)').style(resultStyle);
ws.cell(27, 2).string('=B25-B26').style(resultStyle);
ws.cell(27, 3).string('Total Monthly Revenue - Monthly Stamp Cost').style(resultStyle);
ws.cell(27, 4).string('Net revenue after campaign costs').style(resultStyle);

// Annual calculations
ws.cell(29, 1).string('Metric').style(headerStyle);
ws.cell(29, 2).string('Value').style(headerStyle);
ws.cell(29, 3).string('Formula').style(headerStyle);
ws.cell(29, 4).string('Notes').style(headerStyle);

ws.cell(30, 1).string('Recipients').style(resultStyle);
ws.cell(30, 2).string('=B7*52').style(resultStyle);
ws.cell(30, 3).string('Weekly Recipients × 52').style(resultStyle);
ws.cell(30, 4).string('Number of mailers sent per year').style(resultStyle);

ws.cell(31, 1).string('New Customers').style(resultStyle);
ws.cell(31, 2).string('=B30*B8').style(resultStyle);
ws.cell(31, 3).string('Recipients × Conversion Rate').style(resultStyle);
ws.cell(31, 4).string('Expected new customers per year').style(resultStyle);

ws.cell(32, 1).string('Annual Revenue from New Customers').style(resultStyle);
ws.cell(32, 2).string('=B31*B10').style(resultStyle);
ws.cell(32, 3).string('New Customers × Average Customer Value').style(resultStyle);
ws.cell(32, 4).string('Additional revenue from new customers').style(resultStyle);

ws.cell(33, 1).string('Total Annual Revenue with New Customers').style(resultStyle);
ws.cell(33, 2).string('=B9*52+B32').style(resultStyle);
ws.cell(33, 3).string('(Current Weekly Revenue × 52) + Annual Revenue from New Customers').style(resultStyle);
ws.cell(33, 4).string('Total expected annual revenue').style(resultStyle);

ws.cell(34, 1).string('Annual Stamp Cost').style(resultStyle);
ws.cell(34, 2).string('=B30*B6').style(resultStyle);
ws.cell(34, 3).string('Recipients × Cost per Stamp').style(resultStyle);
ws.cell(34, 4).string('Cost of stamps for annual campaign').style(resultStyle);

ws.cell(35, 1).string('Net Annual Revenue').style(resultStyle);
ws.cell(35, 2).string('=B33-B34').style(resultStyle);
ws.cell(35, 3).string('Total Annual Revenue - Annual Stamp Cost').style(resultStyle);
ws.cell(35, 4).string('Net revenue after campaign costs').style(resultStyle);

// Additional Revenue Considerations
ws.cell(37, 1).string('Metric').style(headerStyle);
ws.cell(37, 2).string('Value').style(headerStyle);
ws.cell(37, 3).string('Formula').style(headerStyle);
ws.cell(37, 4).string('Notes').style(headerStyle);

ws.cell(38, 1).string('Repeat Customer Rate').style(resultStyle);
ws.cell(38, 2).number(0.5).style(resultStyle);
ws.cell(38, 3).string('50%').style(resultStyle);
ws.cell(38, 4).string('Percentage of new customers who return').style(resultStyle);

ws.cell(39, 1).string('Repeat Visits per Customer').style(resultStyle);
ws.cell(39, 2).number(3).style(resultStyle);
ws.cell(39, 3).string('visits/year').style(resultStyle);
ws.cell(39, 4).string('Average number of repeat visits per year').style(resultStyle);

ws.cell(40, 1).string('Additional Annual Revenue from Repeat Customers').style(resultStyle);
ws.cell(40, 2).string('=B31*B39*B10*B38').style(resultStyle);
ws.cell(40, 3).string('New Customers × Repeat Visits × Avg Value × Repeat Rate').style(resultStyle);
ws.cell(40, 4).string('Additional revenue from repeat customers').style(resultStyle);

ws.cell(41, 1).string('Net Annual Revenue with Repeat Customers').style(resultStyle);
ws.cell(41, 2).string('=B35+B40').style(resultStyle);
ws.cell(41, 3).string('Net Annual Revenue + Additional Revenue from Repeat Customers').style(resultStyle);
ws.cell(41, 4).string('Total revenue including repeat customers').style(resultStyle);

ws.cell(42, 1).string('Word-of-Mouth Effect').style(resultStyle);
ws.cell(42, 2).number(1).style(resultStyle);
ws.cell(42, 3).string('customers').style(resultStyle);
ws.cell(42, 4).string('Additional customers brought by each new customer').style(resultStyle);

ws.cell(43, 1).string('Additional Annual Revenue from Word-of-Mouth').style(resultStyle);
ws.cell(43, 2).string('=B31*B42*B10').style(resultStyle);
ws.cell(43, 3).string('New Customers × Word-of-Mouth Effect × Avg Value').style(resultStyle);
ws.cell(43, 4).string('Additional revenue from word-of-mouth referrals').style(resultStyle);

// Break-Even Analysis
ws.cell(45, 1).string('Metric').style(headerStyle);
ws.cell(45, 2).string('Value').style(headerStyle);
ws.cell(45, 3).string('Formula').style(headerStyle);
ws.cell(45, 4).string('Notes').style(headerStyle);

ws.cell(46, 1).string('Required New Customers to Break Even').style(resultStyle);
ws.cell(46, 2).string('=B34/B10').style(resultStyle);
ws.cell(46, 3).string('Annual Stamp Cost ÷ Average Customer Value').style(resultStyle);
ws.cell(46, 4).string('Number of new customers needed to cover stamp costs').style(resultStyle);

ws.cell(47, 1).string('Required Conversion Rate to Break Even').style(resultStyle);
ws.cell(47, 2).string('=B46/B30').style(resultStyle);
ws.cell(47, 3).string('Required New Customers ÷ Recipients').style(resultStyle);
ws.cell(47, 4).string('Conversion rate needed to break even').style(resultStyle);

// Add instructions
ws.cell(49, 1, 49, 5, true).string('INSTRUCTIONS: Edit the values in the "Value" column to see how changes affect your marketing campaign results.').style({
  font: {
    bold: true,
    italic: true,
  },
  fill: {
    type: 'pattern',
    pattern: 'solid',
    fgColor: '#FFFFCC',
  },
  alignment: {
    horizontal: 'center',
    vertical: 'center',
    wrapText: true,
  },
});

// Save the workbook
const filePath = path.join(__dirname, 'ONE52-Marketing-Campaign-Calculator.xlsx');
wb.write(filePath);

console.log(`Marketing campaign calculator spreadsheet created at: ${filePath}`); 