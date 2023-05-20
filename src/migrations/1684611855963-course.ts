import { MigrationInterface, QueryRunner } from 'typeorm';

export class Course1684611855963 implements MigrationInterface {
  name = 'Course1684611855963';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "courses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying(32) NOT NULL, "price" integer NOT NULL, CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_course" ("usersId" uuid NOT NULL, "coursesId" uuid NOT NULL, CONSTRAINT "PK_2db0fb70722a3ed8164d0ecbe10" PRIMARY KEY ("usersId", "coursesId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9b8c59b63a61fae5a32d45f3b0" ON "user_course" ("usersId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_996c5f8cac2970e3024976ec8d" ON "user_course" ("coursesId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user_course" ADD CONSTRAINT "FK_9b8c59b63a61fae5a32d45f3b07" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_course" ADD CONSTRAINT "FK_996c5f8cac2970e3024976ec8d2" FOREIGN KEY ("coursesId") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_course" DROP CONSTRAINT "FK_996c5f8cac2970e3024976ec8d2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_course" DROP CONSTRAINT "FK_9b8c59b63a61fae5a32d45f3b07"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_996c5f8cac2970e3024976ec8d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9b8c59b63a61fae5a32d45f3b0"`,
    );
    await queryRunner.query(`DROP TABLE "user_course"`);
    await queryRunner.query(`DROP TABLE "courses"`);
  }
}
