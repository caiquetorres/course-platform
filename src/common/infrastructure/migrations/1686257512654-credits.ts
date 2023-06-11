import { MigrationInterface, QueryRunner } from 'typeorm';

export class Credits1686257512654 implements MigrationInterface {
  name = 'Credits1686257512654';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "credits" integer`);
    await queryRunner.query(`UPDATE "users" SET "credits" = 0`);
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "credits" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "credits" SET DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "credits"`);
  }
}
