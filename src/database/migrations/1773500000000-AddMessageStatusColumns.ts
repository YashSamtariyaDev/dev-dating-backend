import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMessageStatusColumns1773500000000 implements MigrationInterface {
  name = 'AddMessageStatusColumns1773500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `messages` ADD `status` enum('sent','delivered','read') NOT NULL DEFAULT 'sent'",
    );
    await queryRunner.query(
      'ALTER TABLE `messages` ADD `delivered_at` datetime NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `messages` ADD `read_at` datetime NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `messages` DROP COLUMN `read_at`');
    await queryRunner.query(
      'ALTER TABLE `messages` DROP COLUMN `delivered_at`',
    );
    await queryRunner.query('ALTER TABLE `messages` DROP COLUMN `status`');
  }
}
