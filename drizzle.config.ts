import type { Config } from "drizzle-kit";

export default {
  schema: "./models/users.ts",
  out: "./drizzle",
} satisfies Config;
