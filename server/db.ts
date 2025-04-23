import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Set up WebSocket constructor for Neon
neonConfig.webSocketConstructor = ws;

// Check for DATABASE_URL but handle its absence gracefully
let pool: Pool | null = null;
let db: any = null;

// Function to initialize the database connection
export function initDatabase() {
  try {
    if (!process.env.DATABASE_URL) {
      console.warn("DATABASE_URL not set. Database functionality will be limited.");
      return false;
    }
    
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle(pool, { schema });
    console.log("Database connection initialized successfully");
    return true;
  } catch (error) {
    console.error("Failed to initialize database connection:", error);
    return false;
  }
}

// Initialize database on import
initDatabase();

// Export the pool and db objects
export { pool, db };