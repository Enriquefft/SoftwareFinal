import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { Database } from "bun:sqlite";

const bunSqlite = new Database("sqlite.db");
const db = drizzle(bunSqlite);

migrate(db, { migrationsFolder: "drizzle" });
