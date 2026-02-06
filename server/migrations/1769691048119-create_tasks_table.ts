import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTasksTable1769691048119 implements MigrationInterface {
  name = 'CreateTasksTable1769691048119';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "tasks" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "status_id" integer NOT NULL, "creator_id" integer NOT NULL, "executor_id" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))');
    await queryRunner.query('ALTER TABLE "tasks" ADD CONSTRAINT "FK_e28288969fa7827bd12680cfe10" FOREIGN KEY ("status_id") REFERENCES "statuses"("id") ON DELETE RESTRICT ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "tasks" ADD CONSTRAINT "FK_f4cb489461bc751498a28852356" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "tasks" ADD CONSTRAINT "FK_dfa19206f84d97530851c2bfa5c" FOREIGN KEY ("executor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "tasks" DROP CONSTRAINT "FK_dfa19206f84d97530851c2bfa5c"');
    await queryRunner.query('ALTER TABLE "tasks" DROP CONSTRAINT "FK_f4cb489461bc751498a28852356"');
    await queryRunner.query('ALTER TABLE "tasks" DROP CONSTRAINT "FK_e28288969fa7827bd12680cfe10"');
    await queryRunner.query('DROP TABLE "tasks"');
  }
}
