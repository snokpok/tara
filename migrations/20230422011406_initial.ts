import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("user", (table) => {
        table.increments('id');

    })
}


export async function down(knex: Knex): Promise<void> {
}

