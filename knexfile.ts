import type { Knex } from "knex";

// Update with your config settings.
require('dotenv').config();

const client = "pg"

const config: { [key: string]: Knex.Config } = {
  development: {
    client,
    connection: process.env.DATABASE_URL,
  },

  staging: {
    client,
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  production: {
    client,
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }

};

module.exports = config;
