import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1685989927290 implements MigrationInterface {
  name = 'User1685989927290';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying(64) NOT NULL, "username" character varying(64) NOT NULL, "email" character varying(128) NOT NULL, "password" text NOT NULL, "roles" text NOT NULL, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "user_username" ON "users" ("username") `,
    );
    await queryRunner.query(`CREATE INDEX "user_email" ON "users" ("email") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."user_email"`);
    await queryRunner.query(`DROP INDEX "public"."user_username"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
