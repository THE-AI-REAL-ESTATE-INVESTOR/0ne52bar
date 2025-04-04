import { analyze } from './index.mts';

const targetPath = process.argv[2];
if (!targetPath) {
  console.error('Please provide a target path');
  process.exit(1);
}

analyze({ targetPath, fix: process.argv.includes('--fix') })
  .then(result => {
    console.log('Analysis completed:');
    console.log(JSON.stringify(result, null, 2));
  })
  .catch(error => {
    console.error('Analysis failed:', error);
    process.exit(1);
  }); 