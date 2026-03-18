import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProfileFields1773304481956 implements MigrationInterface {
    name = 'AddProfileFields1773304481956'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("profiles");
        
        if (table) {
            if (!table.findColumnByName("githubUsername")) {
                await queryRunner.query(`ALTER TABLE \`profiles\` ADD \`githubUsername\` varchar(255) NULL`);
            }
            if (!table.findColumnByName("portfolioUrl")) {
                await queryRunner.query(`ALTER TABLE \`profiles\` ADD \`portfolioUrl\` varchar(255) NULL`);
            }
            if (!table.findColumnByName("photoUrl")) {
                await queryRunner.query(`ALTER TABLE \`profiles\` ADD \`photoUrl\` varchar(255) NULL`);
            }
            if (!table.findColumnByName("isAvailable")) {
                await queryRunner.query(`ALTER TABLE \`profiles\` ADD \`isAvailable\` tinyint NOT NULL DEFAULT 0`);
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("profiles");
        
        if (table) {
            if (table.findColumnByName("isAvailable")) {
                await queryRunner.query(`ALTER TABLE \`profiles\` DROP COLUMN \`isAvailable\``);
            }
            if (table.findColumnByName("photoUrl")) {
                await queryRunner.query(`ALTER TABLE \`profiles\` DROP COLUMN \`photoUrl\``);
            }
            if (table.findColumnByName("portfolioUrl")) {
                await queryRunner.query(`ALTER TABLE \`profiles\` DROP COLUMN \`portfolioUrl\``);
            }
            if (table.findColumnByName("githubUsername")) {
                await queryRunner.query(`ALTER TABLE \`profiles\` DROP COLUMN \`githubUsername\``);
            }
        }
    }

}
