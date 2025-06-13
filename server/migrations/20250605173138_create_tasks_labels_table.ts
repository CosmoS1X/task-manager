import type { Knex } from 'knex';

export const up = (knex: Knex) => (
  knex.schema.createTable('tasks_labels', (table) => {
    table.increments('id').primary();
    table.integer('task_id').notNullable().references('id').inTable('tasks')
      .onDelete('CASCADE');
    table.integer('label_id').notNullable().references('id').inTable('labels');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  })
);

export const down = (knex: Knex) => knex.schema.dropTable('tasks_labels');
