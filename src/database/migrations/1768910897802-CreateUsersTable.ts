import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1768910897802 implements MigrationInterface {
    name = 'CreateUsersTable1768910897802'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`role\` enum ('user', 'admin', 'super_admin') NOT NULL DEFAULT 'admin'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`role\``);
    }

}
