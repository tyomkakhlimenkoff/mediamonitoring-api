import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNewsTable1733184842925 implements MigrationInterface {
  public name = 'CreateNewsTable1733184842925';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "news" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "url" character varying NOT NULL,
        "title" character varying NOT NULL,
        CONSTRAINT "PK_news_id" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_UQ_news_url" ON "news" ("url")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_news_createdAt" ON "news" ("createdAt")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_news_createdAt"`);
    await queryRunner.query(`DROP INDEX "IDX_UQ_news_url"`);
    await queryRunner.query(`DROP TABLE "news"`);
  }
}
