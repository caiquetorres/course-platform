import { MigrationInterface, QueryRunner } from 'typeorm';

export class Coins1686257512654 implements MigrationInterface {
  name = 'Coins1686257512654';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "coins" integer`);
    await queryRunner.query(`UPDATE "users" SET "coins" = 0`);
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "coins" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "coins" SET DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "coins"`);
  }
}
