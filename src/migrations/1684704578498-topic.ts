import { MigrationInterface, QueryRunner } from 'typeorm';

export class Topic1684704578498 implements MigrationInterface {
  name = 'Topic1684704578498';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "topics" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "title" character varying NOT NULL, "ownerId" uuid, CONSTRAINT "PK_e4aa99a3fa60ec3a37d1fc4e853" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "topics" ADD CONSTRAINT "FK_89f93153358e355abc3d976ab41" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "topics" DROP CONSTRAINT "FK_89f93153358e355abc3d976ab41"`,
    );
    await queryRunner.query(`DROP TABLE "topics"`);
  }
}
