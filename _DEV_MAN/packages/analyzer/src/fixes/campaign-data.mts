import { promises as fs } from 'fs';
import path from 'path';
import { getFullPath } from '../config.mts';
import { VersionUpdate } from '@/types/types.mts';

interface CampaignDataAnalysisResult {
  typeIssues: string[];
  structureIssues: string[];
  validationIssues: string[];
  formulaIssues: string[];
}

interface CampaignDataFix {
  name: string;
  changes: {
    type: 'type' | 'structure' | 'validation' | 'formula';
    description: string;
    fix: string;
  }[];
}

interface CampaignDataTemplate {
  name: string;
  properties: {
    name: string;
    type: string;
    validation?: string;
    formula?: string;
  }[];
}

const EXPECTED_TEMPLATES: CampaignDataTemplate[] = [
  {
    name: 'MarketingCampaignData',
    properties: [
      { name: 'campaignParameters', type: 'CampaignParameters' },
      { name: 'weeklyCalculations', type: 'WeeklyCalculations' },
      { name: 'monthlyCalculations', type: 'MonthlyCalculations' },
      { name: 'annualCalculations', type: 'AnnualCalculations' },
      { name: 'appMetrics', type: 'AppMetrics' },
      { name: 'revenueImpact', type: 'RevenueImpact' }
    ]
  }
];

export async function analyzeCampaignData(): Promise<CampaignDataAnalysisResult> {
  const result: CampaignDataAnalysisResult = {
    typeIssues: [],
    structureIssues: [],
    validationIssues: [],
    formulaIssues: []
  };

  try {
    const dataDir = getFullPath('src/data/campaigns');
    const files = await fs.readdir(dataDir);

    for (const file of files) {
      if (file.endsWith('.ts')) {
        const content = await fs.readFile(path.join(dataDir, file), 'utf-8');
        
        for (const template of EXPECTED_TEMPLATES) {
          if (content.includes(template.name)) {
            // Check property definitions
            for (const prop of template.properties) {
              if (!content.includes(prop.name)) {
                result.structureIssues.push(`Missing required property: ${prop.name}`);
              }
              if (!content.includes(prop.type)) {
                result.typeIssues.push(`Missing type definition for ${prop.name}`);
              }
              if (prop.validation && !content.includes(prop.validation)) {
                result.validationIssues.push(`Missing validation for ${prop.name}`);
              }
              if (prop.formula && !content.includes(prop.formula)) {
                result.formulaIssues.push(`Missing formula for ${prop.name}`);
              }
            }
          }
        }
      }
    }

    return result;
  } catch (error) {
    console.error('Error analyzing campaign data:', error);
    throw error;
  }
}

export async function fixCampaignData(): Promise<CampaignDataFix[]> {
  const fixes: CampaignDataFix[] = [];

  try {
    const dataDir = getFullPath('src/data/campaigns');
    const files = await fs.readdir(dataDir);

    for (const file of files) {
      if (file.endsWith('.ts')) {
        const filePath = path.join(dataDir, file);
        let content = await fs.readFile(filePath, 'utf-8');
        const fileFixes: CampaignDataFix = {
          name: file,
          changes: []
        };

        for (const template of EXPECTED_TEMPLATES) {
          if (content.includes(template.name)) {
            // Fix property definitions
            const propFix = `interface ${template.name} {\n${template.properties.map(prop => 
              `  ${prop.name}: ${prop.type};`
            ).join('\n')}\n}`;
            
            if (!content.includes(propFix)) {
              content = content.replace(
                /interface\s+MarketingCampaignData\s*\{([^}]+)\}/,
                propFix
              );
              fileFixes.changes.push({
                type: 'structure',
                description: `Updated property definitions for ${template.name}`,
                fix: propFix
              });
            }

            // Fix validation
            for (const prop of template.properties) {
              if (prop.validation && !content.includes(prop.validation)) {
                const validationFix = `function validate${prop.name}(data: ${prop.type}): boolean {\n  return ${prop.validation};\n}`;
                content += `\n${validationFix}\n`;
                fileFixes.changes.push({
                  type: 'validation',
                  description: `Added validation for ${prop.name}`,
                  fix: validationFix
                });
              }
            }

            // Fix formulas
            for (const prop of template.properties) {
              if (prop.formula && !content.includes(prop.formula)) {
                const formulaFix = `function calculate${prop.name}(data: ${prop.type}): number {\n  return ${prop.formula};\n}`;
                content += `\n${formulaFix}\n`;
                fileFixes.changes.push({
                  type: 'formula',
                  description: `Added formula for ${prop.name}`,
                  fix: formulaFix
                });
              }
            }
          }
        }

        if (fileFixes.changes.length > 0) {
          await fs.writeFile(filePath, content);
          fixes.push(fileFixes);
        }
      }
    }

    // Save fixes report
    const outputDir = path.join(process.cwd(), 'output');
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(
      path.join(outputDir, 'campaign-data-fixes.json'),
      JSON.stringify(fixes, null, 2)
    );

    return fixes;
  } catch (error) {
    console.error('Error fixing campaign data:', error);
    throw error;
  }
}

// Main execution
if (require.main === module) {
  const isFixMode = process.argv.includes('--fix');
  
  if (isFixMode) {
    fixCampaignData()
      .then(fixes => {
        console.log('Campaign data fixes completed:');
        console.log(JSON.stringify(fixes, null, 2));
      })
      .catch(error => console.error('Campaign data fixes failed:', error));
  } else {
    analyzeCampaignData()
      .then(result => {
        console.log('Campaign data analysis completed:');
        console.log(JSON.stringify(result, null, 2));
      })
      .catch(error => console.error('Campaign data analysis failed:', error));
  }
} 