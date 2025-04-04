import { getNextVersion, createVersionedCopy } from './versioning';
import { getConfig } from '@/config';
import path from 'path';

const VERSIONS_DIR = path.join(process.cwd(), 'src', 'versions');
const CURRENT_VERSION = path.join(process.cwd(), 'src', 'utils', 'current-version.ts');

async function main() {
  const nextVersion = await getNextVersion(VERSIONS_DIR);
  await createVersionedCopy(CURRENT_VERSION, nextVersion, VERSIONS_DIR);
}

main().catch(console.error); 