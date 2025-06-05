import type { Knex } from 'knex';

export const up = (knex: Knex) => (
  knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.text('description');
    table.integer('status_id').notNullable().references('id').inTable('statuses');
    table.integer('creator_id').notNullable().references('id').inTable('users');
    table.integer('executor_id').references('id').inTable('users');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  })
);

export const down = (knex: Knex) => knex.schema.dropTable('tasks');
