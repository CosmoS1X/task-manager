import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStatusesTable1769507707372 implements MigrationInterface {
  name = 'CreateStatusesTable1769507707372';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "statuses" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_037e43ea842b18ce4e5f4dcfd06" UNIQUE ("name"), CONSTRAINT "PK_2fd3770acdb67736f1a3e3d5399" PRIMARY KEY ("id"))',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "statuses"');
  }
}
