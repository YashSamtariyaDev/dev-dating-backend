import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProfileTable1768974664832 implements MigrationInterface {
    name = 'CreateProfileTable1768974664832'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`profiles\` (\`id\` varchar(36) NOT NULL, \`bio\` varchar(255) NULL, \`gender\` enum ('male', 'female', 'other') NULL, \`lookingFor\` varchar(255) NULL, \`techStack\` json NULL, \`experienceLevel\` enum ('junior', 'mid', 'senior') NULL, \`githubUrl\` varchar(255) NULL, \`linkedinUrl\` varchar(255) NULL, \`location\` varchar(255) NULL, \`isComplete\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, UNIQUE INDEX \`REL_315ecd98bd1a42dcf2ec4e2e98\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`role\` \`role\` enum ('user', 'admin', 'super_admin') NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE \`profiles\` ADD CONSTRAINT \`FK_315ecd98bd1a42dcf2ec4e2e985\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`profiles\` DROP FOREIGN KEY \`FK_315ecd98bd1a42dcf2ec4e2e985\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`role\` \`role\` enum ('user', 'admin', 'super_admin') NOT NULL DEFAULT 'admin'`);
        await queryRunner.query(`DROP INDEX \`REL_315ecd98bd1a42dcf2ec4e2e98\` ON \`profiles\``);
        await queryRunner.query(`DROP TABLE \`profiles\``);
    }

}
