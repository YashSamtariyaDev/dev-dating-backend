import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProfileFields1773304481956 implements MigrationInterface {
    name = 'AddProfileFields1773304481956'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`FK_22133395bd13b970ccd0c34ab22\` ON \`messages\``);
        await queryRunner.query(`DROP INDEX \`FK_5bb8108b85199f4ae096599917f\` ON \`messages\``);
        await queryRunner.query(`ALTER TABLE \`profiles\` ADD \`githubUsername\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`profiles\` ADD \`portfolioUrl\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`profiles\` ADD \`photoUrl\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`profiles\` ADD \`isAvailable\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`profiles\` DROP COLUMN \`isAvailable\``);
        await queryRunner.query(`ALTER TABLE \`profiles\` DROP COLUMN \`photoUrl\``);
        await queryRunner.query(`ALTER TABLE \`profiles\` DROP COLUMN \`portfolioUrl\``);
        await queryRunner.query(`ALTER TABLE \`profiles\` DROP COLUMN \`githubUsername\``);
        await queryRunner.query(`CREATE INDEX \`FK_5bb8108b85199f4ae096599917f\` ON \`messages\` (\`chat_room_id\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_22133395bd13b970ccd0c34ab22\` ON \`messages\` (\`sender_id\`)`);
    }

}
