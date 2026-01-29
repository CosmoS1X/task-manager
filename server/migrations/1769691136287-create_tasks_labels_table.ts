import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTasksLabelsTable1769691136287 implements MigrationInterface {
  name = 'CreateTasksLabelsTable1769691136287';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "tasks_labels" ("id" SERIAL NOT NULL, "task_id" integer NOT NULL, "label_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_acd4701cf05ae7f12e3e5c42cf6" UNIQUE ("task_id", "label_id"), CONSTRAINT "PK_9dedae996ce51062275a149c804" PRIMARY KEY ("id"))');
    await queryRunner.query('ALTER TABLE "tasks_labels" ADD CONSTRAINT "FK_e986ac6be4ae097a105ae60780b" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "tasks_labels" ADD CONSTRAINT "FK_8a61f750a7acaa6933f944a7596" FOREIGN KEY ("label_id") REFERENCES "labels"("id") ON DELETE RESTRICT ON UPDATE NO ACTION');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "tasks_labels" DROP CONSTRAINT "FK_8a61f750a7acaa6933f944a7596"');
    await queryRunner.query('ALTER TABLE "tasks_labels" DROP CONSTRAINT "FK_e986ac6be4ae097a105ae60780b"');
    await queryRunner.query('DROP TABLE "tasks_labels"');
  }
}
