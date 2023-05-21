import { MigrationInterface, QueryRunner } from 'typeorm';

export class Application1684699436855 implements MigrationInterface {
  name = 'Application1684699436855';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "applications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "status" character varying NOT NULL DEFAULT 'wait_listed', "userId" uuid, "projectId" uuid, CONSTRAINT "PK_938c0a27255637bde919591888f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "FK_90ad8bec24861de0180f638b9cc" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "FK_19840be159549c33730e4393439" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "FK_19840be159549c33730e4393439"`,
    );
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "FK_90ad8bec24861de0180f638b9cc"`,
    );
    await queryRunner.query(`DROP TABLE "applications"`);
  }
}
