import { beforeEach, describe, expect, it } from "@jest/globals";
import * as models from "$models/users"; // A full import is needed to populate the db engine

import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

import {
  EgetAccountContacts,
  EgetAccountHistory,
  EpostTransfer,
} from "src/index";

const db = new Database(":memory:");

const TgetAccountContacts = EgetAccountContacts.decorate(
  "db",
  drizzle(db, { schema: models }),
);
const TgetAccountHistory = EgetAccountHistory.decorate(
  "db",
  drizzle(db, { schema: models }),
);
const TpostTransfer = EpostTransfer.decorate(
  "db",
  drizzle(db, { schema: models }),
);

beforeEach(async () => {});

describe("handler", () => {
  it("Should not support a query by district, categories and store", async () => {});
});
