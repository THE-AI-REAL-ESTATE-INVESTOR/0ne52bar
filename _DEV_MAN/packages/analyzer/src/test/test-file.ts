// Test TypeScript file for analysis

import { Workbook } from 'exceljs';

interface TestData {
  name: string;
  value: number;
}

function calculateTotal(data: TestData[]): number {
  return data.reduce((sum, item) => sum + item.value, 0);
}

function processData(data: TestData[]): TestData[] {
  return data.map(item => ({
    ...item,
    value: item.value * 2
  }));
}

class TestClass {
  private data: TestData[];

  constructor(data: TestData[]) {
    this.data = data;
  }

  public getTotal(): number {
    return calculateTotal(this.data);
  }

  public process(): TestData[] {
    return processData(this.data);
  }
}

// Test function with type annotations
function testFunction(param1: number, param2: number): number {
  if (param1 > param2) {
    return param1;
  } else {
    return param2;
  }
}

class TestClass {
  constructor() {
    this.value = 0
  }

  increment() {
    this.value++
  }
}

// Missing type annotations and imports
const result = testFunction(5, 10)
console.log(result) 