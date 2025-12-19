import "dotenv/config";
import { Pool } from "pg";
import fs from "fs";
import path from "path";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runMigrations() {
  const client = await pool.connect();

  try {
    console.log("Running migrations...");

    // Read the migration file
    const migrationPath = path.join(process.cwd(), "migrations", "001_create_auth_tables.sql");
    const migrationSQL = fs.readFileSync(migrationPath, "utf8");

    // Execute the migration
    await client.query(migrationSQL);

    console.log("✅ Migrations completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();