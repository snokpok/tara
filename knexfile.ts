import type { Knex } from "knex";

// Update with your config settings.
require('dotenv').config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "mysql",
    connection: process.env.DATABASE_URL,
  },

  staging: {
    client: "mysql",
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
    client: "mysql",
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
