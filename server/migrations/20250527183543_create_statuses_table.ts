import type { Knex } from 'knex';

export const up = (knex: Knex) => (
  knex.schema.createTable('statuses', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable().unique();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  })
);

export const down = (knex: Knex) => knex.schema.dropTable('statuses');
