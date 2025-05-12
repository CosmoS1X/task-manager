import type { Knex } from 'knex';

export const up = (knex: Knex) => (
  knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('email').notNullable().unique();
    table.string('password_digest').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  })
);

export const down = (knex: Knex) => knex.schema.dropTable('users');
