import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { resolve } from 'node:path';
import { dirname } from 'path';
import postgres from 'postgres';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import * as schema from './schema';

let db: PostgresJsDatabase<typeof schema>;
export function createOrGetDb() {
  if (db) {
    return db;
  }

  const dbUrl: string = process.env.DATABASE_URL!;
  const config: Record<string, unknown> = {};
  if (process.env.NODE_ENV === 'production') {
    config.ssl = 'require';
  }

  const client = postgres(dbUrl, config);

  db = drizzle(client, { schema });
  return db;
}

export async function migrateLatest() {
  console.log('Running migrations...');
  const dbUrl: string = process.env.DATABASE_URL!;
  // XXX(Phong): postgres v15 needs ssl=require, disable this on local postgres
  const config: Record<string, unknown> = {
    max: 1,
  };
  if (process.env.NODE_ENV === 'production') {
    config.ssl = 'require';
  }
  const client = postgres(dbUrl, config);

  const db = drizzle(client);
  // XXX(Phong): if you change `process.cwd()`, you need to change Dockerfile
  const dbDir = resolve(__dirname, 'migrations');
  await migrate(db, {
    migrationsFolder: dbDir,
  });
  console.log('Migrations completed successfully');
  client.end(); // XXX(Phong): postgres-js
}
