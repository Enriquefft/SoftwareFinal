import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";

import * as models from "$models/users"; // A full import is needed to populate the db engine
import { z } from "zod";

const setup = (app: Elysia) => {
  // Set up CORS elysia plugin
  app.use(
    cors({
      origin: "*",
    }),
  );

  return app;
};

const ZContactsList = z.array(models.selectAccountSchema);

const EgetAccountContacts = new Elysia()
  .decorate("db", drizzle(new Database("sqlite.db"), { schema: models }))
  .get(
    "/account/contacts",
    async ({ query, db }) => {
      console.log("query", query);
      const { number } = query;

      const response: models.Account[] = await db.query.account.findMany({
        where: eq(models.account.account_number, number as models.AccountId),
      });

      if (response.length === 0) {
        throw new Error("No contacts found");
      }

      return ZContactsList.parse(response);
    },
    {
      query: t.Object({
        number: t.Number(),
      }),
      transform({ query }) {
        const number = +query.number;
        if (!Number.isNaN(number)) {
          query.number = number;
        }
      },
    },
  );

const EpostTransfer = new Elysia()
  .decorate("db", drizzle(new Database("sqlite.db"), { schema: models }))
  .post(
    "/transfer",
    async ({ query, db }) => {
      const { from_number, to_number, value } = query;

      const getWallet = async (number: models.AccountId) => {
        return await db.query.account.findFirst({
          columns: {
            account_number: true,
          },
          where: eq(models.account.account_number, number as models.AccountId),
        });
      };

      const from_wallet = await getWallet(from_number as models.AccountId);
      const to_wallet = await getWallet(to_number as models.AccountId);

      if (!from_wallet) {
        throw new Error("Sender account not found");
      }
      if (!to_wallet) {
        throw new Error("Receiver account not found");
      }

      const newOperation: models.NewOperation = {
        date: new Date().getDay(),
        id: Math.floor(Math.random() * 1000) as models.OperationId,
        amount: value,
        sender_id: from_wallet.account_number,
        receiver_id: to_wallet.account_number,
      };

      // insert to table operations
      try {
        await db.insert(models.operation).values(newOperation);
      } catch (error) {
        throw new Error("Error inserting operation");
      }
    },
    {
      query: t.Object({
        from_number: t.Number(),
        to_number: t.Number(),
        value: t.Number(),
      }),
      transform({ query }) {
        const from_number = +query.from_number;
        const to_number = +query.to_number;
        const value = +query.value;
        if (!Number.isNaN(from_number)) {
          query.from_number = from_number;
        }
        if (!Number.isNaN(to_number)) {
          query.to_number = to_number;
        }
        if (!Number.isNaN(value)) {
          query.value = value;
        }
      },
    },
  );

const EgetAccountHistory = new Elysia()
  .decorate("db", drizzle(new Database("sqlite.db"), { schema: models }))
  .get(
    "/account/history",
    async ({ query, db }) => {
      const response = await db.query.operation.findMany({
        where: eq(models.operation.sender_id, query.number as models.AccountId),
      });
      if (response.length === 0) {
        throw new Error("No operations found");
      }
    },
    {
      query: t.Object({
        number: t.Number(),
      }),
      transform({ query }) {
        const number: number = +query.number;
        if (!Number.isNaN(number)) {
          query.number = number;
        }
      },
    },
  );

const app = new Elysia()
  .use(
    swagger({
      path: "/v1/swagger",
    }),
  )
  .use(setup)
  .use(EgetAccountContacts)
  .use(EpostTransfer)
  .use(EgetAccountHistory);

// Set up the database
app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

// Export the endpoints for testing
export { EgetAccountContacts, EgetAccountHistory, EpostTransfer };
