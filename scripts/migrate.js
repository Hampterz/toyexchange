import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationDir = path.join(__dirname, '..', 'migrations');

// Create migrations directory if it doesn't exist
if (!fs.existsSync(migrationDir)) {
  fs.mkdirSync(migrationDir, { recursive: true });
}

// First, generate migration files
console.log('Generating migration files...');
exec('npx drizzle-kit generate:pg --schema=./shared/schema.ts --out=./migrations', async (error, stdout, stderr) => {
  if (error) {
    console.error(`Error generating migration files: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`stderr: ${stderr}`);
  }
  
  console.log(stdout);
  console.log('Migration files generated');

  // Then, apply the migrations
  console.log('Applying migrations...');
  
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable not set');
    return;
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);
  
  try {
    await migrate(db, { migrationsFolder: migrationDir });
    console.log('Migrations applied successfully');
  } catch (err) {
    console.error('Error applying migrations:', err);
  } finally {
    await pool.end();
  }
});