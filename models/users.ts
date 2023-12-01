import { integer, primaryKey, sqliteTable } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";

export type AccountId = number & { __brand: "account_id" };
export type OperationId = number & { __brand: "operation_id" };

export const account = sqliteTable("accounts", {
  account_number: integer("id").$type<AccountId>().primaryKey(),
  salary: integer("salary").notNull().default(0),
});

// Contacts represent a directed relationship between two users.
export const contact = sqliteTable(
  "contacts",
  {
    // from -> to : (from, to) is the primary key
    from: integer("from")
      .$type<AccountId>()
      .notNull()
      .references(() => account.account_number),
    to: integer("to")
      .$type<AccountId>()
      .notNull()
      .references(() => account.account_number),
  },
  (table) => {
    return { pk: primaryKey({ columns: [table.from, table.to] }) };
  },
);

export const operation = sqliteTable("operations", {
  id: integer("id").$type<OperationId>().primaryKey(),
  date: integer("date").notNull(),
  amount: integer("amount").notNull(),
  sender_id: integer("sender_id")
    .$type<AccountId>()
    .notNull()
    .references(() => account.account_number),
  receiver_id: integer("receiver_id")
    .$type<AccountId>()
    .notNull()
    .references(() => account.account_number),
});

export type Account = typeof account.$inferSelect;
export type NewAccount = typeof account.$inferInsert;

export type Operation = typeof operation.$inferSelect;
export type NewOperation = typeof operation.$inferInsert;

// Runtime schema validation
export const selectAccountSchema = createSelectSchema(account);
