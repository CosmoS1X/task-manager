import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1769440371455 implements MigrationInterface {
  name = 'CreateUsersTable1769440371455';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "users" ("id" SERIAL NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "password_digest" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))',
    );
    await queryRunner.query('CREATE UNIQUE INDEX "IDX_USER_EMAIL" ON "users" ("email") ');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "public"."IDX_USER_EMAIL"');
    await queryRunner.query('DROP TABLE "users"');
  }
}
