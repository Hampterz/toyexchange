// ES module compatible path utilities
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = dirname(__dirname);

// Export ES module compatible paths
export const paths = {
  root: rootDir,
  client: join(rootDir, 'client'),
  clientSrc: join(rootDir, 'client', 'src'),
  shared: join(rootDir, 'shared'),
  assets: join(rootDir, 'attached_assets'),
  dist: join(rootDir, 'dist', 'public'),
};

export default paths;