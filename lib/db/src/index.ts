import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.FERLO_POSTGRES_URL ||
  process.env.FERLO_DATABASE_URL ||
  process.env.FERLO_POSTGRES_PRISMA_URL;

if (!connectionString) {
  throw new Error(
    "POSTGRES_URL (or DATABASE_URL) must be set. Did you forget to provision a database?",
  );
}

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });

export * from "./schema";
