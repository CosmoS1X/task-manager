import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLabelsTable1769511986326 implements MigrationInterface {
  name = 'CreateLabelsTable1769511986326';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "labels" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_543605929e5ebe08eeeab493f60" UNIQUE ("name"), CONSTRAINT "PK_c0c4e97f76f1f3a268c7a70b925" PRIMARY KEY ("id"))',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "labels"');
  }
}
