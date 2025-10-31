import { Client } from 'pg';

// Ensures the target Postgres database exists. If missing, creates it using the 'postgres' database.
export async function ensureDatabaseExists(databaseUrl?: string) {
  if (!databaseUrl) return;

  try {
    const url = new URL(databaseUrl);
    const targetDb = url.pathname.replace(/^\//, '') || 'postgres';
    // Build admin connection string pointing to the default 'postgres' DB
    const adminUrl = new URL(databaseUrl);
    adminUrl.pathname = '/postgres';

    const adminClient = new Client({
      connectionString: adminUrl.toString(),
      ssl: { rejectUnauthorized: false },
    });

    await adminClient.connect();

    const existsRes = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [targetDb],
    );

    if (existsRes.rowCount === 0) {
      await adminClient.query(`CREATE DATABASE "${targetDb}"`);
    }

    await adminClient.end();
  } catch (err) {
    // Do not crash the app on ensure failure; TypeORM will fail later if truly unreachable
    // You can enable TypeORM logging to debug connection issues if needed
  }
}
